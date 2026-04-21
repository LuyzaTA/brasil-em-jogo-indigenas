"use client";
import Link from 'next/link';
import { useLang } from '../../contexts/LanguageContext';
import { t } from '../../lib/i18n';
import type { Lang } from '../../lib/i18n';

interface Lesson {
  id: string;
  icon: string;
  principle: string;
  example: string;
  application: string;
  source: string;
  url: string;
  color: string;
}

const lessons: Record<Lang, Lesson[]> = {
  pt: [
    {
      id: 'territorio',
      icon: '◈',
      principle: 'Relação com o território e ecossistema',
      example: 'Muitos povos indígenas veem a terra como um ente vivo e sagrado, com o qual mantêm um vínculo de reciprocidade e cuidado intergeracional.',
      application: 'Adotar práticas de manejo sustentável e apoiar iniciativas de conservação lideradas por comunidades indígenas.',
      source: 'Funai',
      url: 'https://www.gov.br/funai/pt-br/assuntos/noticias/2023/35-anos-da-constituicao-federal-avanco-ao-reconhecimento-dos-direitos-dos-povos-indigenas-e-o-desafio-da-efetivacao-plena',
      color: '#2d6a4f',
    },
    {
      id: 'conhecimento',
      icon: '◇',
      principle: 'Conhecimento tradicional e ciência',
      example: 'O saber indígena sobre plantas medicinais, agroecologia e manejo de ecossistemas é transmitido oralmente e complementa a ciência acadêmica.',
      application: 'Valorizar a pesquisa participativa e apoiar a proteção do conhecimento tradicional por meio de políticas públicas.',
      source: 'IBGE',
      url: 'https://www.ibge.gov.br/estatisticas/sociais/populacao/17270-indigenas.html',
      color: '#52b788',
    },
    {
      id: 'governanca',
      icon: '⬡',
      principle: 'Governança comunitária',
      example: 'Estruturas de decisão coletivas e conselhos de anciãos asseguram a representação das diversas vozes dentro de um povo.',
      application: 'Incorporar processos deliberativos mais participativos em organizações públicas e privadas.',
      source: 'Funai',
      url: 'https://www.gov.br/funai/pt-br',
      color: '#c9a94a',
    },
    {
      id: 'memoria',
      icon: '◉',
      principle: 'Tempo, memória e oralidade',
      example: 'Histórias e conhecimentos são transmitidos oralmente de geração em geração, preservando a memória coletiva e conectando passado e futuro.',
      application: 'Valorizar a oralidade e registrar depoimentos de guardiões da memória. Apoiar museus e arquivos comunitários.',
      source: 'Iphan',
      url: 'https://www.gov.br/iphan',
      color: '#8b5e3c',
    },
    {
      id: 'sustentabilidade',
      icon: '◎',
      principle: 'Sustentabilidade prática',
      example: 'Práticas como a agricultura de coivara e o manejo de rios demonstram formas de usar recursos naturais sem esgotá-los.',
      application: 'Aprender com programas de manejo comunitário e apoiar projetos de desenvolvimento sustentável em terras indígenas.',
      source: 'Funai',
      url: 'https://www.gov.br/funai/pt-br',
      color: '#1a3a2a',
    },
  ],
  en: [
    {
      id: 'territorio',
      icon: '◈',
      principle: 'Relationship with territory and ecosystem',
      example: 'Many indigenous peoples view the land as a living, sacred entity with whom they maintain an intergenerational bond of reciprocity and care.',
      application: 'Adopt sustainable management practices and support indigenous community-led conservation initiatives.',
      source: 'Funai',
      url: 'https://www.gov.br/funai/pt-br/assuntos/noticias/2023/35-anos-da-constituicao-federal-avanco-ao-reconhecimento-dos-direitos-dos-povos-indigenas-e-o-desafio-da-efetivacao-plena',
      color: '#2d6a4f',
    },
    {
      id: 'conhecimento',
      icon: '◇',
      principle: 'Traditional knowledge and science',
      example: 'Indigenous knowledge of medicinal plants, agroecology and ecosystem management is passed down orally and complements academic science.',
      application: 'Value participatory research and support the protection of traditional knowledge through public policy.',
      source: 'IBGE',
      url: 'https://www.ibge.gov.br/estatisticas/sociais/populacao/17270-indigenas.html',
      color: '#52b788',
    },
    {
      id: 'governanca',
      icon: '⬡',
      principle: 'Community governance',
      example: 'Collective decision-making structures and councils of elders ensure that diverse voices within a people are represented.',
      application: 'Incorporate more participatory deliberative processes into public and private organizations.',
      source: 'Funai',
      url: 'https://www.gov.br/funai/pt-br',
      color: '#c9a94a',
    },
    {
      id: 'memoria',
      icon: '◉',
      principle: 'Time, memory and oral tradition',
      example: 'Stories and knowledge are passed down orally from generation to generation, preserving collective memory and connecting past and future.',
      application: 'Value oral tradition and record testimonies from memory keepers. Support community museums and archives.',
      source: 'Iphan',
      url: 'https://www.gov.br/iphan',
      color: '#8b5e3c',
    },
    {
      id: 'sustentabilidade',
      icon: '◎',
      principle: 'Practical sustainability',
      example: 'Practices such as swidden agriculture and river management demonstrate ways of using natural resources without depleting them.',
      application: 'Learn from community management programs and support sustainable development projects in indigenous lands.',
      source: 'Funai',
      url: 'https://www.gov.br/funai/pt-br',
      color: '#1a3a2a',
    },
  ],
};

export default function AprenderPage() {
  const { lang } = useLang();
  const T = t[lang].aprender;
  const currentLessons = lessons[lang];

  return (
    <div className="min-h-full" style={{ background: '#f4f0e8' }}>

      {/* ── Hero ── */}
      <div
        className="text-white px-6 py-12"
        style={{
          background: '#1a3a2a',
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cpolygon points='30,3 57,30 30,57 3,30' fill='none' stroke='rgba(201,169,74,.13)' stroke-width='1'/%3E%3Cpolygon points='30,15 45,30 30,45 15,30' fill='none' stroke='rgba(201,169,74,.07)' stroke-width='.7'/%3E%3C/svg%3E\")",
          backgroundSize: '60px 60px',
        }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-block w-2.5 h-2.5 rotate-45 flex-shrink-0" style={{ background: '#c9a94a' }} />
            <p className="text-[11px] uppercase tracking-[0.22em] font-bold" style={{ color: '#c9a94a' }}>
              {T.tag}
            </p>
          </div>
          <h1 className="text-4xl font-bold mb-3 tracking-tight text-white">{T.title}</h1>
          <p className="text-white/65 text-sm leading-relaxed max-w-2xl">{T.subtitle}</p>
          <div className="my-5" style={{ height: '1px', background: 'linear-gradient(90deg, #c9a94a 0%, rgba(201,169,74,0.1) 100%)', maxWidth: '240px' }} />
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-medium hover:text-white transition-colors" style={{ color: 'rgba(255,255,255,0.5)' }}>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            {T.back}
          </Link>
        </div>
      </div>

      {/* ── Cards ── */}
      <div className="max-w-4xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-6">
        {currentLessons.map((lesson) => (
          <div
            key={lesson.id}
            className="bg-white rounded-xl overflow-hidden hover:shadow-md transition-shadow"
            style={{ border: '1px solid rgba(0,0,0,.07)', borderLeft: `3px solid ${lesson.color}` }}
          >
            {/* Thin geometric top accent */}
            <div style={{ height: '3px', background: `linear-gradient(90deg, ${lesson.color} 0%, ${lesson.color}22 100%)` }} />

            <div className="p-6 space-y-4">
              {/* Icon glyph + principle */}
              <div className="flex items-start gap-3">
                <span
                  className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded text-lg font-bold"
                  style={{ background: `${lesson.color}14`, color: lesson.color }}
                >
                  {lesson.icon}
                </span>
                <h2 className="text-base font-bold leading-snug tracking-tight" style={{ color: '#1a3a2a' }}>
                  {lesson.principle}
                </h2>
              </div>

              {/* Example */}
              <div>
                <p className="text-[10px] uppercase tracking-widest font-bold mb-1.5 flex items-center gap-1.5"
                  style={{ color: lesson.color }}>
                  <span className="inline-block w-1.5 h-1.5 rotate-45 flex-shrink-0" style={{ background: lesson.color }} />
                  {T.example}
                </p>
                <p className="text-sm leading-relaxed" style={{ color: '#4a4a4a' }}>{lesson.example}</p>
              </div>

              {/* Application */}
              <div className="rounded-lg p-3" style={{ background: `${lesson.color}0d` }}>
                <p className="text-[10px] uppercase tracking-widest font-bold mb-1.5" style={{ color: lesson.color }}>
                  {T.apply}
                </p>
                <p className="text-sm leading-relaxed" style={{ color: '#3a3a3a' }}>{lesson.application}</p>
              </div>

              {/* Source */}
              <a
                href={lesson.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold hover:opacity-75 transition-opacity"
                style={{ color: lesson.color }}
              >
                <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
                {T.source} {lesson.source}
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
