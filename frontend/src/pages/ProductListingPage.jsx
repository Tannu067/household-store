import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal, X, ChevronDown } from "lucide-react";
import ProductCard from "../components/product/ProductCard";
import api from "../services/api";

const FILTER_OPTIONS = {
  category: [
    { value: "cushion-cover", label: "Cushion Covers" },
    { value: "table-cover", label: "Table Covers" },
    { value: "apron", label: "Aprons" },
  ],
  fabric: ["Cotton", "Linen", "Polyester", "Velvet", "Denim", "Jute"],
  color: ["Beige", "White", "Blue", "Green", "Red", "Yellow", "Grey", "Black", "Multi"],
  size: ["12x12 in", "16x16 in", "18x18 in", "4-Seater", "6-Seater", "Free Size"],
};

const SORT_OPTIONS = [
  { value: "trending", label: "Trending" },
  { value: "newest", label: "Newest First" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating", label: "Best Rated" },
];

const MOCK_PRODUCTS = [
  { _id: "1", name: "Boho Printed Cushion Cover", price: 349, originalPrice: 499, category: "Cushion Cover", fabric: "Cotton", rating: 4.5, reviewCount: 128, badge: "Trending", images: ["https://images.unsplash.com/photo-1567016432779-094069958ea5?w=400&q=80"] },
  { _id: "2", name: "Block Print Table Cover", price: 799, originalPrice: 1099, category: "Table Cover", fabric: "Linen", rating: 4.3, reviewCount: 64, badge: "Sale", images: ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80"] },
  { _id: "3", name: "Denim Bib Apron", price: 599, category: "Apron", fabric: "Denim", rating: 4.7, reviewCount: 210, badge: "New", images: ["https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400&q=80"] },
];

function FilterGroup({ title, options, selected, onToggle }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-b border-stone-100 pb-4 mb-4 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full text-sm font-semibold text-stone-800 mb-3"
      >
        {title}
        <ChevronDown size={15} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="flex flex-wrap gap-2">
          {options.map((opt) => {
            const val = typeof opt === "string" ? opt : opt.value;
            const lbl = typeof opt === "string" ? opt : opt.label;
            const active = selected.includes(val);
            return (
              <button
                key={val}
                onClick={() => onToggle(val)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                  active
                    ? "bg-amber-700 text-white border-amber-700"
                    : "border-stone-200 text-stone-600 hover:border-amber-400 hover:text-amber-700"
                }`}
              >
                {lbl}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function ProductListingPage() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [filters, setFilters] = useState({
    category: searchParams.getAll("category"),
    fabric: [],
    color: [],
    size: [],
    sort: searchParams.get("sort") || "trending",
    page: 1,
  });

  const toggleFilter = (key, val) => {
    setFilters((prev) => {
      const arr = prev[key];
      return {
        ...prev,
        [key]: arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val],
        page: 1,
      };
    });
  };

  const clearFilters = () =>
    setFilters({ category: [], fabric: [], color: [], size: [], sort: "trending", page: 1 });

  const activeCount = filters.category.length + filters.fabric.length + filters.color.length + filters.size.length;

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      filters.category.forEach((v) => params.append("category", v));
      filters.fabric.forEach((v) => params.append("fabric", v));
      filters.color.forEach((v) => params.append("color", v));
      filters.size.forEach((v) => params.append("size", v));
      params.set("sort", filters.sort);
      params.set("page", filters.page);
      params.set("limit", 12);

      const { data } = await api.get(`/products?${params}`);
      setProducts(data.products || []);
      setTotal(data.total || 0);
    } catch {
      setProducts(MOCK_PRODUCTS);
      setTotal(MOCK_PRODUCTS.length);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const Sidebar = () => (
    <aside className="space-y-1">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-bold text-stone-900">Filters</h2>
        {activeCount > 0 && (
          <button onClick={clearFilters} className="text-xs text-amber-700 font-medium hover:underline flex items-center gap-1">
            <X size={12} /> Clear all ({activeCount})
          </button>
        )}
      </div>
      <FilterGroup title="Category" options={FILTER_OPTIONS.category} selected={filters.category} onToggle={(v) => toggleFilter("category", v)} />
      <FilterGroup title="Fabric" options={FILTER_OPTIONS.fabric} selected={filters.fabric} onToggle={(v) => toggleFilter("fabric", v)} />
      <FilterGroup title="Color" options={FILTER_OPTIONS.color} selected={filters.color} onToggle={(v) => toggleFilter("color", v)} />
      <FilterGroup title="Size" options={FILTER_OPTIONS.size} selected={filters.size} onToggle={(v) => toggleFilter("size", v)} />
    </aside>
  );

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-stone-900">All Products</h1>
            <p className="text-sm text-stone-500 mt-0.5">{total} products found</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden flex items-center gap-2 text-sm font-medium border border-stone-200 px-4 py-2 rounded-xl"
            >
              <SlidersHorizontal size={15} /> Filters {activeCount > 0 && `(${activeCount})`}
            </button>
            <select
              value={filters.sort}
              onChange={(e) => setFilters((f) => ({ ...f, sort: e.target.value, page: 1 }))}
              className="text-sm border border-stone-200 rounded-xl px-3 py-2 focus:outline-none bg-white"
            >
              {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </div>

        <div className="flex gap-8">
          <div className="hidden lg:block w-60 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-stone-100 p-5 sticky top-24">
              <Sidebar />
            </div>
          </div>

          {sidebarOpen && (
            <div className="lg:hidden fixed inset-0 z-40 flex">
              <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
              <div className="relative ml-auto w-72 bg-white h-full overflow-y-auto p-6 shadow-xl">
                <button onClick={() => setSidebarOpen(false)} className="absolute top-4 right-4 p-1 text-stone-500">
                  <X size={20} />
                </button>
                <Sidebar />
                <button onClick={() => setSidebarOpen(false)} className="mt-6 w-full bg-amber-700 text-white py-3 rounded-xl font-semibold">
                  Apply Filters
                </button>
              </div>
            </div>
          )}

          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="rounded-2xl bg-stone-200 animate-pulse aspect-[3/4]" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
                {products.map((p) => <ProductCard key={p._id} product={p} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}