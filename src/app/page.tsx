"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";
import { useSession, signIn, signOut } from "next-auth/react";

// Components
import Navigation from "@/components/aurnik/Navigation";
import HeroSection from "@/components/aurnik/HeroSection";
import ProductCard from "@/components/aurnik/ProductCard";
import ProductDetailModal from "@/components/aurnik/ProductDetailModal";
import ReviewsSection from "@/components/aurnik/ReviewsSection";
import OrderVault from "@/components/aurnik/OrderVault";
import AIChatbot from "@/components/aurnik/AIChatbot";
import WhatsAppConcierge from "@/components/aurnik/WhatsAppConcierge";
import Footer from "@/components/aurnik/Footer";
import CartDrawer from "@/components/aurnik/CartDrawer";
import DynamicOffer from "@/components/aurnik/DynamicOffer";
import AdminDashboard from "@/components/aurnik/AdminDashboard";
import LoginModal from "@/components/aurnik/LoginModal";
import ARTryOnModal from "@/components/aurnik/ARTryOnModal";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/store";

// Types
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
  featured?: boolean;
}

interface Material {
  id: string;
  materialName: string;
  origin: string;
  qualityGrade: string;
  surcharge: number;
  description?: string;
}

interface Review {
  id: string;
  authorName: string;
  content: string;
  rating: number;
  source: string;
  isPinned: boolean;
  isApproved: boolean;
}

interface OrderProgress {
  orderId: string;
  percent: number;
  stage: string;
  isPaused: boolean;
  productName?: string;
  artisanNotes?: string;
}

export default function AurnikHomePage() {
  const { data: session } = useSession();
  const [products, setProducts] = useState<Product[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [orders, setOrders] = useState<OrderProgress[]>([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal and interaction state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [viewedProducts, setViewedProducts] = useState<string[]>([]);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isARTryOnOpen, setIsARTryOnOpen] = useState(false);
  const [arProduct, setARProduct] = useState<Product | null>(null);

  // Cart store
  const { getTotalItems } = useCartStore();
  const cartCount = getTotalItems();

  // Auth handlers
  const handleLogin = useCallback(() => {
    setIsLoginOpen(true);
  }, []);

  const handleLogout = useCallback(async () => {
    await signOut({ redirect: false });
    toast.success("Signed out successfully");
  }, []);

  // Fetch initial data
  useEffect(() => {
    async function fetchData() {
      try {
        const [productsRes, reviewsRes, materialsRes] = await Promise.all([
          fetch("/api/products"),
          fetch("/api/reviews"),
          fetch("/api/materials"),
        ]);

        if (productsRes.ok) {
          const productsData = await productsRes.json();
          setProducts(productsData);
        }

        if (reviewsRes.ok) {
          const reviewsData = await reviewsRes.json();
          setReviews(reviewsData);
        }

        if (materialsRes.ok) {
          const materialsData = await materialsRes.json();
          setMaterials(materialsData);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
        toast.error("Failed to load content");
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  // Fetch orders for authenticated users
  useEffect(() => {
    async function fetchOrders() {
      if (!session?.user?.email) return;

      try {
        const res = await fetch(`/api/orders?userId=${session.user.email}`);
        if (res.ok) {
          const ordersData = await res.json();
          
          const progressPromises = ordersData.map(async (order: { orderId: string; product: { name: string }; artisanNotes?: string }) => {
            const progressRes = await fetch(`/api/progress?orderId=${order.orderId}`);
            if (progressRes.ok) {
              return progressRes.json();
            }
            return null;
          });

          const progressData = await Promise.all(progressPromises);
          setOrders(progressData.filter(Boolean));
        }
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      }
    }

    fetchOrders();
  }, [session?.user?.email]);

  // Handle chat message
  const handleSendMessage = useCallback(async (message: string): Promise<string> => {
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          sessionId: session?.user?.email || "guest",
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to get response");
      }

      const data = await res.json();
      return data.response;
    } catch (error) {
      console.error("Chat error:", error);
      throw error;
    }
  }, [session?.user?.email]);

  // Handle product click
  const handleProductClick = useCallback((product: Product) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
    
    setViewedProducts((prev) => {
      if (!prev.includes(product.id)) {
        return [...prev, product.id];
      }
      return prev;
    });
  }, []);

  // Handle AR Try-On
  const handleARTryOn = useCallback((product: Product) => {
    setARProduct(product);
    setIsARTryOnOpen(true);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <img
              src="/upload/IMG_9972.png"
              alt="Aurnik"
              className="h-16 md:h-20 w-auto mx-auto object-contain drop-shadow-2xl"
            />
          </motion.div>
          <div className="w-12 h-12 mx-auto mb-4 border-2 border-gold-500/30 border-t-gold-500 rounded-full animate-spin" />
          <span className="text-white/50 text-sm uppercase tracking-widest">
            Loading Experience
          </span>
        </motion.div>
      </div>
    );
  }

  const clothingProducts = products.filter(p => p.category === "Clothing");
  const organicProducts = products.filter(p => p.category === "Organic");

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation
        isAuthenticated={!!session}
        user={session?.user}
        onLogin={handleLogin}
        onLogout={handleLogout}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      <main className="flex-grow">
        <HeroSection />

        {/* Clothing Collection */}
        <section id="collection" className="py-24 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent" />
          <div className="relative container mx-auto px-4 lg:px-8">
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
                The Collection
              </h2>
              <p className="text-white/50 max-w-lg mx-auto">
                Each piece is a 120+ hour journey of artisanal craftsmanship. Click to view details and customize fabrics.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {clothingProducts.map((product, index) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  index={index}
                  onViewDetails={() => handleProductClick(product)}
                  onARTryOn={() => handleARTryOn(product)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Organic Corner */}
        <section id="organic" className="py-24 relative bg-gradient-to-b from-transparent via-gold-500/5 to-transparent">
          <div className="container mx-auto px-4 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="text-xs uppercase tracking-[0.3em] text-gold-400 mb-4 block">
                The Vault
              </span>
              <h2 className="font-serif text-4xl md:text-5xl text-white mb-4">
                Organic Corner
              </h2>
              <p className="text-white/50 max-w-lg mx-auto">
                Premium organic goods sourced with the same &ldquo;No-Compromise&rdquo; quality
              </p>
            </motion.div>

            {organicProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {organicProducts.map((product, index) => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    index={index}
                    onViewDetails={() => handleProductClick(product)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Sparkles className="h-12 w-12 mx-auto mb-4 text-gold-400/50" />
                <p className="text-white/40">Organic products coming soon</p>
              </div>
            )}
          </div>
        </section>

        <ReviewsSection reviews={reviews} />

        <section id="vault">
          <OrderVault
            isAuthenticated={!!session}
            orders={orders}
          />
        </section>

        {/* About Section */}
        <section id="about" className="py-24 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent" />
          <div className="relative container mx-auto px-4 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto text-center"
            >
              <span className="text-xs uppercase tracking-[0.3em] text-gold-400 mb-4 block">
                The Atelier
              </span>
              <h2 className="font-serif text-4xl md:text-5xl text-white mb-6">
                Where Heritage Meets Innovation
              </h2>
              <p className="text-white/60 leading-relaxed mb-8">
                In the heart of Bangladesh, our master artisans carry forward centuries of 
                textile tradition. Each Jamdani weave tells a story of patience and precision.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                {[
                  { title: "Heritage", desc: "UNESCO-recognized Jamdani weaving techniques" },
                  { title: "Artisanal", desc: "120+ hours of handwork in every piece" },
                  { title: "Sustainable", desc: "Organic materials and zero-waste packaging" },
                ].map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="p-6 rounded-2xl bg-white/5 border border-white/10"
                  >
                    <h3 className="font-serif text-xl text-gold-400 mb-2">{item.title}</h3>
                    <p className="text-sm text-white/50">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />

      <AIChatbot
        onSendMessage={handleSendMessage}
        isOpen={isChatOpen}
        onOpenChange={setIsChatOpen}
      />
      <WhatsAppConcierge 
        currentProduct={selectedProduct?.name}
        phoneNumber="8801744688077"
      />

      <ProductDetailModal
        product={selectedProduct}
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        materials={materials}
      />

      <CartDrawer />

      <DynamicOffer
        currentProduct={selectedProduct?.name}
        onViewedProducts={viewedProducts}
      />

      {/* Admin Dashboard */}
      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
      />

      {/* AR Try-On Modal */}
      <ARTryOnModal
        isOpen={isARTryOnOpen}
        onClose={() => setIsARTryOnOpen(false)}
        product={arProduct}
      />
    </div>
  );
}
