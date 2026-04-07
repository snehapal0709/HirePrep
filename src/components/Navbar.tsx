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
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || !isLanding
          ? 'bg-[#0a0a0a]/95 backdrop-blur-sm border-b border-white/[0.06]'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-7 h-7 rounded border border-[#c8973a]/40 flex items-center justify-center">
            <div className="w-3 h-3 rounded-sm bg-[#c8973a]" />
          </div>
          <span className="font-display text-lg font-semibold text-white tracking-tight">
            HirePrep
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {isLanding && (
            <>
              <a
                href="#features"
                className="text-sm text-white/55 hover:text-white transition-colors"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-sm text-white/55 hover:text-white transition-colors"
              >
                How It Works
              </a>
            </>
          )}
          {session ? (
            <>
              <Link
                href="/dashboard"
                className="text-sm text-white/55 hover:text-white transition-colors"
              >
                Dashboard
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="text-sm text-white/55 hover:text-white transition-colors"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm text-white/55 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="text-sm bg-[#c8973a] text-black font-medium px-4 py-2 rounded hover:bg-[#d4a84d] transition-colors"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <span
            className={`block w-5 h-px bg-white/60 transition-transform ${
              mobileOpen ? 'rotate-45 translate-y-2' : ''
            }`}
          />
          <span
            className={`block w-5 h-px bg-white/60 transition-opacity ${
              mobileOpen ? 'opacity-0' : ''
            }`}
          />
          <span
            className={`block w-5 h-px bg-white/60 transition-transform ${
              mobileOpen ? '-rotate-45 -translate-y-2' : ''
            }`}
          />
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden bg-[#111] border-b border-white/[0.06]"
          >
            <div className="px-4 py-4 flex flex-col gap-4">
              {isLanding && (
                <>
                  <a href="#features" className="text-sm text-white/55" onClick={() => setMobileOpen(false)}>
                    Features
                  </a>
                  <a href="#how-it-works" className="text-sm text-white/55" onClick={() => setMobileOpen(false)}>
                    How It Works
                  </a>
                </>
              )}
              {session ? (
                <>
                  <Link href="/dashboard" className="text-sm text-white/55" onClick={() => setMobileOpen(false)}>
                    Dashboard
                  </Link>
                  <button
                    onClick={() => { signOut({ callbackUrl: '/' }); setMobileOpen(false); }}
                    className="text-sm text-white/55 text-left"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-sm text-white/55" onClick={() => setMobileOpen(false)}>
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="text-sm bg-[#c8973a] text-black font-medium px-4 py-2 rounded text-center"
                    onClick={() => setMobileOpen(false)}
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
