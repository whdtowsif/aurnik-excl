"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Settings,
  Package,
  Users,
  ShoppingBag,
  TrendingUp,
  Eye,
  Edit3,
  Pause,
  Play,
  RefreshCw,
  Check,
  X,
  Plus,
  Trash2,
  Upload,
  DollarSign,
  Calendar,
  Facebook,
  Camera,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Image as ImageIcon,
  Save,
  Download,
  ExternalLink,
  Link2,
  Unlink,
  Clock,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

// Types
interface Product {
  id: string;
  name: string;
  basePrice: number;
  costPrice: number;
  description: string;
  category: string;
  arModelUrl?: string | null;
  arEnabled: boolean;
  arModelFile?: string | null;
  isLimited: boolean;
  totalAllocation: number;
  remainingStock: number;
  imageUrl?: string | null;
  images?: string | null;
  fabricOptions?: string | null;
  featured: boolean;
  facebookPostId?: string | null;
  facebookSynced: boolean;
  createdAt: string;
}

interface Order {
  orderId: string;
  status: string;
  isPaused: boolean;
  totalPrice: number;
  costPrice: number;
  customerName?: string;
  customerEmail?: string;
  createdAt: string;
  product: { name: string };
  artisanNotes?: string;
}

interface AdminStats {
  totalProducts: number;
  totalOrders: number;
  pendingOrders: number;
  revenue: number;
  costs: number;
  profit: number;
  profitMargin: number;
}

interface FacebookSettings {
  isConnected: boolean;
  pageId?: string;
  pageName?: string;
  accessToken?: string;
  autoSync: boolean;
  lastSync?: string;
}

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminDashboard({ isOpen, onClose }: AdminDashboardProps) {
  // State
  const [stats, setStats] = useState<AdminStats>({
    totalProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    revenue: 0,
    costs: 0,
    profit: 0,
    profitMargin: 0,
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("products");
  
  // Product form state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productForm, setProductForm] = useState({
    name: "",
    basePrice: "",
    costPrice: "",
    description: "",
    category: "Clothing",
    isLimited: false,
    totalAllocation: "",
    remainingStock: "",
    arEnabled: false,
    featured: false,
    imageUrl: "",
  });
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isSavingProduct, setIsSavingProduct] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Facebook state
  const [facebookSettings, setFacebookSettings] = useState<FacebookSettings>({
    isConnected: false,
    autoSync: false,
  });
  const [fbConnecting, setFbConnecting] = useState(false);

  // Fetch data on open
  useEffect(() => {
    if (isOpen) {
      fetchAllData();
    }
  }, [isOpen]);

  // Helper function for fetch with retry
  const fetchWithRetry = async (url: string, retries = 3): Promise<Response | null> => {
    for (let i = 0; i < retries; i++) {
      try {
        const res = await fetch(url);
        return res;
      } catch (error) {
        if (i === retries - 1) {
          console.error(`Fetch failed after ${retries} attempts for ${url}:`, error);
          return null;
        }
        // Wait before retry
        await new Promise((resolve) => setTimeout(resolve, 500 * (i + 1)));
      }
    }
    return null;
  };

  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        fetchProducts(),
        fetchOrders(),
        fetchReviews(),
        fetchStats(),
        fetchFacebookSettings(),
      ]);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      toast.error("Failed to load some data. Please try refreshing.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetchWithRetry("/api/products");
      if (res && res.ok) {
        const data = await res.json();
        setProducts(data);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
      setProducts([]);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetchWithRetry("/api/orders?userId=all");
      if (res && res.ok) {
        const data = await res.json();
        setOrders(data);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      setOrders([]);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await fetchWithRetry("/api/reviews");
      if (res && res.ok) {
        const data = await res.json();
        setReviews(data);
      } else {
        setReviews([]);
      }
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
      setReviews([]);
    }
  };

  const fetchStats = async () => {
    try {
      const [productsRes, ordersRes] = await Promise.all([
        fetchWithRetry("/api/products"),
        fetchWithRetry("/api/orders?userId=all"),
      ]);
      
      if (productsRes && ordersRes && productsRes.ok && ordersRes.ok) {
        const productsData = await productsRes.json();
        const ordersData = await ordersRes.json();
        
        const revenue = ordersData.reduce((sum: number, o: Order) => sum + o.totalPrice, 0);
        const costs = ordersData.reduce((sum: number, o: Order) => sum + (o.costPrice || 0), 0);
        const profit = revenue - costs;
        
        setStats({
          totalProducts: productsData.length,
          totalOrders: ordersData.length,
          pendingOrders: ordersData.filter((o: Order) => o.status === "Pending").length,
          revenue,
          costs,
          profit,
          profitMargin: revenue > 0 ? ((profit / revenue) * 100) : 0,
        });
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  const fetchFacebookSettings = async () => {
    // Mock Facebook settings for now
    setFacebookSettings({
      isConnected: false,
      autoSync: false,
    });
  };

  // Product CRUD operations
  const handleCreateProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: "",
      basePrice: "",
      costPrice: "",
      description: "",
      category: "Clothing",
      isLimited: false,
      totalAllocation: "",
      remainingStock: "",
      arEnabled: false,
      featured: false,
      imageUrl: "",
    });
    setUploadedImage(null);
    setIsProductModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      basePrice: product.basePrice.toString(),
      costPrice: (product.costPrice || 0).toString(),
      description: product.description,
      category: product.category,
      isLimited: product.isLimited,
      totalAllocation: product.totalAllocation.toString(),
      remainingStock: product.remainingStock.toString(),
      arEnabled: product.arEnabled || false,
      featured: product.featured,
      imageUrl: product.imageUrl || "",
    });
    setUploadedImage(product.imageUrl || null);
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async () => {
    if (!productForm.name.trim()) {
      toast.error("Product name is required");
      return;
    }
    
    setIsSavingProduct(true);
    try {
      const productData = {
        name: productForm.name,
        basePrice: parseFloat(productForm.basePrice) || 0,
        costPrice: parseFloat(productForm.costPrice) || 0,
        description: productForm.description,
        category: productForm.category,
        isLimited: productForm.isLimited,
        totalAllocation: parseInt(productForm.totalAllocation) || parseInt(productForm.remainingStock) || 0,
        remainingStock: parseInt(productForm.remainingStock) || 0,
        arEnabled: productForm.arEnabled,
        featured: productForm.featured,
        imageUrl: uploadedImage || productForm.imageUrl,
      };

      if (editingProduct) {
        // Update existing product
        const res = await fetch(`/api/products/${editingProduct.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productData),
        });
        if (res.ok) {
          toast.success("Product updated successfully");
          await fetchProducts();
        } else {
          toast.error("Failed to update product");
        }
      } else {
        // Create new product
        const res = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productData),
        });
        if (res.ok) {
          const newProduct = await res.json();
          toast.success("Product created successfully");
          setUploadedImage(null);
          await fetchProducts();
          await fetchStats();
        } else {
          toast.error("Failed to create product");
        }
      }
      setIsProductModalOpen(false);
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Failed to save product");
    } finally {
      setIsSavingProduct(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Product deleted");
        fetchProducts();
        fetchStats();
      } else {
        toast.error("Failed to delete product");
      }
    } catch (error) {
      toast.error("Failed to delete product");
    }
  };

  // Image upload
  const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 2MB for better performance)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image too large. Max 2MB allowed.");
      return;
    }

    setIsUploadingImage(true);
    
    // Create local preview immediately
    const reader = new FileReader();
    reader.onload = (event) => {
      setUploadedImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", "product");

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setUploadedImage(data.url);
        toast.success("Image uploaded successfully");
      } else {
        toast.error("Failed to upload image");
      }
    } catch (error) {
      toast.error("Upload failed");
    } finally {
      setIsUploadingImage(false);
    }
  }, []);

  // Order management
  const toggleOrderPause = async (orderId: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPaused: !currentStatus }),
      });

      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) =>
            o.orderId === orderId ? { ...o, isPaused: !currentStatus } : o
          )
        );
        toast.success(`Order ${currentStatus ? "resumed" : "paused"} successfully`);
      } else {
        throw new Error("Failed to update");
      }
    } catch (error) {
      toast.error("Failed to update order status");
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) =>
            o.orderId === orderId ? { ...o, status: newStatus } : o
          )
        );
        toast.success("Order status updated");
      } else {
        throw new Error("Failed to update");
      }
    } catch (error) {
      toast.error("Failed to update order status");
    }
  };

  // Review management
  const toggleReviewPin = async (reviewId: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/reviews/${reviewId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPinned: !currentStatus }),
      });

      if (res.ok) {
        setReviews((prev) =>
          prev.map((r) =>
            r.id === reviewId ? { ...r, isPinned: !currentStatus } : r
          )
        );
        toast.success(`Review ${currentStatus ? "unpinned" : "pinned"}`);
      } else {
        throw new Error("Failed to update");
      }
    } catch (error) {
      toast.error("Failed to update review");
    }
  };

  // Facebook integration
  const handleFacebookConnect = async () => {
    setFbConnecting(true);
    // Simulate OAuth flow
    setTimeout(() => {
      setFacebookSettings({
        isConnected: true,
        pageId: "aurnik.official",
        pageName: "Aurnik Official",
        autoSync: false,
        lastSync: new Date().toISOString(),
      });
      setFbConnecting(false);
      toast.success("Facebook page connected successfully!");
    }, 2000);
  };

  const handleFacebookDisconnect = async () => {
    setFacebookSettings({
      isConnected: false,
      autoSync: false,
    });
    toast.info("Facebook page disconnected");
  };

  const syncProductToFacebook = async (product: Product) => {
    try {
      // Simulate Facebook API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      setProducts((prev) =>
        prev.map((p) =>
          p.id === product.id
            ? { ...p, facebookSynced: true, facebookPostId: `fb_${Date.now()}` }
            : p
        )
      );
      toast.success(`${product.name} posted to Facebook!`);
    } catch (error) {
      toast.error("Failed to sync to Facebook");
    }
  };

  // Formatting helpers
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: "BDT",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "In_Progress":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "Shipped":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "Delivered":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      default:
        return "bg-white/10 text-white/60 border-white/20";
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-background"
    >
      {/* Header */}
      <div className="border-b border-white/10 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              src="/upload/IMG_9972.png"
              alt="Aurnik"
              className="h-10 w-auto object-contain drop-shadow-lg"
            />
            <div className="w-px h-8 bg-white/10" />
            <div>
              <h1 className="font-serif text-xl text-white">Admin Dashboard</h1>
              <p className="text-xs text-white/50">Manage your atelier</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchAllData}
              disabled={isLoading}
              className="border-white/20 text-white hover:bg-white/5"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              className="border-white/20 text-white hover:bg-white/5"
            >
              <X className="h-4 w-4 mr-2" />
              Close
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 p-6 border-b border-white/10">
        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <Package className="h-4 w-4 text-blue-400" />
            <span className="text-xs text-white/50">Products</span>
          </div>
          <div className="font-serif text-2xl text-white">{stats.totalProducts}</div>
        </div>
        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <ShoppingBag className="h-4 w-4 text-green-400" />
            <span className="text-xs text-white/50">Orders</span>
          </div>
          <div className="font-serif text-2xl text-white">{stats.totalOrders}</div>
        </div>
        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-4 w-4 text-yellow-400" />
            <span className="text-xs text-white/50">Pending</span>
          </div>
          <div className="font-serif text-2xl text-white">{stats.pendingOrders}</div>
        </div>
        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-gold-400" />
            <span className="text-xs text-white/50">Revenue</span>
          </div>
          <div className="font-serif text-xl text-gold-400">{formatPrice(stats.revenue)}</div>
        </div>
        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="h-4 w-4 text-red-400" />
            <span className="text-xs text-white/50">Costs</span>
          </div>
          <div className="font-serif text-xl text-red-400">{formatPrice(stats.costs)}</div>
        </div>
        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="h-4 w-4 text-green-400" />
            <span className="text-xs text-white/50">Profit</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-serif text-xl text-green-400">{formatPrice(stats.profit)}</span>
            {stats.profitMargin > 0 && (
              <span className="text-xs text-green-400 flex items-center">
                <ArrowUpRight className="h-3 w-3" />
                {stats.profitMargin.toFixed(1)}%
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Tabs */}
      <div className="p-6 h-[calc(100vh-240px)] overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          <TabsList className="bg-white/5 border border-white/10 mb-4 flex-wrap">
            <TabsTrigger
              value="products"
              className="data-[state=active]:bg-gold-500/20 data-[state=active]:text-gold-400 text-white/60"
            >
              <Package className="h-4 w-4 mr-2" />
              Products
            </TabsTrigger>
            <TabsTrigger
              value="orders"
              className="data-[state=active]:bg-gold-500/20 data-[state=active]:text-gold-400 text-white/60"
            >
              <ShoppingBag className="h-4 w-4 mr-2" />
              Orders
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="data-[state=active]:bg-gold-500/20 data-[state=active]:text-gold-400 text-white/60"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger
              value="facebook"
              className="data-[state=active]:bg-gold-500/20 data-[state=active]:text-gold-400 text-white/60"
            >
              <Facebook className="h-4 w-4 mr-2" />
              Facebook
            </TabsTrigger>
            <TabsTrigger
              value="ar"
              className="data-[state=active]:bg-gold-500/20 data-[state=active]:text-gold-400 text-white/60"
            >
              <Camera className="h-4 w-4 mr-2" />
              AR Manager
            </TabsTrigger>
            <TabsTrigger
              value="reviews"
              className="data-[state=active]:bg-gold-500/20 data-[state=active]:text-gold-400 text-white/60"
            >
              <Eye className="h-4 w-4 mr-2" />
              Reviews
            </TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products" className="h-[calc(100%-60px)]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-white">Product Inventory</h3>
              <Button
                onClick={handleCreateProduct}
                className="bg-gold-500 hover:bg-gold-600 text-black"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </div>
            <ScrollArea className="h-[calc(100%-60px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-gold-500/30 transition-colors"
                  >
                    {/* Product Image */}
                    <div className="aspect-square rounded-lg bg-white/5 mb-3 overflow-hidden relative">
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="h-12 w-12 text-white/20" />
                        </div>
                      )}
                      {/* Badges */}
                      <div className="absolute top-2 left-2 flex flex-col gap-1">
                        {product.isLimited && (
                          <Badge className="bg-gold-500/20 text-gold-300 text-[10px]">Limited</Badge>
                        )}
                        {product.featured && (
                          <Badge className="bg-purple-500/20 text-purple-300 text-[10px]">Featured</Badge>
                        )}
                        {product.arEnabled && (
                          <Badge className="bg-blue-500/20 text-blue-300 text-[10px]">AR</Badge>
                        )}
                      </div>
                    </div>
                    
                    {/* Product Info */}
                    <h4 className="font-medium text-white mb-1 truncate">{product.name}</h4>
                    <p className="text-xs text-white/50 mb-2 line-clamp-2">{product.description}</p>
                    
                    {/* Pricing */}
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className="font-serif text-lg text-gold-400">{formatPrice(product.basePrice)}</span>
                        {product.costPrice > 0 && (
                          <span className="text-xs text-white/40 ml-2">
                            Cost: {formatPrice(product.costPrice)}
                          </span>
                        )}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {product.category}
                      </Badge>
                    </div>
                    
                    {/* Stock */}
                    {product.isLimited && (
                      <div className="mb-3">
                        <div className="flex justify-between text-xs text-white/50 mb-1">
                          <span>Stock</span>
                          <span>{product.remainingStock}/{product.totalAllocation}</span>
                        </div>
                        <Progress
                          value={(product.remainingStock / product.totalAllocation) * 100}
                          className="h-1"
                        />
                      </div>
                    )}
                    
                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditProduct(product)}
                        className="flex-1 border-white/20 text-white hover:bg-white/5"
                      >
                        <Edit3 className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteProduct(product.id)}
                        className="border-red-500/20 text-red-400 hover:bg-red-500/10"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="h-[calc(100%-60px)]">
            <ScrollArea className="h-full">
              <div className="space-y-4">
                {orders.length === 0 ? (
                  <div className="text-center py-12 text-white/40">No orders to display</div>
                ) : (
                  orders.map((order) => (
                    <div
                      key={order.orderId}
                      className="p-4 rounded-xl bg-white/5 border border-white/10"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm text-white/50">#{order.orderId}</span>
                            <Badge className={getStatusColor(order.status)}>
                              {order.status.replace("_", " ")}
                            </Badge>
                            {order.isPaused && (
                              <Badge className="bg-amber-500/20 text-amber-400 border border-amber-500/30">
                                Paused
                              </Badge>
                            )}
                          </div>
                          <h4 className="font-medium text-white">{order.product?.name || "Unknown Product"}</h4>
                          {order.customerName && (
                            <p className="text-xs text-white/40">{order.customerName} ({order.customerEmail})</p>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="font-serif text-lg text-gold-400">{formatPrice(order.totalPrice)}</div>
                          {order.costPrice > 0 && (
                            <div className="text-xs text-green-400">
                              Profit: {formatPrice(order.totalPrice - order.costPrice)}
                            </div>
                          )}
                          <div className="text-xs text-white/40">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      {order.artisanNotes && (
                        <p className="text-xs text-white/50 italic mb-3 p-2 rounded bg-white/5">
                          {order.artisanNotes}
                        </p>
                      )}

                      <div className="flex items-center gap-3">
                        <div className="flex flex-col">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => toggleOrderPause(order.orderId, order.isPaused)}
                            className={`border-white/20 ${
                              order.isPaused ? "text-green-400" : "text-amber-400"
                            }`}
                          >
                            {order.isPaused ? (
                              <><Play className="h-3 w-3 mr-1" />Resume</>
                            ) : (
                              <><Pause className="h-3 w-3 mr-1" />Pause</>
                            )}
                          </Button>
                          <span className="mt-1 text-[9px] text-white/30 text-center">
                            {order.isPaused ? "Resume crafting" : "Pause for review"}
                          </span>
                        </div>
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.orderId, e.target.value)}
                          className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm"
                        >
                          <option value="Pending">Pending</option>
                          <option value="In_Progress">In Progress</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="h-[calc(100%-60px)]">
            <ScrollArea className="h-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Profit Overview */}
                <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                  <h3 className="font-medium text-white mb-4 flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-gold-400" />
                    Profit Overview
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                      <span className="text-white/60">Total Revenue</span>
                      <span className="font-serif text-xl text-gold-400">{formatPrice(stats.revenue)}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                      <span className="text-white/60">Total Costs</span>
                      <span className="font-serif text-xl text-red-400">{formatPrice(stats.costs)}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                      <span className="text-white/60">Net Profit</span>
                      <span className="font-serif text-xl text-green-400">{formatPrice(stats.profit)}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                      <span className="text-white/60">Profit Margin</span>
                      <span className="text-green-400 font-medium">{stats.profitMargin.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>

                {/* Weekly Sales Chart */}
                <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                  <h3 className="font-medium text-white mb-4">Weekly Sales</h3>
                  <div className="h-48 flex items-end justify-between gap-2">
                    {[65, 45, 78, 52, 90, 68, 85].map((height, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-gradient-to-t from-gold-500/50 to-gold-500/20 rounded-t-lg transition-all hover:from-gold-500/70"
                        style={{ height: `${height}%` }}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-white/40">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                      <span key={day}>{day}</span>
                    ))}
                  </div>
                </div>

                {/* Top Products */}
                <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                  <h3 className="font-medium text-white mb-4">Top Products by Revenue</h3>
                  <div className="space-y-4">
                    {products.slice(0, 5).map((product, index) => {
                      const profit = product.basePrice - (product.costPrice || 0);
                      const margin = product.basePrice > 0 ? (profit / product.basePrice) * 100 : 0;
                      return (
                        <div key={product.id} className="flex items-center gap-3">
                          <span className="text-gold-400 font-serif text-lg">{index + 1}</span>
                          <div className="flex-1">
                            <div className="flex justify-between text-sm">
                              <span className="text-white truncate">{product.name}</span>
                              <span className="text-gold-400">{formatPrice(product.basePrice)}</span>
                            </div>
                            <div className="flex justify-between text-xs text-white/40">
                              <span>Profit: {formatPrice(profit)}</span>
                              <span className={margin > 50 ? "text-green-400" : "text-yellow-400"}>
                                {margin.toFixed(0)}% margin
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Conversion Funnel */}
                <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                  <h3 className="font-medium text-white mb-4">Conversion Funnel</h3>
                  <div className="flex items-center justify-between">
                    {[
                      { label: "Visitors", value: 1240, width: "100%" },
                      { label: "Viewed", value: 856, width: "69%" },
                      { label: "Cart", value: 234, width: "27%" },
                      { label: "Purchased", value: stats.totalOrders, width: `${Math.max(5, (stats.totalOrders / 1240) * 100)}%` },
                    ].map((step) => (
                      <div key={step.label} className="flex flex-col items-center">
                        <div
                          className="h-24 bg-gradient-to-t from-gold-500/30 to-gold-500/10 rounded-lg flex items-end justify-center pb-2"
                          style={{ width: step.width, minWidth: "60px" }}
                        >
                          <span className="text-sm font-medium text-gold-400">{step.value}</span>
                        </div>
                        <span className="text-xs text-white/50 mt-2">{step.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>

          {/* Facebook Tab */}
          <TabsContent value="facebook" className="h-[calc(100%-60px)]">
            <ScrollArea className="h-full">
              <div className="max-w-2xl mx-auto space-y-6">
                {/* Connection Status */}
                <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        facebookSettings.isConnected ? "bg-blue-500/20" : "bg-white/5"
                      }`}>
                        <Facebook className={`h-6 w-6 ${
                          facebookSettings.isConnected ? "text-blue-400" : "text-white/40"
                        }`} />
                      </div>
                      <div>
                        <h3 className="font-medium text-white">Facebook Page</h3>
                        <p className="text-xs text-white/50">
                          {facebookSettings.isConnected
                            ? `Connected to ${facebookSettings.pageName}`
                            : "Connect your Facebook page to sync products"}
                        </p>
                      </div>
                    </div>
                    {facebookSettings.isConnected ? (
                      <Button
                        variant="outline"
                        onClick={handleFacebookDisconnect}
                        className="border-red-500/20 text-red-400 hover:bg-red-500/10"
                      >
                        <Unlink className="h-4 w-4 mr-2" />
                        Disconnect
                      </Button>
                    ) : (
                      <Button
                        onClick={handleFacebookConnect}
                        disabled={fbConnecting}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        {fbConnecting ? (
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Link2 className="h-4 w-4 mr-2" />
                        )}
                        Connect Page
                      </Button>
                    )}
                  </div>
                  
                  {facebookSettings.isConnected && (
                    <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={facebookSettings.autoSync}
                          onCheckedChange={(checked) =>
                            setFacebookSettings((prev) => ({ ...prev, autoSync: checked }))
                          }
                        />
                        <span className="text-sm text-white/70">Auto-sync new products</span>
                      </div>
                      {facebookSettings.lastSync && (
                        <span className="text-xs text-white/40">
                          Last sync: {new Date(facebookSettings.lastSync).toLocaleString()}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Products to Sync */}
                {facebookSettings.isConnected && (
                  <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                    <h3 className="font-medium text-white mb-4">Products to Sync</h3>
                    <div className="space-y-3">
                      {products.filter((p) => !p.facebookSynced).map((product) => (
                        <div
                          key={product.id}
                          className="flex items-center justify-between p-3 rounded-lg bg-white/5"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg bg-white/10 overflow-hidden">
                              {product.imageUrl ? (
                                <img
                                  src={product.imageUrl}
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <ImageIcon className="h-5 w-5 text-white/30" />
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="text-sm text-white">{product.name}</p>
                              <p className="text-xs text-white/40">{formatPrice(product.basePrice)}</p>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => syncProductToFacebook(product)}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            <Upload className="h-3 w-3 mr-1" />
                            Post
                          </Button>
                        </div>
                      ))}
                      {products.filter((p) => !p.facebookSynced).length === 0 && (
                        <p className="text-center text-white/40 py-4">All products synced to Facebook</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Synced Products */}
                <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                  <h3 className="font-medium text-white mb-4">Synced Products</h3>
                  <div className="space-y-3">
                    {products.filter((p) => p.facebookSynced).map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-green-500/5 border border-green-500/20"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-white/10 overflow-hidden">
                            {product.imageUrl ? (
                              <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <ImageIcon className="h-4 w-4 text-white/30" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="text-sm text-white">{product.name}</p>
                            <p className="text-xs text-green-400 flex items-center gap-1">
                              <Check className="h-3 w-3" />
                              Synced
                            </p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-white/20 text-white/60"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                    {products.filter((p) => p.facebookSynced).length === 0 && (
                      <p className="text-center text-white/40 py-4">No products synced yet</p>
                    )}
                  </div>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>

          {/* AR Manager Tab */}
          <TabsContent value="ar" className="h-[calc(100%-60px)]">
            <ScrollArea className="h-full">
              <div className="space-y-6">
                {/* AR Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <Camera className="h-4 w-4 text-blue-400" />
                      <span className="text-xs text-white/50">AR Enabled Products</span>
                    </div>
                    <div className="font-serif text-2xl text-white">
                      {products.filter((p) => p.arEnabled).length}
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <Package className="h-4 w-4 text-purple-400" />
                      <span className="text-xs text-white/50">3D Models Uploaded</span>
                    </div>
                    <div className="font-serif text-2xl text-white">
                      {products.filter((p) => p.arModelFile).length}
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <Eye className="h-4 w-4 text-green-400" />
                      <span className="text-xs text-white/50">Total AR Views</span>
                    </div>
                    <div className="font-serif text-2xl text-white">1,245</div>
                  </div>
                </div>

                {/* AR Products List */}
                <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                  <h3 className="font-medium text-white mb-4">Manage AR Experiences</h3>
                  <div className="space-y-4">
                    {products.filter((p) => p.category === "Clothing").map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-lg bg-white/10 overflow-hidden">
                            {product.imageUrl ? (
                              <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <ImageIcon className="h-6 w-6 text-white/30" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-white">{product.name}</p>
                            <p className="text-xs text-white/40">{product.category}</p>
                            <div className="flex items-center gap-2 mt-1">
                              {product.arEnabled ? (
                                <Badge className="bg-green-500/20 text-green-300 text-[10px]">
                                  AR Enabled
                                </Badge>
                              ) : (
                                <Badge className="bg-white/10 text-white/50 text-[10px]">
                                  AR Disabled
                                </Badge>
                              )}
                              {product.arModelFile && (
                                <Badge className="bg-blue-500/20 text-blue-300 text-[10px]">
                                  3D Model
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex flex-col items-center">
                            <Switch
                              checked={product.arEnabled}
                              onCheckedChange={(checked) => {
                                setProducts((prev) =>
                                  prev.map((p) =>
                                    p.id === product.id ? { ...p, arEnabled: checked } : p
                                  )
                                );
                                toast.success(`AR ${checked ? "enabled" : "disabled"} for ${product.name}`);
                              }}
                            />
                            <span className="text-[9px] text-white/30 mt-1">AR Toggle</span>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditProduct(product)}
                            className="border-white/20 text-white"
                          >
                            <Upload className="h-3 w-3 mr-1" />
                            Upload 3D
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews" className="h-[calc(100%-60px)]">
            <ScrollArea className="h-full">
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className={`p-4 rounded-xl border ${
                      review.isPinned
                        ? "bg-gold-500/10 border-gold-500/30"
                        : "bg-white/5 border-white/10"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-white">{review.authorName}</span>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <span
                                key={i}
                                className={i < review.rating ? "text-gold-400" : "text-white/20"}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                          {review.isPinned && (
                            <Badge className="bg-gold-500/20 text-gold-400 border border-gold-500/30">
                              Pinned
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-white/60">{review.content}</p>
                      </div>
                      <div className="flex flex-col items-center">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => toggleReviewPin(review.id, review.isPinned)}
                          className={review.isPinned ? "text-gold-400" : "text-white/40"}
                        >
                          {review.isPinned ? <Check className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <span className="text-[9px] text-white/30">{review.isPinned ? "Unpin" : "Pin"}</span>
                      </div>
                    </div>
                    <div className="text-xs text-white/30">
                      {review.product?.name || "Unknown Product"} • {review.source}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>

      {/* Product Edit Modal */}
      <AnimatePresence>
        {isProductModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/80"
            onClick={() => setIsProductModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-background border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-serif text-2xl text-white">
                    {editingProduct ? "Edit Product" : "Add New Product"}
                  </h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsProductModalOpen(false)}
                    className="text-white/60 hover:text-white"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                <div className="space-y-6">
                  {/* Image Upload */}
                  <div>
                    <Label className="text-white/70 mb-2 block">Product Image</Label>
                    <div
                      onClick={() => !isUploadingImage && fileInputRef.current?.click()}
                      className="aspect-video rounded-xl border-2 border-dashed border-white/20 hover:border-gold-500/50 transition-colors cursor-pointer overflow-hidden relative"
                    >
                      {isUploadingImage ? (
                        <div className="w-full h-full flex flex-col items-center justify-center text-white/60 bg-white/5">
                          <RefreshCw className="h-8 w-8 mb-2 animate-spin" />
                          <span className="text-sm">Uploading...</span>
                        </div>
                      ) : uploadedImage ? (
                        <img
                          src={uploadedImage}
                          alt="Product preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-white/40">
                          <Upload className="h-8 w-8 mb-2" />
                          <span className="text-sm">Click to upload image</span>
                          <span className="text-xs mt-1">Max 2MB</span>
                        </div>
                      )}
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>

                  {/* Form Fields */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <Label className="text-white/70 mb-2 block">Product Name</Label>
                      <Input
                        value={productForm.name}
                        onChange={(e) => setProductForm((prev) => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g., Midnight Jamdani Dress"
                        className="bg-white/5 border-white/10 text-white"
                      />
                    </div>
                    
                    <div>
                      <Label className="text-white/70 mb-2 block">Selling Price (BDT)</Label>
                      <Input
                        type="number"
                        value={productForm.basePrice}
                        onChange={(e) => setProductForm((prev) => ({ ...prev, basePrice: e.target.value }))}
                        placeholder="18500"
                        className="bg-white/5 border-white/10 text-white"
                      />
                    </div>
                    
                    <div>
                      <Label className="text-white/70 mb-2 block">Cost Price (BDT)</Label>
                      <Input
                        type="number"
                        value={productForm.costPrice}
                        onChange={(e) => setProductForm((prev) => ({ ...prev, costPrice: e.target.value }))}
                        placeholder="8500"
                        className="bg-white/5 border-white/10 text-white"
                      />
                    </div>

                    <div>
                      <Label className="text-white/70 mb-2 block">Category</Label>
                      <select
                        value={productForm.category}
                        onChange={(e) => setProductForm((prev) => ({ ...prev, category: e.target.value }))}
                        className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
                      >
                        <option value="Clothing">Clothing</option>
                        <option value="Organic">Organic</option>
                      </select>
                    </div>

                    <div>
                      <Label className="text-white/70 mb-2 block">Stock</Label>
                      <Input
                        type="number"
                        value={productForm.remainingStock}
                        onChange={(e) => setProductForm((prev) => ({ ...prev, remainingStock: e.target.value }))}
                        placeholder="50"
                        className="bg-white/5 border-white/10 text-white"
                      />
                    </div>

                    <div className="col-span-2">
                      <Label className="text-white/70 mb-2 block">Description</Label>
                      <Textarea
                        value={productForm.description}
                        onChange={(e) => setProductForm((prev) => ({ ...prev, description: e.target.value }))}
                        placeholder="Describe your product..."
                        rows={3}
                        className="bg-white/5 border-white/10 text-white resize-none"
                      />
                    </div>
                  </div>

                  {/* Toggles */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                      <Label className="text-white/70 text-sm">Limited Edition</Label>
                      <Switch
                        checked={productForm.isLimited}
                        onCheckedChange={(checked) =>
                          setProductForm((prev) => ({ ...prev, isLimited: checked }))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                      <Label className="text-white/70 text-sm">AR Enabled</Label>
                      <Switch
                        checked={productForm.arEnabled}
                        onCheckedChange={(checked) =>
                          setProductForm((prev) => ({ ...prev, arEnabled: checked }))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                      <Label className="text-white/70 text-sm">Featured</Label>
                      <Switch
                        checked={productForm.featured}
                        onCheckedChange={(checked) =>
                          setProductForm((prev) => ({ ...prev, featured: checked }))
                        }
                      />
                    </div>
                  </div>

                  {/* Profit Preview */}
                  {productForm.basePrice && productForm.costPrice && (
                    <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                      <div className="flex items-center justify-between">
                        <span className="text-white/70">Profit per unit:</span>
                        <span className="font-serif text-lg text-green-400">
                          {formatPrice(parseFloat(productForm.basePrice) - parseFloat(productForm.costPrice))}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-white/50">Profit margin:</span>
                        <span className="text-green-400">
                          {((parseFloat(productForm.basePrice) - parseFloat(productForm.costPrice)) / parseFloat(productForm.basePrice) * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setIsProductModalOpen(false)}
                      disabled={isSavingProduct}
                      className="flex-1 border-white/20 text-white hover:bg-white/5"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSaveProduct}
                      disabled={isSavingProduct || isUploadingImage}
                      className="flex-1 bg-gold-500 hover:bg-gold-600 text-black disabled:opacity-50"
                    >
                      {isSavingProduct ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          {editingProduct ? "Update Product" : "Create Product"}
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
