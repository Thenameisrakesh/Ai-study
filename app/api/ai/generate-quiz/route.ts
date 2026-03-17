import { NextResponse } from 'next/server'
import { generateQuiz } from '@/services/ai.service'
import { createQuiz } from '@/services/quiz.service'
import { verifyToken } from '@/lib/auth'
import { cookies } from 'next/headers'

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    
    const payload = await verifyToken(token)
    if (!payload?.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { topic } = await req.json()
    if (!topic) return NextResponse.json({ error: 'Topic is required' }, { status: 400 })

    const questions = await generateQuiz(topic)
    if (!questions || questions.length === 0) {
      return NextResponse.json({ error: 'Failed to generate quiz' }, { status: 500 })
    }

    const quiz = await createQuiz(payload.userId as string, `AI Quiz: ${topic}`, topic, questions, true)

    return NextResponse.json({ quiz })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
