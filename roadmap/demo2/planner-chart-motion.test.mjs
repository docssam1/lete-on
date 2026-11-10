import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';
import assert from 'node:assert/strict';
const src=readFileSync(new URL('planner-chart-motion.js',import.meta.url),'utf8');
const css=readFileSync(new URL('planner-chart-motion.css',import.meta.url),'utf8');

test('loads without a document and names charts so a redraw does not replay',()=>{
 const w={};vm.runInContext(src,vm.createContext({window:w}));
 const M=w.PlannerChartMotion,el=(label,cls)=>({tagName:'svg',closest:()=>({id:'journeyMap'}),getAttribute:n=>n==='aria-label'?label:n==='class'?cls:null});
 assert.equal(M.key(el('교과 일정','a b'),0),M.key(el('교과 일정','a b'),0));
 assert.notEqual(M.key(el('교과 일정','a'),0),M.key(el('심화 일정','a'),0));
 assert.match(M.CHARTS,/svg\[role="img"\]/);assert.match(M.CHARTS,/\.standard-lane-track/);
});

test('does nothing when motion is reduced or the browser lacks observers',()=>{
 const w={};vm.runInContext(src,vm.createContext({window:w}));
 const M=w.PlannerChartMotion,observers={IntersectionObserver:class{},MutationObserver:class{}};
 assert.equal(M.start({defaultView:{}}),false);
 assert.equal(M.start({defaultView:{...observers,matchMedia:()=>({matches:true})}}),false);
});

test('reduced motion and print show charts and pictures fully',()=>{
 assert.match(css,/@media \(prefers-reduced-motion:reduce\)\{\.chart-motion-wait,\.chart-motion-in\{opacity:1;clip-path:none;animation:none\}/);
 assert.match(css,/@media print\{[^}]*opacity:1!important;clip-path:none!important/);
 // 기다리는 그래프를 잘라서 숨기면 화면 진입을 감지하지 못한다. 투명도로만 숨긴다.
 assert.match(css,/\.chart-motion-wait\{opacity:0\}/);assert.match(src,/setTimeout\(/);
});
