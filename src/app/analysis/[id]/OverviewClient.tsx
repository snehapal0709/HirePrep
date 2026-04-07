'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import ScoreRing from '@/components/ScoreRing';
import CategoryBars from '@/components/CategoryBars';
import SkillPills from '@/components/SkillPills';
import { IAnalysis, getScoreHex } from '@/types';

interface Props {
  analysis: IAnalysis;
}

export default function OverviewClient({ analysis }: Props) {
  const [expandedImprovement, setExpandedImprovement] = useState<number | null>(null);

  const atsColor = getScoreHex(analysis.atsScore);

  return (
    <div className="space-y-6">
      {/* Top row: Score rings + ATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Match Score */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-[#111] border border-white/[0.06] rounded-xl p-6 flex flex-col items-center"
        >
          <p className="text-xs text-white/40 uppercase tracking-wider mb-5">Overall Match</p>
          <ScoreRing score={analysis.matchScore} size={160} label="Match Score" sublabel="vs. Job Description" />
          <p className="text-xs text-white/30 mt-4 text-center max-w-[200px]">
            {analysis.matchScore >= 70
              ? 'Strong match — you are a competitive candidate for this role.'
              : analysis.matchScore >= 50
              ? 'Moderate match — some gaps to address before applying.'
              : 'Needs work — significant skill gaps compared to requirements.'}
          </p>
        </motion.div>

        {/* ATS + Category Scores */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="space-y-5"
        >
          {/* ATS Score card */}
          <div className="bg-[#111] border border-white/[0.06] rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs text-white/40 uppercase tracking-wider">ATS Score</p>
                <p className="text-xs text-white/25 mt-0.5">Applicant Tracking System</p>
              </div>
              <div
                className="text-2xl font-bold font-display"
                style={{ color: atsColor }}
              >
                {analysis.atsScore}
                <span className="text-base font-normal text-white/30">/100</span>
              </div>
            </div>
            <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: atsColor }}
                initial={{ width: 0 }}
                animate={{ width: `${analysis.atsScore}%` }}
                transition={{ delay: 0.3, duration: 0.8, ease: 'easeOut' }}
              />
            </div>
          </div>

          {/* Category Scores */}
          <div className="bg-[#111] border border-white/[0.06] rounded-xl p-5">
            <p className="text-xs text-white/40 uppercase tracking-wider mb-4">Category Breakdown</p>
            <CategoryBars scores={analysis.categoryScores} />
          </div>
        </motion.div>
      </div>

      {/* Skills */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-5"
      >
        {/* Skills Found */}
        <div className="bg-[#111] border border-white/[0.06] rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
            <p className="text-sm font-medium text-white">
              Skills You Have
              <span className="text-white/30 font-normal ml-1.5">({analysis.skillsFound.length})</span>
            </p>
          </div>
          <SkillPills skills={analysis.skillsFound} variant="found" />
        </div>

        {/* Skills Missing */}
        <div className="bg-[#111] border border-white/[0.06] rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-red-400" />
            <p className="text-sm font-medium text-white">
              Skills You&apos;re Missing
              <span className="text-white/30 font-normal ml-1.5">({analysis.skillsMissing.length})</span>
            </p>
          </div>
          <SkillPills skills={analysis.skillsMissing} variant="missing" />
        </div>
      </motion.div>

      {/* Improvements */}
      {analysis.improvements.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="bg-[#111] border border-white/[0.06] rounded-xl p-5"
        >
          <p className="text-sm font-medium text-white mb-4">Improvement Suggestions</p>
          <div className="space-y-2">
            {analysis.improvements.map((imp, i) => (
              <div
                key={i}
                className="border border-white/[0.06] rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => setExpandedImprovement(expandedImprovement === i ? null : i)}
                  className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-white/[0.02] transition-colors"
                >
                  <span className="text-sm font-medium text-white">{imp.skill}</span>
                  <svg
                    className={`w-4 h-4 text-white/30 transition-transform flex-shrink-0 ml-4 ${
                      expandedImprovement === i ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {expandedImprovement === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="px-4 pb-4 border-t border-white/[0.04]"
                  >
                    <p className="text-sm text-white/55 pt-3 leading-relaxed">{imp.suggestion}</p>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
