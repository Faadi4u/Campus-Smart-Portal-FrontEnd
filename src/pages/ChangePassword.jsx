import { useState, useEffect, useRef } from "react";
import { changePassword } from "../Api/auth";
import { KeyRound, ShieldCheck, Loader2, ArrowLeft, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import gsap from "gsap";

const ChangePassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });
  
  const containerRef = useRef(null);
  const formRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(containerRef.current, {
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
      });
      
      gsap.from(".form-item", {
        y: 20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.out",
        delay: 0.2
      });
    });
    return () => ctx.revert();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (data.newPassword !== data.confirmPassword) return toast.error("Passwords do not match");
    
    setLoading(true);
    try {
      await changePassword({ oldPassword: data.oldPassword, newPassword: data.newPassword });
      toast.success("Password updated successfully!");
      
      gsap.to(containerRef.current, {
        scale: 0.95,
        opacity: 0,
        duration: 0.5,
        onComplete: () => navigate("/dashboard")
      });
    } catch (err) { 
      toast.error(err.response?.data?.message || "Failed to update password"); 
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div className="bg-zinc-950">
    <div className="max-w-2xl mx-auto py-10 px-4 " ref={containerRef}>
      <button 
        onClick={() => navigate(-1)} 
        className="group flex items-center gap-2 text-zinc-500 hover:text-white mb-8 transition-colors duration-300"
      >
        <div className="p-2 rounded-full group-hover:bg-zinc-800 transition-colors">
          <ArrowLeft size={18} />
        </div>
        <span className="font-medium">Back to Profile</span>
      </button>

      <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-rose-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-indigo-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500">
              <KeyRound size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">Security</h1>
              <p className="text-zinc-500 text-sm">Update your account credentials</p>
            </div>
          </div>

          <form onSubmit={handleUpdate} className="space-y-6" ref={formRef}>
            <div className="form-item space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Current Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  required 
                  className="w-full bg-zinc-800/30 border border-zinc-800 rounded-2xl pl-12 pr-4 py-4 text-white focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500/50 outline-none transition-all placeholder:text-zinc-600"
                  value={data.oldPassword} 
                  onChange={e => setData({...data, oldPassword: e.target.value})} 
                />
              </div>
            </div>

            <div className="form-item space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">New Password</label>
              <div className="relative">
                <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  required 
                  className="w-full bg-zinc-800/30 border border-zinc-800 rounded-2xl pl-12 pr-4 py-4 text-white focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50 outline-none transition-all placeholder:text-zinc-600"
                  value={data.newPassword} 
                  onChange={e => setData({...data, newPassword: e.target.value})} 
                />
              </div>
            </div>

            <div className="form-item space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Confirm New Password</label>
              <div className="relative">
                <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  required 
                  className="w-full bg-zinc-800/30 border border-zinc-800 rounded-2xl pl-12 pr-4 py-4 text-white focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50 outline-none transition-all placeholder:text-zinc-600"
                  value={data.confirmPassword} 
                  onChange={e => setData({...data, confirmPassword: e.target.value})} 
                />
              </div>
            </div>

            <div className="form-item pt-4">
              <button 
                disabled={loading} 
                className="w-full bg-zinc-100 hover:text-rose-500 hover:bg-rose-500/15  font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-3 disabled:opacity-50 group shadow-xl shadow-rose-500/5"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    <ShieldCheck size={20} className="group-hover:scale-110 group-hover:text-rose-500 transition-transform" />
                    <span>Update Credentials</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    </div>
  );
};

export default ChangePassword;
