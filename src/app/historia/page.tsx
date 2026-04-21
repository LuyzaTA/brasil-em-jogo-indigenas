"use client";
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { useLang } from '../../contexts/LanguageContext';
import { t } from '../../lib/i18n';

interface TimelineEvent {
  id: number;
  date: string;
  title_pt: string;
  title_en: string;
  description_pt: string;
  description_en: string;
  source: string;
  url: string;
  population: number | null;
}

function clean(text: string | null | undefined): string {
  if (!text) return '';
  return text.replace(/【[^】]*】/g, '').trim();
}

function eraLabel(year: number, lang: string): string {
  if (year < 1750) return lang === 'pt' ? 'Colonial' : 'Colonial';
  if (year < 1889) return lang === 'pt' ? 'Império' : 'Empire';
  if (year < 1964) return lang === 'pt' ? 'República' : 'Republic';
  if (year < 1988) return lang === 'pt' ? 'Ditadura' : 'Dictatorship';
  return lang === 'pt' ? 'Democracia' : 'Democracy';
}

function eraColor(dateStr: string): string {
  const y = new Date(dateStr).getFullYear();
  if (y < 1750) return '#7b4f2e';
  if (y < 1889) return '#8b7355';
  if (y < 1964) return '#4a7c6f';
  if (y < 1988) return '#2d6a4f';
  return '#c9a94a';
}

function formatPop(n: number, locale: string): string {
  if (n >= 1_000_000) return (n / 1_000_000).toLocaleString(locale, { maximumFractionDigits: 2 }) + (locale === 'pt-BR' ? ' mi' : 'M');
  if (n >= 1_000) return (n / 1_000).toLocaleString(locale, { maximumFractionDigits: 0 }) + (locale === 'pt-BR' ? ' mil' : 'K');
  return n.toLocaleString(locale);
}

export default function HistoriaPage() {
  const { lang } = useLang();
  const T = t[lang].historia;
  const locale = lang === 'pt' ? 'pt-BR' : 'en-US';
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) return;
    createClient(url, key)
      .from('timeline_events')
      .select('id, date, title_pt, title_en, description_pt, description_en, source, url, population')
      .order('date', { ascending: true })
      .then(({ data }) => { if (data) setTimeline(data as TimelineEvent[]); });
  }, []);

  return (
    <div className="min-h-full" style={{ background: '#f4f0e8' }}>

      {/* ── Hero with geometric diamond pattern ── */}
      <div
        className="text-white px-6 py-12"
        style={{
          background: '#1a3a2a',
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cpolygon points='30,3 57,30 30,57 3,30' fill='none' stroke='rgba(201,169,74,.13)' stroke-width='1'/%3E%3Cpolygon points='30,15 45,30 30,45 15,30' fill='none' stroke='rgba(201,169,74,.07)' stroke-width='.7'/%3E%3C/svg%3E\")",
          backgroundSize: '60px 60px',
        }}
      >
        <div className="max-w-3xl mx-auto">
          {/* Diamond + tag */}
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-block w-2.5 h-2.5 rotate-45 flex-shrink-0" style={{ background: '#c9a94a' }} />
            <p className="text-[11px] uppercase tracking-[0.22em] font-bold" style={{ color: '#c9a94a' }}>
              {T.tag}
            </p>
          </div>
          <h1 className="text-4xl font-bold mb-3 tracking-tight text-white">{T.title}</h1>
          <p className="text-white/65 text-sm leading-relaxed max-w-xl">{T.subtitle}</p>
          <div className="my-5" style={{ height: '1px', background: 'linear-gradient(90deg, #c9a94a 0%, rgba(201,169,74,0.1) 100%)', maxWidth: '240px' }} />
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-medium hover:text-white transition-colors" style={{ color: 'rgba(255,255,255,0.5)' }}>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            {T.back}
          </Link>
        </div>
      </div>

      {/* ── Timeline ── */}
      <div className="max-w-3xl mx-auto px-6 py-12">
        {timeline.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center" style={{ border: '1px solid rgba(0,0,0,.07)', borderLeft: '3px solid #c9a94a' }}>
            <p className="text-gray-400 text-sm">
              {T.empty}{' '}<span className="font-medium text-gray-600">{T.emptyCta}</span>
            </p>
          </div>
        ) : (
          <ol className="relative space-y-0" style={{ borderLeft: '2px solid rgba(45,106,79,0.22)', marginLeft: '8px' }}>
            {timeline.map((item, idx) => {
              const year = new Date(item.date).getFullYear();
              const color = eraColor(item.date);
              const era = eraLabel(year, lang);
              const isExact = year === 2010 || year === 2022;

              const prevWithPop = timeline.slice(0, idx).reverse().find(e => e.population != null);
              const delta = (item.population != null && prevWithPop?.population != null)
                ? item.population - prevWithPop.population : null;
              const pct = (delta != null && prevWithPop!.population! > 0)
                ? Math.round((delta / prevWithPop!.population!) * 100) : null;

              return (
                <li key={item.id} className="ml-8 pb-10 relative">
                  {/* Diamond node */}
                  <span className="absolute flex items-center justify-center" style={{ left: '-37px', top: '3px', width: '18px', height: '18px' }}>
                    <span style={{ display: 'block', width: '12px', height: '12px', background: color, transform: 'rotate(45deg)', boxShadow: `0 0 0 3px #f4f0e8, 0 0 0 4px ${color}55` }} />
                  </span>

                  {/* Year + era */}
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className="text-xs font-black tracking-widest px-2.5 py-0.5 text-white"
                      style={{ background: color, clipPath: 'polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%)' }}
                    >
                      {year}
                    </span>
                    <span className="text-[10px] uppercase tracking-widest font-semibold px-2 py-0.5 rounded-full"
                      style={{ background: `${color}18`, color }}>
                      {era}
                    </span>
                  </div>

                  {/* Card */}
                  <div className="bg-white rounded-xl overflow-hidden hover:shadow-md transition-shadow"
                    style={{ border: '1px solid rgba(0,0,0,.07)', borderLeft: `3px solid ${color}` }}>

                    {/* Population banner */}
                    {item.population != null && (
                      <div className="px-5 pt-4 pb-3 flex items-end justify-between gap-4"
                        style={{ borderBottom: `1px solid ${color}20` }}>
                        <div>
                          <p className="text-[10px] uppercase tracking-widest font-bold mb-0.5 flex items-center gap-1.5" style={{ color }}>
                            <span className="inline-block w-1.5 h-1.5 rotate-45 flex-shrink-0" style={{ background: color }} />
                            {lang === 'pt' ? 'Pop. indígena estimada' : 'Est. indigenous population'}
                            {isExact && <span className="text-[9px] font-normal text-gray-400 ml-1">{lang === 'pt' ? '(IBGE censo)' : '(IBGE census)'}</span>}
                          </p>
                          <p className="text-4xl font-black tracking-tight leading-none" style={{ color }}>
                            {formatPop(item.population, locale)}
                          </p>
                          <p className="text-[10px] text-gray-400 mt-0.5">
                            {item.population.toLocaleString(locale)} {lang === 'pt' ? 'pessoas' : 'people'}
                          </p>
                        </div>
                        {delta != null && pct != null && (
                          <div className="flex-shrink-0 flex flex-col items-center justify-center rounded-lg px-3 py-2 text-center min-w-[72px]"
                            style={{ background: delta < 0 ? '#fff5f5' : '#f0fdf4', border: `1px solid ${delta < 0 ? '#fecaca' : '#bbf7d0'}` }}>
                            <span className="text-xl leading-none" style={{ color: delta < 0 ? '#dc2626' : '#16a34a' }}>{delta < 0 ? '▼' : '▲'}</span>
                            <span className="text-sm font-bold mt-0.5" style={{ color: delta < 0 ? '#dc2626' : '#16a34a' }}>{Math.abs(pct)}%</span>
                            <span className="text-[9px] text-gray-400 mt-0.5 leading-tight">{lang === 'pt' ? 'vs anterior' : 'vs prior'}</span>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="p-5">
                      <h2 className="text-base font-bold mb-2 leading-snug tracking-tight" style={{ color: '#1a3a2a' }}>
                        {clean(lang === 'en' ? (item.title_en || item.title_pt) : item.title_pt)}
                      </h2>
                      {(item.description_pt || item.description_en) && (
                        <p className="text-sm leading-relaxed mb-3" style={{ color: '#4a4a4a' }}>
                          {clean(lang === 'en' ? (item.description_en || item.description_pt) : item.description_pt)}
                        </p>
                      )}
                      {item.url && (
                        <a href={item.url} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-semibold hover:opacity-75 transition-opacity" style={{ color }}>
                          <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                          </svg>
                          {T.source} {item.source}
                        </a>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </div>
  );
}
