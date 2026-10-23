/* Account-owned local learner state. Legacy data is a read-only migration source;
   knowing a phone number or another learner's name never selects their storage. */
(function(root){
'use strict';
const LEGACY_KEY='nm_state_v1',PREVIEW_KEY='nm_preview_state_v1',PREFIX='nm_learner_state_v1_';
const own=(object,key)=>Object.prototype.hasOwnProperty.call(object,key);
function validOwner(owner){return typeof owner==='string'&&owner.length>0&&owner.length<=128&&!/\s/.test(owner);}
function keyFor(owner){
  if(owner===null)return PREVIEW_KEY;
  if(!validOwner(owner))throw new TypeError('invalid_learner_owner');
  // Encoding also rejects malformed UTF-16 instead of collapsing owner keys.
  return PREFIX+encodeURIComponent(owner);
}
function failure(key,error){return {ok:false,key,raw:null,migrated:false,legacySkipped:false,error};}
function read(storage,owner){
  let key;
  try{key=keyFor(owner);}catch(e){return failure(null,'invalid_owner');}
  if(!storage||typeof storage.getItem!=='function'||typeof storage.setItem!=='function')return failure(key,'storage_unavailable');
  let current,legacy;
  try{
    current=storage.getItem(key);
    // Existing account/preview data, including a damaged raw value, belongs to
    // this key. Leave recovery and parsing to the caller; never replace it.
    if(current!==null)return {ok:true,key,raw:current,migrated:false,legacySkipped:false};
    legacy=storage.getItem(LEGACY_KEY);
  }catch(e){return failure(key,'storage_read_failed');}
  if(legacy===null)return {ok:true,key,raw:null,migrated:false,legacySkipped:false};
  let state;
  try{state=JSON.parse(legacy);}catch(e){}
  const object=state&&typeof state==='object'&&!Array.isArray(state);
  const eligible=!!object&&(owner===null
    // Even false/null fields may be the residue of a signed-out account. Do not
    // infer that such a profile became an anonymous guest after signing out.
    ? !['cloudOwnerId','cloudLinked','guardianManaged'].some(field=>own(state,field))
    : validOwner(state.cloudOwnerId)&&state.cloudOwnerId===owner);
  if(!eligible)return {ok:true,key,raw:null,migrated:false,legacySkipped:true};
  try{
    // Copy the exact original rather than injecting ownership or normalizing a
    // learner's progress. The legacy key is never written, removed or renamed.
    storage.setItem(key,legacy);
    if(storage.getItem(key)!==legacy)return failure(key,'migration_verify_failed');
  }catch(e){return failure(key,'migration_write_failed');}
  return {ok:true,key,raw:legacy,migrated:true,legacySkipped:false};
}
const api={keyFor,read,LEGACY_KEY,PREVIEW_KEY};
root.NM_LEARNER_STORAGE=api;
if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
