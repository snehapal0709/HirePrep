import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Analysis from '@/lib/models/Analysis';

export async function PATCH(
  req: NextRequest,
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

    const body = await req.json();
    const { index, completed } = body;

    if (typeof index !== 'number' || typeof completed !== 'boolean') {
      return NextResponse.json(
        { error: 'index (number) and completed (boolean) are required' },
        { status: 400 }
      );
    }

    await dbConnect();

    const analysis = await Analysis.findOne({ _id: params.id, userId });
    if (!analysis) {
      return NextResponse.json({ error: 'Analysis not found' }, { status: 404 });
    }

    if (index < 0 || index >= analysis.prepPlan.length) {
      return NextResponse.json({ error: 'Invalid plan item index' }, { status: 400 });
    }

    analysis.prepPlan[index].completed = completed;
    await analysis.save();

    return NextResponse.json({ success: true, prepPlan: analysis.prepPlan });
  } catch (error) {
    console.error('Plan update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
