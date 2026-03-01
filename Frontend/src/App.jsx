import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";

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

import ProfileLayout from "./pages/profile/ProfileLayout";
import ProfileOverview from "./pages/profile/ProfileOverview";
import AddressManager from "./pages/profile/AddressManager";
import OrderHistory from "./pages/profile/OrderHistory";
import ChangePassword from "./pages/profile/ChangePassword";

import AdminLogin from "./admin/AdminLogin";
import AdminDashboard from "./admin/AdminDashboard";
import AdminLayout from "./admin/AdminLayout";
import AdminUsers from "./admin/AdminUsers";
import AdminBooks from "./admin/AdminBooks";
import AdminOrders from "./admin/AdminOrders";

import AiChatBot from "./components/ChatBot/AiChatBot";
import FloatingChatBot from "./components/ChatBot/FloatingChatBot";
import NotFound from "./pages/404";
import { WishlistProvider } from "./context/WishlistContext";


const AppRoutes = () => (
  <Routes>
    
    <Route element={<Layout />}>
  
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/books" element={<BooksPage />} />
      <Route path="/book/:id" element={<BookDetailsPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/search" element={<SearchResultsPage />} />
      <Route path="/order-success" element={<OrderSuccessPageWrapper />} />

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
      <Route
        path="/chat"
        element={
          <ProtectedRoute>
            <AiChatBot />
          </ProtectedRoute>
        }
      />
    </Route>
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

    <Route path="*" element={<NotFound />} />
  </Routes>
);


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
