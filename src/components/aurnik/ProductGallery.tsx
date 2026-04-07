"use client";

import React from "react";
import { motion } from "framer-motion";
import ProductCard from "./ProductCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  featured?: boolean;
}

interface ProductGalleryProps {
  products: Product[];
  title?: string;
  subtitle?: string;
}

export default function ProductGallery({
  products,
  title = "The Collection",
  subtitle = "Handmade with intention",
}: ProductGalleryProps) {
  const clothingProducts = products.filter((p) => p.category === "Clothing");
  const organicProducts = products.filter((p) => p.category === "Organic");
  const featuredProducts = products.filter((p) => p.featured);

  return (
    <section id="collection" className="py-24 relative">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent" />

      <div className="relative container mx-auto px-4 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-xs uppercase tracking-[0.3em] text-gold-400 mb-4 block">
            Curated Excellence
          </span>
          <h2 className="font-serif text-4xl md:text-5xl text-white mb-4">
            {title}
          </h2>
          <p className="text-white/50 max-w-lg mx-auto">
            {subtitle}
          </p>
        </motion.div>

        {/* Tabs */}
        <Tabs defaultValue="featured" className="w-full">
          <div className="flex justify-center mb-12">
            <TabsList className="bg-white/5 border border-white/10 p-1">
              <TabsTrigger
                value="featured"
                className="data-[state=active]:bg-gold-500/20 data-[state=active]:text-gold-400 text-white/60 text-xs uppercase tracking-widest px-6"
              >
                Featured
              </TabsTrigger>
              <TabsTrigger
                value="clothing"
                className="data-[state=active]:bg-gold-500/20 data-[state=active]:text-gold-400 text-white/60 text-xs uppercase tracking-widest px-6"
              >
                Clothing
              </TabsTrigger>
              <TabsTrigger
                value="organic"
                className="data-[state=active]:bg-gold-500/20 data-[state=active]:text-gold-400 text-white/60 text-xs uppercase tracking-widest px-6"
              >
                Organic Corner
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Featured Tab */}
          <TabsContent value="featured">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featuredProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          </TabsContent>

          {/* Clothing Tab */}
          <TabsContent value="clothing">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {clothingProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          </TabsContent>

          {/* Organic Tab */}
          <TabsContent value="organic" id="organic">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {organicProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
