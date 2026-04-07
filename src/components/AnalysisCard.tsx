'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { getScoreHex } from '@/types';

interface AnalysisCardProps {
  id: string;
  jobTitle: string;
  company: string;
  matchScore: number;
  atsScore: number;
  skillsFound: string[];
  skillsMissing: string[];
  createdAt: string | Date;
  index?: number;
}

export default function AnalysisCard({
  id,
  jobTitle,
  company,
  matchScore,
  atsScore,
  skillsFound,
  skillsMissing,
  createdAt,
  index = 0,
}: AnalysisCardProps) {
  const scoreColor = getScoreHex(matchScore);
  const date = new Date(createdAt);
  const formattedDate = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
    >
      <Link href={`/analysis/${id}`}>
        <div className="group bg-[#111] border border-white/[0.06] rounded-xl p-5 hover:border-white/[0.12] hover:bg-[#141414] transition-all duration-200 cursor-pointer">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-medium text-white truncate">{jobTitle}</h3>
              </div>
              {company && (
                <p className="text-sm text-white/40 mb-3">{company}</p>
              )}

              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span className="text-xs text-white/50">
                    {skillsFound.length} skills matched
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                  <span className="text-xs text-white/50">
                    {skillsMissing.length} skills missing
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end gap-2 flex-shrink-0">
              {/* Match Score Badge */}
              <div
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border"
                style={{
                  borderColor: `${scoreColor}30`,
                  backgroundColor: `${scoreColor}10`,
                }}
              >
                <span className="text-lg font-bold font-display" style={{ color: scoreColor }}>
                  {matchScore}
                </span>
                <span className="text-xs" style={{ color: scoreColor, opacity: 0.7 }}>
                  match
                </span>
              </div>

              {/* ATS Score */}
              <div className="flex items-center gap-1 text-xs text-white/30">
                <span>ATS</span>
                <span className="text-white/50 font-medium">{atsScore}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/[0.04]">
            <span className="text-xs text-white/30">{formattedDate}</span>
            <span className="text-xs text-[#c8973a] opacity-0 group-hover:opacity-100 transition-opacity">
              View analysis →
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
