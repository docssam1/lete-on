/* Per-student cosmetic wallet. Local profile/backup and authenticated sync own it.
   Cosmetic coins are game rewards, never payment or membership authority. */
(function(root){
'use strict';
function balance(s){return Number.isSafeInteger(s.coins)&&s.coins>=0?s.coins:0;}
function entry(s,amount,reason,label){
  const log=Array.isArray(s.coinLedger)?s.coinLedger.slice(-99):[];
  log.push({amount,reason,at:new Date().toISOString(),balance:balance(s),label:String(label||'').slice(0,80)});
  s.coinLedger=log;
}
function reward(s,n,reason){
  if(!Number.isSafeInteger(n)||n<=0||!Number.isSafeInteger(balance(s)+n))return false;
  s.coins=balance(s)+n;entry(s,n,reason||'learning');return true;
}
function catalog(type,av,humans){
  return type==='outfit'?humans&&humans.outfits:
    av&&av[({number:'numbers',symbol:'symbols',color:'colors',cape:'capes',hat:'hats',bg:'bgs'})[type]];
}
function purchase(s,type,id,av,humans){
  const items=catalog(type,av,humans)||[],item=items.find(x=>String(x.id)===String(id));
  if(!item)return {ok:false,code:'unknown'};
  const key=type+'_'+item.id,owned=s.character_unlocked||{};
  if(item.free||owned[key])return {ok:true,spent:0,coins:balance(s),unlocked:{...owned}};
  if(!Number.isSafeInteger(item.price)||item.price<=0)return {ok:false,code:'price'};
  if(balance(s)<item.price)return {ok:false,code:'balance'};
  s.coins=balance(s)-item.price;s.character_unlocked={...owned,[key]:true};
  entry(s,-item.price,'purchase',key);
  return {ok:true,spent:item.price,coins:s.coins,unlocked:{...s.character_unlocked}};
}
function humans(s,active,profiles,registry){
  if(!registry||!Array.isArray(profiles)||!profiles.length)return false;
  const clean=profiles.map(p=>registry.clean(p));
  if(new Set(clean.map(p=>p.id)).size!==clean.length)return false;
  const own=p=>{const o=registry.outfits.find(x=>x.id===p.outfit);return !!o&&(o.free||!!(s.character_unlocked||{})['outfit_'+o.id]);};
  if(!clean.every(own))return false;
  const next=registry.clean(active),match=clean.find(p=>p.id===next.id);
  if(!match||JSON.stringify(match)!==JSON.stringify(next))return false;
  s.avatar=next;s.avatarCollection=clean;return true;
}
function normalizeAvatars(s,registry){
  // Older saves have just {kind}. A partial restore may lack an outfit unlock:
  // retain every character/name, use original clothes, and keep naming usable.
  if(!s.avatar||!registry)return;
  const safe=raw=>{
    const p=registry.clean(raw),outfit=registry.outfits.find(o=>o.id===p.outfit);
    if(!outfit.free&&!(s.character_unlocked||{})['outfit_'+p.outfit])p.outfit='original';
    return p;
  };
  const active=safe(s.avatar),all=[],seen=new Set();
  for(const raw of Array.isArray(s.avatarCollection)?s.avatarCollection:[]){
    const p=safe(raw);if(!seen.has(p.id)){all.push(p.id===active.id?active:p);seen.add(p.id);}
  }
  if(!seen.has(active.id))all.unshift(active);
  s.avatar=active;s.avatarCollection=all;
}
const api={balance,reward,purchase,humans,normalizeAvatars};
root.NM_CHARACTER_STATE=api;
if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
