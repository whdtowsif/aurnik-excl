"use client";

import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AnimatedImageTilesProps {
  images: string[];
  interval?: number; // ms between tile changes
}

interface Tile {
  id: number;
  src: string;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  delay: number;
  duration: number;
}

// Generate a single tile configuration
function createTile(id: number, src: string): Tile {
  return {
    id,
    src,
    x: Math.random() * 100, // random x position (0-100%)
    y: Math.random() * 100, // random y position (0-100%)
    rotation: (Math.random() - 0.5) * 30, // random rotation (-15 to 15 degrees)
    scale: 0.4 + Math.random() * 0.3, // random scale (0.4 to 0.7)
    delay: Math.random() * 0.5,
    duration: 2 + Math.random() * 2, // duration 2-4 seconds
  };
}

export default function AnimatedImageTiles({
  images,
  interval = 2000,
}: AnimatedImageTilesProps) {
  // Initialize tiles state with initial tiles
  const [activeTiles, setActiveTiles] = useState<Tile[]>(() => {
    if (images.length === 0) return [];
    const numInitial = Math.min(5, images.length);
    return Array.from({ length: numInitial }, (_, i) => 
      createTile(i, images[i % images.length])
    );
  });
  
  const [tileId, setTileId] = useState(() => Math.min(5, images.length));

  // Add a new tile
  const addTile = useCallback(() => {
    if (images.length === 0) return;
    
    setTileId((prev) => {
      const newId = prev + 1;
      const randomImage = images[Math.floor(Math.random() * images.length)];
      
      setActiveTiles((current) => {
        // Remove a random tile if we have too many
        let newTiles = [...current];
        if (newTiles.length > 8) {
          const removeIndex = Math.floor(Math.random() * newTiles.length);
          newTiles = newTiles.filter((_, i) => i !== removeIndex);
        }
        
        // Add new tile
        return [...newTiles, createTile(newId, randomImage)];
      });
      
      return newId;
    });
  }, [images]);

  // Remove a tile
  const removeTile = useCallback(() => {
    setActiveTiles((current) => {
      if (current.length <= 3) return current;
      const removeIndex = Math.floor(Math.random() * current.length);
      return current.filter((_, i) => i !== removeIndex);
    });
  }, []);

  // Set up intervals for adding and removing tiles
  useEffect(() => {
    if (images.length === 0) return;

    const addInterval = setInterval(addTile, interval);
    const removeInterval = setInterval(removeTile, interval * 1.5);

    return () => {
      clearInterval(addInterval);
      clearInterval(removeInterval);
    };
  }, [images, interval, addTile, removeTile]);

  if (images.length === 0) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <AnimatePresence>
        {activeTiles.map((tile) => (
          <motion.div
            key={tile.id}
            initial={{ 
              opacity: 0, 
              scale: 0,
              rotate: tile.rotation - 20,
            }}
            animate={{ 
              opacity: [0, 0.6, 0.5, 0], 
              scale: [0, tile.scale, tile.scale, 0],
              rotate: [tile.rotation - 20, tile.rotation, tile.rotation, tile.rotation + 10],
              x: [0, 0, 0, 20],
              y: [0, 0, 0, 20],
            }}
            exit={{ 
              opacity: 0, 
              scale: 0,
            }}
            transition={{ 
              duration: tile.duration,
              delay: tile.delay,
              ease: "easeInOut",
            }}
            className="absolute"
            style={{
              left: `${tile.x}%`,
              top: `${tile.y}%`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <div className="relative">
              {/* Dark overlay on the tile */}
              <div className="absolute inset-0 bg-black/50 rounded-lg" />
              
              {/* Tile border/frame */}
              <div className="absolute inset-0 border border-white/10 rounded-lg" />
              
              {/* The image */}
              <img
                src={tile.src}
                alt=""
                className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 object-cover rounded-lg"
                style={{
                  filter: "brightness(0.5) saturate(0.7) sepia(0.2)",
                }}
              />
              
              {/* Glassmorphism overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/30 rounded-lg" />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
