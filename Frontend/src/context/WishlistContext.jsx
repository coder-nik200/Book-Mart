import React, { createContext, useContext, useEffect, useState } from "react";
import { wishlistAPI } from "../api/apiClient";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [wishlist, setWishlist] = useState([]);

  // Fetch once (on login / refresh)
  const fetchWishlist = async () => {
    try {
      const res = await wishlistAPI.getWishlist();
      setWishlist(res.data?.wishlist || []);
    } catch {
      setWishlist([]);
    }
  };

  // ✅ ADD (instant add)
  const addToWishlistLocal = (book) => {
    setWishlist((prev) =>
      prev.some((b) => b.id === book.id) ? prev : [...prev, book]
    );
  };

  // ✅ ADD (instant remove)
  const removeFromWishlistLocal = (bookId) => {
    setWishlist((prev) => prev.filter((b) => b.id !== bookId));
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist();
    } else {
      setWishlist([]);
    }
  }, [isAuthenticated]);

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        totalItems: wishlist.length,
        fetchWishlist,
        addToWishlistLocal,
        removeFromWishlistLocal,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);