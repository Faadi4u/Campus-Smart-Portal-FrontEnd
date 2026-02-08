import { useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { User, Mail, Shield, Calendar, Award, MapPin, Edit3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const cardRef = useRef(null);
  const itemsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Entrance animation
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

      // Floating background glow
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

  return (
    <div ref={containerRef} className="min-h-[80vh] flex flex-col items-center justify-center bg-zinc-950 p-4">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 bg-zinc-950 overflow-hidden pointer-events-none">
        <div className=" absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px]"></div>
        <div className=" absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="w-full max-w-4xl relative z-10">
        <div className="flex items-center justify-between mb-8 px-2">
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <Award className="text-indigo-500" /> Account Overview
          </h1>
          <button  
          onClick={() => navigate("/settings/profile")}
          className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl transition-all border border-zinc-700/50 text-sm">
            <Edit3 size={16} /> Edit Profile
          </button>
        </div>
        
        <div 
          ref={cardRef}
          
          onMouseLeave={handleMouseLeave}
          style={{ transformStyle: "preserve-3d" }}
          className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-10 shadow-2xl relative group overflow-hidden"
        >
          {/* Animated border gradient */}
          <div className="absolute inset-0 bg-linear-to-br from-indigo-500/10 via-transparent to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

          <div className="flex flex-col lg:flex-row gap-12 items-center relative z-10">
            {/* Avatar Section */}
            <div className="relative" style={{ transform: "translateZ(50px)" }}>
              <div className="w-48 h-48 rounded-[3rem] bg-linear-to-br from-indigo-600 to-purple-700 p-1">
                <div className="w-full h-full rounded-[2.8rem] bg-zinc-900 flex items-center justify-center overflow-hidden">
                  <User size={96} className="text-indigo-400 opacity-50" />
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-zinc-900 border border-zinc-700 p-3 rounded-2xl shadow-xl text-indigo-400">
                <Shield size={24} />
              </div>
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
            </div>
          </div>
        </div>
      </div>
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
        <p className="text-xs font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-4 py-1.5 rounded-full inline-block capitalize tracking-wide shadow-[0_0_20px_rgba(99,102,241,0.1)]">
          {value}
        </p>
      </div>
    ) : (
      <p className="text-xl font-bold text-zinc-100 group-hover/item:text-white transition-colors">{value || "Not Provided"}</p>
    )}
  </div>
);

export default Profile;