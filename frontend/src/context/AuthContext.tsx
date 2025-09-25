import { createContext, useContext, useEffect, useMemo, useState } from "react";

type User = {
  _id: string;
  username: string;
  email: string;
};

type AuthContextValue = {
  isAuthenticated: boolean;
  token: string | null;
  user: User | null;
  login: (token: string, userData: User) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const API_URL = (import.meta as any).env?.VITE_API_URL || 'https://one0xdevspd-chatapp.onrender.com';
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  const fetchUserData = async (token: string) => {
    try {
      const response = await fetch(`${API_URL}/me`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
      } else {
        // Token is invalid, clear it
        logout();
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      logout();
    }
  };

  useEffect(() => {
    const existingToken = localStorage.getItem("token");
    const existingUser = localStorage.getItem("user");
    
    if (existingToken) {
      setToken(existingToken);
      
      // If we have a token but no user data, fetch user data from backend
      if (!existingUser || existingUser===undefined) {
        fetchUserData(existingToken);
      } else {
        try {
          console.log(existingUser)
          const userData = JSON.parse(existingUser);
          setUser(userData);
        } catch (error) {
          console.error("Error parsing user data from localStorage:", error);
          // If parsing fails, remove the corrupted data and fetch fresh data
          localStorage.removeItem("user");
          fetchUserData(existingToken);
        }
      }
    }
  }, []);

  const login = (newToken: string, userData: User) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
  };

  const value = useMemo(() => ({ isAuthenticated: !!token, token, user, login, logout }),
    [token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}


