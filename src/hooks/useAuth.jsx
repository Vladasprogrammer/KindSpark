import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';
import * as C from '../constants/main';

export default function useAuth(setUser) {
  const [loginForm, setLoginForm] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Track initial auth check
  const navigate = useNavigate();

  const getUser = async () => {
    try {
      const response = await axios.get(C.SERVER_URL + 'auth-user', { 
        withCredentials: true 
      });
      setUser(response.data);
    } catch (err) {
      // Only clear user if it's not a 401 (unauthorized)
      if (err.response?.status !== 401) {
        console.error('Auth error:', err);
      }
      setUser(null); // Explicitly set to null if not authenticated
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getUser(); // Initial auth check when component mounts
  }, []);

  useEffect(() => {
    if (loginForm === null) return;

    const login = async () => {
      try {
        const response = await axios.post(
          C.SERVER_URL + 'login', 
          loginForm, 
          { withCredentials: true }
        );
        setUser(response.data.user);
        navigate(C.GO_AFTER_LOGIN);
      } catch (err) {
        console.error('Login error:', err);
        // Handle specific error cases if needed
        if (err.response?.status === 401) {
          alert('Invalid credentials');
        }
      }
    };

    login();
  }, [loginForm, navigate]);

  return { 
    setLoginForm, 
    getUser,
    isLoading // Expose loading state
  };
}