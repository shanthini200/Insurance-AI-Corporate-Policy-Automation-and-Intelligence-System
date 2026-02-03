import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode(token);
    const userRole = decoded.role; // Extract role from token

    // Check if user's role is in the allowed list
    if (allowedRoles.includes(userRole)) {
      return children;
    } else {
      // Unauthorized: Redirect to their own dashboard
      if (userRole === "CUSTOMER") return <Navigate to="/dashboard" replace />;
      if (userRole === "AGENT") return <Navigate to="/agent-dashboard" replace />;
      if (userRole === "ADMIN") return <Navigate to="/admin-dashboard" replace />;
      return <Navigate to="/login" replace />;
    }
  } catch (error) {
    localStorage.clear();
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;