import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

test('현행 32단원의 시작·소단원·차례는 사고력 수업으로 연결하고 예전 수업과 준비 중 자료는 구별한다',()=>{
 const report=JSON.parse(execFileSync(process.execPath,['--experimental-vm-modules',fileURLToPath(new URL('./tests/classroom-entry-routes.mjs',import.meta.url))],{encoding:'utf8',timeout:15000,stdio:['ignore','pipe','pipe']}));
 assert.equal(report.currentUnits,32);
 assert(report.subPages>=32);
 assert.equal(report.catalogUnits,32);
 assert(report.legacyRoutesPreserved&&report.unsupportedLessonsHidden);
 assert.equal(report.studentStorageCalls,0);
});
