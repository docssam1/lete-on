import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {source} from '../data/units/s32-u04.source.js';
import {similar} from '../data/units/s32-u04.similar.js';
import {judge} from '../data/units/s32-u04.judge.js';
import {taxonomy} from '../data/units/s32-u04.taxonomy.js';
import {unit} from '../data/units/s32-u04.js';
import {judgeText} from '../v2/judge.js';

test('물질의 상태 원문70개는 공식 정답과 원래 출처·단원 ID를 보존한다',()=>{
 const expected=[
  ['ㄷ','①','⑤','②, ⑤','ㄴ','⑤','ㄴ','③','ㄴ','ㄱ-나, ㄴ-가','ㄷ','ㄱ','⑤','⑤'],
  ['②','③','⑤',null,'③','②','㉠-액체, ㉡-고체','④, ⑤','ㄹ','ㄱ','④','기체','⑤','무게','④'],
  ['물','ㄴ','ㄷ','③','ㄴ','ㅁ','③','ㄱ','⑤','ㄴ','ㄹ','⑤',null,null,'③','기체','ㄱ','㉠-기체, ㉡-무게','ㄷ','공기'],
  ['공기','ㄱ','③','①, ③','①','③','⑤','②','③','⑤','ㄴ','ㄴ','⑤','공기','②, ⑤','④','ㄷ','④','④','㉠-고체, ㉡-기체'],
 ];
 assert.equal(source.length,70);assert.equal(unit.id,'s32-u04');assert.equal(unit.title,'물질의 상태');
 for(const set of[1,2,3,4]){
  const raw=JSON.parse(readFileSync(new URL(`./work/s32u04/set${set}.json`,import.meta.url)));
  for(const r of raw){const q=source.find(q=>q.sourceRef.set===set&&q.sourceRef.no===r.no);assert(q);assert.equal(q.prompt,r.prompt);assert.deepEqual(q.givens,r.givens??null);assert.equal(q.sourceRef.unit,'Ⅳ. 물질의 상태');assert.equal(q.sourceRef.page,r.page);
   assert.deepEqual(q.choices,r.choices?r.choices.map(c=>c.replace(/^[①②③④⑤]\s*/,'')):null);
   const official=expected[set-1][r.no-1];if(official!==null&&official!==undefined)assert.equal(r.answer,official);
   if(q.responseContract==='written-explanation'){assert.equal(q.answerContract.sample,r.answer);assert.equal(q.answerContract.rubric.required.length,1);}
  }
 }
 assert.deepEqual(taxonomy.standards.map(s=>s.code),['4과05-02']);
 assert(taxonomy.standardsNote.includes('부분 대응'));
});

test('70개 짝은 중복 없이 유지하고 보기 위치·길이의 정답 단서를 줄인다',()=>{
 assert.equal(similar.length,70);assert.equal(new Set(similar.map(q=>q.id)).size,70);
 for(const q of source){assert.equal(similar.filter(s=>s.sourceRef.of.set===q.sourceRef.set&&s.sourceRef.of.no===q.sourceRef.no).length,1);}
 const singles=similar.filter(q=>q.responseContract==='single-choice'),pos=Array(5).fill(0);
 for(const q of singles){const a=q.answerContract.answer;pos[a]++;for(const strip of[false,true]){const l=q.choices.map(c=>(strip?c.replace(/\s/g,''):c).length);assert(l[a]<Math.max(...l.filter((_,i)=>i!==a))+3,q.id);}}
 assert.deepEqual(pos,[6,6,6,6,6]);
 assert(singles.some((q,i)=>i&&q.answerContract.answer!==i%5));
});

test('공식 한 줄은 한 기준으로 결과·까닭·기호 수정을 함께 확인한다',()=>{
 const written=[...source,...similar].filter(q=>q.responseContract==='written-explanation');assert.equal(written.length,8);
 for(const q of written){const j=judge[q.id];assert.equal(j.need.length,1);assert.equal(q.answerContract.rubric.required.length,1);
  for(const tries of[1,2]){assert.equal(judgeText(q.answerContract.sample,j,{tries}).st,'ok',q.id);for(const a of j.ex.ok)assert.equal(judgeText(a,j,{tries}).st,'ok',q.id+' '+a);for(const a of j.ex.no)assert.notEqual(judgeText(a,j,{tries}).st,'ok',q.id+' '+a);}
 }
 const correction=source.find(q=>q.sourceRef.set===2&&q.sourceRef.no===4);
 assert.notEqual(judgeText('㉢, 부피는 변하지 않습니다.',judge[correction.id]).st,'ok');
 assert.notEqual(judgeText('㉤, 부피가 그대로가 아닙니다.',judge[correction.id]).st,'ok');
 const cap=source.find(q=>q.sourceRef.set===3&&q.sourceRef.no===13);
 assert.notEqual(judgeText('뚜껑은 아래로 내려가요.',judge[cap.id]).st,'ok');
});
