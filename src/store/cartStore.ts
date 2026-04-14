import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  menuId: string;
  name: string;
  price: number;
  quantity: number;
  restaurantId: string;
  restaurantName: string;
  image?: string;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  restaurantId: string | null;
  restaurantName: string | null;

  addItem: (item: Omit<CartItem, "quantity">) => { conflict: boolean };
  removeItem: (menuId: string) => void;
  updateQuantity: (menuId: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  totalItems: () => number;
  totalAmount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      restaurantId: null,
      restaurantName: null,

      addItem: (item) => {
        const { items, restaurantId } = get();

        // Different restaurant — signal conflict to caller
        if (restaurantId && restaurantId !== item.restaurantId) {
          return { conflict: true };
        }

        const existing = items.find((i) => i.menuId === item.menuId);
        if (existing) {
          set({
            items: items.map((i) =>
              i.menuId === item.menuId ? { ...i, quantity: i.quantity + 1 } : i
            ),
          });
        } else {
          set({
            items: [...items, { ...item, quantity: 1 }],
            restaurantId: item.restaurantId,
            restaurantName: item.restaurantName,
          });
        }
        return { conflict: false };
      },

      removeItem: (menuId) => {
        const items = get().items.filter((i) => i.menuId !== menuId);
        set({
          items,
          restaurantId: items.length === 0 ? null : get().restaurantId,
          restaurantName: items.length === 0 ? null : get().restaurantName,
        });
      },

      updateQuantity: (menuId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(menuId);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.menuId === menuId ? { ...i, quantity } : i
          ),
        });
      },

      clearCart: () =>
        set({ items: [], restaurantId: null, restaurantName: null }),

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      totalItems: () => get().items.reduce((s, i) => s + i.quantity, 0),
      totalAmount: () =>
        get().items.reduce((s, i) => s + i.price * i.quantity, 0),
    }),
    { name: "food-cart" }
  )
);
