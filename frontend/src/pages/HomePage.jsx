import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Truck, RotateCcw, ShieldCheck } from "lucide-react";
import ProductCard from "../components/product/ProductCard";
import api from "../services/api";

const CATEGORIES = [
  {
    id: "cushion-cover",
    label: "Cushion Covers",
    description: "Printed, Embroidered, Plain",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80",
  },
  {
    id: "table-cover",
    label: "Table Covers",
    description: "Round, Rectangular, Oval",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&q=80",
  },
  {
    id: "apron",
    label: "Aprons",
    description: "Kitchen, Bib, Half-length",
    image: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=500&q=80",
  },
];

const TRUST_BADGES = [
  { Icon: Truck, label: "Free Delivery", sub: "On orders above Rs.499" },
  { Icon: RotateCcw, label: "Easy Returns", sub: "7-day hassle-free returns" },
  { Icon: ShieldCheck, label: "Pure Fabrics", sub: "100% tested and certified" },
];

const MOCK_PRODUCTS = [
  { _id: "1", name: "Boho Printed Cushion Cover", price: 349, originalPrice: 499, category: "Cushion Cover", fabric: "100% Cotton", rating: 4.5, reviewCount: 128, badge: "Trending", images: ["https://images.unsplash.com/photo-1567016432779-094069958ea5?w=400&q=80"] },
  { _id: "2", name: "Block Print Table Cover 6 Seater", price: 799, originalPrice: 1099, category: "Table Cover", fabric: "Linen Blend", rating: 4.3, reviewCount: 64, badge: "Sale", images: ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80"] },
  { _id: "3", name: "Denim Bib Apron with Pocket", price: 599, category: "Apron", fabric: "Denim", rating: 4.7, reviewCount: 210, badge: "New", images: ["https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400&q=80"] },
  { _id: "4", name: "Mandala Cushion Cover Set of 5", price: 1199, originalPrice: 1799, category: "Cushion Cover", fabric: "Velvet", rating: 4.6, reviewCount: 88, badge: "Sale", images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80"] },
];

export default function HomePage() {
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/products?sort=trending&limit=8")
      .then(({ data }) => setTrending(data.products || []))
      .catch(() => setTrending(MOCK_PRODUCTS))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen bg-stone-50">

      <section className="relative overflow-hidden bg-gradient-to-br from-stone-900 via-stone-800 to-amber-950 text-white px-4 py-24 sm:py-32">
        <div className="relative max-w-3xl mx-auto text-center space-y-6">
          <p className="text-amber-400 text-sm font-semibold tracking-[0.2em] uppercase">
            Home Textiles, Handcrafted with care
          </p>
          <h1 className="text-4xl sm:text-6xl font-bold leading-tight tracking-tight">
            Dress your home<br />
            <span className="text-amber-400">in stories.</span>
          </h1>
          <p className="text-stone-300 text-lg max-w-lg mx-auto">
            Cushion covers, table runners, and aprons made from premium fabrics.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <button
              onClick={() => navigate("/products")}
              className="bg-amber-600 hover:bg-amber-500 text-white px-8 py-3 rounded-xl font-semibold transition-colors"
            >
              Shop All Products
            </button>
            <Link
              to="/products?category=cushion-cover"
              className="border border-white/30 hover:border-white/60 text-white px-8 py-3 rounded-xl font-semibold transition-colors"
            >
              Explore New Arrivals
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 -mt-6 mb-10">
        <div className="bg-white rounded-2xl shadow-md border border-stone-100 grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-stone-100">
          {TRUST_BADGES.map(({ Icon, label, sub }) => (
            <div key={label} className="flex items-center gap-4 px-6 py-5">
              <div className="p-2.5 bg-amber-50 rounded-xl flex-shrink-0">
                <Icon size={22} className="text-amber-700" />
              </div>
              <div>
                <p className="text-sm font-semibold text-stone-800">{label}</p>
                <p className="text-xs text-stone-500">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <h2 className="text-2xl font-bold text-stone-900 mb-6">Shop by Category</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              to={`/products?category=${cat.id}`}
              className="group relative rounded-2xl overflow-hidden border border-stone-100 hover:shadow-lg transition-shadow"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={cat.image}
                  alt={cat.label}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5 bg-white">
                <h3 className="text-lg font-bold text-stone-900">{cat.label}</h3>
                <p className="text-sm text-stone-500 mt-0.5">{cat.description}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-amber-700 group-hover:gap-2 transition-all">
                  Shop now <ArrowRight size={15} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="flex items-end justify-between mb-6">
          <h2 className="text-2xl font-bold text-stone-900">Trending Right Now</h2>
          <Link to="/products?sort=trending" className="text-sm font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1">
            View all <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-2xl bg-stone-200 animate-pulse aspect-[3/4]" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {trending.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

    </main>
  );
}