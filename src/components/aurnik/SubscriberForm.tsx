"use client";

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, User, Phone, Check, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface SubscriberFormProps {
  onSuccess?: (subscriber: { email: string; name?: string | null }) => void;
  source?: string;
  variant?: "default" | "compact";
}

export default function SubscriberForm({
  onSuccess,
  source = "website",
  variant = "default",
}: SubscriberFormProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email address");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          name: name.trim() || undefined,
          phone: phone.trim() || undefined,
          source,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to subscribe");
      }

      setIsSuccess(true);
      toast.success(data.message || "Successfully subscribed!");

      if (onSuccess) {
        onSuccess(data.subscriber);
      }

      // Reset after 3 seconds
      setTimeout(() => {
        setIsSuccess(false);
        setEmail("");
        setName("");
        setPhone("");
      }, 3000);
    } catch (error) {
      console.error("Subscription error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to subscribe");
    } finally {
      setIsLoading(false);
    }
  }, [email, name, phone, source, onSuccess]);

  if (isSuccess) {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex flex-col items-center justify-center py-8"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
          className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4"
        >
          <Check className="h-8 w-8 text-green-400" />
        </motion.div>
        <p className="text-white text-center font-medium">Welcome to Aurnik!</p>
        <p className="text-white/50 text-sm text-center mt-1">
          Check your inbox for exclusive updates
        </p>
      </motion.div>
    );
  }

  if (variant === "compact") {
    return (
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-gold-500/50"
            disabled={isLoading}
          />
        </div>
        <Button
          type="submit"
          disabled={isLoading || !email.trim()}
          className="bg-gold-500 hover:bg-gold-600 text-black px-4"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
        </Button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Email Input */}
      <div className="relative">
        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="pl-12 py-3 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-gold-500/50 rounded-xl"
          disabled={isLoading}
        />
      </div>

      {/* Toggle for more details */}
      <button
        type="button"
        onClick={() => setShowDetails(!showDetails)}
        className="text-xs text-white/40 hover:text-white/60 transition-colors"
      >
        {showDetails ? "Hide details" : "+ Add name and phone (optional)"}
      </button>

      {/* Additional Fields */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="space-y-4 overflow-hidden"
          >
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name (optional)"
                className="pl-12 py-3 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-gold-500/50 rounded-xl"
                disabled={isLoading}
              />
            </div>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
              <Input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone number (optional)"
                className="pl-12 py-3 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-gold-500/50 rounded-xl"
                disabled={isLoading}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isLoading || !email.trim()}
        className="w-full bg-gold-500 hover:bg-gold-600 text-black font-medium py-6 rounded-xl"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Subscribing...
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4 mr-2" />
            Subscribe to Aurnik
          </>
        )}
      </Button>

      <p className="text-xs text-white/30 text-center">
        By subscribing, you agree to receive updates about new collections and exclusive offers.
      </p>
    </form>
  );
}
