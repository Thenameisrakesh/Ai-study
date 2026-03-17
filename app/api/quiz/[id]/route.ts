import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
import { cookies } from 'next/headers'

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    
    const payload = await verifyToken(token)
    if (!payload?.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    
    const quiz = await prisma.quiz.findUnique({
      where: { id },
      include: { questions: true }
    })

    if (!quiz) return NextResponse.json({ error: 'Quiz not found' }, { status: 404 })
    if (quiz.userId !== payload.userId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    return NextResponse.json({ quiz })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
