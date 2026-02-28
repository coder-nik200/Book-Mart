import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useContext,
} from "react";
import { useAuth } from "./AuthContext";

export const CartContext = createContext();

const EMPTY_CART = {
  items: [],
  totalPrice: 0,
  totalItems: 0,
};

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState(EMPTY_CART);

  /* ================= LOAD CART ================= */
  useEffect(() => {
    if (!isAuthenticated) {
      setCart(EMPTY_CART);               // 🔥 clear cart on logout
      localStorage.removeItem("cart");
      return;
    }

    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, [isAuthenticated]);

  /* ================= SAVE CART ================= */
  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart, isAuthenticated]);

  /* ================= HELPERS ================= */
  const recalcCart = (items) => ({
    items,
    totalPrice: items.reduce(
      (sum, item) =>
        sum + (item.discountPrice || item.price) * item.quantity,
      0
    ),
    totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
  });

  /* ================= ACTIONS ================= */
  const addToCart = useCallback((book, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.items.find((i) => i._id === book._id);

      const items = existing
        ? prev.items.map((i) =>
            i._id === book._id
              ? { ...i, quantity: i.quantity + quantity }
              : i
          )
        : [...prev.items, { ...book, quantity }];

      return recalcCart(items);
    });
  }, []);

  const removeFromCart = useCallback((bookId) => {
    setCart((prev) => recalcCart(prev.items.filter((i) => i._id !== bookId)));
  }, []);

  const updateQuantity = useCallback(
    (bookId, quantity) => {
      if (quantity <= 0) {
        removeFromCart(bookId);
        return;
      }

      setCart((prev) =>
        recalcCart(
          prev.items.map((i) =>
            i._id === bookId ? { ...i, quantity } : i
          )
        )
      );
    },
    [removeFromCart]
  );

  const clearCart = useCallback(() => {
    setCart(EMPTY_CART);
    localStorage.removeItem("cart");
  }, []);

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

/* ================= HOOK ================= */
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};