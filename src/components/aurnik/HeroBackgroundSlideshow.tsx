"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface HeroBackgroundSlideshowProps {
  images: string[];
  interval?: number;
}

export default function HeroBackgroundSlideshow({
  images,
  interval = 5000,
}: HeroBackgroundSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, interval);

    return () => clearInterval(timer);
  }, [images.length, interval]);

  if (images.length === 0) return null;

  return (
    <div className="absolute inset-0 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ 
            opacity: { duration: 1.5, ease: "easeInOut" },
            scale: { duration: 8, ease: "linear" }
          }}
          className="absolute inset-0"
        >
          <img
            src={images[currentIndex]}
            alt="Aurnik artisanal fashion"
            className="w-full h-full object-cover"
            style={{
              filter: "brightness(0.7) saturate(1.1) contrast(1.05)",
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Slow Ken Burns zoom effect */}
      <motion.div
        initial={{ scale: 1 }}
        animate={{ scale: 1.1 }}
        transition={{ 
          duration: interval / 1000, 
          ease: "linear",
          repeat: Infinity,
          repeatType: "reverse"
        }}
        className="absolute inset-0 pointer-events-none"
      >
        <img
          src={images[currentIndex]}
          alt=""
          className="w-full h-full object-cover opacity-0"
          aria-hidden="true"
        />
      </motion.div>

      {/* Dark gradient overlays for content readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/50 pointer-events-none" />

      {/* Elegant vignette effect */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, transparent 20%, rgba(0,0,0,0.5) 100%)"
        }}
      />

      {/* Subtle golden glow from top */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          background: "radial-gradient(ellipse at 50% 20%, rgba(197,160,89,0.4) 0%, transparent 50%)"
        }}
      />

      {/* Minimal image indicators - thin and subtle */}
      {images.length > 1 && (
        <div className="absolute bottom-24 sm:bottom-28 left-1/2 -translate-x-1/2 flex gap-1.5 z-10 opacity-40 hover:opacity-70 transition-opacity">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-0.5 rounded-full transition-all duration-500 ${
                index === currentIndex 
                  ? "bg-gold-400/80 w-4" 
                  : "bg-white/40 w-2 hover:bg-white/60"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
