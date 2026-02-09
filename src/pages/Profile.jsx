import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { User, Mail, Shield, Calendar, Award, MapPin, Edit3, Camera, Loader2, Eye, Trash2, X, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { updateAvatar, removeAvatar } from "../Api/auth";
import toast from "react-hot-toast";
import gsap from "gsap";

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const cardRef = useRef(null);
  const itemsRef = useRef([]);
  const [uploading, setUploading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(cardRef.current, {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "power4.out"
      });

      gsap.from(itemsRef.current, {
        x: -20,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: "power3.out",
        delay: 0.4
      });

      gsap.to(".glow-element", {
        scale: 1.2,
        opacity: 0.6,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 1
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleMouseLeave = () => {
    gsap.to(cardRef.current, {
      rotateY: 0,
      rotateX: 0,
      duration: 0.5,
      ease: "power2.out"
    });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      await updateAvatar(file);
      toast.success("Avatar updated! Reloading...");
      setTimeout(() => window.location.reload(), 1000);
    } catch {
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = async (e) => {
    e.stopPropagation();
    if (!confirm("Remove profile picture?")) return;
    setUploading(true);
    try {
      await removeAvatar();
      toast.success("Avatar removed");
      window.location.reload();
    } catch {
      toast.error("Failed to remove");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div ref={containerRef} className="min-h-[90vh] flex flex-col items-center justify-center bg-zinc-950 p-4">
      <div className="absolute inset-0 bg-zinc-950 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] glow-element"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] glow-element"></div>
      </div>

      <div className="w-full max-w-5xl max-h-5xl relative z-10">
        <div className="flex items-center justify-between mb-8 px-2">
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <Award className="text-indigo-500" /> Account Overview
          </h1>
          <button  
            onClick={() => navigate("/settings/profile")}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl transition-all border border-zinc-700/50 text-sm"
          >
            <Edit3 size={16} /> Edit Profile
          </button>
        </div>
        
        <div 
          ref={cardRef}
          onMouseLeave={handleMouseLeave}
          style={{ transformStyle: "preserve-3d" }}
          className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-10 shadow-2xl relative group overflow-hidden"
        >
          <div className="absolute inset-0 bg-linear-to-br from-indigo-500/10 via-transparent to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

          <div className="flex flex-col lg:flex-row gap-12 items-center relative z-10">
            
            {/* ---  AVATAR SECTION --- */}
            <div className="relative group/avatar" style={{ transform: "translateZ(50px)" }}>
              <div className="w-48 h-48 rounded-[3rem] bg-linear-to-br from-indigo-600 to-purple-700 p-1 relative">
                <div className="w-full h-full rounded-[2.8rem] bg-zinc-900 flex items-center justify-center overflow-hidden relative">
                  {user?.avatar ? (
                    <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User size={96} className="text-indigo-400 opacity-50" />
                  )}
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/avatar:opacity-100 transition-all duration-300 flex items-center justify-center gap-3">
                    {uploading ? (
                      <Loader2 className="w-8 h-8 text-white animate-spin" />
                    ) : (
                      <>
                        {user?.avatar && (
                          <button 
                            onClick={(e) => { e.preventDefault(); setPreviewOpen(true); }}
                            className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                          >
                            <Eye size={20} />
                          </button>
                        )}
                        <label htmlFor="avatar-upload" className="cursor-pointer p-2 bg-indigo-600 hover:bg-indigo-500 rounded-full text-white transition-colors">
                          <Camera size={20} />
                        </label>
                        {user?.avatar && (
                          <button 
                            onClick={handleRemoveImage}
                            className="p-2 bg-rose-600/80 hover:bg-rose-600 rounded-full text-white transition-colors"
                          >
                            <Trash2 size={20} />
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
              <input id="avatar-upload" type="file" className="hidden" accept="image/*" onChange={handleImageChange} disabled={uploading} />
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 flex-1 w-full" style={{ transform: "translateZ(30px)" }}>
              <div ref={el => itemsRef.current[0] = el}>
                <InfoItem icon={<User size={20}/>} label="Full Name" value={user?.fullName} />
              </div>
              <div ref={el => itemsRef.current[1] = el}>
                <InfoItem icon={<Mail size={20}/>} label="Email Address" value={user?.email} />
              </div>
              <div ref={el => itemsRef.current[2] = el}>
                <InfoItem icon={<Shield size={20}/>} label="User Privilege" value={user?.role} isBadge />
              </div>
              <div ref={el => itemsRef.current[3] = el}>
                <InfoItem icon={<Calendar size={20}/>} label="Account Created" value={new Date(user?.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })} />
              </div>
              <div ref={el => itemsRef.current[4] = el}>
                <InfoItem icon={<MapPin size={20}/>} label="Campus Location" value="Dha Phase 5" />
              </div>
              <div ref={el => itemsRef.current[5] = el}>
                <InfoItem icon={<Phone size={20}/>} label="Phone Number" value={user?.phoneNumber} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Preview Modal */}
      {previewOpen && user?.avatar && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setPreviewOpen(false)}
        >
          <button onClick={() => setPreviewOpen(false)} className="absolute top-6 right-6 text-zinc-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors">
            <X size={32} />
          </button>
          <img 
            src={user.avatar} 
            alt="Full Profile" 
            className="max-w-full max-h-[90vh] rounded-2xl shadow-2xl scale-95 animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

const InfoItem = ({ icon, label, value, isBadge }) => (
  <div className="space-y-2 group/item">
    <div className="flex items-center gap-2 text-zinc-500 transition-colors group-hover/item:text-indigo-400">
      {icon} <span className="text-[11px] font-black uppercase tracking-[0.2em]">{label}</span>
    </div>
    {isBadge ? (
      <div className="flex">
        <p className="text-xs font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-4 py-1.5 rounded-full inline-block capitalize tracking-wide">
          {value}
        </p>
      </div>
    ) : (
      <p className="text-xl font-bold text-zinc-100 group-hover/item:text-white transition-colors">{value || "Not Provided"}</p>
    )}
  </div>
);

export default Profile;