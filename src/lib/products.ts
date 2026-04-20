import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";
import product5 from "@/assets/product-5.jpg";
import product6 from "@/assets/product-6.jpg";
import product7 from "@/assets/product-7.jpg";
import product8 from "@/assets/product-8.jpg";

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  category: string;
  description: string;
  sizes: string[];
}

export const products: Product[] = [
  {
    id: "1",
    name: "Teal Embroidered Anarkali Kurti",
    price: 1899,
    originalPrice: 3499,
    image: product1,
    category: "Kurtis",
    description: "Elegant teal anarkali kurti with intricate gold zari embroidery. Perfect for festive occasions and family gatherings.",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
  },
  {
    id: "2",
    name: "Coral Block Print Salwar Set",
    price: 2299,
    originalPrice: 4199,
    image: product2,
    category: "Salwar Sets",
    description: "Beautiful coral salwar set with traditional block print pattern and contrast patiala. Comfortable and stylish.",
    sizes: ["S", "M", "L", "XL", "XXL"],
  },
  {
    id: "3",
    name: "Blush Pink Mirror Work Kurti",
    price: 1599,
    originalPrice: 2999,
    image: product3,
    category: "Kurtis",
    description: "Delicate blush pink kurti adorned with mirror work embroidery. Light and breezy fabric for everyday elegance.",
    sizes: ["XS", "S", "M", "L", "XL"],
  },
  {
    id: "4",
    name: "Forest Green Mangalgiri Suit",
    price: 3499,
    originalPrice: 5999,
    image: product4,
    category: "Mangalgiri Suits",
    description: "Luxurious forest green Mangalgiri silk suit with gold border work. Comes with matching dupatta and bottom.",
    sizes: ["S", "M", "L", "XL", "XXL", "XXXL"],
  },
  {
    id: "5",
    name: "Sky Blue Banarasi Saree",
    price: 4999,
    originalPrice: 8999,
    image: product5,
    category: "Sarees",
    description: "Stunning sky blue Banarasi silk saree with silver zari weaving. A masterpiece for weddings and special occasions.",
    sizes: ["Free Size"],
  },
  {
    id: "6",
    name: "Mustard Yellow Kurti Set",
    price: 2199,
    originalPrice: 3999,
    image: product6,
    category: "Kurti Sets",
    description: "Vibrant mustard yellow kurti set with traditional block print and matching dupatta. Perfect for festive wear.",
    sizes: ["S", "M", "L", "XL", "XXL"],
  },
  {
    id: "7",
    name: "Wine Red Anarkali Gown",
    price: 5499,
    originalPrice: 9999,
    image: product7,
    category: "Kurti Sets",
    description: "Regal wine red anarkali gown with elaborate gold embroidery. Floor-length elegance for grand celebrations.",
    sizes: ["XS", "S", "M", "L", "XL"],
  },
  {
    id: "8",
    name: "Olive Green Cotton Kurti",
    price: 1299,
    originalPrice: 2499,
    image: product8,
    category: "Kurtis",
    description: "Comfortable olive green cotton kurti with white chikankari embroidery. Perfect for daily wear with a touch of elegance.",
    sizes: ["S", "M", "L", "XL", "XXL", "XXXL"],
  },
];
