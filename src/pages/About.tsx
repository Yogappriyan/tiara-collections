import Header from "@/components/Header";
import Footer from "@/components/Footer";

const About = () => (
  <div className="min-h-screen bg-background">
    <Header />
    <div className="pt-20 md:pt-24">
      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <h1 className="section-heading">About Tiara Collections</h1>
        <div className="gold-separator" />
        <div className="font-body text-sm leading-relaxed text-muted-foreground space-y-6">
          <p>
            Tiara Collections was born from a deep love for Indian ethnic fashion and a desire to make premium quality ethnic wear accessible to every woman. Founded in 2020, we have grown into a trusted brand known for our exquisite craftsmanship and attention to detail.
          </p>
          <p>
            Our collection features handpicked fabrics sourced from the finest weavers across India — from the vibrant Mangalgiri cottons of Andhra Pradesh to the luxurious Banarasi silks of Varanasi. Each piece in our collection tells a story of tradition, artistry, and elegance.
          </p>
          <p>
            We believe that every woman deserves to feel beautiful and confident in what she wears. That's why we offer a wide range of sizes, from XS to XXXL, ensuring that our ethnic wear flatters every body type.
          </p>
          <p>
            At Tiara Collections, sustainability matters. We work directly with artisan communities, ensuring fair wages and preserving traditional weaving techniques that have been passed down through generations.
          </p>
          <h2 className="font-display text-2xl font-semibold text-foreground pt-4">Our Promise</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>100% authentic handcrafted ethnic wear</li>
            <li>Premium quality fabrics with rich colors</li>
            <li>Easy returns and exchanges within 7 days</li>
            <li>Free shipping on orders above ₹999</li>
            <li>Dedicated customer support</li>
          </ul>
        </div>
      </div>
    </div>
    <Footer />
  </div>
);

export default About;
