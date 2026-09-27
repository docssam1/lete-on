import assert from 'node:assert/strict';
import test from 'node:test';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {dirname,join} from 'node:path';

const here=dirname(fileURLToPath(import.meta.url));

test('문제은행 감사가 보조 모듈과 충돌하지 않고 전체 단원을 검사한다',()=>{
 const output=execFileSync(process.execPath,[join(here,'audit.mjs')],{
  cwd:join(here,'..','..'),
  encoding:'utf8'
 });
 for(const expected of [
  's41-u01 자석의 이용: 26문항',
  's41-u02 물의 상태 변화: 14문항',
  's41-u03 땅의 변화: 18문항',
  's42-u01 식물의 생활: 12문항',
  's41-u01 유사문항: 80개',
  's41-u02 유사문항: 80개',
  's41-u03 유사문항: 80개',
  's42-u01 유사문항: 70개'
 ]) assert(output.includes(expected),`감사 출력 누락: ${expected}`);
 assert.equal((output.match(/\.json = .*\.taxonomy\.js/g)||[]).length,4,'분류 체계 JSON 4개가 원본과 동기화되어야 한다');
 assert.match(output,/통과\s*$/);
 assert(!output.includes('TypeError'));
});
