import { Link } from "react-router-dom"; // Use Link for faster navigation

export default function CheckEmail() {
  return (
    <div className="flex h-screen">
      <div className="w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center">
        <h1 className="text-4xl font-bold">InsurAI Corporate</h1>
      </div>

      <div className="w-1/2 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-xl font-bold">Check Your Email</h2>
          <p className="mt-2 text-gray-500">
            We’ve sent a verification link to your email.
          </p>
          {/* ✅ Button to go back to Login */}
          <Link to="/login" className="bg-blue-600 text-white px-4 py-2 rounded inline-block mt-4 hover:bg-blue-700">
            Go to Login
          </Link>
        </div>
      </div>
    </div>
  );
}