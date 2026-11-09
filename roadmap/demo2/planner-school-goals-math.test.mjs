import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';
import assert from 'node:assert/strict';
const window={},ctx=vm.createContext({window});
vm.runInContext(readFileSync(new URL('planner-school-goals.js',import.meta.url),'utf8'),ctx);
test('자사고 고등 교재 안내는 개념·유형 병행과 선택 심화를 구분한다',()=>{
 const text=window.PlannerSchoolGoals.GOALS.private.depth;
 assert.match(text,/기본정석과 쎈으로 개념·유형을 함께/);
 assert.match(text,/RPM은 쎈 대신/);
 assert.match(text,/혼자 풀 수 있는지 확인한 뒤/);
 assert.match(text,/풀이가 불안하면 현재 과목을 먼저 보완/);
 assert.doesNotMatch(text,/이후 실력 정석·쎈/);
});
