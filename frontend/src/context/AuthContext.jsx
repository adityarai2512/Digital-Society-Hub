import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await api.get("/auth/me");
        setUser(data);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    setUser(data);
    toast.success(`Welcome back, ${data.name}! 👋`);
    return data;
  };

  const register = async (formData) => {
    const { data } = await api.post("/auth/register", formData);
    if (data.isApproved) {
      setUser(data);
    }
    toast.success(data.message || "Registration successful!");
    return data;
  };

  const logout = async () => {
    await api.post("/auth/logout");
    setUser(null);
    toast.success("Logged out successfully.");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
