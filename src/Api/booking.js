import api from "./axios";

// 1. Fetch stats for Admin Dashboard
export const getAdminDashboardStats = async () => {
  const { data } = await api.get("/booking/dashboard");
  // Your backend put the stats inside "message"
  return data.message; 
};

// 2. Fetch stats for Student/Faculty
export const getUserStats = async () => {
  const { data } = await api.get("/booking/my-stats");
  // Assuming this endpoint behaves the same way
  return data.message; 
};

// ... existing code ...

// 3. Get User's Bookings
export const getMyBookings = async () => {
  const { data } = await api.get("/booking/my-bookings");
  return data.message; // or data.data depending on your backend response structure
};

// 4. Get All Bookings (Admin)
export const getAllBookings = async () => {
  const { data } = await api.get("/booking/all");
  return data.message; 
};

// 5. Update Status (Admin)
export const updateBookingStatus = async (id, status) => {
  const { data } = await api.patch(`/booking/${id}/status`, { status });
  return data.message;
};

// 6. Cancel Booking (User)
export const cancelBooking = async (id) => {
  const { data } = await api.patch(`/bookings/${id}/cancel`);
  return data.message;
};

// 7. Create New Booking
export const createBooking = async (bookingData) => {
  const { data } = await api.post("/booking", bookingData);
  return data.message;
};