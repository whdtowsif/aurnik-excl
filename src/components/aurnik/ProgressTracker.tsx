"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, Scissors, Sparkles, CheckCircle2, Package } from "lucide-react";

interface ProgressStage {
  threshold: number;
  name: string;
  icon: React.ReactNode;
  description: string;
}

const STAGES: ProgressStage[] = [
  {
    threshold: 0.15,
    name: "Pattern Drafting & Sourcing",
    icon: <Scissors className="h-4 w-4" />,
    description: "Your dress pattern is being drafted and premium fabrics sourced.",
  },
  {
    threshold: 0.30,
    name: "Precision Fabric Cutting",
    icon: <Scissors className="h-4 w-4" />,
    description: "Fabrics are being precision-cut for your unique piece.",
  },
  {
    threshold: 0.75,
    name: "Artisanal Hand-Stitching & Embroidery",
    icon: <Sparkles className="h-4 w-4" />,
    description: "Our master artisans are hand-stitching your dress. This is the most time-intensive phase.",
  },
  {
    threshold: 0.90,
    name: "Detailing & Quality Assurance",
    icon: <CheckCircle2 className="h-4 w-4" />,
    description: "Final details are being added and quality checks performed.",
  },
  {
    threshold: 1.00,
    name: "Luxury Packaging & Dispatch",
    icon: <Package className="h-4 w-4" />,
    description: "Your piece is being packaged with care and prepared for delivery.",
  },
];

interface ProgressTrackerProps {
  percent: number;
  stage: string;
  artisanNote?: string;
  isPaused?: boolean;
  orderId: string;
  productName?: string;
}

export default function ProgressTracker({
  percent,
  stage,
  artisanNote,
  isPaused = false,
  orderId,
  productName,
}: ProgressTrackerProps) {
  const [displayPercent, setDisplayPercent] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayPercent(percent);
    }, 300);
    return () => clearTimeout(timer);
  }, [percent]);

  const currentStageIndex = STAGES.findIndex((s) => s.name === stage);
  const currentStage = STAGES[currentStageIndex] || STAGES[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 p-6"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="text-xs uppercase tracking-widest text-gold-400 mb-1">
            Order #{orderId}
          </div>
          {productName && (
            <h3 className="font-serif text-xl text-white">{productName}</h3>
          )}
        </div>
        {isPaused && (
          <div className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs">
            Quality Review
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-white/60">Craftsmanship Progress</span>
          <span className="font-serif text-2xl text-gold-400">
            {displayPercent.toFixed(1)}%
          </span>
        </div>
        <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${displayPercent}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-gold-600 to-gold-400 rounded-full"
          />
        </div>
      </div>

      {/* Current Stage */}
      <div className="p-4 rounded-xl bg-white/5 border border-gold-500/20 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-400">
            {currentStage.icon}
          </div>
          <div>
            <div className="text-sm font-medium text-white">
              {currentStage.name}
            </div>
            <div className="text-xs text-white/50">
              {currentStage.description}
            </div>
          </div>
        </div>
      </div>

      {/* Artisan Note */}
      {artisanNote && (
        <div className="mb-6 p-4 rounded-xl bg-white/[0.02] border border-white/5">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-3 w-3 text-gold-400" />
            <span className="text-xs uppercase tracking-widest text-white/40">
              Artisan&apos;s Note
            </span>
          </div>
          <p className="text-sm text-white/70 italic">&quot;{artisanNote}&quot;</p>
        </div>
      )}

      {/* Timeline */}
      <div className="space-y-3">
        <div className="text-xs uppercase tracking-widest text-white/40 mb-2">
          Journey Timeline
        </div>
        {STAGES.map((s, index) => {
          const isCompleted = index < currentStageIndex;
          const isCurrent = index === currentStageIndex;

          return (
            <div
              key={s.name}
              className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                isCurrent
                  ? "bg-gold-500/10 border border-gold-500/20"
                  : isCompleted
                  ? "bg-white/[0.02]"
                  : "opacity-40"
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  isCompleted
                    ? "bg-gold-500/20 text-gold-400"
                    : isCurrent
                    ? "bg-gold-500/20 text-gold-400 animate-pulse"
                    : "bg-white/5 text-white/30"
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="h-3 w-3" />
                ) : (
                  s.icon
                )}
              </div>
              <span
                className={`text-sm ${
                  isCurrent
                    ? "text-gold-400"
                    : isCompleted
                    ? "text-white/70"
                    : "text-white/40"
                }`}
              >
                {s.name}
              </span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
