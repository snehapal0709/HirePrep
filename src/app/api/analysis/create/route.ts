import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Analysis from '@/lib/models/Analysis';
import { analyzeResumeWithAI } from '@/lib/ai';

export const maxDuration = 120; // 2 minutes for AI call

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as { id?: string }).id;
    if (!userId) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }

    const body = await req.json();
    const { resumeText, jobDescription } = body;

    if (!resumeText || !jobDescription) {
      return NextResponse.json(
        { error: 'Resume text and job description are required' },
        { status: 400 }
      );
    }

    if (resumeText.trim().length < 50) {
      return NextResponse.json(
        { error: 'Resume text is too short. Please provide a complete resume.' },
        { status: 400 }
      );
    }

    if (jobDescription.trim().length < 50) {
      return NextResponse.json(
        { error: 'Job description is too short. Please provide a complete job description.' },
        { status: 400 }
      );
    }

    // Run AI analysis
    const aiResult = await analyzeResumeWithAI(resumeText, jobDescription);

    await dbConnect();

    const analysis = await Analysis.create({
      userId,
      resumeText: resumeText.trim(),
      jobDescription: jobDescription.trim(),
      ...aiResult,
    });

    return NextResponse.json({ id: analysis._id.toString() }, { status: 201 });
  } catch (error: unknown) {
    console.error('Analysis create error:', error);
    if (error instanceof Error) {
      if (error.message.includes('parse') || error.message.includes('JSON')) {
        return NextResponse.json(
          { error: 'AI returned an unexpected response. Please try again.' },
          { status: 502 }
        );
      }
      if (error.message.includes('429') || error.message.includes('quota') || error.message.includes('Too Many Requests')) {
        return NextResponse.json(
          { error: 'AI quota limit reached. Please wait a minute and try again.' },
          { status: 429 }
        );
      }
      if (error.message.includes('API_KEY') || error.message.includes('API key') || error.message.includes('401')) {
        return NextResponse.json(
          { error: 'AI API key is invalid. Please check your GEMINI_API_KEY.' },
          { status: 500 }
        );
      }
      // Surface the real error message for easier debugging
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
