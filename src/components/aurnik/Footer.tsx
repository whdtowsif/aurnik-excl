"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Instagram, Facebook, Youtube, Mail, MapPin, Phone, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        toast.success("Welcome to Aurnik! Check your email for exclusive offers.");
        setEmail("");
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to subscribe");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const footerLinks = {
    collection: [
      { label: "Handmade Dresses", href: "#collection", desc: "Artisanal fashion" },
      { label: "Organic Corner", href: "#organic", desc: "Premium goods" },
      { label: "AR Try-On", href: "#", desc: "Virtual fitting" },
      { label: "New Arrivals", href: "#", desc: "Latest pieces" },
    ],
    about: [
      { label: "Our Story", href: "#about", desc: "Bangladesh heritage" },
      { label: "Artisan Process", href: "#about", desc: "120+ hours craft" },
      { label: "Sustainability", href: "#about", desc: "Eco-conscious" },
      { label: "Press", href: "#about", desc: "Media coverage" },
    ],
    support: [
      { label: "Size Guide", href: "#", desc: "Find your fit" },
      { label: "Shipping", href: "#", desc: "Worldwide delivery" },
      { label: "Returns", href: "#", desc: "Easy returns" },
      { label: "Contact", href: "#", desc: "Get in touch" },
    ],
  };

  return (
    <footer className="relative bg-black border-t border-white/10 mt-auto">
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-6 group">
              <div className="relative h-12 md:h-14 w-auto">
                <Image
                  src="/upload/IMG_9972.png"
                  alt="Aurnik - Artisanal Luxury from Bangladesh"
                  width={140}
                  height={56}
                  className="h-full w-auto object-contain group-hover:opacity-90 transition-opacity duration-300 drop-shadow-lg"
                  priority
                />
              </div>
            </Link>
            <p className="text-white/50 max-w-sm mb-6 leading-relaxed">
              Premium handmade fashion and organic luxury goods from Bangladesh.
              Each piece is a 120+ hour journey of artisanal craftsmanship, 
              delivered to your doorstep.
            </p>
            <div className="flex items-center gap-4">
              {[
                { icon: Instagram, href: "#", label: "Instagram" },
                { icon: Facebook, href: "#", label: "Facebook" },
                { icon: Youtube, href: "#", label: "YouTube" },
                { icon: Mail, href: "#", label: "Email" },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-gold-400 hover:border-gold-500/30 transition-colors"
                  title={label}
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>

            {/* Newsletter Subscription */}
            <div className="mt-8">
              <h4 className="text-xs uppercase tracking-widest text-gold-400 mb-4">
                Join the Inner Circle
              </h4>
              <p className="text-white/50 text-sm mb-4">
                Subscribe for exclusive access to new collections, artisan stories, and member-only offers.
              </p>
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="bg-white/5 border-white/10 focus:border-gold-500 text-white placeholder:text-white/40"
                />
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-gold-500 hover:bg-gold-600 text-black shrink-0"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </form>
            </div>
          </div>

          {/* Collection */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-gold-400 mb-4">
              Collection
            </h4>
            <ul className="space-y-3">
              {footerLinks.collection.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="group flex flex-col"
                  >
                    <span className="text-sm text-white/50 hover:text-white transition-colors">
                      {link.label}
                    </span>
                    <span className="text-[10px] text-white/30 group-hover:text-white/50 transition-colors">
                      {link.desc}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-gold-400 mb-4">
              About
            </h4>
            <ul className="space-y-3">
              {footerLinks.about.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="group flex flex-col"
                  >
                    <span className="text-sm text-white/50 hover:text-white transition-colors">
                      {link.label}
                    </span>
                    <span className="text-[10px] text-white/30 group-hover:text-white/50 transition-colors">
                      {link.desc}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-gold-400 mb-4">
              Support
            </h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="group flex flex-col"
                  >
                    <span className="text-sm text-white/50 hover:text-white transition-colors">
                      {link.label}
                    </span>
                    <span className="text-[10px] text-white/30 group-hover:text-white/50 transition-colors">
                      {link.desc}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Story Sections */}
        <div className="mt-16 pt-8 border-t border-white/10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Our Story */}
            <div>
              <h4 className="font-serif text-lg text-gold-400 mb-3">Our Story</h4>
              <p className="text-sm text-white/50 leading-relaxed">
                Born in the heart of Bangladesh, Aurnik celebrates the timeless art of Jamdani weaving—a UNESCO-recognized heritage craft passed down through generations. Our master artisans in Narayanganj transform the finest cotton threads into ethereal fabrics, each telling stories of patience, precision, and devotion. Founded in 2026, we bridge ancient craftsmanship with contemporary luxury, bringing Bangladesh&apos;s textile legacy to discerning collectors worldwide.
              </p>
            </div>

            {/* Artisan Process */}
            <div>
              <h4 className="font-serif text-lg text-gold-400 mb-3">Artisan Process</h4>
              <p className="text-sm text-white/50 leading-relaxed">
                Every Aurnik piece undergoes a meticulous 120+ hour journey. It begins with pattern drafting and fabric sourcing from heritage weavers. Our artisans then precision-cut each component before the most intensive phase—hand-stitching and embroidery, where days of dedicated work bring intricate designs to life. Quality assurance follows, with each piece examined under natural light. Finally, your garment is lovingly packaged in zero-waste materials, complete with a certificate of authenticity.
              </p>
            </div>

            {/* Sustainability */}
            <div>
              <h4 className="font-serif text-lg text-gold-400 mb-3">Sustainability</h4>
              <p className="text-sm text-white/50 leading-relaxed">
                Aurnik is committed to ethical luxury. We use organic cotton grown without pesticides, natural dyes derived from indigo, turmeric, and madder root, and partner with fair-wage artisan cooperatives. Our zero-waste packaging features handcrafted jute boxes from local farmers. We offset our carbon footprint through mangrove restoration in the Sundarbans. Each purchase supports over 50 artisan families, preserving craft traditions while providing economic independence.
              </p>
            </div>

            {/* Press */}
            <div>
              <h4 className="font-serif text-lg text-gold-400 mb-3">Press</h4>
              <p className="text-sm text-white/50 leading-relaxed">
                Featured in Vogue India&apos;s &quot;Sustainable Luxury&quot; edition, Elle Bangladesh&apos;s &quot;Heritage Weavers&quot; spotlight, and The Daily Star&apos;s &quot;Made in Bangladesh&quot; series. Our Midnight Jamdani collection was showcased at London Fashion Week 2025. Recent coverage includes BBC World&apos;s &quot;Crafted with Love&quot; documentary and Forbes Asia&apos;s &quot;30 Under 30&quot; recognition for our founder&apos;s work in preserving indigenous craft.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-white/50">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gold-400" />
              <span>House 42, Road 5, Dhanmondi, Dhaka 1205, Bangladesh</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gold-400" />
              <span>+880 1744-688077</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-gold-400" />
              <span>concierge@aurnik.com</span>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/30">
            © {currentYear} Aurnik. All rights reserved. Handcrafted in Bangladesh.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="#"
              className="text-xs text-white/30 hover:text-white/60 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              className="text-xs text-white/30 hover:text-white/60 transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="#"
              className="text-xs text-white/30 hover:text-white/60 transition-colors"
            >
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
