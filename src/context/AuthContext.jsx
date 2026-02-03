import { createContext, useContext, useState, useEffect } from "react";
import api from "../Api/axios.js";
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
          const { data } = await api.get("/me");
          
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
      const { data } = await api.post("/login", { email, password });
      
      
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

    // 4. Register Function
  const registerUser = async (userData) => {
    try {
      // Adjust URL to match your backend (/auth/register or /users/register)
      await api.post("/register", userData);
      toast.success("Account created! Please login.");
      return true;
    } catch (error) {
      console.error("Register Error:", error);
      const message = error.response?.data?.message || "Registration failed";
      toast.error(message);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, registerUser , loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth easily
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);