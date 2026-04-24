"use client"

import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  if (status === "loading") return <p className="p-4">Loading...</p>

  if (!session) {
    router.push("/login")
    return null
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-6 rounded-xl w-full max-w-md text-center">

        <h1 className="text-2xl font-bold mb-4">Profile</h1>

        <p className="mb-2">
          <span className="text-gray-400">Username:</span>{" "}
          {session.user?.name}
        </p>

        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="mt-4 w-full bg-red-600 hover:bg-red-700 py-2 rounded-lg"
        >
          Logout
        </button>

      </div>
    </div>
  )
}