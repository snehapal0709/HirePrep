export interface IUser {
  _id: string;
  name: string;
  email: string;
  hashedPassword: string;
  createdAt: Date;
}

export interface IImprovement {
  skill: string;
  suggestion: string;
}

export interface IQuestion {
  question: string;
  hints: string;
}

export interface IQuestions {
  technical: IQuestion[];
  behavioural: IQuestion[];
  roleSpecific: IQuestion[];
}

export interface ICategoryScores {
  technical: number;
  experience: number;
  domain: number;
  keywords: number;
}

export interface IPrepPlanItem {
  label: string;
  topics: string[];
  resources: string[];
  goals: string;
  completed: boolean;
}

export interface IAnalysis {
  _id: string;
  userId: string;
  jobTitle: string;
  company: string;
  resumeText: string;
  jobDescription: string;
  matchScore: number;
  atsScore: number;
  skillsFound: string[];
  skillsMissing: string[];
  categoryScores: ICategoryScores;
  improvements: IImprovement[];
  questions: IQuestions;
  prepPlan: IPrepPlanItem[];
  atsResume: string | null;
  createdAt: Date;
}

export interface DashboardMetrics {
  totalAnalyses: number;
  avgScore: number;
  bestScore: number;
}

export type ScoreColor = 'gold' | 'amber' | 'red';

export function getScoreColor(score: number): ScoreColor {
  if (score >= 70) return 'gold';
  if (score >= 50) return 'amber';
  return 'red';
}

export function getScoreHex(score: number): string {
  if (score >= 70) return '#c8973a';
  if (score >= 50) return '#f59e0b';
  return '#ef4444';
}
