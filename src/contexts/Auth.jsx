import { createContext, useEffect, useState } from 'react';
import useAuth from '../hooks/useAuth';

const Auth = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const { isLoading } = useAuth(setUser); // Get loading state

  return (
    <Auth.Provider value={{ user, setUser }}>
      {isLoading ? (
        <div className="auth-loading">Loading...</div>
      ) : (
        children
      )}
    </Auth.Provider>
  );
};

export default Auth;