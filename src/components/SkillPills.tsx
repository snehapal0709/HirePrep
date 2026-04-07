'use client';

import { motion } from 'framer-motion';

interface SkillPillsProps {
  skills: string[];
  variant: 'found' | 'missing';
}

export default function SkillPills({ skills, variant }: SkillPillsProps) {
  const isFound = variant === 'found';

  if (skills.length === 0) {
    return (
      <p className="text-sm text-white/30 italic">
        {isFound ? 'No matching skills detected.' : 'Great — no missing skills detected!'}
      </p>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {skills.map((skill, i) => (
        <motion.span
          key={skill}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.04, duration: 0.2 }}
          className={`px-3 py-1 rounded text-xs font-medium border ${
            isFound
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
              : 'bg-red-500/10 border-red-500/20 text-red-400'
          }`}
        >
          {skill}
        </motion.span>
      ))}
    </div>
  );
}
