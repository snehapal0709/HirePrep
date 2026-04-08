'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: session } = useSession();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isLanding = pathname === '/';

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled || !isLanding ? 'bg-[#0a0a0a]/90 backdrop-blur-md border-b border-white/[0.06] shadow-[0_1px_0_rgba(255,255,255,0.04)]' : 'bg-transparent'}`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <motion.div whileHover={{ rotate: 180, scale: 1.1 }} transition={{ duration: 0.3 }} className="w-7 h-7 rounded border border-[#c8973a]/40 group-hover:border-[#c8973a]/70 flex items-center justify-center transition-colors duration-300">
            <div className="w-3 h-3 rounded-sm bg-[#c8973a]" />
          </motion.div>
          <span className="font-display text-lg font-semibold text-white tracking-tight group-hover:text-[#c8973a] transition-colors duration-300">
            HirePrep
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {isLanding && (
            <>
              <a href="#features" className="text-sm text-white/50 hover:text-white transition-colors duration-200 relative group">
                Features
                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-[#c8973a] group-hover:w-full transition-all duration-300" />
              </a>
              <a href="#how-it-works" className="text-sm text-white/50 hover:text-white transition-colors duration-200 relative group">
                How It Works
                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-[#c8973a] group-hover:w-full transition-all duration-300" />
              </a>
            </>
          )}
          {session ? (
            <>
              <Link href="/dashboard" className="text-sm text-white/50 hover:text-white transition-colors duration-200 relative group">
                Dashboard
                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-[#c8973a] group-hover:w-full transition-all duration-300" />
              </Link>
              <button onClick={() => signOut({ callbackUrl: '/' })} className="text-sm text-white/50 hover:text-white transition-colors duration-200">
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm text-white/50 hover:text-white transition-colors duration-200">
                Sign In
              </Link>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/register" className="text-sm bg-[#c8973a] text-black font-medium px-4 py-2 rounded-lg hover:bg-[#d4a84d] transition-all duration-200 hover:shadow-[0_0_20px_rgba(200,151,58,0.3)]">
                  Get Started
                </Link>
              </motion.div>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden flex flex-col gap-1.5 p-2" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
          <motion.span animate={mobileOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }} className="block w-5 h-px bg-white/60 origin-center" />
          <motion.span animate={mobileOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }} className="block w-5 h-px bg-white/60" />
          <motion.span animate={mobileOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }} className="block w-5 h-px bg-white/60 origin-center" />
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden overflow-hidden bg-[#111]/95 backdrop-blur-md border-b border-white/[0.06]"
          >
            <div className="px-4 py-5 flex flex-col gap-4">
              {isLanding && (
                <>
                  <a href="#features" className="text-sm text-white/60 hover:text-white transition-colors" onClick={() => setMobileOpen(false)}>Features</a>
                  <a href="#how-it-works" className="text-sm text-white/60 hover:text-white transition-colors" onClick={() => setMobileOpen(false)}>How It Works</a>
                </>
              )}
              {session ? (
                <>
                  <Link href="/dashboard" className="text-sm text-white/60 hover:text-white transition-colors" onClick={() => setMobileOpen(false)}>Dashboard</Link>
                  <button onClick={() => { signOut({ callbackUrl: '/' }); setMobileOpen(false); }} className="text-sm text-white/60 hover:text-white text-left transition-colors">Sign Out</button>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-sm text-white/60 hover:text-white transition-colors" onClick={() => setMobileOpen(false)}>Sign In</Link>
                  <Link href="/register" className="text-sm bg-[#c8973a] text-black font-medium px-4 py-2.5 rounded-lg text-center hover:bg-[#d4a84d] transition-colors" onClick={() => setMobileOpen(false)}>Get Started</Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
