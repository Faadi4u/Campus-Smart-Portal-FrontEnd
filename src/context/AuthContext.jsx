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
          const { data } = await api.get("/auth/me");
          setUser(data.data.user); // Assuming backend returns { data: { user: ... } }
        } catch (error) {
          console.error("Session expired", error);
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
      const { data } = await api.post("/auth/login", { email, password });
      
      // Save token
      localStorage.setItem("accessToken", data.data.accessToken);
      
      // Set User State
      setUser(data.data.user);
      
      toast.success("Login Successful! 🎉");
      return true; // Return true to let the page know it worked
    } catch (error) {
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
    // Optional: Redirect to login is handled by the UI
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