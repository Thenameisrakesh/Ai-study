'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle2, ChevronRight, Info, AlertCircle } from 'lucide-react'

export default function TakeQuizPage() {
  const { id } = useParams()
  const router = useRouter()
  const [quiz, setQuiz] = useState<any>(null)
  const [answers, setAnswers] = useState<number[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<any>(null)

  useEffect(() => {
    fetch(`/api/quiz/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.quiz) {
          setQuiz(data.quiz)
          setAnswers(new Array(data.quiz.questions.length).fill(-1))
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [id])

  const handleSelect = (index: number, optionIndex: number) => {
    if (result) return
    const newAnws = [...answers]
    newAnws[index] = optionIndex
    setAnswers(newAnws)
  }

  const handleSubmit = async () => {
    if (answers.includes(-1)) {
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/attempt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quizId: id, answers })
      })
      const data = await res.json()
      if (res.ok) {
        setResult(data.attempt)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    } catch (error) {
      console.error(error)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div className="p-8 text-slate-300">Loading quiz...</div>
  if (!quiz) return <div className="p-8 text-slate-300">Quiz not found.</div>

  const answeredCount = answers.filter(a => a !== -1).length
  const totalCount = quiz.questions.length
  const progressPercent = (answeredCount / totalCount) * 100

  if (result) {
    return (
      <div className="p-8 max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <Card className="bg-slate-900 border-blue-500/30 border-2 shadow-2xl shadow-blue-500/10">
          <CardHeader className="text-center space-y-2">
            <CheckCircle2 className="w-16 h-16 text-green-400 mx-auto mb-2" />
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Quiz Results
            </CardTitle>
            <div className="flex flex-col items-center">
              <span className="text-5xl font-black text-white">
                {result.score} / {result.total}
              </span>
              <div className="w-full max-w-xs bg-slate-800 h-2 rounded-full mt-4 overflow-hidden">
                <div 
                  className="h-full bg-blue-500" 
                  style={{ width: `${(result.score / result.total) * 100}%` }}
                />
              </div>
              <p className="text-slate-400 mt-2 text-lg">
                Success Rate: {Math.round((result.score / result.total) * 100)}%
              </p>
            </div>
          </CardHeader>
          <CardContent className="space-y-8 pt-6">
            {quiz.questions.map((q: any, i: number) => {
              const uans = answers[i]
              const cans = q.correctOptionIndex
              const isCorrect = uans === cans
              const parsedOptions: string[] = JSON.parse(q.options)
              
              return (
                <div key={q.id} className={`p-6 rounded-xl border-2 transition-all ${isCorrect ? 'bg-green-500/5 border-green-500/20' : 'bg-red-500/5 border-red-500/20'}`}>
                  <div className="flex items-start gap-3 mb-4">
                    <div className={`mt-1 p-1 rounded-full ${isCorrect ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                      {isCorrect ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    </div>
                    <h3 className="font-semibold text-lg text-slate-100 leading-tight">
                      {i + 1}. {q.text}
                    </h3>
                  </div>
                  
                  <div className="space-y-3 pl-8">
                    {parsedOptions.map((opt, optIdx) => {
                      let cls = "p-4 rounded-lg border text-sm transition-all "
                      if (optIdx === cans) {
                        cls += "bg-green-500/20 border-green-500/50 text-green-100 ring-1 ring-green-500/50"
                      } else if (optIdx === uans && !isCorrect) {
                        cls += "bg-red-500/20 border-red-500/50 text-red-100"
                      } else {
                        cls += "bg-slate-950/50 border-slate-800 text-slate-400"
                      }
                      return (
                        <div key={optIdx} className={cls}>
                          <div className="flex justify-between items-center">
                            {opt}
                            {optIdx === cans && <span className="text-[10px] uppercase font-bold tracking-widest text-green-400 bg-green-950 px-2 py-0.5 rounded">Correct Answer</span>}
                            {optIdx === uans && !isCorrect && <span className="text-[10px] uppercase font-bold tracking-widest text-red-400 bg-red-950 px-2 py-0.5 rounded">Your Selection</span>}
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {q.explanation && (
                    <div className="mt-5 ml-8 p-4 rounded-lg bg-slate-950 border border-slate-800 flex gap-3 italic text-slate-300">
                      <Info className="w-5 h-5 text-blue-400 shrink-0" />
                      <p className="text-sm leading-relaxed">{q.explanation}</p>
                    </div>
                  )}
                </div>
              )
            })}
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row justify-center gap-4 border-t border-slate-800 pt-8 pb-8">
            <Button variant="outline" size="lg" className="h-12 px-8" onClick={() => router.push('/dashboard/quiz/new')}>Generate Another</Button>
            <Button size="lg" className="h-12 px-8 bg-blue-600 hover:bg-blue-500 font-bold" onClick={() => router.push('/dashboard')}>Go to Dashboard</Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-10 pb-40">
      {/* Quiz Progress Header */}
      <div className="sticky top-0 z-10 -mx-8 px-8 py-4 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold truncate max-w-[250px] md:max-w-md">{quiz.title}</h1>
          <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-bold">Topic: {quiz.topic}</p>
        </div>
        <div className="text-right">
          <div className="text-sm font-bold text-blue-400 mb-1">
            {answeredCount} of {totalCount} Answered
          </div>
          <div className="w-32 md:w-48 bg-slate-800 h-2 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 transition-all duration-300 shadow-[0_0_8px_rgba(59,130,246,0.5)]" 
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {quiz.questions.map((q: any, index: number) => {
          const parsedOptions: string[] = JSON.parse(q.options)
          const isAnswered = answers[index] !== -1
          
          return (
            <div key={q.id} className="group scroll-mt-24" id={`q-${index}`}>
              <Card className={`transition-all duration-300 bg-slate-900 shadow-xl overflow-hidden border-2 ${isAnswered ? 'border-blue-500/20 bg-slate-900/40' : 'border-slate-800 hover:border-slate-700'}`}>
                <CardHeader className="pb-4">
                  <div className="flex items-start gap-4">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${isAnswered ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
                      {index + 1}
                    </div>
                    <CardTitle className="text-xl font-medium leading-relaxed pt-1">
                      {q.text}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 pb-8 pl-16 pr-8">
                  {parsedOptions.map((opt, optIdx) => {
                    const isSelected = answers[index] === optIdx
                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelect(index, optIdx)}
                        className={`w-full group text-left p-4 rounded-xl border-2 transition-all duration-200 relative ${
                          isSelected
                            ? 'bg-blue-600/10 border-blue-500 text-blue-50 ring-1 ring-blue-500/50'
                            : 'bg-slate-950/40 border-slate-800/80 hover:border-slate-600 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{opt}</span>
                          {isSelected && (
                             <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                               <CheckCircle2 className="w-3 h-3 text-white" />
                             </div>
                          )}
                        </div>
                      </button>
                    )
                  })}
                </CardContent>
              </Card>
            </div>
          )
        })}
      </div>

      {/* Main Submit Area (at bottom of content) */}
      <div className="mt-12 p-8 rounded-2xl bg-slate-900/50 border-2 border-dashed border-slate-800 flex flex-col items-center gap-6 text-center">
        {answeredCount < totalCount ? (
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-slate-200">Wait, you&apos;re not done yet!</h3>
            <p className="text-slate-400">Please answer all {totalCount} questions to see your results.</p>
            <div className="pt-2">
              <span className="text-sm px-4 py-1 rounded-full bg-amber-950/40 text-amber-500 border border-amber-900/50 inline-flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {totalCount - answeredCount} questions remaining
              </span>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-green-400">Ready to grade!</h3>
            <p className="text-slate-300">You&apos;ve answered all the questions. Let&apos;s see how you did!</p>
          </div>
        )}
        
        <Button 
          size="lg" 
          onClick={handleSubmit} 
          disabled={submitting || answers.includes(-1)}
          className={`h-16 px-12 text-xl font-black transition-all duration-300 shadow-2xl ${
            answers.includes(-1) 
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-50' 
              : 'bg-blue-600 hover:bg-blue-500 text-white hover:scale-105 shadow-blue-500/20 active:scale-95'
          }`}
        >
          {submitting ? 'Calculating Score...' : 'SUBMIT QUIZ'}
          <ChevronRight className="ml-2 w-6 h-6" />
        </Button>
      </div>

      {/* Fixed Sticky Footer (Back-up visibility) */}
      <div className="fixed bottom-6 right-6 z-20">
         <Button 
          onClick={handleSubmit} 
          disabled={submitting || answers.includes(-1)}
          className={`h-14 w-14 md:h-16 md:w-auto md:px-6 rounded-full md:rounded-xl shadow-2xl transition-all duration-500 ${
            answers.includes(-1) 
              ? 'translate-y-24 opacity-0 pointer-events-none' 
              : 'translate-y-0 opacity-100 scale-100'
          } bg-blue-600 hover:bg-blue-500 text-white`}
        >
          <span className="hidden md:inline mr-2 font-bold uppercase tracking-widest">Finish Quiz</span>
          <CheckCircle2 className="w-6 h-6" />
        </Button>
      </div>
    </div>
  )
}
