import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {assessmentStudentExam,initialExamGroups,renderExamGroups} from './assessment-shared-template.js';
import {layoutWorksheetPages} from '../../fields-classic/question-bank/print-templates.js';
import {unit,items} from '../data/units/c22-s42-fin.js';
const decode=s=>s.replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&');
const model=html=>JSON.parse(decode(html.match(/<template data-exam-model>([\s\S]*?)<\/template>/)[1]));
const ids=html=>[...html.matchAll(/data-paper-item="([^"]+)"/g)].map(x=>x[1]);

test('science uses the existing GFIELD page builder for both column counts and keeps every item in order with usable answer spaces',()=>{
 const saved=structuredClone(items);
 for(const cols of ['1','2']){const html=assessmentStudentExam({unit,items,course:'초등 과학 4-2',scope:unit.assessment.scope,cols}),m=model(html),groups=initialExamGroups(m),per=cols==='2'?4:2;
  const reference=layoutWorksheetPages({cards:items.map(q=>`<b data-paper-item="${q.id}"></b>`),questions:items.map(q=>({type:{id:q.id,middle:'과학',label:'과학'}})),settings:{cover:'none',unit:'none',form:'exam',cols,pageNo:true},info:{title:'과학 평가',footLabel:'GFIELD · 지필드'},book:null}).grid;
  assert.deepEqual(ids(html),ids(reference));assert.equal(groups.length,items.length/per);assert(groups.every(g=>g.length===per));
  assert.deepEqual(groups.flat().map(q=>q.id),items.map(q=>q.id));assert.equal((html.match(/class="score-table"/g)||[]).length,items.length/per);
  assert.equal((html.match(/class="workspace ap-writing"/g)||[]).length,items.filter(q=>q.answerContract.type==='written-explanation').length);
  assert.equal((html.match(/class="answer-line(?: ap-short)?"/g)||[]).length,items.filter(q=>q.answerContract.type!=='written-explanation').length);
  for(const q of m.questions){assert(!('answerContract' in q));assert(!('explanation' in q));assert(!('evidence' in q));assert.equal(q.points,null);}
  assert(!html.includes('class="ap-key"'));assert(!html.includes('class="a42-key"'));assert(html.includes('data-exam-cols="2"'));assert(html.includes('data-exam-page-no'));
 }
 assert.deepEqual(items,saved);
});

test('page splitting preserves numbers, content and teacher-set points without inventing scores or leaking keys',()=>{
 const original=items.slice(0,4).map((q,i)=>({...q,points:i<2?i+2:undefined}));const html=assessmentStudentExam({unit,items:original,course:'과학',cols:'2'}),m=model(html),groups=[[m.questions[0]],[...m.questions.slice(1)]];
 const split=renderExamGroups(m,groups);assert.deepEqual(ids(split),original.map(q=>q.id));assert(split.includes('[2점]'));assert(split.includes('[3점]'));assert(split.includes('[　점]'));assert(split.includes('1 / 2'));assert(split.includes('2 / 2'));
 const malicious=assessmentStudentExam({unit,items:[{...items[0],prompt:'<script>alert(1)</script>',choices:['<img onerror="1">']}],course:'<iframe>',title:'<svg>',scope:['<embed>']});for(const tag of ['<script>','<img','<iframe>','<svg>','<embed>'])assert(!malicious.includes(tag));assert(malicious.includes('&lt;script&gt;'));
 const without=assessmentStudentExam({unit,items:items.slice(0,2),course:'과학',pageNo:false});assert(without.includes('class="pt-pg"></span>'));assert(!without.includes('1 / 1'));
});
