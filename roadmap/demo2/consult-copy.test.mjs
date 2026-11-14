import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';

test('copy text preserves progress and memo while masking known names and contacts',()=>{
 const window={};
 vm.runInNewContext(readFileSync(new URL('./planner-consult.js',import.meta.url),'utf8'),{window});
 const text=window.RoadmapConsult.consultationText(
  '김하늘 · 중1-1 개념원리 3단원 · 쎈 병행',
  '김하늘은 함수 복습 필요. 010-1234-5678 parent@example.com',['김하늘']);
 assert.match(text,/중1-1 개념원리 3단원 · 쎈 병행/);
 assert.match(text,/함수 복습 필요/);
 assert.match(text,/이번 주 공부와 다음 점검 기준/);
 assert.doesNotMatch(text,/김하늘|010-1234-5678|parent@example.com/);
});

test('copying can include a complete report longer than the API limit',()=>{
 const window={};
 vm.runInNewContext(readFileSync(new URL('./planner-consult.js',import.meta.url),'utf8'),{window});
 const text='가'.repeat(31000)+'마지막 계획';
 const doc={getElementById:()=>({children:[{textContent:text,classList:{contains:()=>false}}]})};
 assert.equal(window.RoadmapConsult.reportText(doc,[],Infinity),text);
 assert.equal(window.RoadmapConsult.reportText(doc,[]).length,30000);
});
