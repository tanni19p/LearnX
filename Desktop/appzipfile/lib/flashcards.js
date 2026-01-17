// Flashcard system with spaced repetition
import { getUserKey } from "./auth"

export function getFlashcards() {
  if (typeof window === "undefined") return []
  const storageKey = getUserKey("flashcards")
  const stored = localStorage.getItem(storageKey)
  return stored ? JSON.parse(stored) : []
}

export function saveFlashcards(flashcards) {
  const storageKey = getUserKey("flashcards")
  localStorage.setItem(storageKey, JSON.stringify(flashcards))
}

export function addFlashcard(card) {
  const flashcards = getFlashcards()
  const newCard = {
    id: Date.now(),
    ...card,
    createdAt: new Date().toISOString(),
    nextReview: new Date().toISOString(),
    interval: 1, // days
    easeFactor: 2.5,
    repetitions: 0,
    lastReviewed: null,
  }
  flashcards.push(newCard)
  saveFlashcards(flashcards)
  return newCard
}

export function addFlashcardsFromQuiz(wrongAnswers, subject) {
  const flashcards = getFlashcards()
  const newCards = []

  wrongAnswers.forEach((q) => {
    // Check if flashcard already exists for this question
    const exists = flashcards.some(
      (f) => f.question === q.question || (f.concept === q.concept && f.subject === subject),
    )

    if (!exists) {
      const newCard = {
        id: Date.now() + Math.random(),
        subject,
        concept: q.concept,
        question: q.question,
        answer: q.options[q.correctAnswer],
        userAnswer: q.options[q.userAnswer] || "Not answered",
        createdAt: new Date().toISOString(),
        nextReview: new Date().toISOString(),
        interval: 1,
        easeFactor: 2.5,
        repetitions: 0,
        lastReviewed: null,
      }
      newCards.push(newCard)
      flashcards.push(newCard)
    }
  })

  saveFlashcards(flashcards)
  return newCards
}

export function getDueFlashcards() {
  const flashcards = getFlashcards()
  const now = new Date()
  return flashcards.filter((card) => new Date(card.nextReview) <= now)
}

export function getFlashcardsBySubject(subject) {
  const flashcards = getFlashcards()
  return flashcards.filter((card) => card.subject === subject)
}

// Spaced repetition algorithm (SM-2 variant)
export function reviewFlashcard(cardId, quality) {
  // quality: 0 = complete blackout, 1 = wrong, 2 = hard, 3 = good, 4 = easy
  const flashcards = getFlashcards()
  const cardIndex = flashcards.findIndex((c) => c.id === cardId)

  if (cardIndex === -1) return null

  const card = flashcards[cardIndex]

  if (quality < 2) {
    // Reset if answer was wrong
    card.repetitions = 0
    card.interval = 1
  } else {
    if (card.repetitions === 0) {
      card.interval = 1
    } else if (card.repetitions === 1) {
      card.interval = 3
    } else {
      card.interval = Math.round(card.interval * card.easeFactor)
    }
    card.repetitions += 1
  }

  // Update ease factor
  card.easeFactor = Math.max(1.3, card.easeFactor + (0.1 - (4 - quality) * (0.08 + (4 - quality) * 0.02)))

  // Set next review date
  const nextReview = new Date()
  nextReview.setDate(nextReview.getDate() + card.interval)
  card.nextReview = nextReview.toISOString()
  card.lastReviewed = new Date().toISOString()

  flashcards[cardIndex] = card
  saveFlashcards(flashcards)

  return card
}

export function deleteFlashcard(cardId) {
  const flashcards = getFlashcards()
  const filtered = flashcards.filter((c) => c.id !== cardId)
  saveFlashcards(filtered)
}

export function getFlashcardStats() {
  const flashcards = getFlashcards()
  const due = getDueFlashcards()

  const bySubject = {}
  flashcards.forEach((card) => {
    if (!bySubject[card.subject]) {
      bySubject[card.subject] = { total: 0, mastered: 0 }
    }
    bySubject[card.subject].total += 1
    if (card.repetitions >= 3) {
      bySubject[card.subject].mastered += 1
    }
  })

  return {
    total: flashcards.length,
    due: due.length,
    mastered: flashcards.filter((c) => c.repetitions >= 3).length,
    bySubject,
  }
}
