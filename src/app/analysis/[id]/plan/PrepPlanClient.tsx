'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { IPrepPlanItem } from '@/types';

interface Props {
  analysisId: string;
  prepPlan: IPrepPlanItem[];
  jobTitle: string;
}

export default function PrepPlanClient({ analysisId, prepPlan: initialPlan, jobTitle }: Props) {
  const [plan, setPlan] = useState(initialPlan);
  const [updating, setUpdating] = useState<number | null>(null);

  const completedCount = plan.filter((item) => item.completed).length;
  const progress = plan.length > 0 ? Math.round((completedCount / plan.length) * 100) : 0;

  const toggleComplete = async (index: number) => {
    const newCompleted = !plan[index].completed;
    setUpdating(index);

    // Optimistic update
    setPlan((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], completed: newCompleted };
      return updated;
    });

    try {
      const res = await fetch(`/api/analysis/${analysisId}/plan`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ index, completed: newCompleted }),
      });

      if (!res.ok) {
        // Revert on failure
        setPlan((prev) => {
          const updated = [...prev];
          updated[index] = { ...updated[index], completed: !newCompleted };
          return updated;
        });
      }
    } catch {
      setPlan((prev) => {
        const updated = [...prev];
        updated[index] = { ...updated[index], completed: !newCompleted };
        return updated;
      });
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div>
      {/* Header + Progress */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-[#111] border border-white/[0.06] rounded-xl p-6 mb-6"
      >
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h2 className="font-display text-xl font-semibold text-white">14-Day Prep Plan</h2>
            <p className="text-sm text-white/40 mt-1">Tailored for {jobTitle}</p>
          </div>
          <div className="text-right">
            <div className="font-display text-2xl font-bold text-[#c8973a]">{progress}%</div>
            <div className="text-xs text-white/30">{completedCount}/{plan.length} days</div>
          </div>
        </div>

        <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-[#c8973a] rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        </div>

        {progress === 100 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-[#c8973a] mt-3 font-medium"
          >
            🎉 Prep plan complete! You're ready for the interview.
          </motion.p>
        )}
      </motion.div>

      {/* Timeline */}
      {plan.length === 0 ? (
        <div className="bg-[#111] border border-white/[0.06] rounded-xl p-8 text-center">
          <p className="text-white/30 text-sm">No prep plan was generated for this analysis.</p>
        </div>
      ) : (
        <div className="relative">
          {/* Vertical timeline line */}
          <div className="absolute left-6 top-6 bottom-6 w-px bg-white/[0.06] hidden sm:block" />

          <div className="space-y-4">
            {plan.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05, duration: 0.3 }}
                className={`relative sm:pl-16 transition-opacity ${
                  item.completed ? 'opacity-60' : 'opacity-100'
                }`}
              >
                {/* Timeline dot */}
                <div className="hidden sm:flex absolute left-0 top-4 w-12 justify-center">
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                      item.completed
                        ? 'bg-[#c8973a] border-[#c8973a]'
                        : 'bg-[#0a0a0a] border-white/[0.15]'
                    }`}
                  >
                    {item.completed && (
                      <svg className="w-2.5 h-2.5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>

                {/* Card */}
                <div className="bg-[#111] border border-white/[0.06] rounded-xl p-5 hover:border-white/[0.10] transition-colors">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <span className="text-xs text-[#c8973a] font-medium uppercase tracking-wider">
                        {item.label}
                      </span>
                      {item.goals && (
                        <p className="text-sm font-medium text-white mt-1">{item.goals}</p>
                      )}
                    </div>
                    <button
                      onClick={() => toggleComplete(i)}
                      disabled={updating === i}
                      className={`flex-shrink-0 w-6 h-6 rounded border flex items-center justify-center transition-colors ${
                        item.completed
                          ? 'bg-[#c8973a] border-[#c8973a]'
                          : 'bg-transparent border-white/[0.15] hover:border-[#c8973a]/40'
                      } ${updating === i ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                      title={item.completed ? 'Mark incomplete' : 'Mark complete'}
                    >
                      {item.completed && (
                        <svg className="w-3.5 h-3.5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  </div>

                  {item.topics.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs text-white/30 uppercase tracking-wider mb-1.5">Topics</p>
                      <ul className="space-y-1">
                        {item.topics.map((topic, j) => (
                          <li key={j} className="text-sm text-white/60 flex items-start gap-2">
                            <span className="text-[#c8973a] mt-1 flex-shrink-0">·</span>
                            {topic}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {item.resources.length > 0 && (
                    <div>
                      <p className="text-xs text-white/30 uppercase tracking-wider mb-1.5">Resources</p>
                      <ul className="space-y-1">
                        {item.resources.map((resource, j) => (
                          <li key={j} className="text-sm text-white/50 flex items-start gap-2">
                            <span className="text-white/20 mt-1 flex-shrink-0">→</span>
                            {resource}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
