"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Clock, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/store";
import { toast } from "sonner";

interface OfferProps {
  currentProduct?: string;
  onViewedProducts?: string[];
}

export default function DynamicOffer({
  currentProduct,
  onViewedProducts = [],
}: OfferProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const { offer, setOffer } = useCartStore();

  const generateOffer = useCallback(() => {
    const offers = [
      {
        type: "bundle" as const,
        title: "Curated Bundle Offer",
        description: `Since you've shown interest in multiple pieces, enjoy 15% off when you secure 2 or more items together.`,
        discount: 15,
      },
      {
        type: "discount" as const,
        title: "Exclusive Member Offer",
        description: "As a valued visitor, we're offering you 10% off your first piece. Limited time only.",
        discount: 10,
      },
      {
        type: "exclusive" as const,
        title: "Early Access",
        description: "Be the first to access our upcoming Heritage Collection. Pre-order now with 5% off.",
        discount: 5,
      },
    ];

    const selectedOffer = offers[Math.floor(Math.random() * offers.length)];
    
    setOffer({
      id: `offer-${Date.now()}`,
      type: selectedOffer.type,
      title: selectedOffer.title,
      description: selectedOffer.description,
      discount: selectedOffer.discount,
      expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000),
    });

    setIsVisible(true);
  }, [setOffer]);

  useEffect(() => {
    if (dismissed || offer) return;

    if (onViewedProducts.length >= 2) {
      const timer = setTimeout(() => {
        generateOffer();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [onViewedProducts.length, dismissed, offer, generateOffer]);

  const handleDismiss = () => {
    setIsVisible(false);
    setDismissed(true);
    toast.info("Offer dismissed");
  };

  const handleAccept = () => {
    setIsVisible(false);
    toast.success(`Offer applied! ${offer?.discount}% discount added to your cart.`);
  };

  return (
    <AnimatePresence>
      {isVisible && offer && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          className="fixed bottom-28 left-6 right-6 md:left-auto md:right-6 md:w-96 z-40"
        >
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gold-900/90 via-gold-800/80 to-background/95 backdrop-blur-xl border border-gold-500/30 shadow-[0_0_40px_rgba(197,160,89,0.15)]">
            {/* Animated background */}
            <div className="absolute inset-0 animate-shimmer" />
            
            {/* Close button */}
            <button
              onClick={handleDismiss}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors z-10"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Content */}
            <div className="relative p-6">
              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gold-500/20 flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-gold-400" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-widest text-gold-400 mb-1">
                    AI-Approved Proposal
                  </div>
                  <h3 className="font-serif text-lg text-white">{offer.title}</h3>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-white/70 leading-relaxed mb-4">
                {offer.description}
              </p>

              {/* Timer */}
              <div className="flex items-center gap-2 mb-4 text-xs text-white/50">
                <Clock className="h-3.5 w-3.5" />
                <span>Offer expires in 2 hours</span>
              </div>

              {/* Discount Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-500/20 border border-gold-500/30 mb-4">
                <span className="text-2xl font-serif text-gold-400">{offer.discount}%</span>
                <span className="text-xs text-white/60 uppercase tracking-wider">off</span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <div className="flex flex-col items-center flex-1">
                  <Button
                    onClick={handleAccept}
                    className="w-full bg-gold-500 hover:bg-gold-600 text-black"
                  >
                    Accept Offer
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                  <span className="mt-1 text-[9px] text-white/40 text-center">
                    Discount applied at checkout
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <Button
                    variant="ghost"
                    onClick={handleDismiss}
                    className="text-white/60 hover:text-white"
                  >
                    Later
                  </Button>
                  <span className="mt-1 text-[9px] text-white/30 text-center">
                    Dismiss
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
