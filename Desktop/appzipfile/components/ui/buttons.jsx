"use client"

export function PrimaryButton({ children, onClick, disabled, className = "" }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl 
        hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed
        shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 ${className}`}
    >
      {children}
    </button>
  )
}

export function SecondaryButton({ children, onClick, disabled, className = "" }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-6 py-3 border-2 border-purple-500 text-purple-400 font-semibold rounded-xl 
        hover:bg-purple-500/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </button>
  )
}
