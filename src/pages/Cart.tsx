import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/lib/cart";

const Cart = () => {
  const { items, removeItem, updateQuantity, totalPrice } = useCart();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-20 md:pt-24">
        <div className="container mx-auto px-4 py-8 md:py-16">
          <h1 className="section-heading mb-8">Shopping Cart</h1>

          {items.length === 0 ? (
            <div className="text-center py-20">
              <ShoppingBag size={48} className="mx-auto text-muted-foreground/30 mb-4" />
              <p className="font-body text-muted-foreground mb-6">Your cart is empty</p>
              <Link to="/" className="btn-shop">Continue Shopping</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-4 p-4 bg-card border border-border">
                    <Link to={`/product/${item.product.id}`}>
                      <img src={item.product.image} alt={item.product.name} className="w-24 h-32 object-cover" loading="lazy" />
                    </Link>
                    <div className="flex-1">
                      <Link to={`/product/${item.product.id}`}>
                        <h3 className="font-display text-base font-medium hover:text-primary transition-colors">{item.product.name}</h3>
                      </Link>
                      <p className="font-body text-xs text-muted-foreground mt-1">Size: {item.size}</p>
                      <p className="font-body text-sm font-semibold mt-2">₹{item.product.price.toLocaleString()}</p>
                      <div className="flex items-center gap-4 mt-3">
                        <div className="flex items-center border border-border">
                          <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="p-1.5 hover:bg-secondary"><Minus size={14} /></button>
                          <span className="px-3 font-body text-sm">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="p-1.5 hover:bg-secondary"><Plus size={14} /></button>
                        </div>
                        <button onClick={() => removeItem(item.product.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <p className="font-body text-sm font-semibold">₹{(item.product.price * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
              </div>

              <div className="bg-card border border-border p-6 h-fit">
                <h3 className="font-display text-xl font-semibold mb-4">Order Summary</h3>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between font-body text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₹{totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-body text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="text-primary">{totalPrice >= 999 ? "Free" : "₹99"}</span>
                  </div>
                  <div className="border-t border-border pt-3 flex justify-between font-body font-semibold">
                    <span>Total</span>
                    <span>₹{(totalPrice + (totalPrice >= 999 ? 0 : 99)).toLocaleString()}</span>
                  </div>
                </div>
                <Link to="/checkout" className="btn-shop w-full text-center">Proceed to Checkout</Link>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Cart;
