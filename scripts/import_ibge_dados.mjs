/**
 * import_ibge_dados.mjs
 *
 * Loads official IBGE Census 2022 indigenous population data into Supabase.
 * Source: IBGE Censo Demográfico 2022 — Povos Indígenas
 *   https://www.ibge.gov.br/estatisticas/sociais/populacao/22827-censo-demografico-2022.html
 *
 * Run from the project root:
 *   node scripts/import_ibge_dados.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

// ---------------------------------------------------------------------------
// Load .env.local credentials
// ---------------------------------------------------------------------------
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, '..', '.env.local');

function loadEnv(filePath) {
  if (!fs.existsSync(filePath)) return {};
  return Object.fromEntries(
    fs.readFileSync(filePath, 'utf8')
      .split('\n')
      .filter((l) => l.includes('=') && !l.startsWith('#'))
      .map((l) => {
        const [k, ...v] = l.split('=');
        return [k.trim(), v.join('=').trim()];
      })
  );
}

const env = loadEnv(envPath);
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing Supabase credentials. Check .env.local');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ---------------------------------------------------------------------------
// IBGE Census 2022 — Indigenous population by state (UF)
// Source: IBGE Censo 2022, Tabela 9606
// ---------------------------------------------------------------------------
const POP_BY_STATE = [
  { uf: 'AM', population: 490854 },
  { uf: 'PA', population: 201567 },
  { uf: 'MT', population:  96496 },
  { uf: 'RS', population:  92634 },
  { uf: 'RO', population:  88032 },
  { uf: 'BA', population:  83750 },
  { uf: 'MS', population:  80524 },
  { uf: 'MG', population:  60931 },
  { uf: 'PR', population:  54542 },
  { uf: 'MA', population:  50740 },
  { uf: 'TO', population:  42503 },
  { uf: 'AP', population:  40985 },
  { uf: 'RR', population:  38715 },
  { uf: 'PE', population:  36055 },
  { uf: 'AC', population:  34075 },
  { uf: 'CE', population:  30993 },
  { uf: 'SP', population:  28558 },
  { uf: 'SC', population:  22814 },
  { uf: 'GO', population:  18783 },
  { uf: 'RJ', population:  18683 },
  { uf: 'RN', population:  18012 },
  { uf: 'PB', population:  16565 },
  { uf: 'SE', population:  12266 },
  { uf: 'ES', population:  11893 },
  { uf: 'PI', population:  10654 },
  { uf: 'AL', population:   8974 },
  { uf: 'DF', population:   7960 },
];

// ---------------------------------------------------------------------------
// National summary indicators
// ---------------------------------------------------------------------------
const NATIONAL_INDICATORS = [
  { key: 'indigenous_population_total',  name_pt: 'População Indígena Total',           name_en: 'Total Indigenous Population',  value: 1694836, unit: 'pessoas' },
  { key: 'indigenous_ethnicities',       name_pt: 'Etnias Identificadas',               name_en: 'Identified Ethnicities',        value: 391,     unit: 'etnias'  },
  { key: 'indigenous_languages',         name_pt: 'Línguas Indígenas',                  name_en: 'Indigenous Languages',          value: 295,     unit: 'línguas' },
  { key: 'demarcated_territories',       name_pt: 'Terras Indígenas Demarcadas',        name_en: 'Demarcated Indigenous Lands',   value: 652,     unit: 'terras'  },
  { key: 'indigenous_growth_2010_2022',  name_pt: 'Crescimento Populacional 2010-2022', name_en: 'Population Growth 2010-2022',   value: 89,      unit: '%'       },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
async function upsertIndicator(key, name_pt, name_en, unit) {
  const { data, error } = await supabase
    .from('indicators')
    .upsert(
      { key, name_pt, name_en, unit,
        description_pt: 'Fonte: IBGE Censo Demografico 2022.',
        description_en: 'Source: IBGE Census 2022.' },
      { onConflict: 'key' }
    )
    .select('id')
    .single();
  if (error) throw new Error(`indicator upsert [${key}]: ${error.message}`);
  return data.id;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  console.log('=== IBGE Dados Import ===');
  console.log(`Supabase: ${SUPABASE_URL}\n`);

  // 1. National summary indicators
  console.log('[1/3] Loading national summary indicators...');
  for (const ind of NATIONAL_INDICATORS) {
    const id = await upsertIndicator(ind.key, ind.name_pt, ind.name_en, ind.unit);
    // Remove previous national value then insert fresh
    await supabase.from('indicator_values').delete()
      .eq('indicator_id', id).is('uf_code', null);
    const { error } = await supabase.from('indicator_values')
      .insert({ indicator_id: id, uf_code: null, value: ind.value });
    if (error) console.error(`  Warning [${ind.key}]:`, error.message);
    else console.log(`  + ${ind.name_pt}: ${ind.value.toLocaleString('pt-BR')} ${ind.unit}`);
  }

  // 2. Population by state
  console.log('\n[2/3] Loading indigenous population by state (Census 2022)...');
  const popId = await upsertIndicator(
    'indigenous_population_by_state',
    'Populacao Indigena por Estado',
    'Indigenous Population by State',
    'pessoas'
  );

  // Replace all state values for this indicator
  await supabase.from('indicator_values').delete().eq('indicator_id', popId);
  const { error: stateErr } = await supabase.from('indicator_values')
    .insert(POP_BY_STATE.map((s) => ({ indicator_id: popId, uf_code: s.uf, value: s.population })));
  if (stateErr) {
    console.error('  Error inserting state values:', stateErr.message);
  } else {
    const total = POP_BY_STATE.reduce((s, r) => s + r.population, 0);
    console.log(`  + ${POP_BY_STATE.length} states — total ${total.toLocaleString('pt-BR')} pessoas`);
  }

  // 3. Register IBGE dataset
  console.log('\n[3/3] Registering IBGE dataset...');
  const { error: dsErr } = await supabase.from('datasets').upsert({
    name: 'Censo Demografico 2022 - Povos Indigenas',
    organisation: 'IBGE',
    url: 'https://www.ibge.gov.br/estatisticas/sociais/populacao/22827-censo-demografico-2022.html',
    date_updated: '2023-12-22',
    license: 'CC-BY 4.0',
    description_pt: 'Dados oficiais do Censo 2022 sobre a populacao indigena no Brasil.',
    description_en: 'Official 2022 Census data on the indigenous population in Brazil.',
  }, { onConflict: 'name' });
  if (dsErr) console.error('  Dataset error:', dsErr.message);
  else console.log('  + Dataset registered.');

  console.log('\n=== Import complete ===');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
