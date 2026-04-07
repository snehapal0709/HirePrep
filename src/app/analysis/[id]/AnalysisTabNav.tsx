'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface Props {
  analysisId: string;
}

const tabs = [
  { label: 'Overview', href: '' },
  { label: 'Questions', href: '/questions' },
  { label: 'Prep Plan', href: '/plan' },
  { label: 'ATS Resume', href: '/resume' },
];

export default function AnalysisTabNav({ analysisId }: Props) {
  const pathname = usePathname();
  const base = `/analysis/${analysisId}`;

  return (
    <nav className="flex gap-1 overflow-x-auto pb-0 no-scrollbar -mx-1 px-1">
      {tabs.map((tab) => {
        const href = `${base}${tab.href}`;
        const isActive = tab.href === '' ? pathname === base : pathname.startsWith(`${base}${tab.href}`);

        return (
          <Link
            key={tab.label}
            href={href}
            className={`flex-shrink-0 text-sm px-4 py-2.5 border-b-2 transition-colors whitespace-nowrap ${
              isActive
                ? 'border-[#c8973a] text-[#c8973a]'
                : 'border-transparent text-white/40 hover:text-white/70 hover:border-white/20'
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
