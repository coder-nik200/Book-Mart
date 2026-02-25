import Cart from "../models/Cart.js";
import Book from "../models/Book.js";

// ==================== GET CART ====================
export const getCart = async (req, res) => {
  try {
    const userId = req.user._id;
    let cart = await Cart.findOne({ user: userId }).populate("items.book");

    if (!cart) {
      cart = await Cart.create({ user: userId, items: [] });
    }

    res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== ADD TO CART ====================
export const addToCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { bookId, quantity = 1 } = req.body;

    if (!bookId || quantity < 1) {
      return res.status(400).json({ success: false, message: "Invalid book or quantity" });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ success: false, message: "Book not found" });
    }

    if (book.stock < quantity) {
      return res.status(400).json({ success: false, message: "Insufficient stock" });
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = await Cart.create({
        user: userId,
        items: [
          {
            book: bookId,
            quantity,
            price: book.discountPrice || book.price,
          },
        ],
      });
    } else {
      // Check if book already in cart
      const existingItem = cart.items.find((item) => item.book.toString() === bookId);

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({
          book: bookId,
          quantity,
          price: book.discountPrice || book.price,
        });
      }
    }

    // Calculate total price and items
    cart.totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    cart.totalPrice = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    await cart.save();
    await cart.populate("items.book");

    res.status(200).json({
      success: true,
      message: "Added to cart",
      cart,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== UPDATE CART ITEM ====================
export const updateCartItem = async (req, res) => {
  try {
    const userId = req.user._id;
    const { bookId, quantity } = req.body;

    if (quantity < 0) {
      return res.status(400).json({ success: false, message: "Quantity cannot be negative" });
    }

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex((item) => item.book.toString() === bookId);
    if (itemIndex === -1) {
      return res.status(404).json({ success: false, message: "Item not in cart" });
    }

    if (quantity === 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      const book = await Book.findById(bookId);
      if (book.stock < quantity) {
        return res.status(400).json({ success: false, message: "Insufficient stock" });
      }
      cart.items[itemIndex].quantity = quantity;
    }

    // Recalculate totals
    cart.totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    cart.totalPrice = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    await cart.save();
    await cart.populate("items.book");

    res.status(200).json({
      success: true,
      message: "Cart updated",
      cart,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== REMOVE FROM CART ====================
export const removeFromCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { bookId } = req.params;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    cart.items = cart.items.filter((item) => item.book.toString() !== bookId);

    // Recalculate totals
    cart.totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    cart.totalPrice = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    await cart.save();
    await cart.populate("items.book");

    res.status(200).json({
      success: true,
      message: "Item removed from cart",
      cart,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== CLEAR CART ====================
export const clearCart = async (req, res) => {
  try {
    const userId = req.user._id;

    await Cart.findOneAndUpdate(
      { user: userId },
      { items: [], totalPrice: 0, totalItems: 0 },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Cart cleared",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
