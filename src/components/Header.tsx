"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLang } from '../contexts/LanguageContext';
import { t } from '../lib/i18n';

/*
  Cocar (feather headdress) — the sacred crown worn by indigenous peoples across Brazil.
  5 geometric feathers fan upward from a sun circle, representing:
  - The cocar: identity, leadership, spiritual connection
  - The sun circle: cosmological unity (Guarani/Tupi Ñamandu tradition)
  - Graduating opacity on outer feathers: the feathers radiate from the center like light
*/
function LogoMark() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
      {/* ── Feathers (cocar) ── */}
      {/* Far-left feather */}
      <polygon points="3,14 11,22 9,23"   fill="#c9a94a" opacity="0.42" />
      {/* Left feather */}
      <polygon points="9,5  15,21 12,22"  fill="#c9a94a" opacity="0.68" />
      {/* Center feather — tallest, full opacity */}
      <polygon points="18,1 21,21 15,21"  fill="#c9a94a" />
      {/* Right feather */}
      <polygon points="27,5  21,21 24,22" fill="#c9a94a" opacity="0.68" />
      {/* Far-right feather */}
      <polygon points="33,14 25,22 27,23" fill="#c9a94a" opacity="0.42" />

      {/* Headband — thin bar connecting feather bases */}
      <rect x="9" y="20.5" width="18" height="2" rx="1" fill="#c9a94a" opacity="0.55" />

      {/* ── Sun circle ── */}
      {/* Outer ring — gold */}
      <circle cx="18" cy="28" r="7.5" fill="#c9a94a" />
      {/* Inner ring — dark green */}
      <circle cx="18" cy="28" r="4.8" fill="#1a3a2a" />
      {/* Center dot — gold */}
      <circle cx="18" cy="28" r="2"   fill="#c9a94a" />
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
