import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { resetPassword } from "../Api/auth";
import { Lock, Loader2, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) return toast.error("Passwords do not match");
    setLoading(true);
    try {
      await resetPassword(token, password);
      toast.success("Password reset! You can now login.");
      navigate("/login");
    } catch (err) { toast.error(err.response?.data?.message || "Failed"); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 p-8 rounded-3xl shadow-2xl">
        <h1 className="text-2xl font-bold text-white mb-6">Set New Password</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="password" required placeholder="New Password" 
            className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
            value={password} onChange={e => setPassword(e.target.value)} />
          <input type="password" required placeholder="Confirm New Password" 
            className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
            value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
          <button disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all">
            {loading ? <Loader2 className="animate-spin" /> : <CheckCircle />} Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};
export default ResetPassword;