import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Tables } from "@/integrations/supabase/types";

type Order = Tables<"orders">;

const orderStatuses = ["confirmed", "shipped", "out_for_delivery", "delivered", "cancelled"] as const;
const paymentStatuses = ["pending", "confirmed", "failed"] as const;

const statusLabels: Record<string, string> = {
  confirmed: "Confirmed", shipped: "Shipped", out_for_delivery: "Out for Delivery",
  delivered: "Delivered", cancelled: "Cancelled",
};

const AdminOrders = () => {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [orderItems, setOrderItems] = useState<Record<string, any[]>>({});

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) { navigate("/"); return; }
    if (isAdmin) fetchOrders();
  }, [user, isAdmin, authLoading]);

  const fetchOrders = async () => {
    const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
    setOrders(data || []);
    setLoading(false);
  };

  const fetchOrderItems = async (orderId: string) => {
    if (orderItems[orderId]) return;
    const { data } = await supabase.from("order_items").select("*, products(name, image_url)").eq("order_id", orderId);
    setOrderItems(prev => ({ ...prev, [orderId]: data || [] }));
  };

  const updateOrderStatus = async (orderId: string, status: typeof orderStatuses[number]) => {
    const { error } = await supabase.from("orders").update({ order_status: status }).eq("id", orderId);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: `Order status updated to ${statusLabels[status]}` }); fetchOrders(); }
  };

  const updatePaymentStatus = async (orderId: string, status: typeof paymentStatuses[number]) => {
    const { error } = await supabase.from("orders").update({ payment_status: status }).eq("id", orderId);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: `Payment status updated` }); fetchOrders(); }
  };

  const updateTracking = async (orderId: string, tracking: string) => {
    const { error } = await supabase.from("orders").update({ tracking_details: tracking }).eq("id", orderId);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else toast({ title: "Tracking updated" });
  };

  const toggleExpand = (orderId: string) => {
    if (expandedOrder === orderId) { setExpandedOrder(null); return; }
    setExpandedOrder(orderId);
    fetchOrderItems(orderId);
  };

  if (authLoading) return <div className="min-h-screen flex items-center justify-center font-body">Loading...</div>;

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="font-display text-2xl font-semibold">Tiara Admin</Link>
          <nav className="flex gap-4 font-body text-sm">
            <Link to="/admin" className="text-foreground/70 hover:text-primary transition-colors">Dashboard</Link>
            <Link to="/admin/products" className="text-foreground/70 hover:text-primary transition-colors">Products</Link>
            <Link to="/admin/orders" className="text-primary font-medium">Orders</Link>
            <Link to="/" className="text-foreground/70 hover:text-primary transition-colors">← Store</Link>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <h1 className="font-display text-3xl font-semibold mb-8">Orders</h1>

        {loading ? (
          <p className="font-body text-muted-foreground">Loading...</p>
        ) : orders.length === 0 ? (
          <p className="font-body text-muted-foreground">No orders yet</p>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <div key={order.id} className="bg-card border border-border rounded overflow-hidden">
                <div className="p-4 cursor-pointer hover:bg-secondary/30 transition-colors" onClick={() => toggleExpand(order.id)}>
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="font-display text-lg font-semibold">{order.order_number}</p>
                      <p className="font-body text-xs text-muted-foreground">
                        {order.full_name} • {order.phone} • {new Date(order.created_at).toLocaleDateString("en-IN")}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="font-body font-semibold">₹{Number(order.total_amount).toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                {expandedOrder === order.id && (
                  <div className="border-t border-border p-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="font-body text-xs tracking-widest uppercase text-muted-foreground mb-1">Customer Details</p>
                        <p className="font-body text-sm">{order.full_name}</p>
                        <p className="font-body text-sm">{order.email}</p>
                        <p className="font-body text-sm">{order.phone}</p>
                        <p className="font-body text-sm">{order.address}, {order.pincode}</p>
                        {order.upi_transaction_id && (
                          <p className="font-body text-sm mt-2">UPI Txn: <span className="font-semibold">{order.upi_transaction_id}</span></p>
                        )}
                      </div>
                      <div className="space-y-3">
                        <div>
                          <label className="font-body text-xs tracking-widest uppercase text-muted-foreground mb-1 block">Order Status</label>
                          <select
                            value={order.order_status}
                            onChange={e => updateOrderStatus(order.id, e.target.value as any)}
                            className="w-full px-3 py-2 border border-border bg-background font-body text-sm focus:outline-none focus:border-primary"
                          >
                            {orderStatuses.map(s => <option key={s} value={s}>{statusLabels[s]}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="font-body text-xs tracking-widest uppercase text-muted-foreground mb-1 block">Payment Status</label>
                          <select
                            value={order.payment_status}
                            onChange={e => updatePaymentStatus(order.id, e.target.value as any)}
                            className="w-full px-3 py-2 border border-border bg-background font-body text-sm focus:outline-none focus:border-primary"
                          >
                            {paymentStatuses.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="font-body text-xs tracking-widest uppercase text-muted-foreground mb-1 block">Tracking Details</label>
                          <div className="flex gap-2">
                            <input
                              defaultValue={order.tracking_details || ""}
                              className="flex-1 px-3 py-2 border border-border bg-background font-body text-sm focus:outline-none focus:border-primary"
                              placeholder="Enter tracking info"
                              onBlur={e => { if (e.target.value !== (order.tracking_details || "")) updateTracking(order.id, e.target.value); }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {orderItems[order.id] && (
                      <div>
                        <p className="font-body text-xs tracking-widest uppercase text-muted-foreground mb-2">Order Items</p>
                        <div className="space-y-2">
                          {orderItems[order.id].map((item: any) => (
                            <div key={item.id} className="flex items-center gap-3 font-body text-sm py-2 border-b border-border/50">
                              {item.products?.image_url && <img src={item.products.image_url} alt="" className="w-8 h-10 object-cover rounded" />}
                              <span className="flex-1">{item.products?.name || "Unknown"}</span>
                              <span className="text-muted-foreground">Size: {item.size}</span>
                              <span className="text-muted-foreground">Qty: {item.quantity}</span>
                              <span className="font-semibold">₹{Number(item.price * item.quantity).toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
