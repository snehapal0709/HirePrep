import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Analysis from '@/lib/models/Analysis';
import { generateATSResume } from '@/lib/ai';

export const maxDuration = 60;

export async function POST(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as { id?: string }).id;
    if (!userId) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }

    await dbConnect();

    const analysis = await Analysis.findOne({ _id: params.id, userId });
    if (!analysis) {
      return NextResponse.json({ error: 'Analysis not found' }, { status: 404 });
    }

    // Return cached only if it's valid JSON (not plain text from a bad generation)
    if (analysis.atsResume) {
      try {
        JSON.parse(analysis.atsResume);
        return NextResponse.json({ atsResume: analysis.atsResume });
      } catch {
        // Cached value is plain text — fall through to regenerate
      }
    }

    const atsResume = await generateATSResume(
      analysis.resumeText,
      analysis.jobDescription,
      analysis.jobTitle,
      analysis.skillsMissing
    );

    analysis.atsResume = atsResume;
    await analysis.save();

    return NextResponse.json({ atsResume });
  } catch (error) {
    console.error('ATS resume generation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
