import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { 
  LogOut, Plus, Trash2, Calendar, Clock, User, CheckCircle, FileText, 
  CheckSquare, Mail, RefreshCw, XCircle, ChevronRight, LayoutDashboard, 
  Briefcase, AlertCircle, ArrowRight, TrendingUp 
} from "lucide-react";

export default function AgentDashboard() {
  const navigate = useNavigate();
  const [slots, setSlots] = useState([]);
  const [pendingPolicies, setPendingPolicies] = useState([]);
  
  // ✅ DEFAULT TAB IS NOW "dashboard"
  const [activeTab, setActiveTab] = useState("dashboard");

  // Reschedule Modal State
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [selectedOldSlot, setSelectedOldSlot] = useState(null);
  const [selectedDateForReschedule, setSelectedDateForReschedule] = useState("");

  // Form State
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const getAuthHeader = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });

  useEffect(() => {
    fetchAvailability();
    fetchPendingPolicies();
  }, []);

  const fetchAvailability = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/agent/availability", getAuthHeader());
      setSlots(res.data);
    } catch (err) { if (err.response?.status === 403) navigate("/login"); }
  };

  const fetchPendingPolicies = async () => {
      try {
          const res = await axios.get("http://localhost:8080/api/agent/pending-policies", getAuthHeader());
          setPendingPolicies(res.data);
      } catch (err) { console.error(err); }
  };

  const handleConfirmBooking = async (slotId) => {
      if(!window.confirm("Confirm this booking? Email will be sent to customer.")) return;
      try {
          await axios.put(`http://localhost:8080/api/agent/confirm-booking/${slotId}`, {}, getAuthHeader());
          alert("Booking Confirmed ✅");
          fetchAvailability();
      } catch (err) { alert("Error confirming booking"); }
  };

  // Open Modal & Set Default Date
  const openRescheduleModal = (slot) => {
    setSelectedOldSlot(slot);
    const available = slots.filter(s => !s.booked);
    if(available.length > 0) {
        setSelectedDateForReschedule(available[0].availableDate);
    }
    setShowRescheduleModal(true);
  };

  const submitReschedule = async (newSlotId) => {
    if(!window.confirm("Propose this new time to the customer?")) return;
    try {
      await axios.post("http://localhost:8080/api/agent/reschedule-booking", {
        oldSlotId: selectedOldSlot.id,
        newSlotId: newSlotId
      }, getAuthHeader());
      
      alert("Proposal sent to customer!");
      setShowRescheduleModal(false);
      fetchAvailability();
    } catch (err) {
      alert("Error rescheduling: " + (err.response?.data || "Server Error"));
    }
  };

  const handleApprovePolicy = async (appId) => {
      if(!window.confirm("Approve this policy application?")) return;
      try {
          await axios.put(`http://localhost:8080/api/agent/approve-policy/${appId}`, {}, getAuthHeader());
          alert("Policy Approved (Level 1) ✅");
          fetchPendingPolicies();
      } catch (err) { alert("Error approving policy"); }
  };

  const handleAddSlot = async () => {
    if (!date || !startTime || !endTime) return alert("Please fill all fields");
    try {
      await axios.post("http://localhost:8080/api/agent/availability", { availableDate: date, startTime, endTime }, getAuthHeader());
      alert("Slot Added Successfully");
      fetchAvailability();
      setDate(""); setStartTime(""); setEndTime("");
    } catch (err) { alert("Error: " + (err.response?.data || "Failed")); }
  };

  const handleDeleteSlot = async (id) => {
    if (!window.confirm("Delete this slot?")) return;
    try {
      await axios.delete(`http://localhost:8080/api/agent/availability/${id}`, getAuthHeader());
      fetchAvailability();
    } catch (err) { alert("Failed to delete slot"); }
  };

  const handleLogout = () => { localStorage.clear(); navigate("/login"); };

  // --- DATA HELPERS ---
  const bookedSlots = slots.filter((slot) => slot.booked); 
  const availableSlots = slots.filter((slot) => !slot.booked);
  const uniqueDates = [...new Set(availableSlots.map(s => s.availableDate))];

  // Helper for "Today's Schedule"
  const getTodayDate = () => new Date().toISOString().split('T')[0];
  const todaysAppointments = bookedSlots.filter(s => s.availableDate === getTodayDate() && s.status === 'CONFIRMED');

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      
      {/* SIDEBAR */}
      <div className="w-64 bg-indigo-900 text-white flex flex-col p-6 shadow-xl transition-all duration-300">
        <div className="flex items-center gap-2 mb-8 text-indigo-300">
            <Briefcase size={28} />
            <h1 className="text-xl font-bold tracking-wider">Agent Portal</h1>
        </div>

        <nav className="space-y-2">
            <button onClick={() => setActiveTab("dashboard")} className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${activeTab === "dashboard" ? "bg-indigo-600 shadow-lg text-white" : "hover:bg-white/10 text-indigo-200"}`}><LayoutDashboard size={20} /> Dashboard</button>
            <button onClick={() => setActiveTab("appointments")} className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${activeTab === "appointments" ? "bg-indigo-600 shadow-lg text-white" : "hover:bg-white/10 text-indigo-200"}`}><User size={20} /> Requests & Bookings</button>
            <button onClick={() => setActiveTab("approvals")} className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${activeTab === "approvals" ? "bg-indigo-600 shadow-lg text-white" : "hover:bg-white/10 text-indigo-200"}`}><CheckSquare size={20} /> Policy Approvals</button>
            <button onClick={() => setActiveTab("manage")} className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${activeTab === "manage" ? "bg-indigo-600 shadow-lg text-white" : "hover:bg-white/10 text-indigo-200"}`}><Calendar size={20} /> My Availability</button>
        </nav>

        <button onClick={handleLogout} className="mt-auto flex items-center gap-3 text-indigo-300 p-3 hover:text-white transition"><LogOut size={20} /> Logout</button>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 p-8 overflow-auto bg-gray-50">
        
        {/* ✅ NEW DASHBOARD LANDING PAGE */}
        {activeTab === "dashboard" && (
            <div className="animate-in fade-in duration-500 space-y-8">
                
                {/* Header */}
                <div className="flex justify-between items-end">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800">Agent Command Center</h2>
                        <p className="text-gray-500 mt-1">Overview of your tasks and schedule for {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}.</p>
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div onClick={() => setActiveTab("appointments")} className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-yellow-500 cursor-pointer hover:shadow-md transition">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm text-gray-500 font-medium uppercase">Pending Bookings</p>
                                <h3 className="text-3xl font-bold text-gray-800 mt-1">{bookedSlots.filter(s => s.status === 'PENDING').length}</h3>
                            </div>
                            <div className="p-2 bg-yellow-100 rounded-lg text-yellow-600"><Clock size={24}/></div>
                        </div>
                        <p className="text-xs text-gray-400 mt-4 flex items-center gap-1">Requires confirmation <ArrowRight size={12}/></p>
                    </div>

                    <div onClick={() => setActiveTab("approvals")} className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-blue-500 cursor-pointer hover:shadow-md transition">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm text-gray-500 font-medium uppercase">Policy Reviews</p>
                                <h3 className="text-3xl font-bold text-gray-800 mt-1">{pendingPolicies.length}</h3>
                            </div>
                            <div className="p-2 bg-blue-100 rounded-lg text-blue-600"><FileText size={24}/></div>
                        </div>
                        <p className="text-xs text-gray-400 mt-4 flex items-center gap-1">Waiting for approval <ArrowRight size={12}/></p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-green-500">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm text-gray-500 font-medium uppercase">Confirmed Jobs</p>
                                <h3 className="text-3xl font-bold text-gray-800 mt-1">{bookedSlots.filter(s => s.status === 'CONFIRMED').length}</h3>
                            </div>
                            <div className="p-2 bg-green-100 rounded-lg text-green-600"><CheckCircle size={24}/></div>
                        </div>
                        <p className="text-xs text-gray-400 mt-4">Total upcoming appointments</p>
                    </div>
                </div>

                {/* Today's Schedule */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2"><Calendar className="text-indigo-600" size={20}/> Today's Schedule</h3>
                        <span className="text-sm text-gray-400">{getTodayDate()}</span>
                    </div>
                    <div className="p-6">
                        {todaysAppointments.length > 0 ? (
                            <div className="space-y-4">
                                {todaysAppointments.sort((a,b) => a.startTime.localeCompare(b.startTime)).map(slot => (
                                    <div key={slot.id} className="flex items-center p-4 bg-gray-50 rounded-xl border-l-4 border-indigo-500">
                                        <div className="w-24 font-bold text-gray-800">{slot.startTime}</div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-gray-800">{slot.bookedBy?.name}</h4>
                                            <p className="text-xs text-gray-500">{slot.bookedBy?.email}</p>
                                        </div>
                                        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">CONFIRMED</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-10">
                                <Clock size={48} className="text-gray-200 mx-auto mb-3"/>
                                <p className="text-gray-500">No appointments scheduled for today.</p>
                                <button onClick={() => setActiveTab("manage")} className="text-indigo-600 text-sm font-bold mt-2 hover:underline">Manage Availability</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )}

        {/* TAB 1: BOOKING REQUESTS */}
        {activeTab === "appointments" && (
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Booking Requests</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookedSlots.map((slot) => (
                  <div key={slot.id} className={`bg-white p-6 rounded-xl shadow-md border-t-4 ${slot.status === "CONFIRMED" ? "border-green-500" : slot.status === "PROPOSED" ? "border-blue-500" : "border-yellow-500"}`}>
                    <div className="flex justify-between items-start mb-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${slot.status === "CONFIRMED" ? "bg-green-100 text-green-700" : slot.status === "PROPOSED" ? "bg-blue-100 text-blue-700" : "bg-yellow-100 text-yellow-700"}`}>
                          {slot.status || "PENDING"}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{slot.availableDate}</h3>
                    <p className="text-gray-600 text-sm mb-4">{slot.startTime} - {slot.endTime}</p>
                    <div className="border-t pt-4">
                        <p className="text-xs font-bold text-gray-500 uppercase mb-1">Customer</p>
                        <p className="font-bold text-gray-800">{slot.bookedBy?.name || "Unknown"}</p>
                        <p className="text-sm text-gray-500">{slot.bookedBy?.email}</p>
                    </div>

                    {(!slot.status || slot.status === "PENDING") && (
                        <div className="flex gap-2 mt-4">
                            <button onClick={() => handleConfirmBooking(slot.id)} className="flex-1 bg-green-600 text-white py-2 rounded font-bold hover:bg-green-700 text-sm">Confirm</button>
                            <button onClick={() => openRescheduleModal(slot)} className="flex-1 bg-orange-100 text-orange-600 py-2 rounded font-bold hover:bg-orange-200 text-sm">Reschedule</button>
                        </div>
                    )}
                    {slot.status === "PROPOSED" && (
                         <p className="text-center text-sm text-blue-600 italic mt-4">Waiting for customer response...</p>
                    )}
                  </div>
              ))}
              {bookedSlots.length === 0 && <p className="text-gray-500">No booking requests found.</p>}
            </div>
          </div>
        )}

        {/* --- RESCHEDULE MODAL --- */}
        {showRescheduleModal && (
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm">
                <div className="bg-white rounded-2xl w-full max-w-4xl h-[600px] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                    
                    {/* Header */}
                    <div className="p-6 bg-gray-50 border-b flex justify-between items-center">
                        <div>
                            <h3 className="text-2xl font-bold text-gray-800">Reschedule Appointment</h3>
                            <p className="text-gray-500 text-sm">Customer: <span className="font-semibold text-gray-700">{selectedOldSlot?.bookedBy?.name}</span></p>
                        </div>
                        <button onClick={() => setShowRescheduleModal(false)} className="bg-gray-200 p-2 rounded-full hover:bg-gray-300 transition"><XCircle size={20} className="text-gray-600"/></button>
                    </div>
                    
                    {/* Content: Split Layout */}
                    <div className="flex-1 flex overflow-hidden">
                        
                        {/* LEFT: Date Selector */}
                        <div className="w-1/3 border-r bg-gray-50 overflow-y-auto p-4">
                            <h4 className="text-xs font-bold text-gray-400 uppercase mb-3 px-2">Select Date</h4>
                            <div className="space-y-2">
                                {uniqueDates.length > 0 ? uniqueDates.map(date => (
                                    <button 
                                        key={date} 
                                        onClick={() => setSelectedDateForReschedule(date)}
                                        className={`w-full text-left px-4 py-3 rounded-xl flex items-center justify-between transition-all duration-200 ${selectedDateForReschedule === date ? "bg-white border-l-4 border-indigo-600 shadow-sm text-indigo-700 font-bold" : "text-gray-600 hover:bg-gray-200"}`}
                                    >
                                        <span>{date}</span>
                                        {selectedDateForReschedule === date && <ChevronRight size={16}/>}
                                    </button>
                                )) : <p className="text-gray-400 text-sm p-4">No dates available.</p>}
                            </div>
                        </div>

                        {/* RIGHT: Time Slot Grid */}
                        <div className="w-2/3 p-8 overflow-y-auto bg-white">
                            <h4 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                <Clock size={20} className="text-indigo-600"/> 
                                Available Times for {selectedDateForReschedule}
                            </h4>
                            
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                                {availableSlots.filter(s => s.availableDate === selectedDateForReschedule).length > 0 ? (
                                    availableSlots
                                        .filter(s => s.availableDate === selectedDateForReschedule)
                                        .sort((a,b) => a.startTime.localeCompare(b.startTime))
                                        .map(slot => (
                                        <button 
                                            key={slot.id} 
                                            onClick={() => submitReschedule(slot.id)} 
                                            className="border border-gray-200 p-4 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 hover:shadow-md transition-all group text-center"
                                        >
                                            <p className="font-bold text-lg text-gray-800 group-hover:text-indigo-700">{slot.startTime}</p>
                                            <p className="text-xs text-gray-400">to {slot.endTime}</p>
                                        </button>
                                    ))
                                ) : (
                                    <div className="col-span-3 text-center py-20">
                                        <Calendar size={48} className="mx-auto text-gray-200 mb-4"/>
                                        <p className="text-gray-400">No free slots on this date.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* TAB 2: POLICY APPROVALS */}
        {activeTab === "approvals" && (
            <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Policy Applications</h2>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    {pendingPolicies.map(app => (
                        <div key={app.id} className="p-6 border-b flex justify-between items-center hover:bg-gray-50 transition">
                            <div>
                                <h3 className="font-bold text-lg text-gray-800">{app.policy.name}</h3>
                                <p className="text-sm text-indigo-600 font-semibold">{app.policy.type}</p>
                                <p className="text-sm text-gray-500 mt-1">Applicant: <span className="text-gray-900 font-medium">{app.customer.name}</span></p>
                            </div>
                            <button onClick={() => handleApprovePolicy(app.id)} className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 font-semibold shadow-sm">
                                Approve Request
                            </button>
                        </div>
                    ))}
                    {pendingPolicies.length === 0 && <p className="p-10 text-center text-gray-500">No pending policy applications.</p>}
                </div>
            </div>
        )}

        {/* TAB 3: MANAGE */}
        {activeTab === "manage" && (
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Manage Schedule</h2>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
              <h3 className="font-bold text-lg mb-4 text-gray-700 flex items-center gap-2">
                <Plus className="text-indigo-600" size={20} /> Add Manual Slot
              </h3>
              <div className="flex flex-wrap gap-4 items-end">
                <div><label className="block text-sm text-gray-600 mb-1">Date</label><input type="date" className="border rounded px-3 py-2" value={date} onChange={e=>setDate(e.target.value)} /></div>
                <div><label className="block text-sm text-gray-600 mb-1">Start</label><input type="time" className="border rounded px-3 py-2" value={startTime} onChange={e=>setStartTime(e.target.value)} /></div>
                <div><label className="block text-sm text-gray-600 mb-1">End</label><input type="time" className="border rounded px-3 py-2" value={endTime} onChange={e=>setEndTime(e.target.value)} /></div>
                <button onClick={handleAddSlot} className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700">Add Slot</button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {availableSlots.map((slot) => (
                <div key={slot.id} className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-gray-300 flex justify-between items-center group hover:border-indigo-500 transition">
                  <div>
                    <p className="font-bold text-gray-800">{slot.availableDate}</p>
                    <p className="text-sm text-gray-500">{slot.startTime} - {slot.endTime}</p>
                    <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded mt-1 inline-block">Open</span>
                  </div>
                  <button onClick={() => handleDeleteSlot(slot.id)} className="text-gray-400 hover:text-red-500"><Trash2 size={18}/></button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}