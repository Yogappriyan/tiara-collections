import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Shield, Truck, CreditCard, Star, Quote } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { useProducts } from "@/hooks/use-products";

import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import catKurtiSets from "@/assets/category-kurti-sets.jpg";
import catKurtis from "@/assets/category-kurtis.jpg";
import catSarees from "@/assets/category-sarees.jpg";
import catMangalgiri from "@/assets/category-mangalgiri.jpg";
import catSalwar from "@/assets/category-salwar.jpg";
import promoBanner from "@/assets/promo-banner.jpg";

const heroSlides = [
  { image: hero1, title: "New Arrivals", subtitle: "Elegant Ethnic Wear", cta: "Shop Now" },
  { image: hero2, title: "Summer Collection", subtitle: "Graceful Sarees & Suits", cta: "Explore" },
];

const categories = [
  { name: "Kurti Sets", image: catKurtiSets, path: "/category/kurti-sets" },
  { name: "Kurtis", image: catKurtis, path: "/category/kurtis" },
  { name: "Sarees", image: catSarees, path: "/category/sarees" },
  { name: "Mangalgiri Suits", image: catMangalgiri, path: "/category/mangalgiri-suits" },
  { name: "Salwar Sets", image: catSalwar, path: "/category/salwar-sets" },
];

const testimonials = [
  { name: "Priya Sharma", text: "The quality of fabrics is exceptional. My Mangalgiri suit received so many compliments at the wedding!", rating: 5 },
  { name: "Anitha Reddy", text: "Beautiful collection and fast delivery. The kurti set fit perfectly. Will definitely order again.", rating: 5 },
  { name: "Meera Patel", text: "Tiara Collections has become my go-to for ethnic wear. The sarees are absolutely stunning!", rating: 5 },
];

const Index = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const { data: products, isLoading } = useProducts();

  useEffect(() => {
    const timer = setInterval(() => setCurrentSlide((p) => (p + 1) % heroSlides.length), 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Banner */}
      <section className="relative h-[70vh] md:h-[85vh] overflow-hidden mt-16 md:mt-20">
        {heroSlides.map((slide, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-1000 ${i === currentSlide ? "opacity-100" : "opacity-0"}`}
          >
            <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" width={1920} height={1080} />
            <div className="absolute inset-0 bg-charcoal/30" />
            <div className="absolute inset-0 flex items-center justify-start">
              <div className="container mx-auto px-4">
                <div className="max-w-lg">
                  <p className="font-body text-xs md:text-sm tracking-[0.3em] uppercase text-cream/90 mb-3 animate-fade-in">
                    {slide.subtitle}
                  </p>
                  <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-semibold text-cream leading-tight mb-6 animate-slide-up">
                    {slide.title}
                  </h1>
                  <Link to="/category/kurti-sets" className="btn-shop bg-cream text-charcoal hover:bg-gold hover:text-cream">
                    {slide.cta}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
        <button
          onClick={() => setCurrentSlide((p) => (p - 1 + heroSlides.length) % heroSlides.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-cream/20 backdrop-blur-sm flex items-center justify-center text-cream hover:bg-cream/40 transition-colors"
          aria-label="Previous slide"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={() => setCurrentSlide((p) => (p + 1) % heroSlides.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-cream/20 backdrop-blur-sm flex items-center justify-center text-cream hover:bg-cream/40 transition-colors"
          aria-label="Next slide"
        >
          <ChevronRight size={20} />
        </button>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`w-2 h-2 rounded-full transition-all ${i === currentSlide ? "bg-cream w-6" : "bg-cream/40"}`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Category Grid */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="section-heading">Shop by Category</h2>
          <p className="section-subheading">Explore our curated collections</p>
          <div className="gold-separator" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((cat) => (
              <Link key={cat.name} to={cat.path} className="category-card group aspect-[3/4] relative rounded overflow-hidden">
                <img src={cat.image} alt={cat.name} loading="lazy" width={800} height={1024} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="font-display text-lg md:text-xl font-semibold text-cream">{cat.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <h2 className="section-heading">New Arrivals</h2>
          <p className="section-subheading">Freshly added to our collection</p>
          <div className="gold-separator" />
          {isLoading ? (
            <p className="text-center font-body text-muted-foreground py-12">Loading products...</p>
          ) : products && products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {products.slice(0, 8).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <p className="text-center font-body text-muted-foreground py-12">No products available yet. Check back soon!</p>
          )}
          <div className="text-center mt-12">
            <Link to="/category/kurtis" className="btn-shop-outline">View All Products</Link>
          </div>
        </div>
      </section>

      {/* Promo Banner */}
      <section className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        <img src={promoBanner} alt="Sale" loading="lazy" width={1920} height={1080} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-charcoal/50 flex items-center justify-center">
          <div className="text-center">
            <p className="font-body text-xs md:text-sm tracking-[0.3em] uppercase text-cream/80 mb-2">Limited Time Offer</p>
            <h2 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-cream mb-4">Flat 50% Off</h2>
            <p className="font-body text-sm text-cream/70 mb-8">On selected ethnic wear collections</p>
            <Link to="/category/kurti-sets" className="btn-shop">Shop the Sale</Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {[
              { icon: Shield, title: "Premium Quality", desc: "Handpicked fabrics with meticulous craftsmanship" },
              { icon: Truck, title: "Fast Delivery", desc: "Free shipping on orders above ₹999" },
              { icon: CreditCard, title: "Secure Payment", desc: "Multiple payment options with 100% security" },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center mb-4">
                  <Icon size={24} className="text-primary" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-2">{title}</h3>
                <p className="font-body text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <h2 className="section-heading">What Our Customers Say</h2>
          <div className="gold-separator" />
          <div className="max-w-2xl mx-auto">
            <div className="text-center">
              <Quote size={32} className="mx-auto text-primary/30 mb-6" />
              <p className="font-display text-xl md:text-2xl italic text-foreground/80 leading-relaxed mb-6">
                "{testimonials[testimonialIndex].text}"
              </p>
              <div className="flex justify-center gap-1 mb-3">
                {Array.from({ length: testimonials[testimonialIndex].rating }).map((_, i) => (
                  <Star key={i} size={14} className="fill-primary text-primary" />
                ))}
              </div>
              <p className="font-body text-sm font-semibold tracking-wide">{testimonials[testimonialIndex].name}</p>
            </div>
            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setTestimonialIndex(i)}
                  className={`w-2 h-2 rounded-full transition-all ${i === testimonialIndex ? "bg-primary w-6" : "bg-primary/30"}`}
                  aria-label={`Testimonial ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
