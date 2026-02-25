import React, { createContext, useState, useEffect, useCallback } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], totalPrice: 0, totalItems: 0 });

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = useCallback(
    (book, quantity = 1) => {
      setCart((prevCart) => {
        const existingItem = prevCart.items.find((item) => item._id === book._id);

        if (existingItem) {
          return {
            ...prevCart,
            items: prevCart.items.map((item) =>
              item._id === book._id ? { ...item, quantity: item.quantity + quantity } : item
            ),
          };
        }

        const newItems = [...prevCart.items, { ...book, quantity }];
        const totalPrice = newItems.reduce((sum, item) => sum + (item.discountPrice || item.price) * item.quantity, 0);
        const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);

        return {
          items: newItems,
          totalPrice,
          totalItems,
        };
      });
    },
    []
  );

  const removeFromCart = useCallback((bookId) => {
    setCart((prevCart) => {
      const newItems = prevCart.items.filter((item) => item._id !== bookId);
      const totalPrice = newItems.reduce((sum, item) => sum + (item.discountPrice || item.price) * item.quantity, 0);
      const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);

      return {
        items: newItems,
        totalPrice,
        totalItems,
      };
    });
  }, []);

  const updateQuantity = useCallback((bookId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(bookId);
      return;
    }

    setCart((prevCart) => {
      const newItems = prevCart.items.map((item) =>
        item._id === bookId ? { ...item, quantity } : item
      );
      const totalPrice = newItems.reduce((sum, item) => sum + (item.discountPrice || item.price) * item.quantity, 0);
      const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);

      return {
        items: newItems,
        totalPrice,
        totalItems,
      };
    });
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCart({ items: [], totalPrice: 0, totalItems: 0 });
  }, []);

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = React.useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};
