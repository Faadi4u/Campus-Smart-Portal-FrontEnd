import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { UserPlus, Mail, Lock, User, Loader2, ArrowRight } from "lucide-react";
import gsap from "gsap";

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "student" // Default role
  });
  const [loading, setLoading] = useState(false);

  const { registerUser } = useAuth();
  const navigate = useNavigate();

  // Refs for animation
  const containerRef = useRef(null);
  const formRef = useRef(null);
  const titleRef = useRef(null);
  
  // Input refs
  const inputNameRef = useRef(null);
  const inputEmailRef = useRef(null);
  const inputPassRef = useRef(null);
  const inputRoleRef = useRef(null);
  
  const buttonRef = useRef(null);
  const footerRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.fromTo(
      containerRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8 }
    )
      .fromTo(
        titleRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6 },
        "-=0.4"
      )
      .fromTo(
        [inputNameRef.current, inputEmailRef.current, inputPassRef.current, inputRoleRef.current],
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.5, stagger: 0.1 },
        "-=0.2"
      )
      .fromTo(
        buttonRef.current,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.4 },
        "-=0.1"
      )
      .fromTo(
        footerRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.6 },
        "-=0.2"
      );
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const success = await registerUser(formData);
    
    if (success) {
      // Animate out before navigating
      gsap.to(containerRef.current, {
        opacity: 0,
        y: -20,
        duration: 0.5,
        onComplete: () => {
          navigate("/login");
        },
      });
    } else {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-4 selection:bg-indigo-500/30">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl translate-y-1/2"></div>
      </div>

      <div
        ref={containerRef}
        className="relative w-full max-w-md bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-2xl shadow-2xl p-8 sm:p-10"
      >
        {/* Header */}
        <div ref={titleRef} className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-linear-to-tr from-indigo-600 to-violet-600 shadow-lg shadow-indigo-500/20 mb-6 group transition-transform duration-500 hover:scale-110">
            <UserPlus className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white mb-2">
            Create Account
          </h2>
          <p className="text-zinc-400 text-sm">
            Join the Smart Campus Portal
          </p>
        </div>

        {/* Form */}
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
          
          {/* Full Name */}
          <div ref={inputNameRef} className="space-y-2">
            <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider ml-1">
              Full Name
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-zinc-500 group-focus-within:text-indigo-400 transition-colors duration-300" />
              </div>
              <input
                type="text"
                required
                className="block w-full pl-11 pr-4 py-3 bg-zinc-800/50 border border-zinc-700/50 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-300 hover:bg-zinc-800"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              />
            </div>
          </div>

          {/* Email */}
          <div ref={inputEmailRef} className="space-y-2">
            <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider ml-1">
              Email Address
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-zinc-500 group-focus-within:text-indigo-400 transition-colors duration-300" />
              </div>
              <input
                type="email"
                required
                className="block w-full pl-11 pr-4 py-3 bg-zinc-800/50 border border-zinc-700/50 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-300 hover:bg-zinc-800"
                placeholder="student@campus.edu"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          {/* Password */}
          <div ref={inputPassRef} className="space-y-2">
            <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider ml-1">
              Password
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-zinc-500 group-focus-within:text-indigo-400 transition-colors duration-300" />
              </div>
              <input
                type="password"
                required
                minLength="6"
                className="block w-full pl-11 pr-4 py-3 bg-zinc-800/50 border border-zinc-700/50 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-300 hover:bg-zinc-800"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>

          {/* Role Selection */}
          <div ref={inputRoleRef} className="space-y-2">
            <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider ml-1">
              I am a...
            </label>
            <div className="relative">
                <select
                className="block w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700/50 rounded-xl text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-300 hover:bg-zinc-800 appearance-none"
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
                >
                <option value="student" className="bg-zinc-900">Student</option>
                <option value="faculty" className="bg-zinc-900">Faculty Member</option>
                <option value="admin" className="bg-zinc-900">Administrator (Demo)</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-zinc-500">
                    <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            ref={buttonRef}
            type="submit"
            disabled={loading}
            className="w-full relative overflow-hidden group flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-indigo-900/20 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900 focus:ring-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] mt-4"
          >
            <span className="relative z-10 flex items-center gap-2">
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Sign Up</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </span>
            {/* Button linear Shine Effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-linear-to-r from-transparent via-white/10 to-transparent z-0" />
          </button>
        </form>

        {/* Footer Link */}
        <div ref={footerRef} className="mt-8 text-center">
          <p className="text-sm text-zinc-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-indigo-400 hover:text-indigo-300 hover:underline decoration-indigo-400/30 underline-offset-4 transition-colors"
            >
              Log in
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Register;
