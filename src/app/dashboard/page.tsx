import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Analysis from '@/lib/models/Analysis';
import AnalysisCard from '@/components/AnalysisCard';
import DashboardClient from './DashboardClient';

async function getAnalyses(userId: string) {
  await dbConnect();
  const analyses = await Analysis.find({ userId })
    .select('-resumeText -jobDescription -questions -prepPlan -atsResume -improvements')
    .sort({ createdAt: -1 })
    .lean();
  return analyses;
}

export const metadata = {
  title: 'Dashboard',
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect('/login');
  }

  const userId = (session.user as { id?: string }).id!;
  const analyses = await getAnalyses(userId);

  const metrics = {
    totalAnalyses: analyses.length,
    avgScore:
      analyses.length > 0
        ? Math.round(analyses.reduce((sum, a) => sum + (a.matchScore as number), 0) / analyses.length)
        : 0,
    bestScore:
      analyses.length > 0
        ? Math.max(...analyses.map((a) => a.matchScore as number))
        : 0,
  };

  const userName = session.user.name?.split(' ')[0] || 'there';

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <div className="border-b border-white/[0.04] bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-6 h-6 rounded border border-[#c8973a]/40 flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-sm bg-[#c8973a]" />
            </div>
            <span className="font-display text-base font-semibold text-white">HirePrep</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-white/40 hidden sm:block">{session.user.email}</span>
            <Link
              href="/analysis/new"
              className="bg-[#c8973a] hover:bg-[#d4a84d] text-black font-semibold px-4 py-2 rounded-lg text-sm transition-colors"
            >
              New Analysis
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Greeting */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-semibold text-white mb-1">
            Good to see you, {userName}.
          </h1>
          <p className="text-white/40 text-sm">
            {analyses.length === 0
              ? 'Run your first analysis to get started.'
              : `You have ${analyses.length} analysis${analyses.length !== 1 ? 'es' : ''} saved.`}
          </p>
        </div>

        {/* Metrics */}
        <DashboardClient metrics={metrics} />

        {/* Analyses List */}
        <div className="mt-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-white/60 uppercase tracking-wider">
              Recent Analyses
            </h2>
            {analyses.length > 0 && (
              <Link
                href="/analysis/new"
                className="text-sm text-[#c8973a] hover:text-[#d4a84d] transition-colors"
              >
                + New Analysis
              </Link>
            )}
          </div>

          {analyses.length === 0 ? (
            <div className="bg-[#111] border border-white/[0.06] rounded-xl p-12 text-center">
              <div className="w-12 h-12 rounded-xl bg-[#c8973a]/10 border border-[#c8973a]/20 flex items-center justify-center mx-auto mb-4">
                <span className="text-[#c8973a] text-xl">◎</span>
              </div>
              <h3 className="font-medium text-white mb-2">No analyses yet</h3>
              <p className="text-sm text-white/40 mb-6">
                Upload your resume and a job description to get your first analysis.
              </p>
              <Link
                href="/analysis/new"
                className="inline-block bg-[#c8973a] hover:bg-[#d4a84d] text-black font-semibold px-6 py-2.5 rounded-lg text-sm transition-colors"
              >
                Analyse My Resume
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {analyses.map((analysis, i) => (
                <AnalysisCard
                  key={String(analysis._id)}
                  id={String(analysis._id)}
                  jobTitle={analysis.jobTitle as string}
                  company={analysis.company as string}
                  matchScore={analysis.matchScore as number}
                  atsScore={analysis.atsScore as number}
                  skillsFound={(analysis.skillsFound as string[]) || []}
                  skillsMissing={(analysis.skillsMissing as string[]) || []}
                  createdAt={analysis.createdAt as Date}
                  index={i}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
