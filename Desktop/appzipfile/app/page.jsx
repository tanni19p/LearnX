import Link from "next/link"
import Navbar from "@/components/navbar"
import { Brain, Target, MessageSquare, Sparkles, ArrowRight } from "lucide-react"

export default function Home() {
  const features = [
    {
      icon: Target,
      title: "Concept-wise Gap Detection",
      description: "Identify exactly which concepts you need to work on with AI-powered analysis.",
    },
    {
      icon: MessageSquare,
      title: "Distractor Analysis",
      description: "Understand why you got answers wrong and the common misconceptions behind them.",
    },
    {
      icon: Sparkles,
      title: "Personalized Feedback",
      description: "Receive tailored recommendations to improve your understanding and performance.",
    },
  ]

  return (
    <div className="min-h-screen bg-[#050505]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 to-transparent" />
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-indigo-600/20 rounded-full blur-3xl" />
        <div className="absolute top-40 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/30 rounded-full mb-8">
              <Brain className="w-4 h-4 text-indigo-400" />
              <span className="text-sm text-indigo-400">AI-Powered Learning</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6">
              AI Learning{" "}
              <span className="bg-gradient-to-r from-indigo-500 to-blue-500 bg-clip-text text-transparent">
                Gap Detector
              </span>
            </h1>

            <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
              Personalized insights for better learning. Discover your knowledge gaps and get AI-powered recommendations
              to excel in your studies.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold rounded-xl hover:opacity-90 transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40"
              >
                Get Started
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-[#2a2a3a] text-white font-semibold rounded-xl hover:bg-[#1a1a2a] transition-all"
              >
                View Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-[#0a0a0f]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Why Choose LearnX?</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Our AI-powered platform helps you understand not just what you got wrong, but why—so you can truly master
              the concepts.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-8 bg-[#0d0d15] border border-[#1a1a2a] rounded-2xl hover:border-indigo-500/50 transition-all hover:-translate-y-1"
              >
                <div className="w-14 h-14 bg-indigo-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-indigo-500/20 transition-colors">
                  <feature.icon className="w-7 h-7 text-indigo-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">How It Works</h2>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: "1", title: "Choose Subject", desc: "Select from OS, DBMS, DSA, or Networks" },
              { step: "2", title: "Take Quiz", desc: "Answer 20 AI-generated questions" },
              { step: "3", title: "Get Analysis", desc: "See detailed gap detection results" },
              { step: "4", title: "Improve", desc: "Follow personalized recommendations" },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-indigo-600 to-blue-600 rounded-full flex items-center justify-center mb-4 text-2xl font-bold text-white">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-[#1a1a2a]">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500">
          <p>© 2026 LearnX. AI-Powered Learning Gap Detection.</p>
        </div>
      </footer>
    </div>
  )
}
