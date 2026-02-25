# API Documentation - BookMart

Complete REST API documentation for BookMart backend.

## Base URL
```
Development: http://localhost:5000
Production: https://your-api-domain.com
```

## Authentication
Most endpoints require JWT token in Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## Table of Contents
- [Authentication API](#authentication-api)
- [Books API](#books-api)
- [Cart API](#cart-api)
- [Wishlist API](#wishlist-api)
- [Orders API](#orders-api)
- [User API](#user-api)
- [Admin API](#admin-api)
- [Error Handling](#error-handling)

---

## Authentication API

### 1. User Signup
Register a new user account.

**Request:**
```
POST /api/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Error (400):**
```json
{
  "success": false,
  "message": "Email already exists"
}
```

### 2. User Login
Authenticate user and get tokens.

**Request:**
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

### 3. Refresh Access Token
Get a new access token using refresh token.

**Request:**
```
POST /api/auth/refresh-token
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response (200):**
```json
{
  "success": true,
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

### 4. Forgot Password
Request password reset email.

**Request:**
```
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "john@example.com"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password reset email sent"
}
```

### 5. Reset Password
Reset password using token from email.

**Request:**
```
POST /api/auth/reset-password
Content-Type: application/json

{
  "resetToken": "token_from_email",
  "newPassword": "NewPassword123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password reset successful"
}
```

### 6. Get Current User
Get authenticated user details.

**Request:**
```
GET /api/auth/current-user
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

### 7. Logout
Logout user (optional - mainly for frontend cleanup).

**Request:**
```
POST /api/auth/logout
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

## Books API

### 1. Get All Books
Retrieve all books with filtering, sorting, and pagination.

**Request:**
```
GET /api/books?search=Harry&category=Fiction&minPrice=100&maxPrice=500&sort=price&page=1&limit=12
```

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| search | string | "" | Search by title or author |
| category | string | "" | Filter by category ID |
| minPrice | number | 0 | Minimum price filter |
| maxPrice | number | None | Maximum price filter |
| sort | string | "-createdAt" | Sort by: price, rating, popularity, newest |
| page | number | 1 | Page number for pagination |
| limit | number | 12 | Items per page |

**Response (200):**
```json
{
  "success": true,
  "books": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Harry Potter",
      "author": "J.K. Rowling",
      "price": 299,
      "discountPrice": 249,
      "rating": 4.5,
      "totalReviews": 150,
      "stock": 25,
      "image": "http://...",
      "category": {
        "_id": "507f1f77bcf86cd799439012",
        "name": "Fiction"
      },
      "isFeatured": true,
      "isBestSeller": true
    }
  ],
  "pagination": {
    "page": 1,
    "pages": 5,
    "total": 48,
    "limit": 12
  }
}
```

### 2. Get Single Book
Get detailed information about a book with reviews.

**Request:**
```
GET /api/books/507f1f77bcf86cd799439011
```

**Response (200):**
```json
{
  "success": true,
  "book": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Harry Potter",
    "author": "J.K. Rowling",
    "description": "A young wizard's journey...",
    "price": 299,
    "discountPrice": 249,
    "rating": 4.5,
    "totalReviews": 150,
    "stock": 25,
    "isbn": "978-0-7432-7356-5",
    "image": "http://...",
    "category": {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Fiction"
    },
    "reviews": [
      {
        "_id": "507f1f77bcf86cd799439013",
        "user": { "name": "John Doe" },
        "rating": 5,
        "comment": "Amazing book!",
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ]
  }
}
```

### 3. Get Featured Books
Retrieve books marked as featured.

**Request:**
```
GET /api/books/featured
```

**Response (200):**
```json
{
  "success": true,
  "books": [
    { /* book object */ }
  ]
}
```

### 4. Get New Arrivals
Get recently added books.

**Request:**
```
GET /api/books/new-arrivals
```

**Response (200):**
```json
{
  "success": true,
  "books": [
    { /* book object */ }
  ]
}
```

### 5. Get Best Sellers
Get best-selling books.

**Request:**
```
GET /api/books/best-sellers
```

**Response (200):**
```json
{
  "success": true,
  "books": [
    { /* book object */ }
  ]
}
```

### 6. Get Categories
Get all book categories.

**Request:**
```
GET /api/books/categories
```

**Response (200):**
```json
{
  "success": true,
  "categories": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Fiction",
      "description": "Fiction books",
      "icon": "📕"
    }
  ]
}
```

### 7. Add Review to Book
Submit a review for a book (requires authentication).

**Request:**
```
POST /api/books/507f1f77bcf86cd799439011/reviews
Authorization: Bearer <token>
Content-Type: application/json

{
  "rating": 5,
  "comment": "Amazing book, highly recommended!"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Review added successfully",
  "book": {
    "_id": "507f1f77bcf86cd799439011",
    "rating": 4.6,
    "totalReviews": 151
  }
}
```

---

## Cart API

All cart endpoints require authentication.

### 1. Get Cart
Retrieve user's shopping cart.

**Request:**
```
GET /api/cart
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "cart": {
    "_id": "507f1f77bcf86cd799439020",
    "user": "507f1f77bcf86cd799439011",
    "items": [
      {
        "_id": "507f1f77bcf86cd799439021",
        "book": {
          "_id": "507f1f77bcf86cd799439011",
          "title": "Harry Potter",
          "price": 299
        },
        "quantity": 2,
        "price": 249
      }
    ],
    "totalPrice": 498,
    "totalItems": 2
  }
}
```

### 2. Add to Cart
Add an item to cart or update quantity if already present.

**Request:**
```
POST /api/cart/add
Authorization: Bearer <token>
Content-Type: application/json

{
  "bookId": "507f1f77bcf86cd799439011",
  "quantity": 2
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Added to cart",
  "cart": { /* cart object */ }
}
```

### 3. Update Cart Item
Update quantity of cart item.

**Request:**
```
PUT /api/cart/update
Authorization: Bearer <token>
Content-Type: application/json

{
  "itemId": "507f1f77bcf86cd799439021",
  "quantity": 3
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Cart updated",
  "cart": { /* cart object */ }
}
```

### 4. Remove from Cart
Remove an item from cart.

**Request:**
```
DELETE /api/cart/507f1f77bcf86cd799439011
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Item removed from cart",
  "cart": { /* cart object */ }
}
```

### 5. Clear Cart
Remove all items from cart.

**Request:**
```
DELETE /api/cart
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Cart cleared"
}
```

---

## Wishlist API

All wishlist endpoints require authentication.

### 1. Get Wishlist
Retrieve user's wishlist.

**Request:**
```
GET /api/wishlist
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "wishlist": {
    "_id": "507f1f77bcf86cd799439030",
    "user": "507f1f77bcf86cd799439011",
    "books": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "title": "Harry Potter",
        "price": 249,
        "rating": 4.5
      }
    ]
  }
}
```

### 2. Add to Wishlist
Add a book to wishlist.

**Request:**
```
POST /api/wishlist/add
Authorization: Bearer <token>
Content-Type: application/json

{
  "bookId": "507f1f77bcf86cd799439011"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Added to wishlist"
}
```

### 3. Remove from Wishlist
Remove a book from wishlist.

**Request:**
```
DELETE /api/wishlist/507f1f77bcf86cd799439011
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Removed from wishlist"
}
```

### 4. Check if in Wishlist
Check if a book is in user's wishlist.

**Request:**
```
GET /api/wishlist/check/507f1f77bcf86cd799439011
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "inWishlist": true
}
```

---

## Orders API

All order endpoints require authentication.

### 1. Create Order
Create a new order from cart.

**Request:**
```
POST /api/orders/create
Authorization: Bearer <token>
Content-Type: application/json

{
  "addressId": "507f1f77bcf86cd799439040",
  "paymentMethod": "credit_card",
  "couponCode": "SAVE10" // optional
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Order created",
  "order": {
    "_id": "507f1f77bcf86cd799439041",
    "orderNumber": "ORD-2024-001",
    "user": "507f1f77bcf86cd799439011",
    "items": [
      {
        "book": { "title": "Harry Potter" },
        "quantity": 2,
        "price": 249
      }
    ],
    "totalPrice": 498,
    "status": "pending",
    "paymentStatus": "pending",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

### 2. Get User Orders
Retrieve all orders for user (paginated).

**Request:**
```
GET /api/orders/my-orders?page=1&limit=10
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "orders": [
    {
      "_id": "507f1f77bcf86cd799439041",
      "orderNumber": "ORD-2024-001",
      "totalPrice": 498,
      "status": "shipped",
      "paymentStatus": "paid",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "pages": 3,
    "total": 25
  }
}
```

### 3. Get Order Details
Get full details of a specific order.

**Request:**
```
GET /api/orders/507f1f77bcf86cd799439041
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "order": {
    "_id": "507f1f77bcf86cd799439041",
    "orderNumber": "ORD-2024-001",
    "user": { "name": "John Doe", "email": "john@example.com" },
    "items": [
      {
        "book": { "title": "Harry Potter", "author": "J.K. Rowling" },
        "quantity": 2,
        "price": 249
      }
    ],
    "shippingAddress": {
      "fullName": "John Doe",
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001",
      "country": "USA"
    },
    "totalPrice": 498,
    "shippingCost": 50,
    "taxAmount": 45,
    "status": "shipped",
    "paymentStatus": "paid",
    "trackingNumber": "TRACK123456",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

### 4. Cancel Order
Cancel an order (only if not shipped).

**Request:**
```
PUT /api/orders/507f1f77bcf86cd799439041/cancel
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Order cancelled successfully",
  "refundAmount": 498
}
```

### 5. Create Payment Intent
Create Stripe payment intent for order.

**Request:**
```
POST /api/orders/payment-intent
Authorization: Bearer <token>
Content-Type: application/json

{
  "orderId": "507f1f77bcf86cd799439041"
}
```

**Response (200):**
```json
{
  "success": true,
  "clientSecret": "pi_1234567890_secret_1234567890"
}
```

### 6. Confirm Payment
Confirm payment after successful Stripe transaction.

**Request:**
```
POST /api/orders/confirm-payment
Authorization: Bearer <token>
Content-Type: application/json

{
  "orderId": "507f1f77bcf86cd799439041",
  "paymentIntentId": "pi_1234567890"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Payment confirmed",
  "order": { /* order object */ }
}
```

---

## User API

All user endpoints require authentication.

### 1. Get User Profile
Get current user's profile information.

**Request:**
```
GET /api/user/profile
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

### 2. Update User Profile
Update user profile information.

**Request:**
```
PUT /api/user/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane@example.com"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Profile updated",
  "user": { /* updated user object */ }
}
```

### 3. Change Password
Change user password.

**Request:**
```
POST /api/user/change-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "OldPassword123",
  "newPassword": "NewPassword123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

### 4. Get User Addresses
Get all saved addresses.

**Request:**
```
GET /api/user/addresses
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "addresses": [
    {
      "_id": "507f1f77bcf86cd799439040",
      "fullName": "John Doe",
      "phoneNumber": "9876543210",
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001",
      "country": "USA",
      "isDefault": true,
      "addressType": "home"
    }
  ]
}
```

### 5. Add Address
Add a new address.

**Request:**
```
POST /api/user/addresses
Authorization: Bearer <token>
Content-Type: application/json

{
  "fullName": "John Doe",
  "phoneNumber": "9876543210",
  "street": "123 Main St",
  "city": "New York",
  "state": "NY",
  "zipCode": "10001",
  "country": "USA",
  "addressType": "home",
  "isDefault": false
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Address added",
  "address": { /* address object */ }
}
```

### 6. Update Address
Update an existing address.

**Request:**
```
PUT /api/user/addresses/507f1f77bcf86cd799439040
Authorization: Bearer <token>
Content-Type: application/json

{
  "fullName": "Jane Doe",
  "phoneNumber": "9876543211"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Address updated",
  "address": { /* updated address object */ }
}
```

### 7. Delete Address
Delete an address.

**Request:**
```
DELETE /api/user/addresses/507f1f77bcf86cd799439040
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Address deleted"
}
```

### 8. Get Order History
Get user's order history (paginated).

**Request:**
```
GET /api/user/orders/history?page=1&limit=5
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "orders": [
    {
      "_id": "507f1f77bcf86cd799439041",
      "orderNumber": "ORD-2024-001",
      "totalPrice": 498,
      "status": "delivered",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

---

## Admin API

All admin endpoints require authentication with admin role.

### 1. Get Dashboard Statistics
Get admin dashboard stats.

**Request:**
```
GET /api/admin/dashboard
Authorization: Bearer <admin_token>
```

**Response (200):**
```json
{
  "success": true,
  "dashboard": {
    "totalUsers": 150,
    "totalBooks": 250,
    "totalOrders": 500,
    "totalRevenue": 125000,
    "recentOrders": [
      {
        "_id": "507f1f77bcf86cd799439041",
        "orderNumber": "ORD-2024-500",
        "user": { "name": "John Doe" },
        "totalPrice": 498,
        "status": "pending"
      }
    ]
  }
}
```

### 2. Add Book
Create a new book.

**Request:**
```
POST /api/admin/books
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "title": "New Book",
  "author": "Author Name",
  "description": "Book description...",
  "price": 299,
  "discountPrice": 249,
  "categoryId": "507f1f77bcf86cd799439012",
  "stock": 50,
  "isbn": "978-0-7432-7356-5",
  "image": "http://..."
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Book added",
  "book": { /* book object */ }
}
```

### 3. Update Book
Update book details.

**Request:**
```
PUT /api/admin/books/507f1f77bcf86cd799439011
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "title": "Updated Title",
  "price": 399
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Book updated",
  "book": { /* updated book object */ }
}
```

### 4. Delete Book
Delete a book.

**Request:**
```
DELETE /api/admin/books/507f1f77bcf86cd799439011
Authorization: Bearer <admin_token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Book deleted"
}
```

### 5. Add Category
Create a new category.

**Request:**
```
POST /api/admin/categories
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Science Fiction",
  "description": "Science fiction books",
  "icon": "🚀"
}
```

**Response (201):**
```json
{
  "success": true,
  "category": { /* category object */ }
}
```

### 6. Update Category
Update category details.

**Request:**
```
PUT /api/admin/categories/507f1f77bcf86cd799439012
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Sci-Fi"
}
```

**Response (200):**
```json
{
  "success": true,
  "category": { /* updated category object */ }
}
```

### 7. Delete Category
Delete a category.

**Request:**
```
DELETE /api/admin/categories/507f1f77bcf86cd799439012
Authorization: Bearer <admin_token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Category deleted"
}
```

### 8. Get All Users
List all users (paginated).

**Request:**
```
GET /api/admin/users?page=1&limit=20
Authorization: Bearer <admin_token>
```

**Response (200):**
```json
{
  "success": true,
  "users": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "customer",
      "isBlocked": false
    }
  ],
  "pagination": { /* pagination object */ }
}
```

### 9. Block User
Block a user from making purchases.

**Request:**
```
PUT /api/admin/users/507f1f77bcf86cd799439011/block
Authorization: Bearer <admin_token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "User blocked"
}
```

### 10. Unblock User
Unblock a previously blocked user.

**Request:**
```
PUT /api/admin/users/507f1f77bcf86cd799439011/unblock
Authorization: Bearer <admin_token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "User unblocked"
}
```

### 11. Get All Orders
List all orders (paginated).

**Request:**
```
GET /api/admin/orders?page=1&limit=20
Authorization: Bearer <admin_token>
```

**Response (200):**
```json
{
  "success": true,
  "orders": [
    {
      "_id": "507f1f77bcf86cd799439041",
      "orderNumber": "ORD-2024-001",
      "user": { "name": "John Doe" },
      "totalPrice": 498,
      "status": "pending"
    }
  ]
}
```

### 12. Update Order Status
Update order status.

**Request:**
```
PUT /api/admin/orders/507f1f77bcf86cd799439041/status
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "status": "shipped",
  "trackingNumber": "TRACK123456"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Order status updated",
  "order": { /* updated order object */ }
}
```

### 13. Get All Reviews
List all reviews (paginated).

**Request:**
```
GET /api/admin/reviews?page=1&limit=20
Authorization: Bearer <admin_token>
```

**Response (200):**
```json
{
  "success": true,
  "reviews": [
    {
      "_id": "507f1f77bcf86cd799439031",
      "book": { "title": "Harry Potter" },
      "user": { "name": "John Doe" },
      "rating": 5,
      "comment": "Amazing!",
      "isApproved": true
    }
  ]
}
```

### 14. Delete Review
Delete a review.

**Request:**
```
DELETE /api/admin/reviews/507f1f77bcf86cd799439031
Authorization: Bearer <admin_token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Review deleted"
}
```

---

## Error Handling

### Standard Error Response
```json
{
  "success": false,
  "message": "Error message",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

### HTTP Status Codes
| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request / Validation Error |
| 401 | Unauthorized / Invalid Token |
| 403 | Forbidden / Insufficient Permissions |
| 404 | Not Found |
| 409 | Conflict / Already Exists |
| 500 | Internal Server Error |

### Common Error Messages
- `Invalid credentials` - Wrong email/password
- `Token expired` - JWT token has expired
- `Unauthorized access` - Missing or invalid token
- `Insufficient permissions` - User doesn't have required role
- `Email already exists` - Email already registered
- `Resource not found` - Item doesn't exist
- `Out of stock` - Book not available
- `Invalid input` - Validation error

---

## Rate Limiting

Endpoints are rate-limited to prevent abuse:
- 100 requests per minute per IP address
- 30 requests per minute for login/signup endpoints

Response includes rate limit headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642252800
```

---

## Pagination

List endpoints support pagination:

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 100)

**Response:**
```json
{
  "success": true,
  "data": [ /* items */ ],
  "pagination": {
    "page": 1,
    "pages": 5,
    "total": 48,
    "limit": 10
  }
}
```

---

## Sorting

Available sort options vary by endpoint. Common options:
- `-createdAt` - Newest first (default)
- `createdAt` - Oldest first
- `price` - Price ascending
- `-price` - Price descending
- `rating` - Rating ascending
- `-rating` - Rating descending
- `popularity` - Most popular

Example: `?sort=-rating,price`

---

## Data Types

### ObjectId
MongoDB unique identifier:
```
"_id": "507f1f77bcf86cd799439011"
```

### DateTime
ISO 8601 format:
```
"createdAt": "2024-01-15T10:30:00.000Z"
```

### Enum Values
Specific allowed values:

**Role:**
- `customer`
- `admin`

**Order Status:**
- `pending`
- `confirmed`
- `processing`
- `shipped`
- `delivered`
- `cancelled`

**Payment Status:**
- `pending`
- `paid`
- `failed`
- `refunded`

**Address Type:**
- `home`
- `office`
- `other`

---

## Testing with cURL

### Example: Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"Password123"}'
```

### Example: Get Books
```bash
curl -X GET "http://localhost:5000/api/books?search=Harry&category=Fiction" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Support

For API issues and questions, please:
1. Check this documentation first
2. Review error message details
3. Check browser DevTools Network tab
4. Create issue on GitHub repository

---

**Last Updated**: 2024
**API Version**: 1.0
**Status**: Stable ✅
