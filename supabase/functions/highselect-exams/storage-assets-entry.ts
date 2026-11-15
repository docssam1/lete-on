import {createClient} from 'npm:@supabase/supabase-js@2.95.3';
import bank from './bank-private.json' with {type:'json'};
import {createAssetHandler} from './storage-assets-core.mjs';
let named: Record<string,string> = {};
try { named = JSON.parse(Deno.env.get('SUPABASE_SECRET_KEYS') || '{}'); } catch {}
const secret = named['default'] || Deno.env.get('SUPABASE_SECRET_KEY') || Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
if (!secret) throw Error('server_credentials_unavailable');
const db = createClient(Deno.env.get('SUPABASE_URL') || '', secret, {auth:{persistSession:false,autoRefreshToken:false}});
const signingKey = crypto.subtle.importKey('raw', new TextEncoder().encode(secret), {name:'HMAC',hash:'SHA-256'}, false, ['sign']);
Deno.serve(createAssetHandler({db, signingKey, bank}));
