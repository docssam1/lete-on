import assert from 'node:assert/strict';
import test from 'node:test';
import { bankLabel, groupLabel, examHeading, sourceCaption, sourceTableHtml, sourcePartHtml } from './source-presentation.js';
import fs from 'node:fs';
import vm from 'node:vm';
import { source } from '../data/units/s31-u04.source.js';
import { BANK } from './units-index.js';

test('교재 원문은 내부 묶음을 인쇄 세트로 부르지 않고 실제 쪽수·번호를 표시한다', () => {
  const q = source.find((x) => x.sourceRef.set === 2 && x.sourceRef.no === 13);
  assert.equal(sourceCaption(q.sourceRef), '교재 문항 · 39쪽 1(1)번');
  assert.equal(bankLabel(BANK['s31-u04']), '교재 문항');
  assert.equal(groupLabel(BANK['s31-u04'], 2), '곤충의 한살이');
  assert.equal(examHeading(BANK['s31-u04'], 2), '교재 문항 · 곤충의 한살이');
  assert.equal(examHeading(BANK['s31-u03'], 2), '단원평가 세트2');
  assert.equal(sourceCaption({ set: 2, no: 4 }), '단원평가 세트2 · 4번');
});

test('실제 실험 표는 열 제목과 행을 보존하여 렌더링한다', () => {
  for (const q of source) for (const value of Object.values(q.givens || {})) {
    if (!value?.머리) continue;
    const html = sourceTableHtml(value);
    assert.equal((html.match(/<th /g) || []).length, value.머리.length, q.id);
    assert.equal((html.match(/<td>/g) || []).length, value.행.length * value.머리.length, q.id);
    for (const row of value.행) for (const cell of row) assert(html.includes(String(cell)));
    assert(!html.includes('[object Object]'));
  }
});

test('표의 내용은 HTML이 아닌 글자로 표시하고 기존 다른 지문은 건드리지 않는다', () => {
  const html = sourceTableHtml({ 머리: ['<script>'], 행: [['<img onerror="1">']] });
  assert(!html.includes('<script>'));
  assert(!html.includes('<img'));
  assert(html.includes('&lt;script&gt;'));
  const captioned = sourceTableHtml({caption:'가상 자료 <img>',머리:['시료'],행:[['가']]});
  assert(captioned.includes('<caption>가상 자료 &lt;img&gt;</caption>'));
  assert(!html.includes('<caption>'));
  assert.equal(sourceTableHtml({ 구분: ['가', '나'] }), '');
  assert.equal(sourceTableHtml(['가', '나']), '');
});

test('linked authored parts keep their numbers and text while source exams, tables and unrelated lists keep their original renderer',()=>{
 const q={status:'authored',sourceRef:{type:'authored-supplement'},workbookRef:{id:'reviewed'}},parts=['(1) <img onerror="1">','(2) 10 ℃ / 20 ℃'],copy=structuredClone(parts);
 const html=sourcePartHtml(q,'문항',parts);
 assert.equal((html.match(/<li>/g)||[]).length,2);assert(html.includes('(1) &lt;img'));assert(!html.includes('<img'));assert(html.includes('(2) 10 ℃ / 20 ℃'));assert(html.includes('aria-label="부분별 문제"'));assert.deepEqual(parts,copy);
 assert.equal(sourcePartHtml({...q,sourceRef:{type:'authored-pair'}},'소문항',parts.join('\n')),html);
 for(const patch of[{status:'review'},{sourceRef:{type:'original'}},{sourceRef:{type:'similar'}},{workbookRef:null}])assert.equal(sourcePartHtml({...q,...patch},'문항',parts),null);
 for(const value of[[parts[0]],['숫자 없는 자료','또 다른 자료'],{머리:['구분'],행:[['가']]},null,42])assert.equal(sourcePartHtml(q,'문항',value),null);
 assert.equal(sourcePartHtml(q,'보기',parts),null);assert.equal(sourcePartHtml(null,'문항',parts),null);
});

test('the actual learning and Daily renderers separate all 89 linked numbered materials without changing inputs, answers or numbering',async()=>{
 const presentation=await import('./source-presentation.js'),content=await import('./source-content.js'),{photoFigureHtml}=await import('./photo-figure.js'),{writtenPracticeHtml}=await import('./written-practice.js'),{seasonAnswerHint}=await import('./season-answer-hint.js'),{withThink}=await import('./think-merge.js'),{revisedTextbookUnits}=await import('./revised-textbook.js');
 const rootUrl=new URL('./v2.js',import.meta.url),code=fs.readFileSync(rootUrl,'utf8'),dailyCode=fs.readFileSync(new URL('./daily.js',import.meta.url),'utf8'),a=code.indexOf('const UNITS = ')+14,b=code.indexOf('\n// 문제은행만',a),loaders=new vm.Script('('+code.slice(a,b).trim().replace(/;$/,'')+')',{importModuleDynamically:s=>import(new URL(s,rootUrl).href)}).runInContext(vm.createContext({withThink})),escape=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
 let count=0;
 for(const unit of revisedTextbookUnits){
  const mod=await loaders[unit](),ctx=vm.createContext({...presentation,...content,photoFigureHtml,writtenPracticeHtml,seasonAnswerHint,FIG:{},MISC:mod.misc,CIRC:['①','②','③','④','⑤'],esc:escape});
  const item=new vm.Script(code.slice(code.indexOf('function blanksHtml('),code.indexOf('let FIG ='))+';itemHtml').runInContext(ctx),given=new vm.Script(dailyCode.slice(dailyCode.indexOf('const givensHtml ='),dailyCode.indexOf('function formatAnswer('))+';givensHtml').runInContext(ctx),fields=new vm.Script(dailyCode.slice(dailyCode.indexOf('function fieldsHtml('),dailyCode.indexOf('const figHtml ='))+';fieldsHtml').runInContext(ctx);
  for(const q of mod.items){
   const expected=Object.entries(q.givens||{}).map(([key,value])=>sourcePartHtml(q,key,value)).filter(Boolean);if(!expected.length)continue;
   count++;const before=structuredClone(q);
   for(const html of[item(q),item(q,{print:true}),given(q)])for(const parts of expected)assert(html.includes(parts),q.id);
   assert(fields(q,null,mod.misc).includes('data-f="text"'),q.id);
   assert(!item(q,{print:true}).includes('class="ans"'));
   assert.deepEqual(q,before);
  }
 }
 assert.equal(count,89);
 const version='20261115-question-part-lines',index=fs.readFileSync(new URL('./index.html',import.meta.url),'utf8'),css=fs.readFileSync(new URL('./v2.css',import.meta.url),'utf8');
 assert(code.includes('source-presentation.js?v='+version));assert(dailyCode.includes('source-presentation.js?v='+version));assert(code.includes('daily.js?v='+version));assert(index.includes('v2.css?v='+version));assert(index.includes('&parts='+version));assert(css.includes('.source-part-list > li'));assert(css.includes('list-style: none'));
});
