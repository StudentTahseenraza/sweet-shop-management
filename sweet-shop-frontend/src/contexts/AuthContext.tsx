import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import toast from "react-hot-toast";

interface IUser {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthContextType {
  user: IUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    
    if (userData && token) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        console.error("Failed to parse user data from localStorage", error);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string) => {
    try {
      // Mock login - replace with actual API call
      const mockUser: IUser = {
        id: "1",
        email,
        name: "Test User",
        role: email === "admin@sweetshop.com" ? "ADMIN" : "CUSTOMER",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      localStorage.setItem("token", "mock-jwt-token");
      localStorage.setItem("user", JSON.stringify(mockUser));
      setUser(mockUser);
      toast.success("Login successful!");
    } catch (error: any) {
      toast.error(error.message || "Login failed");
      throw error;
    }
  };

  const register = async (name: string, email: string) => {
    try {
      // Mock registration - replace with actual API call
      const mockUser: IUser = {
        id: "2",
        email,
        name,
        role: "CUSTOMER",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      localStorage.setItem("token", "mock-jwt-token");
      localStorage.setItem("user", JSON.stringify(mockUser));
      setUser(mockUser);
      toast.success("Registration successful!");
    } catch (error: any) {
      toast.error(error.message || "Registration failed");
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    toast.success("Logged out successfully");
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === "ADMIN",
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
