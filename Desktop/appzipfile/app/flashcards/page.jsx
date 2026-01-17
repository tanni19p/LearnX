"use client"

import { useState, useEffect } from "react"
import Navbar from "@/components/navbar"
import ProtectedRoute from "@/components/protected-route"
import { PrimaryButton } from "@/components/ui/buttons"
import { getFlashcards, getDueFlashcards, reviewFlashcard, deleteFlashcard, getFlashcardStats } from "@/lib/flashcards"
import { incrementFlashcardsReviewed } from "@/lib/gamification"
import { BookOpen, RotateCcw, Trash2, ChevronLeft, Check, X, Brain, Clock, Layers, Sparkles } from "lucide-react"

function FlashcardsContent() {
  const [flashcards, setFlashcards] = useState([])
  const [dueCards, setDueCards] = useState([])
  const [stats, setStats] = useState(null)
  const [mode, setMode] = useState("overview") // overview, review, browse
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [filter, setFilter] = useState("all")

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    setFlashcards(getFlashcards())
    setDueCards(getDueFlashcards())
    setStats(getFlashcardStats())
  }

  const handleReview = (quality) => {
    const card = dueCards[currentIndex]
    reviewFlashcard(card.id, quality)
    incrementFlashcardsReviewed()

    setShowAnswer(false)

    if (currentIndex < dueCards.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      setMode("overview")
      loadData()
    }
  }

  const handleDelete = (cardId) => {
    deleteFlashcard(cardId)
    loadData()
  }

  const filteredCards = filter === "all" ? flashcards : flashcards.filter((c) => c.subject === filter)

  const subjects = [...new Set(flashcards.map((c) => c.subject))]

  if (mode === "review" && dueCards.length > 0) {
    const card = dueCards[currentIndex]

    return (
      <div className="min-h-screen bg-[#050505]">
        <Navbar />

        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => {
                setMode("overview")
                setShowAnswer(false)
                setCurrentIndex(0)
              }}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              Exit Review
            </button>
            <span className="text-gray-400">
              {currentIndex + 1} / {dueCards.length}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="h-2 bg-[#1a1a2a] rounded-full mb-8 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-600 to-blue-600 transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / dueCards.length) * 100}%` }}
            />
          </div>

          {/* Flashcard */}
          <div
            className="bg-[#0d0d15] border border-[#1a1a2a] rounded-2xl p-8 min-h-[300px] flex flex-col cursor-pointer transition-all hover:border-indigo-500/30"
            onClick={() => setShowAnswer(!showAnswer)}
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="px-2 py-1 bg-indigo-500/20 text-indigo-400 text-xs rounded">{card.subject}</span>
              <span className="px-2 py-1 bg-[#1a1a2a] text-gray-400 text-xs rounded">{card.concept}</span>
            </div>

            <div className="flex-1 flex flex-col justify-center">
              <p className="text-lg text-white mb-4">{card.question}</p>

              {showAnswer && (
                <div className="mt-4 pt-4 border-t border-[#1a1a2a]">
                  <p className="text-sm text-gray-400 mb-2">Correct Answer:</p>
                  <p className="text-green-400 font-medium">{card.answer}</p>

                  {card.userAnswer && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-400 mb-2">Your Previous Answer:</p>
                      <p className="text-red-400">{card.userAnswer}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {!showAnswer && <p className="text-center text-gray-500 text-sm">Tap to reveal answer</p>}
          </div>

          {/* Rating Buttons */}
          {showAnswer && (
            <div className="mt-6">
              <p className="text-center text-gray-400 mb-4">How well did you know this?</p>
              <div className="grid grid-cols-4 gap-3">
                <button
                  onClick={() => handleReview(0)}
                  className="p-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400 hover:bg-red-500/30 transition-colors"
                >
                  <X className="w-5 h-5 mx-auto mb-1" />
                  <span className="text-xs">Forgot</span>
                </button>
                <button
                  onClick={() => handleReview(2)}
                  className="p-3 bg-orange-500/20 border border-orange-500/30 rounded-xl text-orange-400 hover:bg-orange-500/30 transition-colors"
                >
                  <RotateCcw className="w-5 h-5 mx-auto mb-1" />
                  <span className="text-xs">Hard</span>
                </button>
                <button
                  onClick={() => handleReview(3)}
                  className="p-3 bg-green-500/20 border border-green-500/30 rounded-xl text-green-400 hover:bg-green-500/30 transition-colors"
                >
                  <Check className="w-5 h-5 mx-auto mb-1" />
                  <span className="text-xs">Good</span>
                </button>
                <button
                  onClick={() => handleReview(4)}
                  className="p-3 bg-indigo-500/20 border border-indigo-500/30 rounded-xl text-indigo-400 hover:bg-indigo-500/30 transition-colors"
                >
                  <Sparkles className="w-5 h-5 mx-auto mb-1" />
                  <span className="text-xs">Easy</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#050505]">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">Flashcards</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#0d0d15] border border-[#1a1a2a] rounded-xl p-4">
            <div className="flex items-center gap-2 text-indigo-400 mb-2">
              <Layers className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-white">{stats?.total || 0}</p>
            <p className="text-xs text-gray-500">Total Cards</p>
          </div>
          <div className="bg-[#0d0d15] border border-[#1a1a2a] rounded-xl p-4">
            <div className="flex items-center gap-2 text-amber-400 mb-2">
              <Clock className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-white">{stats?.due || 0}</p>
            <p className="text-xs text-gray-500">Due for Review</p>
          </div>
          <div className="bg-[#0d0d15] border border-[#1a1a2a] rounded-xl p-4">
            <div className="flex items-center gap-2 text-green-400 mb-2">
              <Check className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-white">{stats?.mastered || 0}</p>
            <p className="text-xs text-gray-500">Mastered</p>
          </div>
          <div className="bg-[#0d0d15] border border-[#1a1a2a] rounded-xl p-4">
            <div className="flex items-center gap-2 text-sky-400 mb-2">
              <Brain className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-white">{subjects.length}</p>
            <p className="text-xs text-gray-500">Subjects</p>
          </div>
        </div>

        {/* Start Review Button */}
        {dueCards.length > 0 && (
          <div className="bg-gradient-to-r from-indigo-600/20 to-blue-600/20 border border-indigo-500/30 rounded-xl p-6 mb-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-white mb-1">{dueCards.length} cards due for review</h2>
                <p className="text-gray-400 text-sm">Regular review helps you remember concepts better</p>
              </div>
              <PrimaryButton
                onClick={() => {
                  setMode("review")
                  setCurrentIndex(0)
                  setShowAnswer(false)
                }}
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Start Review
              </PrimaryButton>
            </div>
          </div>
        )}

        {/* Empty State */}
        {flashcards.length === 0 && (
          <div className="bg-[#0d0d15] border border-[#1a1a2a] rounded-xl p-12 text-center">
            <BookOpen className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No flashcards yet</h3>
            <p className="text-gray-400 mb-4">
              Flashcards are automatically created from questions you get wrong in quizzes.
            </p>
            <a href="/dashboard">
              <PrimaryButton>Take a Quiz</PrimaryButton>
            </a>
          </div>
        )}

        {/* Browse Cards */}
        {flashcards.length > 0 && (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">All Cards</h2>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="bg-[#0d0d15] border border-[#1a1a2a] rounded-lg px-3 py-2 text-white text-sm"
              >
                <option value="all">All Subjects</option>
                {subjects.map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-3">
              {filteredCards.map((card) => (
                <div
                  key={card.id}
                  className="bg-[#0d0d15] border border-[#1a1a2a] rounded-xl p-4 hover:border-indigo-500/30 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-400 text-xs rounded">
                          {card.subject}
                        </span>
                        <span className="px-2 py-0.5 bg-[#1a1a2a] text-gray-400 text-xs rounded">{card.concept}</span>
                        {card.repetitions >= 3 && (
                          <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded">Mastered</span>
                        )}
                      </div>
                      <p className="text-white text-sm mb-2">{card.question}</p>
                      <p className="text-gray-500 text-sm">
                        <span className="text-green-400">Answer:</span> {card.answer}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDelete(card.id)}
                      className="p-2 text-gray-500 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default function FlashcardsPage() {
  return (
    <ProtectedRoute>
      <FlashcardsContent />
    </ProtectedRoute>
  )
}
