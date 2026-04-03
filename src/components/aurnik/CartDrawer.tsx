"use client";

import React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Sparkles,
  Clock,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCartStore } from "@/lib/store";
import { toast } from "sonner";

export default function CartDrawer() {
  const {
    items,
    offer,
    isOpen,
    setOpen,
    removeItem,
    updateQuantity,
    clearCart,
    getTotalItems,
    getSubtotal,
    getDiscount,
    getTotal,
  } = useCartStore();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: "BDT",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    toast.success("Proceeding to secure checkout...");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-background border-l border-white/10 shadow-luxury flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gold-500/20 flex items-center justify-center">
                    <ShoppingBag className="h-5 w-5 text-gold-400" />
                  </div>
                  <div>
                    <h2 className="font-serif text-xl text-white">Your Vault</h2>
                    <p className="text-xs text-white/50">
                      {getTotalItems()} {getTotalItems() === 1 ? "piece" : "pieces"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Offer Banner */}
            {offer && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mx-6 mt-4 p-4 rounded-xl bg-gold-500/10 border border-gold-500/20"
              >
                <div className="flex items-start gap-3">
                  <Sparkles className="h-5 w-5 text-gold-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-gold-400 mb-1">
                      {offer.title}
                    </div>
                    <div className="text-xs text-white/60">{offer.description}</div>
                    <div className="flex items-center gap-1 mt-2 text-xs text-white/40">
                      <Clock className="h-3 w-3" />
                      Expires in 2 hours
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Items */}
            <ScrollArea className="flex-grow p-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-4">
                    <ShoppingBag className="h-8 w-8 text-white/30" />
                  </div>
                  <h3 className="text-lg text-white/60 mb-2">Your vault is empty</h3>
                  <p className="text-sm text-white/40 mb-6">
                    Discover our curated collection of handmade pieces
                  </p>
                  <div className="flex flex-col items-center">
                    <Button
                      onClick={() => setOpen(false)}
                      variant="outline"
                      className="border-white/20 text-white hover:bg-white/5"
                    >
                      Explore Collection
                    </Button>
                    <span className="mt-2 text-[10px] text-white/30">
                      Browse dresses & organic goods
                    </span>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item, index) => (
                    <motion.div
                      key={`${item.productId}-${item.materialId}`}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/10"
                    >
                      {/* Image */}
                      <div className="w-20 h-20 rounded-lg bg-white/10 flex-shrink-0 overflow-hidden">
                        {item.productImage ? (
                          <Image
                            src={item.productImage}
                            alt={item.productName}
                            width={80}
                            height={80}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Sparkles className="h-6 w-6 text-white/20" />
                          </div>
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex-grow">
                        <h4 className="text-sm font-medium text-white mb-1">
                          {item.productName}
                        </h4>
                        {item.materialName && (
                          <p className="text-xs text-white/50 mb-2">
                            {item.materialName}
                          </p>
                        )}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center border border-white/10 rounded-lg overflow-hidden">
                            <button
                              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="w-8 h-8 flex items-center justify-center text-white/60 hover:text-white disabled:opacity-30"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-8 text-center text-sm text-white">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center text-white/60 hover:text-white"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <span className="text-sm font-medium text-gold-400">
                            {formatPrice(item.totalPrice)}
                          </span>
                        </div>
                      </div>

                      {/* Remove */}
                      <button
                        onClick={() => {
                          removeItem(item.productId);
                          toast.info("Item removed from cart");
                        }}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </ScrollArea>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-white/10 space-y-4">
                {/* Subtotal */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/60">Subtotal</span>
                  <span className="text-white">{formatPrice(getSubtotal())}</span>
                </div>

                {/* Discount */}
                {getDiscount() > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gold-400">Offer Discount</span>
                    <span className="text-gold-400">-{formatPrice(getDiscount())}</span>
                  </div>
                )}

                {/* Total */}
                <div className="flex items-center justify-between pt-2 border-t border-white/10">
                  <span className="text-white font-medium">Total</span>
                  <span className="font-serif text-2xl text-gold-400">
                    {formatPrice(getTotal())}
                  </span>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="flex flex-col items-center">
                    <Button
                      variant="outline"
                      onClick={clearCart}
                      className="w-full border-white/20 text-white/60 hover:text-white hover:bg-white/5"
                    >
                      Clear Vault
                    </Button>
                    <span className="mt-1 text-[9px] text-white/30">
                      Remove all items
                    </span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Button 
                      onClick={handleCheckout}
                      className="w-full bg-gold-500 hover:bg-gold-600 text-black"
                    >
                      Checkout
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                    <span className="mt-1 text-[9px] text-white/30">
                      Secure payment via SSLCommerz
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2 pt-2">
                  <Shield className="h-3 w-3 text-white/30" />
                  <p className="text-xs text-center text-white/30">
                    Secure checkout with SSLCommerz
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
