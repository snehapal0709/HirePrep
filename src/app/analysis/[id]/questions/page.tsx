import { getServerSession } from 'next-auth';
import { redirect, notFound } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Analysis from '@/lib/models/Analysis';
import QuestionsClient from './QuestionsClient';

export const metadata = {
  title: 'Interview Questions',
};

export default async function QuestionsPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect('/login');

  const userId = (session.user as { id?: string }).id!;
  await dbConnect();

  const analysis = await Analysis.findOne({ _id: params.id, userId })
    .select('questions jobTitle company')
    .lean();

  if (!analysis) notFound();

  return <QuestionsClient questions={JSON.parse(JSON.stringify(analysis.questions))} />;
}
