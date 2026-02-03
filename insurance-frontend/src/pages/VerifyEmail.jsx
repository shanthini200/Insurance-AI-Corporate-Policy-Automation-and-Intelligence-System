import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "../utils/axios";

export default function VerifyEmail() {
  const [params] = useSearchParams();
  const [message, setMessage] = useState("Verifying...");

  useEffect(() => {
    const token = params.get("token");

    axios.get(`/api/auth/verify?token=${token}`)
      .then(() => setMessage("Email verified successfully ✅"))
      .catch(() => setMessage("Invalid or expired link ❌"));
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow text-center">
        <h1 className="text-xl font-bold">{message}</h1>
        <a href="/login" className="text-blue-600 mt-4 block">
          Go to Login
        </a>
      </div>
    </div>
  );
}
