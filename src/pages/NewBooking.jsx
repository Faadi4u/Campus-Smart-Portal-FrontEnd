import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getRooms } from "../Api/room";
import { createBooking } from "../Api/booking";
import { CalendarDays, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const NewBooking = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    resourceType: "Room", // Fixed
    resourceId: "",
    date: "",
    startTime: "",
    endTime: "",
    purpose: "",
  });

  // Fetch Rooms for Dropdown
  useEffect(() => {
    const loadRooms = async () => {
      try {
        const data = await getRooms();
        setRooms(data || []);
        if (data?.length > 0) {
          setFormData((prev) => ({ ...prev, resourceId: data[0]._id }));
        }
      } catch {
        toast.error("Could not load rooms");
      } finally {
        setLoading(false);
      }
    };
    loadRooms();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Format DateTime for Backend (ISO String)
      // Input: "2024-02-01" + "10:00" -> "2024-02-01T10:00:00.000Z"
      const startDateTime = new Date(`${formData.date}T${formData.startTime}`);
      const endDateTime = new Date(`${formData.date}T${formData.endTime}`);

      const payload = {
        
        roomId: formData.resourceId,
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        purpose: formData.purpose,
      };

      await createBooking(payload);
      toast.success("Booking Request Sent! 🚀");
      navigate("/bookings"); // Go back to list
    } catch (error) {
      toast.error(error.response?.data?.message || "Booking Failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center gap-3 mb-6 border-b pb-4">
          <div className="bg-blue-100 p-3 rounded-full text-blue-600">
            <CalendarDays size={24} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Book a Room</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Select Room */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Room
            </label>
            <select
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
              value={formData.resourceId}
              onChange={(e) =>
                setFormData({ ...formData, resourceId: e.target.value })
              }
            >
              {rooms.map((room) => (
                <option key={room._id} value={room._id}>
                  {room.name} ({room.type} - Cap: {room.capacity})
                </option>
              ))}
            </select>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                required
                min={new Date().toISOString().split("T")[0]} // Prevent past dates
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Time
              </label>
              <input
                type="time"
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={formData.startTime}
                onChange={(e) =>
                  setFormData({ ...formData, startTime: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Time
              </label>
              <input
                type="time"
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={formData.endTime}
                onChange={(e) =>
                  setFormData({ ...formData, endTime: e.target.value })
                }
              />
            </div>
          </div>

          {/* Purpose */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Purpose
            </label>
            <textarea
              required
              placeholder="e.g. Project Discussion, Study Group"
              rows="3"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={formData.purpose}
              onChange={(e) =>
                setFormData({ ...formData, purpose: e.target.value })
              }
            ></textarea>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate("/bookings")}
              className="flex-1 py-3 px-4 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-3 px-4 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition flex justify-center items-center gap-2"
            >
              {submitting ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Confirm Booking"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewBooking;
