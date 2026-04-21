"use client";
import { useLang } from '../contexts/LanguageContext';
import { t } from '../lib/i18n';

type Mode = 'territories' | 'peoples' | 'data' | 'history';

interface ModeControlsProps {
  mode: Mode;
  setMode: (mode: Mode) => void;
}

/* Geometric glyphs referencing indigenous motifs: hexagon = territory, diamond = peoples */
const modeIcons: Record<Mode, string> = {
  territories: '⬡',
  peoples:     '◈',
  data:        '◈',
  history:     '◷',
};

const modeOrder: Mode[] = ['territories', 'peoples'];

export default function ModeControls({ mode, setMode }: ModeControlsProps) {
  const { lang } = useLang();
  const T = t[lang].modes;

  return (
    <div
      className="flex-shrink-0 flex items-center gap-1 px-4 py-2 border-b"
      style={{ background: '#faf7f2', borderColor: 'rgba(0,0,0,0.08)' }}
    >
      {/* Geometric label */}
      <div className="flex items-center gap-1.5 mr-3 hidden sm:flex">
        <span className="inline-block w-1.5 h-1.5 rotate-45" style={{ background: '#c9a94a', opacity: 0.6 }} />
        <span className="text-[10px] uppercase tracking-[0.18em] font-bold" style={{ color: '#9a9a8a' }}>
          {T.view}
        </span>
      </div>

      {modeOrder.map((id) => {
        const label = T[id].label;
        const desc  = T[id].desc;
        const active = mode === id;
        return (
          <button
            key={id}
            onClick={() => setMode(id)}
            title={desc}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold transition-all rounded"
            style={{
              background:  active ? '#1a3a2a' : 'transparent',
              color:       active ? 'white'   : '#5a5a4a',
              letterSpacing: '0.01em',
            }}
          >
            <span style={{ color: active ? '#c9a94a' : '#b0a888', fontSize: '13px', lineHeight: 1 }}>
              {modeIcons[id]}
            </span>
            {label}
          </button>
        );
      })}
    </div>
  );
}
