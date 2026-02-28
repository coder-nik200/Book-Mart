import React, { createContext, useState, useEffect, useCallback } from "react";
import { cartAPI } from "../api/apiClient";
import { useAuth } from "./AuthContext";
import toast from "react-hot-toast";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();

  const [cart, setCart] = useState({
    items: [],
    totalPrice: 0,
    totalItems: 0,
  });

  const [loading, setLoading] = useState(true);

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCart({ items: [], totalPrice: 0, totalItems: 0 });
      setLoading(false);
      return;
    }

    try {
      const res = await cartAPI.getCart();
      setCart(res.data.cart);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (bookId, quantity = 1) => {
    try {
      const res = await cartAPI.addToCart(bookId, quantity);
      setCart(res.data.cart);
      toast.success("Added to cart");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add");
    }
  };

  const updateQuantity = async (bookId, quantity) => {
    try {
      const res = await cartAPI.updateCart(bookId, quantity);
      setCart(res.data.cart);
    } catch (err) {
      toast.error(err.response?.data?.message);
    }
  };

  const removeFromCart = async (bookId) => {
    try {
      const res = await cartAPI.removeFromCart(bookId);
      setCart(res.data.cart);
    } catch (err) {
      toast.error("Failed to remove");
    }
  };

  const clearCart = async () => {
    try {
      await cartAPI.clearCart();
      setCart({ items: [], totalPrice: 0, totalItems: 0 });
    } catch (err) {
      toast.error("Failed to clear cart");
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => React.useContext(CartContext);
