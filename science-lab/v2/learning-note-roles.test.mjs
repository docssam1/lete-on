import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {revisedTextbookUnits,revisedTextbookPaper} from './revised-textbook.js';
import {THINKING_BOOK,isCurrentLearningUnit,learningBookName,withLearningIdentity,teacherProblemPages,learningNoteRole} from './revised-learning-book.js';
import {renderEditorialChapter} from './revised-book-editorial.js';
const roles={'핵심 정리':'summary','더 알아보기':'extension','내가 정리할 것':'personal','지도 메모':'teacher'};
const notes=html=>[...html.matchAll(/<section class="ed-note(?: ed-teacher-note)?"(?: data-note-role="([^"]+)")?><h3>(.*?)<\/h3>/g)].map(m=>({role:m[1]||'',title:m[2]}));

test('the learning identity and note-role policy cover every one of the 32 current workbooks',()=>{
 assert.equal(revisedTextbookUnits.size,32);
 for(const unit of revisedTextbookUnits){
  assert(isCurrentLearningUnit(unit),unit);assert.equal(learningBookName(unit,'old label'),THINKING_BOOK);
  const old={chapter:{thinkWorkbook:true,book:'old label',unit}},next=withLearningIdentity(old,unit);assert.equal(next.chapter.book,THINKING_BOOK);assert.equal(old.chapter.book,'old label');
  for(const[title,role]of Object.entries(roles))assert.equal(learningNoteRole(old.chapter,title),role);for(const title of ['constructor','toString','__proto__','extra'])assert.equal(learningNoteRole(old.chapter,title),'other');
 }
 for(const unit of ['c22-s62-u01','c22-s62-u02','c22-s62-u03','c22-s62-u04']){
  const pages=[{layout:'same'}],before=structuredClone(pages),prepared=teacherProblemPages(pages,null,unit);assert.equal(prepared.length,2);assert.deepEqual(prepared[1],{kind:'duplex-blank',layout:'same'});assert.deepEqual(pages,before);assert.equal(teacherProblemPages(prepared,prepared,unit),prepared);
 }
 const legacy={chapter:{thinkWorkbook:true,book:'legacy',unit:'s42-u01'}};assert.equal(withLearningIdentity(legacy,'s42-u01'),legacy);assert.equal(learningBookName('s42-u01','legacy'),'legacy');assert.equal(learningNoteRole(legacy.chapter,'지도 메모'),'');
});

test('actual student, teacher, answers and quick HTML consistently distinguish personal and teacher notes',async()=>{
 let papers=0,personalTeacherNotes=0,teacherNotes=0;
 for(const unit of revisedTextbookUnits){
  const paper=await revisedTextbookPaper(unit);
  for(const mode of ['student','teacher','answers','quick']){
   const html=paper.workbookPaper({mode}),list=notes(html);assert(list.length>0,unit+' '+mode);papers++;
   for(const note of list)assert.equal(note.role,roles[note.title]||'other',unit+' '+mode+' '+note.title);
   if(mode==='teacher'){personalTeacherNotes+=list.filter(n=>n.role==='personal').length;teacherNotes+=list.filter(n=>n.role==='teacher').length;}
   if(mode==='student')assert(!list.some(n=>n.role==='teacher'));
  }
 }
 assert.equal(papers,128);assert(personalTeacherNotes>0);assert(teacherNotes>0);
});

test('an extra note or appended teacher memo cannot take the personal heading typeface; legacy markup stays unmarked',()=>{
 const page={kind:'concept',section:'same',title:'same',blocks:[{type:'text',text:'unchanged body'}],rail:[{title:'핵심 정리',text:'core'},{title:'더 알아보기',text:'extension'},{title:'내가 정리할 것',write:3},{title:'추가 힌트',text:'extra'}],teacherNote:'teacher body'};
 const chapter={thinkWorkbook:true,unit:'c22-s62-u03',book:THINKING_BOOK,no:1,title:'same',semester:'6-2',theme:'#2f6b4a',questions:[],teacherPages:[],pages:[page]},before=structuredClone(chapter);
 assert.deepEqual(notes(renderEditorialChapter(chapter,{}, {teacher:true})).map(n=>n.role),['summary','extension','personal','other','teacher']);
 assert.deepEqual(notes(renderEditorialChapter(chapter,{}, {teacher:false})).map(n=>n.role),['summary','extension','personal','other']);assert.deepEqual(chapter,before);
 const legacy=renderEditorialChapter({...chapter,unit:'s42-u01'}, {},{teacher:true});assert(!legacy.includes('data-note-role='));assert(legacy.includes('teacher body'));
 // These are declared CSS policies, not a claim that browser layout has been exercised.
 const css=fs.readFileSync(new URL('./revised-workbook.css',import.meta.url),'utf8'),normal='.bk-editorial.revised-workbook[data-unit] .ed-note[data-note-role] h3{font-family:var(--ed-reading)',personal='.bk-editorial.revised-workbook[data-unit] .ed-note[data-note-role="personal"] h3{font-family:var(--ed-hand)';assert(css.includes(normal));assert(css.includes(personal));assert(css.indexOf(normal)>css.indexOf('.ed-note:last-child h3'));assert(css.indexOf(personal)>css.indexOf(normal));
});
