"use client"

export function PrimaryButton({ children, onClick, disabled, className = "" }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold rounded-xl 
        hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed
        shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 ${className}`}
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
      className={`px-6 py-3 border-2 border-indigo-500 text-indigo-400 font-semibold rounded-xl 
        hover:bg-indigo-500/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </button>
  )
}
