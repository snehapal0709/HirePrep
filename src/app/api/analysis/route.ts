import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Analysis from '@/lib/models/Analysis';

export async function GET() {
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

    const analyses = await Analysis.find({ userId })
      .select('-resumeText -jobDescription -questions -prepPlan -atsResume -improvements')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ analyses });
  } catch (error) {
    console.error('Analysis list error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
