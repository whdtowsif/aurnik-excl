"use client";

import React from "react";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

interface WhatsAppConciergeProps {
  currentProduct?: string;
  currentFabric?: string;
  phoneNumber?: string;
}

export default function WhatsAppConcierge({
  currentProduct,
  currentFabric,
  phoneNumber = "8801744688077",
}: WhatsAppConciergeProps) {
  const message = encodeURIComponent(
    currentProduct
      ? `Hello Aurnik Liaison, I was just discussing the "${currentProduct}"${currentFabric ? ` in "${currentFabric}"` : ""} with the AI Concierge. I would like to finalize my custom requirements.`
      : "Hello Aurnik Liaison, I would like to inquire about your collection and custom requirements."
  );

  const waLink = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 0.5 }}
      className="fixed bottom-6 right-6 z-40 group"
    >
      {/* Tooltip */}
      <span className="absolute -top-10 right-0 scale-0 transition-all rounded-lg bg-white/10 backdrop-blur-md px-4 py-2 text-xs text-gold-400 group-hover:scale-100 border border-white/20 uppercase tracking-widest whitespace-nowrap">
        VIP Liaison
      </span>

      <a
        href={waLink}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col items-center justify-center w-14 h-14 bg-[#25D366] rounded-full shadow-lg transition-all hover:scale-110 hover:shadow-xl active:scale-95 relative overflow-hidden"
        title="Contact us on WhatsApp for VIP assistance"
      >
        <span className="absolute inset-0 rounded-full animate-ping bg-white/20 opacity-75" />
        <MessageCircle className="h-6 w-6 text-white relative z-10" />
      </a>
      <span className="mt-2 text-[10px] text-white/50 text-center block">
        WhatsApp
      </span>
    </motion.div>
  );
}
