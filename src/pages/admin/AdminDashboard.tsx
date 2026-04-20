import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Package, ShoppingBag, Users, TrendingUp } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";

const AdminDashboard = () => {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0, pending: 0 });

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate("/");
      return;
    }
    if (isAdmin) {
      Promise.all([
        supabase.from("products").select("id", { count: "exact", head: true }),
        supabase.from("orders").select("total_amount, payment_status"),
      ]).then(([prodRes, ordRes]) => {
        const orders = ordRes.data || [];
        setStats({
          products: prodRes.count || 0,
          orders: orders.length,
          revenue: orders.filter(o => o.payment_status === "confirmed").reduce((s, o) => s + Number(o.total_amount), 0),
          pending: orders.filter(o => o.payment_status === "pending").length,
        });
      });
    }
  }, [user, isAdmin, loading, navigate]);

  if (loading) return <div className="min-h-screen flex items-center justify-center font-body">Loading...</div>;

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="font-display text-2xl font-semibold">Tiara Admin</Link>
          <nav className="flex gap-4 font-body text-sm">
            <Link to="/admin" className="text-primary font-medium">Dashboard</Link>
            <Link to="/admin/products" className="text-foreground/70 hover:text-primary transition-colors">Products</Link>
            <Link to="/admin/orders" className="text-foreground/70 hover:text-primary transition-colors">Orders</Link>
            <Link to="/" className="text-foreground/70 hover:text-primary transition-colors">← Store</Link>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <h1 className="font-display text-3xl font-semibold mb-8">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { icon: Package, label: "Products", value: stats.products, color: "text-blue-600" },
            { icon: ShoppingBag, label: "Total Orders", value: stats.orders, color: "text-green-600" },
            { icon: TrendingUp, label: "Revenue", value: `₹${stats.revenue.toLocaleString()}`, color: "text-primary" },
            { icon: Users, label: "Pending Payments", value: stats.pending, color: "text-yellow-600" },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="bg-card border border-border p-6 rounded">
              <div className="flex items-center gap-3 mb-2">
                <Icon size={20} className={color} />
                <span className="font-body text-sm text-muted-foreground">{label}</span>
              </div>
              <p className="font-display text-2xl font-semibold">{value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link to="/admin/products" className="bg-card border border-border p-6 rounded hover:shadow-md transition-shadow">
            <h3 className="font-display text-xl font-semibold mb-2">Manage Products</h3>
            <p className="font-body text-sm text-muted-foreground">Add, edit, delete products and manage stock</p>
          </Link>
          <Link to="/admin/orders" className="bg-card border border-border p-6 rounded hover:shadow-md transition-shadow">
            <h3 className="font-display text-xl font-semibold mb-2">Manage Orders</h3>
            <p className="font-body text-sm text-muted-foreground">View orders, update status, confirm payments</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
