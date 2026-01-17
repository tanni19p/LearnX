"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Navbar from "@/components/navbar"
import LoadingSpinner from "@/components/loading-spinner"
import ProtectedRoute from "@/components/protected-route"
import { PrimaryButton, SecondaryButton } from "@/components/ui/buttons"
import { ChevronLeft, ChevronRight, Clock, CheckCircle } from "lucide-react"

// Mock questions data
const mockQuestions = [
  {
    id: 1,
    question: "What is the main purpose of a semaphore in operating systems?",
    options: [
      "A) To store data temporarily",
      "B) To synchronize processes and manage resource access",
      "C) To schedule CPU time",
      "D) To manage memory allocation",
    ],
    correctAnswer: 1,
    concept: "Process Synchronization",
  },
  {
    id: 2,
    question: "Which scheduling algorithm may cause starvation?",
    options: ["A) Round Robin", "B) First Come First Serve", "C) Shortest Job First", "D) None of the above"],
    correctAnswer: 2,
    concept: "CPU Scheduling",
  },
  {
    id: 3,
    question: "What is thrashing in the context of memory management?",
    options: [
      "A) A process running too fast",
      "B) Excessive paging activity degrading performance",
      "C) Memory corruption",
      "D) Cache overflow",
    ],
    correctAnswer: 1,
    concept: "Virtual Memory",
  },
  {
    id: 4,
    question: "Which of the following is NOT a valid deadlock prevention method?",
    options: ["A) Mutual exclusion", "B) Hold and wait", "C) Preemption", "D) Circular wait"],
    correctAnswer: 0,
    concept: "Deadlocks",
  },
  {
    id: 5,
    question: "What is the purpose of a page table?",
    options: [
      "A) To store process IDs",
      "B) To map virtual addresses to physical addresses",
      "C) To manage file systems",
      "D) To schedule I/O operations",
    ],
    correctAnswer: 1,
    concept: "Memory Management",
  },
  {
    id: 6,
    question: "Which memory allocation strategy can lead to external fragmentation?",
    options: ["A) Paging", "B) Segmentation", "C) Virtual Memory", "D) Both A and B"],
    correctAnswer: 1,
    concept: "Memory Allocation",
  },
  {
    id: 7,
    question: "What is the Banker's Algorithm used for?",
    options: ["A) Memory management", "B) Deadlock avoidance", "C) Process scheduling", "D) File management"],
    correctAnswer: 1,
    concept: "Deadlock Avoidance",
  },
  {
    id: 8,
    question: "Which is NOT a process state in a typical OS?",
    options: ["A) Running", "B) Waiting", "C) Sleeping", "D) Compiling"],
    correctAnswer: 3,
    concept: "Process States",
  },
  {
    id: 9,
    question: "What does FIFO stand for in the context of page replacement?",
    options: [
      "A) First In First Out",
      "B) Fast Input Fast Output",
      "C) File Input File Output",
      "D) Final Input Final Output",
    ],
    correctAnswer: 0,
    concept: "Page Replacement",
  },
  {
    id: 10,
    question: "Which system call creates a new process in UNIX?",
    options: ["A) create()", "B) new()", "C) fork()", "D) spawn()"],
    correctAnswer: 2,
    concept: "Process Creation",
  },
  {
    id: 11,
    question: "What is a critical section?",
    options: [
      "A) A section of code that runs slowly",
      "B) A section of code that accesses shared resources",
      "C) A section of code that cannot be compiled",
      "D) A section of code that handles errors",
    ],
    correctAnswer: 1,
    concept: "Critical Section Problem",
  },
  {
    id: 12,
    question: "Which of the following is a preemptive scheduling algorithm?",
    options: ["A) FCFS", "B) SJF (non-preemptive)", "C) Round Robin", "D) Priority (non-preemptive)"],
    correctAnswer: 2,
    concept: "CPU Scheduling",
  },
  {
    id: 13,
    question: "What is the purpose of a Translation Lookaside Buffer (TLB)?",
    options: [
      "A) To speed up virtual to physical address translation",
      "B) To store frequently used files",
      "C) To manage network packets",
      "D) To schedule disk operations",
    ],
    correctAnswer: 0,
    concept: "Memory Management",
  },
  {
    id: 14,
    question: "What is the role of the dispatcher in process scheduling?",
    options: [
      "A) To select the next process to run",
      "B) To actually give control of the CPU to the process",
      "C) To terminate processes",
      "D) To allocate memory",
    ],
    correctAnswer: 1,
    concept: "Process Scheduling",
  },
  {
    id: 15,
    question: "Which condition is NOT required for deadlock?",
    options: ["A) Mutual Exclusion", "B) Hold and Wait", "C) Preemption", "D) Circular Wait"],
    correctAnswer: 2,
    concept: "Deadlock Conditions",
  },
  {
    id: 16,
    question: "What is the working set of a process?",
    options: [
      "A) The total memory allocated to it",
      "B) The set of pages it is currently using",
      "C) The set of files it has opened",
      "D) The set of threads it has spawned",
    ],
    correctAnswer: 1,
    concept: "Virtual Memory",
  },
  {
    id: 17,
    question: "What does PCB stand for?",
    options: [
      "A) Process Control Block",
      "B) Program Counter Block",
      "C) Process Communication Buffer",
      "D) Program Control Base",
    ],
    correctAnswer: 0,
    concept: "Process Management",
  },
  {
    id: 18,
    question: "Which page replacement algorithm is optimal?",
    options: ["A) FIFO", "B) LRU", "C) Optimal (OPT)", "D) Clock"],
    correctAnswer: 2,
    concept: "Page Replacement",
  },
  {
    id: 19,
    question: "What is a zombie process?",
    options: [
      "A) A process that consumes all CPU",
      "B) A process that has completed but whose parent hasn't read its exit status",
      "C) A process stuck in an infinite loop",
      "D) A process with corrupted memory",
    ],
    correctAnswer: 1,
    concept: "Process States",
  },
  {
    id: 20,
    question: "What is the main advantage of multi-threading?",
    options: [
      "A) Increased security",
      "B) Better resource sharing and responsiveness",
      "C) Simpler debugging",
      "D) Reduced memory usage",
    ],
    correctAnswer: 1,
    concept: "Threading",
  },
]

function QuizContent() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [questions, setQuestions] = useState([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState({})

  const subjectName = params.subject
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")

  useEffect(() => {
    const timer = setTimeout(() => {
      setQuestions(mockQuestions)
      setLoading(false)
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  const handleOptionSelect = (optionIndex) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questions[currentQuestionIndex].id]: optionIndex,
    })
  }

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const handleSubmit = () => {
    const results = {
      subject: subjectName,
      questions: questions,
      answers: selectedAnswers,
    }
    sessionStorage.setItem("quizResults", JSON.stringify(results))
    router.push("/results")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505]">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">{subjectName}</h1>
            <p className="text-gray-400">Preparing your personalized quiz...</p>
          </div>
          <LoadingSpinner />
        </div>
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]
  const isLastQuestion = currentQuestionIndex === questions.length - 1
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100

  return (
    <div className="min-h-screen bg-[#050505]">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-white">{subjectName}</h1>
            <p className="text-gray-400 text-sm">
              Question {currentQuestionIndex + 1} of {questions.length}
            </p>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <Clock className="w-4 h-4" />
            <span className="text-sm">In Progress</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-[#1a1a2a] rounded-full mb-8 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-600 to-pink-500 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Question Card */}
        <div className="bg-[#0d0d15] border border-[#1a1a2a] rounded-2xl p-8 mb-6">
          <div className="flex items-start gap-4 mb-8">
            <span className="flex-shrink-0 w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-400 font-bold">
              {currentQuestionIndex + 1}
            </span>
            <h2 className="text-xl text-white leading-relaxed">{currentQuestion.question}</h2>
          </div>

          {/* Options */}
          <div className="space-y-4">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedAnswers[currentQuestion.id] === index

              return (
                <button
                  key={index}
                  onClick={() => handleOptionSelect(index)}
                  className={`w-full p-4 rounded-xl text-left transition-all ${
                    isSelected
                      ? "bg-purple-600 border-2 border-purple-600 text-white"
                      : "bg-[#1a1a2a] border-2 border-[#2a2a3a] text-gray-300 hover:border-purple-500/50 hover:bg-[#1a1a2a]/80"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-8 h-8 rounded-lg flex items-center justify-center font-medium ${
                        isSelected ? "bg-white/20 text-white" : "bg-[#2a2a3a] text-gray-400"
                      }`}
                    >
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span>{option.substring(3)}</span>
                    {isSelected && <CheckCircle className="w-5 h-5 ml-auto" />}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <SecondaryButton onClick={handlePrevious} disabled={currentQuestionIndex === 0}>
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </SecondaryButton>

          {isLastQuestion ? (
            <PrimaryButton onClick={handleSubmit} disabled={Object.keys(selectedAnswers).length < questions.length}>
              Submit Quiz
            </PrimaryButton>
          ) : (
            <PrimaryButton onClick={handleNext}>
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </PrimaryButton>
          )}
        </div>

        {/* Question Navigator */}
        <div className="mt-8 p-4 bg-[#0d0d15] border border-[#1a1a2a] rounded-xl">
          <p className="text-sm text-gray-400 mb-3">Question Navigator</p>
          <div className="flex flex-wrap gap-2">
            {questions.map((_, index) => {
              const isAnswered = selectedAnswers[questions[index].id] !== undefined
              const isCurrent = index === currentQuestionIndex

              return (
                <button
                  key={index}
                  onClick={() => setCurrentQuestionIndex(index)}
                  className={`w-10 h-10 rounded-lg font-medium transition-all ${
                    isCurrent
                      ? "bg-purple-600 text-white"
                      : isAnswered
                        ? "bg-purple-500/20 text-purple-400 border border-purple-500"
                        : "bg-[#1a1a2a] text-gray-400 hover:bg-[#2a2a3a]"
                  }`}
                >
                  {index + 1}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function QuizPage() {
  return (
    <ProtectedRoute>
      <QuizContent />
    </ProtectedRoute>
  )
}
