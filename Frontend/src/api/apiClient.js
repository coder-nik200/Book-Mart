
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response = await axios.post(
          `${API_BASE_URL}/auth/refresh-token`,
          {},
          { withCredentials: true }
        );

        const { accessToken } = response.data;

        localStorage.setItem("accessToken", accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("accessToken");
console.error("Auth failed", error);
return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export const authAPI = {
  signup: (data) => api.post("/auth/signup", data),
  login: (data) => api.post("/auth/login", data),
  logout: () => api.post("/auth/logout"),
  getCurrentUser: () => api.get("/auth/current-user"),
  forgotPassword: (email) => api.post("/auth/forgot-password", { email }),
  resetPassword: (data) => api.post("/auth/reset-password", data),
};

export const bookAPI = {
  getAllBooks: (params) => api.get("/books", { params }),
  getBook: (id) => api.get(`/books/${id}`),
  getFeaturedBooks: () => api.get("/books/featured"),
  getNewArrivals: () => api.get("/books/new-arrivals"),
  getBestSellers: () => api.get("/books/best-sellers"),
  getCategories: () => api.get("/books/categories"),
  addReview: (bookId, data) =>
    api.post(`/books/${bookId}/reviews`, data),
  searchBooks: (query, limit = 10) =>
  api.get("/books/search", {
    params: { q: query, limit },
  }),
};

export const categoryAPI = {
  getAllCategories: () => api.get("/admin/categories"),
};

export const cartAPI = {
  getCart: () => api.get("/cart"),
  addToCart: (bookId, quantity) =>
    api.post("/cart/add", { bookId, quantity }),
  updateCart: (bookId, quantity) =>
    api.put("/cart/update", { bookId, quantity }),
  removeFromCart: (bookId) =>
    api.delete(`/cart/${bookId}`),
  clearCart: () => api.delete("/cart"),
};

export const wishlistAPI = {
  getWishlist: () => api.get("/wishlist"),
  addToWishlist: (data) => api.post("/wishlist/add", data),
  removeFromWishlist: (bookId) =>
    api.delete(`/wishlist/${bookId}`),
  isInWishlist: (bookId) =>
    api.get(`/wishlist/check/${bookId}`),
};

export const orderAPI = {
  createOrder: (data) => api.post("/orders/create", data),
  getUserOrders: (params) =>
    api.get("/orders/my-orders", { params }),
  getOrder: (orderId) => api.get(`/orders/${orderId}`),
  cancelOrder: (orderId) =>
    api.put(`/orders/${orderId}/cancel`),
  createPaymentIntent: (data) =>
    api.post("/orders/payment-intent", data),
  confirmPayment: (data) =>
    api.post("/orders/confirm-payment", data),
};

export const userAPI = {
  getProfile: () => api.get("/user/profile"),
  updateProfile: (data) => api.put("/user/profile", data),
  changePassword: (data) =>
    api.post("/user/change-password", data),
  getAddresses: () => api.get("/user/addresses"),
  addAddress: (data) => api.post("/user/addresses", data),
  updateAddress: (addressId, data) =>
    api.put(`/user/addresses/${addressId}`, data),
  deleteAddress: (addressId) =>
    api.delete(`/user/addresses/${addressId}`),
  getOrderHistory: (params) =>
    api.get("/user/orders/history", { params }),
};

export const adminAPI = {
  getDashboardStats: () => api.get("/admin/dashboard"),

  addBook: (data) => api.post("/admin/books", data),
  updateBook: (bookId, data) =>
    api.put(`/admin/books/${bookId}`, data),
  deleteBook: (bookId) =>
    api.delete(`/admin/books/${bookId}`),

  addCategory: (data) =>
    api.post("/admin/categories", data),
  updateCategory: (categoryId, data) =>
    api.put(`/admin/categories/${categoryId}`, data),
  deleteCategory: (categoryId) =>
    api.delete(`/admin/categories/${categoryId}`),

  getAllUsers: (params) =>
    api.get("/admin/users", { params }),
  blockUser: (userId) =>
    api.put(`/admin/users/${userId}/block`),
  unblockUser: (userId) =>
    api.put(`/admin/users/${userId}/unblock`),

  getAllOrders: (params) =>
    api.get("/admin/orders", { params }),
  updateOrderStatus: (orderId, data) =>
    api.put(`/admin/orders/${orderId}/status`, data),

  getAllReviews: () => api.get("/admin/reviews"),
  deleteReview: (reviewId) =>
    api.delete(`/admin/reviews/${reviewId}`),
};

export default api;