"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Navbar from "@/components/navbar"
import ProtectedRoute from "@/components/protected-route"
import { PrimaryButton, SecondaryButton } from "@/components/ui/buttons"
import { saveQuizResult } from "@/lib/quiz-storage"
import { processQuizCompletion } from "@/lib/gamification"
import { addFlashcardsFromQuiz } from "@/lib/flashcards"
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  ArrowLeft,
  Trophy,
  Target,
  Brain,
  ChevronDown,
  ChevronUp,
  Zap,
  Flame,
  BookOpen,
} from "lucide-react"

// Mock AI feedback for wrong answers
const mockFeedback = {
  "Process Synchronization":
    "You may be confusing semaphores with simple variables. Remember, semaphores are specifically designed for synchronization and have atomic operations (wait and signal). They solve the critical section problem by controlling access to shared resources.",
  "CPU Scheduling":
    "This question tests your understanding of starvation. SJF can cause starvation because longer jobs may never execute if shorter jobs keep arriving. Consider reviewing the fairness aspects of different scheduling algorithms.",
  "Virtual Memory":
    "Thrashing is often confused with other memory issues. The key insight is that thrashing occurs when the system spends more time paging than executing. This happens when the working set exceeds available physical memory.",
  Deadlocks:
    "This is a tricky question about deadlock prevention vs. conditions. Mutual exclusion is actually a necessary condition for deadlock, not a prevention method. Prevention works by ensuring at least one necessary condition cannot hold.",
  "Memory Management":
    "Page tables are fundamental to virtual memory. Make sure you understand the relationship between virtual addresses, physical addresses, and how the page table serves as a mapping mechanism.",
  "Memory Allocation":
    "External fragmentation occurs when free memory is divided into small, non-contiguous blocks. Segmentation causes this because segments are variable-sized. Paging avoids external fragmentation by using fixed-size pages.",
  "Deadlock Avoidance":
    "The Banker's Algorithm is specifically for deadlock avoidance, not prevention. It works by checking if resource allocation would lead to a safe state before granting requests.",
  "Process States":
    "Process states are specific OS concepts. 'Compiling' is an action performed on source code, not a process state. Review the standard process state diagram: New, Ready, Running, Waiting, Terminated.",
  "Page Replacement":
    "FIFO is a simple acronym but understanding its implications for page replacement is important. It replaces the oldest page, which isn't always optimal since old pages might still be frequently used.",
  "Process Creation":
    "Unix process creation uses fork(), which creates an exact copy of the parent process. exec() is used to replace the process image. Understanding this fork-exec model is crucial.",
  "Critical Section Problem":
    "A critical section is code that accesses shared resources, not just slow code. The challenge is ensuring mutual exclusion while avoiding deadlock and starvation.",
  Threading:
    "Multi-threading's main benefits include resource sharing (threads share code and data) and improved responsiveness (other threads can run while one waits). Don't confuse this with simpler debugging, which is actually harder with threads.",
}

function ResultsContent() {
  const router = useRouter()
  const [results, setResults] = useState(null)
  const [expandedQuestions, setExpandedQuestions] = useState({})
  const [rewards, setRewards] = useState([])
  const [showRewards, setShowRewards] = useState(false)
  const [flashcardsCreated, setFlashcardsCreated] = useState(0)

  useEffect(() => {
    const storedResults = sessionStorage.getItem("quizResults")
    if (storedResults) {
      const parsedResults = JSON.parse(storedResults)
      setResults(parsedResults)

      const alreadySaved = sessionStorage.getItem("quizResultsSaved")
      if (!alreadySaved) {
        const { subject, questions, answers, timeSpent } = parsedResults

        let correctCount = 0
        const gaps = new Set()
        const wrongAnswers = []

        questions.forEach((q) => {
          if (answers[q.id] === q.correctAnswer) {
            correctCount++
          } else {
            gaps.add(q.concept)
            wrongAnswers.push({
              ...q,
              userAnswer: answers[q.id],
            })
          }
        })

        const quizResult = {
          subject,
          scorePercentage: Math.round((correctCount / questions.length) * 100),
          correctCount,
          totalQuestions: questions.length,
          gaps: Array.from(gaps),
          timeSpent: timeSpent || 0,
        }

        saveQuizResult(quizResult)

        const earnedRewards = processQuizCompletion(quizResult)
        setRewards(earnedRewards)
        if (earnedRewards.length > 0) {
          setShowRewards(true)
        }

        const newCards = addFlashcardsFromQuiz(wrongAnswers, subject)
        setFlashcardsCreated(newCards.length)

        sessionStorage.setItem("quizResultsSaved", "true")
      }
    } else {
      router.push("/dashboard")
    }
  }, [router])

  if (!results) {
    return (
      <div className="min-h-screen bg-[#050505]">
        <Navbar />
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
          <p className="text-gray-400">Loading results...</p>
        </div>
      </div>
    )
  }

  const { subject, questions, answers } = results

  let correctCount = 0
  const questionResults = questions.map((q) => {
    const userAnswer = answers[q.id]
    const isCorrect = userAnswer === q.correctAnswer
    if (isCorrect) correctCount++
    return {
      ...q,
      userAnswer,
      isCorrect,
    }
  })

  const scorePercentage = Math.round((correctCount / questions.length) * 100)

  const toggleExpand = (questionId) => {
    setExpandedQuestions((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }))
  }

  const gapsByConept = {}
  questionResults
    .filter((q) => !q.isCorrect)
    .forEach((q) => {
      if (!gapsByConept[q.concept]) {
        gapsByConept[q.concept] = []
      }
      gapsByConept[q.concept].push(q)
    })

  return (
    <div className="min-h-screen bg-[#050505]">
      <Navbar />

      {showRewards && rewards.length > 0 && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-[#0d0d15] border border-indigo-500/30 rounded-2xl p-6 max-w-md w-full animate-in fade-in zoom-in">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Rewards Earned!</h2>
            </div>

            <div className="space-y-3 mb-6">
              {rewards.map((reward, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-[#1a1a2a] rounded-lg">
                  {reward.type === "xp" && (
                    <>
                      <Zap className="w-5 h-5 text-indigo-400" />
                      <span className="text-white">+{reward.amount} XP</span>
                      <span className="text-gray-500 text-sm ml-auto">{reward.reason}</span>
                    </>
                  )}
                  {reward.type === "streak" && (
                    <>
                      <Flame className="w-5 h-5 text-orange-500" />
                      <span className="text-white">{reward.streak} Day Streak!</span>
                    </>
                  )}
                  {reward.type === "badge" && (
                    <>
                      <span className="text-2xl">{reward.badge.icon}</span>
                      <div>
                        <p className="text-white font-medium">{reward.badge.name}</p>
                        <p className="text-gray-500 text-xs">+{reward.xpEarned} XP</p>
                      </div>
                    </>
                  )}
                </div>
              ))}

              {flashcardsCreated > 0 && (
                <div className="flex items-center gap-3 p-3 bg-[#1a1a2a] rounded-lg">
                  <BookOpen className="w-5 h-5 text-sky-400" />
                  <span className="text-white">{flashcardsCreated} flashcards created</span>
                  <span className="text-gray-500 text-sm ml-auto">from wrong answers</span>
                </div>
              )}
            </div>

            <PrimaryButton className="w-full" onClick={() => setShowRewards(false)}>
              Continue
            </PrimaryButton>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Score Header */}
        <div className="bg-gradient-to-br from-[#0d0d15] to-[#15151f] border border-[#1a1a2a] rounded-2xl p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <p className="text-gray-400 mb-2">{subject} Quiz Results</p>
              <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2">
                You scored{" "}
                <span className="bg-gradient-to-r from-indigo-500 to-blue-500 bg-clip-text text-transparent">
                  {correctCount}/{questions.length}
                </span>
              </h1>
              <p className="text-gray-400">
                {scorePercentage >= 80
                  ? "Excellent work! You have a strong grasp of the concepts."
                  : scorePercentage >= 60
                    ? "Good effort! There are some areas to improve."
                    : "Keep practicing! Let's work on those gaps together."}
              </p>
            </div>

            <div className="relative w-32 h-32">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="64" cy="64" r="56" stroke="#1a1a2a" strokeWidth="8" fill="none" />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="url(#blueGradient)"
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${scorePercentage * 3.52} 352`}
                />
                <defs>
                  <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#9333ea" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold text-white">{scorePercentage}%</span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-[#1a1a2a]">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-2xl font-bold text-white">{correctCount}</span>
              </div>
              <p className="text-sm text-gray-400">Correct</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <XCircle className="w-5 h-5 text-red-500" />
                <span className="text-2xl font-bold text-white">{questions.length - correctCount}</span>
              </div>
              <p className="text-sm text-gray-400">Incorrect</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Target className="w-5 h-5 text-indigo-400" />
                <span className="text-2xl font-bold text-white">{Object.keys(gapsByConept).length}</span>
              </div>
              <p className="text-sm text-gray-400">Gaps Found</p>
            </div>
          </div>
        </div>

        {/* Gaps Summary */}
        {Object.keys(gapsByConept).length > 0 && (
          <div className="bg-[#0d0d15] border border-[#1a1a2a] rounded-2xl p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <h2 className="text-lg font-semibold text-white">Learning Gaps Detected</h2>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {Object.keys(gapsByConept).map((concept) => (
                <span
                  key={concept}
                  className="px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-sm text-amber-400"
                >
                  {concept} ({gapsByConept[concept].length})
                </span>
              ))}
            </div>
            {flashcardsCreated > 0 && (
              <Link
                href="/flashcards"
                className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 text-sm"
              >
                <BookOpen className="w-4 h-4" />
                Review {flashcardsCreated} new flashcards
              </Link>
            )}
          </div>
        )}

        {/* Detailed Analysis */}
        <h2 className="text-xl font-semibold text-white mb-4">Detailed Analysis</h2>

        <div className="space-y-4">
          {questionResults.map((q, index) => (
            <div
              key={q.id}
              className={`bg-[#0d0d15] border rounded-xl overflow-hidden ${
                q.isCorrect ? "border-green-500/30" : "border-red-500/30"
              }`}
            >
              <div className="p-4 cursor-pointer" onClick={() => !q.isCorrect && toggleExpand(q.id)}>
                <div className="flex items-start gap-3">
                  {q.isCorrect ? (
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                  )}

                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span className="text-sm text-gray-400">Question {index + 1}</span>
                        <p className="text-white mt-1">{q.question}</p>
                        <span className="inline-block mt-2 px-2 py-0.5 bg-[#1a1a2a] rounded text-xs text-gray-400">
                          {q.concept}
                        </span>
                      </div>

                      {!q.isCorrect && (
                        <button className="text-gray-400 hover:text-white transition-colors">
                          {expandedQuestions[q.id] ? (
                            <ChevronUp className="w-5 h-5" />
                          ) : (
                            <ChevronDown className="w-5 h-5" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Expanded Gap Analysis */}
              {!q.isCorrect && expandedQuestions[q.id] && (
                <div className="px-4 pb-4 pt-0 border-t border-[#1a1a2a]">
                  <div className="mt-4 space-y-4">
                    <div className="flex gap-4">
                      <div className="flex-1 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                        <p className="text-xs text-red-400 mb-1">Your Answer</p>
                        <p className="text-white text-sm">{q.options[q.userAnswer]?.substring(3) || "Not answered"}</p>
                      </div>
                      <div className="flex-1 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                        <p className="text-xs text-green-400 mb-1">Correct Answer</p>
                        <p className="text-white text-sm">{q.options[q.correctAnswer].substring(3)}</p>
                      </div>
                    </div>

                    <div className="p-4 bg-indigo-500/10 border border-indigo-500/30 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Brain className="w-4 h-4 text-indigo-400" />
                        <p className="text-sm font-medium text-indigo-400">AI Feedback</p>
                      </div>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        {mockFeedback[q.concept] ||
                          "This concept requires more practice. Review the related materials and try again."}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Link href="/dashboard" className="flex-1">
            <SecondaryButton className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </SecondaryButton>
          </Link>
          <Link href={`/quiz/${subject.toLowerCase().replace(/ /g, "-")}`} className="flex-1">
            <PrimaryButton className="w-full">
              <Trophy className="w-4 h-4 mr-2" />
              Retry Quiz
            </PrimaryButton>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function ResultsPage() {
  return (
    <ProtectedRoute>
      <ResultsContent />
    </ProtectedRoute>
  )
}
