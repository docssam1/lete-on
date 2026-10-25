#!/usr/bin/env node
'use strict';
// Independently check printable worked examples, not the interactive step answers.
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const{chromium}=require('./lib/playwright'),root=path.resolve(__dirname,'../..');
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.woff2':'font/woff2'};
const server=http.createServer((req,res)=>{const f=path.resolve(root,'.'+decodeURIComponent(req.url.split('?')[0]));if(!f.startsWith(root+path.sep)||!fs.existsSync(f)||fs.statSync(f).isDirectory()){res.writeHead(404);return res.end();}res.writeHead(200,{'Content-Type':mime[path.extname(f)]||'application/octet-stream'});fs.createReadStream(f).pipe(res);});
(async()=>{await new Promise(r=>server.listen(0,'127.0.0.1',r));let b;try{b=await chromium.launch();const page=await b.newPage();await page.route('https://**',r=>r.abort());const marker="if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_EXAM;";const source=fs.readFileSync(path.join(root,'number_magic/app/exam.js'),'utf8').replace(marker,'window.__exampleCheck={example:w2ExampleBodyHtml,guide:w2GuidedHtml,visual:concreteTeachingHtml};\n'+marker);await page.route('**/app/exam.js?*',r=>r.fulfill({status:200,contentType:'text/javascript',body:source}));await page.goto('http://127.0.0.1:'+server.address().port+'/number_magic/ws.html?c=C1&w=2026-W43&auto=0&p=1&s=1');await page.waitForFunction(()=>window.NM_WS_READY===true);
const report=await page.evaluate(()=>{
 const refs=new Map();function scan(o){if(!o||typeof o!=='object')return;if(o.t&&o.lv)refs.set(o.t+'@'+o.lv,[o.t,o.lv]);for(const v of Object.values(o))if(typeof v==='object')scan(v);}for(let c=1;c<=28;c++)scan(NM_COURSES['C'+c].sessions);
 function value(tex){let s=tex.replace(/\\text\{([^{}]*)\}/g,(_,label)=>/:\s*$/.test(label)?'':'UNSUPPORTED').replace(/\\color\{[^{}]*\}/g,'').replace(/\\left|\\right|\\displaystyle/g,'').replace(/\\(?:quad|qquad|;|,|!|:| )/g,' ');for(let i=0;i<8;i++)s=s.replace(/\\d?frac\{([^{}]*)\}\{([^{}]*)\}/g,'(($1)/($2))');s=s.replace(/\\times|\\cdot/g,'*').replace(/\\div/g,'/').replace(/−/g,'-').replace(/\^\{([^{}]*)\}/g,'**($1)').replace(/\^(\d)/g,'**$1');for(let i=0;i<8;i++)s=s.replace(/\{([^{}]*)\}/g,'($1)');if(!/^[\d.+\-*/()\s]+$/.test(s)||!/\d/.test(s))return null;try{const v=Function('"use strict";return ('+s+');')();return Number.isFinite(v)?v:null;}catch{return null;}}
 const errors=[];let examples=0,equalities=0,pictures=0,wordFrames=0,scenes=0,ad4=0;
 const near=(a,b)=>Math.abs(a-b)<1e-8*Math.max(1,Math.abs(a),Math.abs(b));
 for(const[ref,[t,lv]]of refs)for(let seed=1;seed<=12;seed++){
  const p=NM_EXAM.buildProblems(t,lv,1,seed*1907)[0],before=JSON.stringify(p),d=document.createElement('div');
  try{d.innerHTML=__exampleCheck.example(p,t,true,'');}catch(e){errors.push({ref,err:e.message});continue;}examples++;
  if(JSON.stringify(p)!==before)errors.push({ref,err:'Example mutated the scored question'});
  for(const el of d.querySelectorAll('[data-tex]')){const tex=el.dataset.tex;if(tex.includes('\\square'))continue;const sides=tex.split('=');if(sides.length<2)continue;const vs=sides.map(value);if(vs.some(x=>x===null))continue;equalities++;if(vs.some(v=>!near(v,vs[0])))errors.push({ref,err:'False displayed equation',tex,values:vs});}
  if(p.base10||p.numline||['NS2','NS3'].includes(t)){
   pictures++;if(!d.querySelector('[data-concrete]'))errors.push({ref,err:'Worked picture missing'});
   if(p.numline&&d.querySelector('.nm-jump-nl-blank'))errors.push({ref,err:'Worked number line still blank'});
   if(p.base10&&d.querySelector('.nm-b10-blank')?.textContent!==String(p.answer))errors.push({ref,err:'Worked blocks still blank'});
   if(!__exampleCheck.visual(p,false,t))errors.push({ref,err:'Guided picture missing'});
  }
  if(p.wordEqn&&p.wp&&!p.tex){wordFrames++;const s=d.querySelector('[data-word-filled]')?.textContent;if(!s||/[□○]/.test(s))errors.push({ref,err:'Story equation not completed'});else if(s.includes('=')){const vs=s.split('=').map(x=>value(x.replace(/×/g,'*').replace(/÷/g,'/')));if(vs.some(x=>x===null)||!near(vs[0],vs[1]))errors.push({ref,err:'Wrong completed story equation',s});}}
  if(p.scene&&p.wp&&p.widget==='wpScene'){scenes++;const sc=p.scene,done=d.querySelector('.nm-wp-completed');if(!done)errors.push({ref,err:'Unfinished picture story'});else{const count=k=>done.querySelectorAll('[data-wp-mark="'+k+'"]').length;if(sc.mode==='color'&&(count('given')!==sc.fixed||count('added')!==sc.need||count('spare')!==sc.total-sc.fixed-sc.need))errors.push({ref,err:'Wrong completed coloring'});if(sc.mode==='cross'&&(count('removed')!==sc.need||count('left')!==p.answer))errors.push({ref,err:'Wrong crossed-out picture'});if(sc.mode==='pair'&&count('extra')!==p.answer)errors.push({ref,err:'Wrong unpaired amount'});if(sc.mode==='groups'&&count('given')+count('added')!==p.answer)errors.push({ref,err:'Wrong filled groups'});}}
  if(t==='AD4'){const m=p.tex?.match(/^(\d+) \+ \\square = (\d+)$/);if(m){ad4++;if(!p.prompt.ko.includes(m[2]+'이 될까요?'))errors.push({ref,err:'Prompt target differs from equation'});}}
 }
 return{refs:refs.size,examples,equalities,pictures,wordFrames,scenes,ad4,errors};
});console.log(JSON.stringify(report,null,2));assert.equal(report.errors.length,0,'Worked example content check failed');assert(report.examples>3000&&report.pictures>30&&report.wordFrames>5&&report.scenes>10);
}finally{if(b)await b.close();await new Promise(r=>server.close(r));}})().catch(e=>{console.error(e);process.exitCode=1;});
