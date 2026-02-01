import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";

function App() {
  return (
    <Routes>
      {/* Default route redirects to login */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      
      {/* Login Route */}
      <Route path="/login" element={<Login />} />

      {/* Placeholder for Dashboard (we will build this next) */}
      <Route path="/dashboard" element={<div className="p-10 text-2xl">Dashboard coming soon...</div>} />
    </Routes>
  );
}

export default App;