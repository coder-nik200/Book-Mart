import React, { useState, useRef, useEffect } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  ShoppingCart,
  Heart,
  Search,
  Menu,
  X,
  LogOut,
  User,
  LayoutDashboard,
  BookOpenText,
  Package,
  UserPlus,
  LogIn,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { cart } = useCart();
  const { totalItems: wishlistCount } = useWishlist();

  const navigate = useNavigate();
  const location = useLocation();

  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const searchRef = useRef(null);
  const mobileSearchRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(e.target) &&
        mobileSearchRef.current &&
        !mobileSearchRef.current.contains(e.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    navigate(`/search?query=${searchQuery}`);
    setShowSuggestions(false);
  };

  const fetchSuggestions = async (value) => {
    if (!value.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:5000/api/books/search?q=${value}&limit=8`
      );
      const data = await res.json();
      setSuggestions(data.books || []);
      setShowSuggestions(true);
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  const linkStyle = "block px-4 py-2 rounded-md hover:bg-gray-100 transition";

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* ── Main bar ── */}
        <div className="flex justify-between items-center h-16 gap-2">

          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-1.5 text-xl sm:text-2xl font-bold text-blue-600 shrink-0"
          >
            <BookOpenText size={26} />
            <span className="hidden xs:inline sm:inline">BookMart</span>
          </Link>

          {/* Desktop search */}
          <div ref={searchRef} className="hidden md:flex flex-1 mx-8 relative">
            <form onSubmit={handleSearch} className="w-full">
              <div className="flex w-full items-center bg-gray-100 rounded-lg px-4">
                <Search size={20} className="text-gray-400" />
                <input
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    fetchSuggestions(e.target.value);
                  }}
                  placeholder="Search books..."
                  className="flex-1 bg-transparent px-4 py-2 outline-none"
                />
              </div>
            </form>

            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full mt-1 w-full bg-white shadow-lg rounded-lg z-50 max-h-72 overflow-y-auto">
                {suggestions.map((book) => (
                  <div
                    key={book._id}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      setSearchQuery("");
                      setShowSuggestions(false);
                      navigate(`/book/${book._id}`);
                    }}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-100 transition"
                  >
                    {book.title}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Mobile search */}
          <div ref={mobileSearchRef} className="flex md:hidden flex-1 mx-2 relative">
            <form onSubmit={handleSearch} className="w-full">
              <div className="flex items-center bg-gray-100 rounded-lg px-3 py-1.5">
                <Search size={16} className="text-gray-400 shrink-0" />
                <input
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    fetchSuggestions(e.target.value);
                  }}
                  placeholder="Search..."
                  className="flex-1 bg-transparent px-2 outline-none text-sm min-w-0"
                />
              </div>
            </form>

            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white shadow-lg rounded-lg z-50 max-h-52 overflow-y-auto">
                {suggestions.map((book) => (
                  <div
                    key={book._id}
                    onClick={() => {
                      navigate(`/book/${book._id}`);
                      setSearchQuery("");
                      setShowSuggestions(false);
                    }}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-100 transition text-sm"
                  >
                    {book.title}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right-side icons */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">

            {/* Wishlist – always visible */}
            <NavLink to="/wishlist" className="relative">
              <Heart size={22} />
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </NavLink>

            {/* Cart – always visible */}
            <NavLink to="/cart" className="relative">
              <ShoppingCart size={22} />
              {cart?.totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {cart.totalItems}
                </span>
              )}
            </NavLink>

            {/* Desktop: profile dropdown or login/signup */}
            {isAuthenticated ? (
              <div className="relative hidden md:block" ref={profileRef}>
                <button onClick={() => setProfileOpen(!profileOpen)}>
                  <User size={24} />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-3 w-60 bg-white shadow-lg rounded-lg p-2 z-50">
                    <p className="px-4 py-2 font-semibold border-b">
                      Hi, {user?.name}
                    </p>

                    <NavLink to="/profile" className="block px-4 py-2 hover:bg-gray-100">
                      Profile
                    </NavLink>
                    <NavLink to="/orders" className="block px-4 py-2 hover:bg-gray-100">
                      My Orders
                    </NavLink>
                    <NavLink to="/dashboard" className="block px-4 py-2 hover:bg-gray-100">
                      Dashboard
                    </NavLink>

                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex gap-4">
                <NavLink to="/login">Login</NavLink>
                <NavLink to="/signup" className="text-blue-600">
                  Sign Up
                </NavLink>
              </div>
            )}

            {/* Mobile: hamburger */}
            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* ── Mobile dropdown menu ── */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t py-4 space-y-1">
            {isAuthenticated ? (
              <>
                <NavLink
                  to="/profile"
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-100 transition ${isActive ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-700"
                    }`
                  }
                >
                  <User size={16} /> Profile
                </NavLink>

                <NavLink
                  to="/orders"
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-100 transition ${isActive ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-700"
                    }`
                  }
                >
                  <Package size={16} /> Orders
                </NavLink>

                <NavLink
                  to="/wishlist"
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-100 transition ${isActive ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-700"
                    }`
                  }
                >
                  <Heart size={16} /> Wishlist
                </NavLink>

                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-100 transition ${isActive ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-700"
                    }`
                  }
                >
                  <LayoutDashboard size={16} /> Dashboard
                </NavLink>

                <button
                  onClick={logout}
                  className="flex items-center gap-2 px-4 py-2 text-red-600 w-full text-left rounded hover:bg-red-50 transition"
                >
                  <LogOut size={16} /> Logout
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-100 transition ${isActive ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-700"
                    }`
                  }
                >
                  <LogIn size={16} /> Login
                </NavLink>

                <NavLink
                  to="/signup"
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-100 transition ${isActive ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-700"
                    }`
                  }
                >
                  <UserPlus size={16} /> Sign Up
                </NavLink>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;