import { getServerSession } from 'next-auth';
import { redirect, notFound } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Analysis from '@/lib/models/Analysis';
import PrepPlanClient from './PrepPlanClient';

export const metadata = {
  title: 'Prep Plan',
};

export default async function PrepPlanPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect('/login');

  const userId = (session.user as { id?: string }).id!;
  await dbConnect();

  const analysis = await Analysis.findOne({ _id: params.id, userId })
    .select('prepPlan jobTitle')
    .lean();

  if (!analysis) notFound();

  return (
    <PrepPlanClient
      analysisId={params.id}
      prepPlan={JSON.parse(JSON.stringify(analysis.prepPlan))}
      jobTitle={analysis.jobTitle as string}
    />
  );
}
