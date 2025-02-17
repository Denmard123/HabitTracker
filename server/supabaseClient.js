import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://kxmnvtgnwuhdkrzzpwxi.supabase.co'; 
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4bW52dGdud3VoZGtyenpwd3hpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk2OTA3OTgsImV4cCI6MjA1NTI2Njc5OH0.l0DeaGtDKbr-EhNX5DpEUDSNtF1Y3L_Rdqn2bUC7JcA';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

module.exports = supabase;