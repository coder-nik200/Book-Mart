import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";

// Website pages
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import BooksPage from "./pages/BooksPage";
import BookDetailsPage from "./components/BookDetailsPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import WishlistPage from "./components/WishlistPage";
import DashboardPage from "./components/DashboardPage";
import OrderPage from "./components/OrderPage";
import OrderSuccessPageWrapper from "./components/OrderSuccessPageWrapper";
import AboutPage from "./pages/AboutPage";
import SearchResultsPage from "./components/SearchResultsPage";

// Profile pages
import ProfileLayout from "./pages/profile/ProfileLayout";
import ProfileOverview from "./pages/profile/ProfileOverview";
import AddressManager from "./pages/profile/AddressManager";
import OrderHistory from "./pages/profile/OrderHistory";
import ChangePassword from "./pages/profile/ChangePassword";

// Admin pages
import AdminLogin from "./admin/AdminLogin";
import AdminDashboard from "./admin/AdminDashboard";
import AdminLayout from "./admin/AdminLayout";
import AdminUsers from "./admin/AdminUsers";
import AdminBooks from "./admin/AdminBooks";
import AdminOrders from "./admin/AdminOrders";

// ChatBot
import AiChatBot from "./components/ChatBot/AiChatBot";
import FloatingChatBot from "./components/ChatBot/FloatingChatBot";

// Fallback
import NotFound from "./pages/404";
import { WishlistProvider } from "./context/WishlistContext";

/* ===================== ROUTES ===================== */

const AppRoutes = () => (
  <Routes>
    {/* ========== WEBSITE LAYOUT ========== */}
    <Route element={<Layout />}>
      {/* Public */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/books" element={<BooksPage />} />
      <Route path="/book/:id" element={<BookDetailsPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/search" element={<SearchResultsPage />} />
      <Route path="/order-success" element={<OrderSuccessPageWrapper />} />

      {/* Protected */}
      <Route
        path="/cart"
        element={
          <ProtectedRoute>
            <CartPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/checkout"
        element={
          <ProtectedRoute>
            <CheckoutPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/wishlist"
        element={
          <ProtectedRoute>
            <WishlistPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders"
        element={
          <ProtectedRoute>
            <OrderPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/order/:orderId"
        element={
          <ProtectedRoute>
            <OrderPage />
          </ProtectedRoute>
        }
      />

      {/* Profile */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfileLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<ProfileOverview />} />
        <Route path="addresses" element={<AddressManager />} />
        <Route path="security" element={<ChangePassword />} />
        <Route path="orders" element={<OrderHistory />} />
      </Route>

      {/* Chat */}
      <Route
        path="/chat"
        element={
          <ProtectedRoute>
            <AiChatBot />
          </ProtectedRoute>
        }
      />
    </Route>

    {/* ========== ADMIN ========== */}
    <Route path="/admin/login" element={<AdminLogin />} />

    <Route
      path="/admin"
      element={
        <ProtectedRoute requiredRole="admin">
          <AdminLayout />
        </ProtectedRoute>
      }
    >
      <Route path="dashboard" element={<AdminDashboard />} />
      <Route path="users" element={<AdminUsers />} />
      <Route path="books" element={<AdminBooks />} />
      <Route path="orders" element={<AdminOrders />} />
    </Route>

    {/* Fallback */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

/* ===================== APP ===================== */

const App = () => (
  <>
    <Toaster position="top-right" />
    <Router>
      <AuthProvider>
        <CartProvider>
        <WishlistProvider>
          <AppRoutes />
          </WishlistProvider>
          <FloatingChatBot />
        </CartProvider>
      </AuthProvider>
    </Router>
  </>
);

export default App;
// See the change bro