"use client"

import { signIn } from "next-auth/react"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function Login() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleLogin = async () => {
    if (!username || !password) {
      setError("Enter username and password")
      return
    }

    setLoading(true)
    setError("")

    const res = await signIn("credentials", {
      username,
      password,
      redirect: false,
    })

    setLoading(false)

    if (res?.ok) {
      router.push("/")
    } else {
      setError("Invalid credentials")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-gray-800 px-4">

      <div className="w-full max-w-md bg-gray-900/80 border border-gray-700 backdrop-blur-xl rounded-2xl shadow-2xl p-8">

        {/* HEADER */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-white">🧠 AI Notes</h1>
          <p className="text-gray-400 text-sm mt-1">
            Login to continue
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-400 text-sm p-2 rounded mb-4 text-center">
            {error}
          </div>
        )}

        {/* INPUTS */}
        <div className="space-y-4">
          <input
            className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none transition"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none transition"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* BUTTON */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full mt-6 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 transition text-white py-3 rounded-lg font-semibold"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* FOOTER */}
        <p className="text-sm mt-4 text-center">
  Don’t have an account?{" "}
  <span
    className="text-blue-400 cursor-pointer"
    onClick={() => router.push("/register")}
  >
    Register
  </span>
</p>

      </div>
    </div>
  )
}