/* Per-student cosmetic wallet. Local profile/backup and authenticated sync own it.
   Cosmetic coins are game rewards, never payment or membership authority. */
(function(root){
'use strict';
const policy=Object.freeze({version:'20261024-balanced1',dailyLimit:20,gameDailyLimit:2,
  fixed:Object.freeze({attendance:1,weekly:3,game:1,training:1,boost:2,history:1}),
  unitDivisor:5,unitMax:15,checkupDivisor:5,checkupMax:12,learningMax:3});
const gifts=Object.freeze([
  {course:7,type:'symbol',id:'times'},
  {course:16,type:'number',id:'10'},
  {course:24,type:'symbol',id:'percent'},
  {course:37,type:'symbol',id:'sqrt'}
].map(Object.freeze));
const own=(object,key)=>Object.prototype.hasOwnProperty.call(object,key);
const record=value=>value&&typeof value==='object'&&!Array.isArray(value)?value:{};
function balance(s){return Number.isSafeInteger(s.coins)&&s.coins>=0?s.coins:0;}
function entry(s,amount,reason,label,at){
  const log=Array.isArray(s.coinLedger)?s.coinLedger.slice(-99):[];
  log.push({amount,reason,at:at||new Date().toISOString(),balance:balance(s),label:String(label||'').slice(0,80)});
  s.coinLedger=log;
}
function rewardReason(reason){
  if(typeof reason!=='string')return 'learning';
  return own(policy.fixed,reason)||reason==='unit'||reason==='checkup'?reason:'learning';
}
function quoteReward(n,reason){
  if(!Number.isSafeInteger(n)||n<=0)return 0;
  reason=rewardReason(reason);
  if(own(policy.fixed,reason))return policy.fixed[reason];
  if(reason==='unit')return Math.max(1,Math.min(policy.unitMax,Math.floor(n/policy.unitDivisor)));
  if(reason==='checkup')return Math.max(1,Math.min(policy.checkupMax,Math.floor(n/policy.checkupDivisor)));
  return Math.min(policy.learningMax,n);
}
function reward(s,n,reason,claimKey,now){
  const quote=quoteReward(n,reason);
  if(!s||typeof s!=='object'||!quote)return false;
  const date=now==null?new Date():now instanceof Date?new Date(+now):typeof now==='string'?new Date(now):null;
  if(!date||!Number.isFinite(+date))return false;
  reason=rewardReason(reason);
  if(claimKey!=null&&(typeof claimKey!=='string'||!claimKey.trim()||claimKey.length>160))return false;
  const claim=claimKey==null?null:reason+'|'+claimKey.trim();
  const previous=record(s.coinRewards),days=record(previous.days),claims=record(previous.claims);
  if(claim&&own(claims,claim))return false;
  const shifted=new Date(+date+9*3600000);
  if(!Number.isFinite(+shifted))return false;
  const day=shifted.toISOString().slice(0,10),raw=days[day];
  if(!/^\d{4}-\d{2}-\d{2}$/.test(day))return false;
  const count=(value,max)=>Number.isSafeInteger(value)&&value>=0?Math.min(value,max):max;
  const total=raw?count(raw.total,policy.dailyLimit):0;
  const game=raw?count(raw.game,policy.gameDailyLimit):0;
  const amount=Math.min(quote,policy.dailyLimit-total,
    reason==='game'?policy.gameDailyLimit-game:policy.dailyLimit);
  if(amount<=0||!Number.isSafeInteger(balance(s)+amount))return false;
  // Budgets and durable claim keys are independent of the bounded display
  // ledger. Spending, reloading, or visiting an older date cannot reset them.
  // Existing balances, historical ledger entries and cosmetic rights are never
  // recalculated when this future-reward policy is first introduced.
  s.coinRewards={version:policy.version,
    days:{...days,[day]:{total:total+amount,game:game+(reason==='game'?amount:0)}},
    claims:claim?{...claims,[claim]:day}:claims};
  s.coins=balance(s)+amount;entry(s,amount,reason,claimKey,date.toISOString());return true;
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
const api={balance,reward,quoteReward,policy,gifts,purchase,humans,normalizeAvatars};
root.NM_CHARACTER_STATE=api;
if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
