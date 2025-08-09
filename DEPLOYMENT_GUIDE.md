# Deployment Guide for Social Media Monorepo

## Vercel Deployment Strategy

### ✅ **Recommended Approach: Single Repository Deployment**

Since you now have a monorepo, you should **remove the separate frontend repository on Vercel** and deploy the entire monorepo as a single project.

### Why This Approach?

1. **Unified Deployment**: Both backend and frontend are deployed together
2. **Simplified Management**: One repository, one deployment
3. **Better Integration**: Backend serves frontend build files in production
4. **Cost Effective**: Single deployment instead of two separate ones

## Steps to Deploy

### 1. Remove Separate Frontend Repository
- Go to your Vercel dashboard
- Find your separate frontend repository (snapgram)
- Delete/remove it from Vercel
- Keep only the main monorepo repository

### 2. Deploy the Monorepo
1. **Connect Repository**: Connect your monorepo to Vercel
2. **Build Settings**:
   - **Framework Preset**: Node.js
   - **Root Directory**: `packages/backend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `../frontend/dist`
   - **Install Command**: `npm install`

3. **Environment Variables**: Add all your backend environment variables in Vercel dashboard

### 3. Vercel Configuration
The `packages/backend/vercel.json` is configured to:
- Build the backend API
- Route API calls to backend
- Serve frontend files for all other routes

## Alternative: Separate Deployments (Not Recommended)

If you prefer to keep separate deployments:

### Backend Deployment
- Deploy `packages/backend` as a Node.js API
- Set environment variables
- API will be available at `your-backend.vercel.app`

### Frontend Deployment
- Deploy `packages/frontend` as a static site
- Update frontend environment to point to backend URL
- Frontend will be available at `your-frontend.vercel.app`

## Environment Variables Setup

### Backend (.env in Vercel)
```env
PORT=3000
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

### Frontend (.env in Vercel - if separate deployment)
```env
VITE_API_URL=https://your-backend.vercel.app
```

## Production URLs

### Single Repository Deployment
- **Main App**: `https://your-app.vercel.app`
- **API**: `https://your-app.vercel.app/api/*`
- **Frontend**: `https://your-app.vercel.app/*`

### Separate Deployments
- **Backend**: `https://your-backend.vercel.app`
- **Frontend**: `https://your-frontend.vercel.app`

## Recommendation

**Use the single repository deployment approach** because:
- ✅ Simpler to manage
- ✅ Better performance (no CORS issues)
- ✅ Lower costs
- ✅ Easier debugging
- ✅ Unified logging

## Next Steps

1. **Remove the separate frontend repository from Vercel**
2. **Deploy the monorepo as a single project**
3. **Configure environment variables**
4. **Test the deployment**

Your monorepo is now clean and ready for deployment! 🚀
