'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

const STEPS = [
  { label: 'Extracting resume content...', duration: 1500 },
  { label: 'Parsing job requirements...', duration: 1500 },
  { label: 'Analysing skill match...', duration: 2000 },
  { label: 'Generating interview questions...', duration: 2000 },
  { label: 'Building your prep plan...', duration: 2000 },
  { label: 'Finalising your analysis...', duration: 1000 },
];

interface LoadingStepsProps {
  isLoading: boolean;
}

export default function LoadingSteps({ isLoading }: LoadingStepsProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  useEffect(() => {
    if (!isLoading) {
      setCurrentStep(0);
      setCompletedSteps([]);
      return;
    }

    let step = 0;
    setCurrentStep(0);
    setCompletedSteps([]);

    const advance = () => {
      if (step < STEPS.length - 1) {
        setCompletedSteps((prev) => [...prev, step]);
        step++;
        setCurrentStep(step);
        const timer = setTimeout(advance, STEPS[step].duration);
        return () => clearTimeout(timer);
      }
    };

    const timer = setTimeout(advance, STEPS[0].duration);
    return () => clearTimeout(timer);
  }, [isLoading]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-sm flex items-center justify-center">
      <div className="max-w-md w-full mx-4 bg-[#111] border border-white/[0.06] rounded-xl p-8">
        <div className="mb-6">
          <h3 className="font-display text-xl font-semibold text-white mb-1">
            Analysing your profile
          </h3>
          <p className="text-sm text-white/40">
            Our AI is evaluating your resume against the job description...
          </p>
        </div>

        <div className="space-y-3">
          {STEPS.map((step, i) => {
            const isCompleted = completedSteps.includes(i);
            const isCurrent = currentStep === i;
            const isPending = i > currentStep;

            return (
              <div key={i} className="flex items-center gap-3">
                <div className="w-5 h-5 flex-shrink-0 flex items-center justify-center">
                  {isCompleted ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-5 h-5 rounded-full bg-[#c8973a] flex items-center justify-center"
                    >
                      <svg className="w-3 h-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </motion.div>
                  ) : isCurrent ? (
                    <div className="w-5 h-5 rounded-full border-2 border-[#c8973a] border-t-transparent animate-spin" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border border-white/[0.12]" />
                  )}
                </div>
                <span
                  className={`text-sm transition-colors ${
                    isCompleted
                      ? 'text-white/40 line-through'
                      : isCurrent
                      ? 'text-white'
                      : 'text-white/25'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Progress bar */}
        <div className="mt-6 h-1 bg-white/[0.06] rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-[#c8973a] rounded-full"
            initial={{ width: '0%' }}
            animate={{
              width: `${((completedSteps.length + (currentStep > 0 ? 0.5 : 0)) / STEPS.length) * 100}%`,
            }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
    </div>
  );
}

export { STEPS };
