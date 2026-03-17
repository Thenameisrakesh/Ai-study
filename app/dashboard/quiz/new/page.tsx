'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Sparkles } from 'lucide-react'

export default function NewQuizPage() {
  const [topic, setTopic] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!topic.trim()) return
    
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/ai/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate')
      }

      router.push(`/dashboard/quiz/${data.quiz.id}`)
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <Card className="border-slate-800 bg-slate-900/60 shadow-xl mt-12">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Sparkles className="w-6 h-6 text-blue-400" />
            AI Quiz Generator
          </CardTitle>
          <CardDescription>
            Enter a topic, subject, or reading material description, and the AI will generate a tailored 5-question multiple choice quiz for you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleGenerate} className="space-y-6 pt-4">
            <div className="space-y-2">
              <label className="text-sm tracking-wide text-slate-300 font-medium">Topic to study</label>
              <Input 
                placeholder="e.g. Next.js App Router, French Revolution, React Hooks" 
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                autoFocus
                className="h-12 text-base"
              />
            </div>

            {error && <div className="text-red-400 text-sm">{error}</div>}

            <Button type="submit" className="w-full h-12 text-base bg-blue-600 hover:bg-blue-500" disabled={loading || !topic.trim()}>
              {loading ? 'Generating amazing quiz...' : 'Generate New Quiz'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
