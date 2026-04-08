'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { DashboardMetrics } from '@/types';

interface Props {
  metrics: DashboardMetrics;
}

function AnimatedNumber({ value, duration = 1400 }: { value: number; duration?: number }) {
  const [display, setDisplay] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (hasAnimated.current || value === 0) { setDisplay(value); return; }
    hasAnimated.current = true;
    const startTime = performance.now();
    const tick = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - t, 4);
      setDisplay(Math.round(eased * value));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [value, duration]);

  return <>{display}</>;
}

export default function DashboardClient({ metrics }: Props) {
  const cards = [
    {
      label: 'Total Analyses',
      value: metrics.totalAnalyses,
      suffix: '',
      icon: '◎',
      desc: 'resumes analysed',
      color: 'from-blue-500/10 to-transparent',
      border: 'border-blue-500/15',
      iconColor: 'text-blue-400',
    },
    {
      label: 'Average Score',
      value: metrics.avgScore,
      suffix: '%',
      icon: '△',
      desc: 'avg match score',
      color: 'from-[#c8973a]/10 to-transparent',
      border: 'border-[#c8973a]/15',
      iconColor: 'text-[#c8973a]',
    },
    {
      label: 'Best Score',
      value: metrics.bestScore,
      suffix: '%',
      icon: '✦',
      desc: 'highest match',
      color: 'from-emerald-500/10 to-transparent',
      border: 'border-emerald-500/15',
      iconColor: 'text-emerald-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((card, i) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: i * 0.1, duration: 0.5 }}
          whileHover={{ y: -2, transition: { duration: 0.2 } }}
          className={`relative bg-gradient-to-br ${card.color} border ${card.border} rounded-2xl p-5 overflow-hidden group hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] transition-all duration-300`}
        >
          {/* Top accent line */}
          <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent ${card.border.replace('border-', 'via-')} to-transparent`} />

          <div className="flex items-start justify-between mb-3">
            <span className={`text-xl ${card.iconColor} font-mono`}>{card.icon}</span>
            <span className="text-xs text-white/25 bg-white/[0.04] px-2 py-0.5 rounded-full">{card.desc}</span>
          </div>

          <p className="font-display text-4xl font-bold text-white mb-1">
            <AnimatedNumber value={card.value} />
            <span className="text-2xl text-white/60">{card.suffix}</span>
          </p>
          <p className="text-xs text-white/40">{card.label}</p>

          {/* Bar indicator */}
          <div className="mt-3 h-1 bg-white/[0.05] rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: card.suffix === '%' ? `${card.value}%` : `${Math.min((card.value / 10) * 100, 100)}%` }}
              transition={{ delay: i * 0.1 + 0.5, duration: 1, ease: 'easeOut' }}
              className={`h-full rounded-full bg-gradient-to-r ${card.color.replace('from-', 'from-').replace('/10', '/60').replace('to-transparent', 'to-white/20')}`}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
