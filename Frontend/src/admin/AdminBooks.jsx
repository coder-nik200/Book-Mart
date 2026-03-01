import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Loader2, X, Search } from "lucide-react";
import toast from "react-hot-toast";
import { adminAPI, bookAPI } from "../api/apiClient";

const BASE_URL = "http://localhost:5000";

const AdminBooks = () => {
  /* ================= STATE ================= */
  const [allBooks, setAllBooks] = useState([]);
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const initialFormState = {
    title: "",
    slug: "",
    author: "",
    description: "",
    price: "",
    discountPrice: "",
    stock: "",
    language: "English",
    status: "active",
    category: "",
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: false,
    image: null, // IMPORTANT: single file only
  };

  const [formData, setFormData] = useState(initialFormState);

  /* ================= FETCH ================= */
  const fetchBooks = async () => {
    try {
      setLoading(true);
      const res = await bookAPI.getAllBooks({
        keyword: search,
        page: 1,
        limit: 100,
      });
      // setBooks(res.data.books || []);
      const fetched = res.data.books || [];
setAllBooks(fetched); // master copy
setBooks(fetched);    // visible copy
    } catch {
      toast.error("Failed to load books");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await bookAPI.getCategories();
      setCategories(res.data.categories || res.data || []);
    } catch {
      toast.error("Failed to load categories");
    }
  };

  useEffect(() => {
    fetchBooks();
    fetchCategories();
  }, []);

  useEffect(() => {
  if (!search.trim()) {
    setBooks(allBooks);
    return;
  }

  const query = search.toLowerCase();

  const filtered = allBooks.filter((book) =>
    book.title?.toLowerCase().includes(query) ||
    book.author?.toLowerCase().includes(query)
  );

  setBooks(filtered);
}, [search, allBooks]);

  /* ================= HELPERS ================= */
  const generateSlug = (text) =>
    text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
      ...(name === "title" && !editingBook
        ? { slug: generateSlug(value) }
        : {}),
    }));
  };

  const handleImageChange = (file) => {
    if (!file) return;
    setFormData((prev) => ({ ...prev, image: file }));
    setImagePreview(URL.createObjectURL(file));
  };

  /* ================= MODAL ================= */
  const openAddModal = () => {
    setEditingBook(null);
    setFormData(initialFormState);
    setImagePreview(null);
    setShowModal(true);
  };

  const openEditModal = (book) => {
    setEditingBook(book);
    setFormData({
      ...initialFormState,
      ...book,
      category: book.category?._id || book.category,
      image: null, // DO NOT preload file
    });
    setImagePreview(null);
    setShowModal(true);
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.title ||
      !formData.slug ||
      !formData.author ||
      !formData.description ||
      !formData.price ||
      !formData.category
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    if (!editingBook && !formData.image) {
      toast.error("Book image is required");
      return;
    }

    try {
      setSubmitting(true);

      const payload = new FormData();

      // ✅ STRICT FIELD WHITELIST (NO additionalImages!)
      const allowedFields = [
        "title",
        "slug",
        "author",
        "description",
        "price",
        "discountPrice",
        "stock",
        "language",
        "status",
        "category",
        "isFeatured",
        "isBestSeller",
        "isNewArrival",
      ];

      allowedFields.forEach((field) => {
        const value = formData[field];
        if (value !== undefined && value !== null && value !== "") {
          payload.append(field, value);
        }
      });

      if (formData.image instanceof File) {
        payload.append("image", formData.image);
      }

      if (editingBook) {
        await adminAPI.updateBook(editingBook._id, payload);
        toast.success("Book updated successfully");
      } else {
        await adminAPI.addBook(payload);
        toast.success("Book added successfully");
      }

      setShowModal(false);
      fetchBooks();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Operation failed");
    } finally {
      setSubmitting(false);
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this book permanently?")) return;
    try {
      await adminAPI.deleteBook(id);
      toast.success("Book deleted");
      fetchBooks();
    } catch {
      toast.error("Delete failed");
    }
  };
const getImageUrl = (book) => {
  if (!book?.image?.url) return "/placeholder-book.png";

  const url = book.image.url;

  // Just prefix backend URL
  return url.startsWith("http")
    ? url
    : `${BASE_URL}${book.image.url}`;
};

  /* ================= UI ================= */
  return (
    <div className="flex flex-col h-full gap-6 text-white">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <h2 className="text-xl font-semibold">
          Manage Books ({books.length})
        </h2>

        <div className="flex gap-3">
          <div className="relative w-64">
            <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title or author..."
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-black/40 border border-white/10"
            />
          </div>

          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 rounded-lg"
          >
            <Plus size={16} /> Add Book
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {loading ? (
          <div className="flex justify-center p-10">
            <Loader2 className="animate-spin text-indigo-500" />
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-white/5">
              <tr>
                <th className="p-4">Image</th>
                <th className="p-4">Title</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book._id} className="border-t border-white/5">
                  <td className="p-4">
                    <img
                      src={getImageUrl(book)}
                      className="w-12 h-16 object-cover rounded"
                      alt=""
                    />
                  </td>
                  <td className="p-4">{book.title}</td>
                  <td className="p-4">{book.category?.name || "—"}</td>
                  <td className="p-4">${book.price}</td>
                  <td className="p-4 capitalize">{book.status}</td>
                  <td className="p-4 text-right space-x-2">
                    <button onClick={() => openEditModal(book)}>
                      <Pencil size={16} />
                    </button>
                    <button onClick={() => handleDelete(book._id)}>
                      <Trash2 size={16} className="text-red-400" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
<div className="bg-[#0b0f19] w-full max-w-lg p-6 rounded-xl max-h-[90vh] overflow-y-auto no-scrollbar">
            <div className="flex justify-between mb-4">
              <h3 className="text-lg font-semibold">
                {editingBook ? "Edit Book" : "Add Book"}
              </h3>
              <button onClick={() => setShowModal(false)}>
                <X />
              </button>
            </div>

            {(editingBook?.image?.url || imagePreview) && (
              <img
                src={imagePreview || getImageUrl(editingBook)}
                className="w-24 h-36 object-cover mb-4 rounded"
                alt=""
              />
            )}

            <form onSubmit={handleSubmit} className="space-y-3">

              {/* TEXT FIELDS */}
              {[
                ["Title", "title"],
                ["Slug", "slug"],
                ["Author", "author"],
              ].map(([label, name]) => (
                <div key={name}>
                  <label className="text-sm text-gray-400">{label}</label>
                  <input
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    required
                    className="w-full p-2 bg-black/60 border border-white/10 rounded"
                  />
                </div>
              ))}

              <div>
                <label className="text-sm text-gray-400">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  className="w-full p-2 bg-black/60 border border-white/10 rounded"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-gray-400">Price</label>
                  <input type="number" name="price" value={formData.price}
                    onChange={handleChange} required
                    className="w-full p-2 bg-black/60 border border-white/10 rounded" />
                </div>

                <div>
                  <label className="text-sm text-gray-400">Discount Price</label>
                  <input type="number" name="discountPrice"
                    value={formData.discountPrice || ""}
                    onChange={handleChange}
                    className="w-full p-2 bg-black/60 border border-white/10 rounded" />
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-400">Category</label>
                <select name="category" value={formData.category}
                  onChange={handleChange} required
                  className="w-full p-2 bg-black/60 border border-white/10 rounded">
                  <option value="">Select category</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* FLAGS */}
              <div className="flex gap-4 text-sm">
                {["isFeatured", "isBestSeller", "isNewArrival"].map((flag) => (
                  <label key={flag} className="flex items-center gap-2">
                    <input type="checkbox" name={flag}
                      checked={formData[flag]}
                      onChange={handleChange} />
                    {flag}
                  </label>
                ))}
              </div>

              <div>
                <label className="text-sm text-gray-400">Status</label>
                <select name="status" value={formData.status}
                  onChange={handleChange}
                  className="w-full p-2 bg-black/60 border border-white/10 rounded">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-400">Main Image</label>
                <input type="file" onChange={(e) => handleImageChange(e.target.files[0])} />
              </div>

              <button disabled={submitting}
                className="w-full bg-indigo-600 py-2 rounded">
                {submitting ? "Saving..." : "Save Changes"}
              </button>

            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBooks;