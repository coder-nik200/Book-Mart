# Troubleshooting Guide - BookMart

Common issues and their solutions.

## Table of Contents
- [Installation Issues](#installation-issues)
- [Backend Issues](#backend-issues)
- [Frontend Issues](#frontend-issues)
- [Database Issues](#database-issues)
- [Authentication Issues](#authentication-issues)
- [API/Network Issues](#apinetwork-issues)
- [Payment Issues](#payment-issues)
- [Email Issues](#email-issues)
- [Performance Issues](#performance-issues)

---

## Installation Issues

### 1. Node.js/npm Installation
**Problem:** `node: command not found` or `npm: command not found`

**Solution:**
- Download and install Node.js from [nodejs.org](https://nodejs.org)
- Verify installation:
```bash
node --version
npm --version
```

---

### 2. npm install Fails
**Problem:** `npm ERR! 404 Not Found - GET https://registry.npmjs.org/...`

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

---

### 3. Permission Denied
**Problem:** `EACCES: permission denied`

**Solution (macOS/Linux):**
```bash
# Reinstall npm without sudo
npm config set prefix ~/.npm-global
export PATH=~/.npm-global/bin:$PATH
```

**Solution (Windows):**
- Run Command Prompt as Administrator
- Reinstall or clear cache

---

### 4. Git Clone Failed
**Problem:** `fatal: unable to access 'https://...': Could not resolve host`

**Solution:**
- Check internet connection
- Check GitHub is accessible
- Try SSH instead of HTTPS:
```bash
git clone git@github.com:username/BookMart.git
```

---

## Backend Issues

### 1. Server Won't Start
**Problem:** `Error: listen EADDRINUSE :::5000`

**Solution:**
Port 5000 is already in use.

**Windows:**
```bash
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

**macOS/Linux:**
```bash
lsof -i :5000
kill -9 <PID>
```

Or change PORT in `.env`:
```env
PORT=5001
```

---

### 2. Cannot Find Module
**Problem:** `Error: Cannot find module 'express'`

**Solution:**
```bash
cd Backend
npm install
# Check package.json has all dependencies
npm list
```

---

### 3. .env File Not Found
**Problem:** `TypeError: Cannot read property 'MONGO_URI' of undefined`

**Solution:**
```bash
cd Backend
# Create .env file
cp .env.example .env  # if example exists
# or
echo "PORT=5000" > .env

# Add all required variables:
PORT=5000
MONGO_URI=mongodb://localhost:27017/BookMart
JWT_SECRET=your_secret_key
# ... add other variables
```

---

### 4. Syntax Error in Code
**Problem:** `SyntaxError: Unexpected token`

**Solution:**
- Check file encoding (should be UTF-8)
- Look at line number in error
- Check for missing semicolons, brackets, quotes
- Use code formatter:
```bash
npx prettier --write .
```

---

### 5. Server Starts but Doesn't Respond
**Problem:** Browser shows connection refused

**Solution:**
```bash
# Check if server is actually running
ps aux | grep node  # macOS/Linux
tasklist | findstr node.exe  # Windows

# Check logs for errors
# Look at terminal output

# Restart server:
npm start
```

---

## Frontend Issues

### 1. npm run dev Fails
**Problem:** `Error: ENOENT: no such file or directory, open 'vite.config.js'`

**Solution:**
```bash
# Make sure you're in Frontend directory
pwd  # Check current path
cd Frontend

# Reinstall dependencies
npm install

# Try again
npm run dev
```

---

### 2. Blank Page
**Problem:** Page loads but shows nothing

**Solution:**
1. Open browser DevTools (F12)
2. Check Console for errors
3. Check Network tab for failed requests
4. Hard refresh:
   - Windows: Ctrl+Shift+Delete
   - Mac: Cmd+Shift+Delete
5. Clear localhost data:
   - Open DevTools
   - Application tab
   - Clear Storage

---

### 3. API Calls Fail (404)
**Problem:** Network error when calling API

**Network tab shows 404:**
```json
{
  "message": "Cannot GET /api/books"
}
```

**Solution:**
- Check backend is running on correct port
- Verify `VITE_API_URL` in `.env.local`:
```env
VITE_API_URL=http://localhost:5000
```
- Check API endpoint path is correct
- Restart frontend server

---

### 4. Images Not Loading
**Problem:** Image placeholders appear instead of actual images

**Solution:**
```javascript
// Check image URLs in console
console.log(book.image);

// Ensure image path is correct
// Use full URLs, not relative paths

// Check CORS settings in backend
// Large images: use Cloudinary or CDN
```

---

### 5. Hot Module Replacement (HMR) Not Working
**Problem:** Changes don't reflect after save

**Solution:**
```bash
# Restart dev server
npm run dev

# Or check vite.config.js
// vite.config.js should have:
export default {
  server: {
    hmr: true
  }
}
```

---

### 6. Build Fails
**Problem:** `npm run build` shows errors

**Solution:**
```bash
# Check for TypeScript errors (if using TS)
# Run build with verbose output
npm run build -- --debug

# Fix errors shown in output
# Common issue: imported but unused variables
```

---

## Database Issues

### 1. MongoDB Connection Refused
**Problem:** `MongooseError: connect ECONNREFUSED 127.0.0.1:27017`

**Solution:**

**Local MongoDB:**
```bash
# Windows: Check Services
sc query MongoDB

# Start MongoDB:
mongod

# macOS:
brew services start mongodb-community

# Linux:
sudo systemctl start mongod
```

**MongoDB Atlas (Cloud):**
- Check connection string format
- Verify IP is whitelisted:
  - Go to Network Access
  - Check your IP is listed
  - Or add 0.0.0.0/0 (allows all)
- Check username/password in connection string
- Connection string format:
```
mongodb+srv://username:password@cluster.mongodb.net/dbname
```

---

### 2. Authentication Failed
**Problem:** `MongoAuthError: authentication failed`

**Solution:**
1. Check MONGO_URI format
2. Verify username and password
3. Ensure MongoDB Atlas user is created
4. Check IP whitelist includes your IP
5. Try connecting with mongosh:
```bash
mongosh "mongodb+srv://user:pass@cluster.mongodb.net/BookMart"
```

---

### 3. Database Command Not Found
**Problem:** `mongosh: command not found`

**Solution:**
```bash
# Install MongoDB shell
npm install -g mongosh
# or
# Download from https://www.mongodb.com/try/download/shell

# Verify
mongosh --version
```

---

### 4. Seed Script Fails
**Problem:** `npm run seed` doesn't work

**Solution:**
```bash
# Check database is running
mongosh

# Check seed file exists
ls src/scripts/seedBooks.js

# Run with verbose output
node src/scripts/seedBooks.js

# Debug seed file
# Add console.logs to see where it fails
```

---

### 5. Data Not Persisting
**Problem:** Data added but disappears after restart

**Solution:**
- Check database is properly configured
- Verify `MONGO_URI` is correct
- Check data actually saves to DB:
```bash
mongosh
use BookMart
db.books.find()  # Should show data
```

---

## Authentication Issues

### 1. Login Fails
**Problem:** "Invalid credentials" error

**Solution:**
```javascript
// Check user exists in database
db.users.findOne({ email: "test@example.com" })

// Verify password is correct
// Passwords are hashed - plain text won't match

// Try signup instead and then login
```

---

### 2. JWT Token Undefined
**Problem:** `Cannot read property 'split' of undefined` in token parsing

**Solution:**
```bash
# Check token is being sent
# Open DevTools → Network → Headers
# Authorization header should be present

# Check localStorage
localStorage.getItem('accessToken')

# If missing, login again
```

---

### 3. Token Expired Error
**Problem:** "Token expired" after some time

**Solution:**
This is normal behavior:
- Access token expires every 7 days
- App should automatically refresh
- Check axios interceptor in `apiClient.js`
- If refresh fails, user needs to login again

---

### 4. Protected Routes Redirect to Login
**Problem:** Can't access protected pages even after login

**Solution:**
1. Check token is in localStorage:
```javascript
localStorage.getItem('accessToken')
localStorage.getItem('user')
```

2. Check AuthContext is wrapping app:
```jsx
// App.jsx should have:
<AuthProvider>
  {/* routes */}
</AuthProvider>
```

3. Check protected route component:
   - ProtectedRoute should redirect if not authenticated
   - Check component name in route

---

### 5. Session Lost After Page Refresh
**Problem:** User gets logged out on page refresh

**Solution:**
```javascript
// Check localStorage persistence
localStorage.getItem('accessToken')  // Should exist

// Check AuthContext restores from localStorage
// useEffect in AuthContext should load from localStorage on mount
```

---

## API/Network Issues

### 1. CORS Error
**Problem:** 
```
Access to XMLHttpRequest at 'http://localhost:5000/...' 
from origin 'http://localhost:5173' has been blocked by CORS policy
```

**Solution:**

**Backend - Check CORS configuration in server.js:**
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
```

**Backend - Update .env:**
```env
FRONTEND_URL=http://localhost:5173
```

**Frontend - Check API client:**
```javascript
const apiClient = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: true
});
```

---

### 2. 404 Not Found
**Problem:** `GET /api/books 404`

**Solution:**
- Verify route exists in routes file
- Check route is registered in server.js
- Check URL spelling
- Use cURL to test:
```bash
curl http://localhost:5000/api/books
```

---

### 3. 500 Internal Server Error
**Problem:** API returns 500 error

**Solution:**
1. Check backend console for error message
2. Check database connection
3. Check required environment variables
4. Check request data format
5. Use try-catch to catch errors:
```bash
# Look at backend server logs
npm start
# Check stderr output
```

---

### 4. Request Timeout
**Problem:** API call hangs forever

**Solution:**
```javascript
// Add timeout in axios config
const apiClient = axios.create({
  timeout: 10000  // 10 seconds
});

// Or per request
apiClient.get('/books', { timeout: 5000 })
```

---

### 5. 400 Bad Request
**Problem:** API returns validation error

**Solution:**
```javascript
// Check request format
// Look at error details in response
error.response.data.errors  // Shows validation issues

// Fix data being sent
// Ensure all required fields present
// Check data types match
```

---

## Payment Issues

### 1. Stripe Key Not Working
**Problem:** "Invalid Stripe key" error

**Solution:**
- Use TEST keys (pk_test_..., sk_test_...)
- Don't use LIVE keys in development
- Check keys in `.env`:
```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
```

- Restart backend after changing keys
- Use Stripe test card: `4242 4242 4242 4242`

---

### 2. Payment Intent Creation Fails
**Problem:** Error creating payment intent

**Solution:**
```bash
# Check Stripe account is active
# Check API keys are valid
# Check amount is in cents (100 = $1.00)

# Test with cURL
curl https://api.stripe.com/v1/payment_intents \
  -u sk_test_...: \
  -d amount=2000 \
  -d currency=usd
```

---

### 3. Payment Confirmation Fails
**Problem:** Payment processed but order not created

**Solution:**
- Check order is created in database
- Check confirmation endpoint response
- Add error logging:
```javascript
console.log('Payment response:', response.data);
```

---

### 4. Test Card Declined
**Problem:** Stripe test card shows as declined

**Solution:**
- Use correct test card: `4242 4242 4242 4242`
- Use future expiry date
- Use any 3-digit CVC
- Check environment is set to test mode
- Different test cards for different scenarios:
  - Success: `4242 4242 4242 4242`
  - Decline: `4000 0000 0000 0002`
  - Auth required: `4000 0025 0000 3155`

---

## Email Issues

### 1. Emails Not Sending
**Problem:** Password reset/welcome emails don't arrive

**Solution:**

**Check SMTP Configuration in .env:**
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_16_char_app_password
```

**Enable 2FA on Gmail:**
1. Go to [myaccount.google.com](https://myaccount.google.com)
2. Enable 2-Step Verification
3. Generate app-specific password
4. Use that password in SMTP_PASS

---

### 2. 535 Authentication Failed
**Problem:** `535 5.7.8 Authentication failed` error

**Solution:**
- Wrong email or password
- Not using app-specific password
- Less Secure Apps not enabled
- Try enabling:
  - Less Secure Apps (deprecated by Google)
  - Or use App Password (recommended)

---

### 3. Email Template Issues
**Problem:** Email arrives but formatted incorrectly

**Solution:**
- Check HTML template syntax
- Test email rendering in email client
- Use inline CSS for better compatibility
- Avoid external stylesheets

---

## Performance Issues

### 1. Slow Page Load
**Problem:** Page takes >3 seconds to load

**Solution:**
```bash
# Check Network tab for slow requests
# Check bundle size
npm run build --report

# Optimize images
# Use CDN for assets
# Implement code splitting
```

---

### 2. Database Slow Queries
**Problem:** API responses slow (>1 second)

**Solution:**
```javascript
// Add indexes to frequently queried fields
bookSchema.index({ categoryId: 1 });
userSchema.index({ email: 1 });

// Use projection to get only needed fields
Book.find().select('title author price');

// Paginate large result sets
// Use caching for frequently accessed data
```

---

### 3. Memory Leak
**Problem:** App slows down over time

**Solution:**
```javascript
// Clean up event listeners
useEffect(() => {
  const handleClick = () => { };
  window.addEventListener('click', handleClick);
  
  return () => {
    window.removeEventListener('click', handleClick);
  };
}, []);

// Unsubscribe from observables
// Clear timers properly
```

---

### 4. Bundle Size Too Large
**Problem:** Frontend build is >500KB

**Solution:**
```bash
# Analyze bundle
npm run build -- --report

# Remove unused packages
npm prune

# Use dynamic imports
const Component = lazy(() => import('./Component'));
```

---

## General Debugging Tips

### 1. Use Console Logs
```javascript
console.log('Value:', value);
console.error('Error:', error);
console.table(data);  // For arrays/objects
```

### 2. Browser DevTools
- **Elements**: Check HTML structure
- **Console**: JavaScript errors
- **Network**: API requests/responses
- **Application**: localStorage, cookies
- **Performance**: Load time profiling

### 3. Network Inspection
```bash
# Test API with cURL
curl -X GET http://localhost:5000/api/books \
  -H "Authorization: Bearer token"

# Or use Thunder Client / Postman
```

### 4. Database Inspection
```bash
# Connect to MongoDB
mongosh
use BookMart
db.books.findOne()
```

### 5. Git Debugging
```bash
# See recent changes
git log --oneline -5

# See what changed
git diff HEAD~1

# Revert to previous version
git revert <commit-hash>
```

---

## Common Error Messages

| Error | Solution |
|-------|----------|
| `Cannot GET /api/books` | Route doesn't exist or not registered |
| `SyntaxError: Unexpected token` | Check quotes, brackets, semicolons |
| `ENOENT: no such file` | File doesn't exist or wrong path |
| `EADDRINUSE: address already in use` | Port taken, kill process or change port |
| `MongoAuthError` | Wrong username/password or IP not whitelisted |
| `Cannot read property 'email' of undefined` | Variable is undefined, check existence |
| `Unexpected token < in JSON` | HTML response instead of JSON, check endpoint |
| `401 Unauthorized` | Token missing or invalid, check auth header |
| `403 Forbidden` | User doesn't have permission, check role |

---

## Getting Help

If issue persists:
1. Check this guide completely
2. Search GitHub issues
3. Read documentation
4. Check error logs carefully
5. Try minimal reproduction
6. Create GitHub issue with:
   - Error message
   - Steps to reproduce
   - Environment details
   - Relevant code snippets

---

## Still Need Help?

- **Documentation**: Check README.md, SETUP.md, API.md
- **GitHub Issues**: Search or create issue
- **GitHub Discussions**: Ask community
- **Stack Overflow**: Tag #bookmart #mongodb #react

---

**Last Updated**: 2024
**Status**: Complete ✅
