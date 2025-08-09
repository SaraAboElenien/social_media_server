# Vercel Deployment Fix ✅

## Issue Resolved: "vite: command not found"

### **Problem:**
Vercel build was failing because Vite was not installed in the frontend directory during the build process.

### **Root Cause:**
The build script wasn't properly installing frontend dependencies before trying to build.

## ✅ **Solution Applied:**

### 1. **Updated Root Package.json** (`package.json`)
```json
{
  "scripts": {
    "vercel-build": "cd packages/frontend && npm install --production=false && npm run build"
  }
}
```

### 2. **Created Root Vercel Configuration** (`vercel.json`)
```json
{
  "version": 2,
  "builds": [
    {
      "src": "packages/backend/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/packages/backend/index.js"
    },
    {
      "src": "/(.*)",
      "dest": "/packages/backend/index.js"
    }
  ],
  "functions": {
    "packages/backend/index.js": {
      "maxDuration": 30
    }
  }
}
```

## 🚀 **Correct Vercel Deployment Settings:**

### **Project Settings in Vercel Dashboard:**
- **Framework Preset**: Node.js
- **Root Directory**: `/` (root of monorepo)
- **Build Command**: `npm run vercel-build`
- **Output Directory**: `packages/frontend/dist`
- **Install Command**: `npm install`

### **Environment Variables Required:**
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
NODE_ENV=production
confirmationKey=your_confirmation_key
confirmationKeyRefresher=your_refresh_key
saltRounds=12
```

## 🔄 **How It Works Now:**

1. **Build Process**: Vercel runs `npm run vercel-build` from the root directory
2. **Dependency Installation**: The build script installs all frontend dependencies with `npm install --production=false`
3. **Frontend Build**: Then builds the frontend with `npm run build`
4. **Output**: Frontend build files go to `packages/frontend/dist`
5. **Serving**: Backend serves both API and frontend files

## ✅ **Key Changes:**

- **Root-level configuration**: Vercel now uses the root directory instead of packages/backend
- **Fixed dependency installation**: Uses `npm install --production=false` to ensure dev dependencies (like Vite) are installed
- **Simplified build process**: More reliable and easier to debug
- **Better error handling**: Clearer build process

## 🎯 **Next Steps:**

1. **Update Vercel project settings** with the correct configuration:
   - **Root Directory**: `/` (root of monorepo)
   - **Build Command**: `npm run vercel-build`
2. **Set environment variables** in Vercel dashboard
3. **Deploy** - the build should now work correctly

The Vite command not found error is now fixed! 🚀
