import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import UserContextProvider from '@/Context/UserContext.jsx'
import  { Toaster } from 'react-hot-toast';
import {
  Home,
  Profile,
  Explore,
  CreatePost,
  EditPost,
  PostDetails,
  UpdateProfile,
  AllUsers,
  Saved,
  UserNotification
} from './_root/pages'

import AuthLayout from './_auth/AuthLayout.jsx'
import RootLayout from './_root/RootLayout.jsx'
import SignupForm from './_auth/forms/SignupForm.jsx'
import SigninForm from './_auth/forms/SingninForm.jsx'
import ProtectedRoute from './components/Shared/protectedRoutes';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element:<ProtectedRoute><Home /></ProtectedRoute>  },
      { path: 'explore', element: <ProtectedRoute><Explore /></ProtectedRoute> },
      { path: 'saved', element:<ProtectedRoute><Saved /></ProtectedRoute>  },
      { path: 'all-users', element:<ProtectedRoute><AllUsers /></ProtectedRoute>  },
      { path: 'create-post', element: <ProtectedRoute><CreatePost /></ProtectedRoute> },
      { path: 'update-post/:id', element: <ProtectedRoute><EditPost /></ProtectedRoute> },
      { path: 'posts/:id', element: <ProtectedRoute><PostDetails /></ProtectedRoute> },
      { path: 'profile/:id/*', element: <ProtectedRoute><Profile /></ProtectedRoute> },
      { path: 'update-profile/:id', element: <ProtectedRoute><UpdateProfile /></ProtectedRoute> },
      { path: "/notification", element:<ProtectedRoute> <UserNotification /></ProtectedRoute> }

    ]
  },
  {
    element: <AuthLayout />,
    children: [
      { path: 'sign-in', element: <SigninForm /> },
      { path: 'sign-up', element: <SignupForm /> }
    ]
  }
])

const App = () => {
  return (
    <main className='flex w-screen'>
      <UserContextProvider>
        <RouterProvider router={router} />
        <Toaster />
      </UserContextProvider>
    </main>
  )
}

export default App
