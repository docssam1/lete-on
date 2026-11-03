// Read-only maintenance check. Never rewrites dates or treats HTTP 200 as guide verification.
import fs from 'node:fs';
import vm from 'node:vm';
const w={};vm.runInNewContext(fs.readFileSync(new URL('../demo2/planner-highschool-data.js',import.meta.url),'utf8'),{window:w});
const D=w.PlannerHighschoolData,today=new Date().toISOString().slice(0,10),links=process.argv.includes('--links');let bad=false;
for(const s of D.schools){
 const source=D.sources[s.source],days=Math.floor((Date.parse(today)-Date.parse(s.checked))/86400000);
 const next=s.events.filter(e=>e.end>=today).sort((a,b)=>a.start.localeCompare(b.start))[0],due=days>=30||next&&(Date.parse(next.start)-Date.parse(today))/86400000<=7;
 if(!source?.url||!/^20\d\d-\d\d-\d\d$/.test(s.checked)||s.events.some(e=>e.start>e.end||![s.year-1,s.year].includes(+e.start.slice(0,4)))){bad=true;console.error('INVALID',s.id);continue;}
 let status='';if(links)try{const r=await fetch(source.document||source.url,{signal:AbortSignal.timeout(12000)});status=' HTTP '+r.status;await r.body?.cancel();if(!r.ok)bad=true;}catch{status=' LINK_UNAVAILABLE';bad=true;}
 console.log(`${due?'RECHECK':'OK'} ${s.id} ${s.year} checked=${s.checked} next=${next?.start||'none'}${status}`);
}
if(bad)process.exitCode=1;
