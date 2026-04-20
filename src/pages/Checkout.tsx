import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { saveCheckoutSession } from "@/lib/checkout";

const Checkout = () => {
  const { items, totalPrice } = useCart();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");

  const shipping = totalPrice >= 999 ? 0 : 99;
  const total = totalPrice + shipping;

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth", { replace: true, state: { from: "/checkout" } });
    }
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (user?.email && !email) {
      setEmail(user.email);
    }
  }, [user?.email, email]);

  useEffect(() => {
    if (!authLoading && user && items.length === 0) {
      navigate("/cart", { replace: true });
    }
  }, [authLoading, user, items.length, navigate]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="font-body text-muted-foreground">Loading checkout...</p>
      </div>
    );
  }

  if (!user || items.length === 0) return null;

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim() || !phone.trim() || !email.trim() || !address.trim() || !pincode.trim()) {
      toast({ title: "Please fill all fields", variant: "destructive" });
      return;
    }
    if (!/^\d{10}$/.test(phone)) {
      toast({ title: "Please enter a valid 10-digit phone number", variant: "destructive" });
      return;
    }
    if (!/^\d{6}$/.test(pincode)) {
      toast({ title: "Please enter a valid 6-digit pincode", variant: "destructive" });
      return;
    }

    saveCheckoutSession({
      details: {
        fullName: fullName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        address: address.trim(),
        pincode: pincode.trim(),
      },
      items,
      subtotal: totalPrice,
      shipping,
      total,
      createdAt: new Date().toISOString(),
    });

    navigate("/payment");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-20 md:pt-24">
        <div className="container mx-auto px-4 py-8 md:py-16">
          <h1 className="section-heading mb-8">Checkout</h1>

          <div className="flex items-center justify-center gap-4 mb-12 font-body text-sm">
            {["Details", "Payment", "Success"].map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${
                    i === 0 ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {i + 1}
                </div>
                <span className={i === 0 ? "text-foreground" : "text-muted-foreground"}>{s}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 max-w-2xl">
              <form onSubmit={handleDetailsSubmit} className="space-y-4">
                <div>
                  <label className="font-body text-xs tracking-widest uppercase mb-1 block">Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-3 border border-border bg-background font-body text-sm focus:outline-none focus:border-primary"
                    required
                  />
                </div>
                <div>
                  <label className="font-body text-xs tracking-widest uppercase mb-1 block">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-3 border border-border bg-background font-body text-sm focus:outline-none focus:border-primary"
                    required
                  />
                </div>
                <div>
                  <label className="font-body text-xs tracking-widest uppercase mb-1 block">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-border bg-background font-body text-sm focus:outline-none focus:border-primary"
                    required
                  />
                </div>
                <div>
                  <label className="font-body text-xs tracking-widest uppercase mb-1 block">Address</label>
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-border bg-background font-body text-sm focus:outline-none focus:border-primary resize-none"
                    required
                  />
                </div>
                <div>
                  <label className="font-body text-xs tracking-widest uppercase mb-1 block">Pincode</label>
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full px-4 py-3 border border-border bg-background font-body text-sm focus:outline-none focus:border-primary"
                    required
                  />
                </div>
                <button type="submit" className="btn-shop w-full text-center mt-6">
                  Continue to Payment
                </button>
              </form>
            </div>

            <div className="bg-card border border-border p-6 h-fit">
              <h3 className="font-display text-xl font-semibold mb-4">Order Summary</h3>
              {items.map((item) => (
                <div key={`${item.product.id}-${item.size}`} className="flex justify-between font-body text-sm py-2 border-b border-border/50">
                  <span>
                    {item.product.name} × {item.quantity}
                  </span>
                  <span>₹{(item.product.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
              <div className="flex justify-between font-body text-sm py-2">
                <span className="text-muted-foreground">Shipping</span>
                <span>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
              </div>
              <div className="flex justify-between font-body font-semibold text-base pt-2 border-t border-border">
                <span>Total</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Checkout;
