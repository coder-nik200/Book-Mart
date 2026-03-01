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
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import NotFound from "./pages/404";
import BookDetailsPage from "./components/BookDetailsPage";
import OrderPage from "./components/OrderPage";
import WishlistPage from "./components/WishlistPage";
import DashboardPage from "./components/DashboardPage";
import ProfileLayout from "./pages/profile/ProfileLayout";
import ProfileOverview from "./pages/profile/ProfileOverview";
import AddressManager from "./pages/profile/AddressManager";
import OrderHistory from "./pages/profile/OrderHistory";
import ChangePassword from "./pages/profile/ChangePassword";
// import ProfileLayout from "./pages/profile/ProfileLayout";
import OrderSuccessPageWrapper from "./components/OrderSuccessPageWrapper";
import AboutPage from "./pages/AboutPage";

// Admin
import AdminLogin from "./admin/AdminLogin";
import AdminDashboard from "./admin/AdminDashboard";
import AdminLayout from "./admin/AdminLayout";
import AdminRoute from "./admin/AdminRoute";
import AdminUsers from "./admin/AdminUsers";
import AdminBooks from "./admin/AdminBooks";
import AdminOrders from "./admin/AdminOrders";
const App = () => {
  return (
    <>
      <Toaster position="top-right" />

      <Router>
        <AuthProvider>
          <CartProvider>

            <Routes>

              {/* ============ WEBSITE LAYOUT ROUTES ============ */}
              <Route element={<Layout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/books" element={<BooksPage />} />
                <Route path="/book/:id" element={<BookDetailsPage />} />
                <Route path="/about" element={<AboutPage />} />

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

                <Route path="/profile" element={<ProfileLayout />}>
                  <Route index element={<ProfileOverview />} />
                  <Route path="addresses" element={<AddressManager />} />
                  <Route path="security" element={<ChangePassword />} />
                  <Route path="orders" element={<OrderHistory />} />
                </Route>

                <Route
                  path="/orders"
                  element={
                    <ProtectedRoute>
                      <OrderPage />
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

                {/* Admin */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute adminOnly>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/order-success"
                  element={<OrderSuccessPageWrapper />}
                />

                <Route path="/order/:orderId" element={<OrderPage />} />

                {/* Fallback */}
                <Route path="*" element={<NotFound />} />
              </Route>

              {/* ============ ADMIN ROUTES (NO LAYOUT) ============ */}
{/* ============ ADMIN ROUTES ============ */}
<Route path="/admin/login" element={<AdminLogin />} />

<Route
  path="/admin"
  element={
    <AdminRoute>
      <AdminLayout />
    </AdminRoute>
  }
>
  <Route path="dashboard" element={<AdminDashboard />} />
  {/* future admin routes */}
  <Route path="users" element={<AdminUsers />} />
  <Route path="books" element={<AdminBooks />} />
  <Route path="orders" element={<AdminOrders />} />
</Route>

            </Routes>

          </CartProvider>
        </AuthProvider>
      </Router>
    </>
  );
};

export default App;
