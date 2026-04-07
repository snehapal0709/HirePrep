import { getServerSession } from 'next-auth';
import { redirect, notFound } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Analysis from '@/lib/models/Analysis';
import ATSResumeClient from './ATSResumeClient';

export const metadata = {
  title: 'ATS Resume',
};

export default async function ATSResumePage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect('/login');

  const userId = (session.user as { id?: string }).id!;
  await dbConnect();

  const analysis = await Analysis.findOne({ _id: params.id, userId })
    .select('atsResume jobTitle company skillsMissing matchScore atsScore')
    .lean();

  if (!analysis) notFound();

  return (
    <ATSResumeClient
      analysisId={params.id}
      initialAtsResume={(analysis.atsResume as string) || null}
      jobTitle={analysis.jobTitle as string}
      company={analysis.company as string}
      matchScore={analysis.matchScore as number}
      atsScore={analysis.atsScore as number}
    />
  );
}
