import { createClient } from '@supabase/supabase-js';

/**
 * A thin wrapper around the Supabase client. The URL and anon key must be
 * provided via environment variables (NEXT_PUBLIC_SUPABASE_URL and
 * NEXT_PUBLIC_SUPABASE_ANON_KEY). If these values are not set, the client
 * will be undefined and pages should handle the absence of Supabase
 * gracefully (e.g. by showing placeholder data).
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase =
  supabaseUrl && supabaseKey
    ? createClient(supabaseUrl, supabaseKey)
    : null;