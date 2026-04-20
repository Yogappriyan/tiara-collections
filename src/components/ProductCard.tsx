import { Heart, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart, CartProduct } from "@/lib/cart";

const ProductCard = ({ product }: { product: CartProduct }) => {
  const { addItem, wishlist, toggleWishlist } = useCart();
  const isWished = wishlist.includes(product.id);
  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  const outOfStock = product.stock === 0;

  return (
    <div className="product-card group">
      <div className="relative overflow-hidden">
        <Link to={`/product/${product.id}`}>
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            width={800}
            height={1200}
            className="product-card-image"
          />
          {outOfStock && (
            <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
              <span className="font-body text-sm tracking-widest uppercase text-foreground font-semibold bg-background/90 px-4 py-2">Out of Stock</span>
            </div>
          )}
        </Link>
        {discount > 0 && (
          <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-body px-2 py-1 tracking-wide">
            -{discount}%
          </span>
        )}
        <button
          onClick={() => toggleWishlist(product.id)}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center transition-all hover:bg-background"
          aria-label="Add to wishlist"
        >
          <Heart size={16} className={isWished ? "fill-primary text-primary" : "text-foreground/60"} />
        </button>
        {!outOfStock && (
          <button
            onClick={() => addItem(product, product.sizes[0] || "Free Size")}
            className="absolute bottom-0 left-0 right-0 bg-charcoal/90 text-cream py-3 font-body text-xs tracking-widest uppercase opacity-0 translate-y-full group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <ShoppingBag size={14} /> Add to Cart
          </button>
        )}
      </div>
      <div className="p-4">
        <Link to={`/product/${product.id}`}>
          <h3 className="font-display text-base font-medium text-foreground leading-tight hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="font-body text-xs text-muted-foreground mt-1 tracking-wide uppercase">{product.category}</p>
        <div className="flex items-center gap-2 mt-2">
          <span className="font-body text-sm font-semibold text-foreground">₹{product.price.toLocaleString()}</span>
          <span className="font-body text-xs text-muted-foreground line-through">₹{product.originalPrice.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
