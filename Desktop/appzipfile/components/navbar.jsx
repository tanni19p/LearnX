"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Brain, LogIn, LogOut, LayoutDashboard, Home, BarChart3, Trophy, BookOpen, Flame, User } from "lucide-react"

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [gamification, setGamification] = useState(null)
  const [user, setUser] = useState(null)
  const [loggedIn, setLoggedIn] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [currentLevel, setCurrentLevel] = useState(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const loadData = async () => {
      const { getGamificationData, getCurrentLevel } = await import("@/lib/gamification")
      const { getUser, isLoggedIn } = await import("@/lib/auth")

      const gamificationData = getGamificationData()
      setGamification(gamificationData)
      setUser(getUser())
      setLoggedIn(isLoggedIn())
      if (gamificationData) {
        setCurrentLevel(getCurrentLevel(gamificationData.xp))
      }
    }
    loadData()
  }, [pathname, mounted])

  const handleLogout = async () => {
    const { logout } = await import("@/lib/auth")
    logout()
    setUser(null)
    setLoggedIn(false)
    router.push("/")
  }

  const isActive = (path) => pathname === path

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-[#0d0d0d]/80 border-b border-[#2a2a3a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <Brain className="h-8 w-8 text-indigo-500" />
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-500 to-blue-500 bg-clip-text text-transparent">
              LearnX
            </span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-4">
            {mounted && loggedIn && gamification && gamification.streak > 0 && (
              <div className="hidden sm:flex items-center gap-1 px-2 py-1 bg-orange-500/10 rounded-lg">
                <Flame className="h-4 w-4 text-orange-500" />
                <span className="text-sm font-medium text-orange-400">{gamification.streak}</span>
              </div>
            )}
            {mounted && loggedIn && currentLevel && (
              <div className="hidden sm:flex items-center gap-1 px-2 py-1 bg-indigo-500/10 rounded-lg">
                <span className="text-sm font-medium text-indigo-400">Lv.{currentLevel.level}</span>
              </div>
            )}

            <Link
              href="/"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                isActive("/") ? "text-indigo-400 bg-indigo-500/10" : "text-gray-400 hover:text-white hover:bg-[#1a1a2a]"
              }`}
            >
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">Home</span>
            </Link>

            {mounted && loggedIn && (
              <>
                <Link
                  href="/dashboard"
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    isActive("/dashboard")
                      ? "text-indigo-400 bg-indigo-500/10"
                      : "text-gray-400 hover:text-white hover:bg-[#1a1a2a]"
                  }`}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span className="hidden sm:inline">Dashboard</span>
                </Link>

                <Link
                  href="/flashcards"
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    isActive("/flashcards")
                      ? "text-indigo-400 bg-indigo-500/10"
                      : "text-gray-400 hover:text-white hover:bg-[#1a1a2a]"
                  }`}
                >
                  <BookOpen className="h-4 w-4" />
                  <span className="hidden sm:inline">Flashcards</span>
                </Link>

                <Link
                  href="/achievements"
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    isActive("/achievements")
                      ? "text-indigo-400 bg-indigo-500/10"
                      : "text-gray-400 hover:text-white hover:bg-[#1a1a2a]"
                  }`}
                >
                  <Trophy className="h-4 w-4" />
                  <span className="hidden sm:inline">Achievements</span>
                </Link>

                <Link
                  href="/analytics"
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    isActive("/analytics")
                      ? "text-indigo-400 bg-indigo-500/10"
                      : "text-gray-400 hover:text-white hover:bg-[#1a1a2a]"
                  }`}
                >
                  <BarChart3 className="h-4 w-4" />
                  <span className="hidden sm:inline">Analytics</span>
                </Link>
              </>
            )}

            {mounted && loggedIn ? (
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-[#1a1a2a] rounded-lg">
                  <User className="h-4 w-4 text-indigo-400" />
                  <span className="text-sm text-gray-300">{user?.name || "User"}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-[#1a1a2a] transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : mounted ? (
              <Link
                href="/login"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  isActive("/login")
                    ? "bg-indigo-600 text-white"
                    : "bg-gradient-to-r from-indigo-600 to-blue-600 text-white hover:opacity-90"
                }`}
              >
                <LogIn className="h-4 w-4" />
                <span className="hidden sm:inline">Login</span>
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </nav>
  )
}
