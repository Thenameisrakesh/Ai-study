'use client'

import { useState, useRef, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Send, User as UserIcon, Sparkles } from 'lucide-react'

type Message = { role: 'user' | 'assistant'; content: string }

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const query = input.trim()
    setInput('')
    
    const newMsgs: Message[] = [...messages, { role: 'user', content: query }]
    setMessages(newMsgs)
    setLoading(true)

    try {
      const context = newMsgs.slice(-5).map(m => `${m.role}: ${m.content}`).join('\n')
      
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, context })
      })
      
      const data = await res.json()
      
      if (res.ok && data.response) {
        setMessages([...newMsgs, { role: 'assistant', content: data.response }])
      } else {
        setMessages([...newMsgs, { role: 'assistant', content: 'Oops, I encountered an error. Please try again.' }])
      }
    } catch (error) {
      setMessages([...newMsgs, { role: 'assistant', content: 'Network error. Please try again.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-screen p-4 max-w-4xl mx-auto">
      <div className="mb-4 shrink-0">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Sparkles className="text-blue-400 w-6 h-6" /> AI Study Tutor
        </h1>
        <p className="text-slate-400 text-sm">Ask explanations, concepts, or prep questions.</p>
      </div>

      <Card className="flex-1 overflow-hidden flex flex-col bg-slate-900 border-slate-800 min-h-0">
        <div className="flex-1 overflow-y-auto p-4 space-y-6 min-h-0">
          {messages.length === 0 && (
            <div className="h-full flex items-center justify-center text-slate-500 text-sm">
              Start a conversation with your AI tutor!
            </div>
          )}
          {messages.map((m, idx) => (
            <div key={idx} className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {m.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-blue-900/50 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-4 h-4 text-blue-400" />
                </div>
              )}
              <div className={`max-w-[75%] rounded-2xl p-4 text-sm ${m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-200'}`}>
                <div className="whitespace-pre-wrap">{m.content}</div>
              </div>
              {m.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0">
                  <UserIcon className="w-4 h-4 text-slate-300" />
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-blue-900/50 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-4 h-4 text-blue-400 animate-pulse" />
              </div>
              <div className="bg-slate-800 rounded-2xl p-4 flex gap-1 items-center">
                <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce [animation-delay:75ms]"></div>
                <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce [animation-delay:150ms]"></div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="p-4 bg-slate-900 border-t border-slate-800 shrink-0">
          <form onSubmit={handleSend} className="flex gap-2">
            <Input 
              value={input} 
              onChange={e => setInput(e.target.value)} 
              placeholder="Type your question..." 
              className="flex-1 bg-slate-950 border-slate-700"
            />
            <Button type="submit" size="icon" className="bg-blue-600 hover:bg-blue-500" disabled={loading || !input.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  )
}
