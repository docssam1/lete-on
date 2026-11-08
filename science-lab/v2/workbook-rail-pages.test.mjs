import test from 'node:test';
import {withGrade3StudyNotes} from '../data/book/grade3-study-notes.js';
import assert from 'node:assert/strict';
import {withMatchedWorkbookRails} from '../data/book/workbook-rail-pages.js';
import {workbook as materials} from '../data/book/c22-s32-u01.workbook.js';
import {workbook as magnets} from '../data/book/s41-u01.workbook.js';
import {workbook as earthSea} from '../data/book/c22-s32-u02.workbook.js';
import {workbook as solution} from '../data/book/c22-s51-u03.workbook.js';
import {MATERIAL_RAIL_NOTES} from '../data/book/c22-s32-u01.rail-notes.js';
import {MAGNET_RAIL_NOTES} from '../data/book/s41-u01.rail-notes.js';
import {EARTH_SEA_RAIL_NOTES} from '../data/book/c22-s32-u02.rail-notes.js';
import {SOLUTION_RAIL_NOTES} from '../data/book/c22-s51-u03.rail-notes.js';

const rail=()=>[{title:'정리할 것',text:'원래 핵심'},{title:'더 알아보기',text:'원래 설명'},{title:'내 말로 정리',text:'원래 활동',write:3}];
const page=ids=>({section:'같은 절',title:'같은 표제',blocks:[{type:'questions',ids}],rail:rail()});
const rows=[['핵심A','확장A','정리A'],['핵심B','확장B','정리B']];
const fixture=()=>({unit:'fixture',questions:[{id:'a'},{id:'b'},{id:'c'}],pages:[page(['a','b']),page(['c'])],teacherStudentPages:[page(['a']),{...page(['b']),title:'같은 표제 · 이어서'},{kind:'duplex-blank'},page(['c'])]});

test('교사 이어지는 쪽은 문항ID로 원래 내용을 찾고 양면 빈쪽·입력·쓰기 공간을 보존한다',()=>{
 const input=fixture(),before=structuredClone(input),result=withMatchedWorkbookRails(input,rows);
 assert.deepEqual(input,before);assert.equal(result.questions,input.questions);
 assert.equal(result.teacherStudentPages.length,4);assert.equal(result.teacherStudentPages[2],input.teacherStudentPages[2]);
 for(const [teacher,student]of [[0,0],[1,0],[3,1]])assert.deepEqual(result.teacherStudentPages[teacher].rail,result.pages[student].rail);
 assert.deepEqual(result.teacherStudentPages[3].rail.map(r=>r.text),rows[1]);
 for(let i=0;i<4;i++)if(i!==2){assert.equal(result.teacherStudentPages[i].blocks,input.teacherStudentPages[i].blocks);assert.equal(result.teacherStudentPages[i].rail[2].write,3);}
 assert.deepEqual(result.pages[0].rail.map(r=>r.title),['핵심 정리','더 알아보기','내가 정리할 것']);
});

test('실제 네 교재의 다른 학생·교사 쪽 수와 이어지는 문항 배치를 유지한다',()=>{
 for(const [wb,studentCount,teacherCount,questionCount,pairs,notes]of [[materials,51,54,80,[[16,17],[23,25]],MATERIAL_RAIL_NOTES],[magnets,57,58,80,[[34,35]],MAGNET_RAIL_NOTES],[earthSea,52,56,80,[[22,23],[23,25],[34,37]],EARTH_SEA_RAIL_NOTES],[solution,75,75,96,[],SOLUTION_RAIL_NOTES]]){
  assert.equal(wb.pages.length,studentCount);assert.equal(wb.teacherStudentPages.length,teacherCount);
  // Keep the reviewed rail resource and its explicit elementary-language overlay connected.
  const fromReviewedResource={...wb,pages:wb.pages.map((page,i)=>({...page,rail:page.rail.map((note,j)=>({...note,text:notes[i][j]}))}))};
  assert.deepEqual(wb.pages.map(p=>p.rail.map(r=>r.text)),withGrade3StudyNotes(fromReviewedResource).pages.map(p=>p.rail.map(r=>r.text)));
  const studentIds=wb.pages.flatMap(p=>p.blocks.flatMap(b=>b.type==='questions'?b.ids:[]));
  const teacherIds=wb.teacherStudentPages.flatMap(p=>(p.blocks||[]).flatMap(b=>b.type==='questions'?b.ids:[]));
  assert.deepEqual(teacherIds,studentIds);assert.equal(new Set(teacherIds).size,questionCount);
  for(const [student,teacher]of pairs){assert(wb.teacherStudentPages[teacher-1].title.endsWith('· 이어서'));assert.deepEqual(wb.teacherStudentPages[teacher-1].rail,wb.pages[student-1].rail);}
 }
 assert.deepEqual(materials.teacherStudentPages.at(-1),{kind:'duplex-blank',blocks:[],rail:[]});
 assert.deepEqual(earthSea.teacherStudentPages.at(-1),{kind:'duplex-blank',blocks:[],rail:[]});
});

test('기준이 없는 문항·서로 섞인 내용·표제 불일치·모호한 본문 연결은 거부한다',()=>{
 const unknown=fixture();unknown.teacherStudentPages[0].blocks[0].ids=['missing'];assert.throws(()=>withMatchedWorkbookRails(unknown,rows),/기준 쪽/);
 const mixed=fixture();mixed.teacherStudentPages[0].blocks[0].ids=['a','c'];assert.throws(()=>withMatchedWorkbookRails(mixed,rows),/섞였습니다/);
 const wrongTitle=fixture();wrongTitle.teacherStudentPages[0].title='다른 표제';assert.throws(()=>withMatchedWorkbookRails(wrongTitle,rows),/표제/);
 const ambiguous=fixture();ambiguous.teacherStudentPages[0].blocks=[];assert.throws(()=>withMatchedWorkbookRails(ambiguous,rows),/하나로/);
 const duplicate=fixture();duplicate.pages[1].blocks[0].ids=['a'];assert.throws(()=>withMatchedWorkbookRails(duplicate,rows),/겹칩니다/);
 assert.throws(()=>withMatchedWorkbookRails(fixture(),rows.slice(1)),/묶음 수/);
});
