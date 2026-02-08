import { useAuth } from "../context/AuthContext";
import { deleteAccount } from "../Api/auth";
import { Trash2, AlertTriangle, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const DeleteAccount = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (confirm("FINAL WARNING: This will permanently erase your account. Proceed?")) {
      try {
        await deleteAccount();
        toast.success("Account deleted.");
        logout();
        navigate("/login");
      } catch { toast.error("Error deleting account"); }
    }
  };

  return (
    <div className="bg-zinc-950 h-screen flex items-center">
    <div className="max-w-xl mx-auto py-10">
      <button 
        onClick={() => navigate(-1)} 
        className="group flex items-center gap-2 text-zinc-500 hover:text-white mb-3 transition-colors duration-300"
      >
        <div className="p-2 rounded-full group-hover:bg-zinc-800 transition-colors">
          <ArrowLeft size={18} />
        </div>
        <span className="font-medium">Back to Profile</span>
      </button>
      <div className="bg-zinc-900  rounded-3xl p-8 ">
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="p-4 bg-rose-500/10 rounded-full text-rose-500 animate-pulse">
            <AlertTriangle size={48} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Delete Account</h1>
            <p className="text-zinc-400 mt-2">This action is irreversible. All your bookings and profile data will be permanently removed.</p>
          </div>
          <button onClick={handleDelete} className="w-full bg-rose-600 hover:bg-rose-500/15 hover:text-rose-500 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 active:scale-95">
            <Trash2 size={20} /> I Understand, Delete My Account
          </button>
        </div>
      </div>
    </div>
    </div>
  );
};
export default DeleteAccount;