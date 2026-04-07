'use client';

import { useEffect, useRef, useState } from 'react';
import { DashboardMetrics } from '@/types';

interface Props {
  metrics: DashboardMetrics;
}

function AnimatedNumber({ value, duration = 1200 }: { value: number; duration?: number }) {
  const [display, setDisplay] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (hasAnimated.current || value === 0) {
      setDisplay(value);
      return;
    }
    hasAnimated.current = true;

    const startTime = performance.now();
    const tick = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(eased * value));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [value, duration]);

  return <>{display}</>;
}

export default function DashboardClient({ metrics }: Props) {
  const metricCards = [
    { label: 'Total Analyses', value: metrics.totalAnalyses, suffix: '' },
    { label: 'Average Score', value: metrics.avgScore, suffix: '%' },
    { label: 'Best Score', value: metrics.bestScore, suffix: '%' },
  ];

  return (
    <div className="grid grid-cols-3 gap-4">
      {metricCards.map((card) => (
        <div
          key={card.label}
          className="bg-[#111] border border-white/[0.06] rounded-xl p-5"
        >
          <p className="text-xs text-white/40 mb-2">{card.label}</p>
          <p className="font-display text-3xl font-bold text-[#c8973a]">
            <AnimatedNumber value={card.value} />
            <span className="text-xl">{card.suffix}</span>
          </p>
        </div>
      ))}
    </div>
  );
}
