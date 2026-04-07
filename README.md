# HirePrep

AI-powered resume analysis and interview preparation platform. Upload your resume and job description to get match scores, skill gap analysis, tailored interview questions, and a personalized 14-day prep plan.

## Features

- **Match Score Analysis** — AI scores your resume against the JD (0-100)
- **ATS Score** — Applicant Tracking System compatibility check
- **Skill Gap Detection** — Skills you have vs. skills you're missing
- **Category Breakdown** — Technical, Experience, Domain, Keywords scores
- **Interview Questions** — Technical, Behavioural, and Role-Specific questions with answer hints
- **14-Day Prep Plan** — Day-by-day preparation timeline with topics and resources
- **ATS Resume Generator** — Optimized resume tailored to the job description

## Quick Start

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local with your MongoDB URI, NextAuth secret, and Anthropic API key

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

```
MONGODB_URI=mongodb+srv://...
NEXTAUTH_SECRET=...
NEXTAUTH_URL=http://localhost:3000
ANTHROPIC_API_KEY=sk-ant-...
```

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **TailwindCSS** + Framer Motion
- **MongoDB** + Mongoose
- **NextAuth.js v4**
- **Anthropic Claude API**
- **pdf-parse**

## License

MIT
