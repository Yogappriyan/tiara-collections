import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Package } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type Order = Tables<"orders">;

const statusColors: Record<string, string> = {
  confirmed: "bg-blue-100 text-blue-800",
  shipped: "bg-yellow-100 text-yellow-800",
  out_for_delivery: "bg-orange-100 text-orange-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const statusLabels: Record<string, string> = {
  confirmed: "Confirmed",
  shipped: "Shipped",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const paymentLabels: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  failed: "Failed",
};

const Orders = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
      return;
    }
    if (user) {
      supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .then(({ data }) => {
          setOrders(data || []);
          setLoading(false);
        });
    }
  }, [user, authLoading, navigate]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-20 md:pt-24">
        <div className="container mx-auto px-4 py-8 md:py-16">
          <h1 className="section-heading mb-8">My Orders</h1>

          {loading ? (
            <p className="text-center font-body text-muted-foreground">Loading...</p>
          ) : orders.length === 0 ? (
            <div className="text-center py-20">
              <Package size={48} className="mx-auto text-muted-foreground/30 mb-4" />
              <p className="font-body text-muted-foreground mb-6">No orders yet</p>
              <Link to="/" className="btn-shop">Start Shopping</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="bg-card border border-border p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                    <div>
                      <p className="font-display text-lg font-semibold">{order.order_number}</p>
                      <p className="font-body text-xs text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-body font-medium ${statusColors[order.order_status]}`}>
                        {statusLabels[order.order_status]}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-body font-medium ${
                        order.payment_status === "confirmed" ? "bg-green-100 text-green-800" :
                        order.payment_status === "failed" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"
                      }`}>
                        Payment: {paymentLabels[order.payment_status]}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-body text-sm">
                    <div>
                      <span className="text-muted-foreground">Total</span>
                      <p className="font-semibold">₹{Number(order.total_amount).toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Shipping To</span>
                      <p>{order.address}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Phone</span>
                      <p>{order.phone}</p>
                    </div>
                    {order.tracking_details && (
                      <div>
                        <span className="text-muted-foreground">Tracking</span>
                        <p>{order.tracking_details}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Orders;
