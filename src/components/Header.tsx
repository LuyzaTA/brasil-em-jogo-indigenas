"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLang } from '../contexts/LanguageContext';
import { t } from '../lib/i18n';

/*
  Árvore-Cocar — the same geometric shape reads as both a forest tree and a cocar
  (indigenous feather headdress). Forest + indigenous in a single mark.

  - 5 triangular feathers = tree canopy = cocar plumes
  - Trunk = the axis mundi (world tree, central to Guarani/Tupi cosmology)
  - Roots = connection to the earth, the forest floor
  - Graduating feather opacity = light filtering through the canopy
*/
function LogoMark() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
      {/* ── Canopy / Cocar feathers ── */}
      <polygon points="2,15 10,22 8,23"   fill="#c9a94a" opacity="0.36" />
      <polygon points="8,5  14,21 11,22"  fill="#c9a94a" opacity="0.63" />
      <polygon points="18,1 21,21 15,21"  fill="#c9a94a" />
      <polygon points="28,5  22,21 25,22" fill="#c9a94a" opacity="0.63" />
      <polygon points="34,15 26,22 28,23" fill="#c9a94a" opacity="0.36" />

      {/* Junction — where canopy meets trunk (headband / tree collar) */}
      <rect x="9" y="21" width="18" height="2" rx="1" fill="#c9a94a" opacity="0.48" />

      {/* Trunk */}
      <rect x="16.5" y="23" width="3" height="7" rx="1.5" fill="#c9a94a" opacity="0.82" />

      {/* Roots */}
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
