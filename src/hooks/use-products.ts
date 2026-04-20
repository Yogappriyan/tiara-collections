import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { CartProduct } from "@/lib/cart";

export interface DbProduct {
  id: string;
  name: string;
  price: number;
  original_price: number;
  image_url: string | null;
  category: string;
  description: string | null;
  sizes: string[] | null;
  stock: number;
  is_active: boolean;
}

export const toCartProduct = (p: DbProduct): CartProduct => ({
  id: p.id,
  name: p.name,
  price: p.price,
  originalPrice: p.original_price,
  image: p.image_url || "/placeholder.svg",
  category: p.category,
  description: p.description || "",
  sizes: p.sizes || [],
  stock: p.stock,
});

export const useProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*").eq("is_active", true).order("created_at", { ascending: false });
      if (error) throw error;
      return (data as DbProduct[]).map(toCartProduct);
    },
  });
};

export const useProductsByCategory = (category: string) => {
  return useQuery({
    queryKey: ["products", "category", category],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*").eq("is_active", true).ilike("category", category).order("created_at", { ascending: false });
      if (error) throw error;
      return (data as DbProduct[]).map(toCartProduct);
    },
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*").eq("id", id).single();
      if (error) throw error;
      return toCartProduct(data as DbProduct);
    },
    enabled: !!id,
  });
};
