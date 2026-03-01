import Book from "../models/Book.js";

/* =========================
   GET ALL BOOKS (SEARCH + PAGINATION)
========================= */
export const getAllBooks = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 100;
    const keyword = req.query.keyword || "";

    const searchQuery = keyword
      ? {
          $or: [
            { title: { $regex: keyword, $options: "i" } },
            { author: { $regex: keyword, $options: "i" } },
          ],
        }
      : {};

    const books = await Book.find(searchQuery)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Book.countDocuments(searchQuery);

    res.json({
      books,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
/* =========================
   CREATE BOOK
========================= */
export const createBook = async (req, res) => {
  try {
    const bookData = {
      ...req.body,
      createdBy: req.user._id,
    };

    if (req.files?.image?.length) {
      const file = req.files.image[0];

      bookData.image = {
        public_id: file.filename,
        url: `/uploads/${file.filename}`,
      };
    }

    if (req.files?.additionalImages?.length) {
      bookData.additionalImages = req.files.additionalImages.map((file) => ({
        public_id: file.filename,
        url: `/uploads/${file.filename}`,
      }));
    }

    const book = await Book.create(bookData);

    res.status(201).json(book);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
/* =========================
   UPDATE BOOK
========================= */
export const updateBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });

    Object.assign(book, req.body);

    if (req.files?.image?.length) {
      const file = req.files.image[0];

      book.image = {
        public_id: file.filename,
        url: `/uploads/${file.filename}`,
      };
    }

    if (req.files?.additionalImages?.length) {
      book.additionalImages = req.files.additionalImages.map((file) => ({
        public_id: file.filename,
        url: `/uploads/${file.filename}`,
      }));
    }

    const updated = await book.save();
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
/* =========================
   DELETE BOOK
========================= */
export const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });

    await book.deleteOne();
    res.json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};