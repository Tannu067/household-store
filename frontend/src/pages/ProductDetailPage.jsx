import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Star, ShoppingCart, Truck, RotateCcw, ChevronRight } from "lucide-react";
import { useCart } from "../context/CartContext";
import api from "../services/api";

const MOCK_PRODUCT = {
  _id: "1",
  name: "Boho Block-Print Cushion Cover",
  price: 349,
  originalPrice: 499,
  category: "Cushion Cover",
  badge: "Trending",
  images: [
    "https://images.unsplash.com/photo-1567016432779-094069958ea5?w=600&q=80",
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
  ],
  description: "Handcrafted with 100% natural cotton. Each piece is unique, a hallmark of authentic handloom work.",
  careInstructions: "Machine wash cold. Do not bleach. Iron on medium heat.",
  rating: 4.5,
  reviewCount: 128,
  specs: { Fabric: "100% Cotton", Dimensions: "16x16 inches", Closure: "Zipper", Wash: "Machine Washable" },
  variants: [
    { key: "size", label: "Size", options: ["12x12 in", "16x16 in", "18x18 in", "20x20 in"] },
    { key: "color", label: "Color", options: ["Beige", "Blue", "Green", "Multi"] },
  ],
  reviews: [
    { name: "Priya Sharma", rating: 5, comment: "Absolutely beautiful! Quality is excellent.", createdAt: "2025-03-10" },
    { name: "Amit Verma", rating: 4, comment: "Good quality. Worth the wait.", createdAt: "2025-02-25" },
  ],
};

export default function ProductDetailPage() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [selectedOpts, setSelectedOpts] = useState({});
  const [qty, setQty] = useState(1);
  const [addedFlash, setAddedFlash] = useState(false);
  const [activeTab, setActiveTab] = useState("description");

  useEffect(() => {
    setLoading(true);
    api.get(`/products/${id}`)
      .then(({ data }) => {
        const p = data.product || MOCK_PRODUCT;
        setProduct(p);
        const defaults = {};
        (p.variants || []).forEach((v) => (defaults[v.key] = v.options[0]));
        setSelectedOpts(defaults);
      })
      .catch(() => {
        setProduct(MOCK_PRODUCT);
        const defaults = {};
        MOCK_PRODUCT.variants.forEach((v) => (defaults[v.key] = v.options[0]));
        setSelectedOpts(defaults);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product, qty, selectedOpts);
    setAddedFlash(true);
    setTimeout(() => setAddedFlash(false), 2000);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-amber-700 border-t-transparent animate-spin" />
    </div>
  );

  if (!product) return null;

  return (
    <div className="min-h-screen bg-stone-50 pb-20">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex items-center gap-1 text-xs text-stone-400">
          <Link to="/" className="hover:text-amber-700">Home</Link>
          <ChevronRight size={12} />
          <Link to="/products" className="hover:text-amber-700">Products</Link>
          <ChevronRight size={12} />
          <span className="text-stone-600">{product.name}</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          <div className="space-y-3">
            <div className="aspect-square rounded-2xl overflow-hidden bg-stone-100">
              <img
                src={product.images?.[activeImg]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {product.images?.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-colors ${
                    activeImg === i ? "border-amber-700" : "border-transparent"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-5">
            {product.badge && (
              <span className="inline-block text-xs font-semibold bg-amber-100 text-amber-800 px-3 py-1 rounded-full">
                {product.badge}
              </span>
            )}

            <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 leading-tight">
              {product.name}
            </h1>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={16} className={s <= Math.round(product.rating) ? "fill-amber-400 text-amber-400" : "text-stone-200"} />
                ))}
              </div>
              <span className="text-sm font-semibold text-stone-700">{product.rating}</span>
              <span className="text-sm text-stone-400">({product.reviewCount} reviews)</span>
            </div>

            <div className="flex items-baseline gap-3 pt-1">
              <span className="text-3xl font-bold text-stone-900">
                Rs.{product.price.toLocaleString("en-IN")}
              </span>
              {product.originalPrice && (
                <span className="text-lg text-stone-400 line-through">
                  Rs.{product.originalPrice.toLocaleString("en-IN")}
                </span>
              )}
            </div>

            {product.variants?.map((variant) => (
              <div key={variant.key}>
                <p className="text-sm font-semibold text-stone-700 mb-2 capitalize">
                  {variant.label}: <span className="font-normal text-stone-500">{selectedOpts[variant.key]}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {variant.options.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setSelectedOpts((s) => ({ ...s, [variant.key]: opt }))}
                      className={`text-sm px-3 py-1.5 rounded-lg border transition-colors ${
                        selectedOpts[variant.key] === opt
                          ? "bg-amber-700 text-white border-amber-700"
                          : "border-stone-200 text-stone-600 hover:border-amber-400"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <div className="flex items-center gap-3 pt-2">
              <div className="flex items-center border border-stone-200 rounded-xl overflow-hidden">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-4 py-2.5 text-stone-600 hover:bg-stone-50">-</button>
                <span className="px-4 py-2.5 text-sm font-semibold min-w-[3rem] text-center">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="px-4 py-2.5 text-stone-600 hover:bg-stone-50">+</button>
              </div>

              <button
                onClick={handleAddToCart}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-all ${
                  addedFlash ? "bg-emerald-600 text-white" : "bg-amber-700 hover:bg-amber-800 text-white"
                }`}
              >
                <ShoppingCart size={18} />
                {addedFlash ? "Added to Cart!" : "Add to Cart"}
              </button>
            </div>

            <div className="border border-stone-100 rounded-xl p-4 space-y-3 bg-white">
              <div className="flex items-start gap-3">
                <Truck size={18} className="text-amber-700 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-stone-800">Free Delivery</p>
                  <p className="text-xs text-stone-500">On orders above Rs.499</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <RotateCcw size={18} className="text-amber-700 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-stone-800">7-Day Easy Returns</p>
                  <p className="text-xs text-stone-500">Unused items only</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14">
          <div className="flex gap-6 border-b border-stone-200 mb-6">
            {["description", "reviews"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-sm font-semibold capitalize border-b-2 transition-colors ${
                  activeTab === tab ? "border-amber-700 text-amber-700" : "border-transparent text-stone-500"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === "description" ? (
            <div className="max-w-3xl">
              <p className="text-stone-700 leading-relaxed">{product.description}</p>
              {product.careInstructions && (
                <div className="mt-6 p-4 bg-amber-50 border border-amber-100 rounded-xl">
                  <p className="text-sm font-semibold text-amber-900 mb-1">Care Instructions</p>
                  <p className="text-sm text-amber-800">{product.careInstructions}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-5 max-w-3xl">
              {product.reviews?.map((r, i) => (
                <div key={i} className="bg-white rounded-xl border border-stone-100 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-semibold text-stone-800">{r.name}</p>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} size={13} className={s <= r.rating ? "fill-amber-400 text-amber-400" : "text-stone-200"} />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-stone-600">{r.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}