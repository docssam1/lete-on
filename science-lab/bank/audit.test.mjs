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
  's42-u01 유사문항: 70개',
  's42-u02 물의 상태 변화: 12문항',
  's42-u02 유사문항: 70개',
  's42-u02 원문: 70개',
  's42-u03 그림자와 거울: 12문항',
  's42-u03 유사문항: 20개',
  's42-u04 화산과 지진: 12문항',
  's42-u04 유사문항: 20개',
  's42-u05 물의 여행: 12문항',
  's42-u05 유사문항: 20개',
  's51-u01 과학자는 어떻게 탐구할까요: 12문항',
  's51-u01 유사문항: 20개',
  's51-u02 온도와 열: 12문항',
  's51-u02 유사문항: 20개',
  's51-u03 태양계와 별: 12문항',
  's51-u03 유사문항: 20개',
  's51-u04 용해와 용액: 12문항',
  's51-u04 유사문항: 20개',
  's51-u05 다양한 생물과 우리 생활: 12문항',
  's51-u05 유사문항: 20개',
  's52-u01 재미있는 나의 탐구: 12문항',
  's52-u01 유사문항: 20개'
 ]) assert(output.includes(expected),`감사 출력 누락: ${expected}`);
 assert.equal((output.match(/\.json = .*\.taxonomy\.js/g)||[]).length,14,'분류 체계 JSON 14개가 원본과 동기화되어야 한다');
 assert.match(output,/통과\s*$/);
 assert(!output.includes('TypeError'));
});
