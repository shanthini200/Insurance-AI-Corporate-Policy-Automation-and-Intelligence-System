import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/api/auth/forgot-password", { email });
      setMessage("✅ Reset link sent! Check your email.");
    } catch (err) {
      setMessage("❌ Error: " + (err.response?.data || "User not found"));
    }
  };

  return (
    <div className="flex h-screen justify-center items-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-xl font-bold mb-4">Forgot Password</h2>
        <p className="text-gray-500 mb-4 text-sm">Enter your email to receive a reset link.</p>
        
        {message && <p className="mb-4 text-center font-semibold">{message}</p>}

        <input
          type="email"
          placeholder="Enter your email"
          className="w-full mb-4 border px-3 py-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Send Reset Link
        </button>
        <div className="mt-4 text-center">
          <Link to="/login" className="text-blue-600 text-sm">Back to Login</Link>
        </div>
      </form>
    </div>
  );
}