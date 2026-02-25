# Development Setup Guide - BookMart

Complete guide for setting up the BookMart development environment and understanding the project structure.

## Table of Contents
1. [System Requirements](#system-requirements)
2. [Project Installation](#project-installation)
3. [Environment Configuration](#environment-configuration)
4. [Database Setup](#database-setup)
5. [Running the Application](#running-the-application)
6. [Project Architecture](#project-architecture)
7. [Development Workflow](#development-workflow)
8. [Common Tasks](#common-tasks)
9. [Debugging & Testing](#debugging--testing)

---

## System Requirements

### Minimum Requirements
- **Node.js**: v14 or higher (v18 LTS recommended)
- **npm**: v6 or higher (included with Node.js)
- **MongoDB**: v4.4 or higher
- **RAM**: 4GB minimum
- **Disk Space**: 2GB
- **OS**: Windows, macOS, or Linux

### Recommended Setup
- **Node.js**: v18+ LTS
- **npm**: v9+
- **MongoDB Atlas**: Cloud-hosted (recommended)
- **IDE**: VS Code with extensions
- **Terminal**: PowerShell (Windows), Bash (Mac/Linux)
- **Git**: v2.0+

### VS Code Extensions (Recommended)
```
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- Prettier - Code formatter
- ESLint
- MongoDB for VS Code
- Thunder Client (or Postman)
```

---

## Project Installation

### 1. Clone or Download Repository
```bash
# Clone from GitHub
git clone <repository-url>
cd Book-Mart

# Or extract ZIP file
# cd Book-Mart
```

### 2. Install Node.js & npm

#### Windows
1. Download from [nodejs.org](https://nodejs.org)
2. Run installer and follow prompts
3. Verify installation:
```bash
node --version
npm --version
```

#### macOS
```bash
# Using Homebrew
brew install node

# Or download from nodejs.org
```

#### Linux
```bash
# Ubuntu/Debian
sudo apt-get install nodejs npm

# Verify
node --version
npm --version
```

### 3. Install Project Dependencies

#### Backend
```bash
cd Backend
npm install
```

#### Frontend
```bash
cd Frontend
npm install
```

### 4. Verify Installation
```bash
# From Backend directory
npm list mongoose express

# From Frontend directory
npm list react react-router-dom axios
```

---

## Environment Configuration

### Backend Configuration

#### 1. Create `.env` File
```bash
cd Backend
touch .env  # macOS/Linux
# or
echo. > .env  # Windows
```

#### 2. Add Configuration
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://127.0.0.1:27017/BookMart

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters_long
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your_super_secret_refresh_key_minimum_32_chars
JWT_REFRESH_EXPIRE=30d

# Stripe Configuration (Get from https://dashboard.stripe.com)
STRIPE_SECRET_KEY=sk_test_your_test_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_test_key_here

# Email Configuration (Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_16_character_app_specific_password

# Cloudinary (Optional - for image uploads)
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

### Frontend Configuration

#### 1. Create `.env.local` File (Optional)
```bash
cd Frontend
touch .env.local  # macOS/Linux
# or
echo. > .env.local  # Windows
```

#### 2. Add Configuration
```env
VITE_API_URL=http://localhost:5000
```

### Getting Required APIs

#### Stripe Keys
1. Go to [stripe.com/register](https://stripe.com/register)
2. Create account
3. Go to [Dashboard](https://dashboard.stripe.com)
4. Switch to Test mode
5. Copy API keys
6. Add to `.env`

#### Gmail App Password (for Email)
1. Go to [myaccount.google.com](https://myaccount.google.com)
2. Enable 2-Factor Authentication
3. Go to App passwords
4. Select Mail and Windows Computer
5. Generate password
6. Use as `SMTP_PASS`

#### MongoDB Connection
1. **Local**: MongoDB should be running
   ```bash
   # Windows
   mongod
   
   # macOS (if installed via Homebrew)
   brew services start mongodb-community
   ```

2. **MongoDB Atlas** (Cloud):
   - Create account at [mongodb.com/cloud](https://www.mongodb.com/cloud)
   - Create cluster
   - Get connection string
   - Add to `MONGO_URI`

---

## Database Setup

### Option 1: Local MongoDB

#### Windows
1. Download from [mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
2. Run installer with default settings
3. Start MongoDB:
```bash
mongod
```

#### macOS
```bash
# Install via Homebrew
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community

# Check status
brew services list
```

#### Linux
```bash
# Ubuntu/Debian
sudo apt-get install mongodb-org

# Start service
sudo systemctl start mongod

# Check status
sudo systemctl status mongod
```

### Option 2: MongoDB Atlas (Recommended)

1. Sign up at [mongodb.com/cloud](https://www.mongodb.com/cloud)
2. Create organization and project
3. Build cluster:
   - Cloud Provider: AWS/GCP/Azure
   - Region: Closest to you
   - Tier: M0 (free)
   - Click Create
4. Create database user:
   - Username: bookmart_user
   - Password: [strong password]
5. Add IP address:
   - Security > Network Access > Add IP Address
   - Add Current IP or 0.0.0.0/0
6. Get connection string:
   - Databases > Connect > Connect your application
   - Copy string: `mongodb+srv://user:pass@....`
7. Replace user and password in string
8. Add to `.env` as `MONGO_URI`

### Seed Database

Load sample data:
```bash
cd Backend
npm run seed
```

This creates:
- 6 Categories (Fiction, Science, History, Self-Help, Fantasy, Mystery)
- 7 Sample Books with realistic data
- Proper relationships between collections

---

## Running the Application

### Development Mode

#### Terminal 1: Start Backend
```bash
cd Backend
npm start
```

Output should show:
```
DB connected successfully!
Server running on port 5000
```

#### Terminal 2: Start Frontend
```bash
cd Frontend
npm run dev
```

Output should show:
```
VITE v4.x.x ready in xxx ms

➜  Local:   http://localhost:5173/
```

#### Access Application
- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend API: [http://localhost:5000](http://localhost:5000)

### Build for Production

#### Backend (No build needed)
```bash
cd Backend
NODE_ENV=production npm start
```

#### Frontend
```bash
cd Frontend
npm run build
```

Creates optimized `dist/` folder for deployment.

---

## Project Architecture

### Backend Structure
```
Backend/
├── src/
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── models/                    # Mongoose schemas
│   │   ├── User.js
│   │   ├── Book.js
│   │   ├── Category.js
│   │   ├── Order.js
│   │   ├── Cart.js
│   │   ├── Wishlist.js
│   │   ├── Review.js
│   │   ├── Address.js
│   │   └── Coupon.js
│   ├── controllers/               # Business logic
│   │   ├── authController.js
│   │   ├── bookController.js
│   │   ├── cartController.js
│   │   ├── orderController.js
│   │   ├── userController.js
│   │   ├── wishlistController.js
│   │   └── adminController.js
│   ├── routes/                    # API routes
│   │   ├── authRoutes.js
│   │   ├── bookRoutes.js
│   │   ├── cartRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── userRoutes.js
│   │   ├── wishlistRoutes.js
│   │   └── adminRoutes.js
│   ├── middleware/                # Express middleware
│   │   ├── auth.middleware.js
│   │   └── role.middleware.js
│   ├── utils/                     # Helper functions
│   │   ├── generateToken.js
│   │   ├── emailService.js
│   │   ├── validation.js
│   │   ├── errorHandler.js
│   │   └── helpers.js
│   └── scripts/
│       ├── createAdmin.js
│       └── seedBooks.js
├── server.js                      # Main Express app
├── .env                           # Environment variables
├── .gitignore
└── package.json
```

### Frontend Structure
```
Frontend/
├── src/
│   ├── api/
│   │   └── apiClient.js           # Axios configuration
│   ├── context/                   # React Context
│   │   ├── AuthContext.jsx
│   │   └── CartContext.jsx
│   ├── components/                # Reusable components
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── BookCard.jsx
│   │   ├── Alert.jsx
│   │   ├── Loading.jsx
│   │   └── ProtectedRoute.jsx
│   ├── pages/                     # Page components
│   │   ├── HomePage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── SignupPage.jsx
│   │   ├── BooksPage.jsx
│   │   ├── CartPage.jsx
│   │   └── CheckoutPage.jsx
│   ├── App.jsx                    # Main routing
│   ├── App.css                    # Global styles
│   ├── index.css
│   └── main.jsx                   # Entry point
├── index.html
├── vite.config.js
├── .env.local                     # Local env variables
├── tailwind.config.js
├── eslint.config.js
└── package.json
```

### Key Design Patterns

#### MVC Pattern (Backend)
- **Model**: Mongoose schemas define data structure
- **View**: JSON responses (REST API)
- **Controller**: Business logic and data processing

#### Component Architecture (Frontend)
- **Pages**: Full page components
- **Components**: Reusable UI components
- **Context**: Global state management
- **API Client**: Centralized API calls

#### Authentication Flow
```
Login → JWT Created → Token Stored → 
Protected Route Check → Token in Header → 
API Response ✓ or Token Refresh
```

---

## Development Workflow

### Creating a New Feature

#### 1. Create Backend Route
```javascript
// routes/featureRoutes.js
const router = require('express').Router();
const { createFeature, getFeatures } = require('../controllers/featureController');
const { protect } = require('../middleware/auth.middleware');

router.post('/create', protect, createFeature);
router.get('/', getFeatures);

module.exports = router;
```

#### 2. Create Controller
```javascript
// controllers/featureController.js
const Feature = require('../models/Feature');

exports.createFeature = async (req, res) => {
  try {
    const feature = await Feature.create(req.body);
    res.status(201).json({ success: true, feature });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.getFeatures = async (req, res) => {
  try {
    const features = await Feature.find();
    res.json({ success: true, features });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
```

#### 3. Register Route in server.js
```javascript
const featureRoutes = require('./routes/featureRoutes');
app.use('/api/features', featureRoutes);
```

#### 4. Create Frontend Component
```jsx
// components/FeatureDisplay.jsx
import { useEffect, useState } from 'react';
import { apiClient } from '../api/apiClient';

export default function FeatureDisplay() {
  const [features, setFeatures] = useState([]);

  useEffect(() => {
    const fetchFeatures = async () => {
      const response = await apiClient.get('/features');
      setFeatures(response.data.features);
    };
    fetchFeatures();
  }, []);

  return (
    <div>
      {features.map(f => <div key={f._id}>{f.name}</div>)}
    </div>
  );
}
```

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/feature-name

# Make changes
# Commit regularly
git add .
git commit -m "Add feature description"

# Push branch
git push origin feature/feature-name

# Create Pull Request on GitHub
# Get code review
# Merge to main
```

---

## Common Tasks

### Add a New API Endpoint
1. Create route in `/routes/`
2. Create controller method
3. Register route in `server.js`
4. Test with Thunder Client/Postman
5. Update frontend API client

### Modify Database Schema
1. Update model in `/models/`
2. Create migration script if needed
3. Update validators
4. Update controller logic
5. Run seed script to test

### Add New Frontend Page
1. Create component in `/pages/`
2. Add route in `App.jsx`
3. Create necessary API calls
4. Add navigation links
5. Test flow

### Fix a Bug
1. Reproduce bug locally
2. Check error logs
3. Add console logs or debugger
4. Make fix
5. Test fix
6. Commit with fix description

### Update Dependencies
```bash
# Check for updates
npm outdated

# Update specific package
npm update package-name

# Update all packages
npm update

# Test application
npm start
```

---

## Debugging & Testing

### Backend Debugging

#### Using Console Logs
```javascript
console.log('User:', user);
console.error('Error:', error);
```

#### Using Debugger
```javascript
// Add debugger statement
debugger;

// Run with inspector
node --inspect server.js

// Open chrome://inspect
```

### Frontend Debugging

#### React DevTools Browser Extension
1. Install from Chrome Web Store
2. Open DevTools
3. React tab to inspect components
4. Edit props/state in real-time

#### Console Logs
```javascript
console.log('State:', state);
console.error('Error:', error);
```

#### Network Tab
1. Open DevTools → Network
2. Make API call
3. Check request/response
4. Verify headers and status

### Testing with Thunder Client

#### Install
- VS Code Extension: "Thunder Client"

#### Test API Endpoint
1. Open Thunder Client
2. Create new request
3. Method: GET/POST/PUT/DELETE
4. URL: http://localhost:5000/api/...
5. Add headers if needed
6. Send request
7. Check response

#### Example Request
```
GET http://localhost:5000/api/books
Headers:
  Authorization: Bearer <your_jwt_token>
```

### Database Testing

#### Connect to MongoDB
```bash
# Local MongoDB
mongosh

# MongoDB Atlas
mongosh "mongodb+srv://user:pass@cluster.mongodb.net/BookMart"
```

#### Common Commands
```javascript
// Show databases
show dbs

// Use database
use BookMart

// Show collections
show collections

// Find documents
db.books.find()

// Count documents
db.books.countDocuments()

// Insert document
db.categories.insertOne({ name: "Test", description: "Test category" })

// Update document
db.books.updateOne({ _id: ObjectId("...") }, { $set: { title: "New Title" } })

// Delete document
db.books.deleteOne({ _id: ObjectId("...") })
```

### Running Tests

#### Create Test File
```bash
npm install --save-dev jest @testing-library/react
```

#### Example Test
```javascript
// src/__tests__/BookCard.test.jsx
import { render, screen } from '@testing-library/react';
import BookCard from '../components/BookCard';

test('renders book title', () => {
  const book = { _id: '1', title: 'Test Book', author: 'Author' };
  render(<BookCard book={book} />);
  expect(screen.getByText('Test Book')).toBeInTheDocument();
});
```

#### Run Tests
```bash
npm test
```

---

## Troubleshooting Development Issues

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :5000
kill -9 <PID>
```

### MongoDB Connection Refused
```bash
# Check if MongoDB is running
# Windows: Check Services
# macOS: brew services list
# Linux: sudo systemctl status mongod

# Start MongoDB
mongod  # Windows/macOS
sudo systemctl start mongod  # Linux
```

### Module Not Found Error
```bash
# Reinstall dependencies
rm -rf node_modules
npm install
```

### JWT Token Errors
```bash
# Clear localStorage
localStorage.clear()

# Re-login to get new token
```

### CORS Errors
```
Access-Control-Allow-Origin
```
Solution:
- Check FRONTEND_URL in `.env`
- Check CORS configuration in `server.js`
- Restart backend

### Whitespace/Formatting Issues
```bash
# Format code with Prettier
npx prettier --write .

# Or in VS Code
# Install Prettier extension
# Right-click > Format Document
```

---

## Performance Tips

### Backend
- Add indexes to frequently queried fields
- Use pagination for large datasets
- Cache frequently accessed data
- Use aggregation for complex queries
- Monitor query performance

### Frontend
- Use React.memo for expensive components
- implement code splitting with lazy loading
- Optimize images
- Use CDN for static assets
- Enable compression

---

## Security During Development

- Never commit `.env` files
- Never share API keys
- Use test/sandbox keys
- Validate all inputs
- Use HTTPS in production
- Keep dependencies updated
- Follow OWASP guidelines

---

## Useful Commands Reference

### Backend
```bash
npm start              # Start dev server
npm run seed          # Load sample data
npm test              # Run tests
npm install package   # Install package
```

### Frontend
```bash
npm run dev           # Start dev server
npm run build         # Build for production
npm run preview       # Preview production build
npm run lint          # Run ESLint
```

### Database
```bash
mongosh               # Connect to MongoDB
mongodump             # Backup database
mongorestore          # Restore database
```

### Git
```bash
git status            # Check status
git add .             # Stage changes
git commit -m "msg"   # Commit changes
git push origin branch # Push to GitHub
```

---

## Additional Resources

- [Node.js Documentation](https://nodejs.org/docs/)
- [Express.js Guide](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [React Documentation](https://react.dev/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [JWT Introduction](https://jwt.io/introduction)

---

**Last Updated**: 2024
**Status**: Complete ✅
