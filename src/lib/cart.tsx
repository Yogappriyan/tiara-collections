import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export interface CartProduct {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  category: string;
  description: string;
  sizes: string[];
  stock: number;
}

export interface CartItem {
  product: CartProduct;
  quantity: number;
  size: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: CartProduct, size: string) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "tiara_cart_v1";
const WISHLIST_STORAGE_KEY = "tiara_wishlist_v1";

const readStorage = <T,>(key: string, fallback: T): T => {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(() => readStorage<CartItem[]>(CART_STORAGE_KEY, []));
  const [wishlist, setWishlist] = useState<string[]>(() => readStorage<string[]>(WISHLIST_STORAGE_KEY, []));

  const addItem = (product: CartProduct, size: string) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) return prev.map((i) => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { product, quantity: 1, size }];
    });
  };

  const removeItem = (productId: string) => setItems((prev) => prev.filter((i) => i.product.id !== productId));
  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) return removeItem(productId);
    setItems((prev) => prev.map((i) => i.product.id === productId ? { ...i, quantity } : i));
  };

  const toggleWishlist = (productId: string) =>
    setWishlist((prev) => prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    }
  }, [items]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
    }
  }, [wishlist]);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, wishlist, toggleWishlist, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
