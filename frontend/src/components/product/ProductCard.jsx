import { Link } from "react-router-dom";
import { ShoppingCart, Star, Heart } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useState } from "react";

export default function ProductCard({ product }) {
  const { addToCart, isInCart } = useCart();
  const [wishlisted, setWishlisted] = useState(false);
  const [addedFlash, setAddedFlash] = useState(false);

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product, 1);
    setAddedFlash(true);
    setTimeout(() => setAddedFlash(false), 1500);
  };

  return (
    <Link
      to={`/products/${product._id}`}
      className="group relative flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 border border-stone-100"
    >
      {product.badge && (
        <span className="absolute top-3 left-3 z-10 text-xs font-semibold bg-amber-700 text-white px-2.5 py-1 rounded-full tracking-wide">
          {product.badge}
        </span>
      )}

      <button
        onClick={(e) => { e.preventDefault(); setWishlisted(!wishlisted); }}
        className="absolute top-3 right-3 z-10 p-1.5 bg-white/80 backdrop-blur rounded-full shadow-sm hover:bg-white transition-colors"
      >
        <Heart size={16} className={wishlisted ? "fill-rose-500 text-rose-500" : "text-stone-400"} />
      </button>

      <div className="relative aspect-square overflow-hidden bg-stone-50">
        <img
          src={product.images?.[0] || "/placeholder.jpg"}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {product.images?.[1] && (
          <img
            src={product.images[1]}
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          />
        )}
      </div>

      <div className="flex flex-col gap-1.5 p-4 flex-1">
        <span className="text-xs text-amber-700 font-medium uppercase tracking-widest">
          {product.category}
        </span>

        <h3 className="text-sm font-semibold text-stone-800 leading-snug line-clamp-2 min-h-[2.5rem]">
          {product.name}
        </h3>

        {product.fabric && (
          <p className="text-xs text-stone-400">{product.fabric}</p>
        )}

        {product.rating && (
          <div className="flex items-center gap-1">
            <Star size={12} className="fill-amber-400 text-amber-400" />
            <span className="text-xs font-medium text-stone-600">{product.rating}</span>
            <span className="text-xs text-stone-400">({product.reviewCount})</span>
          </div>
        )}

        <div className="flex items-baseline gap-2 mt-auto pt-2">
          <span className="text-base font-bold text-stone-900">
            Rs.{product.price.toLocaleString("en-IN")}
          </span>
          {product.originalPrice && (
            <span className="text-xs text-stone-400 line-through">
              Rs.{product.originalPrice.toLocaleString("en-IN")}
            </span>
          )}
          {discount > 0 && (
            <span className="text-xs font-semibold text-emerald-600">{discount}% off</span>
          )}
        </div>

        <button
          onClick={handleAddToCart}
          className={`mt-2 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
            addedFlash
              ? "bg-emerald-600 text-white"
              : isInCart(product._id)
              ? "bg-stone-100 text-stone-600 hover:bg-amber-50 hover:text-amber-800"
              : "bg-amber-700 text-white hover:bg-amber-800 active:scale-95"
          }`}
        >
          <ShoppingCart size={15} />
          {addedFlash ? "Added!" : isInCart(product._id) ? "In Cart - Add More" : "Add to Cart"}
        </button>
      </div>
    </Link>
  );
}