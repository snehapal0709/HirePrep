# HirePrep — Claude Code Project Documentation

## Project Overview

HirePrep is an AI-powered resume analysis and interview preparation platform. It analyzes resumes against job descriptions using the Anthropic Claude API and generates match scores, skill gap analysis, interview questions, and personalized prep plans.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14+ (App Router) |
| Language | TypeScript |
| Styling | TailwindCSS + Framer Motion |
| Database | MongoDB via Mongoose |
| Auth | NextAuth.js v4 (Credentials Provider) |
| AI | Groq API (llama-3.3-70b-versatile, free tier) |
| PDF | pdf-parse |

## Development Setup

1. Clone and install:
```bash
npm install
```

2. Copy env file and fill in values:
```bash
cp .env.example .env.local
```

3. Required environment variables:
- `MONGODB_URI` — MongoDB Atlas connection string
- `NEXTAUTH_SECRET` — Random secret (generate: `openssl rand -base64 32`)
- `NEXTAUTH_URL` — App URL (http://localhost:3000 for dev)
- `GROQ_API_KEY` — From console.groq.com (free, no credit card)

4. Run development server:
```bash
npm run dev
```

## Folder Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout (fonts, metadata)
│   ├── page.tsx            # Landing page
│   ├── globals.css         # Global styles
│   ├── login/page.tsx      # Auth — login
│   ├── register/page.tsx   # Auth — register
│   ├── dashboard/page.tsx  # Protected dashboard
│   ├── analysis/
│   │   ├── new/page.tsx    # Upload resume + JD
│   │   └── [id]/
│   │       ├── layout.tsx  # Shared analysis layout + tabs
│   │       ├── page.tsx    # Overview (scores, skills, bars)
│   │       ├── questions/page.tsx  # Interview questions
│   │       ├── plan/page.tsx       # 14-day prep plan
│   │       └── resume/page.tsx     # ATS resume generator
│   └── api/
│       ├── auth/
│       │   ├── register/route.ts   # POST register
│       │   └── [...nextauth]/route.ts  # NextAuth handler
│       └── analysis/
│           ├── route.ts            # GET all analyses
│           ├── create/route.ts     # POST create analysis
│           └── [id]/
│               ├── route.ts        # GET single analysis
│               ├── plan/route.ts   # PATCH plan progress
│               └── resume/route.ts # POST generate ATS resume
├── components/             # Reusable UI components
│   ├── Navbar.tsx
│   ├── ScoreRing.tsx
│   ├── CategoryBars.tsx
│   ├── SkillPills.tsx
│   ├── LoadingSteps.tsx
│   └── AnalysisCard.tsx
├── lib/
│   ├── db.ts               # MongoDB connection (cached)
│   ├── ai.ts               # Anthropic client + prompt
│   ├── auth.ts             # NextAuth config
│   └── models/
│       ├── User.ts         # User mongoose model
│       └── Analysis.ts     # Analysis mongoose model
├── middleware.ts            # Route protection
└── types/index.ts           # TypeScript interfaces
```

## Key Architectural Decisions

### App Router (not Pages Router)
Uses Next.js 14 App Router for server components, which enables direct MongoDB queries in page components without API calls, reducing latency.

### Single AI Call Per Analysis
All analysis data (scores, skills, questions, prep plan) is generated in one Claude API call. This minimizes latency and API costs. The structured JSON response is stored in MongoDB and served from there for all subsequent tab views.

### NextAuth Credentials Provider
Uses email/password auth with bcrypt hashing. No OAuth providers to keep setup simple. Session includes user ID via JWT callback.

### Connection Caching
`src/lib/db.ts` caches the Mongoose connection across hot reloads in development, preventing connection pool exhaustion.

### PDF Parsing Server-Side
PDF files are uploaded to an API route that uses `pdf-parse` server-side. Raw text is stored in MongoDB alongside the analysis.

## Environment Variables

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `NEXTAUTH_SECRET` | JWT signing secret (min 32 chars) |
| `NEXTAUTH_URL` | Full URL of the app |
| `GROQ_API_KEY` | Groq API key from console.groq.com (free, no credit card needed) |

## Common Development Tasks

### Adding a New Analysis Tab
1. Create `src/app/analysis/[id]/newtab/page.tsx`
2. Add tab link in `src/app/analysis/[id]/layout.tsx`
3. Data is already available via the Analysis model

### Modifying the AI Prompt
Edit `src/lib/ai.ts` — the `buildAnalysisPrompt` function constructs the user message and the system prompt is inline in `analyzeResumeWithAI`.

### Adding a New Field to Analysis
1. Update `src/lib/models/Analysis.ts` schema
2. Update `src/types/index.ts` interface
3. Update the AI prompt in `src/lib/ai.ts` to include the field
4. Update `src/app/api/analysis/create/route.ts` to map the new field

### Changing the Color Scheme
All colors are defined in `tailwind.config.ts` under `theme.extend.colors`. The accent gold is `#c8973a`.

## Deployment Notes

- Set all environment variables in your hosting platform
- MongoDB Atlas: whitelist your server IP or use 0.0.0.0/0
- `NEXTAUTH_URL` must match your production domain exactly
- Build: `npm run build && npm start`
