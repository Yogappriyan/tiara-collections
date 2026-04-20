import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Tables } from "@/integrations/supabase/types";

type Product = Tables<"products">;

const categories = ["Kurtis", "Kurti Sets", "Sarees", "Mangalgiri Suits", "Salwar Sets"];
const sizeOptions = ["XS", "S", "M", "L", "XL", "XXL", "XXXL", "Free Size"];

const AdminProducts = () => {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState("");
  const [sizes, setSizes] = useState<string[]>(["S", "M", "L", "XL"]);
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) { navigate("/"); return; }
    if (isAdmin) fetchProducts();
  }, [user, isAdmin, authLoading]);

  const fetchProducts = async () => {
    const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    setProducts(data || []);
    setLoading(false);
  };

  const resetForm = () => {
    setName(""); setPrice(""); setOriginalPrice(""); setCategory(categories[0]);
    setDescription(""); setStock(""); setSizes(["S", "M", "L", "XL"]); setImageUrl("");
    setEditId(null); setShowForm(false);
  };

  const handleEdit = (p: Product) => {
    setEditId(p.id); setName(p.name); setPrice(String(p.price)); setOriginalPrice(String(p.original_price));
    setCategory(p.category); setDescription(p.description || ""); setStock(String(p.stock));
    setSizes(p.sizes || []); setImageUrl(p.image_url || ""); setShowForm(true);
  };

  const handleSave = async () => {
    if (!name || !price || !originalPrice || !stock) {
      toast({ title: "Please fill all required fields", variant: "destructive" }); return;
    }
    const data = {
      name, price: Number(price), original_price: Number(originalPrice),
      category, description, stock: Number(stock), sizes, image_url: imageUrl || null,
    };

    if (editId) {
      const { error } = await supabase.from("products").update(data).eq("id", editId);
      if (error) { toast({ title: "Error updating", description: error.message, variant: "destructive" }); return; }
      toast({ title: "Product updated" });
    } else {
      const { error } = await supabase.from("products").insert(data);
      if (error) { toast({ title: "Error creating", description: error.message, variant: "destructive" }); return; }
      toast({ title: "Product created" });
    }
    resetForm(); fetchProducts();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    const { error } = await supabase.from("products").update({ is_active: false }).eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "Product removed" }); fetchProducts(); }
  };

  const toggleSize = (s: string) => setSizes(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);

  if (authLoading) return <div className="min-h-screen flex items-center justify-center font-body">Loading...</div>;

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="font-display text-2xl font-semibold">Tiara Admin</Link>
          <nav className="flex gap-4 font-body text-sm">
            <Link to="/admin" className="text-foreground/70 hover:text-primary transition-colors">Dashboard</Link>
            <Link to="/admin/products" className="text-primary font-medium">Products</Link>
            <Link to="/admin/orders" className="text-foreground/70 hover:text-primary transition-colors">Orders</Link>
            <Link to="/" className="text-foreground/70 hover:text-primary transition-colors">← Store</Link>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-3xl font-semibold">Products</h1>
          <button onClick={() => { resetForm(); setShowForm(true); }} className="btn-shop flex items-center gap-2">
            <Plus size={16} /> Add Product
          </button>
        </div>

        {showForm && (
          <div className="bg-card border border-border p-6 mb-8 rounded">
            <h3 className="font-display text-xl font-semibold mb-4">{editId ? "Edit Product" : "Add Product"}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="font-body text-xs tracking-widest uppercase mb-1 block">Name *</label>
                <input value={name} onChange={e => setName(e.target.value)}
                  className="w-full px-4 py-3 border border-border bg-background font-body text-sm focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="font-body text-xs tracking-widest uppercase mb-1 block">Category</label>
                <select value={category} onChange={e => setCategory(e.target.value)}
                  className="w-full px-4 py-3 border border-border bg-background font-body text-sm focus:outline-none focus:border-primary">
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="font-body text-xs tracking-widest uppercase mb-1 block">Price *</label>
                <input type="number" value={price} onChange={e => setPrice(e.target.value)}
                  className="w-full px-4 py-3 border border-border bg-background font-body text-sm focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="font-body text-xs tracking-widest uppercase mb-1 block">Original Price *</label>
                <input type="number" value={originalPrice} onChange={e => setOriginalPrice(e.target.value)}
                  className="w-full px-4 py-3 border border-border bg-background font-body text-sm focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="font-body text-xs tracking-widest uppercase mb-1 block">Stock *</label>
                <input type="number" value={stock} onChange={e => setStock(e.target.value)}
                  className="w-full px-4 py-3 border border-border bg-background font-body text-sm focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="font-body text-xs tracking-widest uppercase mb-1 block">Image URL</label>
                <input value={imageUrl} onChange={e => setImageUrl(e.target.value)}
                  className="w-full px-4 py-3 border border-border bg-background font-body text-sm focus:outline-none focus:border-primary" placeholder="https://..." />
              </div>
              <div className="md:col-span-2">
                <label className="font-body text-xs tracking-widest uppercase mb-1 block">Description</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3}
                  className="w-full px-4 py-3 border border-border bg-background font-body text-sm focus:outline-none focus:border-primary resize-none" />
              </div>
              <div className="md:col-span-2">
                <label className="font-body text-xs tracking-widest uppercase mb-2 block">Sizes</label>
                <div className="flex flex-wrap gap-2">
                  {sizeOptions.map(s => (
                    <button key={s} onClick={() => toggleSize(s)}
                      className={`px-3 py-1.5 border font-body text-xs transition-all ${
                        sizes.includes(s) ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary"
                      }`}>{s}</button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={handleSave} className="btn-shop">{editId ? "Update" : "Create"} Product</button>
              <button onClick={resetForm} className="btn-shop-outline">Cancel</button>
            </div>
          </div>
        )}

        {loading ? (
          <p className="font-body text-muted-foreground">Loading products...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full font-body text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="py-3 px-2 text-xs tracking-widest uppercase text-muted-foreground">Product</th>
                  <th className="py-3 px-2 text-xs tracking-widest uppercase text-muted-foreground">Category</th>
                  <th className="py-3 px-2 text-xs tracking-widest uppercase text-muted-foreground">Price</th>
                  <th className="py-3 px-2 text-xs tracking-widest uppercase text-muted-foreground">Stock</th>
                  <th className="py-3 px-2 text-xs tracking-widest uppercase text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id} className="border-b border-border/50">
                    <td className="py-3 px-2 flex items-center gap-3">
                      {p.image_url && <img src={p.image_url} alt="" className="w-10 h-12 object-cover rounded" />}
                      <span className="font-medium">{p.name}</span>
                    </td>
                    <td className="py-3 px-2">{p.category}</td>
                    <td className="py-3 px-2">₹{Number(p.price).toLocaleString()}</td>
                    <td className="py-3 px-2">
                      <span className={p.stock === 0 ? "text-destructive font-medium" : ""}>
                        {p.stock === 0 ? "Out of Stock" : p.stock}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(p)} className="text-primary hover:text-primary/80"><Edit size={16} /></button>
                        <button onClick={() => handleDelete(p.id)} className="text-destructive hover:text-destructive/80"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProducts;
