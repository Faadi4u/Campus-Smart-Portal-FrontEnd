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