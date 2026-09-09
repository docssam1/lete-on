(function(root){
 'use strict';
 const catalog=root.HFChallengeAccessCatalog||(typeof require==='function'?require('./access-catalog.js'):null);
 let verified=null,epoch=0,listener=false,expiryTimer=null,refreshTimer=null,refreshAt=null,inflight=null;
 function isTeacherPreview(){const l=root.location;return !!l&&['localhost','127.0.0.1','[::1]'].includes(l.hostname)&&new URLSearchParams(l.search||'').get('teacherPreview')==='1';}
 function notify(reason){if(root.dispatchEvent&&root.CustomEvent)root.dispatchEvent(new root.CustomEvent('hfchallengeaccesschange',{detail:{reason}}));}
 function stopTimers(){if(expiryTimer!==null)root.clearTimeout(expiryTimer);if(refreshTimer!==null)root.clearTimeout(refreshTimer);expiryTimer=null;refreshTimer=null;refreshAt=null;}
 function clear(reason='cleared'){verified=null;epoch++;inflight=null;stopTimers();notify(reason);}
 function fresh(){return !!verified&&Date.now()<verified.validUntil&&verified.accountStatus==='active';}
 function sameAccess(a,b){return !!a&&a.studentId===b.studentId&&a.name===b.name&&a.accountStatus===b.accountStatus&&a.deliveryReady===b.deliveryReady&&a.permissionKeys.size===b.permissionKeys.size&&[...a.permissionKeys].every(key=>b.permissionKeys.has(key));}
 function schedule(){
  stopTimers();const lease=verified,remaining=lease.validUntil-Date.now();
  expiryTimer=root.setTimeout(()=>{if(verified===lease)clear('expired');},Math.max(0,remaining));
  // Renew a normal 60 second lease at 45 seconds. Do not hot-loop near a hard expiry.
  const delay=Math.max(1000,Math.floor(remaining*.75));
  if(delay<remaining){refreshAt=Date.now()+delay;refreshTimer=root.setTimeout(()=>{if(verified!==lease)return;refreshTimer=null;refreshAt=null;if(!fresh()){clear('expired');return;}void refresh({background:true});},delay);}
 }
 function refresh(options={}){
  if(isTeacherPreview()){if(verified||inflight)clear();return Promise.resolve({mode:'teacher-preview',verified:false,deliveryReady:false});}
  if(verified&&!fresh())clear('expired');
  if(inflight&&inflight.epoch===epoch)return inflight.promise;
  const requestEpoch=epoch,previous=verified,request={epoch:requestEpoch,promise:null};
  inflight=request;
  request.promise=(async()=>{try{
   if(root.GFieldHFSupabase?.enabled()!==true)throw Error('server_disabled');
   const client=await root.GFieldHFSupabase.ready();if(!client)throw Error('server_missing');
   if(!listener&&client.auth?.onAuthStateChange){listener=true;client.auth.onAuthStateChange((event,session)=>{if(['SIGNED_OUT','USER_UPDATED'].includes(event))clear('session-changed');else if(event==='SIGNED_IN'&&verified&&verified.studentId!==session?.user?.id)clear('session-changed');else if(event==='TOKEN_REFRESHED')void refresh({background:true});});}
   const {data,error}=await client.functions.invoke('challenge-access',{body:{action:'self'}});
   if(requestEpoch!==epoch)throw Error('session_changed');
   const now=Date.now();
   if(previous&&now>=previous.validUntil){clear('expired');throw Error('lease_expired');}
   if(error||!data||data.verified!==true||data.accountStatus!=='active'||typeof data.studentId!=='string'||!data.studentId||typeof data.approvedStudentName!=='string'||!data.approvedStudentName.trim()||!Array.isArray(data.permissionKeys)||data.permissionKeys.some(k=>!catalog.has(k))||data.catalogVersion!==catalog.version||!Number.isFinite(data.validUntil)||!Number.isFinite(data.verifiedAt)||data.validUntil<=now||data.validUntil>now+65000||data.verifiedAt>now+5000||data.verifiedAt<now-65000||typeof data.deliveryReady!=='boolean')throw Error('unverified_response');
   const next={studentId:data.studentId,name:data.approvedStudentName.trim(),accountStatus:'active',permissionKeys:new Set(data.permissionKeys),validUntil:data.validUntil,deliveryReady:data.deliveryReady};
   const unchanged=sameAccess(previous,next);verified=next;schedule();
   if(!unchanged)notify(previous?(previous.studentId!==next.studentId||previous.name!==next.name?'identity-changed':'permissions-changed'):'verified');
   return {mode:'student',verified:true,deliveryReady:verified.deliveryReady,validUntil:verified.validUntil,changed:!unchanged,background:options?.background===true};
  }catch(error){if(requestEpoch===epoch)clear('verification-failed');return {mode:'locked',verified:false,deliveryReady:false,error:String(error?.message||'권한 확인 실패')};}
  finally{if(inflight===request)inflight=null;}})();
  return request.promise;
 }
 function allow(productKey,typeId){const key=productKey==='challenge-bank'&&typeId?'challenge-bank-'+typeId:productKey;if(!catalog?.has(key))return false;if(isTeacherPreview())return true;return fresh()&&verified.deliveryReady===true&&verified.permissionKeys.has(key);}
 function watermarkIdentity(){if(!fresh()||!verified.permissionKeys.size)return null;return {studentId:verified.studentId,name:verified.name};}
 function approvedStudentName(){return watermarkIdentity()?.name||'';}
 const api={refresh,allow,watermarkIdentity,approvedStudentName,isTeacherPreview,clear,status:()=>({mode:isTeacherPreview()?'teacher-preview':fresh()?'student':'locked',verified:fresh(),deliveryReady:fresh()&&verified.deliveryReady,validUntil:fresh()?verified.validUntil:null,refreshAt:fresh()?refreshAt:null})};
 root.HFChallengeAccess=Object.freeze(api);if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
