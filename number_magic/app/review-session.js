/* Learning-only review session. Opaque token stays in sessionStorage, never a guardian/admin credential. */
(function(root){
'use strict';
const ENDPOINT='https://fgahqumaldheqettmvqg.supabase.co/functions/v1/nm-review';
const PUBLIC_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZnYWhxdW1hbGRoZXFldHRtdnFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE2NjAzNDcsImV4cCI6MjA5NzIzNjM0N30.iUXLFteDc_xIp_Xj506BKTxnZRYMObmTYQ2Dgh9RAqs',KEY='nm_review_session_v1';
let context=null,watch=null,expiry=null;
function err(code){const e=new Error(code);e.code=code;return e;}
function drop(){context=null;clearInterval(watch);clearTimeout(expiry);watch=null;expiry=null;try{sessionStorage.removeItem(KEY);}catch{}}
function stored(){try{const r=JSON.parse(sessionStorage.getItem(KEY)||'null');return r&&typeof r.token==='string'&&/^[a-f0-9]{64}$/.test(r.token)?r:null;}catch{return null;}}
async function call(action,payload){
 const ctl=new AbortController(),timer=setTimeout(()=>ctl.abort(),10000);
 try{const r=await fetch(ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json',apikey:PUBLIC_KEY},body:JSON.stringify({action,...payload}),signal:ctl.signal});const data=await r.json().catch(()=>null);
 if(!r.ok)throw err(r.status===429?'rate_limited':r.status===401?'invalid_credentials':'unavailable');
 if(!data||typeof data!=='object')throw err('unavailable');return data;
 }catch(e){if(e.code)throw e;throw err('network');}finally{clearTimeout(timer);}
}
function clean(r){if(r.scope!=='learning_review'||typeof r.username!=='string'||!/^[a-z0-9_.-]{1,64}$/.test(r.username)||!Number.isFinite(Date.parse(r.expiresAt))||Date.parse(r.expiresAt)<=Date.now())throw err('unavailable');return {username:r.username,expiresAt:r.expiresAt};}
async function login(username,code){
 const r=await call('login',{username:String(username||'').trim(),code:String(code||'')});
 const ctx=clean(r);if(typeof r.token!=='string'||!/^[a-f0-9]{64}$/.test(r.token))throw err('unavailable');
 try{sessionStorage.setItem(KEY,JSON.stringify({token:r.token}));}catch{await call('logout',{token:r.token}).catch(()=>{});throw err('storage');}
 context=ctx;return {...ctx};
}
async function ready(){
 const s=stored();if(!s){drop();return null;}
 try{context=clean(await call('status',{token:s.token}));return {...context};}catch{drop();return null;}
}
function guard(){
 clearInterval(watch);clearTimeout(expiry);
 const leave=()=>{drop();location.replace('access.html?reason=expired');};
 if(!context)return leave();
 expiry=setTimeout(leave,Math.max(0,Date.parse(context.expiresAt)-Date.now()));
 watch=setInterval(async()=>{if(!await ready())leave();},60000);
}
async function logout(){const s=stored();drop();if(s)await call('logout',{token:s.token}).catch(()=>{});}
root.NM_REVIEW_SESSION={login,ready,guard,logout,active:()=>!!context&&Date.parse(context.expiresAt)>Date.now()};
})(window);
