import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  CalendarDays,
  DoorOpen,
  LogOut,
  User,
  Menu,
  Settings,
  ChevronDown,
  ShieldCheck,
  Trash2,
  X,
} from "lucide-react";
import gsap from "gsap";
import { useState, useRef, useEffect } from "react";

const MainLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef(null);

  // GSAP Animation for Dropdown
  useEffect(() => {
    if (isProfileOpen) {
      gsap.fromTo(
        dropdownRef.current,
        { opacity: 0, y: -10, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.2, ease: "power2.out" },
      );
    }
  }, [isProfileOpen]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Navigation Links based on Role
  const navItems = [
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: <LayoutDashboard size={20} />,
      roles: ["admin", "student", "faculty"],
    },
    {
      label: "Bookings",
      path: "/bookings",
      icon: <CalendarDays size={20} />,
      roles: ["admin", "student", "faculty"],
    },
    {
      label: "Rooms",
      path: "/rooms",
      icon: <DoorOpen size={20} />,
      roles: ["admin"], // Only Admin manages rooms
    },
  ];

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-100">
      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex flex-col w-64 bg-zinc-900 border-r border-zinc-800 shadow-xl z-10">
        <div className="flex items-center justify-center h-16 border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
          <h1 className="text-xl font-bold bg-linear-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
            Smart Campus
          </h1>
        </div>

        <nav className="flex-1 overflow-y-auto py-6">
          <ul className="space-y-1 px-3">
            {navItems.map(
              (item) =>
                item.roles.includes(user?.role) && (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 group ${
                        location.pathname === item.path
                          ? "bg-indigo-600/10 text-indigo-400 border border-indigo-600/20 shadow-sm"
                          : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-100"
                      }`}
                    >
                      <span
                        className={`mr-3 transition-transform duration-300 ${location.pathname === item.path ? "scale-110" : "group-hover:scale-110"}`}
                      >
                        {item.icon}
                      </span>
                      {item.label}
                    </Link>
                  </li>
                ),
            )}
          </ul>
        </nav>

        <div className="p-4 border-t border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-sm font-medium text-red-400 bg-red-500/10 rounded-lg hover:bg-red-500/20 transition-all hover:translate-x-1"
          >
            <LogOut size={20} className="mr-3" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden bg-zinc-950">
        {/* Top Navbar */}
        <header className="flex items-center justify-between h-16 px-6 bg-zinc-900/80 backdrop-blur-md border-b border-zinc-800 sticky top-0 z-20">
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-zinc-400 hover:text-white transition-colors"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu Dropdown */}
          {isMobileMenuOpen && (
            <div className="absolute top-16 left-0 right-0 bg-zinc-900 border-b border-zinc-800 p-4 md:hidden shadow-2xl z-50">
              <nav>
                <ul className="space-y-2">
                  {navItems.map(
                    (item) =>
                      item.roles.includes(user?.role) && (
                        <li key={item.path}>
                          <Link
                            to={item.path}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                              location.pathname === item.path
                                ? "bg-indigo-600/10 text-indigo-400 border border-indigo-600/20"
                                : "text-zinc-400 hover:bg-zinc-800"
                            }`}
                          >
                            <span className="mr-3">{item.icon}</span>
                            {item.label}
                          </Link>
                        </li>
                      ),
                  )}
                  <li className="pt-2 border-t border-zinc-800 mt-2">
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <LogOut size={20} className="mr-3" />
                      Sign Out
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          )}

          <div className="flex items-center justify-end w-full space-x-4">
            <div className="relative">
              {/* Trigger Button */}
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-3 hover:bg-zinc-800/80 p-2 rounded-xl transition-all group border border-transparent hover:border-zinc-700"
              >
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-white leading-tight">
                    {user?.fullName}
                  </p>
                  <p className="text-[10px] text-indigo-400 uppercase font-bold tracking-tighter">
                    {user?.role}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-all shadow-lg shadow-indigo-500/10">
                  <User size={20} />
                </div>
                <ChevronDown
                  size={14}
                  className={`text-zinc-500 transition-transform duration-300 ${isProfileOpen ? "rotate-180" : ""}`}
                />
              </button>

              {/* --- GSAP Animated Dropdown Menu --- */}
              {isProfileOpen && (
                <div
                  ref={dropdownRef}
                  className="absolute right-0 mt-3 w-64 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl z-50 overflow-hidden"
                >
                  {/* User Info Header */}
                  <div className="p-4 border-b border-zinc-800 bg-zinc-800/30">
                    <p className="text-xs text-zinc-500 font-bold uppercase mb-1 tracking-widest">
                      Signed in as
                    </p>
                    <p className="text-sm font-bold text-white truncate">
                      {user?.fullName}
                    </p>
                    <p className="text-xs text-zinc-400 truncate">
                      {user?.email}
                    </p>
                  </div>

                  {/* Navigation Links */}
                  <div className="p-2">
                    {/* 1. Profile Details */}
                    <Link
                      to="/profile"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 text-sm text-zinc-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-all group"
                    >
                      <User
                        size={16}
                        className="group-hover:scale-110 transition-transform"
                      />
                      Profile Details
                    </Link>

                    {/* 2. Change Name & Email */}
                    <Link
                      to="/settings/profile"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 text-sm text-zinc-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-all group"
                    >
                      <Settings
                        size={16}
                        className="group-hover:rotate-45 transition-transform"
                      />
                      Change Name & Email
                    </Link>

                    {/* 3. Change Password */}
                    <Link
                      to="/settings/password"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 text-sm text-zinc-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-all group"
                    >
                      <ShieldCheck
                        size={16}
                        className="group-hover:scale-110 transition-transform text-rose-500/70"
                      />
                      Change Password
                    </Link>
                    <Link
                      to="/settings/delete" // You can add id="danger-zone" to the div in settings
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 text-sm text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all group"
                    >
                      <Trash2
                        size={16}
                        className="group-hover:scale-110 transition-transform"
                      />
                      Delete Account
                    </Link>
                  </div>

                  {/* Action Button */}
                  <div className="p-2 border-t border-zinc-800">
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsProfileOpen(false);
                      }}
                      className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all group"
                    >
                      <LogOut
                        size={16}
                        className="group-hover:-translate-x-1 transition-transform"
                      />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 bg-zinc-950 relative">
          {/* Background Gradient Orbs */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
            <div className="absolute top-20 left-10 w-96 h-96 bg-indigo-600/5 rounded-full blur-3xl -translate-y-1/2"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-violet-600/5 rounded-full blur-3xl translate-y-1/2"></div>
          </div>
          <div className="relative z-10">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
