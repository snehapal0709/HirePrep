import Groq from 'groq-sdk';
import { IAnalysis } from '@/types';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_PROMPT = `You are an expert technical recruiter and career coach with 15 years of experience.
Analyze the provided resume against the job description and return ONLY a valid JSON object with NO prose, NO markdown fences, NO explanation.

The JSON must match this exact structure:
{
  "jobTitle": "string - extracted from JD",
  "company": "string - extracted from JD or empty string",
  "matchScore": number (0-100),
  "atsScore": number (0-100),
  "skillsFound": ["skill1", "skill2", ...],
  "skillsMissing": ["skill1", "skill2", ...],
  "categoryScores": {
    "technical": number,
    "experience": number,
    "domain": number,
    "keywords": number
  },
  "improvements": [
    { "skill": "skill name", "suggestion": "specific actionable advice" }
  ],
  "questions": {
    "technical": [
      { "question": "...", "hints": "..." }
    ],
    "behavioural": [
      { "question": "...", "hints": "..." }
    ],
    "roleSpecific": [
      { "question": "...", "hints": "..." }
    ]
  },
  "prepPlan": [
    {
      "label": "Day 1",
      "topics": ["topic1", "topic2"],
      "resources": ["resource1", "resource2"],
      "goals": "specific goal for this period",
      "completed": false
    }
  ]
}

Generate 6-8 questions per category. Generate a 14-day prep plan (Day 1 through Day 14). Score honestly - most resumes score 40-75% against specific JDs.`;

export function buildAnalysisPrompt(resumeText: string, jobDescription: string): string {
  return `RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}

Analyze the resume against the job description and return the JSON object as specified.`;
}

export type AnalysisResult = Omit<
  IAnalysis,
  '_id' | 'userId' | 'resumeText' | 'jobDescription' | 'atsResume' | 'createdAt'
>;

export async function analyzeResumeWithAI(
  resumeText: string,
  jobDescription: string
): Promise<AnalysisResult> {
  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: buildAnalysisPrompt(resumeText, jobDescription) },
    ],
    max_tokens: 8192,
    temperature: 0.2,
  });

  let jsonText = (completion.choices[0]?.message?.content ?? '').trim();

  // Strip markdown fences if present despite instructions
  if (jsonText.startsWith('```')) {
    jsonText = jsonText.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
  }

  let parsed: AnalysisResult;
  try {
    parsed = JSON.parse(jsonText);
  } catch {
    // Attempt to extract JSON from the response
    const match = jsonText.match(/\{[\s\S]*\}/);
    if (!match) {
      throw new Error('Could not parse AI response as JSON');
    }
    parsed = JSON.parse(match[0]);
  }

  // Validate and sanitize
  return {
    jobTitle: String(parsed.jobTitle || 'Unknown Position'),
    company: String(parsed.company || ''),
    matchScore: clamp(Number(parsed.matchScore) || 0, 0, 100),
    atsScore: clamp(Number(parsed.atsScore) || 0, 0, 100),
    skillsFound: Array.isArray(parsed.skillsFound) ? parsed.skillsFound.map(String) : [],
    skillsMissing: Array.isArray(parsed.skillsMissing) ? parsed.skillsMissing.map(String) : [],
    categoryScores: {
      technical: clamp(Number(parsed.categoryScores?.technical) || 0, 0, 100),
      experience: clamp(Number(parsed.categoryScores?.experience) || 0, 0, 100),
      domain: clamp(Number(parsed.categoryScores?.domain) || 0, 0, 100),
      keywords: clamp(Number(parsed.categoryScores?.keywords) || 0, 0, 100),
    },
    improvements: Array.isArray(parsed.improvements)
      ? parsed.improvements.map((imp) => ({
          skill: String(imp.skill || ''),
          suggestion: String(imp.suggestion || ''),
        }))
      : [],
    questions: {
      technical: sanitizeQuestions(parsed.questions?.technical),
      behavioural: sanitizeQuestions(parsed.questions?.behavioural),
      roleSpecific: sanitizeQuestions(parsed.questions?.roleSpecific),
    },
    prepPlan: Array.isArray(parsed.prepPlan)
      ? parsed.prepPlan.map((item) => ({
          label: String(item.label || ''),
          topics: Array.isArray(item.topics) ? item.topics.map(String) : [],
          resources: Array.isArray(item.resources) ? item.resources.map(String) : [],
          goals: String(item.goals || ''),
          completed: false,
        }))
      : [],
  };
}

function clamp(val: number, min: number, max: number): number {
  return Math.min(Math.max(val, min), max);
}

function sanitizeQuestions(
  arr: unknown
): { question: string; hints: string }[] {
  if (!Array.isArray(arr)) return [];
  return arr.map((q) => ({
    question: String((q as { question?: unknown }).question || ''),
    hints: String((q as { hints?: unknown }).hints || ''),
  }));
}

export async function generateATSResume(
  resumeText: string,
  jobDescription: string,
  jobTitle: string,
  skillsMissing: string[]
): Promise<string> {
  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      {
        role: 'system',
        content: `You are a JSON API. You output ONLY raw JSON. No markdown. No backticks. No explanation. No prose. Your entire response must start with { and end with }. If you output anything other than valid JSON, you have failed.`,
      },
      {
        role: 'user',
        content: `Rewrite the resume below, optimized for ATS and the given job description.

ORIGINAL RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}

TARGET ROLE: ${jobTitle}
KEY SKILLS TO WEAVE IN: ${skillsMissing.slice(0, 6).join(', ')}

Return ONLY this exact JSON structure (no markdown, no extra text):
{
  "name": "Full Name",
  "contact": ["email@example.com", "1234567890", "City, Country", "linkedin.com/in/handle", "github.com/handle"],
  "sections": [
    {
      "title": "EDUCATION",
      "entries": [
        {
          "primary": "University Name",
          "secondary": "Degree — Major",
          "location": "City, Country",
          "dates": "Month Year – Month Year",
          "bullets": ["GPA: 9.0", "Relevant coursework: ..."]
        }
      ]
    },
    {
      "title": "EXPERIENCE",
      "entries": [
        {
          "primary": "Job Title",
          "secondary": "Company Name",
          "location": "City / Remote",
          "dates": "Month Year – Month Year",
          "bullets": ["Action verb + what you did + impact/metric", "..."]
        }
      ]
    },
    {
      "title": "PROJECTS",
      "entries": [
        {
          "primary": "Project Name",
          "secondary": "Tech Stack (comma separated)",
          "dates": "Month Year",
          "bullets": ["What you built and its impact", "..."]
        }
      ]
    },
    {
      "title": "TECHNICAL SKILLS",
      "entries": [
        { "inline": "Languages: Python, JavaScript, Java" },
        { "inline": "Frameworks: React, Node.js, Express" },
        { "inline": "Tools: Git, Docker, VS Code" },
        { "inline": "Databases: MongoDB, MySQL" }
      ]
    }
  ]
}

Rules:
- Do NOT fabricate experience — only reframe what exists in the original resume
- Use strong action verbs for bullet points
- Quantify achievements where possible
- Include all sections that exist in the original resume
- Incorporate the target role's keywords naturally`,
      },
    ],
    max_tokens: 4096,
    temperature: 0.2,
  });

  let raw = (completion.choices[0]?.message?.content ?? '').trim();
  // Strip markdown fences
  if (raw.startsWith('```')) {
    raw = raw.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim();
  }
  // Try to extract JSON object if surrounded by prose
  if (!raw.startsWith('{')) {
    const match = raw.match(/\{[\s\S]*\}/);
    if (match) raw = match[0];
  }
  // Validate it parses — if not, throw so the API route catches it
  JSON.parse(raw);
  return raw;
}
