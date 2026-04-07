import { getServerSession } from 'next-auth';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Analysis from '@/lib/models/Analysis';
import AnalysisTabNav from './AnalysisTabNav';

interface LayoutProps {
  children: React.ReactNode;
  params: { id: string };
}

export default async function AnalysisLayout({ children, params }: LayoutProps) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect('/login');
  }

  const userId = (session.user as { id?: string }).id!;

  await dbConnect();
  const analysis = await Analysis.findOne({ _id: params.id, userId })
    .select('jobTitle company createdAt matchScore')
    .lean();

  if (!analysis) {
    notFound();
  }

  const createdDate = new Date(analysis.createdAt as Date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Top header */}
      <div className="border-b border-white/[0.04] bg-[#0a0a0a] sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-3 flex items-center justify-between gap-4">
            <Link href="/dashboard" className="flex items-center gap-2 flex-shrink-0">
              <div className="w-6 h-6 rounded border border-[#c8973a]/40 flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-sm bg-[#c8973a]" />
              </div>
              <span className="font-display text-base font-semibold text-white hidden sm:block">
                HirePrep
              </span>
            </Link>

            <div className="flex-1 min-w-0 text-center sm:text-left">
              <div className="flex items-baseline gap-2 justify-center sm:justify-start flex-wrap">
                <h1 className="font-medium text-white text-sm truncate">
                  {analysis.jobTitle as string}
                </h1>
                {analysis.company && (
                  <>
                    <span className="text-white/20 text-sm hidden sm:inline">at</span>
                    <span className="text-white/50 text-sm hidden sm:inline truncate">
                      {analysis.company as string}
                    </span>
                  </>
                )}
              </div>
              <p className="text-xs text-white/25 mt-0.5 hidden sm:block">{createdDate}</p>
            </div>

            <Link
              href="/dashboard"
              className="text-xs text-white/35 hover:text-white/60 transition-colors flex-shrink-0"
            >
              ← Dashboard
            </Link>
          </div>

          {/* Tab navigation */}
          <AnalysisTabNav analysisId={params.id} />
        </div>
      </div>

      {/* Page content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
