import { useEffect, useState, useRef } from "react";
import { useNavigate , useSearchParams  } from "react-router-dom";
import { getRooms } from "../Api/room.js";
import { createBooking } from "../Api/booking.js";
import { CalendarDays, Loader2, ArrowLeft, Send } from "lucide-react";
import toast from "react-hot-toast";
import gsap from "gsap";
const NewBooking = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams(); 
  const urlRoomId = searchParams.get("roomId")
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const containerRef = useRef(null);
  const [formData, setFormData] = useState({
    resourceType: "Room",
    resourceId: "",
    date: "",
    startTime: "",
    endTime: "",
    purpose: "",
  });
    useEffect(() => {
    const loadRooms = async () => {
      try {
        const data = await getRooms();
        const roomList = data || [];
        setRooms(roomList);
        
        // LOGIC: If we have a roomId in the URL, use it. 
        // Otherwise, default to the first room in the list.
        if (urlRoomId) {
          setFormData((prev) => ({ ...prev, resourceId: urlRoomId }));
        } else if (roomList.length > 0) {
          setFormData((prev) => ({ ...prev, resourceId: roomList[0]._id }));
        }

      } catch {
        toast.error("Could not load rooms");
      } finally {
        setLoading(false);
      }
    };
    loadRooms();
  }, [urlRoomId]); // 👈 Added urlRoomId as a dependency

  useEffect(() => {
    if (!loading) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
      );
    }
  }, [loading]);

   const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic Validation
    if (!formData.date || !formData.startTime || !formData.endTime) {
      toast.error("Please fill in all date and time fields");
      return;
    }

    setSubmitting(true);
    try {
      const startDateTime = new Date(`${formData.date}T${formData.startTime}`);
      const endDateTime = new Date(`${formData.date}T${formData.endTime}`);

      // Check if dates are valid
      if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
        toast.error("Invalid date or time format");
        setSubmitting(false);
        return;
      }

      // PAYLOAD: Must include resourceType if your backend requires it
      const payload = {
        resourceType: "Room", // Added this
        roomId: formData.resourceId,
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        purpose: formData.purpose,
      };

      console.log("Sending Payload:", payload); // Debugging: check your console!

      await createBooking(payload);
      toast.success("Booking Request Sent! 🚀");
      navigate("/bookings");
    } catch (error) {
      console.error("Booking Error:", error);
      toast.error(error.response?.data?.message || "Booking Failed");
    } finally {
      setSubmitting(false);
    }
  };
  if (loading) return (
    <div className="flex h-[60vh] items-center justify-center">
      <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
    </div>
  );
  return (
    <div className="max-w-3xl mx-auto py-8">
      <button 
        onClick={() => navigate("/bookings")}
        className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-6 group"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        Back to Bookings
      </button>
      <div 
        ref={containerRef}
        className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="p-8 border-b border-zinc-800 bg-zinc-900/50">
          <div className="flex items-center gap-4">
            <div className="bg-indigo-500/10 p-4 rounded-2xl border border-indigo-500/20 text-indigo-400">
              <CalendarDays size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">Book a Room</h1>
              <p className="text-zinc-400 mt-1">Reserve a campus resource for your activity.</p>
            </div>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Select Room */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider ml-1">
              Select Available Room
            </label>
            <div className="relative group">
                <select
                required
                className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all appearance-none"
                value={formData.resourceId}
                onChange={(e) =>
                    setFormData({ ...formData, resourceId: e.target.value })
                }
                >
                {rooms.map((room) => (
                    <option key={room._id} value={room._id} className="bg-zinc-900">
                    {room.name} ({room.type} - Cap: {room.capacity})
                    </option>
                ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-zinc-500">
                    <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
            </div>
          </div>
          {/* Date & Time */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider ml-1">
                Date
              </label>
              <input
                type="date"
                required
                min={new Date().toISOString().split("T")[0]}
                className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all scheme-dark"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider ml-1">
                Start Time
              </label>
              <input
                type="time"
                required
                className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all scheme-dark"
                value={formData.startTime}
                onChange={(e) =>
                  setFormData({ ...formData, startTime: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider ml-1">
                End Time
              </label>
              <input
                type="time"
                required
                className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all scheme:dark"
                value={formData.endTime}
                onChange={(e) =>
                  setFormData({ ...formData, endTime: e.target.value })
                }
              />
            </div>
          </div>
          {/* Purpose */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider ml-1">
              Purpose
            </label>
            <textarea
              required
              placeholder="e.g. Project Discussion, Study Group"
              rows="4"
              className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-3.5 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all resize-none"
              value={formData.purpose}
              onChange={(e) =>
                setFormData({ ...formData, purpose: e.target.value })
              }
            ></textarea>
          </div>
          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate("/bookings")}
              className="flex-1 py-4 px-6 text-zinc-300 bg-zinc-800 hover:bg-zinc-700 rounded-xl font-semibold transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-4 px-6 text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl font-semibold transition-all shadow-lg shadow-indigo-900/20 hover:scale-[1.01] active:scale-[0.99] flex justify-center items-center gap-2 group disabled:opacity-70"
            >
              {submitting ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  <span>Confirm Booking</span>
                  <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default NewBooking;