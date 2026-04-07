"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Eye, ShoppingBag, Sparkles, Heart, ExternalLink, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useCartStore } from "@/lib/store";

interface Product {
  id: string;
  name: string;
  basePrice: number;
  description: string;
  category: string;
  imageUrl?: string | null;
  isLimited: boolean;
  totalAllocation: number;
  remainingStock: number;
  arModelUrl?: string | null;
}

interface ProductCardProps {
  product: Product;
  index?: number;
  onViewDetails?: () => void;
  onARTryOn?: () => void;
}

export default function ProductCard({ product, index = 0, onViewDetails, onARTryOn }: ProductCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const { addItem, setOpen: setCartOpen } = useCartStore();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: "BDT",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const showScarcity = product.isLimited && product.remainingStock <= 5;
  const isClothingProduct = product.category === "Clothing";

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    onViewDetails?.();
  };

  const handleARTryOn = (e: React.MouseEvent) => {
    e.stopPropagation();
    onARTryOn?.();
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAddingToCart(true);
    
    try {
      addItem({
        productId: product.id,
        productName: product.name,
        productImage: product.imageUrl || undefined,
        basePrice: product.basePrice,
        materialId: undefined,
        materialName: undefined,
        surcharge: 0,
        quantity: 1,
        totalPrice: product.basePrice,
      });
      
      toast.success(`Added ${product.name} to cart!`);
      
      setTimeout(() => {
        setCartOpen(true);
      }, 500);
    } catch (error) {
      toast.error("Failed to add to cart");
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.5, ease: "easeOut" }}
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 transition-all duration-500 hover:border-gold-500/30 hover:shadow-[0_0_60px_rgba(197,160,89,0.15)]">
        {/* Shimmer effect on hover */}
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: isHovered ? "100%" : "-100%" }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent z-10 pointer-events-none"
        />
        
        {/* Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent" />
          
          {/* Skeleton loader */}
          {!imageLoaded && product.imageUrl && (
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 animate-pulse" />
          )}
          
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className={`object-cover transition-all duration-700 group-hover:scale-105 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setImageLoaded(true)}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gold-500/10 via-transparent to-gold-500/5">
              <div className="text-center">
                <motion.div 
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center"
                >
                  <Sparkles className="h-8 w-8 text-gold-400/50" />
                </motion.div>
                <span className="text-sm text-white/30">Preview Coming Soon</span>
              </div>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Quick Actions - Enhanced */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
            transition={{ duration: 0.3, staggerChildren: 0.05 }}
            className="absolute bottom-4 left-4 right-4 flex flex-col gap-2"
          >
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
              transition={{ delay: 0.05 }}
              className="flex flex-col items-center"
            >
              <Button
                size="sm"
                onClick={handleViewDetails}
                className="w-full bg-gold-500 hover:bg-gold-600 text-black text-xs uppercase tracking-wider shadow-lg shadow-gold-500/20"
              >
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </Button>
              <span className="mt-1 text-[10px] text-white/40 text-center">
                See fabrics, sizing & AR try-on
              </span>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
              transition={{ delay: 0.1 }}
              className="flex gap-2"
            >
              {isClothingProduct && (
                <div className="flex flex-col items-center flex-1">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={handleARTryOn}
                    className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:border-gold-500/30 text-xs"
                    title="Try on in AR using your phone camera"
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    AR Try-On
                  </Button>
                  <span className="mt-1 text-[9px] text-white/30 text-center">
                    Camera required
                  </span>
                </div>
              )}
              <div className={`${isClothingProduct ? "flex-1" : "w-full"} flex flex-col items-center`}>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={handleAddToCart}
                  disabled={isAddingToCart}
                  className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:border-gold-500/30 text-xs disabled:opacity-50"
                  title="Add this piece to your collection"
                >
                  <ShoppingBag className="h-3 w-3 mr-1" />
                  {isAddingToCart ? "Adding..." : "Add to Cart"}
                </Button>
                <span className="mt-1 text-[9px] text-white/30 text-center">
                  Reserve your piece
                </span>
              </div>
            </motion.div>
          </motion.div>

          {/* Like Button - Enhanced with animation */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              setIsLiked(!isLiked);
              if (!isLiked) {
                toast.success("Added to wishlist");
              }
            }}
            className={`absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-sm ${
              isLiked
                ? "bg-red-500/20 border border-red-500/30 text-red-400"
                : "bg-black/30 border border-white/10 text-white/60 hover:text-white hover:bg-black/50"
            }`}
            title={isLiked ? "Remove from wishlist" : "Add to wishlist"}
          >
            <motion.div
              initial={false}
              animate={{ scale: isLiked ? [1, 1.3, 1] : 1 }}
              transition={{ duration: 0.3 }}
            >
              <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
            </motion.div>
          </motion.button>

          {/* Share Button */}
          <motion.button
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : 10 }}
            transition={{ delay: 0.15 }}
            onClick={(e) => {
              e.stopPropagation();
              handleShare(e);
            }}
            className="absolute top-4 right-16 w-9 h-9 rounded-full bg-black/30 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-black/50 transition-colors"
            title="Share product"
          >
            <Share2 className="h-4 w-4" />
          </motion.button>

          {/* Badges - Staggered entrance */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {product.isLimited && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Badge className="bg-gold-500/20 backdrop-blur-md text-gold-300 border border-gold-500/30 text-[10px] uppercase tracking-wider px-3 py-1">
                  Limited Edition
                </Badge>
              </motion.div>
            )}
            {isClothingProduct && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 }}
              >
                <Badge className="bg-purple-500/20 backdrop-blur-md text-purple-300 border border-purple-500/30 text-[10px] uppercase tracking-wider px-3 py-1">
                  AR Ready
                </Badge>
              </motion.div>
            )}
          </div>

          {/* Category Badge */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="absolute top-14 left-4"
          >
            <Badge variant="outline" className="bg-black/30 backdrop-blur-md border-white/10 text-white/70 text-[10px] uppercase tracking-wider px-3 py-1">
              {product.category}
            </Badge>
          </motion.div>
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="font-serif text-lg text-white group-hover:text-gold-400 transition-colors duration-300 mb-1 line-clamp-1">
                {product.name}
              </h3>
              <p className="text-sm text-white/50 line-clamp-2 leading-relaxed">
                {product.description}
              </p>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="font-serif text-xl text-gold-400">
                {formatPrice(product.basePrice)}
              </div>
              <div className="text-[10px] text-white/40 uppercase tracking-wider mt-0.5">
                Starting from
              </div>
            </div>
          </div>

          {/* Scarcity Indicator - Enhanced */}
          {showScarcity && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-4 pt-4 border-t border-white/10 overflow-hidden"
            >
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                </span>
                <span className="text-xs text-white/70 italic flex-1">
                  {product.remainingStock === 1
                    ? "The final piece of this artisanal run"
                    : `Only ${product.remainingStock} pieces remaining`}
                </span>
              </div>
              
              {/* Progress bar showing allocation */}
              <div className="mt-2 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(product.remainingStock / product.totalAllocation) * 100}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="h-full bg-gradient-to-r from-red-500/80 to-gold-500/80 rounded-full"
                />
              </div>
            </motion.div>
          )}

          {/* Click to View Indicator */}
          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-widest text-white/30">
              Click to explore
            </span>
            <motion.div 
              whileHover={{ x: 3 }}
              className="flex items-center gap-1 text-[10px] uppercase tracking-widest text-gold-400/60 group-hover:text-gold-400 transition-colors cursor-pointer"
            >
              <span>View Details</span>
              <ExternalLink className="h-3 w-3 ml-1" />
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
