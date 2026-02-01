import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Check if user is logged in on page load
  useEffect(() => {
    const checkUser = async () => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        try {
          // Adjust this URL to match your backend route exactly
          const { data } = await api.get("/auth/me");
          
          // Fix: Handle both Flat { user: ... } and Nested { data: { user: ... } }
          const userData = data.user || data.data?.user;
          setUser(userData);
          
        } catch (error) {
          console.error("Session expired or invalid token", error);
          localStorage.removeItem("accessToken");
          setUser(null);
        }
      }
      setLoading(false);
    };
    checkUser();
  }, []);

  // 2. Login Function
  const login = async (email, password) => {
    try {
      // FIX 1: Ensure route is /auth/login (based on your backend setup)
      const { data } = await api.post("/login", { email, password });
      
      // FIX 2: Your backend sends flat JSON, so we use 'data.accessToken' directly
      // (NOT data.data.accessToken)
      const accessToken = data.accessToken;
      const userData = data.user;

      if (!accessToken) throw new Error("Token missing!");

      // Save token
      localStorage.setItem("accessToken", accessToken);
      
      // Set User State
      setUser(userData);
      
      toast.success("Login Successful! 🎉");
      return true; 
    } catch (error) {
      console.error("Login Error:", error);
      const message = error.response?.data?.message || "Login failed";
      toast.error(message);
      return false;
    }
  };

  // 3. Logout Function
  const logout = () => {
    localStorage.removeItem("accessToken");
    setUser(null);
    toast.success("Logged out successfully");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth easily
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);