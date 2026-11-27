import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
import {renderEditorialChapter} from './revised-book-editorial.js';
import {revisedTextbookUnits,revisedTextbookPaper} from './revised-textbook.js';

const label='<b class="ed-warmup-label">워밍업</b> · ';
const missing=new Set(['c22-s32-u04','c22-s42-u04']);
const page=()=>({kind:'opener',section:'시작하기',title:'도입',blocks:[{type:'text',text:'사진을 먼저 살펴요.'},{type:'text',text:'**무엇**이 달라졌나요? <그림>'},{type:'text',text:'어떤 점이 궁금한가요?'}],rail:[]});
const chapter=pages=>({thinkWorkbook:true,unit:'c22-s32-u04',book:'교재',title:'단원',no:1,semester:'3-2',theme:'#2f6b4a',richText:true,questions:[],pages,teacherPages:[]});

test('all 32 actual first pages identify the ungraded warm-up once in student and teacher papers',async()=>{
 for(const unit of revisedTextbookUnits){
  const {workbook}=await import(`../data/book/${unit}.workbook.js`),saved=structuredClone(workbook),paper=await revisedTextbookPaper(unit);
  for(const mode of ['student','teacher','answers','quick']){
   const html=paper.workbookPaper({mode}),count=html.split(label).length-1;
   assert.equal(count,missing.has(unit)&&['student','teacher'].includes(mode)?1:0,unit+' '+mode);
   if(mode==='student'||mode==='teacher'){
    const first=html.indexOf('<section class="bk-page '),next=html.indexOf('<section class="bk-page ',first+1),opening=html.slice(first,next<0?undefined:next);
    assert.equal((opening.match(/>워밍업</g)||[]).length,1,unit+' '+mode+' visible opening label');
   }
   if(mode==='student')assert(!/class="ed-key"|class="ed-solution"/.test(html));
  }
  assert.deepEqual(workbook,saved);
 }
});

test('only the first ungraded opening question is labelled without changing content, rich text or writing space',()=>{
 for(const verticalFlow of [false,true])for(const teacher of [false,true])for(const live of [false,true]){
  const first=page(),ch={...chapter([first,page()]),verticalFlow,teacherStudentPages:[first,page()]},saved=structuredClone(ch),html=renderEditorialChapter(ch,{}, {teacher,live});
  assert.equal(html.split(label).length-1,1);assert(html.includes(label+'<strong class="ed-term">무엇</strong>이 달라졌나요? &lt;그림&gt;'));
  assert.equal(html.replace(label,''),renderEditorialChapter({...ch,thinkWorkbook:false},{},{teacher,live}));assert.deepEqual(ch,saved);
 }
 const shared=page().blocks[1],first={...page(),blocks:[shared,shared]};assert.equal(renderEditorialChapter(chapter([first]),{}).split(label).length-1,1);
 for(const blocks of [
  [...page().blocks,{type:'field',title:'워밍업',lines:3}],
  [{type:'heading',text:'워밍업'},...page().blocks],
  [...page().blocks,{type:'questions',ids:[]}],
  [...page().blocks,{type:'solutions',ids:[]}],
  [{type:'text',text:'질문이 없는 단원 안내예요.'}],
 ])assert(!renderEditorialChapter(chapter([{...page(),blocks}]),{}).includes(label));
 for(const ch of [{...chapter([page()]),unit:'s42-u01'},{...chapter([page()]),thinkWorkbook:false},chapter([{...page(),kind:'learn'}]),chapter([{kind:'duplex-blank'},page()])])assert(!renderEditorialChapter(ch,{}).includes(label));
});

test('actual web and print entry modules select the current renderer when an older renderer URL is cached',async()=>{
 const {workbook}=await import('../data/book/c22-s32-u04.workbook.js'),{art}=await import('../data/book/c22-s32-u04.workbook-art.js');
 for(const file of ['book.js','revised-workbook-paper.js']){
  const url=new URL('./'+file,import.meta.url),source=await readFile(url,'utf8'),context=vm.createContext({});let staleReads=0;
  async function synthetic(namespace){const module=new vm.SyntheticModule(Object.keys(namespace),function(){for(const [key,value]of Object.entries(namespace))this.setExport(key,value);},{context});await module.link(()=>{});return module;}
  const module=new vm.SourceTextModule(source,{context,identifier:url.href});
  await module.link(async spec=>{
   if(spec==='./revised-book-editorial.js?v=20261108-elementary-task-language'){staleReads++;return synthetic({renderEditorialChapter:()=>'<p>stale renderer</p>'});}
   return synthetic({...await import(new URL(spec,url).href)});
  });await module.evaluate();assert.equal(staleReads,0,file);
  const html=file==='book.js'?module.namespace.renderChapter({...chapter(workbook.pages),...workbook,thinkWorkbook:true,revisedCurriculumWorkbook:true,teacherPages:[]},{...art,...workbook.figures},[],{live:true}):module.namespace.makeWorkbookPaper(workbook,art).workbookPaper({mode:'student'});
  assert(html.includes(label),file);assert(!html.includes('stale renderer'));
 }
});
