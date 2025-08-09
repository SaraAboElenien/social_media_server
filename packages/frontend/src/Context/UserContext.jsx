import api from '@/api/axios'
import React, { createContext, useEffect, useState } from 'react';

export const UserContext = createContext(null);



const UserContextProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(
    localStorage.getItem('userToken') || null
  )
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  useEffect(() => {
    const fetchUserData = async () => {
      if (userToken) {
        setLoading(true)
        try {
          // Validate JWT format and parse payload
          const tokenParts = userToken.split('.')
          if (tokenParts.length !== 3) {
            throw new Error('Invalid token format')
          }
          
          const { id } = JSON.parse(atob(tokenParts[1]))
          if (!id) {
            throw new Error('Invalid token payload')
          }
          
          const response = await api.get(
            `/api/v1/auth/user/userByID/${id}`,
            {
              headers: { Authorization: `Bearer ${userToken}` }
            }
          )
          setUserData(response.data)
          setError(null)
        } catch (err) {
          setError('Failed to fetch user data')
          localStorage.removeItem('userToken')
          setUserToken(null)
          setUserData(null)
        } finally {
          setLoading(false)
        }
      } else {
        setLoading(false)
        setUserData(null)
        setError(null)
      }
    }

    fetchUserData()
  }, [userToken])

  return (
    <UserContext.Provider
      value={{ userToken, setUserToken, userData, setUserData, loading, error }}
    >
      {children}
    </UserContext.Provider>
  )
}

export default UserContextProvider
