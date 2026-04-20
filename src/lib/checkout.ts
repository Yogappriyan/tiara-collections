import type { CartItem } from "@/lib/cart";

export interface CheckoutDetails {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  pincode: string;
}

export interface CheckoutSession {
  details: CheckoutDetails;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  createdAt: string;
}

const CHECKOUT_STORAGE_KEY = "tiara_checkout_session_v1";

const isBrowser = () => typeof window !== "undefined";

export const saveCheckoutSession = (session: CheckoutSession) => {
  if (!isBrowser()) return;
  window.sessionStorage.setItem(CHECKOUT_STORAGE_KEY, JSON.stringify(session));
};

export const getCheckoutSession = (): CheckoutSession | null => {
  if (!isBrowser()) return null;

  try {
    const raw = window.sessionStorage.getItem(CHECKOUT_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CheckoutSession) : null;
  } catch {
    return null;
  }
};

export const clearCheckoutSession = () => {
  if (!isBrowser()) return;
  window.sessionStorage.removeItem(CHECKOUT_STORAGE_KEY);
};
