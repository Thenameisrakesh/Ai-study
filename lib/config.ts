export const config = {
  dbUrl: process.env.DATABASE_URL || 'file:./dev.db',
  openAIApiKey: process.env.OPENAI_API_KEY || '',
  openAIBaseUrl: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
  jwtSecret: process.env.JWT_SECRET || 'fallback_secret_for_local_dev',
}
