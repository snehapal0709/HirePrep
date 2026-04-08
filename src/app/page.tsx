'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import Navbar from '@/components/Navbar';

/* ── Animated counter ─────────────────────────────── */
function AnimatedCounter({ end, duration = 2000, suffix = '', prefix = '' }: { end: number; duration?: number; suffix?: string; prefix?: string }) {
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

  return <span ref={ref}>{prefix}{count}{suffix}</span>;
}

/* ── Feature card data ───────────────────────────── */
const features = [
  { icon: '◎', title: 'Match Score Analysis', desc: 'Get a precise 0–100 score showing how well your resume aligns with the job requirements.', color: 'from-blue-500/10 to-blue-500/5', border: 'border-blue-500/20' },
  { icon: '△', title: 'Skill Gap Detection', desc: 'Instantly see which skills you already have and which ones you need to develop.', color: 'from-purple-500/10 to-purple-500/5', border: 'border-purple-500/20' },
  { icon: '?', title: 'Interview Questions', desc: '6–8 tailored questions per category: technical, behavioural, and role-specific.', color: 'from-emerald-500/10 to-emerald-500/5', border: 'border-emerald-500/20' },
  { icon: '▦', title: '2-Week Prep Plan', desc: 'A structured 14-day plan with daily topics, resources, and goals to land the interview.', color: 'from-amber-500/10 to-amber-500/5', border: 'border-amber-500/20' },
  { icon: '⊕', title: 'ATS Resume Optimizer', desc: 'Rewrite your resume optimized for Applicant Tracking Systems and keyword matching.', color: 'from-rose-500/10 to-rose-500/5', border: 'border-rose-500/20' },
  { icon: '≡', title: 'Category Breakdown', desc: 'Drill into Technical, Experience, Domain, and Keywords scores individually.', color: 'from-cyan-500/10 to-cyan-500/5', border: 'border-cyan-500/20' },
];

const steps = [
  { num: '01', title: 'Upload Resume', desc: 'PDF drag-drop or paste as text', icon: '📄' },
  { num: '02', title: 'Add Job Description', desc: 'Paste the full JD from any listing', icon: '📋' },
  { num: '03', title: 'AI Analysis', desc: 'Groq AI analyses the match in seconds', icon: '⚡' },
  { num: '04', title: 'Get Prep Plan', desc: 'Receive scores, gaps, and a 14-day plan', icon: '📊' },
  { num: '05', title: 'Land the Interview', desc: 'Walk in prepared and confident', icon: '🎯' },
];

function SectionHeading({ label, title, desc }: { label: string; title: string; desc?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }} className="text-center mb-16">
      <motion.span
        initial={{ opacity: 0, scale: 0.8 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.4 }}
        className="inline-block text-xs tracking-widest uppercase text-[#c8973a] mb-4 font-medium bg-[#c8973a]/10 border border-[#c8973a]/20 rounded-full px-4 py-1.5"
      >
        {label}
      </motion.span>
      <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-white mb-4 leading-tight">{title}</h2>
      {desc && <p className="text-white/50 max-w-xl mx-auto text-base leading-relaxed">{desc}</p>}
    </motion.div>
  );
}

/* ── Floating orbs ── */
function FloatingOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="orb w-96 h-96 bg-[#c8973a]/8 top-20 -left-32" style={{ animation: 'float 8s ease-in-out infinite' }} />
      <div className="orb w-80 h-80 bg-purple-500/5 top-40 right-0" style={{ animation: 'float 10s ease-in-out infinite reverse' }} />
      <div className="orb w-64 h-64 bg-blue-500/5 bottom-20 left-1/3" style={{ animation: 'float 12s ease-in-out infinite 2s' }} />
    </div>
  );
}

export default function LandingPage() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navbar />

      {/* ── Hero ──────────────────────────────────── */}
      <section ref={heroRef} className="relative pt-32 pb-28 px-4 overflow-hidden">
        {/* Grid background */}
        <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        <FloatingOrbs />

        {/* Radial glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#c8973a]/5 rounded-full blur-[120px] pointer-events-none" />

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative max-w-5xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-[#c8973a]/10 border border-[#c8973a]/25 rounded-full px-4 py-2 mb-10 animate-border-glow"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-[#c8973a] animate-pulse" />
              <span className="text-xs text-[#c8973a] font-medium tracking-wide">AI-Powered Career Intelligence</span>
              <span className="text-[#c8973a]/40">✦</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.7 }}
              className="font-display text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-[1.0] tracking-tight mb-6"
            >
              Land Your Dream Job,
              <br />
              <span className="gradient-text">Not Just Any Job.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.6 }}
              className="text-lg sm:text-xl text-white/50 max-w-2xl mx-auto mb-12 leading-relaxed"
            >
              Your AI partner for landing the job. Upload your resume, paste the job description,
              and get a complete analysis in under 60 seconds.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                href="/register"
                className="group relative bg-[#c8973a] hover:bg-[#d4a84d] text-black font-semibold px-8 py-4 rounded-xl transition-all duration-300 text-base overflow-hidden hover:shadow-[0_0_40px_rgba(200,151,58,0.4)] hover:scale-105"
              >
                <span className="relative z-10">Analyse My Resume →</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </Link>
              <Link
                href="/login"
                className="border border-white/[0.12] hover:border-white/[0.25] text-white/70 hover:text-white px-8 py-4 rounded-xl transition-all duration-300 text-base hover:bg-white/[0.03] backdrop-blur-sm"
              >
                Sign In
              </Link>
            </motion.div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mt-20 grid grid-cols-3 gap-8 max-w-lg mx-auto"
          >
            {[
              { value: 94, suffix: '%', label: 'Match accuracy' },
              { value: 3, suffix: 'x', label: 'More callbacks' },
              { value: 12, suffix: 'k+', label: 'Resumes analysed' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + i * 0.1, duration: 0.4 }}
                className="text-center group"
              >
                <div className="font-display text-3xl sm:text-4xl font-bold text-[#c8973a] mb-1 group-hover:scale-110 transition-transform duration-300">
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-xs text-white/35">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.5 }}
            className="mt-16 flex flex-col items-center gap-2"
          >
            <span className="text-xs text-white/20 tracking-widest uppercase">Scroll to explore</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-px h-8 bg-gradient-to-b from-white/20 to-transparent"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* ── How It Works ──────────────────────────── */}
      <section id="how-it-works" className="py-24 px-4 border-t border-white/[0.04] relative overflow-hidden">
        <div className="orb w-96 h-96 bg-blue-500/5 -top-20 right-0 pointer-events-none" />
        <div className="max-w-6xl mx-auto">
          <SectionHeading label="Process" title="How It Works" desc="Five simple steps from resume to interview-ready in minutes." />
          <div className="relative">
            {/* Animated connector */}
            <div className="hidden lg:block absolute top-7 left-[7%] right-[7%] h-px overflow-hidden">
              <div className="h-full bg-gradient-to-r from-transparent via-[#c8973a]/30 to-transparent" />
              <motion.div
                initial={{ x: '-100%' }}
                whileInView={{ x: '100%' }}
                viewport={{ once: true }}
                transition={{ duration: 2, ease: 'linear' }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-[#c8973a] to-transparent"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {steps.map((step, i) => {
                const ref = useRef(null);
                const inView = useInView(ref, { once: true, margin: '-60px' });
                return (
                  <motion.div
                    key={step.num}
                    ref={ref}
                    initial={{ opacity: 0, y: 24 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: i * 0.12, duration: 0.5 }}
                    className="relative flex flex-col items-start lg:items-center text-left lg:text-center group"
                  >
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="w-14 h-14 rounded-2xl bg-[#111] border border-white/[0.06] group-hover:border-[#c8973a]/30 flex items-center justify-center mb-4 relative z-10 transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(200,151,58,0.15)]"
                    >
                      <span className="font-display text-lg font-semibold text-[#c8973a]">{step.num}</span>
                    </motion.div>
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
      <section id="features" className="py-24 px-4 border-t border-white/[0.04] relative overflow-hidden">
        <div className="orb w-[500px] h-[500px] bg-[#c8973a]/5 -bottom-40 -left-40 pointer-events-none" />
        <div className="max-w-6xl mx-auto">
          <SectionHeading label="Features" title="Everything You Need to Get Hired" desc="A complete intelligence suite built for serious job seekers." />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feature, i) => {
              const ref = useRef(null);
              const inView = useInView(ref, { once: true, margin: '-60px' });
              return (
                <motion.div
                  key={feature.title}
                  ref={ref}
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className={`group bg-gradient-to-br ${feature.color} border ${feature.border} rounded-2xl p-6 hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all duration-300 cursor-default relative overflow-hidden`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <motion.div
                    whileHover={{ scale: 1.15, rotate: 10 }}
                    className="w-12 h-12 rounded-xl bg-[#0a0a0a]/60 border border-white/[0.08] flex items-center justify-center mb-5 relative z-10"
                  >
                    <span className="text-[#c8973a] text-lg font-mono">{feature.icon}</span>
                  </motion.div>
                  <h3 className="font-semibold text-white mb-2 text-sm relative z-10">{feature.title}</h3>
                  <p className="text-xs text-white/50 leading-relaxed relative z-10">{feature.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Social proof / testimonial strip ─────── */}
      <section className="py-16 px-4 border-t border-white/[0.04]">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex flex-wrap items-center justify-center gap-8 text-white/20 text-xs tracking-widest uppercase"
          >
            {['Resume Analysis', 'ATS Optimization', 'Interview Prep', 'Skill Gap Detection', '14-Day Plans'].map((item, i) => (
              <motion.span
                key={item}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-3"
              >
                {i > 0 && <span className="text-[#c8973a]/30">✦</span>}
                {item}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA Strip ─────────────────────────────── */}
      <section className="py-24 px-4 border-t border-white/[0.04] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#c8973a]/[0.03] to-transparent pointer-events-none" />
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative bg-gradient-to-br from-[#c8973a]/[0.08] to-[#c8973a]/[0.03] border border-[#c8973a]/20 rounded-3xl p-12 text-center overflow-hidden animate-glow-pulse"
          >
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-[#c8973a]/20 rounded-tl-3xl" />
            <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-[#c8973a]/20 rounded-br-3xl" />

            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="w-16 h-16 border border-[#c8973a]/20 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <div className="w-8 h-8 border border-[#c8973a]/40 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-[#c8973a] rounded-full" />
              </div>
            </motion.div>

            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-white mb-4">
              Ready to land your dream job?
            </h2>
            <p className="text-white/50 mb-10 text-base max-w-md mx-auto leading-relaxed">
              Join thousands of candidates who use HirePrep to stand out in every application.
            </p>
            <Link
              href="/register"
              className="group relative inline-block bg-[#c8973a] hover:bg-[#d4a84d] text-black font-semibold px-10 py-4 rounded-xl transition-all duration-300 text-base overflow-hidden hover:shadow-[0_0_40px_rgba(200,151,58,0.5)] hover:scale-105"
            >
              <span className="relative z-10">Get Started Free →</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────── */}
      <footer className="border-t border-white/[0.04] py-10 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 group">
            <motion.div whileHover={{ rotate: 180 }} transition={{ duration: 0.3 }} className="w-6 h-6 rounded border border-[#c8973a]/40 flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-sm bg-[#c8973a]" />
            </motion.div>
            <span className="font-display text-sm font-semibold text-white">HirePrep</span>
          </div>
          <p className="text-xs text-white/25">© {new Date().getFullYear()} HirePrep. Built with ♥ for job seekers.</p>
          <div className="flex gap-6">
            <Link href="/login" className="text-xs text-white/30 hover:text-[#c8973a] transition-colors duration-200">Sign In</Link>
            <Link href="/register" className="text-xs text-white/30 hover:text-[#c8973a] transition-colors duration-200">Register</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
