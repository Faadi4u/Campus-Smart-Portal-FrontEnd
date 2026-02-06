import { useAuth } from "../context/AuthContext.jsx"; 
import { useEffect, useState, useRef } from "react";
import { getRooms, createRoom } from "../Api/room";
import { Plus, MapPin, Users, Projector, Loader2, X } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

import gsap from "gsap";
import { useNavigate } from "react-router-dom";

const Rooms = () => {
  const { user } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const navigate = useNavigate()
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    type: "classroom",
    capacity: "",
    location: "",
    features: "" // Comma separated string
  });

  const modalRef = useRef(null);
  const modalContentRef = useRef(null);
  const containerRef = useRef(null);

  const fetchRooms = async () => {
    try {
      const data = await getRooms();
      setRooms(data || []);
    } catch {
      toast.error("Failed to load rooms");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  // Animation for rooms loading
  useEffect(() => {
    if (!loading && rooms.length > 0) {
      gsap.fromTo(
        ".room-card",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power2.out" }
      );
    }
  }, [loading, rooms]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      // Convert features string to array
      const payload = {
        ...formData,
        features: formData.features.split(",").map(f => f.trim().toLowerCase()).filter(f => f)
      };
      
      await createRoom(payload);
      toast.success("Room created successfully!");
      closeModal();
      setFormData({ name: "", type: "classroom", capacity: "", location: "", features: "" });
      fetchRooms(); // Refresh list
    } catch (error) {
      toast.error(error?.message || "Failed to create room");
    } finally {
      setCreating(false);
    }
  };

  const openModal = () => {
    setShowModal(true);
    // Use setTimeout to ensure DOM is ready for animation
    setTimeout(() => {
      gsap.fromTo(
        modalRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3 }
      );
      gsap.fromTo(
        modalContentRef.current,
        { scale: 0.9, opacity: 0, y: 20 },
        { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: "back.out(1.7)" }
      );
    }, 10);
  };

  const closeModal = () => {
    gsap.to(modalRef.current, { opacity: 0, duration: 0.3 });
    gsap.to(modalContentRef.current, { 
      scale: 0.9, 
      opacity: 0, 
      y: 20, 
      duration: 0.3,
      onComplete: () => setShowModal(false) 
    });
  };

  if (loading) return (
    <div className="flex justify-center items-center h-full min-h-[50vh]">
      <Loader2 className="w-8 h-8 animate-spin text-indigo-500"/>
    </div>
  );

  return (
    <div ref={containerRef} className="space-y-6">
      <Toaster position="top-right" />
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Campus Rooms</h1>
          <p className="text-zinc-400 mt-1">Manage classrooms, labs, and halls</p>
        </div>
         {user?.role === "admin" && (
          <button 
            onClick={openModal}
            className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-500/20 transition-all duration-300 flex items-center gap-2 font-medium"
          >
            <Plus size={18} /> <span>Add Room</span>
          </button>
        )}
      </div>

      {/* Room Grid */}
      {rooms.length === 0 ? (
        <div className="text-center py-20 bg-zinc-900/30 rounded-2xl border border-zinc-800/50">
          <div className="bg-zinc-800/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Projector className="w-8 h-8 text-zinc-500" />
          </div>
          <h3 className="text-xl font-medium text-white">No rooms found</h3>
          <p className="text-zinc-500 mt-2">Get started by creating your first room.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <div 
              key={room._id} 
               onClick={() => {
              if (user?.role !== "admin") {
                navigate(`/book-room?roomId=${room._id}`);
              }
            }}
              className="room-card group bg-zinc-900/40 backdrop-blur-sm p-6 rounded-2xl border border-white/5 hover:border-indigo-500/30 hover:bg-zinc-800/40 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">{room.name}</h3>
                  <span className="inline-block mt-1 text-xs font-medium bg-zinc-800 text-zinc-300 px-2.5 py-1 rounded-full capitalize border border-zinc-700">
                    {room.type?.replace("_", " ")}
                  </span>
                </div>
                <div className="bg-indigo-500/10 text-indigo-400 p-2.5 rounded-xl group-hover:bg-indigo-500 group-hover:text-white transition-all duration-300">
                  <Users size={20} />
                </div>
              </div>
              
              <div className="space-y-3 text-sm text-zinc-400">
                <div className="flex items-center gap-2.5">
                  <MapPin size={16} className="text-zinc-500" /> 
                  <span>{room.location}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Users size={16} className="text-zinc-500" /> 
                  <span>Capacity: <span className="text-zinc-200">{room.capacity}</span> students</span>
                </div>
                
                {room.features?.length > 0 && (
                  <div className="pt-3 border-t border-white/5 flex items-start gap-2 mt-3">
                    <Projector size={16} className="mt-1 text-zinc-500 shrink-0" /> 
                    <div className="flex flex-wrap gap-1.5">
                      {room.features.map((f, i) => (
                        <span key={i} className="text-[10px] bg-zinc-800/80 text-zinc-300 px-2 py-0.5 rounded border border-zinc-700/50 uppercase tracking-wide">
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Room Modal */}
      {showModal && (
        <div 
          ref={modalRef}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 opacity-0"
        >
          <div 
            ref={modalContentRef}
            className="bg-zinc-900 border border-zinc-700 rounded-2xl max-w-md w-full p-0 shadow-2xl overflow-hidden opacity-0 scale-90"
          >
            <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Add New Room</h2>
              <button 
                onClick={closeModal}
                className="text-zinc-400 hover:text-white hover:bg-zinc-800 p-1 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">Room Name</label>
                <input 
                  type="text" placeholder="e.g. Lab 1" required 
                  className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">Type</label>
                  <select 
                    className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all appearance-none"
                    value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}
                  >
                    <option value="classroom" className="bg-zinc-900">Classroom</option>
                    <option value="lab" className="bg-zinc-900">Lab</option>
                    <option value="hall" className="bg-zinc-900">Hall</option>
                    <option value="meeting_room" className="bg-zinc-900">Meeting Room</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">Capacity</label>
                  <input 
                    type="number" placeholder="e.g. 50" required 
                    className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                    value={formData.capacity} onChange={e => setFormData({...formData, capacity: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">Location</label>
                <input 
                  type="text" placeholder="e.g. Block A, 2nd Floor" required 
                  className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                  value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">Features</label>
                <input 
                  type="text" placeholder="e.g. Projector, AC, Whiteboard" 
                  className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                  value={formData.features} onChange={e => setFormData({...formData, features: e.target.value})}
                />
              </div>
              
              <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-zinc-800">
                <button 
                  type="button" 
                  onClick={closeModal} 
                  className="px-4 py-2.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xl transition-colors font-medium text-sm"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={creating}
                  className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 shadow-lg shadow-indigo-900/20 font-medium text-sm transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 flex items-center gap-2"
                >
                  {creating ? <Loader2 size={16} className="animate-spin" /> : null}
                  {creating ? "Creating..." : "Create Room"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Rooms;
