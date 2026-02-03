import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard.jsx";
import MainLayout from "./layout/MainLayout.jsx";
import { useAuth } from "./context/AuthContext.jsx";
import Bookings from "./pages/Bookings"; 
import Rooms from "./pages/Rooms"; 
import NewBooking from "./pages/NewBooking";

// Simple route guard
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  
  return children;
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* Protected Routes (Wrapped in MainLayout) */}
      <Route path="/" element={
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        {/* We will add Bookings and Rooms here later */}
        <Route path="bookings" element={<Bookings />} />
        <Route path="rooms" element={<Rooms />} />
        <Route path="book-room" element={<NewBooking />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;