import test from 'node:test';import assert from 'node:assert/strict';import {execFileSync} from 'node:child_process';import {fileURLToPath} from 'node:url';
for(const mode of ['v1','v2'])test(`${mode} 장면 비동기 불러오기는 화면 소유권과 해제·오류·오래된 조작을 구별한다`,()=>{
 const report=JSON.parse(execFileSync(process.execPath,['--experimental-vm-modules',fileURLToPath(new URL('./tests/scene-load-lifecycle.mjs',import.meta.url)),mode],{encoding:'utf8',timeout:15000,stdio:['ignore','pipe','pipe']}));assert.equal(report.mode,mode);assert.equal(report.cases.length,mode==='v1'?7:9);assert.equal(report.browserVerified,false);
});
