-- Database schema for the “Brasil em Jogo — Povos Indígenas” platform.
-- Each table holds metadata for the interactive map, timeline, and learning
-- sections. All fields that store user‑visible text are bilingual
-- (Portuguese and English) where appropriate. Foreign keys reference
-- corresponding entries to maintain referential integrity.

-- Datasets table records the official sources used in the platform.
CREATE TABLE IF NOT EXISTS datasets (
  id SERIAL PRIMARY KEY,
  -- Name of the dataset (e.g. "Censo 2022 – População Indígena").
  name TEXT NOT NULL,
  -- Official organisation responsible for the dataset (e.g. IBGE, Funai).
  organisation TEXT NOT NULL,
  -- URL to the official data portal or page.
  url TEXT NOT NULL,
  -- Date of the last update or release as provided by the source.
  date_updated DATE,
  -- Licence or terms of use (e.g. CC‑BY or public domain).
  license TEXT,
  -- Short description of the dataset in Portuguese and English.
  description_pt TEXT,
  description_en TEXT
);

-- Territories table stores information about Indigenous Territories.
CREATE TABLE IF NOT EXISTS territories (
  id TEXT PRIMARY KEY,
  -- Foreign key to the dataset from which this territory originates.
  dataset_id INTEGER REFERENCES datasets(id) ON DELETE SET NULL,
  -- Official name in Portuguese and English.
  name_pt TEXT NOT NULL,
  name_en TEXT,
  -- Summary description with official facts.
  summary_pt TEXT,
  summary_en TEXT,
  -- Interesting facts or contextual notes.
  facts_pt TEXT,
  facts_en TEXT,
  -- Official Indigenous population associated with this territory, if available.
  population INTEGER,
  -- Total area in hectares, when provided by the data source.
  area_ha NUMERIC,
  -- Current status (e.g. demarcated, homologated) when available.
  status TEXT,
  -- ISO codes for the state/municipality containing the territory.
  uf_code CHAR(2),
  municipality_code CHAR(7),
  -- Geometry stored as GeoJSON string for simplified mapping.
  geometry JSONB
);

-- Peoples table stores data on Indigenous peoples.
CREATE TABLE IF NOT EXISTS peoples (
  id TEXT PRIMARY KEY,
  dataset_id INTEGER REFERENCES datasets(id) ON DELETE SET NULL,
  name_pt TEXT NOT NULL,
  name_en TEXT,
  summary_pt TEXT,
  summary_en TEXT,
  facts_pt TEXT,
  facts_en TEXT,
  -- Estimated population from official sources, if available.
  population INTEGER,
  -- Languages spoken by this people (comma‑separated codes or names).
  languages TEXT,
  -- Distribution notes (e.g. states where present).
  distribution_pt TEXT,
  distribution_en TEXT,
  -- Geometry: point location(s) or small polygons representing presence.
  geometry JSONB
);

-- Indicators table defines quantitative metrics that can be visualised
-- on the map (e.g. Indigenous population per state).
CREATE TABLE IF NOT EXISTS indicators (
  id SERIAL PRIMARY KEY,
  -- Machine‑readable key used by the frontend.
  key TEXT NOT NULL UNIQUE,
  -- Human‑readable name in Portuguese and English.
  name_pt TEXT NOT NULL,
  name_en TEXT NOT NULL,
  -- Description of what the indicator measures.
  description_pt TEXT,
  description_en TEXT,
  -- Unit of measurement (e.g. people, percentage, hectares).
  unit TEXT,
  -- Link to the dataset providing the indicator values.
  dataset_id INTEGER REFERENCES datasets(id) ON DELETE SET NULL
);

-- Indicator values table associates an indicator with a geographic unit
-- (state or municipality) and stores the numeric value. This allows
-- choropleth layers to be generated dynamically.
CREATE TABLE IF NOT EXISTS indicator_values (
  id SERIAL PRIMARY KEY,
  indicator_id INTEGER REFERENCES indicators(id) ON DELETE CASCADE,
  -- Geographic codes aligned with IBGE standards.
  uf_code CHAR(2),
  municipality_code CHAR(7),
  -- Numeric value of the indicator for the given geography.
  value NUMERIC NOT NULL
);

-- Timeline events table stores historical milestones impacting
-- Indigenous peoples.
CREATE TABLE IF NOT EXISTS timeline_events (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL,
  title_pt TEXT NOT NULL,
  title_en TEXT NOT NULL,
  description_pt TEXT,
  description_en TEXT,
  source TEXT,
  url TEXT
);

-- Translations table holds generic user interface strings for i18n.
-- Each key can be translated into multiple locales.
CREATE TABLE IF NOT EXISTS translations (
  key TEXT NOT NULL,
  locale CHAR(2) NOT NULL,
  text TEXT NOT NULL,
  PRIMARY KEY (key, locale)
);