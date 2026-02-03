import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // ✅ Import useNavigate

export default function Register() {
  const navigate = useNavigate(); // ✅ Initialize hook
  
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "CUSTOMER",
    policyName: "",
    age: "",
    paymentType: "",
    address: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/api/auth/register", form);
      
      // ✅ Redirect instead of just alerting
      navigate("/check-email"); 
      
    } catch (err) {
      alert("Registration failed: " + (err.response?.data || err.message));
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* LEFT PANEL */}
      <div className="w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex flex-col justify-center items-center px-10">
        <h1 className="text-4xl font-bold mb-4">InsurAI Corporate</h1>
        <p className="text-center mb-6">
          Next-generation policy automation and intelligence system.
        </p>
        <div className="flex gap-3">
          <span className="px-4 py-1 bg-white/20 rounded-full">Secure</span>
          <span className="px-4 py-1 bg-white/20 rounded-full">Automated</span>
          <span className="px-4 py-1 bg-white/20 rounded-full">Intelligent</span>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="w-1/2 flex justify-center items-center bg-gray-50">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-xl shadow-md w-[420px]"
        >
          <h2 className="text-2xl font-semibold mb-1">Create Account</h2>
          <p className="text-gray-500 mb-5">
            Register to access InsurAI services
          </p>

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            className="input"
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            className="input"
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="input"
            onChange={handleChange}
            required
          />

          <select
            name="role"
            className="input"
            onChange={handleChange}
          >
            <option value="CUSTOMER">Policy Customer</option>
            <option value="AGENT">Insurance Agent</option>
            <option value="ADMIN">Administrator</option>
          </select>

          {/* Optional fields */}
          <input type="text" name="policyName" placeholder="Policy Name" className="input" onChange={handleChange} />
          <input type="number" name="age" placeholder="Age" className="input" onChange={handleChange} />
          <select name="paymentType" className="input" onChange={handleChange}>
            <option value="">Payment Type</option>
            <option value="MONTHLY">Monthly</option>
            <option value="YEARLY">Yearly</option>
          </select>
          <textarea name="address" placeholder="Address" className="input h-20 resize-none" onChange={handleChange} />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg mt-4 hover:bg-blue-700"
          >
            Register
          </button>
            <p className="mt-4 text-sm text-center">
            Already have an account?{" "}
            <span
              className="text-blue-600 cursor-pointer"
              onClick={() => navigate("/Login")}
            >
              Login
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}