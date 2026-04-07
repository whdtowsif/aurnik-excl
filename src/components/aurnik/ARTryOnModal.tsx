"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Camera,
  CameraOff,
  Move,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Download,
  Share2,
  FlipHorizontal,
  Loader2,
  Shirt,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ARTryOnModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: string;
    name: string;
    imageUrl?: string | null;
    category: string;
  } | null;
}

export default function ARTryOnModal({ isOpen, onClose, product }: ARTryOnModalProps) {
  const [hasCamera, setHasCamera] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");

  // AR overlay state
  const [overlayPosition, setOverlayPosition] = useState({ x: 50, y: 40 });
  const [overlayScale, setOverlayScale] = useState(1);
  const [overlayRotation, setOverlayRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Check camera availability
  useEffect(() => {
    if (typeof navigator !== "undefined" && navigator.mediaDevices) {
      navigator.mediaDevices
        .enumerateDevices()
        .then((devices) => {
          const hasVideoInput = devices.some((device) => device.kind === "videoinput");
          setHasCamera(hasVideoInput);
        })
        .catch(() => setHasCamera(false));
    }
  }, []);

  // Start camera
  const startCamera = useCallback(async () => {
    if (!hasCamera) {
      setCameraError("No camera detected on this device");
      return;
    }

    setIsInitializing(true);
    setCameraError(null);

    try {
      // Stop any existing stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setCameraActive(true);
      }
    } catch (error: unknown) {
      console.error("Camera error:", error);
      if (error instanceof Error) {
        if (error.name === "NotAllowedError") {
          setCameraError("Camera access denied. Please allow camera access in your browser settings.");
        } else if (error.name === "NotFoundError") {
          setCameraError("Camera not found. Please connect a camera and try again.");
        } else {
          setCameraError("Failed to access camera. Please try again.");
        }
      } else {
        setCameraError("An unknown error occurred while accessing the camera.");
      }
    } finally {
      setIsInitializing(false);
    }
  }, [hasCamera, facingMode]);

  // Stop camera
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  }, []);

  // Toggle camera
  const toggleCamera = () => {
    if (cameraActive) {
      stopCamera();
    } else {
      startCamera();
    }
  };

  // Flip camera (front/back)
  const flipCamera = async () => {
    stopCamera();
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
    setTimeout(() => startCamera(), 100);
  };

  // Handle dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    }
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = ((e.clientX - dragStart.x) / window.innerWidth) * 100;
      const deltaY = ((e.clientY - dragStart.y) / window.innerHeight) * 100;
      setOverlayPosition((prev) => ({
        x: Math.max(0, Math.min(100, prev.x + deltaX)),
        y: Math.max(0, Math.min(100, prev.y + deltaY)),
      }));
      setDragStart({ x: e.clientX, y: e.clientY });
    },
    [isDragging, dragStart]
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDragging || e.touches.length !== 1) return;
      const touch = e.touches[0];
      const deltaX = ((touch.clientX - dragStart.x) / window.innerWidth) * 100;
      const deltaY = ((touch.clientY - dragStart.y) / window.innerHeight) * 100;
      setOverlayPosition((prev) => ({
        x: Math.max(0, Math.min(100, prev.x + deltaX)),
        y: Math.max(0, Math.min(100, prev.y + deltaY)),
      }));
      setDragStart({ x: touch.clientX, y: touch.clientY });
    },
    [isDragging, dragStart]
  );

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleDragEnd);
      window.addEventListener("touchmove", handleTouchMove);
      window.addEventListener("touchend", handleDragEnd);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleDragEnd);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleDragEnd);
    };
  }, [isDragging, handleMouseMove, handleTouchMove, handleDragEnd]);

  // Capture photo
  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current || !cameraActive) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Draw overlay if exists
    if (product?.imageUrl) {
      const img = new window.Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const imgWidth = (img.width * overlayScale * 0.5);
        const imgHeight = (img.height * overlayScale * 0.5);
        const x = (overlayPosition.x / 100) * canvas.width - imgWidth / 2;
        const y = (overlayPosition.y / 100) * canvas.height - imgHeight / 2;

        ctx.save();
        ctx.translate(x + imgWidth / 2, y + imgHeight / 2);
        ctx.rotate((overlayRotation * Math.PI) / 180);
        ctx.globalAlpha = 0.9;
        ctx.drawImage(img, -imgWidth / 2, -imgHeight / 2, imgWidth, imgHeight);
        ctx.restore();

        // Download
        const link = document.createElement("a");
        link.download = `aurnik-ar-tryon-${Date.now()}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();

        toast.success("Photo captured and downloaded!");
      };
      img.src = product.imageUrl;
    } else {
      // Just download video frame
      const link = document.createElement("a");
      link.download = `aurnik-ar-tryon-${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();

      toast.success("Photo captured and downloaded!");
    }
  };

  // Share functionality
  const handleShare = async () => {
    if (!product) return;

    const shareData = {
      title: `AR Try-On: ${product.name}`,
      text: `I'm trying on ${product.name} from Aurnik!`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        toast.success("Shared successfully!");
      } catch {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  // Reset overlay position
  const resetOverlay = () => {
    setOverlayPosition({ x: 50, y: 40 });
    setOverlayScale(1);
    setOverlayRotation(0);
    toast.success("Overlay reset");
  };

  // Cleanup on close
  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      resetOverlay();
    }
  }, [isOpen, stopCamera]);

  // Auto-start camera when modal opens
  useEffect(() => {
    if (isOpen && hasCamera && !cameraActive) {
      startCamera();
    }
  }, [isOpen, hasCamera, cameraActive, startCamera]);

  if (!isOpen || !product) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black"
      >
        {/* Hidden canvas for capture */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/80 to-transparent">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gold-500/20 flex items-center justify-center">
                <Shirt className="h-5 w-5 text-gold-400" />
              </div>
              <div>
                <h2 className="font-serif text-lg text-white">{product.name}</h2>
                <p className="text-xs text-white/50">AR Virtual Try-On</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white hover:bg-white/10"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Camera View */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900">
          {cameraActive ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
              style={{ transform: facingMode === "user" ? "scaleX(-1)" : "none" }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center px-6">
                {cameraError ? (
                  <>
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center">
                      <CameraOff className="h-10 w-10 text-red-400" />
                    </div>
                    <p className="text-white/70 mb-4">{cameraError}</p>
                    <Button
                      onClick={startCamera}
                      variant="outline"
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      Try Again
                    </Button>
                  </>
                ) : isInitializing ? (
                  <>
                    <Loader2 className="h-12 w-12 mx-auto mb-4 text-gold-400 animate-spin" />
                    <p className="text-white/70">Starting camera...</p>
                  </>
                ) : (
                  <>
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gold-500/20 flex items-center justify-center">
                      <Camera className="h-10 w-10 text-gold-400" />
                    </div>
                    <p className="text-white/70 mb-4">
                      Enable your camera for AR Virtual Try-On
                    </p>
                    <Button
                      onClick={startCamera}
                      className="bg-gold-500 hover:bg-gold-600 text-black"
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      Enable Camera
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Product Overlay */}
        {cameraActive && product.imageUrl && (
          <div
            className="absolute z-10 cursor-move select-none"
            style={{
              left: `${overlayPosition.x}%`,
              top: `${overlayPosition.y}%`,
              transform: `translate(-50%, -50%) scale(${overlayScale}) rotate(${overlayRotation}deg)`,
            }}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.85 }}
              className="relative"
            >
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-48 h-auto pointer-events-none"
                style={{
                  filter: "drop-shadow(0 10px 30px rgba(0,0,0,0.5))",
                }}
                draggable={false}
              />
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
                <span className="text-xs text-white/50 bg-black/50 px-2 py-1 rounded-full">
                  Drag to position
                </span>
              </div>
            </motion.div>
          </div>
        )}

        {/* AR Guide Frame */}
        {cameraActive && (
          <div className="absolute inset-0 z-5 pointer-events-none">
            <div className="absolute inset-4 border-2 border-dashed border-white/20 rounded-3xl" />
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 text-center">
              <Sparkles className="h-6 w-6 mx-auto text-gold-400/50" />
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
          {/* Adjustment Controls */}
          <div className="px-4 pt-6 pb-2">
            <div className="flex items-center justify-center gap-4 mb-4">
              {/* Scale controls */}
              <div className="flex items-center gap-2 bg-white/10 rounded-full px-3 py-1.5">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-white hover:bg-white/10"
                  onClick={() => setOverlayScale((s) => Math.max(0.3, s - 0.1))}
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="text-xs text-white/70 min-w-[40px] text-center">
                  {Math.round(overlayScale * 100)}%
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-white hover:bg-white/10"
                  onClick={() => setOverlayScale((s) => Math.min(2, s + 0.1))}
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </div>

              {/* Rotation control */}
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full bg-white/10 text-white hover:bg-white/20"
                onClick={() => setOverlayRotation((r) => (r + 15) % 360)}
              >
                <RotateCw className="h-5 w-5" />
              </Button>

              {/* Flip camera */}
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full bg-white/10 text-white hover:bg-white/20"
                onClick={flipCamera}
              >
                <FlipHorizontal className="h-5 w-5" />
              </Button>

              {/* Reset */}
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full bg-white/10 text-white hover:bg-white/20"
                onClick={resetOverlay}
              >
                <Move className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Main Action Buttons */}
          <div className="flex items-center justify-center gap-6 px-4 pb-8">
            {/* Camera Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className={`h-14 w-14 rounded-full ${
                cameraActive
                  ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                  : "bg-gold-500/20 text-gold-400 hover:bg-gold-500/30"
              }`}
              onClick={toggleCamera}
            >
              {cameraActive ? (
                <CameraOff className="h-6 w-6" />
              ) : (
                <Camera className="h-6 w-6" />
              )}
            </Button>

            {/* Capture Button */}
            <Button
              className="h-20 w-20 rounded-full bg-gold-500 hover:bg-gold-600 text-black shadow-lg shadow-gold-500/30"
              onClick={capturePhoto}
              disabled={!cameraActive}
            >
              <div className="w-16 h-16 rounded-full border-4 border-black/30 flex items-center justify-center">
                <Download className="h-6 w-6" />
              </div>
            </Button>

            {/* Share Button */}
            <Button
              variant="ghost"
              size="icon"
              className="h-14 w-14 rounded-full bg-white/10 text-white hover:bg-white/20"
              onClick={handleShare}
            >
              <Share2 className="h-6 w-6" />
            </Button>
          </div>

          {/* Instructions */}
          <div className="text-center pb-6">
            <p className="text-xs text-white/40">
              {cameraActive
                ? "Drag the product to position • Use controls to adjust"
                : "Enable camera to start AR try-on"}
            </p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
