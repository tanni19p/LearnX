"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { isLoggedIn } from "@/lib/auth"
import { Lock } from "lucide-react"

export default function ProtectedRoute({ children }) {
  const router = useRouter()
  const [checking, setChecking] = useState(true)
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    if (isLoggedIn()) {
      setAuthorized(true)
    } else {
      // Show message briefly before redirecting
      setTimeout(() => {
        router.push("/login")
      }, 1500)
    }
    setChecking(false)
  }, [router])

  if (checking) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="animate-pulse text-purple-400">Loading...</div>
      </div>
    )
  }

  if (!authorized) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500/10 rounded-2xl mb-4">
            <Lock className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-gray-400">Please login to continue...</p>
        </div>
      </div>
    )
  }

  return children
}
