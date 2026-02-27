// import React, { useState, useEffect } from "react";
// import { useSearchParams } from "react-router-dom";
// import { bookAPI } from "../api/apiClient";
// import BookCard from "../components/BookCard";
// import Loading from "../components/Loading";
// import { useCart } from "../context/CartContext";
// import toast from "react-hot-toast";

// const BooksPage = () => {
//   const { addToCart } = useCart();
//   const [searchParams, setSearchParams] = useSearchParams();

//   const [books, setBooks] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);

//   // Filters
//   const [search, setSearch] = useState("");
//   const [debouncedSearch, setDebouncedSearch] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("");
//   const [minPrice, setMinPrice] = useState("");
//   const [maxPrice, setMaxPrice] = useState("");
//   const [sort, setSort] = useState("");

//   /* ----------------------------
//      Initialize Filters From URL
//   ---------------------------- */
//   useEffect(() => {
//     setSearch(searchParams.get("search") || "");
//     setSelectedCategory(searchParams.get("category") || "");
//     setMinPrice(searchParams.get("minPrice") || "");
//     setMaxPrice(searchParams.get("maxPrice") || "");
//     setSort(searchParams.get("sort") || "");
//     setPage(Number(searchParams.get("page")) || 1);
//   }, []);

//   /* ----------------------------
//      Debounce Search
//   ---------------------------- */
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setDebouncedSearch(search);
//     }, 500);

//     return () => clearTimeout(timer);
//   }, [search]);

//   /* ----------------------------
//      Update URL When Filters Change
//   ---------------------------- */
//   useEffect(() => {
//     setSearchParams({
//       search: debouncedSearch || "",
//       category: selectedCategory || "",
//       minPrice: minPrice || "",
//       maxPrice: maxPrice || "",
//       sort: sort || "",
//       page: page.toString(),
//     });
//   }, [debouncedSearch, selectedCategory, minPrice, maxPrice, sort, page]);

//   /* ----------------------------
//      Fetch Categories
//   ---------------------------- */
//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const res = await bookAPI.getCategories();
//         setCategories(res.data.categories);
//       } catch (err) {
//         toast.error("Failed to load categories");
//       }
//     };
//     fetchCategories();
//   }, []);

//   /* ----------------------------
//      Fetch Books
//   ---------------------------- */
//   useEffect(() => {
//     const fetchBooks = async () => {
//       try {
//         setLoading(true);

//         const res = await bookAPI.getAllBooks({
//           search: debouncedSearch,
//           category: selectedCategory,
//           minPrice: minPrice || undefined,
//           maxPrice: maxPrice || undefined,
//           sort,
//           page,
//           limit: 12,
//         });

//         setBooks(res.data.books);
//         setTotalPages(res.data.pagination.pages);
//       } catch (err) {
//         toast.error("Failed to load books");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBooks();
//   }, [debouncedSearch, selectedCategory, minPrice, maxPrice, sort, page]);

//   /* ----------------------------
//      Handlers
//   ---------------------------- */
//   const handleAddToCart = (book) => {
//     addToCart(book, 1);
//     toast.success("Added to cart!");
//   };

//   const handleAddToWishlist = () => {
//     toast.success("Added to wishlist!");
//   };

//   const clearFilters = () => {
//     setSearch("");
//     setSelectedCategory("");
//     setMinPrice("");
//     setMaxPrice("");
//     setSort("");
//     setPage(1);
//   };

//   /* ----------------------------
//      Render
//   ---------------------------- */

//   if (loading && books.length === 0) return <Loading />;

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="max-w-7xl mx-auto px-4 py-8">
//         <h1 className="text-4xl font-bold mb-8">Browse Books</h1>

//         <div className="grid md:grid-cols-4 gap-8">
//           {/* ---------------- Filters ---------------- */}
//           <div className="md:col-span-1">
//             <div className="bg-white rounded-xl shadow p-6 space-y-6 sticky top-24">
//               {/* Search */}
//               <div>
//                 <label className="block font-semibold mb-2">Search</label>
//                 <input
//                   type="text"
//                   value={search}
//                   onChange={(e) => {
//                     setSearch(e.target.value);
//                     setPage(1);
//                   }}
//                   placeholder="Book title or author"
//                   className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
//                 />
//               </div>

//               {/* Category */}
//               <div>
//                 <label className="block font-semibold mb-2">Category</label>
//                 <select
//                   value={selectedCategory}
//                   onChange={(e) => {
//                     setSelectedCategory(e.target.value);
//                     setPage(1);
//                   }}
//                   className="w-full px-4 py-2 border rounded-lg"
//                 >
//                   <option value="">All Categories</option>
//                   {categories.map((cat) => (
//                     <option key={cat._id} value={cat._id}>
//                       {cat.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {/* Price */}
//               <div>
//                 <label className="block font-semibold mb-2">Price Range</label>
//                 <div className="flex gap-2">
//                   <input
//                     type="number"
//                     value={minPrice}
//                     onChange={(e) => {
//                       setMinPrice(e.target.value);
//                       setPage(1);
//                     }}
//                     placeholder="Min"
//                     className="flex-1 px-4 py-2 border rounded-lg"
//                   />
//                   <input
//                     type="number"
//                     value={maxPrice}
//                     onChange={(e) => {
//                       setMaxPrice(e.target.value);
//                       setPage(1);
//                     }}
//                     placeholder="Max"
//                     className="flex-1 px-4 py-2 border rounded-lg"
//                   />
//                 </div>
//               </div>

//               {/* Sort */}
//               <div>
//                 <label className="block font-semibold mb-2">Sort By</label>
//                 <select
//                   value={sort}
//                   onChange={(e) => {
//                     setSort(e.target.value);
//                     setPage(1);
//                   }}
//                   className="w-full px-4 py-2 border rounded-lg"
//                 >
//                   <option value="">Newest</option>
//                   <option value="price-low">Price: Low to High</option>
//                   <option value="price-high">Price: High to Low</option>
//                   <option value="rating">Highest Rated</option>
//                   <option value="popularity">Most Popular</option>
//                 </select>
//               </div>

//               <button
//                 onClick={clearFilters}
//                 className="w-full bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg font-semibold transition"
//               >
//                 Clear Filters
//               </button>
//             </div>
//           </div>

//           {/* ---------------- Books ---------------- */}
//           <div className="md:col-span-3">
//             {loading ? (
//               <Loading />
//             ) : books.length > 0 ? (
//               <>
//                 <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
//                   {books.map((book) => (
//                     <BookCard
//                       key={book._id}
//                       book={book}
//                       onAddToCart={handleAddToCart}
//                       onAddToWishlist={handleAddToWishlist}
//                     />
//                   ))}
//                 </div>

//                 {/* Pagination */}
//                 <div className="flex justify-center gap-2">
//                   <button
//                     onClick={() => setPage((p) => Math.max(1, p - 1))}
//                     disabled={page === 1}
//                     className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-100"
//                   >
//                     Previous
//                   </button>

//                   {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//                     const pageNumber = page <= 3 ? i + 1 : page + i - 2;

//                     if (pageNumber > totalPages) return null;

//                     return (
//                       <button
//                         key={pageNumber}
//                         onClick={() => setPage(pageNumber)}
//                         className={`px-4 py-2 rounded-lg ${
//                           page === pageNumber
//                             ? "bg-blue-600 text-white"
//                             : "border hover:bg-gray-100"
//                         }`}
//                       >
//                         {pageNumber}
//                       </button>
//                     );
//                   })}

//                   <button
//                     onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
//                     disabled={page === totalPages}
//                     className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-100"
//                   >
//                     Next
//                   </button>
//                 </div>
//               </>
//             ) : (
//               <div className="text-center py-16 bg-white rounded-xl shadow">
//                 <div className="text-6xl mb-4">📚</div>
//                 <h2 className="text-2xl font-semibold mb-2">No Books Found</h2>
//                 <p className="text-gray-500 mb-4">
//                   Try adjusting your filters or search.
//                 </p>
//                 <button
//                   onClick={clearFilters}
//                   className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
//                 >
//                   Reset Filters
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BooksPage;

import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { bookAPI } from "../api/apiClient";
import BookCard from "../components/BookCard";
import Loading from "../components/Loading";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";

const BooksPage = () => {
  const { addToCart } = useCart();
  const [searchParams, setSearchParams] = useSearchParams();

  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("");

  /* ---------------- INIT FROM URL ---------------- */
  useEffect(() => {
    setSearch(searchParams.get("search") || "");
    setSelectedCategory(searchParams.get("category") || "");
    setMinPrice(searchParams.get("minPrice") || "");
    setMaxPrice(searchParams.get("maxPrice") || "");
    setSort(searchParams.get("sort") || "");
    setPage(Number(searchParams.get("page")) || 1);
  }, []);

  /* ---------------- DEBOUNCE ---------------- */
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  /* ---------------- UPDATE URL CLEANLY ---------------- */
  useEffect(() => {
    const params = {};

    if (debouncedSearch) params.search = debouncedSearch;
    if (selectedCategory) params.category = selectedCategory;
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;
    if (sort) params.sort = sort;

    params.page = page.toString();

    setSearchParams(params);
  }, [debouncedSearch, selectedCategory, minPrice, maxPrice, sort, page]);

  /* ---------------- FETCH CATEGORIES ---------------- */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await bookAPI.getCategories();
        setCategories(res.data.categories);
      } catch {
        toast.error("Failed to load categories");
      }
    };
    fetchCategories();
  }, []);

  /* ---------------- FETCH BOOKS ---------------- */
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);

        const res = await bookAPI.getAllBooks({
          search: debouncedSearch,
          category: selectedCategory,
          minPrice: minPrice || undefined,
          maxPrice: maxPrice || undefined,
          sort,
          page,
          limit: 12,
        });

        setBooks(res.data.books);
        setTotalPages(res.data.pagination.pages);
      } catch {
        toast.error("Failed to load books");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [debouncedSearch, selectedCategory, minPrice, maxPrice, sort, page]);

  const handleAddToCart = (book) => {
    addToCart(book, 1);
    toast.success("Added to cart!");
  };

  const clearFilters = () => {
    setSearch("");
    setSelectedCategory("");
    setMinPrice("");
    setMaxPrice("");
    setSort("");
    setPage(1);
  };

  if (loading && books.length === 0) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Browse Books</h1>

        <div className="grid md:grid-cols-4 gap-8">
          {/* FILTERS */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl shadow p-6 space-y-6 sticky top-24">
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search book or author"
                className="w-full px-4 py-2 border rounded-lg"
              />

              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setPage(1);
                }}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>

              <button
                onClick={clearFilters}
                className="w-full bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg"
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* BOOKS */}
          <div className="md:col-span-3">
            {books.length > 0 ? (
              <>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {books.map((book) => (
                    <BookCard
                      key={book._id}
                      book={book}
                      onAddToCart={handleAddToCart}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-16 bg-white rounded-xl shadow">
                <h2 className="text-2xl font-semibold">No Books Found</h2>
                <button
                  onClick={clearFilters}
                  className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BooksPage;
