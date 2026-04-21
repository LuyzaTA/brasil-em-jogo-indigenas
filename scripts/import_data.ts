#!/usr/bin/env ts-node
/*
 * import_data.ts
 *
 * A simple command‑line script to import GeoJSON features and indicator
 * values into the Supabase database. It reads a JSON file containing
 * territories or peoples and inserts each entry into the corresponding
 * table. The script assumes that the file has an array of objects with
 * fields matching the table columns defined in db/schema.sql. Values
 * absent from the file will be ignored (NULL).
 *
 * Usage:
 *   ts-node scripts/import_data.ts --file=path/to/territories.json --table=territories
 *   ts-node scripts/import_data.ts --file=path/to/peoples.json --table=peoples
 *
 * Environment variables:
 *   NEXT_PUBLIC_SUPABASE_URL – Supabase project URL
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY – Anon key with insert permissions
 */

import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

interface Options {
  file: string;
  table: string;
}

function parseArgs(): Options {
  const args = process.argv.slice(2);
  const opts: any = {};
  args.forEach((arg) => {
    const [key, value] = arg.split('=');
    if (key === '--file') opts.file = value;
    if (key === '--table') opts.table = value;
  });
  if (!opts.file || !opts.table) {
    console.error('Usage: ts-node import_data.ts --file=FILE --table=TABLE');
    process.exit(1);
  }
  return opts as Options;
}

async function main() {
  const { file, table } = parseArgs();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseKey) {
    console.error('Supabase environment variables are not set.');
    process.exit(1);
  }
  const supabase = createClient(supabaseUrl, supabaseKey);
  const filepath = path.resolve(file);
  const content = fs.readFileSync(filepath, 'utf8');
  const records = JSON.parse(content);
  if (!Array.isArray(records)) {
    console.error('JSON file must contain an array of records.');
    process.exit(1);
  }
  for (const record of records) {
    // Remove undefined values; Supabase will treat undefined as missing.
    Object.keys(record).forEach((k) => {
      if (record[k] === undefined) delete record[k];
    });
    const { error } = await supabase.from(table).insert(record);
    if (error) {
      console.error(`Failed to insert into ${table}:`, error.message);
    } else {
      console.log(`Inserted record into ${table}:`, record.id || '[no id]');
    }
  }
}

main().catch((err) => {
  console.error(err);
});