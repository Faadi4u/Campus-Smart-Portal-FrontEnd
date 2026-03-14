import { useAuth } from "../context/AuthContext.jsx";
import { useEffect, useState, useRef } from "react";
import { getRooms, createRoom, updateRoom, deleteRoom } from "../Api/room";
import { Plus, MapPin, Users, Projector, Loader2, X, Filter, Edit, Trash2 } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import gsap from "gsap";
import { useNavigate } from "react-router-dom";

const Rooms = () => {
  const { user } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const navigate = useNavigate();

  // State for Edit Mode
  const [editingRoomId, setEditingRoomId] = useState(null);

  const [activeFilter, setActiveFilter] = useState("all");

  const [formData, setFormData] = useState({
    name: "",
    type: "classroom",
    capacity: "",
    location: "",
    features: "",
    hasProjector: false
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

  const filteredRooms = rooms.filter((room) => {
    if (activeFilter === "all") return true;
    return room.type === activeFilter;
  });

  const classroomRooms = rooms.filter((room) => room.type === "classroom");
  const labRooms = rooms.filter((room) => room.type === "lab");
  const hallRooms = rooms.filter((room) => room.type === "hall" || room.type === "seminar_hall" || room.type === "library_hall");
  const meetingRooms = rooms.filter((room) => room.type === "meeting_room");

  // Animation
  useEffect(() => {
    if (!loading && filteredRooms.length > 0) {
      gsap.fromTo(
        ".room-card",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power2.out" }
      );
    }
  }, [loading, activeFilter, filteredRooms]);

  // Handle Create OR Update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const payload = {
        ...formData,
        features: typeof formData.features === "string" 
          ? formData.features.split(",").map((f) => f.trim().toLowerCase()).filter((f) => f) 
          : formData.features,
      };

      if (editingRoomId) {
        await updateRoom(editingRoomId, payload);
        toast.success("Room updated successfully!");
      } else {
        await createRoom(payload);
        toast.success("Room created successfully!");
      }

      closeModal();
      resetForm();
      fetchRooms();
    } catch (error) {
      toast.error(error?.message || "Operation failed");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this room?")) return;
    try {
      await deleteRoom(id);
      toast.success("Room deleted");
      fetchRooms();
    } catch {
      toast.error("Failed to delete room");
    }
  };

  const openModal = (roomToEdit = null) => {
    if (roomToEdit) {
      setEditingRoomId(roomToEdit._id);
      setFormData({
        name: roomToEdit.name,
        type: roomToEdit.type,
        capacity: roomToEdit.capacity,
        location: roomToEdit.location,
        features: roomToEdit.features.join(", "),
        hasProjector: roomToEdit.hasProjector
      });
    } else {
      resetForm();
    }
    setShowModal(true);
    setTimeout(() => {
      gsap.fromTo(modalRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 });
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
      onComplete: () => {
        setShowModal(false);
        resetForm();
      },
    });
  };

  const resetForm = () => {
    setEditingRoomId(null);
    setFormData({
      name: "",
      type: "classroom",
      capacity: "",
      location: "",
      features: "",
      hasProjector: false
    });
  };

  const renderRoomCard = (room) => (
    <div
      key={room._id}
      onClick={() => {
        if (user?.role !== "admin") {
          navigate(`/book-room?roomId=${room._id}`);
        }
      }}
      className={`room-card group bg-zinc-900/40 backdrop-blur-sm p-6 rounded-2xl border border-white/5 hover:border-indigo-500/30 hover:bg-zinc-800/40 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 ${
        user?.role !== "admin" ? "cursor-pointer" : ""
      }`}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">
            {room.name}
          </h3>
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
          <span>
            Capacity: <span className="text-zinc-200">{room.capacity}</span> students
          </span>
        </div>

        {room.features?.length > 0 && (
          <div className="pt-3 border-t border-white/5 flex items-start gap-2 mt-3">
            <Projector size={16} className="mt-1 text-zinc-500 shrink-0" />
            <div className="flex flex-wrap gap-1.5">
              {room.features.map((f, i) => (
                <span
                  key={i}
                  className="text-[10px] bg-zinc-800/80 text-zinc-300 px-2 py-0.5 rounded border border-zinc-700/50 uppercase tracking-wide"
                >
                  {f}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Admin Actions: Edit / Delete */}
{user?.role === "admin" && (
  <div className="mt-6 pt-4 border-t border-white/5 flex gap-3"> {/* REMOVED opacity classes */}
    <button
      onClick={(e) => {
        e.stopPropagation();
        openModal(room);
      }}
      className="flex-1 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors z-20" // Added z-20
    >
      <Edit size={14} /> Edit
    </button>
    <button
      onClick={(e) => {
        e.stopPropagation();
        handleDelete(room._id);
      }}
      className="flex-1 py-2 bg-rose-500/10 hover:bg-rose-600 text-rose-400 hover:text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors border border-rose-500/20 hover:border-rose-600 z-20" // Added z-20
    >
      <Trash2 size={14} /> Delete
    </button>
  </div>
)}

      {/* Student Action: Book Now */}
      {user?.role !== "admin" && (
        <div className="mt-6 pt-4 border-t border-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest flex items-center justify-center gap-2">
            Book Now <span className="text-lg">→</span>
          </span>
        </div>
      )}
    </div>
  );

  const renderRoomSection = (title, roomList) => {
    if (!roomList.length) return null;

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <span className="px-2.5 py-1 text-xs rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
            {roomList.length}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roomList.map((room) => renderRoomCard(room))}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div ref={containerRef} className="space-y-6">
      <Toaster position="top-right" />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Campus Rooms</h1>
          <p className="text-zinc-400 mt-1">Manage classrooms, labs, and halls</p>
        </div>
        {user?.role === "admin" && (
          <button
            onClick={() => openModal(null)}
            className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl hover:bg-indigo-500 hover:shadow-lg transition-all flex items-center gap-2 font-medium"
          >
            <Plus size={18} /> <span>Add Room</span>
          </button>
        )}
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide mb-6">
        <Filter size={18} className="text-zinc-500 mr-2 shrink-0" />
        <FilterBadge label="All" value="all" active={activeFilter} onClick={setActiveFilter} />
        <FilterBadge label="Classrooms" value="classroom" active={activeFilter} onClick={setActiveFilter} />
        <FilterBadge label="Labs" value="lab" active={activeFilter} onClick={setActiveFilter} />
        <FilterBadge label="Halls" value="hall" active={activeFilter} onClick={setActiveFilter} />
        <FilterBadge label="Meeting Rooms" value="meeting_room" active={activeFilter} onClick={setActiveFilter} />
      </div>

      {activeFilter === "all" ? (
        <div className="space-y-10">
          {renderRoomSection("Classrooms", classroomRooms)}
          {renderRoomSection("Labs", labRooms)}
          {renderRoomSection("Halls", hallRooms)}
          {renderRoomSection("Meeting Rooms", meetingRooms)}
        </div>
      ) : filteredRooms.length === 0 ? (
        <div className="text-center py-20 bg-zinc-900/30 rounded-2xl border border-zinc-800/50">
          <div className="bg-zinc-800/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Projector className="w-8 h-8 text-zinc-500" />
          </div>
          <h3 className="text-xl font-medium text-white">
            No {activeFilter === "all" ? "rooms" : activeFilter.replace("_", " ")} found
          </h3>
          <p className="text-zinc-500 mt-2">Try changing the filter or add a new one.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRooms.map((room) => renderRoomCard(room))}
        </div>
      )}

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
              <h2 className="text-xl font-bold text-white">
                {editingRoomId ? "Edit Room" : "Add New Room"}
              </h2>
              <button
                onClick={closeModal}
                className="text-zinc-400 hover:text-white hover:bg-zinc-800 p-1 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                  Room Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Lab 1"
                  required
                  className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                    Type
                  </label>
                  <select
                    className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all appearance-none"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  >
                    <option value="classroom" className="bg-zinc-900">Classroom</option>
                    <option value="lab" className="bg-zinc-900">Lab</option>
                    <option value="lecture_room" className="bg-zinc-900">Lecture Room</option>
                    <option value="seminar_hall" className="bg-zinc-900">Seminar Hall</option>
                    <option value="meeting_room" className="bg-zinc-900">Meeting Room</option>
                    <option value="library_hall" className="bg-zinc-900">Library Hall</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                    Capacity
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 50"
                    required
                    className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                  Location
                </label>
                <input
                  type="text"
                  placeholder="e.g. Block A"
                  required
                  className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                  Features (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. AC, Whiteboard"
                  className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                />
              </div>

              <div className="flex items-center gap-2 mt-2">
                <input
                  type="checkbox"
                  id="hasProjector"
                  checked={formData.hasProjector}
                  onChange={(e) => setFormData({ ...formData, hasProjector: e.target.checked })}
                  className="w-4 h-4 text-indigo-600 bg-zinc-800 border-zinc-700 rounded focus:ring-indigo-500"
                />
                <label htmlFor="hasProjector" className="text-sm text-zinc-300">Has Projector?</label>
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
                  className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 shadow-lg shadow-indigo-900/20 font-medium text-sm transition-all flex items-center gap-2"
                >
                  {creating ? <Loader2 size={16} className="animate-spin" /> : null}
                  {creating ? (editingRoomId ? "Updating..." : "Creating...") : (editingRoomId ? "Update Room" : "Create Room")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const FilterBadge = ({ label, value, active, onClick }) => (
  <button
    onClick={() => onClick(value)}
    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all border whitespace-nowrap ${
      active === value
        ? "bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-500/20"
        : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-zinc-200"
    }`}
  >
    {label}
  </button>
);

export default Rooms;