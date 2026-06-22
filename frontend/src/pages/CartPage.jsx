import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, ShoppingBag, ArrowLeft, Tag } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

export default function CartPage() {
  const { cartItems, totalPrice, updateQuantity, removeFromCart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [placing, setPlacing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    payment: "cod",
  });

  const handleFormChange = (key, val) =>
    setFormData((f) => ({ ...f, [key]: val }));

  const shipping = totalPrice >= 499 ? 0 : 49;
  const grand = totalPrice + shipping;

  const placeOrder = async () => {
    if (!user) { navigate("/login"); return; }
    setPlacing(true);
    try {
      const { data } = await api.post("/orders", {
        items: cartItems.map(({ product, quantity, selectedVariant }) => ({
          product: product._id, quantity, selectedVariant,
        })),
        shippingAddress: formData,
        paymentMethod: formData.payment,
      });
      clearCart();
      navigate(`/orders/${data.order._id}`);
    } catch (err) {
      alert(err.response?.data?.message || "Could not place order. Please try again.");
    } finally {
      setPlacing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center gap-6 px-4">
        <ShoppingBag size={64} className="text-stone-200" />
        <div className="text-center">
          <h2 className="text-xl font-bold text-stone-800">Your cart is empty</h2>
          <p className="text-stone-400 text-sm mt-1">Add some beautiful textiles to get started.</p>
        </div>
        <Link to="/products" className="bg-amber-700 text-white font-semibold px-8 py-3 rounded-xl hover:bg-amber-800 transition-colors">
          Shop Now
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="flex items-center gap-3 mb-8">
          <Link to="/products" className="text-stone-500 hover:text-amber-700">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-stone-900">
            Cart <span className="text-stone-400 font-normal text-lg">({cartItems.length} items)</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          <div className="lg:col-span-2 space-y-5">

            <div className="bg-white rounded-2xl border border-stone-100 divide-y divide-stone-50">
              {cartItems.map((item) => (
                <div key={item.key} className="flex gap-4 p-4">
                  <img
                    src={item.product.images?.[0]}
                    alt={item.product.name}
                    className="w-20 h-20 rounded-xl object-cover flex-shrink-0 bg-stone-100"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-stone-800 line-clamp-2">
                      {item.product.name}
                    </p>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-stone-200 rounded-lg overflow-hidden">
                        <button onClick={() => updateQuantity(item.key, item.quantity - 1)} className="px-3 py-1 text-stone-600 hover:bg-stone-50 text-sm">-</button>
                        <span className="px-3 py-1 text-sm font-semibold">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.key, item.quantity + 1)} className="px-3 py-1 text-stone-600 hover:bg-stone-50 text-sm">+</button>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-stone-900">
                          Rs.{(item.product.price * item.quantity).toLocaleString("en-IN")}
                        </span>
                        <button onClick={() => removeFromCart(item.key)} className="text-stone-300 hover:text-rose-500 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl border border-stone-100 p-6">
              <h2 className="font-bold text-stone-900 text-lg mb-5">Delivery Details</h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { name: "name", label: "Full Name", span: 2 },
                  { name: "email", label: "Email", span: 1 },
                  { name: "phone", label: "Phone", span: 1 },
                  { name: "address", label: "Address", span: 2 },
                  { name: "city", label: "City", span: 1 },
                  { name: "state", label: "State", span: 1 },
                  { name: "pincode", label: "PIN Code", span: 1 },
                ].map(({ name, label, span }) => (
                  <div key={name} className={span === 2 ? "col-span-2" : "col-span-1"}>
                    <label className="block text-xs font-semibold text-stone-600 mb-1.5 uppercase tracking-wide">
                      {label}
                    </label>
                    <input
                      type="text"
                      value={formData[name] || ""}
                      onChange={(e) => handleFormChange(name, e.target.value)}
                      className="w-full text-sm border border-stone-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-600/40"
                    />
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <p className="text-xs font-semibold text-stone-600 uppercase tracking-wide mb-3">Payment Method</p>
                <div className="space-y-2">
                  {[
                    { id: "cod", label: "Cash on Delivery" },
                    { id: "upi", label: "UPI / GPay / PhonePe" },
                    { id: "card", label: "Credit / Debit Card" },
                  ].map(({ id, label }) => (
                    <label key={id} className="flex items-center gap-3 p-3 border border-stone-200 rounded-xl cursor-pointer hover:border-amber-300">
                      <input
                        type="radio"
                        name="payment"
                        value={id}
                        checked={formData.payment === id}
                        onChange={(e) => handleFormChange("payment", e.target.value)}
                        className="accent-amber-700"
                      />
                      <span className="text-sm text-stone-700">{label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-stone-100 p-6 space-y-5 h-fit sticky top-24">
            <h2 className="font-bold text-stone-900 text-lg">Order Summary</h2>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal</span>
                <span>Rs.{totalPrice.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Shipping</span>
                <span className={shipping === 0 ? "text-emerald-600 font-medium" : ""}>
                  {shipping === 0 ? "FREE" : `Rs.${shipping}`}
                </span>
              </div>
              <div className="border-t border-stone-100 pt-3 flex justify-between font-bold text-stone-900 text-base">
                <span>Total</span>
                <span>Rs.{grand.toLocaleString("en-IN")}</span>
              </div>
            </div>

            {totalPrice < 499 && (
              <p className="text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
                Add Rs.{499 - totalPrice} more for free shipping!
              </p>
            )}

            <button
              onClick={placeOrder}
              disabled={placing}
              className="w-full bg-amber-700 hover:bg-amber-800 disabled:bg-stone-300 text-white font-semibold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {placing ? (
                <span className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
              ) : (
                <><ShoppingBag size={18} /> Place Order (Rs.{grand.toLocaleString("en-IN")})</>
              )}
            </button>

            <p className="text-xs text-stone-400 text-center">
              Secure checkout, 7-day returns, COD available
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}