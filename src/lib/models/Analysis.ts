import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface IAnalysisDocument extends Document {
  userId: Types.ObjectId;
  jobTitle: string;
  company: string;
  resumeText: string;
  jobDescription: string;
  matchScore: number;
  atsScore: number;
  skillsFound: string[];
  skillsMissing: string[];
  categoryScores: {
    technical: number;
    experience: number;
    domain: number;
    keywords: number;
  };
  improvements: {
    skill: string;
    suggestion: string;
  }[];
  questions: {
    technical: { question: string; hints: string }[];
    behavioural: { question: string; hints: string }[];
    roleSpecific: { question: string; hints: string }[];
  };
  prepPlan: {
    label: string;
    topics: string[];
    resources: string[];
    goals: string;
    completed: boolean;
  }[];
  atsResume: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const QuestionSchema = new Schema(
  {
    question: { type: String, required: true },
    hints: { type: String, default: '' },
  },
  { _id: false }
);

const ImprovementSchema = new Schema(
  {
    skill: { type: String, required: true },
    suggestion: { type: String, required: true },
  },
  { _id: false }
);

const PrepPlanItemSchema = new Schema(
  {
    label: { type: String, required: true },
    topics: [{ type: String }],
    resources: [{ type: String }],
    goals: { type: String, default: '' },
    completed: { type: Boolean, default: false },
  },
  { _id: false }
);

const AnalysisSchema = new Schema<IAnalysisDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    jobTitle: { type: String, required: true, default: 'Unknown Position' },
    company: { type: String, default: '' },
    resumeText: { type: String, required: true },
    jobDescription: { type: String, required: true },
    matchScore: { type: Number, required: true, min: 0, max: 100 },
    atsScore: { type: Number, required: true, min: 0, max: 100 },
    skillsFound: [{ type: String }],
    skillsMissing: [{ type: String }],
    categoryScores: {
      technical: { type: Number, default: 0 },
      experience: { type: Number, default: 0 },
      domain: { type: Number, default: 0 },
      keywords: { type: Number, default: 0 },
    },
    improvements: [ImprovementSchema],
    questions: {
      technical: [QuestionSchema],
      behavioural: [QuestionSchema],
      roleSpecific: [QuestionSchema],
    },
    prepPlan: [PrepPlanItemSchema],
    atsResume: { type: String, default: null },
  },
  {
    timestamps: true,
  }
);

const Analysis: Model<IAnalysisDocument> =
  mongoose.models.Analysis ||
  mongoose.model<IAnalysisDocument>('Analysis', AnalysisSchema);

export default Analysis;
