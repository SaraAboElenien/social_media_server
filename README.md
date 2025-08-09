# Social Media Monorepo

A full-stack social media application built with Node.js backend and React frontend in a monorepo structure.

## Project Structure

```
social-media-monorepo/
├── packages/
│   ├── backend/          # Node.js + Express API
│   └── frontend/         # React + Vite frontend
├── package.json          # Root package.json with workspaces
└── README.md
```

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm or yarn

### Installation

1. Install all dependencies:
```bash
npm run install:all
```

Or install individually:
```bash
# Install root dependencies
npm install

# Install backend dependencies
npm run install:backend

# Install frontend dependencies
npm run install:frontend
```

### Development

Run both backend and frontend in development mode:
```bash
npm run dev
```

Or run individually:
```bash
# Backend only (port 3000)
npm run dev:backend

# Frontend only (port 5173)
npm run dev:frontend
```

### Production

Build the frontend:
```bash
npm run build
```

Start the backend (serves both API and frontend build):
```bash
npm start
```

## Environment Setup

### Backend (.env in packages/backend/config/.env)
```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
```

### Frontend (.env in packages/frontend/.env)
```env
VITE_API_URL_DEV=http://localhost:3000
```

## API Endpoints

- `GET /api/health` - Health check
- `POST /api/v1/auth/user/signup` - User registration
- `POST /api/v1/auth/user/signin` - User login
- `GET /api/v1/auth/user/profile` - Get user profile
- `PUT /api/v1/auth/user/profile` - Update user profile
- `POST /api/v1/auth/post` - Create post
- `GET /api/v1/auth/post` - Get posts
- `PUT /api/v1/auth/post/:id` - Update post
- `DELETE /api/v1/auth/post/:id` - Delete post
- `POST /api/v1/auth/comment` - Create comment
- `GET /api/v1/auth/notification` - Get notifications

## Features

### Backend
- User authentication with JWT
- File upload with Cloudinary
- MongoDB database with Mongoose
- Email notifications
- Input validation with Joi
- Error handling middleware
- CORS configuration

### Frontend
- React with Vite
- Tailwind CSS for styling
- React Router for navigation
- Axios for API calls
- Form handling with React Hook Form
- Image upload with React Dropzone
- Responsive design

## Development Workflow

1. Backend runs on `http://localhost:3000`
2. Frontend runs on `http://localhost:5173`
3. Frontend proxies API calls to backend in development
4. In production, backend serves both API and frontend build files

## Deployment

The monorepo is configured to work with Vercel deployment. The backend will serve the frontend build files in production mode.
