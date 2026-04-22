"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useLang } from '../contexts/LanguageContext';
import { t } from '../lib/i18n';

function LogoMark() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
      <polygon points="2,15 10,22 8,23"   fill="#c9a94a" opacity="0.36" />
      <polygon points="8,5  14,21 11,22"  fill="#c9a94a" opacity="0.63" />
      <polygon points="18,1 21,21 15,21"  fill="#c9a94a" />
      <polygon points="28,5  22,21 25,22" fill="#c9a94a" opacity="0.63" />
      <polygon points="34,15 26,22 28,23" fill="#c9a94a" opacity="0.36" />
      <rect x="9" y="21" width="18" height="2" rx="1" fill="#c9a94a" opacity="0.48" />
      <rect x="16.5" y="23" width="3" height="7" rx="1.5" fill="#c9a94a" opacity="0.82" />
      <path d="M18,30 Q13,31 11,34"  stroke="#c9a94a" strokeWidth="1.4" strokeLinecap="round" opacity="0.42" />
      <path d="M18,30 L18,34"        stroke="#c9a94a" strokeWidth="1.4" strokeLinecap="round" opacity="0.55" />
      <path d="M18,30 Q23,31 25,34"  stroke="#c9a94a" strokeWidth="1.4" strokeLinecap="round" opacity="0.42" />
    </svg>
  );
}

export default function Header() {
  const { lang, setLang } = useLang();
  const T = t[lang].nav;
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLink = (href: string, label: string, onClick?: () => void) => {
    const active = pathname === href;
    return (
      <Link
        href={href}
        onClick={onClick}
        className="relative px-3 py-2 text-sm font-medium transition-colors rounded-md"
        style={{ color: active ? '#c9a94a' : 'rgba(255,255,255,0.72)' }}
      >
        {label}
        {active && (
          <span className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full" style={{ background: '#c9a94a' }} />
        )}
      </Link>
    );
  };

  return (
    <header className="flex-shrink-0 z-50" style={{ background: '#1a3a2a' }}>
      <div className="max-w-screen-2xl mx-auto px-4 flex items-center justify-between" style={{ height: '60px' }}>

        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
          <LogoMark />
          <div className="leading-tight">
            <p className="text-sm font-bold tracking-[0.06em] text-white group-hover:text-[#c9a94a] transition-colors uppercase">
              Brasil em Jogo
            </p>
            <p className="text-[10px] font-medium tracking-[0.18em] uppercase hidden sm:block" style={{ color: 'rgba(201,169,74,0.7)' }}>
              {T.subtitle}
            </p>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-0.5 text-sm">
          {navLink('/', T.map)}
          {navLink('/historia', T.history)}
          {navLink('/aprender', T.learn)}
          <span className="mx-2 flex items-center opacity-20" aria-hidden="true">
            <span className="inline-block w-1 h-1 rotate-45 bg-[#c9a94a]" />
          </span>
          <button onClick={() => setLang('pt')} className="px-2 py-1 text-xs rounded font-semibold tracking-wider transition-colors"
            style={{ color: lang === 'pt' ? '#c9a94a' : 'rgba(255,255,255,0.35)', background: lang === 'pt' ? 'rgba(201,169,74,0.12)' : 'transparent' }}>
            PT
          </button>
          <button onClick={() => setLang('en')} className="px-2 py-1 text-xs rounded font-semibold tracking-wider transition-colors"
            style={{ color: lang === 'en' ? '#c9a94a' : 'rgba(255,255,255,0.35)', background: lang === 'en' ? 'rgba(201,169,74,0.12)' : 'transparent' }}>
            EN
          </button>
        </nav>

        {/* Mobile: lang + hamburger */}
        <div className="flex md:hidden items-center gap-2">
          <button onClick={() => setLang('pt')} className="px-2 py-1 text-xs rounded font-semibold"
            style={{ color: lang === 'pt' ? '#c9a94a' : 'rgba(255,255,255,0.4)', background: lang === 'pt' ? 'rgba(201,169,74,0.12)' : 'transparent' }}>
            PT
          </button>
          <button onClick={() => setLang('en')} className="px-2 py-1 text-xs rounded font-semibold"
            style={{ color: lang === 'en' ? '#c9a94a' : 'rgba(255,255,255,0.4)', background: lang === 'en' ? 'rgba(201,169,74,0.12)' : 'transparent' }}>
            EN
          </button>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-md text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Menu"
          >
            {menuOpen ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="md:hidden border-t px-4 py-3 flex flex-col gap-1" style={{ background: '#0f2318', borderColor: 'rgba(201,169,74,0.15)' }}>
          {navLink('/', T.map, () => setMenuOpen(false))}
          {navLink('/historia', T.history, () => setMenuOpen(false))}
          {navLink('/aprender', T.learn, () => setMenuOpen(false))}
        </div>
      )}

      {/* Gold accent line */}
      <div style={{ height: '2px', background: 'linear-gradient(90deg, transparent 0%, #c9a94a 30%, #c9a94a 70%, transparent 100%)', opacity: 0.5 }} />
    </header>
  );
}
