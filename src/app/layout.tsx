import type { Metadata } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import './globals.css';
import { SessionProvider } from './providers';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'HirePrep — AI Resume Analysis & Interview Prep',
    template: '%s | HirePrep',
  },
  description:
    'Analyse your resume against any job description. Get match scores, skill gap analysis, tailored interview questions, and a 14-day prep plan powered by AI.',
  keywords: ['resume analysis', 'interview prep', 'job search', 'AI career coach', 'ATS optimization'],
  openGraph: {
    title: 'HirePrep — AI Resume Analysis & Interview Prep',
    description: 'Land your dream job with AI-powered resume analysis and interview preparation.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="bg-[#0a0a0a] text-white antialiased">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
