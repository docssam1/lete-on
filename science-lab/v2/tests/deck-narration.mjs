// Execute the real narration selector and read/think/session branches without a browser.
import fs from 'node:fs';
const source=fs.readFileSync(new URL('../deck.js',import.meta.url),'utf8');
function section(start,end){const a=source.indexOf(start),b=source.indexOf(end,a);if(a<0||b<a)throw Error('Deck narration fixture could not locate '+start);return source.slice(a,b);}
const selectSource=section('  const cue = (V, dflt)', '  const textLen = ');
const runSource=section('  async function run(V)', '  // ── 고르기 활동');
const thinkSource=section('  function runThink(', '  // 실험 순서 맞추기');
export function narrationSelector(ch,s){return new Function('ch','s',selectSource+';return cue;')(ch,s);}
export async function narrationBranch(ch,s,V={slides:{}}){
 const calls=[],delays=[],button={onclick:null},stage={querySelector:selector=>selector==='[data-a2=cont]'?button:null};
 const G={say(line){calls.push(line);return Promise.resolve(true);}},noop=()=>{};
 const run=new Function('ch','s','G','stage','fillMine','next','textLen','auto','alive','prepRes','wirePeek',selectSource+runSource+thinkSource+';return run;')(ch,s,G,stage,noop,noop,()=>30,ms=>delays.push(ms),()=>true,noop,()=>false);
 await run(V);return{calls,delays};
}
