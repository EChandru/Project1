import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mewpxophgpkjsesgwlwg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ld3B4b3BoZ3BranNlc2d3bHdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgxMDE2NjcsImV4cCI6MjA3MzY3NzY2N30.HZ1JOZPH5hL1cv__wiYbxlGrf3iDN8HiDxfAbeVeX7s';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);