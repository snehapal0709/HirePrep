import { getServerSession } from 'next-auth';
import { redirect, notFound } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Analysis from '@/lib/models/Analysis';
import OverviewClient from './OverviewClient';

export const metadata = {
  title: 'Analysis Overview',
};

export default async function AnalysisOverviewPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect('/login');
  }

  const userId = (session.user as { id?: string }).id!;
  await dbConnect();

  const analysis = await Analysis.findOne({ _id: params.id, userId }).lean();
  if (!analysis) notFound();

  return <OverviewClient analysis={JSON.parse(JSON.stringify(analysis))} />;
}
