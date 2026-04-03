"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface AIChatbotProps {
  onSendMessage: (message: string) => Promise<string>;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function AIChatbot({
  onSendMessage,
  isOpen = false,
  onOpenChange,
}: AIChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Welcome to Aurnik. I am your personal Concierge. How may I assist you today? Perhaps you have questions about our heritage fabrics, sizing guidance, or the artisanal process?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSend = useCallback(async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await onSendMessage(input.trim());
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "I apologize, but I am experiencing a moment of reflection. Please try again or contact our WhatsApp liaison for immediate assistance.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, onSendMessage]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickQuestions = [
    "Tell me about Jamdani fabric",
    "How long does delivery take?",
    "Can I customize the color?",
  ];

  return (
    <>
      {/* Floating Button - Enhanced with larger size and light background */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 200 }}
        className="fixed bottom-6 right-24 z-40 group"
      >
        <div className="flex flex-col items-center">
          <motion.button
            onClick={() => onOpenChange?.(!isOpen)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`relative w-20 h-20 rounded-full transition-all duration-300 ${
              isOpen
                ? "bg-white/20 backdrop-blur-md border-2 border-white/30"
                : "bg-white/90 backdrop-blur-sm border-2 border-gold-400/50 shadow-[0_0_30px_rgba(197,160,89,0.4)]"
            }`}
            title="Chat with AI Concierge"
          >
            {isOpen ? (
              <X className="h-6 w-6 text-white mx-auto" />
            ) : (
              <>
                {/* Mascot Image */}
                <img
                  src="/upload/IMG_0003.png"
                  alt="Aurnik Concierge"
                  className="h-14 w-14 rounded-full object-cover mx-auto border-2 border-gold-400/30"
                />
                {/* Animated ring */}
                <motion.div
                  animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 rounded-full border-2 border-gold-400/40"
                />
              </>
            )}
          </motion.button>
          {!isOpen && (
            <span className="mt-2 text-[10px] text-white/70 text-center max-w-[80px] font-medium">
              AI Concierge
            </span>
          )}
        </div>
        {/* Hover Tooltip */}
        {!isOpen && (
          <motion.span
            initial={{ opacity: 0, y: 5 }}
            whileHover={{ opacity: 1, y: 0 }}
            className="absolute -top-12 right-0 whitespace-nowrap px-4 py-2 rounded-xl bg-white/95 backdrop-blur-md text-xs text-neutral-800 font-medium shadow-lg border border-gold-400/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
          >
            Chat with Concierge
            <span className="absolute -bottom-1 right-6 w-2 h-2 bg-white/95 rotate-45 border-r border-b border-gold-400/20" />
          </motion.span>
        )}
      </motion.div>

      {/* Chat Window - Enhanced UI */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-28 right-6 z-40 w-[400px] max-w-[calc(100vw-48px)] overflow-hidden rounded-2xl bg-gradient-to-b from-neutral-900/95 to-black/95 backdrop-blur-xl border border-gold-500/20 shadow-[0_0_50px_rgba(197,160,89,0.15)]"
          >
            {/* Header - Enhanced */}
            <div className="relative p-5 border-b border-gold-500/20 bg-gradient-to-r from-gold-500/10 via-transparent to-gold-500/5">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500/50 to-transparent" />
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-gold-500/60 flex items-center justify-center bg-white/90 shadow-[0_0_20px_rgba(197,160,89,0.3)]">
                    <img
                      src="/upload/IMG_0003.png"
                      alt="Aurnik Concierge"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  {/* Online indicator */}
                  <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-neutral-900" />
                </div>
                <div>
                  <div className="font-serif text-lg text-white">Aurnik Concierge</div>
                  <div className="text-xs text-gold-400/80 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    Online • AI Powered
                  </div>
                </div>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea ref={scrollRef} className="h-80 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {message.role === "assistant" && (
                      <div className="w-8 h-8 rounded-full overflow-hidden border border-gold-500/30 mr-2 shrink-0 bg-white/90">
                        <img
                          src="/upload/IMG_0003.png"
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        message.role === "user"
                          ? "bg-gradient-to-r from-gold-500/30 to-gold-600/20 text-white rounded-br-sm border border-gold-500/30"
                          : "bg-white/10 text-white/90 rounded-bl-sm border border-white/10 backdrop-blur-sm"
                      }`}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {message.content}
                      </p>
                    </div>
                  </motion.div>
                ))}
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start items-start"
                  >
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-gold-500/30 mr-2 shrink-0 bg-white/90">
                      <img
                        src="/upload/IMG_0003.png"
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="bg-white/10 border border-white/10 rounded-2xl rounded-bl-sm px-4 py-3 backdrop-blur-sm">
                      <div className="flex items-center gap-2 text-white/50">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm">Reflecting...</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </ScrollArea>

            {/* Quick Questions */}
            {messages.length <= 1 && (
              <div className="px-4 pb-3">
                <div className="text-xs text-gold-400/60 mb-2 font-medium">Quick questions:</div>
                <div className="flex flex-wrap gap-2">
                  {quickQuestions.map((q) => (
                    <button
                      key={q}
                      onClick={() => setInput(q)}
                      className="text-xs px-3 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 hover:bg-gold-500/20 hover:text-gold-300 transition-all duration-200"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input - Enhanced */}
            <div className="p-4 border-t border-gold-500/20 bg-gradient-to-t from-black/50 to-transparent">
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Ask about fabrics, sizing..."
                  className="flex-1 bg-white/5 border-gold-500/30 text-white placeholder:text-white/40 focus:border-gold-500 focus:ring-gold-500/20 rounded-xl"
                />
                <Button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-black px-5 rounded-xl shadow-lg shadow-gold-500/20 disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <div className="text-center mt-2">
                <span className="text-[10px] text-white/40">Press Enter to send</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
