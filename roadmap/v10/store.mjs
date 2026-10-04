import {validateReviewState} from './review-validation.mjs';
// Storage adapter. Local review server (api/health answers) keeps the E: files as before;
// anywhere else (GitHub Pages) records live in this browser's IndexedDB, keyed by the approval code.
const DB_NAME='gfield-roadmap-v10',KEEP=20;
const CONFLICT='다른 창에서 저장된 기록이 있습니다. 새로고침해 최신 기록을 확인해 주세요.';
let mode=null,userKey='local',persistent=true,dbPromise=null;
const memory=new Map();
const fail=(message,status,details)=>Object.assign(new Error(message),{status,details});
const empty=()=>({state:null,revision:0});
const wrap=request=>new Promise((resolve,reject)=>{request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error);});

export const isPersistent=()=>persistent;
export const storageMode=()=>mode;

async function detectMode(){
  if(mode)return mode;
  try{const res=await fetch('api/health',{cache:'no-store'});const body=res.ok&&(res.headers.get('content-type')||'').includes('json')?await res.json():null;mode=body?.ok?'server':'browser';}
  catch{mode='browser';}
  return mode;
}
export async function openStore(){
  await detectMode();
  if(mode==='server')return mode;
  const {passGate}=await import('./gate.mjs');
  userKey=await passGate();
  try{await navigator.storage?.persist?.();}catch{}
  return mode;
}

function database(){
  return dbPromise??=new Promise((resolve,reject)=>{
    if(!globalThis.indexedDB)return reject(new Error('이 브라우저는 저장 공간을 쓸 수 없습니다.'));
    const open=indexedDB.open(DB_NAME,1);
    open.onupgradeneeded=()=>{const db=open.result;db.createObjectStore('state');db.createObjectStore('history',{autoIncrement:true}).createIndex('user','user');};
    open.onsuccess=()=>resolve(open.result);open.onerror=()=>reject(open.error);open.onblocked=()=>reject(new Error('저장 공간이 다른 창에서 사용 중입니다.'));
  }).catch(error=>{dbPromise=null;throw error;});
}

async function browserLoad(){
  try{const db=await database();return (await wrap(db.transaction('state').objectStore('state').get(userKey)))??empty();}
  catch{persistent=false;return memory.get(userKey)??empty();}
}
async function browserSave(state,expectedRevision){
  const check=validateReviewState(state);
  if(!check.valid)throw fail('입력 자료를 확인해 주세요.',422,check.errors);
  let db=null;
  try{db=await database();}catch{persistent=false;}
  if(!db){
    const current=memory.get(userKey)??empty();
    if(expectedRevision!==current.revision)throw fail(CONFLICT,409);
    const revision=current.revision+1;memory.set(userKey,{state:{...state,revision},revision});return {revision};
  }
  return new Promise((resolve,reject)=>{
    const tx=db.transaction(['state','history'],'readwrite'),states=tx.objectStore('state'),history=tx.objectStore('history');
    let result,failure;
    const read=states.get(userKey);
    read.onsuccess=()=>{
      const current=read.result??empty();
      if(expectedRevision!==current.revision){failure=fail(CONFLICT,409);tx.abort();return;}
      const revision=current.revision+1;
      if(current.state)history.add({user:userKey,revision:current.revision,savedAt:new Date().toISOString(),record:current});
      states.put({state:{...state,revision},revision},userKey);
      const keys=history.index('user').getAllKeys(userKey);
      keys.onsuccess=()=>{for(const key of keys.result.slice(0,Math.max(0,keys.result.length-KEEP)))history.delete(key);};
      result={revision};
    };
    tx.oncomplete=()=>resolve(result);
    tx.onabort=()=>reject(failure||(tx.error?.name==='QuotaExceededError'?fail('브라우저 저장 공간이 부족합니다. 사본을 내려받아 보관해 주세요.',507):fail('이 기기에 저장하지 못했습니다. 사본을 내려받아 보관해 주세요.',500)));
  });
}

async function serverLoad(){
  const res=await fetch('api/state',{cache:'no-store'});
  if(!res.ok)throw fail('저장된 기록을 불러오지 못했습니다.',res.status);
  return res.json();
}
async function serverSave(state,expectedRevision){
  const res=await fetch('api/state',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({state,expectedRevision})});
  const body=await res.json().catch(()=>({}));
  if(!res.ok)throw fail(body.error||`저장 실패 (${res.status})`,res.status,body.details);
  return body;
}

export const loadState=()=>mode==='server'?serverLoad():browserLoad();
export const saveState=(state,expectedRevision)=>mode==='server'?serverSave(state,expectedRevision):browserSave(state,expectedRevision);

export async function exportState(state){
  if(mode==='server'){
    const res=await fetch('api/export',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({state})});
    const body=await res.json().catch(()=>({}));
    if(!res.ok)throw fail(body.error||'사본 보관 실패',res.status);
    return {path:body.path,message:'E/G에 현재 입력 사본을 보관했습니다.'};
  }
  const check=validateReviewState(state);
  if(!check.valid)throw fail('내보낼 자료를 확인해 주세요.',422,check.errors);
  const name=`gfield-plan-${new Date().toISOString().replace(/[:.]/g,'-')}.json`;
  const link=document.createElement('a');
  link.href=URL.createObjectURL(new Blob([JSON.stringify({exportVersion:1,exportedAt:new Date().toISOString(),state},null,2)+'\n'],{type:'application/json'}));
  link.download=name;document.body.append(link);link.click();link.remove();
  setTimeout(()=>URL.revokeObjectURL(link.href),10000);
  return {path:name,message:'이 기기에 JSON 사본을 내려받았습니다.'};
}
