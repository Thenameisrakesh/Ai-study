import prisma from '@/lib/prisma'

export async function createQuiz(userId: string, title: string, topic: string, questions: any[], isAIGenerated: boolean = false) {
  return await prisma.quiz.create({
    data: {
      title,
      topic,
      isAIGenerated,
      userId,
      questions: {
        create: questions.map(q => ({
          text: q.text,
          options: JSON.stringify(q.options),
          correctOptionIndex: q.correctOptionIndex,
          explanation: q.explanation
        }))
      }
    },
    include: {
      questions: true
    }
  })
}

export async function recordAttempt(userId: string, quizId: string, answers: number[]) {
  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    include: { questions: true }
  })

  if (!quiz) throw new Error('Quiz not found')

  let score = 0
  const mistakesData: any[] = []

  quiz.questions.forEach((q, index) => {
    if (answers[index] === q.correctOptionIndex) {
      score += 1
    } else {
      mistakesData.push({
        questionId: q.id,
        userId,
        topic: quiz.topic,
      })
    }
  })

  const attempt = await prisma.attempt.create({
    data: {
      userId,
      quizId,
      score,
      total: quiz.questions.length,
      mistakes: {
        create: mistakesData
      }
    }
  })

  return attempt
}
