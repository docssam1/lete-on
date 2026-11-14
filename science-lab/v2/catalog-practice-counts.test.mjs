import test from 'node:test';import assert from 'node:assert/strict';import {execFileSync} from 'node:child_process';import {fileURLToPath} from 'node:url';
import {BANK} from './units-index.js';import {curriculumBankHtml} from './bank-catalog.js';
const changed={'c22-s32-u01':76,'c22-s32-u02':92,'c22-s32-u03':76,'c22-s32-u04':92,'s41-u04':76,'c22-s42-u01':92,'c22-s42-u02':92,'c22-s42-u04':120};
test('catalog counts and print labels match all 32 actual current loaders and preserve pending original sources',()=>{
 const result=JSON.parse(execFileSync(process.execPath,['--experimental-vm-modules',fileURLToPath(new URL('./tests/catalog-practice-counts.mjs',import.meta.url))],{encoding:'utf8',timeout:20000,stdio:['ignore','pipe','pipe']}));
 assert.equal(result.productionUnitLoadersExecuted,32);assert.equal(result.sourceCount,1512);assert.equal(result.pending.length,9);assert.equal(result.pendingPracticeCount,1253);assert.equal(result.headerModesChecked,15);assert.equal(result.studentReads+result.studentWrites+result.network,0);
 for(const[unit,count]of Object.entries(changed)){assert.equal(BANK[unit].supplement,count);assert.equal(BANK[unit].lessonSupplement,12);assert.equal(result.units.find(u=>u.unit===unit).practice,count);}
 const html=curriculumBankHtml(BANK);assert(!html.includes('나머지 단원은 차례로 준비하고 있어요.'));const incomplete={...BANK};delete incomplete['c22-s62-u04'];assert(curriculumBankHtml(incomplete).includes('나머지 단원은 차례로 준비하고 있어요.'));assert(html.includes('창작 92 · 원문 준비 중'));assert(html.includes('원문 70 · 짝 70 · 보충 76'));assert(html.includes('별도로 9개 단원의 창작 학습 1253문항'));
});
test('four print summaries derive counts from the provided arrays without changing any questions',async()=>{
 for(const[unit,name,fn]of [['s41-u04','biology','biologyBankPaperHtml'],['c22-s42-u01','sky','skyBankPaperHtml'],['c22-s42-u02','ecology','ecologyBankPaperHtml'],['c22-s42-u04','climate','climateBankPaperHtml']]){
  const raw=await import('../data/units/'+unit+'.js'),{source}=await import('../data/units/'+unit+'.source.js'),{similar}=await import('../data/units/'+unit+'.similar.js'),mod=await import('./'+name+'-bank-paper.js');
  const input={unit:raw.unit,source:source.slice(0,1),similar:similar.slice(0,1),items:raw.items.slice(0,2)},before=structuredClone(input),total=4;
  for(const mode of name==='biology'?['student','teacher','answers']:['student','teacher','answers','quick']){const html=mod[fn]({...input,mode});assert(html.includes('보충2 ='+total+'문항.'));assert.equal((html.match(/data-paper-item=/g)||[]).length,4);}
  assert.deepEqual(input,before);
 }
});
