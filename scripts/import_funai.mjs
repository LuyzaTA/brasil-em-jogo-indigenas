/**
 * import_funai.mjs
 *
 * Fetches official data from FUNAI's public GeoServer WFS and upserts it
 * into the Supabase database.
 *
 * Sources:
 *   - Territories (polygons): Funai:tis_poligonais
 *   - Villages / peoples (points): Funai:aldeias_pontos
 *
 * Run from the project root:
 *   node scripts/import_funai.mjs
 *
 * Credentials are read from .env.local automatically.
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
// WFS helpers
// ---------------------------------------------------------------------------
const WFS_BASE = 'https://geoserver.funai.gov.br/geoserver/Funai/ows';
const PAGE_SIZE = 100;

async function fetchWfsPage(typeName, startIndex) {
  const params = new URLSearchParams({
    service: 'WFS',
    version: '2.0.0',
    request: 'GetFeature',
    typeName,
    startIndex: String(startIndex),
    count: String(PAGE_SIZE),
    outputFormat: 'application/json',
    srsName: 'EPSG:4326',
  });
  const res = await fetch(`${WFS_BASE}?${params}`);
  if (!res.ok) throw new Error(`WFS error: ${res.status} ${res.statusText}`);
  return res.json();
}

async function fetchAllFeatures(typeName) {
  const features = [];
  let startIndex = 0;
  let total = null;

  while (true) {
    process.stdout.write(`  Fetching ${typeName} [${startIndex}–${startIndex + PAGE_SIZE}]...\r`);
    const page = await fetchWfsPage(typeName, startIndex);

    if (total === null) {
      total = page.numberMatched ?? page.totalFeatures ?? page.features?.length ?? 0;
    }

    const batch = page.features ?? [];
    if (batch.length === 0) break;
    features.push(...batch);
    startIndex += batch.length;
    if (startIndex >= total) break;
  }
  console.log(`  Fetched ${features.length} features from ${typeName}          `);
  return features;
}

// ---------------------------------------------------------------------------
// Import territories (polygons)
// ---------------------------------------------------------------------------
async function importTerritories() {
  console.log('\n[1/2] Importing territories from Funai:tis_poligonais...');
  const features = await fetchAllFeatures('Funai:tis_poligonais');

  const records = features.map((f) => {
    const p = f.properties;
    return {
      id: `ti-${p.terrai_codigo}`,
      name_pt: p.terrai_nome ?? 'Sem nome',
      name_en: p.terrai_nome ?? 'No name',
      summary_pt: [
        `Terra Indígena ${p.terrai_nome}.`,
        p.etnia_nome ? `Etnia: ${p.etnia_nome}.` : null,
        p.municipio_nome ? `Município: ${p.municipio_nome} – ${p.uf_sigla}.` : null,
        p.fase_ti ? `Situação: ${p.fase_ti}.` : null,
        p.modalidade_ti ? `Modalidade: ${p.modalidade_ti}.` : null,
      ].filter(Boolean).join(' '),
      summary_en: [
        `Indigenous Land ${p.terrai_nome}.`,
        p.etnia_nome ? `Ethnic group: ${p.etnia_nome}.` : null,
        p.municipio_nome ? `Municipality: ${p.municipio_nome} – ${p.uf_sigla}.` : null,
        p.fase_ti ? `Status: ${p.fase_ti}.` : null,
      ].filter(Boolean).join(' '),
      area_ha: p.superficie_perimetro_ha ?? null,
      status: p.fase_ti ?? null,
      uf_code: p.uf_sigla ? p.uf_sigla.substring(0, 2) : null,
      geometry: f.geometry ?? null,
    };
  });

  // Upsert in batches of 50 to stay within Supabase request limits.
  let inserted = 0;
  for (let i = 0; i < records.length; i += 50) {
    const batch = records.slice(i, i + 50);
    const { error } = await supabase.from('territories').upsert(batch);
    if (error) {
      console.error(`  Error at batch ${i}:`, error.message);
    } else {
      inserted += batch.length;
      process.stdout.write(`  Upserted ${inserted}/${records.length}\r`);
    }
  }
  console.log(`  Done — ${inserted} territories upserted.          `);
}

// ---------------------------------------------------------------------------
// Import villages / peoples (points)
// ---------------------------------------------------------------------------
async function importPeoples() {
  console.log('\n[2/2] Importing villages from Funai:aldeias_pontos...');
  const features = await fetchAllFeatures('Funai:aldeias_pontos');

  const records = features.map((f) => {
    const p = f.properties;
    return {
      id: `aldeia-${p.cod_aldeia}`,
      name_pt: p.nome_aldeia ?? 'Sem nome',
      name_en: p.nome_aldeia ?? 'No name',
      summary_pt: [
        `Aldeia ${p.nome_aldeia}.`,
        p.nommunic ? `Município: ${p.nommunic} – ${p.nomuf}.` : null,
        p.nome_cr ? `Coordenação Regional: ${p.nome_cr}.` : null,
      ].filter(Boolean).join(' '),
      summary_en: [
        `Village ${p.nome_aldeia}.`,
        p.nommunic ? `Municipality: ${p.nommunic} – ${p.nomuf}.` : null,
      ].filter(Boolean).join(' '),
      distribution_pt: p.nomuf ?? null,
      distribution_en: p.nomuf ?? null,
      geometry: f.geometry ?? null,
    };
  });

  let inserted = 0;
  for (let i = 0; i < records.length; i += 50) {
    const batch = records.slice(i, i + 50);
    const { error } = await supabase.from('peoples').upsert(batch);
    if (error) {
      console.error(`  Error at batch ${i}:`, error.message);
    } else {
      inserted += batch.length;
      process.stdout.write(`  Upserted ${inserted}/${records.length}\r`);
    }
  }
  console.log(`  Done — ${inserted} villages upserted.          `);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  console.log('=== FUNAI Data Import ===');
  console.log(`Supabase: ${SUPABASE_URL}`);

  await importTerritories();
  await importPeoples();

  console.log('\n=== Import complete ===');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
