# Features & Architecture Overview - BookMart

Comprehensive documentation of BookMart features, architecture patterns, and implementation details.

## Table of Contents
1. [Features Overview](#features-overview)
2. [Architecture](#architecture)
3. [Data Flow](#data-flow)
4. [Database Design](#database-design)
5. [API Endpoints Summary](#api-endpoints-summary)
6. [Frontend Components](#frontend-components)
7. [Authentication Flow](#authentication-flow)
8. [Payment Flow](#payment-flow)
9. [Deployment Architecture](#deployment-architecture)

---

## Features Overview

### 👤 User Features

#### Authentication & Account Management
- **User Registration**: Email-based signup with validation
- **User Login**: Secure login with JWT tokens
- **Password Reset**: Forgot password with email verification
- **Profile Management**: Update user information
- **Account Security**: Password hashing with bcryptjs, JWT refresh tokens

#### Product Browsing
- **Book Listing**: Paginated book display with 12 items per page
- **Advanced Search**: Search by title and author
- **Filtering**: Filter by category and price range
- **Sorting**: Sort by price (asc/desc), rating, popularity, newest
- **Featured Books**: View highlighted/featured books
- **New Arrivals**: See recently added books
- **Best Sellers**: Browse best-selling books
- **Book Details**: View full book information with reviews and ratings

#### Shopping Features
- **Add to Cart**: Add books with quantity control
- **Shopping Cart**: View, update quantities, remove items
- **Cart Persistence**: Cart saved in localStorage
- **Add to Wishlist**: Save books for later
- **Wishlist Management**: View, add, remove from wishlist
- **Stock Validation**: Check availability before purchase

#### Checkout & Orders
- **Address Selection**: Choose from saved addresses
- **Payment Methods**: Multiple payment options available
- **Order Creation**: Create order from cart items
- **Order History**: View past orders with details
- **Order Tracking**: Track order status (pending, confirmed, shipped, delivered)
- **Order Cancellation**: Cancel orders with automatic refunds

#### User Reviews & Ratings
- **Write Reviews**: Add reviews to books
- **Rating System**: Rate books 1-5 stars
- **Review Visibility**: See reviews from other users
- **Rating Calculation**: Automatic average rating calculation

### 👨‍💼 Admin Features

#### Dashboard & Analytics
- **Admin Dashboard**: View key metrics and statistics
- **User Analytics**: Total users, active users, blocked users
- **Product Analytics**: Total books, categories, stock status
- **Order Analytics**: Total orders, pending orders, revenue
- **Revenue Tracking**: Total sales revenue, monthly trends
- **Recent Orders Widget**: Quick view of latest orders

#### Book Management
- **Add Books**: Create new book entries
- **Edit Books**: Update book details (title, author, price, stock, etc.)
- **Delete Books**: Remove books from catalog
- **Bulk Actions**: Manage multiple books efficiently
- **Stock Management**: Monitor and update inventory levels
- **Featured Books**: Mark books as featured/bestsellers
- **Category Assignment**: Organize books by category

#### Category Management
- **Create Categories**: Add new book categories
- **Edit Categories**: Update category name, description, icon
- **Delete Categories**: Remove categories
- **Active Status**: Control category visibility

#### User Management
- **View All Users**: List all users with pagination
- **User Details**: See user information and activity
- **Block Users**: Prevent blocked users from purchases
- **Unblock Users**: Restore access to previously blocked users
- **User Activity**: Track last login and activities

#### Order Management
- **View All Orders**: List all orders with search/filter
- **Order Details**: Access full order information
- **Order Status Updates**: Update order status (pending → confirmed → shipped → delivered)
- **Tracking Numbers**: Add tracking information for shipping
- **Order History**: Archive and view historical orders

#### Content Moderation
- **Review Management**: View all book reviews
- **Review Approval**: Approve/moderate reviews
- **Review Deletion**: Remove inappropriate reviews
- **Rating Recalculation**: Auto-update book ratings when reviews change

---

## Architecture

### 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (React/Vite)                │
│  ┌──────────┬──────────────┬──────────────┬──────────────┐
│  │ HomePage │ BooksPage    │ CartPage     │ CheckoutPage │
│  └──────────┴──────────────┴──────────────┴──────────────┘
│  ┌──────────────────────────────────────────────────────┐
│  │ Components: Navbar, Footer, BookCard, ProtectedRoute │
│  └──────────────────────────────────────────────────────┘
│  ┌──────────────────────────────────────────────────────┐
│  │ State: AuthContext, CartContext with localStorage    │
│  └──────────────────────────────────────────────────────┘
│  ┌──────────────────────────────────────────────────────┐
│  │ API Client: Axios with JWT interceptors              │
│  └──────────────────────────────────────────────────────┘
└─────────────────────────────────────────────────────────┘
                        ↕ (REST API + JSON)
┌─────────────────────────────────────────────────────────┐
│                  Backend (Express.js)                   │
│  ┌──────────────────────────────────────────────────────┐
│  │ Routes Layer: Auth, Books, Cart, Orders, User, Admin │
│  └──────────────────────────────────────────────────────┘
│  ┌──────────────────────────────────────────────────────┐
│  │ Controllers: Business logic & data processing        │
│  └──────────────────────────────────────────────────────┘
│  ┌──────────────────────────────────────────────────────┐
│  │ Middleware: Auth, Validation, Error Handling, CORS   │
│  └──────────────────────────────────────────────────────┘
│  ┌──────────────────────────────────────────────────────┐
│  │ Models: User, Book, Order, Cart, Review, etc.        │
│  └──────────────────────────────────────────────────────┘
└─────────────────────────────────────────────────────────┘
                        ↕ (MongoDB Driver)
┌─────────────────────────────────────────────────────────┐
│            MongoDB Database                            │
│  Collections: users, books, orders, carts, reviews      │
└─────────────────────────────────────────────────────────┘
```

### 🔄 Design Patterns

#### MVC Pattern (Backend)
```
Route → Controller → Model → Database
                   ↓ (JSON Response)
                Client
```

Each request flows through:
1. **Route**: Receives request, validates method
2. **Middleware**: Authentication, validation, logging
3. **Controller**: Business logic, data manipulation
4. **Model**: Database operations, schema validation
5. **Response**: JSON response to client

#### Context API Pattern (Frontend)
```
Context Provider
    ↓
    ├─ Auth State: user, token, isAuthenticated
    ├─ Cart State: items, totalPrice, totalItems
    └─ Actions: login, logout, addToCart, removeFromCart
         ↓
      Components (consume context via useContext hook)
```

#### Middleware Chain Pattern
```
Request → CORS → JSON Parser → Auth Check → Role Check → Validator → Controller → Error Handler → Response
```

---

## Data Flow

### User Authentication Flow

```
1. User enters credentials
   ↓
2. Frontend sends POST /auth/signup or /auth/login
   ↓
3. Backend validates input (email format, password strength)
   ↓
4. Check if user exists (login) or doesn't exist (signup)
   ↓
5. Hash password (signup) or verify password (login)
   ↓
6. Generate JWT tokens (access: 7d, refresh: 30d)
   ↓
7. Store tokens in localStorage (frontend)
   ↓
8. Include token in all future requests (Authorization header)
   ↓
9. On token expiry, use refresh token to get new access token
   ↓
10. If refresh fails, redirect to login
```

### Book Search & Filter Flow

```
1. User types search term and selects filters
   ↓
2. Frontend sends GET /api/books?search=...&category=...&minPrice=...
   ↓
3. Backend parses query parameters
   ↓
4. Build MongoDB query with conditions:
   - $regex for search (case-insensitive)
   - $match for category
   - $gte/$lte for price range
   ↓
5. Apply sorting (price, rating, popularity)
   ↓
6. Apply pagination (skip, limit)
   ↓
7. Execute query and get results
   ↓
8. Count total for pagination info
   ↓
9. Return paginated results with metadata
   ↓
10. Frontend displays books and pagination controls
```

### Order Creation Flow

```
1. User views cart with items
   ↓
2. User selects delivery address
   ↓
3. User selects payment method
   ↓
4. Frontend sends POST /api/orders/create
   ↓
5. Backend validates user is authenticated
   ↓
6. Check all items in cart exist and in stock
   ↓
7. Calculate totals (subtotal, tax, shipping, discount)
   ↓
8. Reduce stock for each item
   ↓
9. Create order document
   ↓
10. Clear user's cart
   ↓
11. Send order confirmation email
   ↓
12. Return order details with payment intent
   ↓
13. Frontend initiates payment with Stripe
   ↓
14. After payment confirmation, order status = paid
```

---

## Database Design

### Collections & Relationships

```
users
├── _id: ObjectId
├── name: String
├── email: String (unique, indexed)
├── password: String (hashed)
├── role: String (customer/admin)
├── isBlocked: Boolean
├── lastLogin: Date
└── timestamps

books
├── _id: ObjectId
├── title: String (indexed)
├── author: String (indexed)
├── description: String
├── price: Number
├── discountPrice: Number
├── category: ObjectId → categories
├── image: String
├── stock: Number (indexed)
├── rating: Number (calculated)
├── totalReviews: Number
├── isFeatured: Boolean
├── isBestSeller: Boolean
├── isNewArrival: Boolean
├── isbn: String (unique, indexed)
└── timestamps

categories
├── _id: ObjectId
├── name: String (unique)
├── description: String
├── icon: String
├── isActive: Boolean
└── timestamps

orders
├── _id: ObjectId
├── orderNumber: String (unique, indexed)
├── user: ObjectId → users
├── items: Array[{book, quantity, price}]
├── shippingAddress: {address details}
├── totalPrice: Number
├── shippingCost: Number
├── taxAmount: Number
├── discountAmount: Number
├── paymentStatus: String (pending/paid/failed/refunded)
├── paymentMethod: String
├── status: String (pending/confirmed/shipped/delivered/cancelled)
├── stripePaymentId: String
├── trackingNumber: String
└── timestamps

carts
├── _id: ObjectId
├── user: ObjectId → users (unique, indexed)
├── items: Array[{book, quantity, price}]
├── totalPrice: Number
├── totalItems: Number
└── timestamps

wishlists
├── _id: ObjectId
├── user: ObjectId → users (unique, indexed)
├── books: Array[{book, addedAt}]
└── timestamps

reviews
├── _id: ObjectId
├── book: ObjectId → books (indexed)
├── user: ObjectId → users (indexed)
├── rating: Number (1-5)
├── comment: String
├── helpful: Number
├── unhelpful: Number
├── isApproved: Boolean
└── timestamps

addresses
├── _id: ObjectId
├── user: ObjectId → users (indexed)
├── fullName: String
├── phoneNumber: String
├── street: String
├── city: String
├── state: String
├── zipCode: String
├── country: String
├── isDefault: Boolean
├── addressType: String (home/office/other)
└── timestamps
```

### Indexing Strategy

```javascript
// Performance indexes
books: { categoryId: 1 }
books: { isbn: 1 }
books: { title: 1, author: 1 }
orders: { user: 1, createdAt: -1 }
reviews: { book: 1, isApproved: 1 }
carts: { user: 1 }
users: { email: 1 }
```

---

## API Endpoints Summary

### Quick Reference Matrix

| Method | Endpoint | Auth | Admin | Purpose |
|--------|----------|------|-------|---------|
| POST | /api/auth/signup | ❌ | ❌ | Register user |
| POST | /api/auth/login | ❌ | ❌ | Login user |
| POST | /api/auth/refresh-token | ❌ | ❌ | Refresh JWT |
| GET | /api/books | ❌ | ❌ | List books (filtered) |
| GET | /api/books/:id | ❌ | ❌ | Get book details |
| POST | /api/books/:id/reviews | ✅ | ❌ | Add review |
| GET | /api/cart | ✅ | ❌ | Get cart |
| POST | /api/cart/add | ✅ | ❌ | Add to cart |
| DELETE | /api/cart/:id | ✅ | ❌ | Remove from cart |
| GET | /api/wishlist | ✅ | ❌ | Get wishlist |
| POST | /api/wishlist/add | ✅ | ❌ | Add to wishlist |
| POST | /api/orders/create | ✅ | ❌ | Create order |
| GET | /api/orders/my-orders | ✅ | ❌ | Get user orders |
| PUT | /api/orders/:id/cancel | ✅ | ❌ | Cancel order |
| GET | /api/admin/dashboard | ✅ | ✅ | Admin dashboard |
| POST | /api/admin/books | ✅ | ✅ | Add book |
| PUT | /api/admin/books/:id | ✅ | ✅ | Update book |
| DELETE | /api/admin/books/:id | ✅ | ✅ | Delete book |

---

## Frontend Components

### Page Structure

```
App
├── HomePage
│   ├── Hero Section
│   ├── Categories Browse
│   ├── Featured Books Section
│   ├── New Arrivals Section
│   └── Best Sellers Section
├── LoginPage
│   └── Login Form
├── SignupPage
│   └── Registration Form
├── BooksPage
│   ├── Search & Filter Bar
│   ├── Sorting Controls
│   ├── Books Grid
│   └── Pagination
├── CartPage
│   ├── Cart Items List
│   └── Order Summary Sidebar
├── CheckoutPage
│   ├── Address Selection
│   ├── Payment Method Selection
│   └── Order Summary
└── Shared Components
    ├── Navbar
    ├── Footer
    ├── BookCard
    ├── Loading
    ├── Alert
    └── ProtectedRoute
```

### Component Hierarchy

```
<App>
  <AuthProvider>
    <CartProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/books" element={<BooksPage />} />
        <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
        <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
      </Routes>
      <Footer />
    </CartProvider>
  </AuthProvider>
</App>
```

---

## Authentication Flow

### JWT Strategy

```
User Registration/Login
  ↓
Server generates:
  ├─ accessToken (7 days expiry)
  ├─ refreshToken (30 days expiry)
  └─ user object
  ↓
Frontend stores in localStorage:
  ├─ accessToken
  ├─ refreshToken
  └─ user
  ↓
On subsequent requests:
  ├─ Include accessToken in Authorization header
  ├─ Axios interceptor adds token automatically
  └─ Backend middleware validates token
  ↓
If token expired:
  ├─ Axios interceptor detects 401
  ├─ Automatically sends refresh token
  ├─ Gets new accessToken
  ├─ Retries original request
  └─ If refresh fails, redirect to login
```

### Token Refresh Mechanism

```javascript
// Request Interceptor
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const refreshToken = localStorage.getItem('refreshToken');
      try {
        const { data } = await axios.post('/api/auth/refresh-token', { refreshToken });
        localStorage.setItem('accessToken', data.accessToken);
        // Retry original request
        return axios(error.config);
      } catch {
        // Redirect to login
      }
    }
  }
);
```

---

## Payment Flow

### Stripe Payment Process

```
1. User completes order
   ↓
2. Frontend calls POST /api/orders/payment-intent
   └─ Backend creates Stripe PaymentIntent
   └─ Returns clientSecret
   ↓
3. Frontend initializes Stripe Elements
   └─ Displays card input fields
   ↓
4. User enters card details and clicks Pay
   ↓
5. Frontend calls stripe.confirmPayment()
   └─ Captures card authentication
   └─ Returns payment status
   ↓
6. If successful:
   ├─ Frontend calls POST /api/orders/confirm-payment
   ├─ Backend marks order as paid
   ├─ Reduces stock for each item
   ├─ Sends confirmation email
   └─ Frontend shows success & redirects
   ↓
7. If failed:
   └─ Show error and allow retry
```

### Payment Testing

```
Test Scenarios using Stripe Test Cards:

Success: 4242 4242 4242 4242
  └─ Any future expiry, any CVC

Decline: 4000 0000 0000 0002
  └─ Card will be declined

Auth Required: 4000 0025 0000 3155
  └─ 3D Secure authentication required

Use any 3-digit CVC and future expiry date
```

---

## Deployment Architecture

### Development Stack

```
Frontend (Vite Dev Server)
    ↓ (localhost:5173)
Local Network
    ↓ (localhost:5000)
Backend (Express Dev Server)
    ↓
MongoDB (Local or Atlas)
```

### Production Stack

```
Frontend (Vercel/Netlify CDN)
    ↓ (https://myapp.com)
Internet
    ↓
Backend (Heroku/Railway/Render)
    ↓ (https://api.myapp.com)
MongoDB Atlas Cluster
```

### Continuous Deployment

```
Git Push
  ↓
GitHub Repository
  ├─ Vercel (Frontend)
  │   ├─ Automatic build
  │   ├─ Run tests
  │   └─ Deploy to production
  │
  └─ Heroku/Railway (Backend)
      ├─ Automatic build
      ├─ Run tests
      └─ Deploy to production
```

---

## Performance Considerations

### Frontend Optimization
- Code splitting with lazy loading
- Image optimization with compression
- Caching strategy for API responses
- localStorage for cart persistence
- Pagination to limit data transfer

### Backend Optimization
- Database indexing on frequently queried fields
- Pagination for list endpoints
- Query projection to fetch only needed fields
- Caching strategy for frequently accessed data
- Rate limiting to prevent abuse

### Database Optimization
- Indexes on email, categoryId, ISBN, stock fields
- Avoid N+1 queries with proper joins
- Monitor slow queries
- Archive old orders
- Garbage collection for unused data

---

## Security Features

### Frontend Security
- Protected routes check authentication
- Password visibility toggle (best practice)
- Secure token storage (localStorage + optional httpOnly cookies)
- Input validation before submission
- XSS protection via React escaping

### Backend Security
- JWT token validation on protected routes
- Password hashing with bcryptjs (salt 10)
- Role-based access control (admin/customer)
- Input validation with express-validator
- CORS configuration limiting to frontend domain
- SQL injection prevention via Mongoose
- Rate limiting ready for implementation
- Environment variables for secrets

### Communication Security
- HTTPS in production (enforced)
- CORS headers properly configured
- No sensitive data in URLs
- Secure cookie options (httpOnly, secure, sameSite)

---

## Scalability Roadmap

### Short Term (0-3 months)
- Implement caching layer (Redis)
- Add rate limiting
- Implement logging service
- Add monitoring/alerts

### Medium Term (3-6 months)
- Horizontal scaling with load balancer
- Database read replicas
- CDN for static assets
- Queue system for async jobs (cron jobs, emails)

### Long Term (6+ months)
- Microservices architecture
- Event-driven system
- Advanced analytics
- Recommendation engine
- Multi-region deployment

---

## Monitoring & Analytics

### Key Metrics to Track
- API response time
- Error rate
- User registrations
- Books added/categories
- Orders created
- Payment success rate
- Database query performance
- Active users

### Logging Strategy
- Info logs: User actions, API calls
- Error logs: Failures, exceptions
- Debug logs: Development information
- Centralized logging for production

### Alerting
- High error rate (>1%)
- API latency (>500ms)
- Database connection issues
- Payment failures
- Email delivery failures

---

**Last Updated**: 2024
**Version**: 1.0
**Status**: Complete ✅
