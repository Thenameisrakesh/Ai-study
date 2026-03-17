'use client'

import { useAuth } from '@/context/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'
import { BookOpen, LineChart, MessageSquarePlus, PenTool, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading || !user) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-50">Loading...</div>
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-950 text-slate-50">
      {/* Sidebar */}
      <aside className="w-full md:w-64 border-r border-slate-800 bg-slate-900/50 p-4 flex flex-col gap-2">
        <div className="font-bold text-xl text-blue-400 mb-6 flex items-center gap-2 px-2">
          <BookOpen className="w-6 h-6" />
          StudyBud
        </div>
        
        <nav className="flex-1 space-y-1">
          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-800 text-sm font-medium transition-colors">
            <LineChart className="w-4 h-4" />
            Overview
          </Link>
          <Link href="/dashboard/quiz/new" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-800 text-sm font-medium transition-colors">
            <PenTool className="w-4 h-4" />
            Generate Quiz
          </Link>
          <Link href="/dashboard/study-plan" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-800 text-sm font-medium transition-colors">
            <BookOpen className="w-4 h-4" />
            Study Plan
          </Link>
          <Link href="/dashboard/chat" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-800 text-sm font-medium transition-colors">
            <MessageSquarePlus className="w-4 h-4" />
            AI Tutor
          </Link>
          <Link href="/dashboard/profile" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-800 text-sm font-medium transition-colors">
            <PenTool className="w-4 h-4" />
            Profile
          </Link>
        </nav>

        <div className="pt-4 border-t border-slate-800 mt-auto">
          <div className="px-3 py-2 text-xs text-slate-400 mb-2 truncate">
            {user.name || user.email}
          </div>
          <Button variant="ghost" className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-950/30" onClick={() => logout()}>
            <LogOut className="w-4 h-4 mr-2" />
            Log Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
