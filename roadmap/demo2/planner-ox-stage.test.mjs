import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
function load(){
 let removed=0,attached=0,reads=0;
 const leaf={hidden:false};
 const dock={open:true,isConnected:false,querySelector:()=>leaf,addEventListener(){},remove(){removed++;this.isConnected=false;}};
 const document={createElement:()=>dock,querySelectorAll:()=>[],getElementById:()=>null,addEventListener(){}};
 const window={PlannerAssessmentPlanner:{read:async()=>{reads++;return[];}},PlannerWeeklyModel:{today:()=> '2026-11-10'},addEventListener(){}};
 vm.runInNewContext(readFileSync(new URL('planner-ox-planner.js',import.meta.url),'utf8'),{window,document});
 const host={querySelector:()=>({nextElementSibling:null,after(){attached++;}})};
 return {api:window.PlannerOxPlanner,host,dock,counts:()=>({removed,attached,reads})};
}
test('automatic elementary assessment follows studied course, not age or school grade',()=>{
 const {api}=load();
 assert.equal(api.isElementary({actual:{stage:'3-2'},grade:10}),true);
 for(const stage of ['중1-1','공통수학2','대수','미적분Ⅰ','',undefined])assert.equal(api.isElementary({actual:{stage},grade:3}),false);
 assert.equal(api.isElementary({}),false);
});
test('a high-school course removes the automatic panel without reading or deleting saved results',()=>{
 const {api,host,dock,counts}=load();
 api.mount(host,{context:{actual:{stage:'대수'},answers:{schoolCourse:'high'}}});
 assert.equal(dock.open,false);assert.deepEqual(counts(),{removed:1,attached:0,reads:0});
 api.mount(host,{context:{actual:{stage:'4-1'}}});
 assert.equal(counts().attached,1);
});
test('elementary assessment is not injected into intake questions before the course is known',()=>{
 const html=readFileSync(new URL('planner.html',import.meta.url),'utf8');
 const actions=html.match(/<div class="question-actions">[\s\S]*?<\/div>/)?.[0];
 assert.ok(actions);assert.doesNotMatch(actions,/data-ox-open/);
});
