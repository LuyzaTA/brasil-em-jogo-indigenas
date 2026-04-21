"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLang } from '../contexts/LanguageContext';
import { t } from '../lib/i18n';

/* Geometric diamond logo mark — inspired by indigenous nested-diamond ceramic patterns */
function LogoMark() {
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" fill="none" aria-hidden="true">
      {/* Outer diamond — gold */}
      <polygon points="17,1 33,17 17,33 1,17" fill="#c9a94a" />
      {/* Upper-left & lower-right triangles — dark green (creates hourglass inlay) */}
      <polygon points="17,1 1,17 17,17"  fill="#1a3a2a" />
      <polygon points="17,17 33,17 17,33" fill="#1a3a2a" />
      {/* Inner diamond — gold */}
      <polygon points="17,9 25,17 17,25 9,17" fill="#c9a94a" />
      {/* Center — dark green */}
      <circle cx="17" cy="17" r="3" fill="#1a3a2a" />
      {/* Center dot — gold */}
      <circle cx="17" cy="17" r="1.2" fill="#c9a94a" />
    </svg>
  );
}

export default function Header() {
  const { lang, setLang } = useLang();
  const T = t[lang].nav;
  const pathname = usePathname();

  const navLink = (href: string, label: string) => {
    const active = pathname === href;
    return (
      <Link
        href={href}
        className="relative px-3 py-1.5 text-sm transition-colors"
        style={{ color: active ? '#c9a94a' : 'rgba(255,255,255,0.72)' }}
      >
        {label}
        {active && (
          <span
            className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full"
            style={{ background: '#c9a94a' }}
          />
        )}
      </Link>
    );
  };

  return (
    <header className="flex-shrink-0 z-50" style={{ background: '#1a3a2a' }}>
      {/* Main bar */}
      <div className="max-w-screen-2xl mx-auto px-4 h-15 flex items-center justify-between" style={{ height: '60px' }}>

        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <LogoMark />
          <div className="leading-tight">
            <p className="text-sm font-bold tracking-[0.06em] text-white group-hover:text-[#c9a94a] transition-colors uppercase">
              Brasil em Jogo
            </p>
            <p className="text-[10px] font-medium tracking-[0.18em] uppercase" style={{ color: 'rgba(201,169,74,0.7)' }}>
              {T.subtitle}
            </p>
          </div>
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-0.5 text-sm">
          {navLink('/', T.map)}
          {navLink('/historia', T.history)}
          {navLink('/aprender', T.learn)}

          {/* Geometric divider */}
          <span className="mx-2 flex items-center gap-1 opacity-20" aria-hidden="true">
            <span className="inline-block w-1 h-1 rotate-45 bg-[#c9a94a]" />
          </span>

          <button
            onClick={() => setLang('pt')}
            className="px-2 py-1 text-xs rounded font-semibold tracking-wider transition-colors"
            style={{
              color: lang === 'pt' ? '#c9a94a' : 'rgba(255,255,255,0.35)',
              background: lang === 'pt' ? 'rgba(201,169,74,0.12)' : 'transparent',
            }}
          >
            PT
          </button>
          <button
            onClick={() => setLang('en')}
            className="px-2 py-1 text-xs rounded font-semibold tracking-wider transition-colors"
            style={{
              color: lang === 'en' ? '#c9a94a' : 'rgba(255,255,255,0.35)',
              background: lang === 'en' ? 'rgba(201,169,74,0.12)' : 'transparent',
            }}
          >
            EN
          </button>
        </nav>
      </div>

      {/* Gold geometric accent line at the bottom */}
      <div style={{ height: '2px', background: 'linear-gradient(90deg, transparent 0%, #c9a94a 30%, #c9a94a 70%, transparent 100%)', opacity: 0.5 }} />
    </header>
  );
}
