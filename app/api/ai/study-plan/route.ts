import { NextResponse } from 'next/server'
import { generateStudyPlan } from '@/services/ai.service'
import { verifyToken } from '@/lib/auth'
import { cookies } from 'next/headers'

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    
    const payload = await verifyToken(token)
    if (!payload?.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { topics, examDate } = await req.json()
    if (!topics || !examDate) return NextResponse.json({ error: 'Topics and examDate are required' }, { status: 400 })

    const plan = await generateStudyPlan(topics, examDate)

    return NextResponse.json({ plan })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
