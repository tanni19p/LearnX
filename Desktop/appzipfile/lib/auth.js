// Auth helper functions for localStorage-based authentication

export function getUser() {
  if (typeof window === "undefined") return null
  const user = localStorage.getItem("LearnX_user")
  return user ? JSON.parse(user) : null
}

export function setUser(userData) {
  if (typeof window === "undefined") return
  localStorage.setItem("LearnX_user", JSON.stringify(userData))
}

export function logout() {
  if (typeof window === "undefined") return
  localStorage.removeItem("LearnX_user")
}

export function isLoggedIn() {
  return getUser() !== null
}

export function getUserKey(baseKey) {
  const user = getUser()
  if (!user) return baseKey
  // Use email as unique identifier for storage keys
  const uniqueId = user.email.replace(/[^a-zA-Z0-9]/g, "_")
  return `${baseKey}_${uniqueId}`
}
