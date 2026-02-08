import api from "./axios";

// 1. Update Name/Email
export const updateAccountDetails = async (data) => {
  const response = await api.patch("/update-account", data);
  return response.data.message; // Your backend uses "message" key
};

// 2. Change Password
export const changePassword = async (data) => {
  const response = await api.patch("/change-password", data);
  return response.data;
};
 
// 3. Delete Account
export const deleteAccount = async () => {
  const { data } = await api.delete("/delete-account");
  return data;
};