import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import {
  getAllBookings,
  getMyBookings,
  updateBookingStatus,
  cancelBooking,
} from "../Api/booking.js";
import { Check, X, Ban, Loader2, Calendar, Clock, Inbox } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";

const Bookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
  }, [user.role]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  useEffect(() => {
    if (!loading) {
      gsap.from(".booking-row", {
        opacity: 0,
        y: 20,
        stagger: 0.05,
        duration: 0.5,
        ease: "power2.out",
      });
    }
  }, [loading, bookings]);

  const handleStatusChange = async (id, status) => {
    try {
      await updateBookingStatus(id, status);
      toast.success(`Booking ${status}`);
      fetchBookings();
    } catch {
      toast.error("Action failed");
    }
  };

  const handleCancel = async (id) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    try {
      await cancelBooking(id);
      toast.success("Booking cancelled");
      fetchBookings();
    } catch {
      toast.error("Failed to cancel");
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "approved":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "rejected":
        return "bg-rose-500/10 text-rose-400 border-rose-500/20";
      case "cancelled":
        return "bg-zinc-500/10 text-zinc-400 border-zinc-500/20";
      default:
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    }
  };

  if (loading)
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            {user.role === "admin" ? "All Bookings" : "My Bookings"}
          </h1>
          <p className="text-zinc-400 mt-1 text-sm">
            Manage and monitor campus resource reservations.
          </p>
        </div>
        {user.role !== "admin" && (
          <button
            onClick={() => navigate("/rooms")}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all shadow-lg shadow-indigo-500/20 font-medium"
          >
            + New Booking
          </button>
        )}
      </div>

      <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/50">
                <th className="p-4 font-semibold text-zinc-400 text-sm">Room</th>
                <th className="p-4 font-semibold text-zinc-400 text-sm">Date & Time</th>
                <th className="p-4 font-semibold text-zinc-400 text-sm">Purpose</th>
                <th className="p-4 font-semibold text-zinc-400 text-sm">Status</th>
                <th className="p-4 font-semibold text-zinc-400 text-sm text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {bookings.length > 0 ? (
                bookings.map((booking) => (
                  <tr key={booking._id} className="booking-row hover:bg-white/2 transition-colors group">
                    <td className="p-4">
                      <div className="font-semibold text-zinc-100 group-hover:text-indigo-400 transition-colors">
                        {booking.room?.name || "Unknown Room"}
                      </div>
                      <div className="text-xs text-zinc-500 uppercase tracking-wider mt-0.5">
                        {booking.resourceType}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-zinc-300 text-sm font-medium">
                        <Calendar size={14} className="text-zinc-500" />
                        {new Date(booking.startTime).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-zinc-500 text-xs">
                        <Clock size={14} />
                        {new Date(booking.startTime).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })} - {new Date(booking.endTime).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="text-zinc-300 text-sm max-w-xs truncate">{booking.purpose}</p>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border tracking-widest ${getStatusStyle(booking.status)}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {user.role === "admin" && booking.status === "pending" && (
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleStatusChange(booking._id, "approved")}
                            className="p-2 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white rounded-lg transition-all border border-emerald-500/20"
                            title="Approve"
                          >
                            <Check size={18} />
                          </button>
                          <button
                            onClick={() => handleStatusChange(booking._id, "rejected")}
                            className="p-2 bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white rounded-lg transition-all border border-rose-500/20"
                            title="Reject"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      )}

                      {user.role !== "admin" && (booking.status === "pending" || booking.status === "approved") && (
                        <button
                          onClick={() => handleCancel(booking._id)}
                          className="px-3 py-1.5 text-xs font-semibold text-rose-400 hover:text-white hover:bg-rose-500/20 border border-rose-500/20 rounded-lg transition-all flex items-center justify-end ml-auto gap-2 group/cancel"
                        >
                          <Ban size={14} /> Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-12 text-center">
                    <div className="flex flex-col items-center gap-3 text-zinc-500">
                      <Inbox size={40} className="opacity-20" />
                      <p className="text-sm font-medium">No bookings found</p>
                    </div>
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