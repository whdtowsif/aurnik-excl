"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingBag, User, Search, LogOut, Sparkles, Lock, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCartStore } from "@/lib/store";
import { toast } from "sonner";

interface NavigationProps {
  isAuthenticated?: boolean;
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    isAdmin?: boolean;
  } | null;
  onLogin?: () => void;
  onLogout?: () => void;
  onOpenAdmin?: () => void;
}

// Admin password (in production, this should be securely stored)
const ADMIN_PASSWORD = "aunuANIKarny@8993";
const LOGO_CLICK_THRESHOLD = 5;
const CLICK_RESET_DELAY = 2000; // 2 seconds to reset click counter

export default function Navigation({
  isAuthenticated = false,
  user = null,
  onLogin,
  onLogout,
  onOpenAdmin,
}: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSection, setActiveSection] = useState("");
  
  // Admin access state
  const [logoClickCount, setLogoClickCount] = useState(0);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const clickResetTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  const { setOpen: setCartOpen, getTotalItems } = useCartStore();
  const cartCount = getTotalItems();

  useEffect(() => {
    const handleScroll = () => {
      // Detect active section for nav highlighting
      const sections = ["collection", "organic", "vault", "about"];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Smooth scroll to section
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Logo click handler for admin access
  const handleLogoClick = useCallback(() => {
    // Clear existing reset timer
    if (clickResetTimerRef.current) {
      clearTimeout(clickResetTimerRef.current);
    }

    const newCount = logoClickCount + 1;
    setLogoClickCount(newCount);

    // Set timer to reset clicks after delay
    clickResetTimerRef.current = setTimeout(() => {
      setLogoClickCount(0);
    }, CLICK_RESET_DELAY);

    // Check if threshold reached
    if (newCount >= LOGO_CLICK_THRESHOLD) {
      setLogoClickCount(0);
      setIsPasswordModalOpen(true);
      if (clickResetTimerRef.current) {
        clearTimeout(clickResetTimerRef.current);
      }
    }
  }, [logoClickCount]);

  // Admin password verification
  const handlePasswordSubmit = useCallback(() => {
    if (adminPassword === ADMIN_PASSWORD) {
      setIsPasswordModalOpen(false);
      setAdminPassword("");
      setPasswordError(false);
      toast.success("Admin access granted");
      onOpenAdmin?.();
    } else {
      setPasswordError(true);
      toast.error("Incorrect password");
      setTimeout(() => setPasswordError(false), 2000);
    }
  }, [adminPassword, onOpenAdmin]);

  const navLinks = [
    { href: "#collection", label: "Collection" },
    { href: "#organic", label: "Organic" },
    { href: "#vault", label: "Vault" },
    { href: "#about", label: "Atelier" },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      toast.info(`Searching for "${searchQuery}"...`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500 bg-black/60 backdrop-blur-md border-b border-white/10 py-3"
      >
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Left Side - Logo */}
            <div className="flex items-center gap-3 group cursor-pointer" onClick={handleLogoClick}>
              <div className="relative">
                {/* Subtle golden glow behind logo */}
                <motion.div 
                  animate={{ opacity: [0.2, 0.4, 0.2] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 blur-md bg-gold-500/30 rounded-full scale-125" 
                />
                <img
                  src="/upload/IMG_9972.png"
                  alt="Aurnik"
                  className="relative h-11 sm:h-14 md:h-16 w-auto object-contain transition-all duration-300 group-hover:scale-105"
                  style={{ filter: "drop-shadow(0 0 8px rgba(197, 160, 89, 0.4))" }}
                />
              </div>
              <span className="hidden sm:inline-block text-[9px] uppercase tracking-[0.2em] text-white/40 font-light border-l border-white/20 pl-3">
                Est. 2026
              </span>
            </div>

            {/* Center - Nav Links (Desktop) */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollToSection(link.href)}
                  className={`text-[11px] uppercase tracking-[0.15em] transition-colors duration-300 relative group cursor-pointer bg-transparent border-none ${
                    activeSection === link.href.slice(1) 
                      ? "text-gold-400" 
                      : "text-white/60 hover:text-gold-400"
                  }`}
                >
                  {link.label}
                  <span className={`absolute -bottom-1 left-0 h-px bg-gold-400 transition-all duration-300 ${
                    activeSection === link.href.slice(1) ? "w-full" : "w-0 group-hover:w-full"
                  }`} />
                </button>
              ))}
            </div>

            {/* Right Side - Actions */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Search */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white/60 hover:text-gold-400 hover:bg-white/5 h-9 w-9 relative overflow-hidden group"
                  onClick={() => setIsSearchOpen(true)}
                  title="Search products"
                >
                  <Search className="h-4 w-4 relative z-10" />
                  <motion.div 
                    className="absolute inset-0 bg-gold-500/10 rounded-full"
                    initial={{ scale: 0 }}
                    whileHover={{ scale: 1.5 }}
                    transition={{ duration: 0.3 }}
                  />
                </Button>
              </motion.div>

              {/* Cart */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative text-white/60 hover:text-gold-400 hover:bg-white/5 h-9 w-9"
                  onClick={() => setCartOpen(true)}
                  title={`Shopping cart - ${cartCount} items`}
                >
                  <ShoppingBag className="h-4 w-4" />
                  <AnimatePresence>
                    {cartCount > 0 && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute -top-0.5 -right-0.5"
                      >
                        <Badge className="h-4 w-4 p-0 flex items-center justify-center bg-gold-500 text-black text-[9px] font-bold rounded-full">
                          {cartCount}
                        </Badge>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Button>
              </motion.div>

              {/* Auth - Show login button or user info */}
              {isAuthenticated && user ? (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="hidden sm:flex items-center space-x-2"
                >
                  <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:border-gold-500/30 transition-colors">
                    <User className="h-3.5 w-3.5 text-gold-400" />
                    <span className="text-xs text-white/80">{user.name || "Member"}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onLogout}
                    className="text-white/50 hover:text-red-400 h-9 w-9"
                    title="Sign out"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="hidden sm:block"
                >
                  <Button
                    onClick={onLogin}
                    variant="outline"
                    size="sm"
                    className="border-gold-500/30 text-gold-400 hover:bg-gold-500/10 hover:text-gold-300"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Sign In
                  </Button>
                </motion.div>
              )}

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-white/60 hover:text-gold-400 h-9 w-9"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <AnimatePresence mode="wait">
                  {isMobileMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="h-5 w-5" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="h-5 w-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/95 backdrop-blur-md"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute left-0 top-0 bottom-0 w-72 bg-background border-r border-white/10 p-6 pt-20 overflow-y-auto"
            >
              {/* Brand in Mobile */}
              <div className="mb-8 pb-6 border-b border-white/10 flex items-center gap-3">
                <div className="relative">
                  <div className="absolute inset-0 blur-md bg-gold-500/20 rounded-full scale-110" />
                  <img
                    src="/upload/IMG_9972.png"
                    alt="Aurnik"
                    className="relative h-14 w-auto object-contain"
                    style={{ filter: "drop-shadow(0 0 8px rgba(197, 160, 89, 0.4))" }}
                  />
                </div>
                <span className="text-[9px] uppercase tracking-widest text-white/40">
                  Est. 2026
                </span>
              </div>

              {/* Nav Links */}
              <nav className="flex flex-col space-y-2">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.08, type: "spring", stiffness: 200 }}
                  >
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        scrollToSection(link.href);
                      }}
                      className={`w-full text-left text-base uppercase tracking-widest transition-colors py-3 px-4 rounded-lg border-b border-white/5 flex items-center justify-between group ${
                        activeSection === link.href.slice(1)
                          ? "text-gold-400 bg-gold-500/10"
                          : "text-white/70 hover:text-gold-400 hover:bg-white/5"
                      }`}
                    >
                      {link.label}
                      <motion.span
                        className="text-white/30 group-hover:text-gold-400 group-hover:translate-x-1 transition-transform"
                      >
                        →
                      </motion.span>
                    </button>
                  </motion.div>
                ))}
              </nav>

              {/* Quick Actions */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-8 pt-6 border-t border-white/10"
              >
                <div className="text-xs uppercase tracking-widest text-white/30 mb-4">
                  Quick Actions
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 border-white/20 text-white/70 hover:text-white"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsSearchOpen(true);
                    }}
                  >
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 border-white/20 text-white/70 hover:text-white"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setCartOpen(true);
                    }}
                  >
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    Cart ({cartCount})
                  </Button>
                </div>
              </motion.div>

              {/* Mobile Auth */}
              <div className="mt-6 pt-6 border-t border-white/10">
                {isAuthenticated && user ? (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-3 rounded-lg bg-white/5 border border-white/10">
                      <div className="w-10 h-10 rounded-full bg-gold-500/20 flex items-center justify-center">
                        <User className="h-5 w-5 text-gold-400" />
                      </div>
                      <div>
                        <span className="text-white block font-medium">{user.name || "Member"}</span>
                        <span className="text-xs text-white/50">{user.email}</span>
                      </div>
                    </div>
                    <Button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        onLogout?.();
                      }}
                      variant="outline"
                      className="w-full border-white/20 text-white/70 hover:text-white hover:border-red-500/50"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        onLogin?.();
                      }}
                      className="w-full bg-gold-500 hover:bg-gold-600 text-black font-medium py-6 shadow-lg shadow-gold-500/20"
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      Enter Member Vault
                    </Button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Admin Password Dialog */}
      <AnimatePresence>
        {isPasswordModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm"
            onClick={() => setIsPasswordModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md mx-4 p-6 rounded-2xl bg-neutral-900 border border-gold-500/30 shadow-2xl shadow-gold-500/10"
            >
              {/* Decorative glow */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-gold-500/10 via-transparent to-gold-500/5 pointer-events-none" />
              
              <div className="relative">
                {/* Header */}
                <div className="text-center mb-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                    className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-lg shadow-gold-500/30"
                  >
                    <ShieldCheck className="h-8 w-8 text-black" />
                  </motion.div>
                  <h3 className="font-serif text-2xl text-white mb-1">Admin Access</h3>
                  <p className="text-sm text-white/50">Enter password to continue</p>
                </div>

                {/* Password Input */}
                <div className="space-y-4">
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                    <Input
                      type="password"
                      value={adminPassword}
                      onChange={(e) => {
                        setAdminPassword(e.target.value);
                        setPasswordError(false);
                      }}
                      onKeyDown={(e) => e.key === "Enter" && handlePasswordSubmit()}
                      placeholder="Enter admin password"
                      className={`pl-12 pr-4 py-3 bg-white/5 border ${
                        passwordError 
                          ? "border-red-500 focus:border-red-500" 
                          : "border-white/10 focus:border-gold-500"
                      } rounded-xl text-white placeholder:text-white/40 transition-colors`}
                      autoFocus
                    />
                  </div>
                  
                  {passwordError && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-400 text-sm text-center"
                    >
                      Incorrect password. Please try again.
                    </motion.p>
                  )}

                  {/* Buttons */}
                  <div className="flex gap-3 pt-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsPasswordModalOpen(false);
                        setAdminPassword("");
                        setPasswordError(false);
                      }}
                      className="flex-1 border-white/20 text-white/70 hover:text-white hover:bg-white/5"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handlePasswordSubmit}
                      className="flex-1 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-black font-medium"
                    >
                      <Lock className="h-4 w-4 mr-2" />
                      Unlock
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Dialog */}
      <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
        <DialogContent className="bg-background border-white/10 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white font-serif text-xl">
              Search Collection
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search dresses, fabrics, organic items..."
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-gold-500/50 transition-colors"
                autoFocus
              />
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="ghost"
                className="flex-1 text-white/60"
                onClick={() => setIsSearchOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gold-500 hover:bg-gold-600 text-black"
              >
                Search
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
