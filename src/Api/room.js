import api from "./axios";

// 1. Get All Rooms (Public)
export const getRooms = async () => {
  const { data } = await api.get("/rooms");
  // FIX: Your rooms are in 'message'
  return data.message; 
};

// 2. Create Room (Admin)
export const createRoom = async (roomData) => {
  const { data } = await api.post("/rooms", roomData);
  // FIX: Your created room object is likely in 'message' too
  return data.message;
};

// 3. Update Room
export const updateRoom = async (id, roomData) => {
  const { data } = await api.patch(`/rooms/${id}`, roomData);
  return data.message;
};

// 4. Delete Room 
export const deleteRoom = async (id) => {
  const { data } = await api.delete(`/rooms/${id}`);
  return data.message;
};