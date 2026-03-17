import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
import { cookies } from 'next/headers'

export async function GET(req: Request) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    
    const payload = await verifyToken(token)
    if (!payload?.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const userId = payload.userId as string

    const attempts = await prisma.attempt.findMany({
      where: { userId }
    })

    const totalAttempts = attempts.length
    const totalScore = attempts.reduce((acc, a) => acc + a.score, 0)
    const totalQuestions = attempts.reduce((acc, a) => acc + a.total, 0)
    const accuracy = totalQuestions > 0 ? (totalScore / totalQuestions) * 100 : 0

    const mistakes = await prisma.mistake.findMany({
      where: { userId },
      select: { topic: true }
    })

    const weakTopicsCounts: Record<string, number> = {}
    mistakes.forEach(m => {
      weakTopicsCounts[m.topic] = (weakTopicsCounts[m.topic] || 0) + 1
    })

    const weakTopics = Object.entries(weakTopicsCounts)
      .map(([topic, count]) => ({ topic, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    return NextResponse.json({
      totalAttempts,
      accuracy,
      weakTopics
    })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
