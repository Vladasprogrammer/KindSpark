import { createContext, useState } from 'react';
import useAuth from '../hooks/useAuth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const { isLoading } = useAuth(setUser);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {isLoading ? (
        <div className="auth-loading">Loading...</div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

