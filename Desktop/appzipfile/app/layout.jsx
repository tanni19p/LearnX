import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "LearnX - AI Learning Gap Detector",
  description: "Personalized insights for better learning",
    generator: 'v0.app'
}

export const viewport = {
  themeColor: "#008080",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
