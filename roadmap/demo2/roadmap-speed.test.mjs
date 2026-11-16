import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const S=createRequire(import.meta.url)('./roadmap-speed.js');
test('device diagnostics retain only allowed timings and discard private fields, corrupt and expired data',()=>{
 const d=S.restore(JSON.stringify({version:'20261116-mobile1',startedAt:1000,steps:{login_start:1100,login_verified:1400,token:'secret',email:'parent@example.com'},interrupted:{},member:{name:'private'}}),2000);
 assert.deepEqual(d.steps,{login_start:1100,login_verified:1400});assert.equal(JSON.stringify(d).includes('private'),false);assert.deepEqual(d.interrupted,[]);
 assert.deepEqual(S.restore('{',2000).steps,{});assert.deepEqual(S.restore(JSON.stringify(d),1900000).steps,{});
});
test('active processing durations exclude reading gaps and count overlapping saved-plan transitions once',()=>{
 const d={steps:{login_start:0,login_verified:200,planner_navigation:300,input_ready:900,roadmap_start:8000,roadmap_ready:9000,study_start:8000,study_ready:9500},interrupted:[]};
 assert.deepEqual(S.measurements(d).map(r=>r.ms),[200,600,1000,1500]);assert.match(S.summary(d,'Android'),/2\.30초/);
 const missing=S.measurements({steps:{login_start:100},interrupted:[]});assert.equal(missing[0].ms,null);assert.equal(missing[1].status,'미측정');
});
test('a backgrounded phone never reports the inflated phase as a completed measurement',()=>{
 const d={steps:{roadmap_start:10,roadmap_ready:60000},interrupted:['roadmap_start']};assert.equal(S.measurements(d)[2].ms,null);assert.match(S.summary(d,'Android'),/다른 앱으로 이동/);assert.doesNotMatch(S.summary(d,'Android'),/59\.99초/);
});
test('ordinary visits never mount diagnostics or access its storage',()=>{
 const g={get sessionStorage(){assert.fail('ordinary visit accessed diagnostic storage');}};assert.equal(S.mount(g),undefined);
});
