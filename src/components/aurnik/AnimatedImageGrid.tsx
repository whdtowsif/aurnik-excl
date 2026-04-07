"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AnimatedImageGridProps {
  images: string[];
  columns?: number;
  rows?: number;
  animationInterval?: number;
}

export default function AnimatedImageGrid({
  images,
  columns = 5,
  rows = 2,
  animationInterval = 2000,
}: AnimatedImageGridProps) {
  // Track which images are currently highlighted
  const [highlightedImages, setHighlightedImages] = useState<Set<number>>(new Set());
  const [imageOpacities, setImageOpacities] = useState<number[]>(() => {
    return images.map(() => 0.65 + Math.random() * 0.25);
  });
  const [imageScales, setImageScales] = useState<number[]>(() => {
    return images.map(() => 1);
  });

  // Calculate total cells needed
  const totalCells = columns * rows;
  
  // Distribute images across the grid (repeat if needed)
  const gridImages: { src: string; originalIndex: number }[] = useMemo(() => {
    const result: { src: string; originalIndex: number }[] = [];
    for (let i = 0; i < totalCells; i++) {
      const originalIndex = i % images.length;
      result.push({ src: images[originalIndex], originalIndex });
    }
    return result;
  }, [images, totalCells]);

  // Smooth random animation
  const animateRandomImages = useCallback(() => {
    if (images.length === 0) return;

    // Pick random images to animate (2-4 at a time)
    const numToAnimate = 2 + Math.floor(Math.random() * 3);
    const indicesToAnimate: number[] = [];
    
    while (indicesToAnimate.length < numToAnimate) {
      const randomIndex = Math.floor(Math.random() * images.length);
      if (!indicesToAnimate.includes(randomIndex)) {
        indicesToAnimate.push(randomIndex);
      }
    }

    // Smooth fade and zoom effect
    setImageOpacities((prev) => {
      const newOpacities = [...prev];
      indicesToAnimate.forEach((idx) => {
        newOpacities[idx] = 0.35;
      });
      return newOpacities;
    });

    setImageScales((prev) => {
      const newScales = [...prev];
      indicesToAnimate.forEach((idx) => {
        newScales[idx] = 1.08;
      });
      return newScales;
    });

    // Restore smoothly after delay
    setTimeout(() => {
      setImageOpacities((prev) => {
        const newOpacities = [...prev];
        indicesToAnimate.forEach((idx) => {
          newOpacities[idx] = 0.65 + Math.random() * 0.25;
        });
        return newOpacities;
      });

      setImageScales((prev) => {
        const newScales = [...prev];
        indicesToAnimate.forEach((idx) => {
          newScales[idx] = 1;
        });
        return newScales;
      });
    }, 2500);
  }, [images]);

  useEffect(() => {
    const interval = setInterval(animateRandomImages, animationInterval);
    return () => clearInterval(interval);
  }, [animateRandomImages, animationInterval]);

  return (
    <div 
      className="absolute inset-0 grid overflow-hidden" 
      style={{ 
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        gap: '1px'
      }}
    >
      {gridImages.map((imageData, index) => {
        const opacity = imageOpacities[imageData.originalIndex] ?? 0.7;
        const scale = imageScales[imageData.originalIndex] ?? 1;
        
        return (
          <motion.div
            key={`grid-${index}`}
            className="relative overflow-hidden"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              duration: 1.5, 
              delay: index * 0.06,
              ease: [0.25, 0.1, 0.25, 1]
            }}
          >
            <motion.img
              src={imageData.src}
              alt="Aurnik artisanal fashion"
              className="w-full h-full object-cover"
              animate={{ 
                opacity: opacity,
                scale: scale,
              }}
              transition={{ 
                opacity: { duration: 2, ease: [0.4, 0, 0.2, 1] },
                scale: { duration: 2.5, ease: [0.4, 0, 0.2, 1] }
              }}
              style={{
                filter: "brightness(0.75) saturate(1.15) contrast(1.08)",
              }}
            />
            {/* Subtle dark overlay for depth */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-black/25" />
          </motion.div>
        );
      })}
      
      {/* Light dark overlay for content readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/75 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/50 pointer-events-none" />
      
      {/* Elegant vignette effect */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.4) 100%)"
        }}
      />

      {/* Subtle golden glow overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          background: "radial-gradient(ellipse at 50% 30%, rgba(197,160,89,0.3) 0%, transparent 60%)"
        }}
      />
    </div>
  );
}
