import { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [params] = useSearchParams();
  const navigate = useNavigate();

  // 1. Extract token reliably
  const token = params.get("token");

  // 2. Check if token is missing on page load
  useEffect(() => {
    if (!token) {
      alert("Invalid or missing token. Please use the link provided in your email.");
      navigate("/login");
    }
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 3. Client-side validation
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    if (!token) {
        alert("Missing reset token.");
        return;
    }

    try {
      // 4. Send request
      await axios.post("http://localhost:8080/api/auth/reset-password", { 
        token: token, 
        newPassword: password 
      });

      alert("Password reset successful! Please login.");
      navigate("/login");

    } catch (err) {
      console.error("Reset Error:", err);

      // 5. Better Error Handling
      // This handles cases where backend returns a string OR a JSON object
      let errorMessage = "Failed to reset password";
      
      if (err.response && err.response.data) {
          // If the backend returns a string (e.g., "Invalid token")
          if (typeof err.response.data === 'string') {
              errorMessage = err.response.data;
          } 
          // If the backend returns an object (e.g., { message: "Invalid token" })
          else if (err.response.data.message) {
              errorMessage = err.response.data.message;
          }
      }

      alert("Error: " + errorMessage);
    }
  };

  // Prevent rendering the form if there is no token (optional UX choice)
  if (!token) return <div className="p-10 text-center">Redirecting...</div>;

  return (
    <div className="flex h-screen justify-center items-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-xl font-bold mb-4">Reset Password</h2>
        
        <div className="mb-3">
            <label className="block text-gray-700 text-sm font-bold mb-2">New Password</label>
            <input
            type="password"
            placeholder="Enter new password"
            className="w-full border px-3 py-2 rounded focus:outline-none focus:border-green-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            />
        </div>

        <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">Confirm Password</label>
            <input
            type="password"
            placeholder="Confirm new password"
            className="w-full border px-3 py-2 rounded focus:outline-none focus:border-green-500"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            />
        </div>

        <button 
            type="submit" 
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition duration-200"
        >
          Reset Password
        </button>
      </form>
    </div>
  );
}