// Small, learning-only login endpoint. Passwords/tokens are never logged or reflected on errors.
const ORIGINS=new Set(['https://lete-on.gfieldacademy.net','https://docssam1.github.io','http://127.0.0.1:4173','http://localhost:4173']);
const sha=async s=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s))),x=>x.toString(16).padStart(2,'0')).join('');
export function createHandler(rpc){return async req=>{
 const origin=req.headers.get('origin')||'',headers={'Content-Type':'application/json','Cache-Control':'no-store','Vary':'Origin','Access-Control-Allow-Methods':'POST, OPTIONS','Access-Control-Allow-Headers':'apikey, content-type','X-Content-Type-Options':'nosniff'};
 if(ORIGINS.has(origin))headers['Access-Control-Allow-Origin']=origin;
 const out=(j,status=200)=>new Response(j===null?null:JSON.stringify(j),{status,headers});
 if(origin&&!ORIGINS.has(origin))return out({error:'origin_not_allowed'},403);
 if(req.method==='OPTIONS')return out(null,204);
 if(req.method!=='POST')return out({error:'method_not_allowed'},405);
 if(!req.headers.get('apikey'))return out({error:'unauthorized'},401);
 if(+(req.headers.get('content-length')||0)>2048)return out({error:'request_invalid'},413);
 let body;try{const raw=await req.text();if(new TextEncoder().encode(raw).length>2048)return out({error:'request_invalid'},413);body=JSON.parse(raw);}catch{return out({error:'request_invalid'},400);}
 if(!body||typeof body!=='object'||Array.isArray(body))return out({error:'request_invalid'},400);
 const action=body.action;if(!['login','status','logout'].includes(action))return out({error:'action_invalid'},400);
 const keys=action==='login'?['action','username','code']:['action','token'];
 if(Object.keys(body).some(k=>!keys.includes(k)))return out({error:'request_invalid'},400);
 let payload,ipHash=null;
 if(action==='login'){
  if(typeof body.username!=='string'||! /^[A-Za-z0-9_.-]{1,64}$/.test(body.username)||typeof body.code!=='string'||!body.code||new TextEncoder().encode(body.code).length>72||/[\x00-\x1f\x7f]/.test(body.code))return out({error:'invalid_credentials'},401);
  const ip=(req.headers.get('cf-connecting-ip')||req.headers.get('x-real-ip')||req.headers.get('x-forwarded-for')||'').split(',')[0].trim();
  if(!ip||ip.length>256)return out({error:'unavailable'},503);
  ipHash=await sha(ip);payload={username:body.username.toLowerCase(),code:body.code};
 }else{if(typeof body.token!=='string'||!/^[a-f0-9]{64}$/.test(body.token))return out({error:'unauthorized'},401);payload={token:body.token};}
 try{
  const {data,error}=await rpc(action,payload,ipHash);if(error||!data)return out({error:'unavailable'},503);
  if(data.error){const status=[400,401,429,503].includes(data.status)?data.status:401;if(status===429)headers['Retry-After']='900';return out({error:status===429?'rate_limited':status===503?'unavailable':status===400?'action_invalid':action==='login'?'invalid_credentials':'unauthorized'},status);}
  if(action==='logout')return out({ok:true});
  if(typeof data.username!=='string'||!/^[a-z0-9_.-]{1,64}$/.test(data.username)||!Number.isFinite(Date.parse(data.expiresAt))||data.scope!=='learning_review')return out({error:'unavailable'},503);
  const value={username:data.username,expiresAt:data.expiresAt,scope:'learning_review'};
  if(action==='login'){if(typeof data.token!=='string'||!/^[a-f0-9]{64}$/.test(data.token))return out({error:'unavailable'},503);value.token=data.token;}
  return out(value);
 }catch{return out({error:'unavailable'},503);}
};}
