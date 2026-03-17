import OpenAI from 'openai'
import { config } from '@/lib/config'

const openai = new OpenAI({
  apiKey: config.openAIApiKey,
  baseURL: config.openAIBaseUrl,
})

const MODEL = 'openai/gpt-oss-120b'

export async function generateQuiz(topic: string) {
  const prompt = `Generate a 5-question multiple choice quiz on the topic: "${topic}".
Output ONLY a valid JSON array of objects. Each object must have:
- "text": the question text
- "options": an array of 4 string options
- "correctOptionIndex": the integer index (0-3) of the correct option
- "explanation": a short string explaining why the answer is correct.`

  const response = await openai.chat.completions.create({
    model: MODEL,
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
  })

  try {
    const rawContent = response.choices[0].message.content || '[]'
    const sanitized = rawContent.replace(/```json/g, '').replace(/```/g, '').trim()
    return JSON.parse(sanitized)
  } catch (error) {
    console.error('Failed to parse AI quiz generation', error)
    return []
  }
}

export async function generateStudyPlan(topics: string[], examDate: string) {
  const prompt = `Create a study plan for a student facing an exam on ${examDate}. 
They need to focus on these weak topics: ${topics.join(', ')}.
Give a structured daily or weekly breakdown in a simple, motivating format.`

  const response = await openai.chat.completions.create({
    model: MODEL,
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
  })

  return response.choices[0].message.content || 'Start studying today!'
}

export async function chatContext(query: string, pastContext: string = '') {
  const messages: any[] = [
    { role: 'system', content: 'You are a helpful and encouraging AI study tutor.' }
  ]
  if (pastContext) {
    messages.push({ role: 'assistant', content: pastContext })
  }
  messages.push({ role: 'user', content: query })

  const response = await openai.chat.completions.create({
    model: MODEL,
    messages: messages,
    temperature: 0.8,
  })

  return response.choices[0].message.content || 'I am here to help.'
}
