# 📚 BookMart

A modern full-stack e-commerce platform for buying and selling books online. BookMart delivers a seamless shopping experience with secure authentication, advanced search, personalized recommendations, wishlist management, Stripe payments, and a powerful admin dashboard for managing the store.

## 🚀 Live Demo

- 🌐 **Frontend:** https://book-mart-frontend.vercel.app/

---

## 📖 Overview

BookMart is built with the MERN stack and follows modern development practices to provide a fast, scalable, and secure online bookstore. Customers can browse books, manage their cart and wishlist, place orders, and track purchases, while administrators can efficiently manage books, users, categories, and orders through a dedicated dashboard.

---

# ✨ Features

## 👤 Customer Features

- 🔐 Secure JWT Authentication
- 👤 User Registration & Login
- 🔄 Automatic Refresh Token Authentication
- 📚 Browse Books
- 🔍 Advanced Search & Filters
- 📖 Book Details Page
- ⭐ Featured Books
- 🔥 Best Sellers
- 🆕 New Arrivals
- ❤️ Wishlist Management
- 🛒 Shopping Cart
- ➕ Update Cart Quantity
- 💳 Secure Stripe Checkout
- 📦 Order History
- 🚚 Order Tracking
- 🏠 Address Management
- 👤 Profile Management
- 🔑 Forgot & Reset Password
- 📱 Fully Responsive UI

---

## 👨‍💼 Admin Features

- 📊 Analytics Dashboard
- 📚 Book Management (CRUD)
- 🗂️ Category Management
- 👥 User Management
- 🚫 Block / Unblock Users
- 📦 Order Management
- 🔄 Update Order Status
- ⭐ Review Moderation

---

# 🛠️ Tech Stack

### Frontend

- React 19
- Vite
- Tailwind CSS 4
- React Router
- Axios
- Framer Motion
- React Hot Toast

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose

### Authentication

- JWT Access Token
- JWT Refresh Token
- bcryptjs

### Payment

- Stripe

### Email Service

- Nodemailer

### Validation

- Express Validator

### Deployment

- Frontend – Vercel
- Backend – Vercel
- Database – MongoDB Atlas

---

# 📂 Project Structure

```text
BookMart/
│
├── Frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── api/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│
├── Backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── config/
│   ├── utils/
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/coder-nik200/Book-Mart.git
```

```bash
cd BookMart
```

---

## Backend Setup

```bash
cd Backend
npm install
```

Create a `.env` file and add:

```env
PORT=5000

MONGO_URI=your_mongodb_connection

JWT_SECRET=your_jwt_secret

JWT_REFRESH_SECRET=your_refresh_secret

STRIPE_SECRET_KEY=your_stripe_secret

EMAIL_USER=your_email

EMAIL_PASS=your_password

FRONTEND_URL=http://localhost:5173
```

Run the backend:

```bash
npm run dev
```

---

## Frontend Setup

```bash
cd Frontend
npm install
npm run dev
```

---

# 📚 Database Collections

- Users
- Books
- Categories
- Orders
- Cart
- Wishlist
- Reviews
- Addresses
- Coupons

---

# 🔌 API Endpoints

## Authentication

```http
POST /api/auth/signup
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/refresh-token
POST /api/auth/forgot-password
POST /api/auth/reset-password
```

## Books

```http
GET /api/books
GET /api/books/:id
GET /api/books/featured
GET /api/books/new-arrivals
GET /api/books/best-sellers
```

## Cart

```http
GET /api/cart
POST /api/cart/add
PUT /api/cart/update
DELETE /api/cart/:bookId
```

## Wishlist

```http
GET /api/wishlist
POST /api/wishlist
DELETE /api/wishlist/:bookId
```

## Orders

```http
POST /api/orders/create
GET /api/orders/my-orders
GET /api/orders/:id
```

## Admin

```http
GET /api/admin/dashboard
POST /api/admin/books
PUT /api/admin/books/:id
DELETE /api/admin/books/:id
```

---

# 🔒 Security Features

- JWT Authentication
- Refresh Tokens
- Password Hashing (bcryptjs)
- Role-Based Authorization
- Protected Routes
- Input Validation
- CORS Protection
- Secure Stripe Payments
- Secure HTTP Cookies

---

# ✨ Highlights

- ✅ Modern Responsive UI
- ✅ Full Authentication System
- ✅ Book Search & Filtering
- ✅ Shopping Cart
- ✅ Wishlist
- ✅ Stripe Payment Gateway
- ✅ Complete Checkout Flow
- ✅ Order Tracking
- ✅ Admin Dashboard
- ✅ Email Notifications
- ✅ Protected APIs
- ✅ RESTful Architecture
- ✅ Error Handling
- ✅ Toast Notifications

---

# 🧪 Running Tests

```bash
npm run seed
```

Then:

1. Register a new account.
2. Browse books.
3. Add books to the cart.
4. Complete checkout.
5. Log in as an admin to manage the store.

---

# 🚀 Future Enhancements

- AI Book Recommendation System
- Product Reviews & Ratings
- Coupons & Promotions
- Multi-language Support
- Dark Mode
- Sales Analytics
- Inventory Alerts
- PDF Invoice Generation

---

# 👨‍💻 Author

**Nitish Bharti**

- 💼 Portfolio: https://nitish-portfolio17.netlify.app/
- 💻 GitHub: https://github.com/coder-nik200
- 🔗 LinkedIn: https://www.linkedin.com/in/nitish-kumar-bharti-631a37359/

---

# 📄 License

This project is licensed under the **MIT License**.

---

# ⭐ Support

If you found this project helpful, please consider giving it a **⭐ on GitHub**.
