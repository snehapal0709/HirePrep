'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import Navbar from '@/components/Navbar';

/* ── Animated counter ─────────────────────────────── */
function AnimatedCounter({
  end,
  duration = 2000,
  suffix = '',
  prefix = '',
}: {
  end: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      const current = Math.round(eased * end);
      setCount(current);
      if (t < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [inView, end, duration]);

  return (
    <span ref={ref}>
      {prefix}{count}{suffix}
    </span>
  );
}

/* ── Feature card data ───────────────────────────── */
const features = [
  {
    icon: '◎',
    title: 'Match Score Analysis',
    desc: 'Get a precise 0–100 score showing how well your resume aligns with the job requirements.',
  },
  {
    icon: '△',
    title: 'Skill Gap Detection',
    desc: 'Instantly see which skills you already have and which ones you need to develop.',
  },
  {
    icon: '?',
    title: 'Interview Questions',
    desc: '6–8 tailored questions per category: technical, behavioural, and role-specific.',
  },
  {
    icon: '▦',
    title: '2-Week Prep Plan',
    desc: 'A structured 14-day plan with daily topics, resources, and goals to land the interview.',
  },
  {
    icon: '⊕',
    title: 'ATS Resume Optimizer',
    desc: 'Rewrite your resume optimized for Applicant Tracking Systems and keyword matching.',
  },
  {
    icon: '≡',
    title: 'Category Breakdown',
    desc: 'Drill into Technical, Experience, Domain, and Keywords scores individually.',
  },
];

/* ── Steps data ──────────────────────────────────── */
const steps = [
  { num: '01', title: 'Upload Resume', desc: 'PDF drag-drop or paste as text' },
  { num: '02', title: 'Add Job Description', desc: 'Paste the full JD from any listing' },
  { num: '03', title: 'AI Analysis', desc: 'Claude AI analyses the match in seconds' },
  { num: '04', title: 'Get Prep Plan', desc: 'Receive scores, gaps, and a 14-day plan' },
  { num: '05', title: 'Land the Interview', desc: 'Walk in prepared and confident' },
];

/* ── Section heading ─────────────────────────────── */
function SectionHeading({ label, title, desc }: { label: string; title: string; desc?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className="text-center mb-12"
    >
      <span className="inline-block text-xs tracking-widest uppercase text-[#c8973a] mb-4 font-medium">
        {label}
      </span>
      <h2 className="font-display text-3xl sm:text-4xl font-semibold text-white mb-4">{title}</h2>
      {desc && <p className="text-white/50 max-w-xl mx-auto text-base">{desc}</p>}
    </motion.div>
  );
}

/* ── Main page ───────────────────────────────────── */
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navbar />

      {/* ── Hero ──────────────────────────────────── */}
      <section className="relative pt-32 pb-24 px-4 overflow-hidden">
        {/* Subtle grid background */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-[#c8973a]/10 border border-[#c8973a]/20 rounded-full px-4 py-1.5 mb-8">
              <div className="w-1.5 h-1.5 rounded-full bg-[#c8973a] animate-pulse" />
              <span className="text-xs text-[#c8973a] font-medium tracking-wide">
                AI-Powered Career Intelligence
              </span>
            </div>

            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.05] tracking-tight mb-6">
              Land Your Dream Job,
              <br />
              <span className="text-[#c8973a]">Not Just Any Job.</span>
            </h1>

            <p className="text-lg sm:text-xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed">
              Your AI partner for landing the job. Upload your resume, paste the job description,
              and get a complete analysis in under 60 seconds.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/register"
                className="bg-[#c8973a] hover:bg-[#d4a84d] text-black font-semibold px-8 py-3.5 rounded-lg transition-all duration-200 text-base hover:shadow-[0_0_20px_rgba(200,151,58,0.3)]"
              >
                Analyse My Resume →
              </Link>
              <Link
                href="/login"
                className="border border-white/[0.1] hover:border-white/[0.2] text-white/70 hover:text-white px-8 py-3.5 rounded-lg transition-all duration-200 text-base"
              >
                Sign In
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-16 grid grid-cols-3 gap-6 max-w-lg mx-auto"
          >
            {[
              { value: 94, suffix: '%', label: 'Match accuracy' },
              { value: 3, suffix: 'x', label: 'More callbacks' },
              { value: 12, suffix: 'k+', label: 'Resumes analysed' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-display text-3xl font-bold text-[#c8973a]">
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-xs text-white/35 mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── How It Works ──────────────────────────── */}
      <section id="how-it-works" className="py-20 px-4 border-t border-white/[0.04]">
        <div className="max-w-6xl mx-auto">
          <SectionHeading
            label="Process"
            title="How It Works"
            desc="Five simple steps from resume to interview-ready in minutes."
          />

          <div className="relative">
            {/* Connector line (desktop) */}
            <div className="hidden lg:block absolute top-7 left-0 right-0 h-px bg-white/[0.04]" />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {steps.map((step, i) => {
                const ref = useRef(null);
                const inView = useInView(ref, { once: true, margin: '-60px' });
                return (
                  <motion.div
                    key={step.num}
                    ref={ref}
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: i * 0.1, duration: 0.4 }}
                    className="relative flex flex-col items-start lg:items-center text-left lg:text-center"
                  >
                    <div className="w-14 h-14 rounded-xl bg-[#111] border border-white/[0.06] flex items-center justify-center mb-4 relative z-10">
                      <span className="font-display text-lg font-semibold text-[#c8973a]">
                        {step.num}
                      </span>
                    </div>
                    <h3 className="font-medium text-white mb-1.5 text-sm">{step.title}</h3>
                    <p className="text-xs text-white/40 leading-relaxed">{step.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ──────────────────────────────── */}
      <section id="features" className="py-20 px-4 border-t border-white/[0.04]">
        <div className="max-w-6xl mx-auto">
          <SectionHeading
            label="Features"
            title="Everything You Need to Get Hired"
            desc="A complete intelligence suite built for serious job seekers."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feature, i) => {
              const ref = useRef(null);
              const inView = useInView(ref, { once: true, margin: '-60px' });
              return (
                <motion.div
                  key={feature.title}
                  ref={ref}
                  initial={{ opacity: 0, y: 24 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                  className="bg-[#111] border border-white/[0.06] rounded-xl p-6 hover:border-white/[0.10] transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#c8973a]/10 border border-[#c8973a]/20 flex items-center justify-center mb-4">
                    <span className="text-[#c8973a] text-base font-mono">{feature.icon}</span>
                  </div>
                  <h3 className="font-semibold text-white mb-2 text-sm">{feature.title}</h3>
                  <p className="text-xs text-white/45 leading-relaxed">{feature.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA Strip ─────────────────────────────── */}
      <section className="py-20 px-4 border-t border-white/[0.04]">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-[#c8973a]/[0.08] border border-[#c8973a]/20 rounded-2xl p-10 text-center"
          >
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-white mb-4">
              Ready to land your dream job?
            </h2>
            <p className="text-white/50 mb-8 text-base">
              Join thousands of candidates who use HirePrep to stand out in every application.
            </p>
            <Link
              href="/register"
              className="inline-block bg-[#c8973a] hover:bg-[#d4a84d] text-black font-semibold px-8 py-3.5 rounded-lg transition-all duration-200 text-base hover:shadow-[0_0_24px_rgba(200,151,58,0.4)]"
            >
              Get Started Free →
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────── */}
      <footer className="border-t border-white/[0.04] py-10 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded border border-[#c8973a]/40 flex items-center justify-center">
              <div className="w-2 h-2 rounded-sm bg-[#c8973a]" />
            </div>
            <span className="font-display text-sm font-semibold text-white">HirePrep</span>
          </div>
          <p className="text-xs text-white/25">
            © {new Date().getFullYear()} HirePrep. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/login" className="text-xs text-white/30 hover:text-white/60 transition-colors">
              Sign In
            </Link>
            <Link href="/register" className="text-xs text-white/30 hover:text-white/60 transition-colors">
              Register
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
