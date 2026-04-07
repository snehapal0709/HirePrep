'use client';

import { useEffect, useRef, useState } from 'react';
import { ICategoryScores } from '@/types';

interface CategoryBarsProps {
  scores: ICategoryScores;
}

const categories = [
  { key: 'technical' as const, label: 'Technical Skills' },
  { key: 'experience' as const, label: 'Experience Match' },
  { key: 'domain' as const, label: 'Domain Knowledge' },
  { key: 'keywords' as const, label: 'ATS Keywords' },
];

function getBarColor(score: number): string {
  if (score >= 70) return '#c8973a';
  if (score >= 50) return '#f59e0b';
  return '#ef4444';
}

interface AnimatedBarProps {
  score: number;
  isVisible: boolean;
}

function AnimatedBar({ score, isVisible }: AnimatedBarProps) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => setWidth(score), 100);
      return () => clearTimeout(timer);
    }
  }, [isVisible, score]);

  const color = getBarColor(score);

  return (
    <div className="h-2 w-full bg-white/[0.06] rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-700 ease-out"
        style={{
          width: `${width}%`,
          backgroundColor: color,
        }}
      />
    </div>
  );
}

export default function CategoryBars({ scores }: CategoryBarsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="space-y-5">
      {categories.map(({ key, label }) => {
        const score = scores[key];
        return (
          <div key={key}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-white/70">{label}</span>
              <span className="text-sm font-medium text-white">{score}%</span>
            </div>
            <AnimatedBar score={score} isVisible={isVisible} />
          </div>
        );
      })}
    </div>
  );
}
