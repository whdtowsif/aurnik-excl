"use client";

import React, { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession, signIn, signOut } from "next-auth/react";
import { Lock, ArrowRight, Mail, Loader2, Sparkles, X } from "lucide-react";
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
  const [loginMethod, setLoginMethod] = useState<"choice" | "email">("choice");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isAuthenticated = status === "authenticated" && session?.user;

  // Handle Google login
  const handleGoogleLogin = useCallback(async () => {
    setIsLoading(true);
    try {
      await signIn("google", { callbackUrl: "/" });
    } catch (error) {
      console.error("Google login error:", error);
      toast.error("Failed to sign in with Google");
      setIsLoading(false);
    }
  }, []);

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
        setLoginMethod("choice");
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

  // Unauthenticated view
  return (
    <section id="vault" className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gold-500/5 to-transparent" />

      <div className="relative container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center"
        >
          {/* Lock Icon */}
          <div className="w-20 h-20 mx-auto mb-8 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
            <Lock className="h-8 w-8 text-gold-400" />
          </div>

          <h2 className="font-serif text-4xl md:text-5xl text-white mb-4">
            Member Vault
          </h2>
          <p className="text-white/50 mb-8 max-w-md mx-auto">
            Access your exclusive order history, track artisanal progress, and
            manage your collection in your private vault.
          </p>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {[
              {
                title: "Progress Tracking",
                desc: "Watch your piece being crafted in real-time",
              },
              {
                title: "Order History",
                desc: "Your complete collection at a glance",
              },
              {
                title: "Exclusive Offers",
                desc: "Members-only curated proposals",
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-4 rounded-xl bg-white/[0.02] border border-white/5"
              >
                <div className="text-sm font-medium text-white mb-1">
                  {feature.title}
                </div>
                <div className="text-xs text-white/40">{feature.desc}</div>
              </motion.div>
            ))}
          </div>

          {/* Login Methods */}
          <AnimatePresence mode="wait">
            {loginMethod === "choice" && (
              <motion.div
                key="choice"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                <Button
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  size="lg"
                  className="w-full bg-white hover:bg-gray-100 text-black px-8 py-6 text-sm"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                  )}
                  Continue with Google
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-white/40">or</span>
                  </div>
                </div>

                <Button
                  onClick={() => setLoginMethod("email")}
                  variant="outline"
                  size="lg"
                  className="w-full border-white/20 text-white hover:bg-white/5 px-8 py-6 text-sm"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Sign in with Email
                </Button>
              </motion.div>
            )}

            {loginMethod === "email" && (
              <motion.div
                key="email"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="pl-12 py-6 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-gold-500/50 rounded-xl"
                    disabled={isLoading}
                    onKeyDown={(e) => e.key === "Enter" && handleEmailLogin()}
                  />
                </div>

                <div className="relative">
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name (optional)"
                    className="py-6 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-gold-500/50 rounded-xl"
                    disabled={isLoading}
                    onKeyDown={(e) => e.key === "Enter" && handleEmailLogin()}
                  />
                </div>

                <Button
                  onClick={handleEmailLogin}
                  disabled={isLoading || !email.trim()}
                  size="lg"
                  className="w-full bg-gold-500 hover:bg-gold-600 text-black px-8 py-6 text-sm"
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

                <Button
                  onClick={() => setLoginMethod("choice")}
                  variant="ghost"
                  className="text-white/50 hover:text-white"
                >
                  <X className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          <p className="mt-4 text-[10px] text-white/30">
            By signing in, you agree to receive updates about your orders and exclusive offers.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
