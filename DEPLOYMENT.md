# Deployment Guide - BookMart

This guide covers deployment of the BookMart application to production environments.

## Table of Contents
1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Backend Deployment](#backend-deployment)
3. [Frontend Deployment](#frontend-deployment)
4. [Database Setup](#database-setup)
5. [Environment Variables](#environment-variables)
6. [Post-Deployment Testing](#post-deployment-testing)
7. [Troubleshooting](#troubleshooting)

---

## Pre-Deployment Checklist

Before deploying, ensure:

- [ ] All code is committed to Git
- [ ] No sensitive information in code (use .env files)
- [ ] All dependencies are listed in package.json
- [ ] Application runs successfully locally
- [ ] Database is backed up
- [ ] API endpoints are tested
- [ ] Frontend build succeeds without errors
- [ ] Environment variables are documented
- [ ] Stripe keys are obtained (test keys for staging)
- [ ] Email service is configured
- [ ] MongoDB Atlas cluster is created

---

## Backend Deployment

### Option 1: Heroku

#### Setup
1. **Create Heroku Account**
   - Sign up at [heroku.com](https://www.heroku.com)
   - Install Heroku CLI

2. **Prepare Repository**
   ```bash
   cd Backend
   git init
   git add .
   git commit -m "Initial commit"
   ```

3. **Create Heroku App**
   ```bash
   heroku login
   heroku create your-app-name
   ```

4. **Set Environment Variables**
   ```bash
   heroku config:set MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/bookmart
   heroku config:set JWT_SECRET=your_secret_key
   heroku config:set JWT_REFRESH_SECRET=your_refresh_secret
   heroku config:set STRIPE_SECRET_KEY=sk_live_your_key
   heroku config:set STRIPE_PUBLISHABLE_KEY=pk_live_your_key
   heroku config:set SMTP_USER=your_email@gmail.com
   heroku config:set SMTP_PASS=your_app_password
   heroku config:set FRONTEND_URL=https://your-frontend-domain.com
   heroku config:set NODE_ENV=production
   ```

5. **Deploy**
   ```bash
   git push heroku main
   ```

#### Procfile (create in Backend root)
```
web: node server.js
```

---

### Option 2: Railway.app

#### Setup
1. **Create Railway Account**
   - Sign up at [railway.app](https://railway.app)

2. **Connect GitHub Repository**
   - Sign in with GitHub
   - Select BookMart repository
   - Authorize Railway

3. **Configure Service**
   - Select Node environment
   - Set start command: `node server.js`

4. **Add MongoDB Plugin**
   - Add MongoDB from Railway marketplace
   - Copy connection string to MONGO_URI

5. **Set Environment Variables**
   In Railway dashboard, add:
   ```
   PORT=5000
   NODE_ENV=production
   MONGO_URI=<railway-mongodb-uri>
   JWT_SECRET=your_secret_key
   JWT_REFRESH_SECRET=your_refresh_secret
   STRIPE_SECRET_KEY=sk_live_your_key
   STRIPE_PUBLISHABLE_KEY=pk_live_your_key
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=your_app_password
   FRONTEND_URL=https://your-frontend-domain.com
   ```

6. **Deploy**
   - Railway auto-deploys on Git push

---

### Option 3: Render.com

#### Setup
1. **Create Render Account**
   - Sign up at [render.com](https://render.com)

2. **Create New Web Service**
   - Connect GitHub repository
   - Select Backend directory as root

3. **Configure Service**
   - Environment: Node
   - Build command: `npm install`
   - Start command: `node server.js`

4. **Set Environment Variables**
   ```
   PORT=5000
   NODE_ENV=production
   MONGO_URI=<mongodb-uri>
   JWT_SECRET=your_secret_key
   JWT_REFRESH_SECRET=your_refresh_secret
   STRIPE_SECRET_KEY=sk_live_your_key
   STRIPE_PUBLISHABLE_KEY=pk_live_your_key
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=your_app_password
   FRONTEND_URL=https://your-frontend-domain.com
   ```

5. **Deploy**
   - Click Deploy to start

---

## Frontend Deployment

### Option 1: Vercel

#### Setup
1. **Create Vercel Account**
   - Sign up at [vercel.com](https://vercel.com) with GitHub

2. **Import Project**
   - Click "Add New Project"
   - Select BookMart repository
   - Select Frontend as source root

3. **Configure Build**
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`

4. **Add Environment Variables**
   ```
   VITE_API_URL=https://your-backend-api.com
   ```

5. **Deploy**
   - Click Deploy
   - Vercel will automatically deploy on Git push

#### Optimization
- Vercel automatically optimizes images
- Global CDN distribution included
- Automatic HTTPS enabled

---

### Option 2: Netlify

#### Setup
1. **Create Netlify Account**
   - Sign up at [netlify.com](https://netlify.com)

2. **Connect GitHub**
   - Authorize Netlify to access GitHub
   - Select BookMart repository

3. **Configure Deploy**
   - Base directory: `Frontend`
   - Build command: `npm run build`
   - Publish directory: `dist`

4. **Add Environment Variables**
   ```
   VITE_API_URL=https://your-backend-api.com
   ```

5. **Deploy**
   - Click Deploy Site
   - Auto-deploys on Git push

#### netlify.toml (create in Frontend)
```toml
[build]
  command = "npm run build"
  publish = "dist"

[dev]
  command = "npm run dev"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

### Option 3: GitHub Pages

#### Setup
1. Update `vite.config.js`:
```javascript
export default {
  base: '/BookMart/', // if deploying to subdirectory
  // ...
}
```

2. Update `package.json`:
```json
"scripts": {
  "build": "vite build",
  "deploy": "gh-pages -d dist"
}
```

3. Install gh-pages:
```bash
npm install --save-dev gh-pages
```

4. Deploy:
```bash
npm run build
npm run deploy
```

---

## Database Setup

### MongoDB Atlas (Cloud)

#### Create Cluster
1. Sign up at [mongodb.com/cloud](https://www.mongodb.com/cloud)

2. Create New Project
   - Name: BookMart
   - Organization: Your organization

3. Create Cluster
   - Provider: AWS / GCP / Azure
   - Region: Closest to you
   - Tier: M0 (free) for testing, M5+ for production
   - Click Create Cluster

4. Create Database User
   ```
   Username: bookmart_user
   Password: Strong random password
   ```

5. Configure Network Access
   - Click Network Access
   - Add IP Address
   - Option 1: Your current IP
   - Option 2: 0.0.0.0/0 (allow all - less secure)

6. Get Connection String
   - Click Connect
   - Select Connect your application
   - Copy connection string
   - Replace `<username>` and `<password>`

#### Example Connection String
```
mongodb+srv://bookmart_user:password@bookmart.mongodb.net/BookMart?retryWrites=true&w=majority
```

---

## Environment Variables

### Backend .env (Production)
```env
# Server
PORT=5000
NODE_ENV=production

# Database
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/BookMart?retryWrites=true&w=majority

# JWT
JWT_SECRET=generate_strong_random_string_min_32_chars
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=generate_strong_random_string_min_32_chars
JWT_REFRESH_EXPIRE=30d

# Stripe (Live Keys)
STRIPE_SECRET_KEY=sk_live_your_live_secret_key
STRIPE_PUBLISHABLE_KEY=pk_live_your_live_publishable_key

# Email Service
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_16_character_app_password

# Cloudinary (Optional)
CLOUDINARY_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret

# Frontend URL
FRONTEND_URL=https://your-frontend-domain.com
```

### Frontend .env.production
```env
VITE_API_URL=https://your-backend-api.com
```

---

## Security Best Practices

### 1. API Keys
- Use live keys only in production
- Rotate keys regularly
- Never commit .env files
- Use environment variables

### 2. HTTPS
- Ensure all traffic is encrypted
- All platforms above provide free HTTPS
- Configure HSTS headers

### 3. Database
- Enable authentication
- Restrict IP access to backend only
- Use strong passwords
- Enable backups

### 4. CORS
- Only allow frontend domain
- Don't use `*` in production
- Specify exact protocols and ports

### 5. JWT Secrets
- Use strong random strings (min 32 chars)
- Rotate periodically
- Store in environment variables only

---

## Post-Deployment Testing

### 1. Health Check
```bash
curl https://your-backend-api.com/health
```

### 2. Authentication
- Test signup with new email
- Test login
- Test token refresh
- Test logout

### 3. API Endpoints
- GET books list
- GET single book
- POST create order (authenticated)
- GET user profile (authenticated)

### 4. Frontend
- Load homepage
- Search and filter books
- Add to cart
- Complete checkout flow
- View order history

### 5. Admin Functions
- Create admin account
- Access admin dashboard
- Add new book
- Update book
- Create category
- Manage users

### 6. Stripe Integration
- Test payment with Stripe test card: `4242 4242 4242 4242`
- Verify payment processing
- Check payment status in Stripe dashboard

### 7. Email Service
- Request password reset
- Verify email received
- Check order confirmation email

---

## Monitoring & Logs

### Heroku
```bash
heroku logs -t  # Real-time logs
heroku logs -n 50  # Last 50 lines
```

### Railway
```bash
railway logs  # View logs in CLI
```

### Render
- View logs in dashboard
- Set up log drains for external services

### Vercel
- View build and runtime logs in dashboard
- Monitor performance metrics

### Netlify
- View build logs in deploy history
- Monitor function logs

---

## Troubleshooting

### Backend Issues

#### Application Won't Start
```bash
# Check logs
heroku logs -t

# Common issues:
# - Missing environment variables
# - MongoDB connection failed
# - Port already in use
```

#### MongoDB Connection Error
```
Error: connect ECONNREFUSED
```
Solution:
- Check MONGO_URI is correct
- Verify IP is whitelisted in MongoDB Atlas
- Check network connectivity

#### CORS Errors
```
Access to XMLHttpRequest blocked by CORS policy
```
Solution:
- Update FRONTEND_URL in .env
- Restart backend
- Clear browser cache

#### Stripe Errors
```
stripe: Error: Stripe API load failed
```
Solution:
- Verify STRIPE_SECRET_KEY is set
- Check Stripe account is active
- Use test keys for staging

---

### Frontend Issues

#### Build Fails
```bash
npm run build
# Check for TypeScript errors
# Check for missing imports
```

#### Blank Page After Deploy
- Check browser console for errors
- Verify VITE_API_URL is correct
- Clear cache and hard refresh (Ctrl+Shift+R)

#### API Calls Fail
- Check backend is running
- Verify API URL points to correct domain
- Check CORS configuration
- Review network tab in DevTools

#### Cart/Auth Data Lost
- Check localStorage is enabled
- Clear browser cache
- Check IndexedDB in DevTools

---

### Database Issues

#### High Memory Usage
- Check query performance
- Add database indexes
- Optimize MongoDB aggregations
- Upgrade cluster tier if needed

#### Backup Strategy
- Enable automated backups (MongoDB Atlas)
- Export data regularly
- Test restore procedures

---

## Scaling Recommendations

### When to Scale

**Backend:**
- Response time exceeds 500ms
- Error rate > 1%
- CPU usage constantly > 70%
- Memory usage constantly > 80%

**Database:**
- Query time > 100ms
- Connection pool exhausted
- Storage > 80% capacity

**Frontend:**
- Building and deploying takes > 5 minutes
- Page load time > 3 seconds

### Scaling Steps

1. **Vertical Scaling**: Upgrade instance size
2. **Horizontal Scaling**: Add load balancer and multiple instances
3. **Caching**: Implement Redis for session storage
4. **CDN**: Use CDN for static assets
5. **Database**: Optimize queries, add indexes, consider sharding

---

## Cost Optimization

### Free Tier Options
- Heroku: Limited free tier (no longer available)
- Railway: $5 credit + pay-as-you-go
- Render: Free tier with limitations
- Vercel: Free for static sites
- Netlify: Free tier available
- MongoDB Atlas: M0 cluster free tier

### Production Costs (Estimated Annual)
- Backend hosting: $100-500
- Database cluster: $50-200
- Frontend CDN: $10-50
- Email service: $0-50 (included)
- Stripe: 2.9% + $0.30 per transaction
- **Total: $160-800 per year** (depending on traffic)

---

## Maintenance Schedule

### Daily
- Monitor application logs
- Check error rates

### Weekly
- Review analytics
- Check performance metrics
- Update dependencies (if needed)

### Monthly
- Review and optimize slow queries
- Test backup/restore procedures
- Security audit

### Quarterly
- Update dependencies
- Review and rotate secrets
- Audit API usage
- Plan scaling if needed

---

## Support & Troubleshooting Resources

- **Express.js**: https://expressjs.com/
- **MongoDB**: https://docs.mongodb.com/
- **Stripe**: https://stripe.com/docs
- **Vercel**: https://vercel.com/docs
- **Heroku**: https://devcenter.heroku.com/

---

## Deployment Checklist (Final)

Before going live:

- [ ] All tests pass locally
- [ ] Environment variables configured
- [ ] HTTPS enabled
- [ ] CORS properly configured
- [ ] Database backup created
- [ ] Email service working
- [ ] Stripe live keys set up
- [ ] Admin account created
- [ ] Sample data loaded
- [ ] All endpoints tested
- [ ] Frontend loads correctly
- [ ] Cart and checkout working
- [ ] Payment processing works
- [ ] Admin panel functional
- [ ] Monitoring set up
- [ ] Error logging configured
- [ ] Performance optimized
- [ ] Security headers added

---

**Last Updated**: 2024
**Status**: Ready for Production ✅
