"use client";
import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import ModeControls from '../components/ModeControls';
import Sidebar from '../components/Sidebar';
import { createClient } from '@supabase/supabase-js';
import { useLang } from '../contexts/LanguageContext';
import { t } from '../lib/i18n';

const MapComponent = dynamic(() => import('../components/MapComponent'), { ssr: false });

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

interface PopupState {
  event: TimelineEvent;
  x: number;
  y: number;
}

function clean(text: string | null | undefined): string {
  if (!text) return '';
  return text.replace(/【[^】]*】/g, '').trim();
}

function formatPop(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace('.0', '') + 'M';
  if (n >= 1_000) return Math.round(n / 1_000) + 'K';
  return String(n);
}

function eraColor(dateStr: string): string {
  const y = new Date(dateStr).getFullYear();
  if (y < 1800) return '#a0522d';
  if (y < 1900) return '#8b7355';
  if (y < 1970) return '#4a7c6f';
  if (y < 2000) return '#2d6a4f';
  return '#c9a94a';
}

export default function Home() {
  const { lang } = useLang();
  const T = t[lang].home;

  const [mode, setMode] = useState<'territories' | 'peoples' | 'data' | 'history'>('territories');
  const [selectedFeature, setSelectedFeature] = useState<any>(null);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [popup, setPopup] = useState<PopupState | null>(null);

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) return;
    const supabase = createClient(url, key);
    supabase
      .from('timeline_events')
      .select('id, date, title_pt, title_en, description_pt, description_en, source, url, population')
      .order('date', { ascending: true })
      .then(({ data }) => { if (data) setTimeline(data as TimelineEvent[]); });
  }, []);

  const handleDotEnter = useCallback((event: TimelineEvent, e: React.MouseEvent<HTMLDivElement>) => {
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    setPopup({ event, x: rect.left + rect.width / 2, y: rect.top });
  }, []);

  const handleDotLeave = useCallback(() => setPopup(null), []);

  const popupColor = popup ? eraColor(popup.event.date) : '#c9a94a';
  const popupYear  = popup ? new Date(popup.event.date).getFullYear() : 0;

  return (
    <div className="flex flex-col flex-1 min-h-0" style={{ height: 'calc(100vh - 62px - 38px)' }}>

      {/* Map area */}
      <div className="flex flex-1 min-h-0">
        <div className="flex flex-col flex-1 min-w-0">
          <ModeControls mode={mode} setMode={setMode} />
          <div className="relative flex-1 min-h-0">
            <div className="absolute inset-0">
              <MapComponent mode={mode} onSelectFeature={setSelectedFeature} />
            </div>
          </div>
        </div>
        <Sidebar feature={selectedFeature} onClose={() => setSelectedFeature(null)} />
      </div>

      {/* ── Timeline strip ── */}
      {timeline.length > 0 && (
        <div
          className="flex-shrink-0 border-t select-none"
          style={{ height: '90px', background: '#0d1f16', borderColor: 'rgba(201,169,74,0.15)' }}
        >
          <div className="relative h-full flex items-end overflow-x-auto" style={{ scrollbarWidth: 'none' }}>

            {/* Label */}
            <div
              className="sticky left-0 z-20 flex-shrink-0 flex items-center h-full px-4 pr-7"
              style={{ background: 'linear-gradient(to right, #0d1f16 70%, transparent)' }}
            >
              <div className="flex flex-col gap-0.5">
                <span className="text-[8px] uppercase tracking-[0.25em] font-bold" style={{ color: 'rgba(201,169,74,0.7)' }}>
                  {T.timelineLabel1}
                </span>
                <span className="text-[8px] uppercase tracking-[0.25em] font-bold" style={{ color: 'rgba(201,169,74,0.7)' }}>
                  {T.timelineLabel2}
                </span>
                {/* Small diamond decoration */}
                <span className="inline-block w-1.5 h-1.5 rotate-45 mt-1" style={{ background: 'rgba(201,169,74,0.4)' }} />
              </div>
            </div>

            {/* Spine + events */}
            <div className="relative flex items-end pb-3 px-4 gap-0 flex-shrink-0">
              {/* Spine line */}
              <div className="absolute bottom-[22px] left-0 right-0 h-px" style={{ background: 'rgba(255,255,255,0.1)' }} />

              {timeline.map((event, i) => {
                const evYear = new Date(event.date).getFullYear();
                const prevYear = i > 0 ? new Date(timeline[i - 1].date).getFullYear() : null;
                const showYear = evYear !== prevYear;
                const evColor = eraColor(event.date);
                const isHovered = popup?.event.id === event.id;

                return (
                  <div
                    key={event.id}
                    className="relative flex flex-col items-center flex-shrink-0 cursor-pointer"
                    style={{ width: '100px', marginLeft: i === 0 ? 0 : '-1px' }}
                    onMouseEnter={(e) => handleDotEnter(event, e)}
                    onMouseLeave={handleDotLeave}
                  >
                    {/* Population number above dot */}
                    {event.population != null ? (
                      <span
                        className="text-[10px] font-black leading-none mb-1.5 tracking-tight"
                        style={{
                          color: isHovered ? evColor : `${evColor}99`,
                          transition: 'color 0.15s ease',
                        }}
                      >
                        {formatPop(event.population)}
                      </span>
                    ) : (
                      <span style={{ height: '16px', display: 'block' }} />
                    )}

                    {/* Diamond dot on spine */}
                    <div
                      className="flex-shrink-0 mb-[14px]"
                      style={{
                        width:  isHovered ? '10px' : '7px',
                        height: isHovered ? '10px' : '7px',
                        background: isHovered ? evColor : 'rgba(255,255,255,0.25)',
                        transform: 'rotate(45deg)',
                        boxShadow: isHovered ? `0 0 8px ${evColor}` : 'none',
                        transition: 'all 0.15s ease',
                      }}
                    />

                    {/* Year label */}
                    {showYear ? (
                      <a
                        href={event.url || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[9px] font-mono whitespace-nowrap pb-0.5"
                        style={{
                          color: isHovered ? evColor : 'rgba(255,255,255,0.3)',
                          transition: 'color 0.15s ease',
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {evYear}
                      </a>
                    ) : (
                      <span className="pb-0.5" style={{ height: '13px', display: 'block' }} />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Donate button */}
            <div
              className="sticky right-0 z-20 flex-shrink-0 flex items-center h-full pl-10 pr-3"
              style={{ background: 'linear-gradient(to left, #0d1f16 60%, transparent)' }}
            >
              <a
                href="https://www.funai.gov.br/index.php/comunicacao/noticias/7879-apoio-as-populacoes-indigenas"
                target="_blank"
                rel="noopener noreferrer"
                title={T.donateTitle}
                className="flex flex-col items-center justify-center gap-0.5 px-3.5 py-2 rounded-xl
                           transition-all duration-200 hover:brightness-110 hover:scale-105 active:scale-95"
                style={{
                  background: 'linear-gradient(160deg, #d4a843 0%, #b8872a 60%, #9a6e1c 100%)',
                  boxShadow: '0 0 20px rgba(201,169,74,0.3), 0 2px 10px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.15)',
                  border: '1px solid rgba(201,169,74,0.35)',
                }}
              >
                <div className="flex items-center gap-[3px]">
                  <svg className="w-2 h-2" fill="#1a3a2a" opacity="0.45" viewBox="0 0 24 24">
                    <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"/>
                  </svg>
                  <svg className="w-4 h-4" fill="#1a3a2a" viewBox="0 0 24 24">
                    <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"/>
                  </svg>
                  <svg className="w-2 h-2" fill="#1a3a2a" opacity="0.45" viewBox="0 0 24 24">
                    <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"/>
                  </svg>
                </div>
                <span className="text-[11px] font-black leading-none tracking-wide" style={{ color: '#1a3a2a' }}>
                  {T.donateLabel}
                </span>
                <span className="text-[8px] font-semibold leading-none tracking-wider uppercase" style={{ color: 'rgba(26,58,42,0.6)' }}>
                  {T.donateSub}
                </span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ── Fixed popup ── */}
      {popup && (
        <div
          className="pointer-events-none"
          style={{ position: 'fixed', left: popup.x, top: popup.y - 12, transform: 'translate(-50%, -100%)', zIndex: 9999, width: '240px' }}
        >
          <div
            className="rounded-xl p-4 shadow-2xl text-white text-left"
            style={{
              background: 'linear-gradient(135deg, #1a3a2a 0%, #0d1f16 100%)',
              border: `1px solid ${popupColor}50`,
              boxShadow: `0 8px 32px rgba(0,0,0,0.65), 0 0 0 1px ${popupColor}18`,
            }}
          >
            {/* Year badge — parallelogram shape */}
            <span
              className="text-[10px] font-black tracking-widest px-2.5 py-0.5 mb-2 inline-block text-white"
              style={{ background: popupColor, clipPath: 'polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%)' }}
            >
              {popupYear}
            </span>
            <p className="text-[13px] font-semibold leading-snug mb-2 text-white">
              {clean(lang === 'en' ? (popup.event.title_en || popup.event.title_pt) : popup.event.title_pt)}
            </p>
            {popup.event.population != null && (
              <div className="my-2 py-2 border-t border-b" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                <p className="text-[9px] uppercase tracking-widest font-bold mb-0.5 flex items-center gap-1.5" style={{ color: `${popupColor}cc` }}>
                  <span className="inline-block w-1.5 h-1.5 rotate-45" style={{ background: `${popupColor}cc` }} />
                  {lang === 'pt' ? 'Pop. indígena' : 'Indigenous pop.'}
                </p>
                <p className="text-2xl font-black leading-none" style={{ color: popupColor }}>
                  {popup.event.population.toLocaleString(lang === 'pt' ? 'pt-BR' : 'en-US')}
                </p>
              </div>
            )}
            {(popup.event.description_pt || popup.event.description_en) && (
              <p className="text-[11px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.68)' }}>
                {clean(lang === 'en' ? (popup.event.description_en || popup.event.description_pt) : popup.event.description_pt)}
              </p>
            )}
            {popup.event.source && (
              <p className="text-[10px] mt-2 font-semibold" style={{ color: `${popupColor}bb` }}>
                {T.source} {popup.event.source}
              </p>
            )}
          </div>
          {/* Arrow */}
          <div className="mx-auto" style={{ width: 0, height: 0, borderLeft: '7px solid transparent', borderRight: '7px solid transparent', borderTop: `7px solid ${popupColor}50` }} />
        </div>
      )}
    </div>
  );
}
