"use client";

import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useSession, signIn, signOut } from "next-auth/react";
import { Lock, ArrowRight, Mail, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ProgressTracker from "./ProgressTracker";
import { toast } from "sonner";

interface Order {
  orderId: string;
  productId: string;
  productName?: string;
  status: string;
  progress: number;
  stage: string;
  artisanNotes?: string;
  isPaused: boolean;
}

interface OrderVaultProps {
  isAuthenticated: boolean;
  orders?: Order[];
  onLogin?: () => void;
  onLogout?: () => void;
}

export default function OrderVault({
  orders = [],
  onLogin,
  onLogout,
}: OrderVaultProps) {
  const { data: session, status } = useSession();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isAuthenticated = status === "authenticated" && session?.user;

  // Handle email login
  const handleEmailLogin = useCallback(async () => {
    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email");
      return;
    }

    setIsLoading(true);
    try {
      const result = await signIn("credentials", {
        email: email.trim().toLowerCase(),
        name: name.trim() || undefined,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Failed to sign in");
      } else {
        toast.success("Welcome to Aurnik!");
        onLogin?.();
      }
    } catch (error) {
      console.error("Email login error:", error);
      toast.error("Failed to sign in");
    } finally {
      setIsLoading(false);
    }
  }, [email, name, onLogin]);

  // Handle logout
  const handleLogout = useCallback(async () => {
    await signOut({ redirect: false });
    toast.info("You have been signed out.");
    onLogout?.();
  }, [onLogout]);

  // Authenticated view
  if (isAuthenticated && session?.user) {
    return (
      <section id="vault" className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gold-500/5 to-transparent" />

        <div className="relative container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <span className="text-xs uppercase tracking-[0.3em] text-gold-400 mb-4 block">
                  Exclusive Access
                </span>
                <h2 className="font-serif text-4xl md:text-5xl text-white mb-4">
                  Your Vault
                </h2>
                <p className="text-white/50 max-w-lg">
                  Welcome back{session.user.name ? `, ${session.user.name}` : ""}! Track your artisanal pieces.
                </p>
              </div>
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="text-white/50 hover:text-white"
              >
                Sign Out
              </Button>
            </div>
          </motion.div>

          {orders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="text-white/40 mb-4">
                You have no active orders
              </div>
              <p className="text-sm text-white/30 mb-6">
                Browse our collection and secure your first handmade piece
              </p>
              <div className="flex flex-col items-center">
                <Button
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/5"
                  onClick={() => document.getElementById("collection")?.scrollIntoView({ behavior: "smooth" })}
                >
                  Explore Collection
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
                <span className="mt-2 text-[10px] text-white/30">
                  View handmade dresses & organic goods
                </span>
              </div>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {orders.map((order) => (
                <ProgressTracker
                  key={order.orderId}
                  percent={order.progress}
                  stage={order.stage}
                  artisanNote={order.artisanNotes}
                  isPaused={order.isPaused}
                  orderId={order.orderId}
                  productName={order.productName}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    );
  }

  // Loading state
  if (status === "loading") {
    return (
      <section id="vault" className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gold-500/5 to-transparent" />
        <div className="relative container mx-auto px-4 lg:px-8 flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-gold-400" />
        </div>
      </section>
    );
  }

  // Unauthenticated view - Email only
  return (
    <section id="vault" className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gold-500/5 to-transparent" />

      <div className="relative container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-md mx-auto text-center"
        >
          {/* Lock Icon */}
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
            <Lock className="h-7 w-7 text-gold-400" />
          </div>

          <h2 className="font-serif text-3xl md:text-4xl text-white mb-3">
            Member Vault
          </h2>
          <p className="text-white/50 mb-6 text-sm">
            Sign in to track your orders and access exclusive member benefits.
          </p>

          {/* Email Login Form */}
          <div className="space-y-3">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="pl-11 py-5 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-gold-500/50 rounded-xl text-sm"
                disabled={isLoading}
                onKeyDown={(e) => e.key === "Enter" && handleEmailLogin()}
              />
            </div>

            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name (optional)"
              className="py-5 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-gold-500/50 rounded-xl text-sm"
              disabled={isLoading}
              onKeyDown={(e) => e.key === "Enter" && handleEmailLogin()}
            />

            <Button
              onClick={handleEmailLogin}
              disabled={isLoading || !email.trim()}
              className="w-full bg-gold-500 hover:bg-gold-600 text-black py-5 text-sm font-medium"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Enter Member Vault
                </>
              )}
            </Button>
          </div>

          <p className="mt-4 text-[10px] text-white/30">
            By signing in, you agree to receive order updates and exclusive offers.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
