import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server Error:", errorText);
        throw new Error("Invalid login. " + errorText);
      }

      let data;
      try {
        data = await response.json();
      } catch (jsonErr) {
        console.error("Invalid JSON response");
        throw new Error("Unexpected response format.");
      }

      console.log("Login successful:");
      alert("Logged in successfully!");
      navigate(location.state?.from?.pathname || "/");

    } catch (err) {
      console.error("Login error:", err.message);
      alert("Login failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-base-200 px-4 sm:px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm sm:max-w-md md:max-w-lg p-6 sm:p-8 bg-base-100 shadow-lg rounded-xl space-y-6"
      >
        <h2 className="text-2xl sm:text-3xl font-body font-bold text-center text-white">Login</h2>

        <input
          type="email"
          className="border-2 text-lg sm:text-xl px-4 py-2 rounded-lg text-white w-full bg-base-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
        />

        <input
          type="password"
          className="border-2 text-lg sm:text-xl px-4 py-2 rounded-lg text-white w-full bg-base-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
        />

        <button
          type="submit"
          disabled={loading}
          className={`text-lg sm:text-xl py-3 rounded-xl w-full transition
            ${loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-600 text-slate-800 hover:bg-blue-900 hover:text-white'}`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
