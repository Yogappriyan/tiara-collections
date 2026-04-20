import { Link } from "react-router-dom";
import { Instagram, Facebook, Twitter } from "lucide-react";

const Footer = () => (
  <footer className="bg-charcoal text-cream pt-16 pb-8">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
        <div>
          <h3 className="font-display text-2xl font-semibold text-cream mb-4">Tiara Collections</h3>
          <p className="font-body text-cream/60 text-sm leading-relaxed">
            Celebrating the beauty of Indian ethnic fashion with premium quality fabrics and timeless designs.
          </p>
          <div className="flex gap-4 mt-6">
            <a href="#" aria-label="Instagram" className="text-cream/50 hover:text-gold transition-colors"><Instagram size={20} /></a>
            <a href="#" aria-label="Facebook" className="text-cream/50 hover:text-gold transition-colors"><Facebook size={20} /></a>
            <a href="#" aria-label="Twitter" className="text-cream/50 hover:text-gold transition-colors"><Twitter size={20} /></a>
          </div>
        </div>
        <div>
          <h4 className="font-display text-lg font-semibold mb-4">Shop</h4>
          <ul className="space-y-2 font-body text-sm text-cream/60">
            <li><Link to="/category/kurti-sets" className="hover:text-gold transition-colors">Kurti Sets</Link></li>
            <li><Link to="/category/kurtis" className="hover:text-gold transition-colors">Kurtis</Link></li>
            <li><Link to="/category/sarees" className="hover:text-gold transition-colors">Sarees</Link></li>
            <li><Link to="/category/mangalgiri-suits" className="hover:text-gold transition-colors">Mangalgiri Suits</Link></li>
            <li><Link to="/category/salwar-sets" className="hover:text-gold transition-colors">Salwar Sets</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display text-lg font-semibold mb-4">Help</h4>
          <ul className="space-y-2 font-body text-sm text-cream/60">
            <li><Link to="/faq" className="hover:text-gold transition-colors">FAQ</Link></li>
            <li><Link to="/returns" className="hover:text-gold transition-colors">Return & Refund</Link></li>
            <li><Link to="/privacy" className="hover:text-gold transition-colors">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-gold transition-colors">Terms & Conditions</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display text-lg font-semibold mb-4">Contact</h4>
          <ul className="space-y-2 font-body text-sm text-cream/60">
            <li>hello@tiaracollections.com</li>
            <li>+91 98765 43210</li>
            <li>Mon – Sat, 10am – 7pm IST</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-cream/10 pt-6 text-center font-body text-xs text-cream/40">
        © 2026 Tiara Collections. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
