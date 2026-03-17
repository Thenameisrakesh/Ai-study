# AI Study Companion

A hackathon-ready, full-stack AI Study Companion web application that runs fully locally and is easily scalable to the cloud.

## Features
- **AI-Generated Quizzes**: Enter a topic and get a 5-question MCQ test instantly.
- **Mistake Tracking**: Identifies your weakest topics based on quiz performance.
- **AI Tutor Chat**: Chat with a specialized AI to explain complex topics.
- **Study Plan Generator**: Build a curated schedule before an exam date.

## Tech Stack
- Frontend: Next.js (App Router), Tailwind CSS, Shadcn UI
- Backend: Next.js API Routes (Serverless-ready)
- Database: Prisma ORM with SQLite (Local dev), easily portable to PostgreSQL.
- AI: OpenAI (`gpt-3.5-turbo`)
- Auth: Custom JWT with HTTP-only cookies

## Quick Start (Local Development)

### 1. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 2. Configure Environment Variables
Copy the example environment file:
\`\`\`bash
cp .env.example .env
\`\`\`
Then, edit `.env` and add your **OpenAI API Key** and a random string for the **JWT_SECRET**.

### 3. Initialize Database
Initialize the Prisma SQLite database:
\`\`\`bash
npx prisma db push
\`\`\`

### 4. Run the App
Start the development server:
\`\`\`bash
npm run dev
\`\`\`
Open [http://localhost:3000](http://localhost:3000)

## Cloud Migration Guide
1. Change `DATABASE_URL` in `.env` to a PostgreSQL connection string.
2. Update `prisma/schema.prisma` provider from `"sqlite"` to `"postgresql"`.
3. Run `npx prisma db push` to initialize the cloud DB.
4. Deploy to Vercel/AWS easily since all API routes use Next.js serverless functions.
