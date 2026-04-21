"use client";
import { useLang } from '../contexts/LanguageContext';
import { t } from '../lib/i18n';

export default function Footer() {
  const { lang } = useLang();

  const quote = lang === 'pt'
    ? { text: '"A terra não nos pertence. Nós pertencemos à terra."', attr: '— Sabedoria indígena' }
    : { text: '"The earth does not belong to us. We belong to the earth."', attr: '— Indigenous wisdom' };

  return (
    <footer style={{ background: '#1a3a2a', flexShrink: 0 }}>
      {/* Chevron geometric top border */}
      <div
        style={{
          height: '10px',
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='10'%3E%3Cpolyline points='0,10 12,1 24,10' fill='none' stroke='rgba(201,169,74,.35)' stroke-width='1.2' stroke-linejoin='round'/%3E%3C/svg%3E\")",
          backgroundRepeat: 'repeat-x',
          backgroundSize: '24px 10px',
        }}
      />

      <div className="max-w-screen-2xl mx-auto px-6 py-3 flex items-center justify-between gap-4 flex-wrap">
        {/* Quote */}
        <p className="text-[11px] italic" style={{ color: 'rgba(201,169,74,0.6)', flex: '1 1 auto' }}>
          {quote.text}{' '}
          <span style={{ color: 'rgba(201,169,74,0.35)', fontStyle: 'normal' }}>{quote.attr}</span>
        </p>

        {/* Attribution */}
        <p className="text-[10px] tracking-wider text-right" style={{ color: 'rgba(255,255,255,0.28)', whiteSpace: 'nowrap' }}>
          {t[lang].footer}
        </p>
      </div>
    </footer>
  );
}
