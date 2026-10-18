import assert from 'node:assert/strict';
import {bank} from '../../games/number-paper/core.js';
import {selectionFor,pagePlan,solutionFor,targetCells} from './workbook-core.js';
import {renderPages} from './render.js';
import {translation,languages} from './i18n.js';
let cards=0,rendered=0;
for(const p of bank){
  const board=Array.from({length:4},(_,r)=>Array.from({length:4},(_,c)=>[r*4+c]));
  for(const r of (p.hDir==='up'?[2,3]:[0,1]))for(let c=0;c<4;c++){board[3-r][c].push(...board[r][c]);board[r][c]=[];}
  for(let r=0;r<4;r++)for(const c of (p.vDir==='left'?[2,3]:[0,1])){board[r][3-c].push(...board[r][c]);board[r][c]=[];}
  const removed=p.cells.flatMap(({r,c})=>board[p.packetRow+r][p.packetCol+c]);
  const expected=Array.from({length:16},(_,i)=>i).filter(i=>p.activity==='cut'?removed.includes(i):!removed.includes(i));
  assert.deepEqual(targetCells(p),expected);
  const sol=solutionFor(p),sum=expected.reduce((n,i)=>n+p.grid[Math.floor(i/4)][i%4],0);
  assert.equal(sol.answer,sum);assert.equal(sol.numbers.reduce((a,b)=>a+b,0),sum);
  for(const g of sol.groups){assert.equal(g.terms.reduce((a,b)=>a+b,0),10);for(const [whole,a,b] of g.splits)assert.equal(whole,a+b);}
  assert.equal(sol.groups.length*10+sol.finish.remainder,sum);
  for(const lang of languages){
    const q=renderPages(pagePlan([p],'questions'),[p],translation(lang),'<img onerror="bad">');
    assert(!q.includes('data-answer='));assert(!q.includes('final-equation'));assert(!q.includes('<img onerror'));assert(q.includes('&lt;img'));assert(!q.includes('undefined'));
    const a=renderPages(pagePlan([p],'answers'),[p],translation(lang));assert(a.includes(`data-answer="${sum}"`));assert(!a.includes('NaN'));rendered+=2;
  }
  cards++;
}
const ids=[bank[4].id,bank[2].id,bank[0].id,bank[3].id,bank[1].id];
assert.deepEqual(selectionFor(new URLSearchParams({activity:'cut',ids:ids.join(',')})).entries.map(p=>p.id),ids);
for(const bad of ['',ids[0]+','+ids[0],'unknown'])assert(selectionFor(new URLSearchParams({ids:bad})).error);
const five=bank.slice(0,5);assert.equal(pagePlan(five,'questions').length,3);assert.equal(pagePlan(five,'answers').length,3);
const both=pagePlan(five,'both',true);assert.deepEqual(both.map(p=>p.kind),['questions','questions','questions','blank','answers','answers','answers']);
assert.equal(pagePlan(bank,'quick').length,2);assert.equal(pagePlan(bank,'questions').length,20);assert.equal(pagePlan(bank,'both',true).length,40);
for(const page of pagePlan(bank,'questions'))assert(page.entries.every(p=>p.activity===page.entries[0].activity));
assert.equal(selectionFor(new URLSearchParams({activity:'all',count:'40'})).entries.length,40);
assert.equal(selectionFor(new URLSearchParams({activity:'remain',count:'40'})).entries.length,20);
console.log(JSON.stringify({cards,rendered,selectionOrder:true,independentFoldAndSum:true,questionAnswerSeparation:true,duplex:true,quickAnswers:true},null,2));
