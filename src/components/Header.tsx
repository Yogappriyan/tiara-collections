import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Heart, ShoppingBag, Menu, X, User, LogOut, Shield } from "lucide-react";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/auth";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "About Us", path: "/about" },
  { label: "Kurti Sets", path: "/category/kurti-sets" },
  { label: "Kurtis", path: "/category/kurtis" },
  { label: "Sarees", path: "/category/sarees" },
  { label: "Mangalgiri Suits", path: "/category/mangalgiri-suits" },
  { label: "Salwar Sets", path: "/category/salwar-sets" },
];

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { totalItems, wishlist } = useCart();
  const { user, isAdmin, signOut } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-background/95 backdrop-blur-sm shadow-sm" : "bg-background"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          <button
            className="md:hidden text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <Link to="/" className="font-display text-2xl md:text-3xl font-semibold tracking-wide text-foreground">
            Tiara Collections
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="font-body text-xs tracking-widest uppercase text-foreground/80 hover:text-primary transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <button aria-label="Search" className="text-foreground/70 hover:text-primary transition-colors">
              <Search size={20} />
            </button>
            <Link to="/wishlist" className="relative text-foreground/70 hover:text-primary transition-colors">
              <Heart size={20} />
              {wishlist.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-body">
                  {wishlist.length}
                </span>
              )}
            </Link>
            <Link to="/cart" className="relative text-foreground/70 hover:text-primary transition-colors">
              <ShoppingBag size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-body">
                  {totalItems}
                </span>
              )}
            </Link>
            {user ? (
              <div className="flex items-center gap-2">
                {isAdmin && (
                  <Link to="/admin" className="text-foreground/70 hover:text-primary transition-colors" title="Admin">
                    <Shield size={20} />
                  </Link>
                )}
                <Link to="/orders" className="text-foreground/70 hover:text-primary transition-colors" title="My Orders">
                  <User size={20} />
                </Link>
                <button onClick={signOut} className="text-foreground/70 hover:text-primary transition-colors" title="Sign Out">
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <Link to="/auth" className="text-foreground/70 hover:text-primary transition-colors" title="Sign In">
                <User size={20} />
              </Link>
            )}
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-background border-t border-border animate-fade-in">
          <nav className="flex flex-col py-4 px-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className="font-body text-sm tracking-widest uppercase text-foreground/80 hover:text-primary py-3 border-b border-border/50 transition-colors"
              >
                {link.label}
              </Link>
            ))}
            {user ? (
              <>
                <Link to="/orders" onClick={() => setMobileOpen(false)} className="font-body text-sm tracking-widest uppercase text-foreground/80 hover:text-primary py-3 border-b border-border/50">My Orders</Link>
                {isAdmin && <Link to="/admin" onClick={() => setMobileOpen(false)} className="font-body text-sm tracking-widest uppercase text-primary py-3 border-b border-border/50">Admin Panel</Link>}
                <button onClick={() => { signOut(); setMobileOpen(false); }} className="font-body text-sm tracking-widest uppercase text-foreground/80 hover:text-primary py-3 text-left">Sign Out</button>
              </>
            ) : (
              <Link to="/auth" onClick={() => setMobileOpen(false)} className="font-body text-sm tracking-widest uppercase text-foreground/80 hover:text-primary py-3">Sign In / Sign Up</Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
