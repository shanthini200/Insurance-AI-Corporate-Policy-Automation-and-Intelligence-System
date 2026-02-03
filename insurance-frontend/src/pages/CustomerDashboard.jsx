import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { 
  LogOut, Calendar, User, CheckCircle, Shield, Mail, BadgeCheck, 
  FileText, Clock, XCircle, RefreshCw, ChevronRight, Activity, X, 
  LayoutDashboard, TrendingUp, AlertCircle, ArrowRight 
} from "lucide-react";

export default function CustomerDashboard() {
  const navigate = useNavigate();
  
  // Data State
  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  
  // User Info (You might want to fetch this properly)
  const [userName, setUserName] = useState("Customer"); 

  // Booking State
  const [selectedDate, setSelectedDate] = useState(null);
  
  // Tracker Modal State
  const [showTrackerModal, setShowTrackerModal] = useState(false);
  const [selectedAppForTracking, setSelectedAppForTracking] = useState(null);
  
  // ✅ DEFAULT TAB IS NOW "dashboard"
  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    fetchAgents();
    fetchMyBookings();
    fetchPolicies();
    fetchApplications();
    
    // Attempt to get name from token (optional)
    const token = localStorage.getItem("token");
    if (token) {
        try {
            // Simple decode just to get role/sub if available, or fetch user profile
            // For now, we default to "Customer"
        } catch(e){}
    }
  }, []);

  const getAuthHeader = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });

  const fetchAgents = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/customer/agents", getAuthHeader());
      setAgents(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchPolicies = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/customer/policies", getAuthHeader());
      setPolicies(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchSlots = async (agentId) => {
    try {
      const res = await axios.get(`http://localhost:8080/api/customer/agent/${agentId}/slots`, getAuthHeader());
      setAvailableSlots(res.data);
      if(res.data.length > 0) setSelectedDate(res.data[0].availableDate);
    } catch (err) { console.error(err); }
  };

  const fetchMyBookings = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/customer/my-bookings", getAuthHeader());
      setMyBookings(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchApplications = async () => { 
    try {
      const res = await axios.get("http://localhost:8080/api/customer/my-applications", getAuthHeader());
      setMyApplications(res.data);
    } catch (err) { console.error("Error fetching applications:", err); }
  };

  const handleBook = async (slotId) => {
    if(!window.confirm("Request this slot?")) return;
    try {
        await axios.post(`http://localhost:8080/api/customer/book/${slotId}`, {}, getAuthHeader());
        alert("Booking Requested!");
        fetchSlots(selectedAgent.id);
        fetchMyBookings();
    } catch (err) { alert("Booking failed"); }
  };

  const handleApplyPolicy = async (policyId) => {
      if(!window.confirm("Apply for this policy?")) return;
      try {
          await axios.post(`http://localhost:8080/api/customer/apply-policy/${policyId}`, {}, getAuthHeader());
          alert("Application Submitted!");
          fetchApplications(); 
      } catch (err) { alert("Application failed"); }
  };

  const goToBooking = (agent) => {
      setSelectedAgent(agent);
      fetchSlots(agent.id);
      setActiveTab("browse");
  };

  const openTracker = (app) => {
      setSelectedAppForTracking(app);
      setShowTrackerModal(true);
  };

  const handleLogout = () => { localStorage.clear(); navigate("/login"); };

  const getStatusBadge = (status) => {
      if (status === "CONFIRMED" || status === "APPROVED") return <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold flex items-center gap-1"><CheckCircle size={12}/> {status}</span>;
      if (status === "PROPOSED") return <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs font-bold flex items-center gap-1"><RefreshCw size={12}/> ACTION REQUIRED</span>;
      if (status === "REJECTED") return <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-bold flex items-center gap-1"><XCircle size={12}/> {status}</span>;
      return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-bold flex items-center gap-1"><Clock size={12}/> {status || "PENDING"}</span>;
  };

  const getStepStatus = (stepName, currentStatus) => {
      const statusMap = { "PENDING_AGENT": 1, "PENDING_ADMIN": 2, "APPROVED": 3, "REJECTED": -1 };
      const stepLevel = { "submitted": 0, "agent_review": 1, "admin_review": 2, "final": 3 };
      const currentLevel = statusMap[currentStatus] || 0;
      const thisStepLevel = stepLevel[stepName];
      if (currentStatus === "REJECTED") return "rejected";
      if (currentLevel > thisStepLevel) return "completed";
      if (currentLevel === thisStepLevel) return "active";
      return "pending";
  };

  const uniqueDates = [...new Set(availableSlots.map(s => s.availableDate))];

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      
      {/* SIDEBAR */}
      <div className="w-64 bg-slate-900 text-white flex flex-col p-6 shadow-2xl transition-all duration-300">
        <div className="flex items-center gap-2 mb-8 text-blue-400">
            <Shield size={28} />
            <h1 className="text-xl font-bold tracking-wider">InsurAI Portal</h1>
        </div>
        
        <nav className="space-y-2">
            <button onClick={() => setActiveTab("dashboard")} className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${activeTab === "dashboard" ? "bg-blue-600 shadow-lg text-white" : "hover:bg-white/10 text-gray-400"}`}><LayoutDashboard size={20} /> Dashboard</button>
            <button onClick={() => setActiveTab("profiles")} className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${activeTab === "profiles" ? "bg-blue-600 shadow-lg text-white" : "hover:bg-white/10 text-gray-400"}`}><BadgeCheck size={20} /> Agent Profiles</button>
            <button onClick={() => setActiveTab("browse")} className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${activeTab === "browse" ? "bg-blue-600 shadow-lg text-white" : "hover:bg-white/10 text-gray-400"}`}><Calendar size={20} /> Book Appointment</button>
            <button onClick={() => setActiveTab("bookings")} className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${activeTab === "bookings" ? "bg-blue-600 shadow-lg text-white" : "hover:bg-white/10 text-gray-400"}`}><CheckCircle size={20} /> My Bookings</button>
            <button onClick={() => setActiveTab("policies")} className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${activeTab === "policies" ? "bg-blue-600 shadow-lg text-white" : "hover:bg-white/10 text-gray-400"}`}><Shield size={20} /> Insurance Plans</button>
            <button onClick={() => setActiveTab("applications")} className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${activeTab === "applications" ? "bg-blue-600 shadow-lg text-white" : "hover:bg-white/10 text-gray-400"}`}><FileText size={20} /> Application Tracker</button>
        </nav>
        
        <button onClick={handleLogout} className="flex items-center gap-3 text-gray-400 p-3 hover:text-white mt-auto hover:bg-white/5 rounded-lg transition"><LogOut size={20} /> Logout</button>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 p-8 overflow-auto bg-gray-50">
        
        {/* ✅ NEW DASHBOARD LANDING PAGE */}
        {activeTab === "dashboard" && (
            <div className="animate-in fade-in duration-500 space-y-8">
                {/* Header Section */}
                <div className="flex justify-between items-end">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800">Welcome back, {userName}</h2>
                        <p className="text-gray-500 mt-1">Here is an overview of your insurance portfolio.</p>
                    </div>
                    <div className="text-sm text-gray-400">{new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600"><Shield size={24}/></div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Active Policies</p>
                            <h3 className="text-2xl font-bold text-gray-800">{myApplications.filter(a => a.status === 'APPROVED').length}</h3>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-orange-600"><AlertCircle size={24}/></div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Pending Requests</p>
                            <h3 className="text-2xl font-bold text-gray-800">{myApplications.filter(a => a.status.includes('PENDING')).length}</h3>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-600"><Calendar size={24}/></div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Upcoming Appointments</p>
                            <h3 className="text-2xl font-bold text-gray-800">{myBookings.filter(b => b.status === 'CONFIRMED').length}</h3>
                        </div>
                    </div>
                </div>

                {/* Quick Actions Grid */}
                <h3 className="text-xl font-bold text-gray-800 mt-8">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div onClick={() => setActiveTab("policies")} className="group cursor-pointer bg-gradient-to-br from-blue-600 to-blue-700 p-6 rounded-2xl shadow-lg text-white transition hover:scale-[1.02]">
                        <Shield className="mb-4 opacity-80" size={32}/>
                        <h4 className="text-lg font-bold">Browse Plans</h4>
                        <p className="text-blue-100 text-sm mt-1 mb-4 opacity-80">Explore comprehensive coverage options.</p>
                        <span className="text-xs font-bold bg-white/20 px-3 py-1 rounded-full flex items-center gap-1 w-fit">Explore <ArrowRight size={12}/></span>
                    </div>
                    <div onClick={() => setActiveTab("profiles")} className="group cursor-pointer bg-white p-6 rounded-2xl shadow-sm border border-gray-200 transition hover:border-blue-400 hover:shadow-md">
                        <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center mb-4"><User size={20}/></div>
                        <h4 className="text-lg font-bold text-gray-800">Find an Agent</h4>
                        <p className="text-gray-500 text-sm mt-1">Connect with experts for personalized advice.</p>
                    </div>
                    <div onClick={() => setActiveTab("applications")} className="group cursor-pointer bg-white p-6 rounded-2xl shadow-sm border border-gray-200 transition hover:border-blue-400 hover:shadow-md">
                        <div className="w-10 h-10 bg-green-50 text-green-600 rounded-lg flex items-center justify-center mb-4"><Activity size={20}/></div>
                        <h4 className="text-lg font-bold text-gray-800">Track Status</h4>
                        <p className="text-gray-500 text-sm mt-1">Monitor the progress of your applications.</p>
                    </div>
                </div>

                {/* Recent Activity Mini-Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-gray-800">Recent Applications</h3>
                        <button onClick={() => setActiveTab("applications")} className="text-blue-600 text-sm font-semibold hover:underline">View All</button>
                    </div>
                    <div className="space-y-3">
                        {myApplications.slice(0, 3).map(app => (
                            <div key={app.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                                        {app.policy.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm text-gray-800">{app.policy.name}</p>
                                        <p className="text-xs text-gray-500">{app.applicationDate}</p>
                                    </div>
                                </div>
                                {getStatusBadge(app.status)}
                            </div>
                        ))}
                        {myApplications.length === 0 && <p className="text-gray-400 text-sm text-center py-4">No recent activity.</p>}
                    </div>
                </div>
            </div>
        )}

        {/* --- EXISTING VIEWS (Profiles, Booking, etc.) --- */}
        
        {/* AGENT PROFILES */}
        {activeTab === "profiles" && (
            <div className="animate-in fade-in duration-500">
                <h2 className="text-3xl font-bold mb-8 text-gray-800">Meet Our Experts</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {agents.map((agent) => (
                        <div key={agent.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300">
                            <div className="h-24 bg-gradient-to-r from-blue-500 to-indigo-600 relative">
                                <div className="absolute -bottom-10 left-6 w-20 h-20 bg-white rounded-full p-1 shadow-md">
                                    <div className="w-full h-full bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-3xl">{agent.name.charAt(0)}</div>
                                </div>
                            </div>
                            <div className="pt-12 pb-6 px-6">
                                <h3 className="text-xl font-bold text-gray-800">{agent.name}</h3>
                                <div className="space-y-3 mt-4 text-sm text-gray-600">
                                    <div className="flex items-center gap-3"><Mail size={16} className="text-blue-500" /> {agent.email}</div>
                                </div>
                                <button onClick={() => goToBooking(agent)} className="w-full mt-6 bg-gray-900 text-white py-2.5 rounded-xl font-semibold hover:bg-blue-600 transition shadow-lg flex items-center justify-center gap-2"><Calendar size={18} /> Book Appointment</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* BOOKING */}
        {activeTab === "browse" && (
            <div className="h-full flex flex-col">
                <h2 className="text-3xl font-bold mb-6 text-gray-800">Book Appointment</h2>
                <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
                    {agents.map(agent => (
                        <div key={agent.id} onClick={() => { setSelectedAgent(agent); fetchSlots(agent.id); }} className={`min-w-[200px] p-4 rounded-xl border cursor-pointer transition ${selectedAgent?.id === agent.id ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200 shadow-md" : "bg-white hover:shadow-md"}`}>
                            <div className="flex items-center gap-3"><div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">{agent.name.charAt(0)}</div><h3 className="font-bold text-gray-800">{agent.name}</h3></div>
                        </div>
                    ))}
                </div>
                {selectedAgent ? (
                    <div className="flex-1 bg-white rounded-2xl shadow-lg border border-gray-100 flex overflow-hidden">
                        <div className="w-1/4 bg-gray-50 border-r p-4 overflow-y-auto">
                            <h3 className="text-xs font-bold text-gray-400 uppercase mb-4 px-2">Select Date</h3>
                            <div className="space-y-2">
                                {uniqueDates.length > 0 ? uniqueDates.map(date => (
                                    <button key={date} onClick={() => setSelectedDate(date)} className={`w-full text-left px-4 py-3 rounded-xl flex items-center justify-between transition-all ${selectedDate === date ? "bg-white shadow-md text-blue-600 font-bold border-l-4 border-blue-600" : "text-gray-600 hover:bg-gray-200"}`}><span>{date}</span>{selectedDate === date && <ChevronRight size={16}/>}</button>
                                )) : <p className="text-gray-400 text-sm px-2">No dates available.</p>}
                            </div>
                        </div>
                        <div className="w-3/4 p-8 overflow-y-auto">
                            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2"><Clock size={20} className="text-blue-600"/> Available Times for {selectedDate}</h3>
                            <div className="grid grid-cols-3 gap-4">
                                {availableSlots.filter(s => s.availableDate === selectedDate).length > 0 ? (
                                    availableSlots.filter(s => s.availableDate === selectedDate).sort((a,b) => a.startTime.localeCompare(b.startTime)).map(slot => (
                                        <button key={slot.id} onClick={() => handleBook(slot.id)} className="border border-gray-200 p-4 rounded-xl hover:border-blue-500 hover:bg-blue-50 hover:shadow-md transition-all group text-center"><p className="font-bold text-lg text-gray-800 group-hover:text-blue-700">{slot.startTime}</p><p className="text-xs text-gray-400">to {slot.endTime}</p><span className="text-xs text-blue-500 font-semibold mt-2 block">Request</span></button>
                                    ))
                                ) : <div className="col-span-3 text-center py-20 text-gray-400"><Calendar size={48} className="mx-auto mb-4 opacity-20"/><p>Select a date to view slots.</p></div>}
                            </div>
                        </div>
                    </div>
                ) : <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-white rounded-2xl border border-dashed border-gray-300 m-4"><User size={48} className="mb-4 opacity-20"/><p>Select an agent to view their schedule.</p></div>}
            </div>
        )}

        {/* MY BOOKINGS */}
        {activeTab === "bookings" && (
            <div>
                <h2 className="text-3xl font-bold mb-6 text-gray-800">My Appointments</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {myBookings.map(booking => (
                        <div key={booking.id} className={`bg-white p-6 rounded-xl shadow-sm border-l-4 ${booking.status === 'PROPOSED' ? 'border-orange-500' : 'border-blue-500'}`}>
                            <div className="flex justify-between items-start">
                                <div><h3 className="font-bold text-lg mb-1">{booking.agent.name}</h3><div className="flex items-center gap-2 text-sm text-gray-500 mb-2"><Calendar size={14}/> {booking.availableDate} • {booking.startTime}</div></div>
                                {getStatusBadge(booking.status)}
                            </div>
                            {booking.status === "PROPOSED" && (
                                <div className="mt-4 flex gap-3">
                                    <button onClick={async () => { try { await axios.put(`http://localhost:8080/api/customer/respond-reschedule/${booking.id}?action=ACCEPT`, {}, getAuthHeader()); alert("New time accepted!"); fetchMyBookings(); } catch(e) { alert("Error"); } }} className="flex-1 bg-green-600 text-white py-2 rounded text-sm font-semibold hover:bg-green-700">Accept New Time</button>
                                    <button onClick={async () => { if(!window.confirm("Reject reschedule?")) return; try { await axios.put(`http://localhost:8080/api/customer/respond-reschedule/${booking.id}?action=REJECT`, {}, getAuthHeader()); alert("Reschedule rejected."); fetchMyBookings(); } catch(e) { alert("Error"); } }} className="flex-1 bg-gray-200 text-gray-700 py-2 rounded text-sm font-semibold hover:bg-gray-300">Reject</button>
                                </div>
                            )}
                        </div>
                    ))}
                    {myBookings.length === 0 && <p className="text-gray-500">No bookings found.</p>}
                </div>
            </div>
        )}

        {/* POLICIES */}
        {activeTab === "policies" && (
            <div>
                <h2 className="text-3xl font-bold mb-6 text-gray-800">Insurance Plans</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {policies.map(policy => (
                        <div key={policy.id} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-xl transition border border-gray-100 group">
                            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 mb-4"><Shield size={24} /></div>
                            <h3 className="text-xl font-bold text-gray-900">{policy.name}</h3>
                            <p className="text-xs font-bold text-blue-600 uppercase mb-2">{policy.type}</p>
                            <p className="text-gray-500 text-sm mb-4 line-clamp-3">{policy.description}</p>
                            <div className="flex justify-between items-center border-t pt-4 mb-4"><p className="font-bold text-gray-900">${policy.premiumAmount}<span className="text-xs font-normal text-gray-400">/mo</span></p><p className="font-bold text-green-600">${policy.coverageAmount}</p></div>
                            <button onClick={() => handleApplyPolicy(policy.id)} className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition">Apply Now</button>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* APPLICATION TRACKER */}
        {activeTab === "applications" && (
            <div>
                <h2 className="text-3xl font-bold mb-6 text-gray-800">Application Tracker</h2>
                <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                            <tr>
                                <th className="px-6 py-4">Policy Name</th>
                                <th className="px-6 py-4">Type</th>
                                <th className="px-6 py-4">Applied Date</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {myApplications.map(app => (
                                <tr key={app.id} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4 font-bold text-gray-800">{app.policy.name}</td>
                                    <td className="px-6 py-4 text-sm text-blue-600 font-semibold">{app.policy.type}</td>
                                    <td className="px-6 py-4 text-gray-500 text-sm">{app.applicationDate}</td>
                                    <td className="px-6 py-4">{getStatusBadge(app.status)}</td>
                                    <td className="px-6 py-4">
                                        <button onClick={() => openTracker(app)} className="text-blue-600 hover:text-blue-800 text-sm font-bold flex items-center gap-1"><Activity size={16}/> Track Status</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {myApplications.length === 0 && <p className="p-6 text-gray-500 text-center">No applications found.</p>}
                </div>
            </div>
        )}

        {/* TIMELINE MODAL */}
        {showTrackerModal && selectedAppForTracking && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
                <div className="bg-[#1e293b] w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-gray-700 text-white">
                    <div className="p-6 border-b border-gray-700 flex justify-between items-start bg-[#0f172a]">
                        <div><p className="text-xs text-blue-400 font-bold uppercase tracking-wider mb-1">Tracking ID: #{selectedAppForTracking.id}88X</p><h3 className="text-xl font-bold">{selectedAppForTracking.policy.name}</h3></div>
                        <button onClick={() => setShowTrackerModal(false)} className="text-gray-400 hover:text-white transition"><X size={24}/></button>
                    </div>
                    <div className="p-8 space-y-8 relative">
                        <div className="absolute left-[47px] top-10 bottom-10 w-0.5 bg-gray-700"></div>
                        <div className="flex gap-4 relative z-10"><div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${getStepStatus("submitted", selectedAppForTracking.status) === "completed" || getStepStatus("submitted", selectedAppForTracking.status) === "active" ? "bg-blue-600 border-blue-600 text-white" : "bg-gray-800 border-gray-600"}`}><CheckCircle size={16} /></div><div><h4 className="font-bold text-sm">Application Submitted</h4><p className="text-xs text-gray-400 mt-1">Your application has been received.</p></div></div>
                        <div className="flex gap-4 relative z-10"><div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${getStepStatus("agent_review", selectedAppForTracking.status) === "completed" ? "bg-blue-600 border-blue-600" : getStepStatus("agent_review", selectedAppForTracking.status) === "active" ? "bg-blue-600 border-blue-600 animate-pulse" : "bg-gray-800 border-gray-600"}`}>{getStepStatus("agent_review", selectedAppForTracking.status) === "completed" ? <CheckCircle size={16}/> : <span className="text-xs font-bold">2</span>}</div><div><h4 className={`font-bold text-sm ${getStepStatus("agent_review", selectedAppForTracking.status) === "active" ? "text-blue-400" : ""}`}>Under Review</h4><p className="text-xs text-gray-400 mt-1">Our team is reviewing your details.</p></div></div>
                        <div className="flex gap-4 relative z-10"><div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${getStepStatus("admin_review", selectedAppForTracking.status) === "completed" ? "bg-blue-600 border-blue-600" : getStepStatus("admin_review", selectedAppForTracking.status) === "active" ? "bg-blue-600 border-blue-600 animate-pulse" : "bg-gray-800 border-gray-600"}`}>{getStepStatus("admin_review", selectedAppForTracking.status) === "completed" ? <CheckCircle size={16}/> : <span className="text-xs font-bold">3</span>}</div><div><h4 className={`font-bold text-sm ${getStepStatus("admin_review", selectedAppForTracking.status) === "active" ? "text-blue-400" : ""}`}>Approved by Agent</h4><p className="text-xs text-gray-400 mt-1">Agent has verified and approved your request.</p></div></div>
                        <div className="flex gap-4 relative z-10"><div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${getStepStatus("final", selectedAppForTracking.status) === "completed" ? "bg-green-500 border-green-500" : "bg-gray-800 border-gray-600"}`}>{getStepStatus("final", selectedAppForTracking.status) === "completed" ? <BadgeCheck size={16} className="text-white"/> : <span className="text-xs font-bold">4</span>}</div><div><h4 className={`font-bold text-sm ${getStepStatus("final", selectedAppForTracking.status) === "completed" ? "text-green-400" : ""}`}>Approved by Authority Admin</h4><p className="text-xs text-gray-400 mt-1">Final administrative seal and policy issuance.</p></div></div>
                    </div>
                    <div className="p-4 bg-[#0f172a] border-t border-gray-700 text-center"><p className="text-xs text-gray-500">Need help? Contact support@insurai.com</p></div>
                </div>
            </div>
        )}

      </div>
    </div>
  );
}