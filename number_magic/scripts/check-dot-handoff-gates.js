#!/usr/bin/env node
'use strict';
const fs=require('fs'),path=require('path'),crypto=require('crypto'),{spawn}=require('child_process');
const out=path.resolve(process.env.NM_HANDOFF_ARTIFACTS||'E:/Codex/artifacts/numbers-dot-handoff-20261003/gates');
if(!/^[EG]:[\\/]/i.test(out))throw Error('Artifacts must be on E: or G:');
fs.mkdirSync(out,{recursive:true});
const tasks=[['answerable',[]],['print-lang',[]],['ladder',[]],['stages',[]],['about-stats',[]],['roadmap-sync',[]],['session-roles',['--browser']],['weekly-sheets',[]]];
const tracked=['app/main.js','app/styles.css','app/living-lesson.js','app/living-lesson.css','app/activity-journey.js','app/journey-stage.js','app/town3d/town3d.js','app/town3d/movement.js','app/char3d/char3d.js','data/activity-journeys.js','data/curriculum.js','data/courses.js','data/threads.js','data/units/M-02.js'];
const hash=file=>crypto.createHash('sha256').update(fs.readFileSync(path.join(__dirname,'..',file))).digest('hex');
const hashes=Object.fromEntries(tracked.map(file=>[file,hash(file)]));
fs.writeFileSync(path.join(out,'tested-source-sha256.json'),JSON.stringify(hashes,null,2));
let index=0,failed=false;const results=[];
async function execute(name,args,attempt){
 const target=path.join(__dirname,'check-'+name+'.js'),log=fs.createWriteStream(path.join(out,`${name}-attempt-${attempt}.log`));
 const code=await new Promise(resolve=>{const child=spawn(process.execPath,[target,...args],{cwd:path.resolve(__dirname,'../..'),env:process.env,windowsHide:true});child.stdout.pipe(log,{end:false});child.stderr.pipe(log,{end:false});child.on('error',error=>{log.write(error.stack+'\n');resolve(null);});child.on('close',resolve);});
 await new Promise(r=>log.end(r));return code;
}
async function worker(){while(index<tasks.length){
 const [name,args]=tasks[index++],start=Date.now(),attempts=[];console.log('Running '+name);
 let code;for(let attempt=1;attempt<=2;attempt++){code=await execute(name,args,attempt);attempts.push({attempt,exitCode:code});if(code!==2)break;console.log(name+': unexecuted; retrying the full check');}
 const result={name,args,exitCode:code,status:code===0?'passed':code===2||code===null?'unexecuted':'failed',attempts,durationSeconds:(Date.now()-start)/1000};
 results.push(result);if(code!==0)failed=true;fs.writeFileSync(path.join(out,'required-gates.json'),JSON.stringify(results,null,2));console.log(`${name}: ${result.status} (${result.durationSeconds}s)`);
}}
Promise.all([worker(),worker()]).then(()=>{const changed=tracked.filter(file=>hash(file)!==hashes[file]);fs.writeFileSync(path.join(out,'source-stability.json'),JSON.stringify({changed,duringChecks:changed.length>0},null,2));if(changed.length){failed=true;console.error('Source changed during checks: '+changed.join(', '));}console.log('Required gates: '+results.filter(r=>r.status==='passed').length+'/8 passed');process.exitCode=failed?1:0;}).catch(error=>{console.error(error);process.exitCode=1;});
