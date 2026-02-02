import { useEffect, useState , useCallback } from "react";
import { useAuth } from "../context/AuthContext.jsx";

import { 
  getAllBookings, 
  getMyBookings, 
  updateBookingStatus, 
  cancelBooking 
} from "../Api/booking.js"; 
import { Check, X, Ban, Loader2, Calendar, Clock } from "lucide-react";
import toast from "react-hot-toast";

const Bookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Data
    // Wrap function in useCallback so it doesn't re-create on every render
  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      let data;
      if (user.role === "admin") {
        data = await getAllBookings();
      } else {
        data = await getMyBookings();
      }
      setBookings(data || []);
    } catch {
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  }, [user.role]); // 

 
  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]); 

  // Handle Actions
  const handleStatusChange = async (id, status) => {
    try {
      await updateBookingStatus(id, status);
      toast.success(`Booking ${status}`);
      fetchBookings(); // Refresh list
    } catch {
      toast.error("Action failed");
    }
  };

  const handleCancel = async (id) => {
    if(!confirm("Are you sure you want to cancel this booking?")) return;
    try {
      await cancelBooking(id);
      toast.success("Booking cancelled");
      fetchBookings();
    } catch {
      toast.error("Failed to cancel");
    }
  };

  // Status Badge Helper
  const getStatusColor = (status) => {
    switch (status) {
      case "approved": return "bg-green-100 text-green-700";
      case "rejected": return "bg-red-100 text-red-700";
      case "cancelled": return "bg-gray-100 text-gray-700";
      default: return "bg-yellow-100 text-yellow-700"; // pending
    }
  };

  if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-blue-600"/></div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {user.role === "admin" ? "All Bookings" : "My Bookings"}
        </h1>
        {user.role !== "admin" && (
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
            + New Booking
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 font-medium text-gray-500">Room</th>
                <th className="p-4 font-medium text-gray-500">Date & Time</th>
                <th className="p-4 font-medium text-gray-500">Purpose</th>
                <th className="p-4 font-medium text-gray-500">Status</th>
                <th className="p-4 font-medium text-gray-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {bookings.length > 0 ? (
                bookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-gray-50 transition">
                    <td className="p-4">
                      <div className="font-medium text-gray-800">
                        {booking.room?.name || "Unknown Room"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {booking.resourceType}
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} />
                        {new Date(booking.startTime).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock size={14} />
                        {new Date(booking.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - 
                        {new Date(booking.endTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </div>
                    </td>
                    <td className="p-4 text-gray-700">{booking.purpose}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {/* Admin Actions */}
                      {user.role === "admin" && booking.status === "pending" && (
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => handleStatusChange(booking._id, "approved")}
                            className="p-1 text-green-600 hover:bg-green-50 rounded" title="Approve">
                            <Check size={18} />
                          </button>
                          <button 
                            onClick={() => handleStatusChange(booking._id, "rejected")}
                            className="p-1 text-red-600 hover:bg-red-50 rounded" title="Reject">
                            <X size={18} />
                          </button>
                        </div>
                      )}

                      {/* Student Actions */}
                      {user.role !== "admin" && (booking.status === "pending" || booking.status === "approved") && (
                        <button 
                          onClick={() => handleCancel(booking._id)}
                          className="text-sm text-red-600 hover:text-red-800 flex items-center justify-end w-full gap-1">
                          <Ban size={14} /> Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500">
                    No bookings found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Bookings;