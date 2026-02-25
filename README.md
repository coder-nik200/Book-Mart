# 📚 BookMart - Full Stack E-Commerce Platform

A complete, production-ready e-commerce platform for selling books online. Built with modern technologies and industry best practices.

## 🎯 Features

### 👤 User Features
- ✅ User Authentication (Signup/Login) with JWT
- ✅ Home page with featured, new arrivals, and best-sellers
- ✅ Advanced book search and filtering
- ✅ Book listing with pagination and sorting
- ✅ Shopping cart functionality with persistence
- ✅ Wishlist management
- ✅ Checkout process with address selection
- ✅ Orders history and tracking
- ✅ User profile management
- ✅ Address management (CRUD)
- ✅ Password reset functionality

### 👨‍💼 Admin Features
- ✅ Admin dashboard with analytics
- ✅ Book management (CRUD)
- ✅ Category management
- ✅ User management (Block/Unblock)
- ✅ Order status management
- ✅ Review moderation

### 🔧 Tech Stack
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Frontend**: React 19, Vite, Tailwind CSS 4
- **Authentication**: JWT with Refresh Tokens
- **Payment**: Stripe Integration
- **Email**: Nodemailer
- **Validation**: Express-validator

## 🚀 Quick Start

### Backend Setup
```bash
cd Backend
npm install
cp .env.example .env  # Configure environment variables
npm run seed          # Load sample data
npm start
```

### Frontend Setup
```bash
cd Frontend
npm install
npm run dev
```

## 📚 Database Collections
- **users** - User accounts with authentication
- **books** - Book catalog with pricing and inventory
- **categories** - Book categories
- **orders** - Customer orders
- **carts** - Shopping carts
- **wishlists** - Saved books
- **reviews** - Book ratings and reviews
- **addresses** - Delivery addresses
- **coupons** - Discount codes

## 🔌 Key API Endpoints

### Auth
- `POST /api/auth/signup` - Register
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh-token` - Refresh token

### Books
- `GET /api/books` - Get all books (with filters)
- `GET /api/books/:id` - Get book details
- `GET /api/books/featured` - Featured books
- `GET /api/books/best-sellers` - Best sellers

### Cart (Protected)
- `GET /api/cart` - Get cart
- `POST /api/cart/add` - Add to cart
- `PUT /api/cart/update` - Update quantity
- `DELETE /api/cart/:bookId` - Remove from cart

### Orders (Protected)
- `POST /api/orders/create` - Create order
- `GET /api/orders/my-orders` - Get user orders
- `GET /api/orders/:orderId` - Get order details

### Admin (Protected - Admin role required)
- `GET /api/admin/dashboard` - Dashboard stats
- `POST /api/admin/books` - Add book
- `PUT /api/admin/books/:id` - Update book
- `DELETE /api/admin/books/:id` - Delete book
- And more...

## ✨ Key Features Implemented

✅ JWT Authentication with access & refresh tokens
✅ Role-based authorization (customer/admin)
✅ Protected routes with middleware
✅ Automatic token refresh on expiry
✅ Product search, filtering, and sorting
✅ Shopping cart with localStorage persistence
✅ Wishlist functionality
✅ Complete checkout process
✅ Order management and history
✅ Admin dashboard with analytics
✅ Email notifications
✅ Responsive design with Tailwind CSS
✅ Error handling and validation
✅ Toast notifications

## 🔐 Security Features

- Password hashing with bcryptjs
- JWT token-based authentication
- Role-based access control
- Input validation with express-validator
- CORS configuration
- Protected API endpoints
- Secure payment handling with Stripe

## 📦 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions for:
- Backend (Heroku, Railway, Render)
- Frontend (Vercel, Netlify)
- Database (MongoDB Atlas)

## 🧪 Testing

1. Run `npm run seed` in Backend to populate sample data
2. Create user account via signup
3. Browse books, add to cart, checkout
4. Create admin account to access admin panel

## 🐛 Troubleshooting

**CORS errors**: Check FRONTEND_URL in `.env`
**MongoDB connection failed**: Check MONGO_URI
**JWT token issues**: Clear localStorage and re-login
**Email not sending**: Check SMTP credentials

## 📝 License

MIT License - Open source and free to use

## 🙏 Acknowledgments

Built with Express.js, React, MongoDB, and Tailwind CSS