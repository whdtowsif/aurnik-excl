"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowDown, Sparkles } from "lucide-react";
import HeroBackgroundSlideshow from "./HeroBackgroundSlideshow";

// Array of hero images for edge-to-edge slideshow
const heroBackgroundImages: string[] = [
  "/upload/IMG_9992.jpeg",
  "/upload/IMG_9985.jpeg",
  "/upload/IMG_9986.jpeg",
  "/upload/IMG_9987.jpeg",
  "/upload/IMG_9988.jpeg",
  "/upload/IMG_9989.jpeg",
  "/upload/IMG_9990.jpeg",
  "/upload/IMG_9991.jpeg",
  "/upload/IMG_9993.jpeg",
  "/upload/IMG_9994.jpeg",
];

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Full-screen Image Slideshow Background */}
      {heroBackgroundImages.length > 0 && (
        <HeroBackgroundSlideshow 
          images={heroBackgroundImages} 
          interval={6000}
        />
      )}

      {/* Fallback dark background if no images */}
      {heroBackgroundImages.length === 0 && (
        <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black" />
      )}

      {/* Animated background texture */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gold-600/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "-3s" }} />
      </div>

      {/* Grain texture overlay */}
      <div className="absolute inset-0 texture-grain pointer-events-none" />

      {/* Centered Logo - with golden glow */}
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.1, duration: 0.6, ease: "easeOut" }}
        className="absolute top-12 sm:top-16 md:top-20 left-1/2 -translate-x-1/2 z-20"
      >
        {/* Golden glow behind logo */}
        <div className="absolute inset-0 blur-3xl bg-gold-500/40 rounded-full scale-150" />
        <div className="absolute inset-0 blur-2xl bg-gold-400/30 rounded-full scale-125" />

        <img
          src="/upload/IMG_9672.png"
          alt="Aurnik"
          className="relative h-28 sm:h-36 md:h-44 lg:h-52 w-auto object-contain drop-shadow-2xl"
          style={{ filter: "drop-shadow(0 0 40px rgba(197, 160, 89, 0.5))" }}
        />
      </motion.div>

      {/* Fixed Badge */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="absolute top-44 sm:top-56 md:top-64 lg:top-72 left-1/2 -translate-x-1/2 z-20 mt-2"
      >
        <div className="inline-flex items-center space-x-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-black/60 backdrop-blur-md border border-gold-500/40 shadow-lg">
          <Sparkles className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-gold-400" />
          <span className="text-[8px] xs:text-[9px] sm:text-[10px] uppercase tracking-[0.1em] text-gold-400 font-medium whitespace-nowrap">
            Artisanal Luxury from Bangladesh
          </span>
          <Sparkles className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-gold-400" />
        </div>
      </motion.div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 lg:px-8 text-center pt-60 sm:pt-72 md:pt-80 lg:pt-96">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl mx-auto"
        >
          {/* Categories with Half Circles - Desktop Layout */}
          <div className="hidden lg:flex items-center justify-center gap-8 xl:gap-16 mb-10">
            {/* Left Half Circle - ARTISANAL CRAFTS */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="relative"
            >
              <Link href="#collection" className="group block">
                {/* Left Half Circle */}
                <div className="relative w-36 h-72 xl:w-44 xl:h-88">
                  {/* Background half circle */}
                  <div className="absolute inset-0 bg-gradient-to-l from-gold-500/20 via-gold-500/10 to-transparent rounded-r-full border-r-2 border-y-2 border-gold-500/30 group-hover:border-gold-500/60 transition-all duration-500" />
                  
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-l from-gold-500/30 to-transparent rounded-r-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Content - Rotated text along the curve */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center transform -rotate-0">
                      <div className="writing-vertical-rl text-gold-400 font-serif text-lg xl:text-xl tracking-[0.15em] uppercase group-hover:text-gold-300 transition-colors duration-300" style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>
                        ARTISANAL
                      </div>
                      <div className="writing-vertical-rl text-white/60 text-xs tracking-[0.3em] uppercase mt-2 group-hover:text-white/80 transition-colors duration-300" style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>
                        CRAFTS
                      </div>
                    </div>
                  </div>
                  
                  {/* Decorative elements */}
                  <div className="absolute top-4 right-3 w-2 h-2 rounded-full bg-gold-400/50 group-hover:bg-gold-400 transition-colors duration-300" />
                  <div className="absolute bottom-4 right-3 w-2 h-2 rounded-full bg-gold-400/50 group-hover:bg-gold-400 transition-colors duration-300" />
                </div>
              </Link>
            </motion.div>

            {/* Center - Main Heading */}
            <div className="flex-shrink-0 px-4">
              {/* Main Heading - Elegant & Refined */}
              <h1 className="font-serif text-3xl xl:text-4xl 2xl:text-5xl text-white leading-tight">
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="block"
                >
                  Where Heritage
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="block text-gold-400 italic mt-1"
                >
                  Meets Tomorrow
                </motion.span>
              </h1>
            </div>

            {/* Right Half Circle - ORGANIC LUXURY */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="relative"
            >
              <Link href="#organic" className="group block">
                {/* Right Half Circle */}
                <div className="relative w-36 h-72 xl:w-44 xl:h-88">
                  {/* Background half circle */}
                  <div className="absolute inset-0 bg-gradient-to-r from-gold-500/20 via-gold-500/10 to-transparent rounded-l-full border-l-2 border-y-2 border-gold-500/30 group-hover:border-gold-500/60 transition-all duration-500" />
                  
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-gold-500/30 to-transparent rounded-l-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Content - Rotated text along the curve */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center transform rotate-0">
                      <div className="writing-vertical-lr text-gold-400 font-serif text-lg xl:text-xl tracking-[0.15em] uppercase group-hover:text-gold-300 transition-colors duration-300" style={{ writingMode: 'vertical-lr', textOrientation: 'mixed' }}>
                        ORGANIC
                      </div>
                      <div className="writing-vertical-lr text-white/60 text-xs tracking-[0.3em] uppercase mt-2 group-hover:text-white/80 transition-colors duration-300" style={{ writingMode: 'vertical-lr', textOrientation: 'mixed' }}>
                        LUXURY
                      </div>
                    </div>
                  </div>
                  
                  {/* Decorative elements */}
                  <div className="absolute top-4 left-3 w-2 h-2 rounded-full bg-gold-400/50 group-hover:bg-gold-400 transition-colors duration-300" />
                  <div className="absolute bottom-4 left-3 w-2 h-2 rounded-full bg-gold-400/50 group-hover:bg-gold-400 transition-colors duration-300" />
                </div>
              </Link>
            </motion.div>
          </div>

          {/* Categories with Half Circles - Mobile/Tablet Layout (Stacked) */}
          <div className="lg:hidden flex flex-col items-center gap-6 mb-8">
            {/* Mobile Category Pills */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Link href="#collection" className="group block">
                  <div className="relative px-6 py-4 rounded-full bg-gradient-to-r from-gold-500/20 via-gold-500/10 to-gold-500/20 border border-gold-500/40 group-hover:border-gold-500/70 transition-all duration-300">
                    <div className="text-center">
                      <span className="text-gold-400 font-serif text-sm sm:text-base tracking-[0.15em] uppercase group-hover:text-gold-300 transition-colors">
                        Artisanal Crafts
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
              >
                <Link href="#organic" className="group block">
                  <div className="relative px-6 py-4 rounded-full bg-gradient-to-r from-gold-500/20 via-gold-500/10 to-gold-500/20 border border-gold-500/40 group-hover:border-gold-500/70 transition-all duration-300">
                    <div className="text-center">
                      <span className="text-gold-400 font-serif text-sm sm:text-base tracking-[0.15em] uppercase group-hover:text-gold-300 transition-colors">
                        Organic Luxury
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            </div>

            {/* Center - Main Heading */}
            <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl text-white leading-tight text-center">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="block"
              >
                Where Heritage
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="block text-gold-400 italic mt-1"
              >
                Meets Tomorrow
              </motion.span>
            </h1>
          </div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-sm sm:text-base md:text-lg text-white/70 max-w-2xl mx-auto mb-10 sm:mb-12 leading-relaxed"
          >
            Handmade limited-edition dresses and organic luxury goods. 
            Each piece is a 120+ hour journey of artisanal craftsmanship, 
            delivered to your doorstep.
          </motion.p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-12 sm:mt-14 grid grid-cols-3 gap-6 sm:gap-10 max-w-lg mx-auto"
          >
            {[
              { value: "120+", label: "Hours per Piece" },
              { value: "100%", label: "Handmade" },
              { value: "Limited", label: "Allocation" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="font-serif text-xl sm:text-2xl md:text-3xl text-gold-400 mb-1">
                  {stat.value}
                </div>
                <div className="text-[10px] sm:text-xs uppercase tracking-widest text-white/50">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 sm:bottom-12 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center"
        >
          <span className="text-[10px] uppercase tracking-widest text-white/40 mb-2">
            Scroll
          </span>
          <ArrowDown className="h-5 w-5 text-gold-400" />
        </motion.div>
      </motion.div>
    </section>
  );
}
