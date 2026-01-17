// Helper functions to manage quiz results in localStorage
import { getUserKey } from "./auth"

export function saveQuizResult(result) {
  const existing = getQuizHistory()
  const newResult = {
    ...result,
    id: Date.now(),
    date: new Date().toISOString(),
  }
  const updated = [newResult, ...existing]
  const storageKey = getUserKey("quizHistory")
  localStorage.setItem(storageKey, JSON.stringify(updated))
  return newResult
}

export function getQuizHistory() {
  if (typeof window === "undefined") return []
  const storageKey = getUserKey("quizHistory")
  const stored = localStorage.getItem(storageKey)
  return stored ? JSON.parse(stored) : []
}

export function getStats() {
  const history = getQuizHistory()

  if (history.length === 0) {
    return {
      totalQuizzes: 0,
      avgScore: null,
      totalTime: 0,
      bestScore: null,
      subjectStats: {},
    }
  }

  const totalQuizzes = history.length
  const avgScore = Math.round(history.reduce((acc, q) => acc + q.scorePercentage, 0) / totalQuizzes)
  const totalTime = history.reduce((acc, q) => acc + (q.timeSpent || 0), 0)
  const bestScore = Math.max(...history.map((q) => q.scorePercentage))

  // Group by subject
  const subjectStats = {}
  history.forEach((quiz) => {
    if (!subjectStats[quiz.subject]) {
      subjectStats[quiz.subject] = {
        attempts: 0,
        totalScore: 0,
        bestScore: 0,
        gaps: new Set(),
      }
    }
    subjectStats[quiz.subject].attempts++
    subjectStats[quiz.subject].totalScore += quiz.scorePercentage
    subjectStats[quiz.subject].bestScore = Math.max(subjectStats[quiz.subject].bestScore, quiz.scorePercentage)
    quiz.gaps?.forEach((gap) => subjectStats[quiz.subject].gaps.add(gap))
  })

  // Convert Set to Array for serialization
  Object.keys(subjectStats).forEach((subject) => {
    subjectStats[subject].gaps = Array.from(subjectStats[subject].gaps)
    subjectStats[subject].avgScore = Math.round(subjectStats[subject].totalScore / subjectStats[subject].attempts)
  })

  return {
    totalQuizzes,
    avgScore,
    totalTime,
    bestScore,
    subjectStats,
  }
}

export function clearHistory() {
  const storageKey = getUserKey("quizHistory")
  localStorage.removeItem(storageKey)
}
