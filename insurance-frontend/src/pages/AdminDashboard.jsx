import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { 
  LogOut, Users, Shield, FileText, CheckCircle, Plus, Trash2, 
  LayoutDashboard, AlertCircle, UserPlus, Briefcase, Edit2, X, DollarSign, Activity 
} from "lucide-react";

export default function AdminDashboard() {
  const navigate = useNavigate();
  
  // --- DATA STATE ---
  const [customers, setCustomers] = useState([]);
  const [agents, setAgents] = useState([]);
  const [pendingPolicies, setPendingPolicies] = useState([]);
  const [allPolicies, setAllPolicies] = useState([]); 
  
  const [activeTab, setActiveTab] = useState("dashboard");

  // --- FORM STATES ---

  // Agent Form
  const [agentName, setAgentName] = useState("");
  const [agentEmail, setAgentEmail] = useState("");
  const [agentPassword, setAgentPassword] = useState("");
  const [isEditingAgent, setIsEditingAgent] = useState(false); 
  const [editingAgentId, setEditingAgentId] = useState(null); 

  // Policy Form
  const [newPolicy, setNewPolicy] = useState({
    name: "",
    type: "Health",
    premiumAmount: "",
    coverageAmount: "",
    description: ""
  });
  const [isEditingPolicy, setIsEditingPolicy] = useState(false);
  const [editingPolicyId, setEditingPolicyId] = useState(null);

  const getAuthHeader = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [resCust, resAgent, resPending, resPol] = await Promise.all([
        axios.get("http://localhost:8080/api/admin/users", getAuthHeader()),
        axios.get("http://localhost:8080/api/admin/agents", getAuthHeader()),
        axios.get("http://localhost:8080/api/admin/pending-policies", getAuthHeader()),
        axios.get("http://localhost:8080/api/customer/policies", getAuthHeader()).catch(() => ({ data: [] })) 
      ]);

      setCustomers(resCust.data);
      setAgents(resAgent.data);
      setPendingPolicies(resPending.data);
      setAllPolicies(resPol.data);
    } catch (err) {
      if (err.response?.status === 403) navigate("/login");
      console.error(err);
    }
  };

  // --- AGENT ACTIONS ---

  const handleEditAgentClick = (agent) => {
      setIsEditingAgent(true);
      setEditingAgentId(agent.id);
      setAgentName(agent.name);
      setAgentEmail(agent.email);
      setAgentPassword(""); // Don't pre-fill password
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelAgentEdit = () => {
      setIsEditingAgent(false);
      setEditingAgentId(null);
      setAgentName("");
      setAgentEmail("");
      setAgentPassword("");
  };

  const handleAgentSubmit = async (e) => {
    e.preventDefault();
    if (isEditingAgent) {
        // UPDATE
        try {
            await axios.put(`http://localhost:8080/api/admin/agent/${editingAgentId}`, {
                name: agentName, email: agentEmail, password: agentPassword 
            }, getAuthHeader());
            alert("Agent Updated Successfully! 🔄");
            handleCancelAgentEdit();
            fetchData();
        } catch (err) { alert("Error updating agent"); }
    } else {
        // CREATE
        try {
            await axios.post("http://localhost:8080/api/admin/add-agent", {
                name: agentName, email: agentEmail, password: agentPassword
            }, getAuthHeader());
            alert("Agent Created & Schedule Auto-Generated ✅");
            setAgentName(""); setAgentEmail(""); setAgentPassword("");
            fetchData();
        } catch (err) { alert("Error adding agent"); }
    }
  };

  // --- POLICY ACTIONS ---

  const handleEditPolicyClick = (policy) => {
      setIsEditingPolicy(true);
      setEditingPolicyId(policy.id);
      setNewPolicy({
          name: policy.name, type: policy.type, 
          premiumAmount: policy.premiumAmount, coverageAmount: policy.coverageAmount, 
          description: policy.description
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelPolicyEdit = () => {
      setIsEditingPolicy(false);
      setEditingPolicyId(null);
      setNewPolicy({ name: "", type: "Health", premiumAmount: "", coverageAmount: "", description: "" });
  };

  const handlePolicySubmit = async (e) => {
      e.preventDefault();
      if (isEditingPolicy) {
          // UPDATE
          try {
              await axios.put(`http://localhost:8080/api/admin/policies/${editingPolicyId}`, newPolicy, getAuthHeader());
              alert("Policy Updated Successfully! 🔄");
              handleCancelPolicyEdit();
              fetchData();
          } catch (err) { alert("Error updating policy"); }
      } else {
          // CREATE
          try {
              await axios.post("http://localhost:8080/api/admin/policies", newPolicy, getAuthHeader());
              alert("New Policy Created Successfully! 🛡️");
              setNewPolicy({ name: "", type: "Health", premiumAmount: "", coverageAmount: "", description: "" });
              fetchData();
          } catch (err) { alert("Error creating policy"); }
      }
  };

  // --- SHARED ACTIONS ---

  const handleApproveFinal = async (appId) => {
    if(!window.confirm("Grant Final Approval?")) return;
    try {
      await axios.put(`http://localhost:8080/api/admin/approve-policy-final/${appId}`, {}, getAuthHeader());
      alert("Policy Fully Approved! 🎉");
      fetchData();
    } catch (err) { alert("Error approving"); }
  };

  const handleDeleteItem = async (type, id) => {
      if(!window.confirm("Are you sure you want to delete this?")) return;
      try {
          if(type === 'user') await axios.delete(`http://localhost:8080/api/admin/user/${id}`, getAuthHeader());
          if(type === 'policy') await axios.delete(`http://localhost:8080/api/admin/policies/${id}`, getAuthHeader());
          fetchData();
      } catch (err) { alert("Delete failed"); }
  };

  const handleLogout = () => { localStorage.clear(); navigate("/login"); };

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      
      {/* SIDEBAR */}
      <div className="w-64 bg-[#0f172a] text-white flex flex-col p-6 shadow-2xl transition-all duration-300">
        <div className="flex items-center gap-2 mb-10 text-emerald-400">
            <Shield size={28} />
            <h1 className="text-xl font-bold tracking-wider">Admin Panel</h1>
        </div>

        <nav className="space-y-2">
            <button onClick={() => setActiveTab("dashboard")} className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${activeTab === "dashboard" ? "bg-emerald-600 shadow-lg text-white" : "hover:bg-white/10 text-gray-400"}`}><LayoutDashboard size={20} /> Dashboard</button>
            <button onClick={() => setActiveTab("approvals")} className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${activeTab === "approvals" ? "bg-emerald-600 shadow-lg text-white" : "hover:bg-white/10 text-gray-400"}`}><CheckCircle size={20} /> Final Approvals</button>
            <button onClick={() => setActiveTab("policies")} className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${activeTab === "policies" ? "bg-emerald-600 shadow-lg text-white" : "hover:bg-white/10 text-gray-400"}`}><FileText size={20} /> Manage Policies</button>
            <button onClick={() => setActiveTab("agents")} className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${activeTab === "agents" ? "bg-emerald-600 shadow-lg text-white" : "hover:bg-white/10 text-gray-400"}`}><Briefcase size={20} /> Manage Agents</button>
            <button onClick={() => setActiveTab("customers")} className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${activeTab === "customers" ? "bg-emerald-600 shadow-lg text-white" : "hover:bg-white/10 text-gray-400"}`}><Users size={20} /> Manage Users</button>
        </nav>

        <button onClick={handleLogout} className="mt-auto flex items-center gap-3 text-gray-400 p-3 hover:text-white transition"><LogOut size={20} /> Logout</button>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 p-8 overflow-auto bg-gray-50">
        
        {/* DASHBOARD - System Overview */}
        {activeTab === "dashboard" && (
            <div className="animate-in fade-in duration-500 space-y-8">
                
                {/* Header */}
                <div className="flex justify-between items-end">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800">System Overview</h2>
                        <p className="text-gray-500 mt-1">Admin control center status report.</p>
                    </div>
                    <div className="text-sm text-gray-400 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
                        {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                        <div><p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Users</p><h3 className="text-3xl font-bold text-gray-800 mt-1">{customers.length}</h3></div>
                        <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center"><Users size={20}/></div>
                    </div>
                    
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                        <div><p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Active Agents</p><h3 className="text-3xl font-bold text-gray-800 mt-1">{agents.length}</h3></div>
                        <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center"><Briefcase size={20}/></div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                        <div><p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Available Plans</p><h3 className="text-3xl font-bold text-gray-800 mt-1">{allPolicies.length}</h3></div>
                        <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center"><Shield size={20}/></div>
                    </div>

                    <div onClick={() => setActiveTab("approvals")} className="bg-red-50 p-6 rounded-2xl shadow-sm border border-red-100 flex items-center justify-between cursor-pointer hover:bg-red-100 transition">
                        <div><p className="text-xs font-bold text-red-400 uppercase tracking-wider">Action Required</p><h3 className="text-3xl font-bold text-red-600 mt-1">{pendingPolicies.length}</h3></div>
                        <div className="w-10 h-10 bg-white text-red-500 rounded-xl flex items-center justify-center shadow-sm"><AlertCircle size={20}/></div>
                    </div>
                </div>

                {/* Lower Section: Pending List + Quick Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Left: Pending Approvals */}
                    <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="font-bold text-gray-800 flex items-center gap-2"><CheckCircle size={18} className="text-emerald-500"/> Pending Final Approvals</h3>
                            <button onClick={() => setActiveTab("approvals")} className="text-xs font-bold text-blue-600 hover:underline">View All</button>
                        </div>
                        <div className="p-6">
                            {pendingPolicies.length > 0 ? (
                                <div className="space-y-3">
                                    {pendingPolicies.slice(0, 3).map(app => (
                                        <div key={app.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                                            <div>
                                                <h4 className="font-bold text-gray-800 text-sm">{app.policy.name}</h4>
                                                <p className="text-xs text-gray-500">Applicant: {app.customer.name}</p>
                                            </div>
                                            <button onClick={() => handleApproveFinal(app.id)} className="bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-emerald-700">Approve</button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-10 text-gray-400 text-sm">All caught up! No pending approvals.</div>
                            )}
                        </div>
                    </div>

                    {/* Right: Quick Actions */}
                    <div className="space-y-6">
                        <div className="bg-[#1e293b] rounded-2xl p-6 text-white shadow-lg">
                            <h3 className="font-bold text-lg mb-2">Create New Policy</h3>
                            <p className="text-slate-400 text-xs mb-4">Launch a new insurance plan to the marketplace.</p>
                            <button onClick={() => setActiveTab("policies")} className="w-full bg-emerald-500 text-white py-2.5 rounded-lg font-bold hover:bg-emerald-600 transition flex items-center justify-center gap-2 text-sm">
                                <Plus size={16}/> Add Policy
                            </button>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <h3 className="font-bold text-gray-800 mb-4 text-sm">System Status</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between text-xs"><span className="text-gray-500">Database</span><span className="text-green-600 font-bold">Online</span></div>
                                <div className="flex justify-between text-xs"><span className="text-gray-500">Email Service</span><span className="text-green-600 font-bold">Active</span></div>
                                <div className="flex justify-between text-xs"><span className="text-gray-500">Server Load</span><span className="text-blue-600 font-bold">Low (12%)</span></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* FINAL APPROVALS TAB */}
        {activeTab === "approvals" && (
            <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Final Policy Approvals</h2>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-500 text-xs uppercase"><tr><th className="p-4">Policy</th><th className="p-4">Customer</th><th className="p-4">Status</th><th className="p-4">Action</th></tr></thead>
                        <tbody className="divide-y divide-gray-100">
                            {pendingPolicies.map(app => (
                                <tr key={app.id}>
                                    <td className="p-4 font-bold text-gray-800">{app.policy.name}</td>
                                    <td className="p-4 text-gray-600 text-sm">{app.customer.name}</td>
                                    <td className="p-4"><span className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs font-bold">PENDING FINAL</span></td>
                                    <td className="p-4"><button onClick={() => handleApproveFinal(app.id)} className="bg-emerald-600 text-white px-3 py-1.5 rounded hover:bg-emerald-700 text-xs font-bold">Approve</button></td>
                                </tr>
                            ))}
                            {pendingPolicies.length === 0 && <tr><td colSpan="4" className="p-10 text-center text-gray-400">No policies waiting for final approval.</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        {/* MANAGE POLICIES TAB (With Edit) */}
        {activeTab === "policies" && (
            <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Manage Insurance Plans</h2>
                
                {/* Form Card */}
                <div className={`bg-white p-6 rounded-xl shadow-sm border ${isEditingPolicy ? "border-blue-400 ring-2 ring-blue-50" : "border-gray-200"} mb-8 transition-all`}>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-gray-800 flex items-center gap-2">
                            {isEditingPolicy ? <><Edit2 size={18} className="text-blue-600"/> Edit Policy</> : <><Plus size={18} className="text-emerald-600"/> Create New Policy</>}
                        </h3>
                        {isEditingPolicy && <button onClick={handleCancelPolicyEdit} className="text-xs text-red-500 hover:bg-red-50 px-3 py-1 rounded-lg flex items-center gap-1 border border-red-200"><X size={12}/> Cancel Edit</button>}
                    </div>
                    <form onSubmit={handlePolicySubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="text" placeholder="Policy Name (e.g., Gold Health)" className="border p-3 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none" value={newPolicy.name} onChange={e => setNewPolicy({...newPolicy, name: e.target.value})} required/>
                        <select className="border p-3 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none" value={newPolicy.type} onChange={e => setNewPolicy({...newPolicy, type: e.target.value})}>
                            <option value="Health">Health Insurance</option>
                            <option value="Life">Life Insurance</option>
                            <option value="Vehicle">Vehicle Insurance</option>
                            <option value="Home">Home Insurance</option>
                        </select>
                        <div className="relative"><span className="absolute left-3 top-3 text-gray-400">$</span><input type="number" placeholder="Premium" className="border p-3 pl-8 rounded-lg w-full text-sm focus:ring-2 focus:ring-emerald-500 outline-none" value={newPolicy.premiumAmount} onChange={e => setNewPolicy({...newPolicy, premiumAmount: e.target.value})} required/></div>
                        <div className="relative"><span className="absolute left-3 top-3 text-gray-400">$</span><input type="number" placeholder="Coverage" className="border p-3 pl-8 rounded-lg w-full text-sm focus:ring-2 focus:ring-emerald-500 outline-none" value={newPolicy.coverageAmount} onChange={e => setNewPolicy({...newPolicy, coverageAmount: e.target.value})} required/></div>
                        <textarea placeholder="Description / Benefits" className="border p-3 rounded-lg md:col-span-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" rows="2" value={newPolicy.description} onChange={e => setNewPolicy({...newPolicy, description: e.target.value})} required></textarea>
                        <button type="submit" className={`font-bold py-3 rounded-lg md:col-span-2 text-white transition ${isEditingPolicy ? "bg-blue-600 hover:bg-blue-700" : "bg-emerald-600 hover:bg-emerald-700"}`}>
                            {isEditingPolicy ? "Update Policy" : "Launch Policy"}
                        </button>
                    </form>
                </div>

                {/* Policies Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {allPolicies.map(policy => (
                        <div key={policy.id} className={`bg-white p-6 rounded-xl shadow-sm border transition ${editingPolicyId === policy.id ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:shadow-md"}`}>
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center"><Shield size={20}/></div>
                                <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded uppercase">{policy.type}</span>
                            </div>
                            <h3 className="font-bold text-lg text-gray-800">{policy.name}</h3>
                            <p className="text-gray-500 text-sm mt-1 line-clamp-2">{policy.description}</p>
                            <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                                <div><p className="text-xs text-gray-400 uppercase font-bold">Premium</p><p className="font-bold text-gray-800">${policy.premiumAmount}/mo</p></div>
                                <div className="flex gap-2">
                                    <button onClick={() => handleEditPolicyClick(policy)} className="text-blue-400 hover:text-blue-600 p-2 rounded-full hover:bg-blue-50 transition"><Edit2 size={18}/></button>
                                    <button onClick={() => handleDeleteItem('policy', policy.id)} className="text-red-400 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition"><Trash2 size={18}/></button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* MANAGE AGENTS TAB (With Edit) */}
        {activeTab === "agents" && (
            <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Manage Agents</h2>
                
                <div className={`bg-white p-6 rounded-xl shadow-sm border ${isEditingAgent ? "border-indigo-400 ring-2 ring-indigo-50" : "border-gray-200"} mb-8 transition-all`}>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-gray-800 flex items-center gap-2">
                            {isEditingAgent ? <><Edit2 size={18} className="text-indigo-600"/> Edit Agent</> : <><UserPlus size={18} className="text-emerald-600"/> Add New Agent</>}
                        </h3>
                        {isEditingAgent && <button onClick={handleCancelAgentEdit} className="text-xs text-red-500 hover:bg-red-50 px-3 py-1 rounded-lg flex items-center gap-1 border border-red-200"><X size={12}/> Cancel Edit</button>}
                    </div>
                    <form onSubmit={handleAgentSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <input type="text" placeholder="Full Name" className="border p-2 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none" value={agentName} onChange={e=>setAgentName(e.target.value)} required/>
                        <input type="email" placeholder="Email Address" className="border p-2 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none" value={agentEmail} onChange={e=>setAgentEmail(e.target.value)} required/>
                        <input type="password" placeholder={isEditingAgent ? "New Password (Optional)" : "Password"} className="border p-2 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none" value={agentPassword} onChange={e=>setAgentPassword(e.target.value)} required={!isEditingAgent}/>
                        <button type="submit" className={`font-bold py-2 rounded-lg text-white transition ${isEditingAgent ? "bg-indigo-600 hover:bg-indigo-700" : "bg-emerald-600 hover:bg-emerald-700"}`}>
                            {isEditingAgent ? "Update Agent" : "Create Agent"}
                        </button>
                    </form>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {agents.map(agent => (
                        <div key={agent.id} className={`bg-white p-6 rounded-xl shadow-sm border transition ${editingAgentId === agent.id ? "border-indigo-500 bg-indigo-50" : "border-gray-200 hover:shadow-md"}`}>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold text-sm">{agent.name.charAt(0)}</div>
                                    <div><h4 className="font-bold text-gray-800 text-sm">{agent.name}</h4><p className="text-xs text-gray-500">{agent.email}</p></div>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => handleEditAgentClick(agent)} className="text-indigo-400 hover:text-indigo-600 p-2 rounded-full hover:bg-indigo-100 transition"><Edit2 size={18}/></button>
                                    <button onClick={() => handleDeleteItem('user', agent.id)} className="text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition"><Trash2 size={18}/></button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* CUSTOMERS TAB */}
        {activeTab === "customers" && (
            <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Registered Customers</h2>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-500 text-xs uppercase"><tr><th className="p-4">Name</th><th className="p-4">Email</th><th className="p-4">Role</th><th className="p-4">Actions</th></tr></thead>
                        <tbody className="divide-y divide-gray-100">
                            {customers.map(user => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="p-4 font-medium text-gray-800 text-sm">{user.name}</td>
                                    <td className="p-4 text-gray-600 text-sm">{user.email}</td>
                                    <td className="p-4"><span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold">CUSTOMER</span></td>
                                    <td className="p-4"><button onClick={() => handleDeleteItem('user', user.id)} className="text-red-500 hover:text-red-700 flex items-center gap-1 text-xs font-bold"><Trash2 size={16}/> Delete</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

      </div>
    </div>
  );
}