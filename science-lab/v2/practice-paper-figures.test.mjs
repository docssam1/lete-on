import test from'node:test';import assert from'node:assert/strict';import fs from'node:fs';import vm from'node:vm';import{createHash}from'node:crypto';
import{withThink}from'./think-merge.js';import{BANK}from'./units-index.js';import{practicePaperHtml,practiceAnswer}from'./practice-paper.js';
const appUrl=new URL('./v2.js',import.meta.url),code=fs.readFileSync(appUrl,'utf8'),a=code.indexOf('const UNITS = ')+14,b=code.indexOf('\n// 문제은행만',a),loaders=new vm.Script('('+code.slice(a,b).trim().replace(/;$/,'')+')',{importModuleDynamically:s=>import(new URL(s,appUrl).href)}).runInContext(vm.createContext({withThink})),unit='c22-s32-u02',mod=await loaders[unit](),ids=[unit+'-b20',unit+'-b24'],photos=mod.items.filter(q=>ids.includes(q.id)),pageSource=code.slice(code.indexOf('function pageBook('),code.indexOf('// GFIELD 실험 과학 영재')),esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function page(renderer,name=unit,data=mod){const ctx=vm.createContext({BANK,practicePaperHtml:renderer,BOOKX:data,$app:{innerHTML:''},esc,store:{get(){throw Error('unexpected stored answer read');},set(){throw Error('unexpected stored answer write');}}}),render=new vm.Script(pageSource+';pageBook').runInContext(ctx);return mode=>{render(name,data.lesson,data.items,mode);return ctx.$app.innerHTML;};}

test('the actual fallback question-paper path prints both Earth photographs in student and teacher editions',()=>{
 assert.equal(mod.bankPaper,undefined);assert(BANK[unit]?.sourcePending||!mod.lesson.explain);assert.equal(photos.length,2);
 const before=structuredClone(mod.items),render=page(practicePaperHtml);
 for(const mode of['student','teacher']){
  const html=render(mode);assert.equal((html.match(/earth-apollo17-nasa\.jpg/g)||[]).length,2);
  for(const q of photos){assert(html.includes(q.photoCredit));assert(html.includes(esc(q.prompt)));if(mode==='teacher'){assert(html.includes(esc(q.explanation)));assert(html.includes('정답: '+practiceAnswer(q))||html.includes('예시 답: '+esc(practiceAnswer(q))));}else assert(!html.includes(esc(q.explanation)));}
  if(mode==='student')assert(!html.includes('class="practice-key"'));
  assert(!html.includes('[object Object]'));assert.equal((html.match(/class="practice-table"/g)||[]).length,15);
  for(const q of mod.items)for(const t of Object.values(q.givens||{}).filter(v=>v?.머리&&v?.행))for(const value of [...t.머리,...t.행.flat()])assert(html.includes(esc(value)));
 }
 assert.deepEqual(mod.items,before);
 const fixture=JSON.parse(fs.readFileSync(new URL('./tests/fixtures/practice-paper-before-figures.json',import.meta.url),'utf8')),oldSource=fixture.source;assert.equal(createHash('sha256').update(oldSource).digest('hex'),fixture.sourceSha256);const old=new vm.Script(oldSource.replaceAll('export function ','function ')+';practicePaperHtml').runInContext(vm.createContext({}));
 assert(!page(old)('student').includes('earth-apollo17-nasa.jpg'));assert.equal(render('answers'),page(old)('answers'));
});

test('the common paper preserves structured tables and all labelled observation images without exposing student answers',async()=>{
 const infection=await loaders['c22-s32-u04']();assert.equal(infection.bankPaper,undefined);
 for(const mode of['student','teacher']){const html=page(practicePaperHtml,'c22-s32-u04',infection)(mode);assert(!html.includes('[object Object]'));assert.equal((html.match(/class="practice-table"/g)||[]).length,4);for(const q of infection.items)for(const t of Object.values(q.givens||{}).filter(v=>v?.머리&&v?.행))for(const value of [...t.머리,...t.행.flat()])assert(html.includes(esc(value)));}
 const biology=await loaders['s41-u04'](),q=[...biology.items,...biology.similar].find(q=>q.observationPhotos?.length===3);assert(q);
 const table={...structuredClone(photos[0]),id:'provided-table',givens:{표:{머리:['시각','온도'],행:[['오전 9시','18℃'],['오전 10시','20℃']]},조건:'<표시>를 먼저 확인해요.'}},before=structuredClone([table,q]);
 for(const mode of['student','teacher']){
  const html=practicePaperHtml({unit,title:'제공 자료',items:[table,q],mode});assert(!html.includes('[object Object]'));assert(html.includes('<th>시각</th>')||html.includes('>시각</th>'));assert(html.includes('>18℃</td>'));assert(html.includes('>20℃</td>'));assert(html.includes('&lt;표시&gt;'));
  for(const photo of q.observationPhotos){assert(html.includes('../'+photo.src));assert(html.includes(esc(photo.label)));assert(html.includes(esc(photo.creator)));}
  if(mode==='student'){assert(!html.includes('class="practice-key"'));assert(!html.includes(esc(q.explanation)));}
 }
 assert.deepEqual([table,q],before);const answers=practicePaperHtml({unit,title:'제공 자료',items:[table,q],mode:'answers'});assert(!answers.includes('<img')&&!answers.includes('<table'));
});

test('the app refreshes the real fallback paper module and its image styles together',async()=>{
 const spec=code.match(/import\s*\{\s*practicePaperHtml\s*\}\s*from\s*['"]([^'"]+)['"]/)[1],version='20261115-practice-paper-figures';assert(spec.endsWith('?v='+version));
 const ctx=vm.createContext({}),current=await import(new URL(spec,appUrl).href);let fresh=0;
 const entry=new vm.SourceTextModule('export {practicePaperHtml} from '+JSON.stringify(spec),{context:ctx,identifier:appUrl.href});
 await entry.link(async s=>{assert.equal(s,spec);fresh++;const m=new vm.SyntheticModule(Object.keys(current),function(){for(const[k,v]of Object.entries(current))this.setExport(k,v);},{context:ctx});await m.link(()=>{});return m;});await entry.evaluate();assert.equal(fresh,1);assert(page(entry.namespace.practicePaperHtml)('student').includes('earth-apollo17-nasa.jpg'));
 const index=fs.readFileSync(new URL('./index.html',import.meta.url),'utf8'),css=fs.readFileSync(new URL('./practice-paper.css',import.meta.url),'utf8'),entryVersion=code.match(/revised-textbook\.js\?v=([^'"]+)/)[1];assert(index.includes('practice-paper.css?v='+version));assert(index.includes('&book='+entryVersion));assert(css.includes('max-width: 100%'));assert(css.includes('object-fit: contain'));assert(css.includes('.practice-table { overflow: visible; }'));
});
