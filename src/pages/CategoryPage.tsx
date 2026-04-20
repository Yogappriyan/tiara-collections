import { useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { useProductsByCategory, useProducts } from "@/hooks/use-products";

const categoryMap: Record<string, string> = {
  "kurti-sets": "Kurti Sets",
  "kurtis": "Kurtis",
  "sarees": "Sarees",
  "mangalgiri-suits": "Mangalgiri Suits",
  "salwar-sets": "Salwar Sets",
};

const CategoryPage = () => {
  const { slug } = useParams();
  const categoryName = categoryMap[slug || ""] || "All Products";
  const { data: filtered = [], isLoading } = slug
    ? useProductsByCategory(categoryName)
    : useProducts();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-20 md:pt-24">
        <div className="container mx-auto px-4 py-8 md:py-16">
          <h1 className="section-heading">{categoryName}</h1>
          <p className="section-subheading">{filtered.length} products</p>
          <div className="gold-separator" />
          {isLoading ? (
            <p className="text-center font-body text-muted-foreground py-20">Loading products...</p>
          ) : filtered.length === 0 ? (
            <p className="text-center font-body text-muted-foreground py-20">No products found in this category yet. Check back soon!</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CategoryPage;
