import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  ShoppingCart,
  Heart,
  Search,
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  BookOpenText,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/books?search=${searchQuery}`);
      setSearchQuery("");
      setMobileMenuOpen(false);
    }
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div>
            <Link
              to="/"
              onClick={closeMobileMenu}
              className="flex items-center gap-2 text-2xl font-bold text-blue-600 hover:scale-105 transition-transform duration-300"
            >
              <BookOpenText size={28} />
              <span>BookMart</span>
            </Link>
          </div>

          {/* Search Bar (Desktop) */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 mx-8">
            <div className="flex w-full items-center bg-gray-100 rounded-lg px-4 focus-within:ring-2 focus-within:ring-blue-500 transition">
              <Search size={20} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search books..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent px-4 py-2 outline-none"
              />
            </div>
          </form>

          {/* Right Section */}
          <div className="flex items-center gap-6">
            {/* Wishlist */}
            <Link
              to="/wishlist"
              className={`relative transition ${
                location.pathname === "/wishlist"
                  ? "text-blue-600"
                  : "hover:text-blue-600"
              }`}
            >
              <Heart size={24} />
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className={`relative transition ${
                location.pathname === "/cart"
                  ? "text-blue-600"
                  : "hover:text-blue-600"
              }`}
            >
              <ShoppingCart size={24} />
              {cart?.totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-bounce">
                  {cart.totalItems}
                </span>
              )}
            </Link>

            {/* Auth Section */}
            {isAuthenticated ? (
              <div className="hidden md:flex items-center gap-4">
                <span className="text-sm font-medium">Hi, {user?.name}</span>

                {user?.role === "admin" && (
                  <Link
                    to="/admin"
                    className="p-2 hover:bg-gray-100 rounded-lg transition"
                  >
                    <LayoutDashboard size={20} />
                  </Link>
                )}

                <button
                  onClick={logout}
                  className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                  <LogOut size={20} />
                  Logout
                </button>
              </div>
            ) : (
              <div className="hidden md:flex gap-4">
                <Link
                  to="/login"
                  className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Sign Up
                </Link>
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
          <div className="md:hidden pb-4 border-t animate-fadeIn">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="py-3">
              <input
                type="text"
                placeholder="Search books..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </form>

            {isAuthenticated ? (
              <div className="space-y-2">
                <p className="px-4 py-2 font-medium">Hi, {user?.name}</p>

                {user?.role === "admin" && (
                  <Link
                    to="/admin"
                    onClick={closeMobileMenu}
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Admin Dashboard
                  </Link>
                )}

                <button
                  onClick={() => {
                    logout();
                    closeMobileMenu();
                  }}
                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <Link
                  to="/login"
                  onClick={closeMobileMenu}
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={closeMobileMenu}
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
