"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Loader2, CheckCircle } from "lucide-react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      // Google OAuth - this will redirect the page
      await signIn("google", {
        callbackUrl: "/",
      });
      // Page will redirect, no need to handle response
    } catch (error) {
      console.error("Google sign-in error:", error);
      toast.error("Google sign-in failed. Please try again.");
      setIsLoading(false);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate email
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail) {
      toast.error("Please enter your email");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    console.log("Attempting sign in with:", trimmedEmail);

    try {
      const result = await signIn("credentials", {
        email: trimmedEmail,
        name: name.trim() || undefined,
        redirect: false,
      });

      console.log("Sign in result:", result);

      if (result?.error) {
        console.error("Sign in error:", result.error);
        toast.error("Authentication failed. Please try again.");
      } else if (result?.ok) {
        setShowSuccess(true);
        toast.success("Welcome to Aurnik!");
        
        // Close modal and refresh after short delay
        setTimeout(() => {
          onClose();
          window.location.reload();
        }, 1000);
      } else {
        // Unexpected state
        console.log("Unexpected result:", result);
        toast.error("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Email sign-in error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setShowEmailForm(false);
      setShowSuccess(false);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md bg-neutral-900 border border-gold-500/30 rounded-2xl overflow-hidden shadow-2xl shadow-gold-500/10"
          >
            {/* Decorative elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-gold-500/10 via-transparent to-gold-500/5 pointer-events-none" />
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold-500/50 to-transparent" />

            {/* Close button */}
            <button
              onClick={handleClose}
              disabled={isLoading}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors text-white/50 hover:text-white disabled:opacity-50"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="relative p-8 pt-12">
              {/* Logo */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.1 }}
                className="text-center mb-6"
              >
                <img
                  src="/upload/IMG_9972.png"
                  alt="Aurnik"
                  className="h-16 w-auto mx-auto mb-4 drop-shadow-lg"
                  style={{ filter: "drop-shadow(0 0 12px rgba(197, 160, 89, 0.4))" }}
                />
              </motion.div>

              {/* Success State */}
              {showSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <CheckCircle className="h-16 w-16 mx-auto mb-4 text-green-400" />
                  <h2 className="font-serif text-2xl text-white mb-2">Welcome!</h2>
                  <p className="text-white/50">You're now signed in to Aurnik</p>
                </motion.div>
              ) : (
                <>
                  {/* Title */}
                  <div className="text-center mb-8">
                    <h2 className="font-serif text-2xl text-white mb-2">Member Access</h2>
                    <p className="text-white/50 text-sm">
                      Sign in to access exclusive collections and track your orders
                    </p>
                  </div>

                  {!showEmailForm ? (
                    <div className="space-y-4">
                      {/* Google Sign In Button */}
                      <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                        <Button
                          onClick={handleGoogleSignIn}
                          disabled={isLoading}
                          className="w-full bg-white hover:bg-gray-100 text-gray-900 font-medium py-6 rounded-xl relative overflow-hidden group"
                        >
                          {isLoading ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                          ) : (
                            <>
                              <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24">
                                <path
                                  fill="#4285F4"
                                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                />
                                <path
                                  fill="#34A853"
                                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                />
                                <path
                                  fill="#FBBC05"
                                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                />
                                <path
                                  fill="#EA4335"
                                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                />
                              </svg>
                              Continue with Google
                            </>
                          )}
                        </Button>
                      </motion.div>

                      {/* Divider */}
                      <div className="relative flex items-center justify-center my-6">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-white/10" />
                        </div>
                        <span className="relative bg-neutral-900 px-4 text-xs text-white/30 uppercase tracking-wider">
                          or
                        </span>
                      </div>

                      {/* Email Option */}
                      <Button
                        onClick={() => setShowEmailForm(true)}
                        variant="outline"
                        disabled={isLoading}
                        className="w-full border-white/20 text-white/70 hover:text-white hover:bg-white/5 py-6 rounded-xl"
                      >
                        <Mail className="h-5 w-5 mr-3" />
                        Continue with Email
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleEmailSignIn} className="space-y-4">
                      {/* Email Form */}
                      <div className="space-y-4">
                        <div>
                          <label className="text-xs uppercase tracking-wider text-white/50 mb-2 block">
                            Name (optional)
                          </label>
                          <Input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your name"
                            disabled={isLoading}
                            className="bg-white/5 border-white/10 focus:border-gold-500 text-white placeholder:text-white/40 py-3"
                          />
                        </div>
                        <div>
                          <label className="text-xs uppercase tracking-wider text-white/50 mb-2 block">
                            Email
                          </label>
                          <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your@email.com"
                            required
                            disabled={isLoading}
                            className="bg-white/5 border-white/10 focus:border-gold-500 text-white placeholder:text-white/40 py-3"
                          />
                        </div>
                      </div>

                      <div className="flex gap-3 pt-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowEmailForm(false)}
                          disabled={isLoading}
                          className="flex-1 border-white/20 text-white/70 hover:text-white py-6 rounded-xl"
                        >
                          Back
                        </Button>
                        <Button
                          type="submit"
                          disabled={isLoading || !email.trim()}
                          className="flex-1 bg-gold-500 hover:bg-gold-600 text-black font-medium py-6 rounded-xl disabled:opacity-50"
                        >
                          {isLoading ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                          ) : (
                            "Continue"
                          )}
                        </Button>
                      </div>
                    </form>
                  )}

                  {/* Terms */}
                  <p className="text-center text-xs text-white/30 mt-6">
                    By continuing, you agree to our{" "}
                    <span className="text-gold-400 hover:text-gold-300 cursor-pointer">
                      Terms of Service
                    </span>{" "}
                    and{" "}
                    <span className="text-gold-400 hover:text-gold-300 cursor-pointer">
                      Privacy Policy
                    </span>
                  </p>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
