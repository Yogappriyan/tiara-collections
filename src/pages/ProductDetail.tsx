import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { Heart, Minus, Plus, ChevronRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { useProduct, useProducts } from "@/hooks/use-products";
import { useCart } from "@/lib/cart";

const ProductDetail = () => {
  const { id } = useParams();
  const { data: product, isLoading } = useProduct(id || "");
  const { data: allProducts } = useProducts();
  const { addItem, wishlist, toggleWishlist } = useCart();
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center font-body">Loading...</div>;
  if (!product) return <div className="min-h-screen flex items-center justify-center font-body">Product not found</div>;

  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  const isWished = wishlist.includes(product.id);
  const related = (allProducts || []).filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);
  const outOfStock = product.stock === 0;

  const handleAddToCart = () => {
    if (outOfStock) return;
    addItem(product, selectedSize || product.sizes[0] || "Free Size");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-20 md:pt-24">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 font-body text-xs text-muted-foreground">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight size={12} />
            <Link to={`/category/${product.category.toLowerCase().replace(/ /g, "-")}`} className="hover:text-primary transition-colors">{product.category}</Link>
            <ChevronRight size={12} />
            <span className="text-foreground">{product.name}</span>
          </nav>
        </div>

        <div className="container mx-auto px-4 pb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            <div className="relative overflow-hidden bg-secondary/20 rounded">
              <img src={product.image} alt={product.name} className="w-full aspect-[2/3] object-cover" width={800} height={1200} />
              {discount > 0 && (
                <span className="absolute top-4 left-4 bg-primary text-primary-foreground text-xs font-body px-3 py-1">-{discount}%</span>
              )}
              {outOfStock && (
                <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                  <span className="font-body text-lg tracking-widest uppercase text-foreground font-semibold bg-background/90 px-6 py-3">Out of Stock</span>
                </div>
              )}
            </div>

            <div className="flex flex-col justify-center">
              <p className="font-body text-xs tracking-widest uppercase text-muted-foreground mb-2">{product.category}</p>
              <h1 className="font-display text-3xl md:text-4xl font-semibold mb-4">{product.name}</h1>
              <div className="flex items-center gap-3 mb-6">
                <span className="font-body text-2xl font-semibold text-foreground">₹{product.price.toLocaleString()}</span>
                <span className="font-body text-base text-muted-foreground line-through">₹{product.originalPrice.toLocaleString()}</span>
                <span className="font-body text-sm text-primary font-medium">({discount}% off)</span>
              </div>

              {product.stock > 0 && product.stock <= 5 && (
                <p className="font-body text-sm text-destructive mb-4">Only {product.stock} left in stock!</p>
              )}

              <p className="font-body text-sm text-muted-foreground leading-relaxed mb-8">{product.description}</p>

              <div className="mb-6">
                <p className="font-body text-xs tracking-widest uppercase text-foreground mb-3">Select Size</p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border font-body text-sm transition-all ${
                        selectedSize === size ? "border-primary bg-primary text-primary-foreground" : "border-border text-foreground hover:border-primary"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-4 mb-8">
                <p className="font-body text-xs tracking-widest uppercase text-foreground">Qty</p>
                <div className="flex items-center border border-border">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 hover:bg-secondary transition-colors">
                    <Minus size={16} />
                  </button>
                  <span className="px-4 font-body text-sm">{quantity}</span>
                  <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="p-2 hover:bg-secondary transition-colors">
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={handleAddToCart} disabled={outOfStock} className="btn-shop flex-1 disabled:opacity-50 disabled:cursor-not-allowed">
                  {outOfStock ? "Out of Stock" : "Add to Cart"}
                </button>
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`w-12 h-12 border flex items-center justify-center transition-all ${isWished ? "border-primary bg-primary/10" : "border-border hover:border-primary"}`}
                  aria-label="Wishlist"
                >
                  <Heart size={20} className={isWished ? "fill-primary text-primary" : "text-foreground/60"} />
                </button>
              </div>
            </div>
          </div>

          {related.length > 0 && (
            <div className="mt-20">
              <h2 className="section-heading">You May Also Like</h2>
              <div className="gold-separator" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {related.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetail;
