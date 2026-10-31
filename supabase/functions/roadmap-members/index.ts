import { createClient } from 'npm:@supabase/supabase-js@2.112.4';
import { createHandler } from './handler.mjs';
const url = Deno.env.get('SUPABASE_URL')!;
const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const publicKey = Deno.env.get('SUPABASE_ANON_KEY')!;
const service = createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}});
// verify_jwt=false: this function verifies email JWTs, roadmap sessions and admin roles itself.
Deno.serve(createHandler({service,url,publicKey,rateSecret:key}));
