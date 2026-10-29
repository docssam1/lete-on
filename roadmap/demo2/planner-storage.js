/*
 * Preserve existing tab keys; keep durable copies only in gfield.demo2.saved.*.
 * Values remain strings: parsing, schema validation and migration belong to the
 * existing planner modules. No global clear(), storage enumeration, or network.
 * status() reports durable / session / memory; write failures never lose the
 * current in-memory value. A failing durable write invalidates only that key.
 * If every persistent write AND removal is blocked, no client can invalidate a
 * stale copy across a wholly new tab; status() therefore reports the fallback.
 */
(function(global){
 'use strict';
 const prefix='gfield.demo2.',saved=prefix+'saved.',guard=saved+'guard.';
 const memory=new Map(),overrides=new Set(),durableFailures=new Set(),sessionFailures=new Set();
 let localAccess=true,sessionAccess=true;

 function keyOf(key){
  key=String(key);
  if(!key.startsWith(prefix)||key.startsWith(saved))throw new RangeError('PlannerStorage requires a gfield.demo2 plan key');
  return key;
 }
 function localKey(key){return saved+key.slice(prefix.length);}
 function guardKey(key){return guard+key.slice(prefix.length);}
 function storage(name){
  try{return global[name]||null;}catch{return null;}
 }
 function read(name,key){
  try{const store=storage(name);if(!store)throw new Error('Storage unavailable');return {ok:true,value:store.getItem(key)};}catch{return{ok:false,value:null};}
 }
 function write(name,key,value){
  try{const store=storage(name);if(!store)throw new Error('Storage unavailable');store.setItem(key,value);return true;}catch{return false;}
 }
 function remove(name,key){
  try{const store=storage(name);if(!store)throw new Error('Storage unavailable');store.removeItem(key);return true;}catch{return false;}
 }

 function getItem(input){
  const key=keyOf(input);
  // A failed session write must not expose that session's older value.
  if(overrides.has(key))return memory.get(key)??null;
  const mark=read('sessionStorage',guardKey(key));
  if(mark.value==='local-stale'||mark.value==='removed-local-stale')durableFailures.add(key);
  if(mark.value==='removed'||mark.value==='removed-local-stale'){memory.set(key,null);return null;}
  const session=read('sessionStorage',key);sessionAccess=session.ok;
  if(session.ok&&session.value!==null){memory.set(key,session.value);return session.value;}
  if(mark.value==='local-stale'||durableFailures.has(key))return memory.get(key)??null;
  const local=read('localStorage',localKey(key));localAccess=local.ok;
  if(local.ok){memory.set(key,local.value);return local.value;}
  return memory.get(key)??null;
 }

 function setItem(input,value){
  const key=keyOf(input),text=String(value);memory.set(key,text);
  const session=write('sessionStorage',key,text);sessionAccess=session;
  if(session){sessionFailures.delete(key);overrides.delete(key);}else{
   sessionFailures.add(key);overrides.add(key);
   // Do not leave an older session value ahead of a newer durable copy.
   remove('sessionStorage',key);
  }
  const durable=write('localStorage',localKey(key),text);localAccess=durable;
  if(durable){
   durableFailures.delete(key);remove('sessionStorage',guardKey(key));
  }else{
   durableFailures.add(key);remove('localStorage',localKey(key));
   write('sessionStorage',guardKey(key),'local-stale');
  }
 }

 function removeItem(input){
  const key=keyOf(input);memory.set(key,null);overrides.add(key);
  const session=remove('sessionStorage',key);sessionAccess=session;
  if(session)sessionFailures.delete(key);else sessionFailures.add(key);
  const durable=remove('localStorage',localKey(key));localAccess=durable;
  if(durable)durableFailures.delete(key);else durableFailures.add(key);
  // A targeted tombstone blocks stale fallback after a failed removal/reload.
  const guarded=write('sessionStorage',guardKey(key),durable?'removed':'removed-local-stale');
  if(session&&guarded)overrides.delete(key);
 }

 // Explicit migration only: reads do not promote another tab's saved choices.
 // Returns true only when an existing session value was newly copied.
 function promoteExisting(input){
  const key=keyOf(input);
  if(overrides.has(key))return false;
  const mark=read('sessionStorage',guardKey(key));sessionAccess=mark.ok;
  if(!mark.ok)return false;
  if(mark.value==='local-stale'||mark.value==='removed-local-stale')durableFailures.add(key);
  if(mark.value==='removed'||mark.value==='local-stale'||mark.value==='removed-local-stale')return false;
  const session=read('sessionStorage',key);sessionAccess=session.ok;
  if(!session.ok||session.value===null)return false;
  memory.set(key,session.value);
  const existing=read('localStorage',localKey(key));localAccess=existing.ok;
  if(!existing.ok){durableFailures.add(key);return false;}
  if(existing.value!==null)return false;
  const promoted=write('localStorage',localKey(key),session.value);localAccess=promoted;
  if(promoted)durableFailures.delete(key);
  else{durableFailures.add(key);write('sessionStorage',guardKey(key),'local-stale');}
  return promoted;
 }

 function status(){
  if(localAccess&&durableFailures.size===0&&storage('localStorage'))return'durable';
  if(sessionAccess&&sessionFailures.size===0&&storage('sessionStorage'))return'session';
  return'memory';
 }
 global.PlannerStorage=Object.freeze({getItem,setItem,removeItem,promoteExisting,status});
})(typeof window!=='undefined'?window:globalThis);
