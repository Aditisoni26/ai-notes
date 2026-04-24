"use client";

import { useState } from "react";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState(""); // 🔥 NEW
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleRegister = async () => {
    if (!username || !email || !password) {
      alert("Fill all fields");
      return;
    }

    setLoading(true);

    try {
      await axios.post("/api/signup", {
        username,
        email, // 🔥 SEND EMAIL
        password
      });

      alert("Account created successfully");
      router.push("/login");

    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        alert(err.response?.data?.error || "Registration failed");
      } else {
        alert("Something went wrong");
      }
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black to-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md">

        <h2 className="text-2xl font-bold mb-6 text-center">
          Create Account 🚀
        </h2>

        {/* USERNAME */}
        <input
          className="w-full p-3 mb-3 rounded-lg bg-gray-900 border border-gray-700 outline-none"
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
        />

        {/* 🔥 EMAIL */}
        <input
          type="email"
          className="w-full p-3 mb-3 rounded-lg bg-gray-900 border border-gray-700 outline-none"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* PASSWORD */}
        <input
          type="password"
          className="w-full p-3 mb-4 rounded-lg bg-gray-900 border border-gray-700 outline-none"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleRegister}
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 transition py-3 rounded-lg font-semibold"
        >
          {loading ? "Creating..." : "Register"}
        </button>

        <p className="text-sm text-gray-400 mt-4 text-center">
          Already have an account?{" "}
          <span
            className="text-blue-400 cursor-pointer"
            onClick={() => router.push("/login")}
          >
            Login
          </span>
        </p>

      </div>
    </div>
  );
}