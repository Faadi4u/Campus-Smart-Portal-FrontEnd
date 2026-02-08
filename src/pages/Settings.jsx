import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { updateAccountDetails, changePassword , deleteAccount } from "../Api/auth";
import {
  Save,
  ShieldCheck,
  Lock,
  User,
  Mail,
  Loader2,
  KeyRound,
  Trash2,
  AlertTriangle
} from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const { user } = useAuth();
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPass, setLoadingPass] = useState(false);
  const { logout } = useAuth(); // Make sure logout is available from useAuth
  const navigate = useNavigate();
  // Profile State
  const [profileData, setProfileData] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
  });

  // Password State
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Delete State
  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "WARNING: This will permanently delete your account and all your data. This action cannot be undone. Are you sure?",
    );

    if (confirmed) {
      try {
        await deleteAccount();
        toast.success("Account deleted. We're sad to see you go.");
        logout(); // Log the user out locally
        navigate("/login"); // Send to login page
      } catch {
        toast.error("Failed to delete account");
      }
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoadingProfile(true);
    try {
      await updateAccountDetails(profileData);
      toast.success("Profile updated! Reloading...");
      window.location.reload(); // Refresh to update global user state
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setLoadingProfile(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      return toast.error("New passwords do not match!");
    }
    setLoadingPass(true);
    try {
      await changePassword({
        oldPassword: passwords.oldPassword,
        newPassword: passwords.newPassword,
      });
      toast.success("Password changed successfully!");
      setPasswords({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Password change failed");
    } finally {
      setLoadingPass(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="text-zinc-500 mt-1">
          Manage your account preferences and security.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Personal Information */}
        <section
          id="personal-info"
          className="bg-zinc-900 border border-zinc-800 ..."
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
              <User size={20} />
            </div>
            <h2 className="text-xl font-bold text-white">Personal Info</h2>
          </div>

          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-2">
                Full Name
              </label>
              <input
                type="text"
                className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all"
                value={profileData.fullName}
                onChange={(e) =>
                  setProfileData({ ...profileData, fullName: e.target.value })
                }
              />
            </div>
            <div>
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-2">
                Email Address
              </label>
              <input
                type="email"
                className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all"
                value={profileData.email}
                onChange={(e) =>
                  setProfileData({ ...profileData, email: e.target.value })
                }
              />
            </div>
            <button
              disabled={loadingProfile}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              {loadingProfile ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <Save size={18} />
              )}
              Save Changes
            </button>
          </form>
        </section>

        {/* Security / Password */}
        <section
          id="security"
          className="bg-zinc-900 border border-zinc-800 ..."
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-rose-500/10 rounded-lg text-rose-400">
              <ShieldCheck size={20} />
            </div>
            <h2 className="text-xl font-bold text-white">Security</h2>
          </div>

          <form onSubmit={handlePasswordUpdate} className="space-y-4">
            <input
              type="password"
              placeholder="Current Password"
              className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-rose-500/50 outline-none transition-all"
              value={passwords.oldPassword}
              onChange={(e) =>
                setPasswords({ ...passwords, oldPassword: e.target.value })
              }
            />
            <input
              type="password"
              placeholder="New Password"
              className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-rose-500/50 outline-none transition-all"
              value={passwords.newPassword}
              onChange={(e) =>
                setPasswords({ ...passwords, newPassword: e.target.value })
              }
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-rose-500/50 outline-none transition-all"
              value={passwords.confirmPassword}
              onChange={(e) =>
                setPasswords({ ...passwords, confirmPassword: e.target.value })
              }
            />
            <button
              disabled={loadingPass}
              className="w-full bg-rose-600 hover:bg-rose-500 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              {loadingPass ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <KeyRound size={18} />
              )}
              Update Password
            </button>
          </form>
        </section>
      </div>

      {/* Delete Account  */}
      <div className="mt-12 pt-8 border-t border-zinc-800">
        <div className="bg-rose-500/5 border border-rose-500/20 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="p-3 bg-rose-500/10 rounded-xl text-rose-500">
              <AlertTriangle size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Danger Zone</h3>
              <p className="text-sm text-zinc-400">
                Permanently delete your account and all associated data.
              </p>
            </div>
          </div>
          <button
            onClick={handleDeleteAccount}
            className="px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-rose-900/20 active:scale-95"
          >
            <Trash2 size={18} />
            Delete My Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
