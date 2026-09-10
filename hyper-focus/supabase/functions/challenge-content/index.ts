import { createClient } from "npm:@supabase/supabase-js@2.112.3";
import { requestTarget, validateManifest, selectReference, selectContent, type Obj } from "./content-contract.ts";
import { RELEASE_CONFIG } from "./release-config.ts";
const ORIGINS=new Set(["https://lete-on.gfieldacademy.net","http://localhost:4177","http://127.0.0.1:4177","http://localhost:41873","http://127.0.0.1:41873"]);
type ObjectMap=Record<string,unknown>;
function envKey(map:string,single:string,legacy:string){try{const parsed=JSON.parse(Deno.env.get(map)||"{}");if(typeof parsed.default==="string")return parsed.default;}catch{}return Deno.env.get(single)||Deno.env.get(legacy)||"";}
function respond(req:Request,status:number,body:ObjectMap){const origin=req.headers.get("origin")||"";return new Response(JSON.stringify(body),{status,headers:{"content-type":"application/json; charset=utf-8","cache-control":"no-store","x-content-type-options":"nosniff","vary":"Origin","access-control-allow-origin":ORIGINS.has(origin)?origin:"https://lete-on.gfieldacademy.net","access-control-allow-headers":"authorization, apikey, content-type, x-client-info","access-control-allow-methods":"POST, OPTIONS"}});}
function claimsOf(token:string):ObjectMap|null{try{const s=token.split(".")[1].replace(/-/g,"+").replace(/_/g,"/");return JSON.parse(atob(s.padEnd(Math.ceil(s.length/4)*4,"=")));}catch{return null;}}
function exactKeys(body:ObjectMap,keys:string[]){return Object.keys(body).length===keys.length&&Object.keys(body).every(k=>keys.includes(k));}
async function readBody(req:Request):Promise<ObjectMap|null>{
 if(!req.body||!/^application\/json(?:;|$)/i.test(req.headers.get("content-type")||""))return null;
 const reader=req.body.getReader();let size=0;const chunks:Uint8Array[]=[];
 try{while(true){const{done,value}=await reader.read();if(done)break;size+=value.length;if(size>4096){await reader.cancel();return null;}chunks.push(value);}}finally{reader.releaseLock();}
 const bytes=new Uint8Array(size);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.length;}
 try{const data=JSON.parse(new TextDecoder("utf-8",{fatal:true}).decode(bytes));return data&&typeof data==="object"&&!Array.isArray(data)?data:null;}catch{return null;}
}

const BUCKET=Deno.env.get('CHALLENGE_PRIVATE_BUCKET')||'hf-challenge-private',MANIFEST_PATH="manifest.json";
async function sha256(bytes:ArrayBuffer){return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes))).map(x=>x.toString(16).padStart(2,'0')).join('');}
async function downloadJSON(service:ReturnType<typeof createClient>,path:string,hash:string,maxBytes:number){
 if(!/^[a-f0-9]{64}$/.test(hash))throw Error('manifest_pin_required');
 const {data,error}=await service.storage.from(BUCKET).download(path);
 if(error||!data||data.size>maxBytes)throw Error('private_asset_unavailable');
 const bytes=await data.arrayBuffer();if(bytes.byteLength>maxBytes||await sha256(bytes)!==hash)throw Error('private_asset_invalid');
 return JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(bytes));
}
async function authorize(client:ReturnType<typeof createClient>,userId:string,permissionKeys:string[],tokenExpiry:number){
 const now=Date.now();if(now>=tokenExpiry)return null;
 // Caller-scoped existing HF RLS checks the current session, active profile and credential/login version.
 const {data:profile,error:profileError}=await client.from('hf_students').select('id,display_name,account_status').eq('id',userId).maybeSingle();
 if(profileError||!profile||profile.id!==userId||profile.account_status!=='active'||typeof profile.display_name!=='string'||!profile.display_name.trim())return null;
 const {data:rows,error}=await client.from('hf_entitlements').select('permission_key,starts_at,expires_at,revoked_at').eq('student_id',userId);
 if(error)return null;
 const active=(rows||[]).filter((e:Obj)=>permissionKeys.includes(e.permission_key)&&!e.revoked_at&&Number.isFinite(Date.parse(e.starts_at))&&Date.parse(e.starts_at)<=now&&(!e.expires_at||(Number.isFinite(Date.parse(e.expires_at))&&Date.parse(e.expires_at)>now)));
 if(!active.length)return null;
 return {studentId:profile.id,approvedStudentName:profile.display_name.trim(),validUntil:Math.min(now+60000,tokenExpiry,...active.filter((e:Obj)=>e.expires_at).map((e:Obj)=>Date.parse(e.expires_at)))};
}
export async function handleRequest(request:Request):Promise<Response>{
 try{
  const origin=request.headers.get('origin')||'';
  if(request.method==='OPTIONS')return respond(request,ORIGINS.has(origin)?200:403,{});
  if(request.method!=='POST'||(origin&&!ORIGINS.has(origin)))return respond(request,403,{error:'request_not_allowed'});
  const auth=request.headers.get('authorization')||'',token=auth.startsWith('Bearer ')?auth.slice(7):'';
  const url=Deno.env.get('SUPABASE_URL')||'',publicKey=envKey('SUPABASE_PUBLISHABLE_KEYS','SUPABASE_PUBLISHABLE_KEY','SUPABASE_ANON_KEY'),secret=envKey('SUPABASE_SECRET_KEYS','SUPABASE_SECRET_KEY','SUPABASE_SERVICE_ROLE_KEY');
  if(!token||!url||!publicKey||!secret)return respond(request,401,{error:'authentication_required'});
  const caller=createClient(url,publicKey,{global:{headers:{Authorization:auth}},auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}});
  const {data:authData,error:authError}=await caller.auth.getUser(token),user=authData?.user,claims=claimsOf(token);
  if(authError||!user||user.is_anonymous||!claims||!Number.isFinite(Number(claims.exp))||Number(claims.exp)*1000<=Date.now())return respond(request,401,{error:'authentication_required'});
  if(user.app_metadata?.hf_role!=='student'||(claims.app_metadata as Obj|undefined)?.hf_role!=='student')return respond(request,403,{error:'student_access_required'});
  const body=await readBody(request),target=requestTarget(body);if(!target)return respond(request,400,{error:'invalid_content_request'});
  const initial=await authorize(caller,user.id,target.permissionKeys,Number(claims.exp)*1000);if(!initial)return respond(request,403,{error:'content_access_denied'});
  const readySetting=Deno.env.get('CHALLENGE_PRIVATE_DELIVERY_READY');
  if(readySetting===undefined?RELEASE_CONFIG.ready!==true:readySetting!=='true')return respond(request,503,{error:'private_delivery_not_ready'});
  const service=createClient(url,secret,{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}});
  const {data:bucket,error:bucketError}=await service.storage.getBucket(BUCKET);
  if(bucketError||!bucket||bucket.id!==BUCKET||bucket.public!==false)return respond(request,503,{error:'private_storage_required'});
  const manifest=await downloadJSON(service,MANIFEST_PATH,Deno.env.get('CHALLENGE_MANIFEST_SHA256')||RELEASE_CONFIG.manifestSha256,524288);
  validateManifest(manifest);const ref=selectReference(manifest,target);
  const file=await downloadJSON(service,ref.path,ref.sha256,target.kind==='document'?12000000:8000000);
  const content=selectContent(file,manifest,target);
  // Reject grants/profile/session revoked while storage was loading. No permission result is cached across requests.
  const current=await authorize(caller,user.id,target.permissionKeys,Number(claims.exp)*1000);
  if(!current||current.studentId!==initial.studentId||current.approvedStudentName!==initial.approvedStudentName||Date.now()>=initial.validUntil)return respond(request,403,{error:'content_access_changed'});
  return respond(request,200,{verified:true,...current,validUntil:Math.min(initial.validUntil,current.validUntil),contentVersion:manifest.contentVersion,part:target.part,...content});
 }catch{return respond(request,503,{error:'private_content_unavailable'});}
}
Deno.serve(handleRequest);
