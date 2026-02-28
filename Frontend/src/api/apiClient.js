import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Handle token refresh
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
          { withCredentials: true },
        );
        const { accessToken } = response.data;
        localStorage.setItem("accessToken", accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

// ==================== AUTH APIs ====================
export const authAPI = {
  signup: (data) => api.post("/auth/signup", data),
  login: (data) => api.post("/auth/login", data),
  logout: () => api.post("/auth/logout"),
  getCurrentUser: () => api.get("/auth/current-user"),
  forgotPassword: (email) => api.post("/auth/forgot-password", { email }),
  resetPassword: (data) => api.post("/auth/reset-password", data),
};

// ==================== BOOKS APIs ====================
export const bookAPI = {
  getAllBooks: (params) => api.get("/books", { params }),
  getBook: (id) => api.get(`/books/${id}`),
  getFeaturedBooks: () => api.get("/books/featured"),
  getNewArrivals: () => api.get("/books/new-arrivals"),
  getBestSellers: () => api.get("/books/best-sellers"),
  getCategories: () => api.get("/books/categories"),
  addReview: (bookId, data) => api.post(`/books/${bookId}/reviews`, data),
};

// ==================== CART APIs ====================
export const cartAPI = {
  getCart: () => api.get("/cart"),
  addToCart: (bookId, quantity) => api.post("/cart/add", { bookId, quantity }),
  updateCart: (bookId, quantity) =>
    api.put("/cart/update", { bookId, quantity }),
  removeFromCart: (bookId) => api.delete(`/cart/${bookId}`),
  clearCart: () => api.delete("/cart"),
};

// ==================== WISHLIST APIs ====================
export const wishlistAPI = {
  getWishlist: () => api.get("/wishlist"),
  addToWishlist: (data) => api.post("/wishlist/add", data),
  removeFromWishlist: (bookId) => api.delete(`/wishlist/${bookId}`),
  isInWishlist: (bookId) => api.get(`/wishlist/check/${bookId}`),
};

// ==================== ORDER APIs ====================
export const orderAPI = {
  createOrder: (data) => api.post("/orders/create", data),
  getUserOrders: (params) => api.get("/orders/my-orders", { params }),
  getOrder: (orderId) => api.get(`/orders/${orderId}`),
  cancelOrder: (orderId) => api.put(`/orders/${orderId}/cancel`),
  createPaymentIntent: (data) => api.post("/orders/payment-intent", data),
  confirmPayment: (data) => api.post("/orders/confirm-payment", data),
};

// ==================== USER APIs ====================
export const userAPI = {
  getProfile: () => api.get("/user/profile"),
  updateProfile: (data) => api.put("/user/profile", data),
  changePassword: (data) => api.post("/user/change-password", data),
  getAddresses: () => api.get("/user/addresses"),
  addAddress: (data) => api.post("/user/addresses", data),
  updateAddress: (addressId, data) =>
    api.put(`/user/addresses/${addressId}`, data),
  deleteAddress: (addressId) => api.delete(`/user/addresses/${addressId}`),
  getOrderHistory: (params) => api.get("/user/orders/history", { params }),
};

// ==================== ADMIN APIs ====================
export const adminAPI = {
  getDashboardStats: () => api.get("/admin/dashboard"),

  // Books
  addBook: (data) => api.post("/admin/books", data),
  updateBook: (bookId, data) => api.put(`/admin/books/${bookId}`, data),
  deleteBook: (bookId) => api.delete(`/admin/books/${bookId}`),

  // Categories
  addCategory: (data) => api.post("/admin/categories", data),
  updateCategory: (categoryId, data) =>
    api.put(`/admin/categories/${categoryId}`, data),
  deleteCategory: (categoryId) => api.delete(`/admin/categories/${categoryId}`),

  // Users
  getAllUsers: (params) => api.get("/admin/users", { params }),
  blockUser: (userId) => api.put(`/admin/users/${userId}/block`),
  unblockUser: (userId) => api.put(`/admin/users/${userId}/unblock`),

  // Orders
  getAllOrders: (params) => api.get("/admin/orders", { params }),
  updateOrderStatus: (orderId, data) =>
    api.put(`/admin/orders/${orderId}/status`, data),

  // Reviews
  getAllReviews: () => api.get("/admin/reviews"),
  deleteReview: (reviewId) => api.delete(`/admin/reviews/${reviewId}`),
};

export default api;
