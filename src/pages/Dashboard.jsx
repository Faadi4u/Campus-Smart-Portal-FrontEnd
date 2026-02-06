import { useEffect, useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { getAdminDashboardStats, getUserStats } from "../Api/booking";
import { useNavigate } from "react-router-dom";
import { 
  Loader2, 
  CheckCircle, 
  Clock, 
  XCircle, 
  Calendar, 
  TrendingUp, 
  LayoutDashboard
} from "lucide-react";
import toast from "react-hot-toast";
import gsap from "gsap";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        let data;
        // Fetch data based on Role
        if (user?.role === "admin") {
          data = await getAdminDashboardStats();
        } else {
          data = await getUserStats();
        }
        setStats(data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchStats();
    }
  }, [user]);

  // Animation effect
  useEffect(() => {
    if (!loading && stats) {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      
      tl.fromTo(
        ".dashboard-header",
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.6 }
      )
      .fromTo(
        ".stat-card",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 },
        "-=0.3"
      )
      .fromTo(
        ".dashboard-section",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6 },
        "-=0.2"
      );
    }
  }, [loading, stats]);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div ref={containerRef} className="space-y-8">
      <div className="dashboard-header flex items-center gap-3 mb-6">
        <div className="p-2 bg-indigo-500/10 rounded-lg">
          <LayoutDashboard className="w-8 h-8 text-indigo-500" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-zinc-400">Overview of {user?.role === "admin" ? "campus resources" : "your activity"}</p>
        </div>
      </div>
      
      {/* Welcome Card */}
      <div className="dashboard-header bg-linear-to-r from-zinc-900 to-zinc-900/50 border border-zinc-800 p-8 rounded-2xl shadow-lg relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-indigo-600/10 transition-colors duration-700"></div>
        <div className="relative z-10">
          <h2 className="text-2xl font-bold text-white mb-2">Hello, {user?.fullName} 👋</h2>
          <p className="text-zinc-400 max-w-2xl">
            Here is the current status of {user?.role === "admin" ? "campus resources" : "your bookings"}. 
            Check your recent activity and manage your schedule efficiently.
          </p>
        </div>
      </div>

      {/* ADMIN VIEW */}
      {user?.role === "admin" && stats && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
              title="Total Bookings" 
              value={stats.overview?.total || 0} 
              icon={<Calendar className="text-indigo-400" />} 
              bg="bg-indigo-400/10"
              border="border-indigo-500/20"
              onClick={() => navigate("/bookings")} 
              
            />
            <StatCard 
              title="Pending Requests" 
              value={stats.statusSummary?.pending || 0} 
              icon={<Clock className="text-orange-400" />} 
              bg="bg-orange-400/10"
              border="border-orange-500/20"
              onClick={() => navigate("/bookings")}
            />
            <StatCard 
              title="Approved" 
              value={stats.statusSummary?.approved || 0} 
              icon={<CheckCircle className="text-emerald-400" />} 
              bg="bg-emerald-400/10"
              border="border-emerald-500/20"
              onClick={() => navigate("/bookings")}
            />
            <StatCard 
              title="Today's Activity" 
              value={stats.overview?.today || 0} 
              icon={<TrendingUp className="text-violet-400" />} 
              bg="bg-violet-400/10"
              border="border-violet-500/20"
              onClick={() => navigate("/bookings")}
            />
          </div>
          
          {/* Top Rooms List */}
          <div className="dashboard-section bg-zinc-900/40 backdrop-blur-sm p-6 rounded-2xl border border-zinc-800 shadow-xl">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <TrendingUp size={20} className="text-indigo-400"/> Most Popular Rooms
            </h3>
            <div className="space-y-3">
              {stats.topRooms?.length > 0 ? (
                stats.topRooms.map((room, index) => (
                  <div key={index} className="flex justify-between items-center p-4 bg-zinc-800/30 border border-white/5 rounded-xl hover:bg-zinc-800/50 transition-colors group">
                    <div>
                      <span className="font-semibold text-zinc-200 block group-hover:text-indigo-300 transition-colors">{room.roomName}</span>
                      <span className="text-xs text-zinc-500">{room.location}</span>
                    </div>
                    <span className="text-xs font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-3 py-1.5 rounded-full">
                      {room.totalBookings} bookings
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-zinc-500 text-sm">No booking data available yet.</p>
              )}
            </div>
          </div>
        </>
      )}

      {/* STUDENT / FACULTY VIEW */}
      {user?.role !== "admin" && stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="My Total Bookings" 
            value={stats.total || 0} 
            icon={<Calendar className="text-indigo-400" />} 
            bg="bg-indigo-400/10"
            border="border-indigo-500/20"
            onClick={() => navigate("/bookings")}
          />
          <StatCard 
            title="Pending Approval" 
            value={stats.pending || 0} 
            icon={<Clock className="text-orange-400" />} 
            bg="bg-orange-400/10"
            border="border-orange-500/20"
            onClick={() => navigate("/bookings")}
          />
          <StatCard 
            title="Confirmed" 
            value={stats.approved || 0} 
            icon={<CheckCircle className="text-emerald-400" />} 
            bg="bg-emerald-400/10"
            border="border-emerald-500/20"
            onClick={() => navigate("/bookings")}
          />
          <StatCard 
            title="Rejected/Cancelled" 
            value={(stats.rejected || 0) + (stats.cancelled || 0)} 
            icon={<XCircle className="text-rose-400" />} 
            bg="bg-rose-400/10"
            border="border-rose-500/20"
            onClick={() => navigate("/bookings")}
          />
        </div>
      )}
    </div>
  );
};

// Reusable Card Component
const StatCard = ({ title, value, icon, bg, border , onClick }) => {
  return (
    
    <div onClick={onClick}
     className={`stat-card bg-zinc-900/40 backdrop-blur-sm p-6 rounded-2xl border ${border || 'border-zinc-800'} flex items-center transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-500/10 group cursor-pointer active:scale-95`}>
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mr-5 ${bg} group-hover:scale-110 transition-transform duration-300`}>
        {/* Clone element to increase size slightly if needed, or just rely on CSS scale */}
        <div className="transform scale-125">
            {icon}
        </div>
      </div>
      <div>
        <p className="text-sm font-medium text-zinc-400 mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-white tracking-tight">{value}</h3>
      </div>
    </div>
  );
};

export default Dashboard;
