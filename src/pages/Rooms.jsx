import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getRooms, createRoom } from "../Api/room.js";
import { Plus, MapPin, Users, Projector, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const Rooms = () => {
  const { user } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    type: "classroom",
    capacity: "",
    location: "",
    features: "" // Comma separated string
  });

  const fetchRooms = async () => {
    try {
      setLoading(true);
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

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      // Convert features string to array
      const payload = {
        ...formData,
        features: formData.features.split(",").map(f => f.trim().toLowerCase()).filter(f => f)
      };
      
      await createRoom(payload);
      toast.success("Room created successfully!");
      setShowModal(false);
      setFormData({ name: "", type: "classroom", capacity: "", location: "", features: "" });
      fetchRooms(); // Refresh list
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create room");
    }
  };

  if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-blue-600"/></div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Campus Rooms</h1>
        {user.role === "admin" && (
          <button 
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
            <Plus size={18} /> Add Room
          </button>
        )}
      </div>

      {/* Room Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room) => (
          <div key={room._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-800">{room.name}</h3>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded capitalize">{room.type}</span>
              </div>
              <div className="bg-blue-50 text-blue-700 p-2 rounded-lg">
                <Users size={20} />
              </div>
            </div>
            
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <MapPin size={16} /> {room.location}
              </div>
              <div className="flex items-center gap-2">
                <Users size={16} /> Capacity: {room.capacity}
              </div>
              {room.features?.length > 0 && (
                <div className="flex items-start gap-2 mt-2">
                  <Projector size={16} className="mt-1" /> 
                  <div className="flex flex-wrap gap-1">
                    {room.features.map((f, i) => (
                      <span key={i} className="text-xs bg-gray-100 px-1 rounded">{f}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Room Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Add New Room</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <input 
                type="text" placeholder="Room Name (e.g. Lab 1)" required 
                className="w-full p-2 border rounded"
                value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
              />
              <div className="grid grid-cols-2 gap-4">
                <select 
                  className="w-full p-2 border rounded"
                  value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}
                >
                  <option value="classroom">Classroom</option>
                  <option value="lab">Lab</option>
                  <option value="hall">Hall</option>
                  <option value="meeting_room">Meeting Room</option>
                </select>
                <input 
                  type="number" placeholder="Capacity" required 
                  className="w-full p-2 border rounded"
                  value={formData.capacity} onChange={e => setFormData({...formData, capacity: e.target.value})}
                />
              </div>
              <input 
                type="text" placeholder="Location (e.g. Block A)" required 
                className="w-full p-2 border rounded"
                value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})}
              />
              <input 
                type="text" placeholder="Features (comma separated: Projector, AC)" 
                className="w-full p-2 border rounded"
                value={formData.features} onChange={e => setFormData({...formData, features: e.target.value})}
              />
              
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Rooms;