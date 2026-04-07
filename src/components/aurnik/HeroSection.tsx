"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowDown, Sparkles } from "lucide-react";
import HeroBackgroundSlideshow from "./HeroBackgroundSlideshow";

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
      {/* Background Slideshow */}
      {heroBackgroundImages.length > 0 && (
        <HeroBackgroundSlideshow images={heroBackgroundImages} interval={6000} />
      )}

      {/* Fallback background */}
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

      {/* LEFT HALF CIRCLE - Absolute Position on Left Edge */}
      <motion.div
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-20 hidden lg:block"
      >
        <Link href="#collection" className="group block">
          <div className="relative w-16 h-32 xl:w-20 xl:h-40">
            {/* Half circle shape using clip-path */}
            <div 
              className="absolute inset-0 bg-gradient-to-l from-gold-500/40 via-gold-500/25 to-transparent border-r-2 border-gold-500/50 group-hover:border-gold-400 transition-all duration-300"
              style={{ 
                clipPath: 'ellipse(100% 50% at 100% 50%)',
                background: 'linear-gradient(to left, rgba(197,160,89,0.4), rgba(197,160,89,0.2), transparent)'
              }}
            />
            
            {/* Glow on hover */}
            <div 
              className="absolute inset-0 bg-gold-500/30 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ clipPath: 'ellipse(100% 50% at 100% 50%)' }}
            />
            
            {/* Inner circle accent */}
            <div 
              className="absolute top-1/2 left-4 -translate-y-1/2 w-1 h-16 bg-gradient-to-b from-transparent via-gold-400/60 to-transparent opacity-60 group-hover:opacity-100 transition-opacity"
            />
            
            {/* Vertical Text */}
            <div className="absolute inset-0 flex items-center justify-center pl-1">
              <span 
                className="text-gold-300 font-serif text-xs xl:text-sm tracking-[0.15em] uppercase group-hover:text-gold-200 transition-colors"
                style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
              >
                ARTISANAL
              </span>
            </div>
            
            {/* Decorative dots */}
            <div className="absolute top-4 right-1 w-1.5 h-1.5 rounded-full bg-gold-400/70 group-hover:bg-gold-400 transition-colors shadow-sm shadow-gold-400/50" />
            <div className="absolute bottom-4 right-1 w-1.5 h-1.5 rounded-full bg-gold-400/70 group-hover:bg-gold-400 transition-colors shadow-sm shadow-gold-400/50" />
          </div>
        </Link>
      </motion.div>

      {/* RIGHT HALF CIRCLE - Absolute Position on Right Edge */}
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-20 hidden lg:block"
      >
        <Link href="#organic" className="group block">
          <div className="relative w-16 h-32 xl:w-20 xl:h-40">
            {/* Half circle shape using clip-path */}
            <div 
              className="absolute inset-0 bg-gradient-to-r from-gold-500/40 via-gold-500/25 to-transparent border-l-2 border-gold-500/50 group-hover:border-gold-400 transition-all duration-300"
              style={{ 
                clipPath: 'ellipse(100% 50% at 0% 50%)',
                background: 'linear-gradient(to right, rgba(197,160,89,0.4), rgba(197,160,89,0.2), transparent)'
              }}
            />
            
            {/* Glow on hover */}
            <div 
              className="absolute inset-0 bg-gold-500/30 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ clipPath: 'ellipse(100% 50% at 0% 50%)' }}
            />
            
            {/* Inner circle accent */}
            <div 
              className="absolute top-1/2 right-4 -translate-y-1/2 w-1 h-16 bg-gradient-to-b from-transparent via-gold-400/60 to-transparent opacity-60 group-hover:opacity-100 transition-opacity"
            />
            
            {/* Vertical Text */}
            <div className="absolute inset-0 flex items-center justify-center pr-1">
              <span 
                className="text-gold-300 font-serif text-xs xl:text-sm tracking-[0.15em] uppercase group-hover:text-gold-200 transition-colors"
                style={{ writingMode: 'vertical-lr', textOrientation: 'mixed' }}
              >
                ORGANIC
              </span>
            </div>
            
            {/* Decorative dots */}
            <div className="absolute top-4 left-1 w-1.5 h-1.5 rounded-full bg-gold-400/70 group-hover:bg-gold-400 transition-colors shadow-sm shadow-gold-400/50" />
            <div className="absolute bottom-4 left-1 w-1.5 h-1.5 rounded-full bg-gold-400/70 group-hover:bg-gold-400 transition-colors shadow-sm shadow-gold-400/50" />
          </div>
        </Link>
      </motion.div>

      {/* Centered Logo */}
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.1, duration: 0.6, ease: "easeOut" }}
        className="absolute top-12 sm:top-16 md:top-20 left-1/2 -translate-x-1/2 z-10"
      >
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
        className="absolute top-44 sm:top-56 md:top-64 lg:top-72 left-1/2 -translate-x-1/2 z-10 mt-2"
      >
        <div className="inline-flex items-center space-x-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-black/60 backdrop-blur-md border border-gold-500/40 shadow-lg">
          <Sparkles className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-gold-400" />
          <span className="text-[8px] xs:text-[9px] sm:text-[10px] uppercase tracking-[0.1em] text-gold-400 font-medium whitespace-nowrap">
            Artisanal Luxury from Bangladesh
          </span>
          <Sparkles className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-gold-400" />
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 lg:px-8 text-center pt-60 sm:pt-72 md:pt-80 lg:pt-96">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto"
        >
          {/* Main Heading */}
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-white leading-tight mb-4">
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
              className="block text-gold-400 italic mt-2"
            >
              Meets Tomorrow
            </motion.span>
          </h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-sm sm:text-base md:text-lg text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Handmade limited-edition dresses and organic luxury goods. 
            Each piece is a 120+ hour journey of artisanal craftsmanship.
          </motion.p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-12 grid grid-cols-3 gap-6 sm:gap-10 max-w-lg mx-auto"
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

          {/* Mobile Category Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="lg:hidden flex flex-col sm:flex-row items-center justify-center gap-3 mt-10"
          >
            <Link href="#collection" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-8 py-3 rounded-full bg-gradient-to-r from-gold-500/20 via-gold-500/10 to-gold-500/20 border border-gold-500/40 hover:border-gold-400 transition-all duration-300">
                <span className="text-gold-300 font-serif text-sm tracking-[0.15em] uppercase">
                  Artisanal Crafts
                </span>
              </button>
            </Link>
            <Link href="#organic" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-8 py-3 rounded-full bg-gradient-to-r from-gold-500/20 via-gold-500/10 to-gold-500/20 border border-gold-500/40 hover:border-gold-400 transition-all duration-300">
                <span className="text-gold-300 font-serif text-sm tracking-[0.15em] uppercase">
                  Organic Luxury
                </span>
              </button>
            </Link>
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
