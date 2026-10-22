import 'jsr:@supabase/functions-js@2.5.0/edge-runtime.d.ts';
import {createClient} from 'npm:@supabase/supabase-js@2.112.4';
import {createHandler} from './handler.mjs';
const url=Deno.env.get('SUPABASE_URL'),secret=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
const client=url&&secret?createClient(url,secret,{auth:{persistSession:false,autoRefreshToken:false}}):null;
const handler=createHandler((action:string,payload:unknown,ipHash:string|null)=>client!.rpc('nm_review_rpc',{p_action:action,p_payload:payload,p_ip_hash:ipHash}));
Deno.serve(req=>client?handler(req):new Response(JSON.stringify({error:'unavailable'}),{status:503,headers:{'Content-Type':'application/json','Cache-Control':'no-store'}}));
