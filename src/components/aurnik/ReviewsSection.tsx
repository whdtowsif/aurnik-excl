"use client";

import React from "react";
import { motion } from "framer-motion";
import { Star, Instagram, CheckCircle } from "lucide-react";

interface Review {
  id: string;
  authorName: string;
  content: string;
  rating: number;
  source: string;
  isPinned: boolean;
  isApproved: boolean;
}

interface ReviewsSectionProps {
  reviews: Review[];
}

export default function ReviewsSection({ reviews }: ReviewsSectionProps) {
  const pinnedReviews = reviews.filter((r) => r.isPinned && r.isApproved);
  const otherReviews = reviews.filter((r) => !r.isPinned && r.isApproved);

  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent" />

      <div className="relative container mx-auto px-4 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-xs uppercase tracking-[0.3em] text-gold-400 mb-4 block">
            Social Proof
          </span>
          <h2 className="font-serif text-4xl md:text-5xl text-white mb-4">
            What Our Members Say
          </h2>
          <p className="text-white/50 max-w-lg mx-auto">
            Verified reviews from our exclusive community
          </p>
        </motion.div>

        {/* Pinned Reviews */}
        {pinnedReviews.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {pinnedReviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative p-6 rounded-2xl bg-white/5 border border-gold-500/20"
              >
                {/* Pinned badge */}
                <div className="absolute -top-3 left-4 px-3 py-1 rounded-full bg-gold-500/20 border border-gold-500/30 text-gold-400 text-[10px] uppercase tracking-widest">
                  Featured Review
                </div>

                {/* Source badge */}
                <div className="flex items-center justify-between mb-4 pt-2">
                  <div className="flex items-center gap-2">
                    {review.source === "instagram" ? (
                      <Instagram className="h-4 w-4 text-pink-400" />
                    ) : (
                      <CheckCircle className="h-4 w-4 text-green-400" />
                    )}
                    <span className="text-sm text-white/70">{review.authorName}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${
                          i < review.rating
                            ? "text-gold-400 fill-gold-400"
                            : "text-white/20"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Content */}
                <p className="text-white/80 leading-relaxed italic">
                  &ldquo;{review.content}&rdquo;
                </p>
              </motion.div>
            ))}
          </div>
        )}

        {/* Other Reviews */}
        {otherReviews.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {otherReviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-white/70">{review.authorName}</span>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-2.5 w-2.5 ${
                          i < review.rating
                            ? "text-gold-400 fill-gold-400"
                            : "text-white/20"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-white/60 line-clamp-3">
                  &ldquo;{review.content}&rdquo;
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
