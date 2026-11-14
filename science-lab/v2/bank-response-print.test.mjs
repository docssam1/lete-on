import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
import {withThink} from './think-merge.js';
import {bankAnswerText,bankPromptHtml,bankResponseTableHtml} from './bank-response-print.js';

const source=await readFile(new URL('./v2.js',import.meta.url),'utf8'),start=source.indexOf('const UNITS = ')+14,end=source.indexOf('\n// 문제은행만',start);
const loaders=new vm.Script('('+source.slice(start,end).trim().replace(/;$/,'')+')',{importModuleDynamically:s=>import(new URL(s,new URL('./v2.js',import.meta.url)).href)}).runInContext(vm.createContext({withThink}));
const units=await Promise.all(['c22-s42-u01','c22-s42-u02','c22-s42-u04','s41-u04'].map(async unit=>({unit,data:await loaders[unit]()})));
const articles=html=>new Map([...html.matchAll(/<article\b[^>]*data-paper-item="([^"]+)"[^>]*>[\s\S]*?<\/article>/g)].map(m=>[m[1],m[0]]));
const escape=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

test('all twenty cloze and table-fill questions have printable response areas and answer keys',()=>{
 let count=0;
 for(const {unit,data}of units){
  const snapshot=JSON.stringify(data.items),student=articles(data.bankPaper({...data,mode:'student'})),teacher=articles(data.bankPaper({...data,mode:'teacher'})),answers=articles(data.bankPaper({...data,mode:'answers'})),quick=data.bankPaper({...data,mode:'quick'});
  const quickEntries=new Map([...quick.matchAll(/<div data-paper-item="([^"]+)">[\s\S]*?<\/div>/g)].map(m=>[m[1],m[0]]));
  for(const q of data.items.filter(q=>['cloze','table-fill'].includes(q.answerContract.type))){
   count++;const ac=q.answerContract,s=student.get(q.id),t=teacher.get(q.id),a=answers.get(q.id),k=quickEntries.get(q.id);assert(s&&t&&a&&k,q.id);
   if(ac.type==='cloze'){
    assert.equal((s.match(/data-bank-blank=/g)||[]).length,ac.blanks.length,q.id+' student blanks');
    assert.equal((t.match(/data-bank-blank=/g)||[]).length,ac.blanks.length,q.id+' teacher blanks');
    assert(!/class="bank-print-blank bank-print-answer"/.test(s));
    for(const b of ac.blanks){assert(t.includes(escape(b.answer)),q.id+' teacher answer');assert(a.includes(escape(b.answer)),q.id+' answer-only key');assert(k.includes(escape(b.answer)),q.id+' quick key');}
   }else{
    assert(s.includes('bank-response-table'),q.id+' student response table');
    const cells=ac.rows.length*ac.columns.length;assert.equal((s.match(/data-bank-response-cell=/g)||[]).length,cells,q.id+' response cells');
    assert(!s.includes('bank-response-answer'));
    for(const row of ac.rows){assert(s.includes(escape(row.label)));assert(k.includes(escape(row.label)));for(const value of row.answer){assert(t.includes(escape(value)));assert(a.includes(escape(value)));assert(k.includes(escape(value)));}}
   }
   assert(!/<input|<select|<textarea/.test(s),q.id+' paper controls');
  }
  assert.equal(JSON.stringify(data.items),snapshot,unit+' input mutation');
 }
 assert.equal(count,20);
});

test('print helpers preserve legacy answer text and escape authored prompts and table cells',()=>{
 for(const [contract,expected]of [[{type:'single-choice',answer:0},'①'],[{type:'multi-choice',answers:[0,2]},'①, ③'],[{type:'short-text',answer:0},0],[{type:'written-explanation',sample:'<text & answer>'},'<text & answer>']])assert.equal(bankAnswerText(contract),expected);
 const cloze={type:'cloze',blanks:[{answer:'<first>'},{answer:'second & third'}]},snapshot=structuredClone(cloze),text='"보기" (①) / ( ② )';
 const student=bankPromptHtml(text,cloze),teacher=bankPromptHtml(text,cloze,{show:true});
 assert(student.includes('&quot;보기&quot;'));assert(!student.includes('&lt;first&gt;'));assert(teacher.includes('&lt;first&gt;'));assert(teacher.includes('second &amp; third'));
 assert.equal(bankPromptHtml(text,cloze,{only:true}),escape(text));assert.deepEqual(cloze,snapshot);
 assert.equal(bankAnswerText(cloze),'① <first> · ② second & third');
 const table={type:'table-fill',rowHead:'<row>',columns:['x','y'],rows:[{label:'<script>',answer:[0,'& value']}]},before=structuredClone(table);
 assert.equal(bankAnswerText(table),'<script>: x 0 / y & value');
 const blank=bankResponseTableHtml(table),filled=bankResponseTableHtml(table,{show:true});
 assert(blank.includes('&lt;script&gt;'));assert(!blank.includes('<script>'));assert(!blank.includes('bank-response-answer'));assert(filled.includes('>0</span>'));assert(filled.includes('&amp; value'));assert.deepEqual(table,before);
 assert.equal(bankResponseTableHtml({type:'short-text',answer:'text'}),'');
});

test('all four biology print modes render reference tables and a genuine quick-answer view',()=>{
 const {data}=units.find(u=>u.unit==='s41-u04'),pool=[...data.source,...data.similar,...data.items];
 for(const mode of ['student','teacher','answers','quick']){
  const html=data.bankPaper({...data,mode});assert(!/\[object Object\]|undefined/.test(html),mode+' invalid material');
  if(mode==='student'||mode==='teacher')for(const id of ['s41-u04-t05','s41-u04-t12']){
   const card=articles(html).get(id),table=data.items.find(q=>q.id===id).givens.결과표;
   assert(card.includes('<table'));assert(card.includes(escape(table.caption)));
  }
  if(mode==='quick'){assert(!html.includes('<article'));assert(!html.includes('<img'));assert.equal((html.match(/data-paper-item=/g)||[]).length,pool.length);}
 }
});
