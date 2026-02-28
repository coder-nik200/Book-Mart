import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";

// Pages
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
import AdminDashboard from "./admin/AdminDashboard";
import ProfileOverview from "./pages/profile/ProfileOverview";
import AddressManager from "./pages/profile/AddressManager";
import OrderHistory from "./pages/profile/OrderHistory";
import ChangePassword from "./pages/profile/ChangePassword";
import ProfileLayout from "./pages/profile/ProfileLayout";
import OrderSuccessPageWrapper from "./components/OrderSuccessPageWrapper";
import { OrderProvider } from "./context/OrderContext";

const App = () => {
  return (
    <>
      <Toaster position="top-right" />

      <Router>
        <AuthProvider>
          <CartProvider>
            <OrderProvider>
              <Layout>
                <Routes>
                  {/* Public */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignupPage />} />
                  <Route path="/books" element={<BooksPage />} />
                  <Route path="/book/:id" element={<BookDetailsPage />} />

                  {/* User Protected */}
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
                </Routes>
              </Layout>
            </OrderProvider>
          </CartProvider>
        </AuthProvider>
      </Router>
    </>
  );
};

export default App;
