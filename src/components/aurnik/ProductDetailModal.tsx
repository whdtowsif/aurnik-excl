"use client";

import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Heart,
  Share2,
  Eye,
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Clock,
  Package,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCartStore } from "@/lib/store";
import { toast } from "sonner";
import ARViewer from "./ARViewer";

interface Material {
  id: string;
  materialName: string;
  origin: string;
  qualityGrade: string;
  surcharge: number;
  description?: string;
}

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
  fabricOptions?: string | null;
}

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  materials: Material[];
}

function ProductDetailContent({
  product,
  onClose,
  materials,
}: {
  product: Product;
  onClose: () => void;
  materials: Material[];
}) {
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [isAROpen, setIsAROpen] = useState(false);

  const { addItem, setOpen: setCartOpen } = useCartStore();

  const availableMaterials = useMemo(() => {
    if (!product?.fabricOptions) return materials;
    try {
      const fabricIds = JSON.parse(product.fabricOptions);
      return materials.filter((m) => fabricIds.includes(m.id));
    } catch {
      return materials;
    }
  }, [product, materials]);

  const [selectedMaterialId, setSelectedMaterialId] = useState<string | null>(
    availableMaterials[0]?.id || null
  );

  const selectedMaterial = useMemo(() => {
    return availableMaterials.find((m) => m.id === selectedMaterialId) || null;
  }, [availableMaterials, selectedMaterialId]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: "BDT",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getTotalPrice = () => {
    if (!product) return 0;
    return (product.basePrice + (selectedMaterial?.surcharge || 0)) * quantity;
  };

  const handleAddToCart = () => {
    if (!product) return;

    if (product.category !== "Clothing" && availableMaterials.length === 0) {
      addItem({
        productId: product.id,
        productName: product.name,
        productImage: product.imageUrl || undefined,
        basePrice: product.basePrice,
        materialId: undefined,
        materialName: undefined,
        surcharge: 0,
        quantity,
        totalPrice: product.basePrice * quantity,
      });

      setAddedToCart(true);
      toast.success(`Added ${quantity} ${quantity > 1 ? "pieces" : "piece"} of ${product.name} to cart`);

      setTimeout(() => {
        setAddedToCart(false);
        setCartOpen(true);
      }, 1000);
      return;
    }

    if (availableMaterials.length > 0 && !selectedMaterial) {
      toast.error("Please select a fabric option");
      return;
    }

    addItem({
      productId: product.id,
      productName: product.name,
      productImage: product.imageUrl || undefined,
      basePrice: product.basePrice,
      materialId: selectedMaterial?.id,
      materialName: selectedMaterial?.materialName,
      surcharge: selectedMaterial?.surcharge || 0,
      quantity,
      totalPrice: getTotalPrice(),
    });

    setAddedToCart(true);
    const materialText = selectedMaterial ? ` in ${selectedMaterial.materialName}` : "";
    toast.success(`Added ${quantity} ${quantity > 1 ? "pieces" : "piece"} of ${product.name}${materialText} to cart`);

    setTimeout(() => {
      setAddedToCart(false);
      setCartOpen(true);
    }, 1000);
  };

  const handleShare = async () => {
    if (!product) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${product.name} - Aurnik`,
          text: product.description,
          url: window.location.href,
        });
      } catch {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard");
    }
  };

  const showScarcity = product.isLimited && product.remainingStock <= 5;
  const isOrganicProduct = product.category === "Organic";
  const isClothingProduct = product.category === "Clothing";

  return (
    <>
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: "spring", damping: 25 }}
        className="relative w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-2xl bg-background border border-white/10"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-colors"
          title="Close product details"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Image/AR Section */}
          <div className="relative aspect-square lg:aspect-auto lg:h-[90vh] bg-gradient-to-br from-white/10 via-white/5 to-transparent">
            {/* Product Image Placeholder */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center">
                  <Sparkles className="h-12 w-12 text-gold-400/50" />
                </div>
                <span className="text-white/30">Preview Coming Soon</span>
                <p className="text-xs text-white/20 mt-1">{product.name}</p>
              </div>
            </div>

            {/* AR Button - Available for ALL clothing products */}
            {isClothingProduct && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center">
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  onClick={() => setIsAROpen(true)}
                  className="px-6 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center gap-2 hover:bg-white/20 transition-colors"
                  title="Try on in augmented reality using your phone camera"
                >
                  <Eye className="h-5 w-5" />
                  <span className="text-sm uppercase tracking-wider">AR Try-On</span>
                </motion.button>
                <span className="mt-2 text-[10px] text-white/40 text-center">
                  Use your phone camera to preview
                </span>
              </div>
            )}

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.isLimited && (
                <Badge className="bg-gold-500/20 backdrop-blur-md text-gold-300 border border-gold-500/30 text-[10px] uppercase tracking-wider px-3 py-1">
                  Limited Edition
                </Badge>
              )}
              {showScarcity && (
                <Badge className="bg-red-500/20 backdrop-blur-md text-red-300 border border-red-500/30 text-[10px] uppercase tracking-wider px-3 py-1">
                  Only {product.remainingStock} Left
                </Badge>
              )}
              {isOrganicProduct && (
                <Badge className="bg-green-500/20 backdrop-blur-md text-green-300 border border-green-500/30 text-[10px] uppercase tracking-wider px-3 py-1">
                  Organic
                </Badge>
              )}
              {isClothingProduct && (
                <Badge className="bg-purple-500/20 backdrop-blur-md text-purple-300 border border-purple-500/30 text-[10px] uppercase tracking-wider px-3 py-1">
                  AR Ready
                </Badge>
              )}
            </div>
          </div>

          {/* Details Section */}
          <ScrollArea className="h-[90vh] lg:h-auto">
            <div className="p-6 lg:p-8">
              {/* Header */}
              <div className="mb-6">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h2 className="font-serif text-3xl lg:text-4xl text-white">{product.name}</h2>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsLiked(!isLiked)}
                      className={`w-10 h-10 rounded-full border flex items-center justify-center transition-colors ${
                        isLiked
                          ? "bg-red-500/20 border-red-500/30 text-red-400"
                          : "border-white/10 text-white/50 hover:text-white"
                      }`}
                      title={isLiked ? "Remove from wishlist" : "Add to wishlist"}
                    >
                      <Heart className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`} />
                    </button>
                    <button
                      onClick={handleShare}
                      className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors"
                      title="Share this product"
                    >
                      <Share2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="flex items-baseline gap-3">
                  <span className="font-serif text-3xl text-gold-400">{formatPrice(product.basePrice)}</span>
                  <span className="text-sm text-white/40">Starting price</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-white/60 leading-relaxed mb-8">{product.description}</p>

              {/* Fabric/Material Selector - Only for clothing */}
              {!isOrganicProduct && availableMaterials.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-sm uppercase tracking-widest text-white/60 mb-2">Select Fabric</h3>
                  <p className="text-xs text-white/40 mb-4">Choose from our premium heritage fabrics</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {availableMaterials.map((material) => (
                      <button
                        key={material.id}
                        onClick={() => setSelectedMaterialId(material.id)}
                        className={`p-4 rounded-xl border text-left transition-all ${
                          selectedMaterialId === material.id
                            ? "bg-gold-500/10 border-gold-500/30"
                            : "bg-white/5 border-white/10 hover:border-white/20"
                        }`}
                        title={`${material.materialName} - ${material.origin} - ${material.qualityGrade}`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-white">{material.materialName}</span>
                          {selectedMaterialId === material.id && <Check className="h-4 w-4 text-gold-400" />}
                        </div>
                        <div className="text-xs text-white/50 mb-2">
                          {material.origin} • {material.qualityGrade}
                        </div>
                        {material.surcharge > 0 && (
                          <div className="text-sm text-gold-400">+{formatPrice(material.surcharge)}</div>
                        )}
                      </button>
                    ))}
                  </div>
                  <p className="mt-2 text-[10px] text-white/30">
                    Each fabric is hand-sourced from heritage weavers
                  </p>
                </div>
              )}

              {/* Quantity */}
              <div className="mb-8">
                <h3 className="text-sm uppercase tracking-widest text-white/60 mb-2">Quantity</h3>
                <p className="text-xs text-white/40 mb-4">Each piece is handmade to order</p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-white/10 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-12 h-12 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                      title="Decrease quantity"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <span className="w-16 text-center text-white font-medium">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-12 h-12 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                      title="Increase quantity"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-white/40">Total</div>
                    <div className="font-serif text-xl text-gold-400">{formatPrice(getTotalPrice())}</div>
                  </div>
                </div>
              </div>

              {/* Add to Cart Button with description */}
              <div className="flex flex-col items-stretch">
                <Button
                  onClick={handleAddToCart}
                  disabled={addedToCart}
                  className={`w-full py-6 text-sm uppercase tracking-widest transition-all ${
                    addedToCart ? "bg-green-500 hover:bg-green-500 text-white" : "bg-gold-500 hover:bg-gold-600 text-black"
                  }`}
                  title={addedToCart ? "Added to cart!" : "Add this piece to your collection"}
                >
                  {addedToCart ? (
                    <>
                      <Check className="h-5 w-5 mr-2" />
                      Added to Cart
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="h-5 w-5 mr-2" />
                      {isOrganicProduct ? "Add to Cart" : "Secure Piece"}
                    </>
                  )}
                </Button>
                <p className="mt-2 text-[10px] text-white/30 text-center">
                  {isOrganicProduct 
                    ? "Add this organic item to your collection" 
                    : "Reserve your handmade piece - 14 day artisanal process"}
                </p>
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-white/10">
                {[
                  { icon: Clock, label: "14-Day Delivery", desc: "Artisanal Process" },
                  { icon: Package, label: "Luxury Packaging", desc: "Gift Ready" },
                  { icon: Sparkles, label: "Handmade", desc: "120+ Hours" },
                ].map((feature) => (
                  <div key={feature.label} className="text-center">
                    <feature.icon className="h-5 w-5 mx-auto mb-2 text-gold-400" />
                    <div className="text-xs text-white/70">{feature.label}</div>
                    <div className="text-[10px] text-white/40">{feature.desc}</div>
                  </div>
                ))}
              </div>

              {/* Tabs */}
              <Tabs defaultValue="details" className="mt-8">
                <TabsList className="w-full bg-white/5 border border-white/10">
                  <TabsTrigger
                    value="details"
                    className="flex-1 data-[state=active]:bg-gold-500/20 data-[state=active]:text-gold-400 text-white/60 text-xs uppercase tracking-wider"
                  >
                    Details
                  </TabsTrigger>
                  <TabsTrigger
                    value="shipping"
                    className="flex-1 data-[state=active]:bg-gold-500/20 data-[state=active]:text-gold-400 text-white/60 text-xs uppercase tracking-wider"
                  >
                    Shipping
                  </TabsTrigger>
                  <TabsTrigger
                    value="size"
                    className="flex-1 data-[state=active]:bg-gold-500/20 data-[state=active]:text-gold-400 text-white/60 text-xs uppercase tracking-wider"
                  >
                    Size Guide
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="mt-4">
                  <div className="space-y-3 text-sm text-white/60">
                    <p>• Each piece is individually crafted by master artisans</p>
                    <p>• Premium hand-selected fabrics from heritage sources</p>
                    <p>• Custom color and fabric options available</p>
                    <p>• Includes certificate of authenticity</p>
                    <p>• Zero-waste luxury packaging</p>
                  </div>
                </TabsContent>

                <TabsContent value="shipping" className="mt-4">
                  <div className="space-y-3 text-sm text-white/60">
                    <p>• Standard delivery: 14 business days (handmade process)</p>
                    <p>• Express delivery: Not available (artisanal products)</p>
                    <p>• Free shipping within Bangladesh on orders over BDT 10,000</p>
                    <p>• International shipping available via DHL Express</p>
                    <p>• Real-time progress tracking in Member Vault</p>
                  </div>
                </TabsContent>

                <TabsContent value="size" className="mt-4">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-white/60">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="text-left py-2 text-white/80">Size</th>
                          <th className="text-center py-2 text-white/80">Bust</th>
                          <th className="text-center py-2 text-white/80">Waist</th>
                          <th className="text-center py-2 text-white/80">Hip</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { size: "S", bust: "34-36", waist: "26-28", hip: "36-38" },
                          { size: "M", bust: "36-38", waist: "28-30", hip: "38-40" },
                          { size: "L", bust: "38-40", waist: "30-32", hip: "40-42" },
                          { size: "XL", bust: "40-42", waist: "32-34", hip: "42-44" },
                        ].map((row) => (
                          <tr key={row.size} className="border-b border-white/5">
                            <td className="py-2">{row.size}</td>
                            <td className="text-center py-2">{row.bust}&quot;</td>
                            <td className="text-center py-2">{row.waist}&quot;</td>
                            <td className="text-center py-2">{row.hip}&quot;</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="mt-4 text-xs text-white/40">Need custom sizing? Contact our WhatsApp liaison for bespoke options.</p>
                </TabsContent>
              </Tabs>
            </div>
          </ScrollArea>
        </div>
      </motion.div>

      {/* AR Viewer Modal */}
      <ARViewer
        isOpen={isAROpen}
        onClose={() => setIsAROpen(false)}
        productName={product.name}
        productImage={product.imageUrl || undefined}
        modelUrl={product.arModelUrl || undefined}
      />
    </>
  );
}

export default function ProductDetailModal({ product, isOpen, onClose, materials }: ProductDetailModalProps) {
  if (!product) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Content with key to reset state when product changes */}
          <ProductDetailContent key={product.id} product={product} onClose={onClose} materials={materials} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
