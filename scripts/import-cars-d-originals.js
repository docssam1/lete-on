#!/usr/bin/env node
'use strict';

/**
 * Import licensed CARS Plus D source passages/questions from a LOCAL private JSON
 * into Supabase lesson_content. The JSON must never be committed to public Git.
 *
 * Input shape:
 * {
 *   "bookId":"cars-level-d",
 *   "lessons": {
 *     "cd1": {"passage":[...], "questions":[...], "meta":{...}},
 *     ...
 *   }
 * }
 *
 * Dry-run by default. Add --apply to upsert after all 15 lessons validate.
 */

const fs=require('fs');
const path=require('path');
const args=process.argv.slice(2);
const apply=args.includes('--apply');
const fileArg=args.find(a=>!a.startsWith('--'));
if(!fileArg){console.error('Usage: node scripts/import-cars-d-originals.js <private-source.json> [--apply]');process.exit(2);}

const SUPABASE_URL=process.env.SUPABASE_URL||'';
const SUPABASE_KEY=process.env.SUPABASE_KEY||process.env.SUPABASE_SERVICE_ROLE_KEY||process.env.SUPABASE_ANON_KEY||'';
if(!SUPABASE_URL||!SUPABASE_KEY){console.error('Missing SUPABASE_URL / SUPABASE_KEY.');process.exit(2);}

const inputPath=path.resolve(fileArg);
let payload;
try{payload=JSON.parse(fs.readFileSync(inputPath,'utf8'));}catch(e){console.error('Could not read private source JSON: '+e.message);process.exit(2);}
const bookId=payload.bookId||'cars-level-d';
const lessons=payload.lessons||{};
const ids=Object.keys(lessons).sort((a,b)=>Number(a.replace(/\D/g,''))-Number(b.replace(/\D/g,'')));

function headers(prefer){const h={apikey:SUPABASE_KEY,Authorization:'Bearer '+SUPABASE_KEY,'Content-Type':'application/json'};if(prefer)h.Prefer=prefer;return h;}
function validateQuestion(q,id,i){if(!Array.isArray(q)||q.length<4)throw new Error(`${id} q${i}: invalid question row`);if(!Array.isArray(q[2])||q[2].length!==4)throw new Error(`${id} q${i}: needs 4 options`);if(!['A','B','C','D'].includes(String(q[3]||'').toUpperCase()))throw new Error(`${id} q${i}: invalid answer`);}
function validateLesson(id,row){if(!Array.isArray(row.passage)||!row.passage.length)throw new Error(`${id}: passage missing`);if(!Array.isArray(row.questions)||row.questions.length!==12)throw new Error(`${id}: needs exactly 12 questions`);row.questions.forEach((q,i)=>validateQuestion(q,id,i+1));if(row.meta!=null&&(typeof row.meta!=='object'||Array.isArray(row.meta)))throw new Error(`${id}: meta must be object`);}
function questionPayload(row){return {items:row.questions,meta:row.meta||{}};}
async function upsert(id,row){const body={book_id:bookId,lesson_id:id,original_passage:row.passage,original_questions:questionPayload(row)};const res=await fetch(`${SUPABASE_URL.replace(/\/$/,'')}/rest/v1/lesson_content`,{method:'POST',headers:headers('resolution=merge-duplicates,return=minimal'),body:JSON.stringify(body)});if(!res.ok)throw new Error(`${id}: upsert failed ${res.status} ${await res.text()}`);}

(async()=>{
  if(ids.length!==15)throw new Error(`Expected 15 lessons, found ${ids.length}`);
  ids.forEach(id=>validateLesson(id,lessons[id]));
  console.log(`Validated ${ids.length} CARS D source lessons. mode=${apply?'APPLY':'DRY-RUN'}`);
  console.log('Private passage/question wording is not printed.');
  if(!apply)return;
  for(const id of ids){await upsert(id,lessons[id]);console.log(`${id}: upserted`);}
  console.log('CARS D original source import complete.');
})().catch(e=>{console.error(e.message||e);process.exit(1);});
