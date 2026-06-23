/* ================================================================
   BON CAFÉ & SWEETS — SUPABASE CLIENT CONFIGURATION
   ─────────────────────────────────────────────────────────────────
   SETUP INSTRUCTIONS:
   1. Go to https://app.supabase.com → Your Project → Settings → API
   2. Copy your "Project URL" and "Publishable (sb_publishable_...)" key
   3. Paste the publishable key below — it is safe to use in browsers
   ================================================================ */

'use strict';

(function initSupabase() {
  const SUPABASE_URL      = 'https://toqyxaxfgymzsyrdavvf.supabase.co';
  const SUPABASE_ANON_KEY = 'sb_publishable_6HY3DATc3QSoKbpODyFMOw_VI0wqvxh';

  // Guard: skip if our client is already set (not the SDK library)
  if (window._supabase) return;

  // Detect the CDN library — it exposes itself as window.supabase
  const sdk = (typeof window.supabase !== 'undefined' && typeof window.supabase.createClient === 'function')
    ? window.supabase
    : null;

  if (!sdk) {
    console.warn('[Supabase] SDK not loaded. Make sure the CDN script is included before supabase-config.js');
    return;
  }

  const client = sdk.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  window._supabase = client;

  console.log('[Supabase] \u2705 Client initialized. BON CAFÉ database ready.');
})();
