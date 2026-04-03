import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  productId: string;
  productName: string;
  productImage?: string;
  basePrice: number;
  materialId?: string;
  materialName?: string;
  surcharge: number;
  quantity: number;
  totalPrice: number;
}

interface Offer {
  id: string;
  type: "bundle" | "discount" | "exclusive";
  title: string;
  description: string;
  discount: number;
  productId?: string;
  expiresAt: Date;
}

interface CartStore {
  items: CartItem[];
  offer: Offer | null;
  isOpen: boolean;
  
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  setOffer: (offer: Offer | null) => void;
  setOpen: (open: boolean) => void;
  
  getTotalItems: () => number;
  getSubtotal: () => number;
  getDiscount: () => number;
  getTotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      offer: null,
      isOpen: false,

      addItem: (item) => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            (i) => i.productId === item.productId && i.materialId === item.materialId
          );

          if (existingIndex > -1) {
            const newItems = [...state.items];
            newItems[existingIndex].quantity += item.quantity;
            newItems[existingIndex].totalPrice =
              newItems[existingIndex].quantity *
              (newItems[existingIndex].basePrice + newItems[existingIndex].surcharge);
            return { items: newItems };
          }

          return { items: [...state.items, item] };
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        }));
      },

      updateQuantity: (productId, quantity) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.productId === productId
              ? {
                  ...item,
                  quantity,
                  totalPrice: quantity * (item.basePrice + item.surcharge),
                }
              : item
          ),
        }));
      },

      clearCart: () => set({ items: [], offer: null }),

      setOffer: (offer) => set({ offer }),

      setOpen: (open) => set({ isOpen: open }),

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce((total, item) => total + item.totalPrice, 0);
      },

      getDiscount: () => {
        const offer = get().offer;
        if (!offer) return 0;
        return Math.round(get().getSubtotal() * (offer.discount / 100));
      },

      getTotal: () => {
        return get().getSubtotal() - get().getDiscount();
      },
    }),
    {
      name: "aurnik-cart",
    }
  )
);
