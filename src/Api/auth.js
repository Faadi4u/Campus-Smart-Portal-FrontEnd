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

// 4. Update Avatar
export const updateAvatar = async (file) => {
  const formData = new FormData();
  formData.append("avatar", file);

  const { data } = await api.patch("/update-avatar", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data.message; // Returns the updated user object
};

// 5. Remove Avatar
export const removeAvatar = async () => {
  const { data } = await api.patch("/remove-avatar");
  return data.message;
};

// 6. Password reset
export const requestPasswordReset = async (email) => {
  const { data } = await api.post("/forgot-password", { email });
  return data;
};

export const resetPassword = async (token, password) => {
  const { data } = await api.post(`/reset-password/${token}`, { password });
  return data;
};