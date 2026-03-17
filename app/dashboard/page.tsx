'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, Target, Activity } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function DashboardOverview() {
  const [stats, setStats] = useState<any>(null)
  const [quizzes, setQuizzes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/analytics').then(res => res.json()),
      fetch('/api/quiz').then(res => res.json())
    ]).then(([analyticsData, quizData]) => {
      setStats(analyticsData)
      setQuizzes(quizData.quizzes || [])
      setLoading(false)
    }).catch(console.error)
  }, [])

  if (loading) return <div className="p-8 text-slate-300">Loading dashboard...</div>

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
        <p className="text-slate-400">Welcome back! Here&apos;s your study progress.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Total Quizzes Taken</CardTitle>
            <BookOpen className="w-4 h-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalAttempts || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Average Accuracy</CardTitle>
            <Target className="w-4 h-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(stats?.accuracy || 0)}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Weak Topics</CardTitle>
            <Activity className="w-4 h-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.weakTopics?.length || 0}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Needs Attention</CardTitle>
            <CardDescription>Topics where you made the most mistakes.</CardDescription>
          </CardHeader>
          <CardContent>
            {stats?.weakTopics && stats.weakTopics.length > 0 ? (
              <ul className="space-y-3">
                {stats.weakTopics.map((wt: any, idx: number) => (
                  <li key={idx} className="flex justify-between items-center text-sm border-b border-slate-800 pb-2">
                    <span className="font-medium">{wt.topic}</span>
                    <span className="text-red-400 bg-red-950/30 px-2 py-1 rounded-full text-xs">{wt.count} mistakes</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-400">You&apos;re doing great! No weak topics identified yet.</p>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Quizzes</CardTitle>
            <CardDescription>Your recently generated study quizzes.</CardDescription>
          </CardHeader>
          <CardContent>
            {quizzes.length > 0 ? (
              <ul className="space-y-4">
                {quizzes.slice(0, 5).map((q: any) => (
                  <li key={q.id} className="flex justify-between items-center text-sm">
                    <div>
                      <div className="font-medium">{q.title}</div>
                      <div className="text-xs text-slate-400">{new Date(q.createdAt).toLocaleDateString()}</div>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/quiz/${q.id}`}>Take Quiz</Link>
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-400">No quizzes yet. <Link href="/dashboard/quiz/new" className="text-blue-500 hover:underline">Generate one!</Link></p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
