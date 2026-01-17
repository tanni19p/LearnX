"use client"

import { useState, useEffect } from "react"
import Navbar from "@/components/navbar"
import ProtectedRoute from "@/components/protected-route"
import {
  getGamificationData,
  getCurrentLevel,
  getNextLevel,
  getXPProgress,
  getAllBadges,
  LEVELS,
} from "@/lib/gamification"
import { getStats } from "@/lib/quiz-storage"
import { Trophy, Zap, Flame, Star, Lock, Award, TrendingUp } from "lucide-react"

function AchievementsContent() {
  const [gamification, setGamification] = useState(null)
  const [badges, setBadges] = useState([])
  const [stats, setStats] = useState(null)

  useEffect(() => {
    setGamification(getGamificationData())
    setBadges(getAllBadges())
    setStats(getStats())
  }, [])

  if (!gamification) {
    return (
      <div className="min-h-screen bg-[#050505]">
        <Navbar />
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  const currentLevel = getCurrentLevel(gamification.xp)
  const nextLevel = getNextLevel(gamification.xp)
  const progress = getXPProgress(gamification.xp)
  const unlockedCount = badges.filter((b) => b.unlocked).length

  return (
    <div className="min-h-screen bg-[#050505]">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">Achievements</h1>

        {/* XP & Level Card */}
        <div className="bg-gradient-to-br from-[#0d0d15] to-[#15151f] border border-[#1a1a2a] rounded-2xl p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Level Circle */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center">
                <div className="w-28 h-28 rounded-full bg-[#0d0d15] flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-white">{currentLevel.level}</span>
                  <span className="text-xs text-gray-400">{currentLevel.name}</span>
                </div>
              </div>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-blue-600 px-3 py-1 rounded-full">
                <span className="text-xs font-bold text-white">{gamification.xp} XP</span>
              </div>
            </div>

            {/* Stats */}
            <div className="flex-1 w-full">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400">Progress to {nextLevel ? nextLevel.name : "Max Level"}</span>
                <span className="text-sky-400 font-medium">{progress}%</span>
              </div>
              <div className="h-3 bg-[#1a1a2a] rounded-full overflow-hidden mb-4">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              {nextLevel && (
                <p className="text-sm text-gray-500">
                  {nextLevel.minXP - gamification.xp} XP needed for Level {nextLevel.level}
                </p>
              )}

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 text-sky-400 mb-1">
                    <Flame className="w-5 h-5" />
                    <span className="text-2xl font-bold">{gamification.streak}</span>
                  </div>
                  <p className="text-xs text-gray-500">Day Streak</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 text-sky-400 mb-1">
                    <Trophy className="w-5 h-5" />
                    <span className="text-2xl font-bold">{unlockedCount}</span>
                  </div>
                  <p className="text-xs text-gray-500">Badges</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 text-sky-400 mb-1">
                    <Zap className="w-5 h-5" />
                    <span className="text-2xl font-bold">{gamification.totalXPEarned}</span>
                  </div>
                  <p className="text-xs text-gray-500">Total XP</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Badges Grid */}
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-sky-400" />
          Badges ({unlockedCount}/{badges.length})
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-8">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={`relative bg-[#0d0d15] border rounded-xl p-4 text-center transition-all ${
                badge.unlocked
                  ? "border-blue-500/50 hover:border-blue-500"
                  : "border-[#1a1a2a] opacity-50 grayscale"
              }`}
            >
              {!badge.unlocked && (
                <div className="absolute top-2 right-2">
                  <Lock className="w-4 h-4 text-gray-600" />
                </div>
              )}
              <div className="text-4xl mb-2">{badge.icon}</div>
              <h3 className="font-semibold text-white text-sm mb-1">{badge.name}</h3>
              <p className="text-xs text-gray-500 mb-2">{badge.description}</p>
              <span className="text-xs text-sky-400">+{badge.xpReward} XP</span>
            </div>
          ))}
        </div>

        {/* Levels Progress */}
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-sky-400" />
          Level Progression
        </h2>

        <div className="bg-[#0d0d15] border border-[#1a1a2a] rounded-xl p-6">
          <div className="space-y-3">
            {LEVELS.map((level) => {
              const isCurrentLevel = currentLevel.level === level.level
              const isUnlocked = gamification.xp >= level.minXP

              return (
                <div
                  key={level.level}
                  className={`flex items-center gap-4 p-3 rounded-lg ${
                    isCurrentLevel ? "bg-blue-500/10 border border-blue-500/30" : ""
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                      isUnlocked
                        ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white"
                        : "bg-[#1a1a2a] text-gray-600"
                    }`}
                  >
                    {level.level}
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium ${isUnlocked ? "text-white" : "text-gray-600"}`}>{level.name}</p>
                    <p className="text-xs text-gray-500">{level.minXP} XP required</p>
                  </div>
                  {isCurrentLevel && (
                    <span className="px-2 py-1 bg-blue-500 text-white text-xs rounded-full">Current</span>
                  )}
                  {isUnlocked && !isCurrentLevel && <Star className="w-5 h-5 text-sky-400" />}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AchievementsPage() {
  return (
    <ProtectedRoute>
      <AchievementsContent />
    </ProtectedRoute>
  )
}
