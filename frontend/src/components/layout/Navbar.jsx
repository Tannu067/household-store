import { Link, NavLink, useNavigate } from "react-router-dom";
import { ShoppingCart, User, Menu, X, Search } from "lucide-react";
import { useState } from "react";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Cushion Covers", to: "/products?category=cushion-cover" },
  { label: "Table Covers", to: "/products?category=table-cover" },
  { label: "Aprons", to: "/products?category=apron" },
];

export default function Navbar() {
  const { totalItems } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/products?search=${encodeURIComponent(search.trim())}`);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-stone-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">

          <Link to="/" className="flex-shrink-0">
            <span className="text-xl font-bold tracking-tight text-stone-900">
              loom<span className="text-amber-700">&</span>thread
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors ${
                    isActive ? "text-amber-700" : "text-stone-600 hover:text-stone-900"
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          <form onSubmit={handleSearch} className="hidden sm:flex flex-1 max-w-xs">
            <div className="relative w-full">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search fabrics, patterns..."
                className="w-full pl-9 pr-4 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-600/40"
              />
            </div>
          </form>

          <div className="flex items-center gap-3">
            <Link to="/cart" className="relative p-2 text-stone-600 hover:text-amber-700 transition-colors">
              <ShoppingCart size={22} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-bold bg-amber-700 text-white rounded-full px-1">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </Link>

            {user ? (
              <div className="hidden sm:flex items-center gap-2">
                <span className="text-sm text-stone-600">{user.name.split(" ")[0]}</span>
                <button onClick={logout} className="text-xs text-stone-400 hover:text-stone-700">
                  Sign out
                </button>
              </div>
            ) : (
              <Link to="/login" className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-stone-600 hover:text-amber-700">
                <User size={18} /> Sign in
              </Link>
            )}

            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 text-stone-600">
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-stone-100 bg-white px-4 pb-4 space-y-1">
          {NAV_LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              onClick={() => setMenuOpen(false)}
              className="block py-2.5 text-sm font-medium text-stone-700 hover:text-amber-700"
            >
              {l.label}
            </NavLink>
          ))}
        </div>
      )}
    </header>
  );
}