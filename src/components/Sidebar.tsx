"use client";
import { useLang } from '../contexts/LanguageContext';
import { t } from '../lib/i18n';

interface SidebarProps {
  feature: any | null;
  onClose: () => void;
}

export default function Sidebar({ feature, onClose }: SidebarProps) {
  const { lang } = useLang();
  const T = t[lang].sidebar;
  const locale = lang === 'pt' ? 'pt-BR' : 'en-US';

  if (!feature) {
    return (
      <aside className="w-72 flex-shrink-0 bg-white border-l border-gray-200 hidden md:flex flex-col">
        <div className="flex flex-col items-center justify-center h-full text-center px-6 gap-4">
          <div className="w-14 h-14 rounded-full bg-[#f0f7f4] flex items-center justify-center">
            <svg className="w-7 h-7 text-[#2d6a4f]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">{T.hint}</p>
        </div>
      </aside>
    );
  }

  const props = feature.properties || {};
  const TERRITORY_LAYERS = ['territories-fill', 'territories-choropleth', 'territories-status'];
  const isTerritory = TERRITORY_LAYERS.includes(feature.layer?.id);

  return (
    <aside className="w-72 flex-shrink-0 bg-white border-l border-gray-200 hidden md:flex flex-col overflow-y-auto">
      {/* Header */}
      <div className="bg-[#1a3a2a] px-4 pt-4 pb-5 relative flex-shrink-0">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white/50 hover:text-white transition-colors p-1 rounded"
          aria-label="Close"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Badge */}
        <span className="inline-block text-[10px] uppercase tracking-widest font-semibold px-2 py-0.5 rounded-full mb-2"
          style={{ background: isTerritory ? '#2d6a4f' : '#8b5e3c', color: 'white' }}>
          {isTerritory ? T.territory : T.village}
        </span>

        <h2 className="text-white font-semibold text-base leading-snug pr-6">
          {(lang === 'en' ? props.name_en : props.name_pt) || props.name || T.noName}
        </h2>
      </div>

      {/* Body */}
      <div className="flex-1 p-4 space-y-4 text-sm">
        {(lang === 'en' ? props.summary_en : props.summary_pt) && (
          <p className="text-gray-600 leading-relaxed">{lang === 'en' ? props.summary_en : props.summary_pt}</p>
        )}

        {/* Stats row */}
        {(props.population || props.area_ha) && (
          <div className="grid grid-cols-2 gap-3">
            {props.population && (
              <div className="bg-[#f0f7f4] rounded-lg p-3">
                <p className="text-[10px] uppercase tracking-wider text-[#2d6a4f] font-semibold mb-1">{T.population}</p>
                <p className="text-lg font-bold text-[#1a3a2a]">{props.population.toLocaleString(locale)}</p>
              </div>
            )}
            {props.area_ha && (
              <div className="bg-[#f0f7f4] rounded-lg p-3">
                <p className="text-[10px] uppercase tracking-wider text-[#2d6a4f] font-semibold mb-1">{T.area}</p>
                <p className="text-lg font-bold text-[#1a3a2a]">
                  {Number(props.area_ha).toLocaleString(locale, { maximumFractionDigits: 0 })}
                </p>
              </div>
            )}
          </div>
        )}

        {props.status && (
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#52b788] flex-shrink-0" />
            <span className="text-gray-500 text-xs">{props.status}</span>
          </div>
        )}

        {props.facts_pt && (
          <div className="border-t pt-3">
            <p className="text-[11px] uppercase tracking-wider font-semibold text-gray-400 mb-1.5">{T.facts}</p>
            <p className="text-gray-600 leading-relaxed">{props.facts_pt}</p>
          </div>
        )}


        <p className="text-[10px] text-gray-300 pt-2">{T.source}</p>
      </div>
    </aside>
  );
}
