'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IQuestions } from '@/types';

interface Props {
  questions: IQuestions;
}

type TabKey = 'technical' | 'behavioural' | 'roleSpecific';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'technical', label: 'Technical' },
  { key: 'behavioural', label: 'Behavioural' },
  { key: 'roleSpecific', label: 'Role-Specific' },
];

function QuestionCard({
  question,
  hints,
  index,
}: {
  question: string;
  hints: string;
  index: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await navigator.clipboard.writeText(question);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.3 }}
      className="bg-[#111] border border-white/[0.06] rounded-xl overflow-hidden"
    >
      <div
        className="flex items-start gap-3 p-4 cursor-pointer hover:bg-white/[0.02] transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <span className="text-xs text-[#c8973a] font-mono mt-0.5 w-5 flex-shrink-0 font-semibold">
          {String(index + 1).padStart(2, '0')}
        </span>
        <p className="text-sm text-white flex-1 leading-relaxed">{question}</p>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={handleCopy}
            className="text-xs text-white/30 hover:text-white/60 transition-colors px-2 py-1 rounded border border-white/[0.06] hover:border-white/[0.12]"
            title="Copy question"
          >
            {copied ? '✓' : 'Copy'}
          </button>
          <svg
            className={`w-4 h-4 text-white/30 transition-transform ${expanded ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      <AnimatePresence>
        {expanded && hints && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-4 pb-4 pt-0 border-t border-white/[0.04] ml-8">
              <p className="text-xs text-white/30 uppercase tracking-wider mb-2 mt-3">Answer Hints</p>
              <p className="text-sm text-white/55 leading-relaxed">{hints}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function QuestionsClient({ questions }: Props) {
  const [activeTab, setActiveTab] = useState<TabKey>('technical');

  const currentQuestions = questions[activeTab] || [];

  return (
    <div>
      {/* Tab selector */}
      <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar">
        {TABS.map((tab) => {
          const count = (questions[tab.key] || []).length;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap border ${
                activeTab === tab.key
                  ? 'bg-[#c8973a]/10 border-[#c8973a]/25 text-[#c8973a]'
                  : 'bg-transparent border-white/[0.06] text-white/40 hover:text-white/60 hover:border-white/[0.12]'
              }`}
            >
              {tab.label}
              <span
                className={`text-xs px-1.5 py-0.5 rounded ${
                  activeTab === tab.key ? 'bg-[#c8973a]/20 text-[#c8973a]' : 'bg-white/[0.06] text-white/30'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Questions list */}
      {currentQuestions.length === 0 ? (
        <div className="bg-[#111] border border-white/[0.06] rounded-xl p-8 text-center">
          <p className="text-white/30 text-sm">No questions generated for this category.</p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="space-y-3"
            >
              {currentQuestions.map((q, i) => (
                <QuestionCard key={i} question={q.question} hints={q.hints} index={i} />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      <p className="text-xs text-white/25 mt-6 text-center">
        Click any question to reveal answer hints. Use the copy button to save questions for practice.
      </p>
    </div>
  );
}
