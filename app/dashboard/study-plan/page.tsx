'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Calendar, BookOpen } from 'lucide-react'

export default function StudyPlanPage() {
  const [topics, setTopics] = useState('')
  const [date, setDate] = useState('')
  const [loading, setLoading] = useState(false)
  const [plan, setPlan] = useState('')

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!topics || !date) return
    setLoading(true)
    try {
      const res = await fetch('/api/ai/study-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topics: topics.split(',').map(t => t.trim()), examDate: date })
      })
      const data = await res.json()
      if (res.ok) {
        setPlan(data.plan)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Calendar className="w-8 h-8 text-blue-400" /> Study Plan Generator
        </h1>
        <p className="text-slate-400 mt-2">Get an AI-curated study roadmap leading up to your exam.</p>
      </div>

      <Card className="bg-slate-900 border-slate-800">
        <CardContent className="pt-6">
          <form onSubmit={handleGenerate} className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 space-y-2 w-full">
              <label className="text-sm font-medium text-slate-300">Target Topics (comma separated)</label>
              <Input 
                placeholder="React, Next.js, Docker..." 
                value={topics} 
                onChange={e => setTopics(e.target.value)}
                required
              />
            </div>
            <div className="w-full md:w-64 space-y-2">
              <label className="text-sm font-medium text-slate-300">Exam/Target Date</label>
              <Input 
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="h-10 bg-blue-600 hover:bg-blue-500 w-full md:w-auto" disabled={loading}>
              {loading ? 'Generating...' : 'Generate Plan'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {plan && (
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-400">
              <BookOpen className="w-5 h-5" /> Your Personalized Plan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-invert max-w-none text-slate-300 prose-headings:text-slate-100 prose-a:text-blue-400">
              <div className="whitespace-pre-wrap">{plan}</div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
