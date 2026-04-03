"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Camera,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Smartphone,
  Share2,
  Download,
  Info,
  Loader2,
  CameraOff,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ARViewerProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  productImage?: string;
  modelUrl?: string;
}

export default function ARViewer({
  isOpen,
  onClose,
  productName,
  modelUrl,
}: ARViewerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [arMode, setArMode] = useState<"camera" | "model">("camera");
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const hasAttemptedCamera = useRef(false);

  const startCamera = useCallback(async () => {
    if (hasAttemptedCamera.current && permissionDenied) return;
    
    setIsLoading(true);
    setPermissionDenied(false);
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setCameraActive(true);
        hasAttemptedCamera.current = true;
      }
    } catch (error) {
      const err = error as DOMException;
      // Handle different error types gracefully
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setPermissionDenied(true);
        // Don't show toast on first dismissal, only on explicit denial
        if (hasAttemptedCamera.current) {
          toast.error("Camera permission denied. Please enable it in your browser settings.");
        }
      } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
        toast.error("No camera found on this device.");
        setPermissionDenied(true);
      } else if (err.name === "NotReadableError" || err.name === "TrackStartError") {
        toast.error("Camera is in use by another application.");
        setPermissionDenied(true);
      } else {
        // Silently handle other errors without console spam
        setPermissionDenied(true);
      }
      hasAttemptedCamera.current = true;
    } finally {
      setIsLoading(false);
    }
  }, [permissionDenied]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      setCameraActive(false);
    }
  }, []);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  useEffect(() => {
    if (isOpen && arMode === "camera") {
      startCamera();
    } else if (!isOpen) {
      stopCamera();
    }
  }, [isOpen, arMode, startCamera, stopCamera]);

  const captureScreenshot = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const video = videoRef.current;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(video, 0, 0);
      
      const overlaySize = 200 * zoom;
      const x = (canvas.width - overlaySize) / 2;
      const y = (canvas.height - overlaySize) / 2;
      
      ctx.save();
      ctx.translate(x + overlaySize / 2, y + overlaySize / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.globalAlpha = 0.8;
      
      ctx.strokeStyle = "#C5A059";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, -overlaySize / 2);
      ctx.lineTo(overlaySize / 3, -overlaySize / 4);
      ctx.lineTo(overlaySize / 3, overlaySize / 3);
      ctx.lineTo(0, overlaySize / 2);
      ctx.lineTo(-overlaySize / 3, overlaySize / 3);
      ctx.lineTo(-overlaySize / 3, -overlaySize / 4);
      ctx.closePath();
      ctx.stroke();
      
      ctx.restore();
      
      const link = document.createElement("a");
      link.download = `${productName.replace(/\s+/g, "-").toLowerCase()}-ar-preview.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      
      toast.success("AR preview saved!");
    }
  }, [productName, zoom, rotation]);

  const handleShare = useCallback(async () => {
    if (!canvasRef.current) return;
    
    try {
      canvasRef.current.toBlob(async (blob) => {
        if (!blob) return;
        
        const file = new File([blob], `${productName}-ar.png`, { type: "image/png" });
        
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: `${productName} - AR Preview`,
            text: "Check out this AR preview from Aurnik!",
            files: [file],
          });
        } else {
          toast.info("Sharing not supported on this device");
        }
      });
    } catch {
      toast.error("Failed to share");
    }
  }, [productName]);

  const openNativeAR = useCallback(() => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);
    
    if (isIOS && modelUrl) {
      const usdzUrl = modelUrl.replace(".glb", ".usdz");
      window.location.href = usdzUrl;
    } else if (isAndroid && modelUrl) {
      const intentUrl = `intent://arvr.google.com/scene-viewer/1.0?file=${encodeURIComponent(modelUrl)}&mode=ar_preferred#Intent;scheme=https;package=com.google.ar.core;action=android.intent.action.VIEW;S.browser_fallback_url=https://developers.google.com/ar;end`;
      window.location.href = intentUrl;
    } else {
      toast.info("AR mode works best on mobile devices with AR support");
    }
  }, [modelUrl]);

  const handleModeChange = useCallback((mode: "camera" | "model") => {
    if (mode === "model") {
      stopCamera();
    }
    setArMode(mode);
  }, [stopCamera]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] bg-black"
      >
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-10 p-4 bg-gradient-to-b from-black/80 to-transparent">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-xl text-white">{productName}</h2>
              <p className="text-xs text-white/50">AR Try-On Experience</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white hover:bg-white/10"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Camera View */}
        <div className="relative h-full w-full">
          {arMode === "camera" ? (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="h-full w-full object-cover"
              />
              
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <div className="text-center">
                    <Loader2 className="h-8 w-8 text-gold-400 animate-spin mx-auto mb-4" />
                    <span className="text-white/70 text-sm">Starting camera...</span>
                  </div>
                </div>
              )}
              
              {/* Permission Denied State */}
              {permissionDenied && !cameraActive && !isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black">
                  <div className="text-center p-8 max-w-md">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center">
                      <CameraOff className="h-10 w-10 text-gold-400/50" />
                    </div>
                    <h3 className="font-serif text-xl text-white mb-2">Camera Access Required</h3>
                    <p className="text-sm text-white/50 mb-6">
                      To use the AR Try-On feature, please allow camera access in your browser settings and try again.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Button
                        onClick={() => {
                          hasAttemptedCamera.current = false;
                          startCamera();
                        }}
                        className="bg-gold-500 hover:bg-gold-600 text-black"
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Try Again
                      </Button>
                      <Button
                        onClick={openNativeAR}
                        variant="outline"
                        className="border-white/20 text-white hover:bg-white/5"
                      >
                        <Smartphone className="h-4 w-4 mr-2" />
                        Use Mobile AR
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              
              {cameraActive && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: zoom }}
                    transition={{ duration: 0.3 }}
                    style={{ rotate: rotation }}
                    className="relative"
                  >
                    <svg
                      width="200"
                      height="300"
                      viewBox="0 0 200 300"
                      className="drop-shadow-2xl"
                    >
                      <defs>
                        <linearGradient id="dressGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#C5A059" stopOpacity="0.6" />
                          <stop offset="100%" stopColor="#8B7355" stopOpacity="0.4" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M100 20 L140 40 L145 100 L130 150 L140 280 L100 290 L60 280 L70 150 L55 100 L60 40 Z"
                        fill="url(#dressGradient)"
                        stroke="#C5A059"
                        strokeWidth="2"
                        strokeDasharray="5,5"
                        className="animate-pulse"
                      />
                      <path
                        d="M100 10 L100 20 M80 30 Q100 10 120 30"
                        fill="none"
                        stroke="#C5A059"
                        strokeWidth="2"
                      />
                    </svg>
                    <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap">
                      <span className="text-xs text-white/50 bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm">
                        Position dress on your body
                      </span>
                    </div>
                  </motion.div>
                </div>
              )}
              
              {cameraActive && (
                <div className="absolute top-24 left-4 right-4">
                  <div className="bg-black/40 backdrop-blur-md rounded-xl p-4 border border-white/10">
                    <div className="flex items-start gap-3">
                      <Info className="h-4 w-4 text-gold-400 flex-shrink-0 mt-0.5" />
                      <div className="text-xs text-white/70">
                        <p className="mb-1">Point your camera at a mirror or ask someone to help.</p>
                        <p>Adjust the dress position using the controls below.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-gradient-to-b from-background to-black">
              <div className="text-center p-8">
                <div className="w-32 h-32 mx-auto mb-6 rounded-2xl bg-white/5 flex items-center justify-center">
                  <Smartphone className="h-12 w-12 text-gold-400/50" />
                </div>
                <h3 className="font-serif text-xl text-white mb-2">3D Model View</h3>
                <p className="text-sm text-white/50 mb-6 max-w-xs mx-auto">
                  For the full 3D experience, open this page on a mobile device with AR support.
                </p>
                <Button
                  onClick={openNativeAR}
                  className="bg-gold-500 hover:bg-gold-600 text-black"
                >
                  Open in AR App
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Controls - Only show when camera is active */}
        {arMode === "camera" && cameraActive && (
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
          <div className="flex items-center justify-center gap-4 mb-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setRotation(rotation - 15)}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setRotation(rotation + 15)}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <RotateCcw className="h-4 w-4 scale-x-[-1]" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setZoom(Math.min(2, zoom + 0.1))}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex items-center justify-center gap-3">
            <Button
              variant="outline"
              onClick={captureScreenshot}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <Download className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button
              variant="outline"
              onClick={handleShare}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button
              variant="outline"
              onClick={openNativeAR}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <Camera className="h-4 w-4 mr-2" />
              Native AR
            </Button>
          </div>
          
          <div className="flex justify-center mt-4">
            <div className="inline-flex rounded-full bg-white/10 p-1">
              <button
                onClick={() => handleModeChange("camera")}
                className={`px-4 py-1.5 rounded-full text-xs uppercase tracking-wider transition-colors ${
                  arMode === "camera"
                    ? "bg-gold-500 text-black"
                    : "text-white/60 hover:text-white"
                }`}
              >
                Camera
              </button>
              <button
                onClick={() => handleModeChange("model")}
                className={`px-4 py-1.5 rounded-full text-xs uppercase tracking-wider transition-colors ${
                  arMode === "model"
                    ? "bg-gold-500 text-black"
                    : "text-white/60 hover:text-white"
                }`}
              >
                3D Model
              </button>
            </div>
          </div>
          
          <p className="text-center text-[10px] text-white/30 mt-3">
            For best results, use a mirror or ask someone to help capture your look
          </p>
        </div>
        )}
        
        {/* 3D Model Mode Controls */}
        {arMode === "model" && (
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
          <div className="flex justify-center">
            <div className="inline-flex rounded-full bg-white/10 p-1">
              <button
                onClick={() => handleModeChange("camera")}
                className={`px-4 py-1.5 rounded-full text-xs uppercase tracking-wider transition-colors ${
                  arMode === "camera"
                    ? "bg-gold-500 text-black"
                    : "text-white/60 hover:text-white"
                }`}
              >
                Camera
              </button>
              <button
                onClick={() => handleModeChange("model")}
                className={`px-4 py-1.5 rounded-full text-xs uppercase tracking-wider transition-colors ${
                  arMode === "model"
                    ? "bg-gold-500 text-black"
                    : "text-white/60 hover:text-white"
                }`}
              >
                3D Model
              </button>
            </div>
          </div>
        </div>
        )}

        <canvas ref={canvasRef} className="hidden" />
      </motion.div>
    </AnimatePresence>
  );
}
