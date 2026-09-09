(function(root){
 'use strict';
 const catalog=root.HFTypeAccessCatalog||(typeof require==='function'?require('./type-access-catalog.js'):null);
 const baseKeys=new Set(['hyperfocus','hyperfocus-extra','problem-bank']);
 let verified=null,epoch=0,listener=false,expiryTimer=null,refreshTimer=null,inflight=null;
 function isTeacherPreview(){const l=root.location;return !!l&&['localhost','127.0.0.1','[::1]'].includes(l.hostname)&&new URLSearchParams(l.search||'').get('teacherPreview')==='1';}
 function notify(reason){if(root.dispatchEvent&&root.CustomEvent)root.dispatchEvent(new root.CustomEvent('hf-type-access-change',{detail:{reason}}));}
 function stopTimers(){if(expiryTimer)root.clearTimeout(expiryTimer);if(refreshTimer)root.clearTimeout(refreshTimer);expiryTimer=null;refreshTimer=null;}
 function clear(reason='cleared'){verified=null;epoch++;inflight=null;stopTimers();notify(reason);}
 function fresh(){return !!verified&&Date.now()<verified.validUntil;}
 function status(){const ok=fresh();return {verified:ok,mode:isTeacherPreview()?'teacher-preview':ok?verified.keys.has(catalog.modeKey)?'individual':'legacy':'locked',hasBaseAccess:ok&&verified.base.has('hyperfocus'),hasPaidAccess:ok&&(verified.base.has('hyperfocus-extra')||verified.base.has('problem-bank')),validUntil:ok?verified.validUntil:null};}
 function signature(v){return JSON.stringify([v.studentId,v.name,[...v.keys].sort(),[...v.base].sort()]);}
 function schedule(){stopTimers();const lease=verified,left=lease.validUntil-Date.now();expiryTimer=root.setTimeout(()=>{if(verified===lease)clear('expired');},Math.max(0,left));if(left>1500)refreshTimer=root.setTimeout(()=>{if(verified===lease)refresh();},Math.max(500,left-15000));}
 function refresh(){
  if(inflight)return inflight;
  if(isTeacherPreview())return Promise.resolve(status());
  if(verified&&!fresh())clear('expired');
  const previous=verified;
  const requestEpoch=epoch;
  const run=(async()=>{
   try{
    if(root.GFieldHFSupabase?.enabled()!==true)throw Error('server_disabled');
    const client=await root.GFieldHFSupabase.ready();if(!client)throw Error('server_missing');
    if(!listener&&client.auth?.onAuthStateChange){listener=true;client.auth.onAuthStateChange(event=>{if(event==='TOKEN_REFRESHED')Promise.resolve().then(()=>refresh());else if(['SIGNED_OUT','SIGNED_IN','USER_UPDATED'].includes(event))clear('session-changed');});}
    const {data,error}=await client.functions.invoke('hyperfocus-type-access',{body:{action:'self'}});
    if(requestEpoch!==epoch)throw Error('session_changed');
    const now=Date.now();
    if(previous&&now>=previous.validUntil)throw Error('previous_lease_expired');
    if(error||!data||data.verified!==true||data.accountStatus!=='active'||typeof data.studentId!=='string'||!data.studentId||typeof data.approvedStudentName!=='string'||!data.approvedStudentName.trim()||!Array.isArray(data.permissionKeys)||data.permissionKeys.some(k=>!catalog.has(k))||!Array.isArray(data.basePermissions)||data.basePermissions.some(k=>!baseKeys.has(k))||data.catalogVersion!==catalog.version||!Number.isFinite(data.validUntil)||!Number.isFinite(data.verifiedAt)||data.validUntil<=now||data.validUntil>now+65000||data.verifiedAt>now+5000||data.verifiedAt<now-65000)throw Error('unverified_response');
    const next={studentId:data.studentId,name:data.approvedStudentName.trim(),keys:new Set(data.permissionKeys),base:new Set(data.basePermissions),validUntil:data.validUntil};
    const unchanged=fresh()&&signature(verified)===signature(next);
    verified=next;schedule();if(!unchanged)notify('verified');return status();
   }catch(error){if(requestEpoch===epoch)clear('verification-failed');return {...status(),error:String(error?.message||'권한 확인 실패')};}
  })();
  inflight=run;run.finally(()=>{if(inflight===run)inflight=null;});return run;
 }
 function allowType(id,options={}){const key=catalog?.keyFor(id);if(!key)return false;if(isTeacherPreview())return true;if(!fresh()||!verified.base.has('hyperfocus'))return false;if(verified.keys.has(catalog.modeKey)&&!verified.keys.has(key))return false;if(options.paid===true&&(!(verified.base.has('hyperfocus-extra')||verified.base.has('problem-bank'))||root.HFAccessPolicy?.paidPracticeReady()!==true))return false;return true;}
 function watermarkIdentity(){return fresh()&&verified.base.has('hyperfocus')?{studentId:verified.studentId,name:verified.name}:null;}
 const api={ready:refresh,refresh,allowType,status,clear,watermarkIdentity,approvedStudentName:()=>watermarkIdentity()?.name||'',isTeacherPreview};
 root.HFTypeAccess=Object.freeze(api);if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
