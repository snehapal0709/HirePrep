'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface ResumeEntry {
  primary?: string;
  secondary?: string;
  location?: string;
  dates?: string;
  bullets?: string[];
  inline?: string;
}

interface ResumeSection {
  title: string;
  entries: ResumeEntry[];
}

interface ResumeData {
  name: string;
  contact: string[];
  sections: ResumeSection[];
}

interface Props {
  analysisId: string;
  initialAtsResume: string | null;
  jobTitle: string;
  company: string;
  matchScore: number;
  atsScore: number;
}

function parseResume(raw: string): ResumeData | null {
  try {
    return JSON.parse(raw) as ResumeData;
  } catch {
    return null;
  }
}

function ResumePreview({ data }: { data: ResumeData }) {
  return (
    <div className="font-mono text-[#111] bg-white rounded-lg p-8 text-sm leading-relaxed">
      {/* Name */}
      <h1 className="text-2xl font-bold text-center tracking-tight mb-1">{data.name}</h1>

      {/* Contact */}
      {data.contact?.length > 0 && (
        <p className="text-center text-xs text-gray-500 mb-5">
          {data.contact.filter(Boolean).join(' | ')}
        </p>
      )}

      {/* Sections */}
      {data.sections?.map((sec) => (
        <div key={sec.title} className="mb-4">
          <div className="text-xs font-bold uppercase tracking-widest border-b border-gray-800 pb-0.5 mb-2">
            {sec.title}
          </div>
          {sec.entries?.map((entry, i) => (
            <div key={i} className="mb-2">
              {entry.inline ? (
                <p className="text-xs"><span className="font-bold">{entry.inline.split(':')[0]}:</span>{entry.inline.includes(':') ? entry.inline.slice(entry.inline.indexOf(':') + 1) : ''}</p>
              ) : (
                <>
                  <div className="flex justify-between items-baseline gap-2">
                    <span className="font-bold text-xs">{entry.primary}</span>
                    {entry.dates && <span className="text-xs text-gray-500 shrink-0">{entry.dates}</span>}
                  </div>
                  {(entry.secondary || entry.location) && (
                    <div className="flex justify-between items-baseline gap-2">
                      <span className="text-xs italic text-gray-600">{entry.secondary}</span>
                      {entry.location && <span className="text-xs italic text-gray-500 shrink-0">{entry.location}</span>}
                    </div>
                  )}
                  {entry.bullets?.map((b, j) => (
                    <div key={j} className="flex gap-2 text-xs mt-0.5 ml-3">
                      <span className="shrink-0 mt-0.5">•</span>
                      <span>{b}</span>
                    </div>
                  ))}
                </>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function buildPrintHTML(data: ResumeData): string {
  const esc = (s: string) =>
    (s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  const EDU_KEYWORDS  = ['education', 'certification', 'course', 'qualification'];
  const PROJ_KEYWORDS = ['project', 'portfolio', 'work sample'];
  const SKILL_KEYWORDS = ['skill', 'language', 'technology', 'tool', 'competenc'];

  const isEdu   = (t: string) => EDU_KEYWORDS.some(k => t.toLowerCase().includes(k));
  const isProj  = (t: string) => PROJ_KEYWORDS.some(k => t.toLowerCase().includes(k));
  const isSkill = (t: string) => SKILL_KEYWORDS.some(k => t.toLowerCase().includes(k));

  let body = '';

  /* ── Heading ── */
  body += `<div class="heading">
  <div class="name">${esc(data.name)}</div>`;
  if (data.contact?.length) {
    body += `<div class="contact">${data.contact.filter(Boolean).map(esc).join(' <span class="pipe">|</span> ')}</div>`;
  }
  body += `</div>`;

  /* ── Sections ── */
  for (const sec of data.sections ?? []) {
    body += `<div class="section">`;
    body += `<div class="sec-title">${esc(sec.title)}</div>`;
    body += `<ul class="sub-list">`;

    for (const entry of sec.entries ?? []) {

      /* Skills — inline "Category: val1, val2" */
      if (entry.inline || isSkill(sec.title)) {
        const txt = entry.inline ?? '';
        const ci = txt.indexOf(':');
        body += `<li class="skill-row">${ci !== -1
          ? `<strong>${esc(txt.slice(0, ci))}:</strong> ${esc(txt.slice(ci + 1).trim())}`
          : esc(txt)}</li>`;
        continue;
      }

      body += `<li class="entry-item">`;

      if (isProj(sec.title)) {
        /* Projects: bold Name | italic TechStack .............. Dates */
        const left = entry.secondary
          ? `<strong>${esc(entry.primary ?? '')}</strong> | <em>${esc(entry.secondary)}</em>`
          : `<strong>${esc(entry.primary ?? '')}</strong>`;
        body += `<div class="trow">${left}<span class="rc">${esc(entry.dates ?? '')}</span></div>`;

      } else if (isEdu(sec.title)) {
        /* Education row 1: bold Institution ................ Location
                   row 2: italic Degree ..................... italic Dates */
        body += `
          <div class="trow"><strong>${esc(entry.primary ?? '')}</strong><span class="rc">${esc(entry.location ?? '')}</span></div>
          <div class="trow sub"><em>${esc(entry.secondary ?? '')}</em><span class="rc"><em>${esc(entry.dates ?? '')}</em></span></div>`;

      } else {
        /* Experience row 1: bold Job Title ................. Dates
                    row 2: italic Company ................... italic Location */
        body += `
          <div class="trow"><strong>${esc(entry.primary ?? '')}</strong><span class="rc">${esc(entry.dates ?? '')}</span></div>
          <div class="trow sub"><em>${esc(entry.secondary ?? '')}</em><span class="rc"><em>${esc(entry.location ?? '')}</em></span></div>`;
      }

      if (entry.bullets?.length) {
        body += `<ul class="bullets">`;
        for (const b of entry.bullets) body += `<li>${esc(b)}</li>`;
        body += `</ul>`;
      }

      body += `</li>`;
    }

    body += `</ul></div>`;
  }

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<title>${esc(data.name)} — Resume</title>
<style>
  /* Jake's Resume — HTML/CSS faithful reproduction */
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: Georgia, 'Times New Roman', serif;
    font-size: 11pt;
    line-height: 1.3;
    color: #000;
    background: #fff;
    padding: 22px 40px;
    max-width: 730px;
    margin: 0 auto;
  }

  /* Heading */
  .heading { text-align: center; margin-bottom: 8px; }
  .name {
    font-size: 22pt;
    font-weight: 700;
    font-variant: small-caps;
    letter-spacing: 0.5px;
    margin-bottom: 3px;
  }
  .contact { font-size: 9pt; }
  .pipe { margin: 0 5px; }

  /* Section */
  .section { margin-bottom: 6px; }
  .sec-title {
    font-size: 12pt;
    font-variant: small-caps;
    font-weight: 400;
    letter-spacing: 0.5px;
    border-bottom: 1px solid #000;
    padding-bottom: 1px;
    margin-bottom: 4px;
    margin-top: 6px;
  }

  /* Sub-list */
  .sub-list { list-style: none; padding: 0; margin: 0; }

  /* Entry */
  .entry-item { margin-bottom: 5px; }

  /* Two-column tabular row — fill space like \extracolsep{\fill} */
  .trow {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    width: 100%;
  }
  .trow strong { font-size: 10.5pt; }
  .trow em     { font-size: 9.5pt; }
  .rc { /* right column */
    white-space: nowrap;
    flex-shrink: 0;
    margin-left: 8px;
    font-size: 9.5pt;
  }
  .sub { margin-top: 0; }   /* mirrors \vspace{-7pt} */

  /* Bullets */
  .bullets {
    list-style-type: disc;
    margin: 2px 0 0 18px;
    padding: 0;
  }
  .bullets li { font-size: 10pt; margin-bottom: 1px; }

  /* Skills */
  .skill-row { font-size: 10pt; margin-bottom: 2px; list-style: none; }

  @media print {
    body { padding: 0; max-width: 100%; }
    @page { margin: 1cm 1.3cm; size: letter; }
    .section { page-break-inside: avoid; }
  }
</style>
</head>
<body>
${body}
<script>window.onload=function(){setTimeout(function(){window.print();},450);}<\/script>
</body>
</html>`;
}

export default function ATSResumeClient({
  analysisId,
  initialAtsResume,
  jobTitle,
  company,
  matchScore,
  atsScore,
}: Props) {
  const [atsResume, setAtsResume] = useState<string | null>(initialAtsResume);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPdfLoading, setIsPdfLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const parsed = atsResume ? parseResume(atsResume) : null;
  const plainText = parsed
    ? [
        parsed.name,
        parsed.contact?.join(' | '),
        '',
        ...(parsed.sections?.flatMap((s) => [
          s.title,
          ...(s.entries?.flatMap((e) =>
            e.inline
              ? [e.inline]
              : [
                  [e.primary, e.dates].filter(Boolean).join(' | '),
                  [e.secondary, e.location].filter(Boolean).join(' | '),
                  ...(e.bullets?.map((b) => `• ${b}`) ?? []),
                ].filter(Boolean)
          ) ?? []),
          '',
        ]) ?? []),
      ].join('\n')
    : atsResume ?? '';

  const generateResume = async () => {
    setIsGenerating(true);
    setError('');
    try {
      const res = await fetch(`/api/analysis/${analysisId}/resume`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate resume');
      setAtsResume(data.atsResume);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(plainText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTxt = () => {
    const blob = new Blob([plainText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resume-${jobTitle.toLowerCase().replace(/\s+/g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const openPrintWindow = (data: ResumeData) => {
    const htmlContent = buildPrintHTML(data);
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.open();
    win.document.write(htmlContent);
    win.document.close();
  };

  const handleDownloadPDF = async () => {
    // If already parsed as JSON, open print window directly
    if (parsed) {
      openPrintWindow(parsed);
      return;
    }
    // Otherwise regenerate to get proper JSON, then open
    setIsPdfLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/analysis/${analysisId}/resume`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate resume');
      setAtsResume(data.atsResume);
      const freshParsed = parseResume(data.atsResume);
      if (freshParsed) openPrintWindow(freshParsed);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsPdfLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Info card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-[#111] border border-white/[0.06] rounded-xl p-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex-1">
            <h2 className="font-display text-xl font-semibold text-white mb-1">
              ATS-Optimized Resume
            </h2>
            <p className="text-sm text-white/40">
              Rewritten for <span className="text-white/60">{jobTitle}</span>
              {company ? ` at ${company}` : ''} — formatted in Jake&apos;s Resume template.
            </p>
          </div>
          <div className="flex gap-3 items-center">
            <div className="text-center">
              <div className="text-xs text-white/30 mb-0.5">Match</div>
              <div className="font-display text-lg font-bold text-[#c8973a]">{matchScore}%</div>
            </div>
            <div className="w-px h-10 bg-white/[0.06]" />
            <div className="text-center">
              <div className="text-xs text-white/30 mb-0.5">ATS</div>
              <div className="font-display text-lg font-bold text-white/60">{atsScore}</div>
            </div>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { icon: '◎', text: 'Jake\'s Resume layout' },
            { icon: '≡', text: 'ATS-friendly formatting' },
            { icon: '△', text: 'Keyword-optimized content' },
          ].map((item) => (
            <div key={item.text} className="flex items-center gap-2">
              <span className="text-[#c8973a] text-sm font-mono">{item.icon}</span>
              <span className="text-xs text-white/45">{item.text}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {!atsResume ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="bg-[#111] border border-white/[0.06] rounded-xl p-10 text-center"
        >
          <div className="w-14 h-14 rounded-xl bg-[#c8973a]/10 border border-[#c8973a]/20 flex items-center justify-center mx-auto mb-4">
            <span className="text-[#c8973a] text-2xl font-mono">⊕</span>
          </div>
          <h3 className="font-medium text-white mb-2">Generate Your ATS Resume</h3>
          <p className="text-sm text-white/40 mb-6 max-w-sm mx-auto">
            AI will rewrite your resume in Jake&apos;s Resume format, optimized for this job&apos;s ATS.
            Takes ~20 seconds.
          </p>
          <button
            onClick={generateResume}
            disabled={isGenerating}
            className="bg-[#c8973a] hover:bg-[#d4a84d] disabled:opacity-50 disabled:cursor-not-allowed text-black font-semibold px-8 py-3 rounded-lg transition-colors text-sm"
          >
            {isGenerating ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                Generating Resume...
              </span>
            ) : (
              'Generate ATS Resume →'
            )}
          </button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-[#111] border border-white/[0.06] rounded-xl overflow-hidden"
        >
          {/* Toolbar */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.04]">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="text-xs text-white/50">ATS Resume — ready to use</span>
            </div>
            <div className="flex gap-2 flex-wrap justify-end">
              <button
                onClick={handleCopy}
                className="text-xs px-3 py-1.5 border border-white/[0.06] hover:border-white/[0.12] text-white/50 hover:text-white/70 rounded transition-colors"
              >
                {copied ? '✓ Copied' : 'Copy'}
              </button>
              <button
                onClick={handleDownloadTxt}
                className="text-xs px-3 py-1.5 border border-white/[0.06] hover:border-white/[0.12] text-white/50 hover:text-white/70 rounded transition-colors"
              >
                .txt
              </button>
              <button
                onClick={handleDownloadPDF}
                disabled={isPdfLoading}
                className="text-xs px-3 py-1.5 bg-[#c8973a]/10 border border-[#c8973a]/20 text-[#c8973a] hover:bg-[#c8973a]/20 rounded transition-colors flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPdfLoading ? (
                  <>
                    <span className="w-3 h-3 border border-[#c8973a]/40 border-t-[#c8973a] rounded-full animate-spin" />
                    Preparing...
                  </>
                ) : (
                  '⬇ Download PDF'
                )}
              </button>
              <button
                onClick={generateResume}
                disabled={isGenerating}
                className="text-xs px-3 py-1.5 border border-white/[0.06] hover:border-white/[0.12] text-white/40 hover:text-white/60 rounded transition-colors disabled:opacity-40"
              >
                Regenerate
              </button>
            </div>
          </div>

          {/* Resume preview */}
          <div className="p-6 max-h-[700px] overflow-y-auto">
            {parsed ? (
              <ResumePreview data={parsed} />
            ) : (
              <pre className="text-xs text-white/60 whitespace-pre-wrap font-mono">{atsResume}</pre>
            )}
          </div>
        </motion.div>
      )}

      <p className="text-xs text-white/20 text-center">
        Always review before submitting — do not submit fabricated experience.
      </p>
    </div>
  );
}
