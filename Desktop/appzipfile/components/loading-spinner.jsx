"use client"

import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"

const loadingMessages = [
  "Analyzing Syllabus...",
  "Drafting Questions...",
  "Preparing Distractors...",
  "Generating Options...",
  "Almost Ready...",
]

export default function LoadingSpinner() {
  const [messageIndex, setMessageIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loadingMessages.length)
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-6">
      <div className="relative">
        <div className="w-20 h-20 border-4 border-[#1a1a2a] rounded-full" />
        <div className="absolute top-0 left-0 w-20 h-20 border-4 border-purple-500 rounded-full border-t-transparent animate-spin" />
        <Loader2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-purple-500 animate-pulse" />
      </div>

      <div className="text-center">
        <p className="text-lg font-medium text-white animate-pulse">{loadingMessages[messageIndex]}</p>
        <p className="text-sm text-gray-500 mt-2">This may take a few seconds</p>
      </div>

      <div className="w-64 h-2 bg-[#1a1a2a] rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-purple-600 to-pink-500 rounded-full animate-progress" />
      </div>

      <style jsx>{`
        @keyframes progress {
          0% {
            width: 0%;
          }
          100% {
            width: 100%;
          }
        }
        .animate-progress {
          animation: progress 10s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
