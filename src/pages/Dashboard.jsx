import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getAdminDashboardStats, getUserStats } from "../Api/booking.js";
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

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        let data;
        // Fetch data based on Role
        if (user.role === "admin") {
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

    fetchStats();
  }, [user.role]);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <LayoutDashboard className="w-8 h-8 text-blue-600" />
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
      </div>
      
      {/* Welcome Card */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
        <h2 className="text-xl font-semibold text-gray-800">Hello, {user?.fullName} 👋</h2>
        <p className="text-gray-500 mt-1">
          Here is the current status of {user.role === "admin" ? "campus resources" : "your bookings"}.
        </p>
      </div>

      {/* ADMIN VIEW */}
      {user.role === "admin" && stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Total Bookings" 
            value={stats.overview?.total || 0} 
            icon={<Calendar className="text-blue-600" />} 
            bg="bg-blue-50"
          />
          <StatCard 
            title="Pending Requests" 
            value={stats.statusSummary?.pending || 0} 
            icon={<Clock className="text-orange-600" />} 
            bg="bg-orange-50"
          />
          <StatCard 
            title="Approved" 
            value={stats.statusSummary?.approved || 0} 
            icon={<CheckCircle className="text-green-600" />} 
            bg="bg-green-50"
          />
          <StatCard 
            title="Today's Activity" 
            value={stats.overview?.today || 0} 
            icon={<TrendingUp className="text-purple-600" />} 
            bg="bg-purple-50"
          />
          
          {/* Top Rooms List */}
          <div className="col-span-1 md:col-span-2 bg-white p-6 rounded-xl shadow-sm border mt-4">
            <h3 className="font-semibold text-gray-700 mb-4">Most Popular Rooms</h3>
            <div className="space-y-3">
              {stats.topRooms?.length > 0 ? (
                stats.topRooms.map((room, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <span className="font-medium text-gray-800 block">{room.roomName}</span>
                      <span className="text-xs text-gray-500">{room.location}</span>
                    </div>
                    <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                      {room.totalBookings} bookings
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-sm">No booking data available yet.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* STUDENT / FACULTY VIEW */}
      {user.role !== "admin" && stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard 
            title="My Total Bookings" 
            value={stats.total || 0} 
            icon={<Calendar className="text-blue-600" />} 
            bg="bg-blue-50"
          />
          <StatCard 
            title="Pending Approval" 
            value={stats.pending || 0} 
            icon={<Clock className="text-orange-600" />} 
            bg="bg-orange-50"
          />
          <StatCard 
            title="Confirmed" 
            value={stats.approved || 0} 
            icon={<CheckCircle className="text-green-600" />} 
            bg="bg-green-50"
          />
          <StatCard 
            title="Rejected/Cancelled" 
            value={(stats.rejected || 0) + (stats.cancelled || 0)} 
            icon={<XCircle className="text-red-600" />} 
            bg="bg-red-50"
          />
        </div>
      )}
    </div>
  );
};

// Reusable Card Component
const StatCard = ({ title, value, icon, bg }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center transition hover:shadow-md">
      <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${bg}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
      </div>
    </div>
  );
};

export default Dashboard;