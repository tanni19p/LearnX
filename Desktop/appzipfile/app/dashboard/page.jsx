"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Navbar from "@/components/navbar"
import ProtectedRoute from "@/components/protected-route"
import { getStats } from "@/lib/quiz-storage"
import { getGamificationData, getCurrentLevel, getXPProgress, getNextLevel } from "@/lib/gamification"
import { getDueFlashcards } from "@/lib/flashcards"
import { getUser } from "@/lib/auth"
import { Server, Database, Code2, Network, ArrowRight, Trophy, Target, Clock, Flame, BookOpen } from "lucide-react"

const subjects = [
  {
    id: "operating-systems",
    name: "Operating Systems",
    icon: Server,
    description: "Processes, Memory Management, File Systems, Scheduling",
    color: "from-indigo-500 to-indigo-600",
    questions: 20,
  },
  {
    id: "dbms",
    name: "DBMS",
    icon: Database,
    description: "SQL, Normalization, Transactions, Indexing",
    color: "from-blue-500 to-blue-600",
    questions: 20,
  },
  {
    id: "data-structures",
    name: "Data Structures",
    icon: Code2,
    description: "Arrays, Trees, Graphs, Sorting, Searching",
    color: "from-violet-500 to-violet-600",
    questions: 20,
  },
  {
    id: "computer-networks",
    name: "Computer Networks",
    icon: Network,
    description: "OSI Model, TCP/IP, Routing, Security",
    color: "from-sky-500 to-sky-600",
    questions: 20,
  },
]

function DashboardContent() {
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    avgScore: null,
    totalTime: 0,
  })
  const [gamification, setGamification] = useState(null)
  const [dueFlashcards, setDueFlashcards] = useState(0)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const loadedStats = getStats()
    setStats(loadedStats)
    setGamification(getGamificationData())
    setDueFlashcards(getDueFlashcards().length)
    setUser(getUser())
  }, [])

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    if (hours > 0) return `${hours}h ${mins}m`
    return `${mins}m`
  }

  const currentLevel = gamification ? getCurrentLevel(gamification.xp) : null
  const nextLevel = gamification ? getNextLevel(gamification.xp) : null
  const xpProgress = gamification ? getXPProgress(gamification.xp) : 0

  return (
    <div className="min-h-screen bg-[#050505]">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            Hello,{" "}
            <span className="bg-gradient-to-r from-indigo-500 to-blue-500 bg-clip-text text-transparent">
              {user?.name || "Student"}
            </span>
          </h1>
          <p className="text-gray-400">Ready to identify your learning gaps? Choose a subject to begin.</p>
        </div>

        {gamification && (
          <div className="bg-gradient-to-r from-indigo-600/10 to-blue-600/10 border border-indigo-500/20 rounded-xl p-4 mb-8">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 flex items-center justify-center">
                  <span className="text-white font-bold">{currentLevel?.level || 1}</span>
                </div>
                <div>
                  <p className="text-white font-medium">{currentLevel?.name || "Beginner"}</p>
                  <p className="text-gray-500 text-sm">{gamification.xp} XP</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {gamification.streak > 0 && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-orange-500/10 rounded-lg">
                    <Flame className="w-4 h-4 text-orange-500" />
                    <span className="text-orange-400 font-medium">{gamification.streak} day streak</span>
                  </div>
                )}
                <Link href="/achievements" className="text-indigo-400 hover:text-indigo-300 text-sm">
                  View All
                </Link>
              </div>
            </div>
            <div className="h-2 bg-[#1a1a2a] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-600 to-blue-600 transition-all duration-500"
                style={{ width: `${xpProgress}%` }}
              />
            </div>
            {nextLevel && (
              <p className="text-xs text-gray-500 mt-2">
                {nextLevel.minXP - gamification.xp} XP to {nextLevel.name}
              </p>
            )}
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#0d0d15] border border-[#1a1a2a] rounded-xl p-4 sm:p-6">
            <div className="flex items-center gap-3 mb-2">
              <Trophy className="w-5 h-5 text-indigo-400" />
              <span className="text-sm text-gray-400">Quizzes</span>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-white">{stats.totalQuizzes}</p>
          </div>
          <div className="bg-[#0d0d15] border border-[#1a1a2a] rounded-xl p-4 sm:p-6">
            <div className="flex items-center gap-3 mb-2">
              <Target className="w-5 h-5 text-indigo-400" />
              <span className="text-sm text-gray-400">Avg. Score</span>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-white">
              {stats.avgScore !== null ? `${stats.avgScore}%` : "-"}
            </p>
          </div>
          <div className="bg-[#0d0d15] border border-[#1a1a2a] rounded-xl p-4 sm:p-6">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-5 h-5 text-indigo-400" />
              <span className="text-sm text-gray-400">Time Spent</span>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-white">
              {stats.totalTime > 0 ? formatTime(stats.totalTime) : "0m"}
            </p>
          </div>
          <Link
            href="/flashcards"
            className="bg-[#0d0d15] border border-[#1a1a2a] rounded-xl p-4 sm:p-6 hover:border-indigo-500/50 transition-colors"
          >
            <div className="flex items-center gap-3 mb-2">
              <BookOpen className="w-5 h-5 text-indigo-400" />
              <span className="text-sm text-gray-400">Cards Due</span>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-white">{dueFlashcards}</p>
          </Link>
        </div>

        {/* Subject Selection */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-6">Select a Subject</h2>

          <div className="grid sm:grid-cols-2 gap-6">
            {subjects.map((subject) => (
              <Link
                key={subject.id}
                href={`/quiz/${subject.id}`}
                className="group relative bg-[#0d0d15] border border-[#1a1a2a] rounded-2xl p-6 hover:border-indigo-500/50 transition-all hover:-translate-y-1"
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`w-14 h-14 bg-gradient-to-br ${subject.color} rounded-xl flex items-center justify-center`}
                  >
                    <subject.icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>{subject.questions} Questions</span>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-indigo-400 transition-colors">
                  {subject.name}
                </h3>
                <p className="text-gray-400 text-sm mb-4">{subject.description}</p>

                <div className="flex items-center gap-2 text-indigo-400 font-medium">
                  <span>Start Quiz</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  )
}
