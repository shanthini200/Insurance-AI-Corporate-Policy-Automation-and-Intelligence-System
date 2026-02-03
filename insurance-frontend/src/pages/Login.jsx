import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom"; // ✅ Ensure Link is imported
import { jwtDecode } from "jwt-decode";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  
  const [selectedRole, setSelectedRole] = useState("CUSTOMER");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:8080/api/auth/login",
        { email, password }
      );

      const token = res.data.token || res.data; 
      const decoded = jwtDecode(token);
      
      let realRole = decoded.role || "";
      if (realRole.startsWith("ROLE_")) {
        realRole = realRole.replace("ROLE_", "");
      }

      console.log("Logged in as:", realRole);

      localStorage.setItem("token", token);
      localStorage.setItem("role", realRole);

      if (realRole === "ADMIN") {
        navigate("/admin-dashboard");
      } else if (realRole === "AGENT") {
        navigate("/agent-dashboard");
      } else if (realRole === "CUSTOMER") {
        navigate("/dashboard");
      } else {
        navigate("/dashboard");
      }

    } catch (err) {
      console.error("Login Error:", err);
      alert("Invalid Credentials or Server Error");
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left panel */}
      <div className="w-1/2 bg-gradient-to-br from-blue-500 to-indigo-700 text-white flex flex-col justify-center px-16">
        <h1 className="text-4xl font-bold mb-4">InsurAI Corporate</h1>
        <p className="mb-6">
          Next-generation policy automation and intelligence system.
        </p>
        <div className="flex gap-2">
          <span className="bg-white/20 px-3 py-1 rounded-full">Secure</span>
          <span className="bg-white/20 px-3 py-1 rounded-full">Automated</span>
          <span className="bg-white/20 px-3 py-1 rounded-full">Intelligent</span>
        </div>
      </div>

      {/* Right panel */}
      <div className="w-1/2 flex justify-center items-center">
        <form
          onSubmit={handleLogin}
          className="bg-white shadow-md p-8 rounded w-96"
        >
          <h2 className="text-xl font-bold mb-2">Welcome back</h2>
          <p className="text-gray-500 mb-4">
            Sign in to your corporate account
          </p>

          <input
            type="email"
            placeholder="Email address"
            className="w-full mb-3 border px-3 py-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full mb-4 border px-3 py-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          {/* ✅ FIXED: Replaced <span> with <Link> */}
          <div className="text-right mb-4">
            <Link 
              to="/forgot-password" 
              className="text-sm text-blue-600 cursor-pointer hover:underline focus:outline-none"
            >
              Forgot Password?
            </Link>
          </div>

          <select
            className="w-full mb-4 border px-3 py-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
          >
            <option value="CUSTOMER">Customer</option>
            <option value="AGENT">Insurance Agent</option>
            <option value="ADMIN">Administrator</option>
          </select>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Sign In
          </button>
          
          <p className="mt-4 text-sm text-center">
            Don’t have an account?{" "}
            <Link to="/register" className="text-blue-600 cursor-pointer hover:underline">
              Create an account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;