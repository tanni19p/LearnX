// Gamification system - XP, Levels, Streaks, and Badges

import { getUserKey } from "./auth"

const BADGES = [
  { id: "first_quiz", name: "First Steps", description: "Complete your first quiz", icon: "🎯", xpReward: 50 },
  { id: "perfect_score", name: "Perfectionist", description: "Score 100% on any quiz", icon: "💯", xpReward: 100 },
  { id: "streak_3", name: "On Fire", description: "Maintain a 3-day streak", icon: "🔥", xpReward: 75 },
  { id: "streak_7", name: "Dedicated Learner", description: "Maintain a 7-day streak", icon: "⚡", xpReward: 150 },
  { id: "streak_30", name: "Unstoppable", description: "Maintain a 30-day streak", icon: "🌟", xpReward: 500 },
  { id: "quizzes_5", name: "Getting Started", description: "Complete 5 quizzes", icon: "📚", xpReward: 100 },
  { id: "quizzes_25", name: "Quiz Master", description: "Complete 25 quizzes", icon: "🏆", xpReward: 250 },
  { id: "quizzes_100", name: "Legend", description: "Complete 100 quizzes", icon: "👑", xpReward: 1000 },
  {
    id: "all_subjects",
    name: "Well Rounded",
    description: "Complete a quiz in all subjects",
    icon: "🎓",
    xpReward: 200,
  },
  {
    id: "improver",
    name: "Improver",
    description: "Improve your score in any subject by 20%",
    icon: "📈",
    xpReward: 150,
  },
  { id: "flashcard_master", name: "Flash Master", description: "Review 50 flashcards", icon: "⚡", xpReward: 100 },
  {
    id: "no_gaps",
    name: "Gap Closer",
    description: "Score 80%+ after having gaps in a subject",
    icon: "🔒",
    xpReward: 200,
  },
]

const LEVELS = [
  { level: 1, name: "Beginner", minXP: 0 },
  { level: 2, name: "Learner", minXP: 100 },
  { level: 3, name: "Student", minXP: 300 },
  { level: 4, name: "Scholar", minXP: 600 },
  { level: 5, name: "Expert", minXP: 1000 },
  { level: 6, name: "Master", minXP: 1500 },
  { level: 7, name: "Grandmaster", minXP: 2200 },
  { level: 8, name: "Legend", minXP: 3000 },
  { level: 9, name: "Mythic", minXP: 4000 },
  { level: 10, name: "Transcendent", minXP: 5500 },
]

export function getGamificationData() {
  if (typeof window === "undefined") return getDefaultData()
  const storageKey = getUserKey("gamification")
  const stored = localStorage.getItem(storageKey)
  return stored ? JSON.parse(stored) : getDefaultData()
}

function getDefaultData() {
  return {
    xp: 0,
    totalXPEarned: 0,
    unlockedBadges: [],
    streak: 0,
    lastActivityDate: null,
    flashcardsReviewed: 0,
    subjectsCompleted: [],
  }
}

function saveGamificationData(data) {
  const storageKey = getUserKey("gamification")
  localStorage.setItem(storageKey, JSON.stringify(data))
}

export function getCurrentLevel(xp) {
  let currentLevel = LEVELS[0]
  for (const level of LEVELS) {
    if (xp >= level.minXP) {
      currentLevel = level
    } else {
      break
    }
  }
  return currentLevel
}

export function getNextLevel(xp) {
  for (const level of LEVELS) {
    if (xp < level.minXP) {
      return level
    }
  }
  return null // Max level reached
}

export function getXPProgress(xp) {
  const current = getCurrentLevel(xp)
  const next = getNextLevel(xp)
  if (!next) return 100
  const xpInLevel = xp - current.minXP
  const xpNeeded = next.minXP - current.minXP
  return Math.round((xpInLevel / xpNeeded) * 100)
}

export function addXP(amount, reason) {
  const data = getGamificationData()
  data.xp += amount
  data.totalXPEarned += amount
  saveGamificationData(data)
  return { newXP: data.xp, added: amount, reason }
}

export function updateStreak() {
  const data = getGamificationData()
  const today = new Date().toDateString()
  const lastActivity = data.lastActivityDate

  if (lastActivity === today) {
    return { streak: data.streak, isNew: false }
  }

  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)

  if (lastActivity === yesterday.toDateString()) {
    data.streak += 1
  } else if (lastActivity !== today) {
    data.streak = 1
  }

  data.lastActivityDate = today
  saveGamificationData(data)

  // Check streak badges
  checkAndUnlockBadge("streak_3", data.streak >= 3)
  checkAndUnlockBadge("streak_7", data.streak >= 7)
  checkAndUnlockBadge("streak_30", data.streak >= 30)

  return { streak: data.streak, isNew: true }
}

export function checkAndUnlockBadge(badgeId, condition) {
  if (!condition) return null

  const data = getGamificationData()
  if (data.unlockedBadges.includes(badgeId)) return null

  const badge = BADGES.find((b) => b.id === badgeId)
  if (!badge) return null

  data.unlockedBadges.push(badgeId)
  data.xp += badge.xpReward
  data.totalXPEarned += badge.xpReward
  saveGamificationData(data)

  return { badge, xpEarned: badge.xpReward }
}

export function processQuizCompletion(quizResult) {
  const rewards = []
  const data = getGamificationData()

  // Base XP for completing quiz
  const baseXP = 25
  const scoreBonus = Math.round(quizResult.scorePercentage * 0.5)
  const totalQuizXP = baseXP + scoreBonus
  addXP(totalQuizXP, "Quiz completion")
  rewards.push({ type: "xp", amount: totalQuizXP, reason: "Quiz completed" })

  // Update streak
  const streakResult = updateStreak()
  if (streakResult.isNew && streakResult.streak > 1) {
    rewards.push({ type: "streak", streak: streakResult.streak })
  }

  // Track subject
  if (!data.subjectsCompleted.includes(quizResult.subject)) {
    data.subjectsCompleted.push(quizResult.subject)
    saveGamificationData(data)
  }

  // Check badges
  const storageKey = getUserKey("quizHistory")
  const quizHistory = JSON.parse(localStorage.getItem(storageKey) || "[]")
  const totalQuizzes = quizHistory.length

  // First quiz
  const firstQuiz = checkAndUnlockBadge("first_quiz", totalQuizzes >= 1)
  if (firstQuiz) rewards.push({ type: "badge", ...firstQuiz })

  // Perfect score
  const perfect = checkAndUnlockBadge("perfect_score", quizResult.scorePercentage === 100)
  if (perfect) rewards.push({ type: "badge", ...perfect })

  // Quiz count badges
  const q5 = checkAndUnlockBadge("quizzes_5", totalQuizzes >= 5)
  if (q5) rewards.push({ type: "badge", ...q5 })

  const q25 = checkAndUnlockBadge("quizzes_25", totalQuizzes >= 25)
  if (q25) rewards.push({ type: "badge", ...q25 })

  const q100 = checkAndUnlockBadge("quizzes_100", totalQuizzes >= 100)
  if (q100) rewards.push({ type: "badge", ...q100 })

  // All subjects
  const allSubjects = ["Operating Systems", "DBMS", "Data Structures", "Computer Networks"]
  const completedAll = allSubjects.every((s) => data.subjectsCompleted.includes(s))
  const allSubjectsBadge = checkAndUnlockBadge("all_subjects", completedAll)
  if (allSubjectsBadge) rewards.push({ type: "badge", ...allSubjectsBadge })

  return rewards
}

export function getAllBadges() {
  const data = getGamificationData()
  return BADGES.map((badge) => ({
    ...badge,
    unlocked: data.unlockedBadges.includes(badge.id),
  }))
}

export function incrementFlashcardsReviewed() {
  const data = getGamificationData()
  data.flashcardsReviewed += 1
  saveGamificationData(data)

  // Check flashcard badge
  checkAndUnlockBadge("flashcard_master", data.flashcardsReviewed >= 50)

  // Give small XP for flashcard review
  if (data.flashcardsReviewed % 5 === 0) {
    addXP(10, "Flashcard review milestone")
  }

  return data.flashcardsReviewed
}

export { BADGES, LEVELS }
