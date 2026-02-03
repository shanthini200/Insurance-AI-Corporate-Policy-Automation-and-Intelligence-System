import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Ensure you installed this: npm install jwt-decode
import { 
  Shield, 
  LogOut, 
  LayoutDashboard, 
  FileText, 
  CreditCard, 
  Settings,
  User 
} from "lucide-react"; // Icons

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ email: "", role: "" });

  // 1. Check for Token & Decode User Info
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      const decoded = jwtDecode(token);
      setUser({ 
        email: decoded.sub, // 'sub' is standard for email in JWT
        role: localStorage.getItem("role") || "CUSTOMER" 
      });
    } catch (error) {
      localStorage.removeItem("token");
      navigate("/login");
    }
  }, [navigate]);

  // 2. Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-gray-50">
      
      {/* =======================
          SIDEBAR (Left Panel)
         ======================= */}
      <div className="w-64 bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex flex-col shadow-xl">
        
        {/* Branding Area */}
        <div className="p-8 border-b border-white/10">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="w-8 h-8" />
            InsurAI
          </h1>
          <p className="text-xs text-blue-200 mt-1">Corporate Portal</p>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-2">
          <SidebarItem icon={<LayoutDashboard />} label="Overview" active />
          <SidebarItem icon={<FileText />} label="My Policies" />
          <SidebarItem icon={<CreditCard />} label="Payments" />
          <SidebarItem icon={<User />} label="Profile" />
          <SidebarItem icon={<Settings />} label="Settings" />
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-white/10">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium hover:bg-white/10 rounded-lg transition-colors text-red-100 hover:text-white"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </div>

      {/* =======================
          MAIN CONTENT (Right Panel)
         ======================= */}
      <div className="flex-1 overflow-y-auto">
        
        {/* Top Header */}
        <header className="bg-white shadow-sm p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
            <p className="text-gray-500 text-sm">Welcome back, {user.email}</p>
          </div>
          <div className="bg-blue-50 text-blue-700 px-4 py-1 rounded-full text-xs font-bold border border-blue-100 uppercase">
            {user.role} Account
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-8">
          
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard 
              title="Active Policies" 
              value="1" 
              icon={<Shield className="text-blue-600" />} 
            />
            <StatCard 
              title="Next Premium" 
              value="$120.00" 
              sub="Due: Feb 28, 2026"
              icon={<CreditCard className="text-indigo-600" />} 
            />
            <StatCard 
              title="Total Claims" 
              value="0" 
              icon={<FileText className="text-green-600" />} 
            />
          </div>

          {/* Recent Activity / Mock Data */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Policy Activity</h3>
            <div className="space-y-4">
              <ActivityItem 
                date="Jan 19, 2026" 
                title="Login Detected" 
                desc="Successfully logged in from new device" 
              />
              <ActivityItem 
                date="Jan 15, 2026" 
                title="Policy Renewed" 
                desc="Auto-renewal processed for Standard Plan" 
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

/* --- Helper Components for Styling --- */

function SidebarItem({ icon, label, active }) {
  return (
    <button className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium transition-all ${
      active 
        ? "bg-white text-blue-700 shadow-md" 
        : "text-blue-100 hover:bg-white/10 hover:text-white"
    }`}>
      {icon}
      {label}
    </button>
  );
}

function StatCard({ title, value, sub, icon }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start justify-between">
      <div>
        <p className="text-gray-500 text-sm font-medium">{title}</p>
        <h3 className="text-2xl font-bold text-gray-800 mt-1">{value}</h3>
        {sub && <p className="text-xs text-blue-600 mt-1 font-medium">{sub}</p>}
      </div>
      <div className="p-3 bg-gray-50 rounded-lg">
        {icon}
      </div>
    </div>
  );
}

function ActivityItem({ date, title, desc }) {
  return (
    <div className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors border-b border-gray-50 last:border-0">
      <div className="text-xs font-bold text-gray-400 w-24 pt-1">{date}</div>
      <div>
        <h4 className="text-sm font-bold text-gray-800">{title}</h4>
        <p className="text-sm text-gray-500">{desc}</p>
      </div>
    </div>
  );
}