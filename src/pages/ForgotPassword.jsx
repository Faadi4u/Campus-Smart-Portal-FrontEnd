import { useState } from "react";
import { requestPasswordReset } from "../Api/auth";
import { Mail, ArrowLeft, Loader2, Send } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await requestPasswordReset(email);
      toast.success("Reset link sent! Check your email.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 p-8 rounded-3xl shadow-2xl">
        <Link to="/login" className="flex items-center gap-2 text-zinc-500 hover:text-white mb-6 text-sm transition-colors">
          <ArrowLeft size={16} /> Back to Login
        </Link>
        <h1 className="text-2xl font-bold text-white mb-2">Forgot Password?</h1>
        <p className="text-zinc-400 text-sm mb-8">Enter your email and we'll send you a link to reset your password.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
            <input type="email" required placeholder="name@campus.com" className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl pl-12 pr-4 py-3 text-white outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
              value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <button disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50">
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />} Send Reset Link
          </button>
        </form>
      </div>
    </div>
  );
};
export default ForgotPassword;