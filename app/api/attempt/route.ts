import { NextResponse } from 'next/server'
import { recordAttempt } from '@/services/quiz.service'
import { verifyToken } from '@/lib/auth'
import { cookies } from 'next/headers'

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    
    const payload = await verifyToken(token)
    if (!payload?.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { quizId, answers } = await req.json()
    if (!quizId || !answers || !Array.isArray(answers)) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 })
    }

    const attempt = await recordAttempt(payload.userId as string, quizId, answers)

    return NextResponse.json({ attempt })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
