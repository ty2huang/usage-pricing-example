import { createContext, useContext, useState, ReactNode } from 'react';
import { User, Credentials, AuthContextType } from '../types';

const AuthContext = createContext<AuthContextType | null>(null);

export const apiHost = import.meta.env.DEV ? 'http://localhost' : import.meta.env.VITE_API_HOST;

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [token2, setToken2] = useState<string | null>(null);

  const login = async (credentials: Credentials): Promise<boolean> => {
    try {
      const formData = new URLSearchParams({
        username: credentials.username,
        password: credentials.password,
        grant_type: 'password'
      });

      const response = await fetch(`${apiHost}:8000/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });

      if (!response.ok) {
        return false;
      }

      const data = await response.json();
      setToken(data.access_token);

      const response2 = await fetch(`${apiHost}:4465/squirrels-v0/sample/v1/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });

      if (!response2.ok) {
        return false;
      }

      const data2 = await response2.json();
      setToken2(data2.access_token);

      setUser({ username: credentials.username });
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = (): void => {
    setUser(null);
    setToken(null);
    setToken2(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, token2, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};