'use client'

import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function Home() {
  const router = useRouter()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-slate-950 text-slate-50 overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-900 to-slate-950"></div>
      
      <div className="z-10 w-full max-w-3xl text-center space-y-8">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">
          AI Study Companion
        </h1>
        <p className="text-xl text-slate-300 max-w-2xl mx-auto">
          Your personal hackathon-ready study buddy. Generate quizzes, track weak areas, and get an AI study plan tailored for you.
        </p>

        <div className="flex items-center justify-center gap-4 pt-4">
          <Button size="lg" className="h-12 px-8 text-base bg-blue-600 hover:bg-blue-500" onClick={() => router.push('/login')}>
            Get Started
          </Button>
          <Button size="lg" variant="outline" className="h-12 px-8 text-base" onClick={() => router.push('/login')}>
            Log In
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-16">
          <Card className="bg-slate-900/40 border-slate-800 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>AI Quizzes</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-400">
              Generate infinite quizzes on any topic instantly.
            </CardContent>
          </Card>
          <Card className="bg-slate-900/40 border-slate-800 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Mistake Tracking</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-400">
              Identify your weak topics and focus your learning.
            </CardContent>
          </Card>
          <Card className="bg-slate-900/40 border-slate-800 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>AI Tutor</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-400">
              Chat with an AI tutor for personalized explanations.
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
