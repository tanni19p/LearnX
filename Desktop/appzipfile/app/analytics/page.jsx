"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Navbar from "@/components/navbar"
import ProtectedRoute from "@/components/protected-route"
import { getQuizHistory, getStats, clearHistory } from "@/lib/quiz-storage"
import {
  Trophy,
  Target,
  Clock,
  TrendingUp,
  Calendar,
  AlertTriangle,
  CheckCircle,
  XCircle,
  BarChart3,
  Trash2,
  ArrowRight,
  Brain,
} from "lucide-react"
import { PrimaryButton, SecondaryButton } from "@/components/ui/buttons"

function AnalyticsContent() {
  const [history, setHistory] = useState([])
  const [stats, setStats] = useState(null)
  const [showConfirmClear, setShowConfirmClear] = useState(false)

  useEffect(() => {
    setHistory(getQuizHistory())
    setStats(getStats())
  }, [])

  const handleClearHistory = () => {
    clearHistory()
    setHistory([])
    setStats(getStats())
    setShowConfirmClear(false)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-500"
    if (score >= 60) return "text-amber-500"
    return "text-red-500"
  }

  const getScoreBg = (score) => {
    if (score >= 80) return "bg-green-500/10 border-green-500/30"
    if (score >= 60) return "bg-amber-500/10 border-amber-500/30"
    return "bg-red-500/10 border-red-500/30"
  }

  return (
    <div className="min-h-screen bg-[#050505]">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
              <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                Analytics
              </span>{" "}
              Dashboard
            </h1>
            <p className="text-gray-400">Track your progress and identify learning patterns</p>
          </div>

          {history.length > 0 && (
            <SecondaryButton
              onClick={() => setShowConfirmClear(true)}
              className="flex items-center gap-2 text-red-400 border-red-500/30 hover:bg-red-500/10"
            >
              <Trash2 className="w-4 h-4" />
              Clear History
            </SecondaryButton>
          )}
        </div>

        {/* Clear Confirmation Modal */}
        {showConfirmClear && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-[#0d0d15] border border-[#1a1a2a] rounded-2xl p-6 max-w-md w-full">
              <h3 className="text-xl font-semibold text-white mb-2">Clear All History?</h3>
              <p className="text-gray-400 mb-6">
                This will permanently delete all your quiz results. This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <SecondaryButton onClick={() => setShowConfirmClear(false)} className="flex-1">
                  Cancel
                </SecondaryButton>
                <button
                  onClick={handleClearHistory}
                  className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                >
                  Delete All
                </button>
              </div>
            </div>
          </div>
        )}

        {history.length === 0 ? (
          /* Empty State */
          <div className="bg-[#0d0d15] border border-[#1a1a2a] rounded-2xl p-12 text-center">
            <div className="w-20 h-20 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <BarChart3 className="w-10 h-10 text-purple-400" />
            </div>
            <h2 className="text-2xl font-semibold text-white mb-2">No Quiz History Yet</h2>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              Complete your first quiz to start tracking your progress and identifying learning gaps.
            </p>
            <Link href="/dashboard">
              <PrimaryButton>
                Start a Quiz
                <ArrowRight className="w-4 h-4 ml-2" />
              </PrimaryButton>
            </Link>
          </div>
        ) : (
          <>
            {/* Overview Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-[#0d0d15] border border-[#1a1a2a] rounded-xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-purple-400" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-white">{stats?.totalQuizzes || 0}</p>
                <p className="text-sm text-gray-400">Quizzes Completed</p>
              </div>

              <div className="bg-[#0d0d15] border border-[#1a1a2a] rounded-xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                    <Target className="w-5 h-5 text-purple-400" />
                  </div>
                </div>
                <p className={`text-3xl font-bold ${getScoreColor(stats?.avgScore || 0)}`}>{stats?.avgScore ?? "-"}%</p>
                <p className="text-sm text-gray-400">Average Score</p>
              </div>

              <div className="bg-[#0d0d15] border border-[#1a1a2a] rounded-xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-purple-400" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-green-500">{stats?.bestScore ?? "-"}%</p>
                <p className="text-sm text-gray-400">Best Score</p>
              </div>

              <div className="bg-[#0d0d15] border border-[#1a1a2a] rounded-xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-purple-400" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-white">{Math.round((stats?.totalTime || 0) / 60)}m</p>
                <p className="text-sm text-gray-400">Total Time</p>
              </div>
            </div>

            {/* Subject Performance */}
            {stats?.subjectStats && Object.keys(stats.subjectStats).length > 0 && (
              <div className="bg-[#0d0d15] border border-[#1a1a2a] rounded-2xl p-6 mb-8">
                <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-400" />
                  Subject Performance
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {Object.entries(stats.subjectStats).map(([subject, data]) => (
                    <div key={subject} className="bg-[#050505] border border-[#1a1a2a] rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium text-white">{subject}</h3>
                        <span className={`text-lg font-bold ${getScoreColor(data.avgScore)}`}>{data.avgScore}%</span>
                      </div>
                      <div className="w-full bg-[#1a1a2a] rounded-full h-2 mb-3">
                        <div
                          className="bg-gradient-to-r from-purple-600 to-pink-500 h-2 rounded-full transition-all"
                          style={{ width: `${data.avgScore}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">{data.attempts} attempts</span>
                        <span className="text-gray-400">Best: {data.bestScore}%</span>
                      </div>
                      {data.gaps.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-[#1a1a2a]">
                          <p className="text-xs text-amber-400 flex items-center gap-1 mb-2">
                            <AlertTriangle className="w-3 h-3" />
                            Gaps detected:
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {data.gaps.slice(0, 3).map((gap) => (
                              <span
                                key={gap}
                                className="px-2 py-0.5 bg-amber-500/10 border border-amber-500/30 rounded text-xs text-amber-400"
                              >
                                {gap}
                              </span>
                            ))}
                            {data.gaps.length > 3 && (
                              <span className="px-2 py-0.5 text-xs text-gray-500">+{data.gaps.length - 3} more</span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quiz History */}
            <div className="bg-[#0d0d15] border border-[#1a1a2a] rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-400" />
                Quiz History
              </h2>

              <div className="space-y-3">
                {history.map((quiz) => (
                  <div
                    key={quiz.id}
                    className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border ${getScoreBg(quiz.scorePercentage)}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-[#1a1a2a] flex items-center justify-center">
                        {quiz.scorePercentage >= 60 ? (
                          <CheckCircle className={`w-6 h-6 ${getScoreColor(quiz.scorePercentage)}`} />
                        ) : (
                          <XCircle className={`w-6 h-6 ${getScoreColor(quiz.scorePercentage)}`} />
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium text-white">{quiz.subject}</h3>
                        <p className="text-sm text-gray-400">{formatDate(quiz.date)}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 sm:gap-8">
                      <div className="text-center">
                        <p className={`text-xl font-bold ${getScoreColor(quiz.scorePercentage)}`}>
                          {quiz.scorePercentage}%
                        </p>
                        <p className="text-xs text-gray-400">Score</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xl font-bold text-white">
                          {quiz.correctCount}/{quiz.totalQuestions}
                        </p>
                        <p className="text-xs text-gray-400">Correct</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xl font-bold text-white">{quiz.gaps?.length || 0}</p>
                        <p className="text-xs text-gray-400">Gaps</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default function AnalyticsPage() {
  return (
    <ProtectedRoute>
      <AnalyticsContent />
    </ProtectedRoute>
  )
}
