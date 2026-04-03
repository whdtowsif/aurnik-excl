"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowDown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
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
        className="absolute top-16 sm:top-20 md:top-24 left-1/2 -translate-x-1/2 z-20"
      >
        {/* Golden glow behind logo */}
        <div className="absolute inset-0 blur-3xl bg-gold-500/40 rounded-full scale-150" />
        <div className="absolute inset-0 blur-2xl bg-gold-400/30 rounded-full scale-125" />

        <img
          src="/upload/IMG_9672.png"
          alt="Aurnik"
          className="relative h-36 sm:h-48 md:h-60 lg:h-72 w-auto object-contain drop-shadow-2xl"
          style={{ filter: "drop-shadow(0 0 40px rgba(197, 160, 89, 0.5))" }}
        />
      </motion.div>

      {/* Fixed Badge */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="absolute top-56 sm:top-72 md:top-80 lg:top-96 left-1/2 -translate-x-1/2 z-20 mt-4"
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
      <div className="relative z-10 container mx-auto px-4 lg:px-8 text-center pt-72 sm:pt-80 md:pt-96 lg:pt-[28rem]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          {/* Main Heading - Elegant & Refined */}
          <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white leading-tight mb-6">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="block"
            >
              Where Heritage
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="block text-gold-400 italic mt-1"
            >
              Meets Tomorrow
            </motion.span>
          </h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-sm sm:text-base md:text-lg text-white/70 max-w-2xl mx-auto mb-10 sm:mb-12 leading-relaxed"
          >
            Handmade limited-edition dresses and organic luxury goods. 
            Each piece is a 120+ hour journey of artisanal craftsmanship, 
            delivered to your doorstep.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
          >
            <Button
              asChild
              size="lg"
              className="bg-gold-500 hover:bg-gold-400 text-black font-semibold px-8 py-6 text-sm uppercase tracking-widest shadow-lg shadow-gold-500/20 hover:shadow-gold-500/30 transition-all duration-300"
            >
              <Link href="#collection">
                Explore Collection
              </Link>
            </Button>
            
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-gold-500/40 text-gold-400 hover:bg-gold-500/10 hover:border-gold-500/60 px-8 py-6 text-sm uppercase tracking-widest transition-all duration-300"
            >
              <Link href="#vault">
                Member Login
              </Link>
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-14 sm:mt-16 grid grid-cols-3 gap-6 sm:gap-10 max-w-lg mx-auto"
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
