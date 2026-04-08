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

export default function AnalysisCard({ id, jobTitle, company, matchScore, atsScore, skillsFound, skillsMissing, createdAt, index = 0 }: AnalysisCardProps) {
  const scoreColor = getScoreHex(matchScore);
  const date = new Date(createdAt);
  const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const scoreLabel = matchScore >= 75 ? 'Strong' : matchScore >= 50 ? 'Moderate' : 'Needs Work';
  const scoreBg = matchScore >= 75 ? 'from-emerald-500/10' : matchScore >= 50 ? 'from-amber-500/10' : 'from-red-500/10';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
    >
      <Link href={`/analysis/${id}`}>
        <div className="group relative bg-[#111] border border-white/[0.06] rounded-2xl p-5 hover:border-white/[0.12] transition-all duration-300 cursor-pointer overflow-hidden hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
          {/* Subtle gradient top */}
          <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r ${scoreBg} via-transparent to-transparent`} style={{ background: `linear-gradient(90deg, ${scoreColor}30, transparent)` }} />

          {/* Hover shimmer */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />

          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-white truncate text-base mb-0.5 group-hover:text-[#c8973a] transition-colors duration-300">{jobTitle}</h3>
              {company && <p className="text-sm text-white/40 mb-3 truncate">{company}</p>}

              {/* Score bar */}
              <div className="mb-3">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs text-white/30">Match score</span>
                  <span className="text-xs font-medium" style={{ color: scoreColor }}>{scoreLabel}</span>
                </div>
                <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${matchScore}%` }}
                    transition={{ delay: index * 0.08 + 0.3, duration: 0.8, ease: 'easeOut' }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: scoreColor }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span className="text-xs text-white/50">{skillsFound.length} matched</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400/70" />
                  <span className="text-xs text-white/50">{skillsMissing.length} missing</span>
                </div>
              </div>
            </div>

            {/* Score ring */}
            <div className="flex flex-col items-center gap-2 flex-shrink-0">
              <div
                className="relative w-16 h-16 rounded-2xl border flex items-center justify-center flex-col group-hover:scale-105 transition-transform duration-300"
                style={{ borderColor: `${scoreColor}30`, backgroundColor: `${scoreColor}08` }}
              >
                <span className="text-2xl font-bold font-display leading-none" style={{ color: scoreColor }}>{matchScore}</span>
                <span className="text-[10px] mt-0.5" style={{ color: scoreColor, opacity: 0.6 }}>match</span>
              </div>
              <div className="text-center">
                <div className="text-[10px] text-white/25">ATS</div>
                <div className="text-xs font-medium text-white/50">{atsScore}</div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/[0.04]">
            <span className="text-xs text-white/25">{formattedDate}</span>
            <motion.span
              initial={{ opacity: 0, x: -5 }}
              whileInView={{ opacity: 0 }}
              className="text-xs text-[#c8973a] flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300"
            >
              View analysis
              <motion.span animate={{ x: [0, 3, 0] }} transition={{ duration: 1, repeat: Infinity }}>→</motion.span>
            </motion.span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
