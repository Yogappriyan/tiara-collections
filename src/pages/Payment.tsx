import { useEffect, useMemo, useState } from "react";
import { Copy, Check, QrCode, Smartphone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/lib/auth";
import { useCart } from "@/lib/cart";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { clearCheckoutSession, getCheckoutSession } from "@/lib/checkout";

const UPI_ID = "tiaracollections@upi";
const UPI_MOBILE = "9876543210";

const Payment = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { removeItem } = useCart();
  const { toast } = useToast();
  const [upiTxnId, setUpiTxnId] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const session = useMemo(() => getCheckoutSession(), []);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate("/auth", { replace: true });
      return;
    }

    if (!session || session.items.length === 0) {
      navigate("/checkout", { replace: true });
      return;
    }

    setReady(true);
  }, [authLoading, user, session, navigate]);

  if (!ready || !session) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="font-body text-muted-foreground">Loading payment...</p>
      </div>
    );
  }

  const upiQrPayload = `upi://pay?pa=${encodeURIComponent(UPI_ID)}&pn=${encodeURIComponent("Tiara Collections")}&am=${session.total.toFixed(2)}&cu=INR`;
  const upiQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(upiQrPayload)}`;

  const copyUpi = async () => {
    await navigator.clipboard.writeText(UPI_ID);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  const handlePaid = async () => {
    if (!upiTxnId.trim()) {
      toast({ title: "Please enter UPI transaction ID", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const { data: orderNumber, error: orderNumError } = await supabase.rpc("generate_order_number");
      if (orderNumError || !orderNumber) throw orderNumError || new Error("Unable to generate order number");

      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          order_number: orderNumber,
          user_id: user!.id,
          full_name: session.details.fullName,
          phone: session.details.phone,
          email: session.details.email,
          address: session.details.address,
          pincode: session.details.pincode,
          total_amount: session.total,
          payment_status: "pending",
          order_status: "confirmed",
          upi_transaction_id: upiTxnId.trim(),
        })
        .select("id, order_number")
        .single();

      if (orderError || !order) throw orderError || new Error("Unable to create order");

      const orderItems = session.items.map((item) => ({
        order_id: order.id,
        product_id: item.product.id,
        quantity: item.quantity,
        price: item.product.price,
        size: item.size,
      }));

      const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
      if (itemsError) throw itemsError;

      session.items.forEach((item) => removeItem(item.product.id));
      clearCheckoutSession();

      // Best-effort app email trigger (if email function is set up later)
      void supabase.functions.invoke("send-transactional-email", {
        body: {
          templateName: "order-confirmation",
          recipientEmail: session.details.email,
          idempotencyKey: `order-confirm-${order.id}`,
          templateData: {
            orderNumber: order.order_number,
            amount: session.total,
            fullName: session.details.fullName,
          },
        },
      }).catch(() => undefined);

      void supabase.functions.invoke("send-transactional-email", {
        body: {
          templateName: "new-order-admin-alert",
          recipientEmail: "vishwa10230506@gmail.com",
          idempotencyKey: `order-admin-${order.id}`,
          templateData: {
            orderNumber: order.order_number,
            amount: session.total,
            customerEmail: session.details.email,
            customerName: session.details.fullName,
          },
        },
      }).catch(() => undefined);

      navigate("/order-success", {
        replace: true,
        state: { orderNumber: order.order_number, paymentStatus: "pending" },
      });
    } catch (error: any) {
      toast({
        title: "Unable to place order",
        description: error?.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-20 md:pt-24">
        <div className="container mx-auto px-4 py-8 md:py-16">
          <h1 className="section-heading mb-8">Payment</h1>

          <div className="flex items-center justify-center gap-4 mb-12 font-body text-sm">
            {["Details", "Payment", "Success"].map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${
                    i <= 1 ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {i + 1}
                </div>
                <span className={i <= 1 ? "text-foreground" : "text-muted-foreground"}>{s}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-card border border-border p-6">
                <h2 className="font-display text-xl font-semibold mb-4 flex items-center gap-2">
                  <QrCode size={18} />
                  UPI QR Code
                </h2>
                <p className="font-body text-sm text-muted-foreground mb-4">Scan & Pay using any UPI app</p>
                <img src={upiQrUrl} alt="UPI QR code for Tiara Collections payment" className="w-56 h-56 border border-border p-2 bg-background" loading="lazy" />
              </div>

              <div className="bg-card border border-border p-6">
                <h2 className="font-display text-xl font-semibold mb-4">UPI ID</h2>
                <div className="flex items-center gap-3 bg-secondary p-3 rounded-md">
                  <span className="font-body text-sm font-semibold flex-1">{UPI_ID}</span>
                  <button onClick={copyUpi} className="text-primary hover:text-primary/80 transition-colors" type="button" aria-label="Copy UPI ID">
                    {copied ? <Check size={18} /> : <Copy size={18} />}
                  </button>
                </div>
              </div>

              <div className="bg-card border border-border p-6">
                <h2 className="font-display text-xl font-semibold mb-4 flex items-center gap-2">
                  <Smartphone size={18} />
                  Mobile Number
                </h2>
                <p className="font-body text-base font-semibold">{UPI_MOBILE}</p>
                <p className="font-body text-sm text-muted-foreground mt-1">Pay via Google Pay / PhonePe / Paytm</p>
              </div>

              <div className="bg-card border border-border p-6">
                <label className="font-body text-xs tracking-widest uppercase mb-1 block">UPI Transaction ID</label>
                <input
                  type="text"
                  value={upiTxnId}
                  onChange={(e) => setUpiTxnId(e.target.value)}
                  className="w-full px-4 py-3 border border-border bg-background font-body text-sm focus:outline-none focus:border-primary"
                  placeholder="Enter your UPI transaction ID"
                />
                <button onClick={handlePaid} disabled={loading} className="btn-shop w-full text-center mt-6 disabled:opacity-50" type="button">
                  {loading ? "Processing..." : "I Have Paid"}
                </button>
              </div>
            </div>

            <div className="bg-card border border-border p-6 h-fit">
              <h3 className="font-display text-xl font-semibold mb-4">Order Summary</h3>
              {session.items.map((item) => (
                <div key={`${item.product.id}-${item.size}`} className="flex justify-between font-body text-sm py-2 border-b border-border/50">
                  <span>{item.product.name} × {item.quantity}</span>
                  <span>₹{(item.product.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
              <div className="flex justify-between font-body text-sm py-2">
                <span className="text-muted-foreground">Shipping</span>
                <span>{session.shipping === 0 ? "Free" : `₹${session.shipping}`}</span>
              </div>
              <div className="flex justify-between font-body font-semibold text-base pt-2 border-t border-border">
                <span>Total Amount</span>
                <span>₹{session.total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Payment;
