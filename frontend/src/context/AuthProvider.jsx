import { useState, useEffect, useCallback } from 'react';
import { AuthContext } from './AuthContext';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Get JWT token from cookies
  const getTokenFromCookie = () => {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'authToken') {
        return decodeURIComponent(value);
      }
    }
    return null;
  };

  // Set JWT token in cookie (httpOnly would be better from backend)
  const setTokenInCookie = (token) => {
    const expirationDate = new Date();
    expirationDate.setTime(expirationDate.getTime() + (60 * 60 * 1000)); // 60 minutes
    document.cookie = `authToken=${encodeURIComponent(token)}; expires=${expirationDate.toUTCString()}; path=/; SameSite=Strict`;
  };

  // Clear JWT token from cookie
  const clearTokenFromCookie = () => {
    document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict';
  };

  // Load user data on mount - batch state updates
  const fetchUserData = useCallback(async (token) => {
    try {
      const response = await fetch('http://localhost:5008/api/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include', // Include cookies
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        // Token invalid, clear it
        clearTokenFromCookie();
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      clearTokenFromCookie();
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = getTokenFromCookie();
    if (token) {
      fetchUserData(token);
    } else {
      setLoading(false);
    }
  }, [fetchUserData]);

  const login = (newToken, newUser) => {
    setUser(newUser);
    setTokenInCookie(newToken);
  };

  const logout = () => {
    setUser(null);
    clearTokenFromCookie();
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
