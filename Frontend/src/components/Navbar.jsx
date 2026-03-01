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
  ShieldCheck,
  Package,
  UserPlus,
  LogIn,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const profileRef = useRef(null);
  useEffect(() => {
  const handler = (e) => {
    if (searchRef.current && !searchRef.current.contains(e.target)) {
      setShowSuggestions(false);
    }
  };

  document.addEventListener("mousedown", handler);
  return () => document.removeEventListener("mousedown", handler);
}, []);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close mobile menu on route change
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
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 text-2xl font-bold text-blue-600"
          >
            <BookOpenText size={28} />
            BookMart
          </Link>

          {/* Search (Desktop) */}
          {/* <form onSubmit={handleSearch} className="hidden md:flex flex-1 mx-8"> */}
          <div ref={searchRef} className="hidden md:flex flex-1 mx-8 relative">
  <form onSubmit={handleSearch} className="w-full">
            <div className="flex w-full items-center bg-gray-100 rounded-lg px-4">
              <Search size={20} className="text-gray-400" />
              <input
                value={searchQuery}
                // onChange={(e) => setSearchQuery(e.target.value)}
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
        onClick={() => {
          navigate(`/book/${book._id}`);
          setSearchQuery("");
          setShowSuggestions(false);
        }}
        className="px-4 py-2 cursor-pointer hover:bg-gray-100 transition"
      >
        {book.title}
      </div>
    ))}
  </div>
)}
</div>
          {/* Right */}
          <div className="flex items-center gap-6">
            <NavLink to="/wishlist">
              <Heart size={22} />
            </NavLink>

            <NavLink to="/cart" className="relative">
              <ShoppingCart size={22} />
              {cart?.totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {cart.totalItems}
                </span>
              )}
            </NavLink>

            {/* Profile */}
            {isAuthenticated ? (
              <div className="relative hidden md:block" ref={profileRef}>
                <button onClick={() => setProfileOpen(!profileOpen)}>
                  <User size={24} />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-3 w-60 bg-white shadow-lg rounded-lg p-2 z-50">
                    {/* Greeting */}
                    <p className="px-4 py-2 font-semibold text-gray-900 border-b border-gray-100">
                      Hi, {user?.name}
                    </p>

                    {/* Links */}
                    <nav className="flex flex-col">
                      <NavLink
                        to="/profile"
                        className={({ isActive }) =>
                          `px-4 py-2 rounded flex items-center gap-2 transition text-gray-700 hover:bg-gray-100 ${
                            isActive
                              ? "bg-blue-50 text-blue-600 font-medium"
                              : ""
                          }`
                        }
                      >
                        <User size={16} />
                        Profile
                      </NavLink>

                      <NavLink
                        to="/orders"
                        className={({ isActive }) =>
                          `px-4 py-2 rounded flex items-center gap-2 transition text-gray-700 hover:bg-gray-100 ${
                            isActive
                              ? "bg-blue-50 text-blue-600 font-medium"
                              : ""
                          }`
                        }
                      >
                        <Package size={16} />
                        My Orders
                      </NavLink>

                      <NavLink
                        to="/wishlist"
                        className={({ isActive }) =>
                          `px-4 py-2 rounded flex items-center gap-2 transition text-gray-700 hover:bg-gray-100 ${
                            isActive
                              ? "bg-blue-50 text-blue-600 font-medium"
                              : ""
                          }`
                        }
                      >
                        <Heart size={16} />
                        Wishlist
                      </NavLink>

                      <NavLink
                        to="/dashboard"
                        className={({ isActive }) =>
                          `px-4 py-2 rounded flex items-center gap-2 transition text-gray-700 hover:bg-gray-100 ${
                            isActive
                              ? "bg-blue-50 text-blue-600 font-medium"
                              : ""
                          }`
                        }
                      >
                        <LayoutDashboard size={16} />
                        Dashboard
                      </NavLink>
                    </nav>

                    <hr className="my-2 border-gray-200" />

                    {/* Logout */}
                    <button
                      onClick={logout}
                      className="flex items-center gap-2 px-4 py-2 text-red-600 rounded hover:bg-red-50 w-full transition"
                    >
                      <LogOut size={16} />
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

            {/* Mobile Toggle */}
            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t py-4 space-y-2">
            <form onSubmit={handleSearch}>
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search books..."
                className="w-full border px-4 py-2 rounded-lg"
              />
            </form>

            {isAuthenticated ? (
              <>
                <NavLink
                  to="/profile"
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-100 transition ${
                      isActive
                        ? "bg-blue-50 text-blue-600 font-medium"
                        : "text-gray-700"
                    }`
                  }
                >
                  <User size={16} /> Profile
                </NavLink>

                <NavLink
                  to="/orders"
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-100 transition ${
                      isActive
                        ? "bg-blue-50 text-blue-600 font-medium"
                        : "text-gray-700"
                    }`
                  }
                >
                  <Package size={16} /> Orders
                </NavLink>

                <NavLink
                  to="/wishlist"
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-100 transition ${
                      isActive
                        ? "bg-blue-50 text-blue-600 font-medium"
                        : "text-gray-700"
                    }`
                  }
                >
                  <Heart size={16} /> Wishlist
                </NavLink>

                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-100 transition ${
                      isActive
                        ? "bg-blue-50 text-blue-600 font-medium"
                        : "text-gray-700"
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
                    `flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-100 transition ${
                      isActive
                        ? "bg-blue-50 text-blue-600 font-medium"
                        : "text-gray-700"
                    }`
                  }
                >
                  <LogIn size={16} /> Login
                </NavLink>

                <NavLink
                  to="/signup"
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-100 transition ${
                      isActive
                        ? "bg-blue-50 text-blue-600 font-medium"
                        : "text-gray-700"
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
