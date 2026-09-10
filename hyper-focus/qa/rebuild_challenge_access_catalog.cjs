const fs=require('node:fs');
const path=require('node:path');

const base=path.resolve(__dirname,'..');
const diagnosis=require('../challenge/diagnosis-core.js');
const fixed=[
  {key:'challenge-concept-1',label:'개념 교재 1권',kind:'concept',round:1},
  {key:'challenge-concept-2',label:'개념 교재 2권',kind:'concept',round:2},
  {key:'challenge-mock-1',label:'모의고사 1회',kind:'mock',round:1},
  {key:'challenge-mock-2',label:'모의고사 2회',kind:'mock',round:2},
  {key:'challenge-mock-3',label:'모의고사 3회',kind:'mock',round:3},
  {key:'challenge-mock-4',label:'모의고사 4회',kind:'mock',round:4}
];
const bank=[];
for(let round=1;round<=4;round++){
  const described=diagnosis.describeRound(round);
  for(const question of [...described.questions,...described.extra])bank.push({
    key:'challenge-bank-'+question.typeId,
    typeId:question.typeId,
    label:question.taxonomy.typeLabel,
    area:question.taxonomy.areaLabel,
    round,
    section:question.section,
    number:question.number,
    kind:'bank'
  });
}
const entries=[...fixed,...bank];
if(entries.length!==110||new Set(entries.map(entry=>entry.key)).size!==110)throw Error('승인 키 110개를 고유하게 만들지 못했습니다.');

const catalog=`(function(root){'use strict';\n const entries=${JSON.stringify(entries,null,1)};\n const byKey=new Map(entries.map(e=>[e.key,e]));\n const api={version:'challenge-access-v1',parent:'hyperfocus',child:'challenge',list:()=>entries.map(e=>({...e})),has:key=>byKey.has(key),get:key=>byKey.has(key)?{...byKey.get(key)}:null};\n root.HFChallengeAccessCatalog=Object.freeze(api);if(typeof module!=='undefined')module.exports=api;\n})(typeof window!=='undefined'?window:globalThis);\n`;
fs.writeFileSync(path.join(base,'challenge/access-catalog.js'),catalog);

const sqlHeader='-- Additive catalog only. No student grants/revocations and no changes to existing RLS/RPC.\n-- Parent: Hyper Focus. Child: Challenge. Fixed source type IDs; no wildcard grant.\n';
const sqlRows=entries.map(entry=>`('${entry.key.replaceAll("'","''")}','${entry.label.replaceAll("'","''")}','Hyper Focus > 챌린지 대비 / ${entry.kind}')`).join(',\n');
fs.writeFileSync(path.join(base,'supabase/migrations/20260908222618_challenge_permission_catalog.sql'),`${sqlHeader}insert into public.hf_permission_catalog(permission_key,label,description) values\n${sqlRows}\non conflict (permission_key) do update set label=excluded.label,description=excluded.description,is_active=true;\n`);

const edgePath=path.join(base,'supabase/functions/challenge-access/index.ts');
const edge=fs.readFileSync(edgePath,'utf8');
const keys=entries.map(entry=>' '+JSON.stringify(entry.key)).join(',\n');
const permissionKeyPattern=/const PERMISSION_KEYS = new Set\(\[\n[\s\S]*?\n\]\);/;
if(!permissionKeyPattern.test(edge))throw Error('서버 승인 키 목록을 찾지 못했습니다.');
const next=edge.replace(permissionKeyPattern,`const PERMISSION_KEYS = new Set([\n${keys}\n]);`);
fs.writeFileSync(edgePath,next);
console.log(JSON.stringify({entries:entries.length,bank:bank.length}));
