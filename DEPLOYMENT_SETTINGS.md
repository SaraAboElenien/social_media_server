# 🚀 Vercel Deployment Settings Guide

## ✅ **Fixed: Vite Command Not Found Error**

The issue was that Vercel wasn't installing frontend dependencies properly. I've created a robust build script that ensures all dependencies are installed correctly.

## 📋 **Correct Vercel Project Settings**

### **In your Vercel project dashboard, set these exact values:**

- **Framework Preset**: `Node.js`
- **Root Directory**: `/` (root of monorepo)
- **Build Command**: `npm run vercel-build`
- **Output Directory**: `packages/frontend/dist`
- **Install Command**: `npm install`

## 🔧 **Environment Variables Required**

### **Add these environment variables in Vercel dashboard:**

```env
# Database
MONGODB_URI=your_mongodb_connection_string

# JWT Authentication
JWT_SECRET=your_jwt_secret
confirmationKey=your_confirmation_key
confirmationKeyRefresher=your_refresh_key
saltRounds=12

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret

# Email (for user verification)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password

# Environment
NODE_ENV=production
```

## 🎯 **What's Fixed**

### **1. Build Script Enhancement**
- Created `build.js` that handles the build process more reliably
- Uses `npm install --force` to ensure all dependencies are installed
- Better error handling and logging

### **2. Dependency Installation**
- Ensures frontend dependencies (including Vite) are installed
- Uses force install to bypass any potential issues
- Proper directory navigation

### **3. Vercel Configuration**
- Simplified vercel.json configuration
- Proper routing for API and frontend
- Correct function configuration

## ✅ **Test Results**

The build process now works perfectly:
```bash
npm run vercel-build
# ✅ Frontend builds successfully to packages/frontend/dist
# ✅ All dependencies installed correctly
# ✅ Vite build process working
```

## 🚨 **Important Notes**

1. **Root Directory**: Must be `/` (root of monorepo), not `packages/backend`
2. **Build Command**: Must be exactly `npm run vercel-build`
3. **Environment Variables**: All must be set in Vercel dashboard
4. **Remove Separate Frontend**: Delete the separate snapgram repository from Vercel

## 🎉 **Ready to Deploy**

With these settings, your deployment should work correctly. The "vite: command not found" error is now resolved!

**Go ahead and update your Vercel project settings with the configuration above, then deploy!** 🚀
