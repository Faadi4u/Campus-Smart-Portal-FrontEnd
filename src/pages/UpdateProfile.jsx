import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { updateAccountDetails } from "../Api/auth";
import { Save, User, Mail, Loader2, ArrowLeft, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import gsap from "gsap";

const UpdateProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ 
    fullName: user?.fullName || "", 
    email: user?.email || "" 
  });

  const cardRef = useRef(null);
  const formRef = useRef(null);
  const bgGlowRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Entrance Animation
      gsap.from(cardRef.current, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
      });

      gsap.from(".form-element", {
        y: 10,
        opacity: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out",
        delay: 0.2
      });

      // Background glow animation
      gsap.to(bgGlowRef.current, {
        scale: 1.2,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    });
    return () => ctx.revert();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateAccountDetails(formData);
      toast.success("Profile updated! Refreshing...");
      
      // GSAP Exit animation before reload
      gsap.to(cardRef.current, {
        scale: 0.95,
        opacity: 0,
        duration: 0.5,
        onComplete: () => {
          window.location.reload();
        }
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
      setLoading(false);
    }
  };

  return (
    <div className="bg-zinc-950 h-screen">
    <div className="max-w-xl mx-auto py-10 px-4">
      {/* Back Button */}
      <button 
        onClick={() => navigate(-1)} 
        className="group flex items-center gap-2 text-zinc-500 hover:text-white mb-8 transition-colors duration-300"
      >
        <div className="p-2 rounded-full group-hover:bg-zinc-800 transition-colors">
          <ArrowLeft size={18} />
        </div>
        <span className="font-medium">Back to Profile</span>
      </button>

      <div 
        ref={cardRef}
        className="relative bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-10 shadow-2xl overflow-hidden"
      >
        {/* Decorative Background Elements */}
        <div 
          ref={bgGlowRef}
          className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-600/10 rounded-full blur-[80px] pointer-events-none"
        />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-600/5 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl text-indigo-400">
              <User size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Update Account</h1>
              <p className="text-zinc-500 text-sm mt-0.5">Manage your public information</p>
            </div>
          </div>

          <form ref={formRef} onSubmit={handleUpdate} className="space-y-6">
            <div className="form-element">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] block mb-2.5 ml-1">
                Full Name
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-500 group-focus-within:text-indigo-400 transition-colors">
                  <User size={18} />
                </div>
                <input 
                  type="text" 
                  className="w-full bg-zinc-950/50 border border-zinc-800 rounded-2xl pl-12 pr-4 py-4 text-white focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 outline-none transition-all duration-300"
                  placeholder="Enter your name"
                  value={formData.fullName} 
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})} 
                />
              </div>
            </div>

            <div className="form-element">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] block mb-2.5 ml-1">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-500 group-focus-within:text-indigo-400 transition-colors">
                  <Mail size={18} />
                </div>
                <input 
                  type="email" 
                  className="w-full bg-zinc-950/50 border border-zinc-800 rounded-2xl pl-12 pr-4 py-4 text-white focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 outline-none transition-all duration-300"
                  placeholder="name@example.com"
                  value={formData.email} 
                  onChange={(e) => setFormData({...formData, email: e.target.value})} 
                />
              </div>
            </div>

            <button 
              disabled={loading} 
              className="form-element relative w-full group overflow-hidden bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] active:scale-[0.98]"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  <Save size={20} />
                  <span>Save Changes</span>
                  <Sparkles size={16} className="absolute right-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
    </div>
  );
};

export default UpdateProfile;