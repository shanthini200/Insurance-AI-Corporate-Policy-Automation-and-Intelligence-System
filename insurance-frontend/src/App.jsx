import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AgentDashboard from "./pages/AgentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import CustomerDashboard from "./pages/CustomerDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import ForgotPassword from "./pages/ForgotPassword"; 
import ResetPassword from "./pages/ResetPassword"; // ✅ 1. IMPORT THIS

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        
        {/* ✅ 2. ADD THIS ROUTE */}
        <Route path="/reset-password" element={<ResetPassword />} />
        
        {/* 🔒 PROTECTED: ADMIN ONLY */}
        <Route 
          path="/admin-dashboard" 
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />

        {/* 🔒 PROTECTED: AGENT ONLY */}
        <Route 
          path="/agent-dashboard" 
          element={
            <ProtectedRoute allowedRoles={["AGENT"]}>
              <AgentDashboard />
            </ProtectedRoute>
          } 
        />

        {/* 🔒 PROTECTED: CUSTOMER ONLY */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute allowedRoles={["CUSTOMER"]}>
              <CustomerDashboard />
            </ProtectedRoute>
          } 
        />

        {/* Defaults */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/login" />} />
        
      </Routes>
    </Router>
  );
}

export default App;