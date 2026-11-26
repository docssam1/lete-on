'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const source=fs.readFileSync(path.join(__dirname,'../public/exam-entry.js'),'utf8');
const between=(a,b)=>source.slice(source.indexOf(a),source.indexOf(b));
const functions=between(' async function library('," $('exam-list').onclick")+between(' async function pastResults('," $('past-results').onclick")+between(' async function restoreRoute('," window.addEventListener('popstate'");
const tick=()=>new Promise(resolve=>setImmediate(resolve));
function harness(){
 const nodes=new Map(),pending=[],events=[];
 const node=id=>{if(!nodes.has(id))nodes.set(id,{innerHTML:'',textContent:'',close(){}});return nodes.get(id)};
 const context={examRequest:0,documentRequest:0,requestedExam:null,token:'synthetic-session',staff:'',document:{body:{dataset:{view:'exam-view'}},title:''},$:node,esc:String,examTitle:e=>e.title,timeLabel:()=>'',message:()=>{},renderEntrySelection:()=>{},admin:async()=>{},api(action){return new Promise(resolve=>pending.push({action,resolve}))},show(id){events.push(['show',id])},displayReport(r,id){events.push(['report',id])},async openExam(id){context.examRequest++;events.push(['exam',id])}};
 vm.createContext(context);vm.runInContext(functions,context);
 function resolve(action,value){const i=pending.findIndex(x=>x.action===action);assert.notEqual(i,-1,'expected pending '+action);pending.splice(i,1)[0].resolve(value)};
 return {context,nodes,node,pending,events,resolve};
}
const exam=id=>({id,title:id,mode:'released',questionCount:30,durationMinutes:90});
test('an older library response cannot reopen an exam after a newer route',async()=>{
 const h=harness();h.context.requestedExam='old';const task=h.context.library();await h.context.openExam('new');h.resolve('exams',{name:'old',exams:[exam('old')]});await tick();
 // Drain an obsolete implementation without hanging the test.
 if(h.pending.some(x=>x.action==='attempts'))h.resolve('attempts',{attempts:[]});await task;
 assert.deepEqual(h.events,[['exam','new']]);
});
test('library history arriving late cannot replace results or auto-open its old target',async()=>{
 const h=harness();h.context.requestedExam='old';const task=h.context.library();h.resolve('exams',{name:'old',exams:[exam('old')]});await tick();h.node('past-results').innerHTML='newer-result';await h.context.openExam('new');h.resolve('attempts',{attempts:[]});await task;
 assert.equal(h.node('past-results').innerHTML,'newer-result');assert.deepEqual(h.events.filter(e=>e[0]==='exam'),[['exam','new']]);
});
test('a stale result response cannot displace the latest exam route',async()=>{
 const h=harness();const task=h.context.restoreRoute({highselectView:'report-view',attemptId:'old-result'});await h.context.openExam('new');h.resolve('attempt',{id:'old-result',report:{}});await task;assert.deepEqual(h.events,[['exam','new']]);
});
test('the current library still renders its list, results, and requested exam',async()=>{
 const h=harness();h.context.requestedExam='wanted';const task=h.context.library();h.resolve('exams',{name:'current',exams:[exam('wanted')]});await tick();h.resolve('attempts',{attempts:[]});await task;
 assert.match(h.node('exam-list').innerHTML,/wanted/);assert.match(h.node('past-results').innerHTML,/아직 응시 결과/);assert.deepEqual(h.events,[['show','library-view'],['exam','wanted']]);
});
