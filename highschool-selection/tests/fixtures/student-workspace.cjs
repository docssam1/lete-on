'use strict';
// Synthetic UI responses only. No live student, key, signed URL or DB write.
const fs=require('node:fs'),http=require('node:http'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'../..');
const sandbox={};vm.runInNewContext(fs.readFileSync(path.join(root,'data/available-mocks.js'),'utf8'),sandbox);
const editions=JSON.parse(JSON.stringify(sandbox.HIGHSELECT_AVAILABLE_MOCKS));
async function startServer(){
 const server=http.createServer((req,res)=>{
  const url=new URL(req.url,'http://127.0.0.1');let rel=url.pathname.replace(/^\/highschool-selection\//,'');
  const aliases={'login.html':'public/exam-entry.html','exams/app.js':'public/exam-entry.js','exams/app.css':'public/exam-entry.css'};rel=aliases[rel]||rel;
  const file=path.resolve(root,rel);if(!file.startsWith(root+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404).end();return;}
  const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.woff2':'font/woff2','.png':'image/png','.webp':'image/webp'}[path.extname(file)]||'application/octet-stream';
  res.writeHead(200,{'content-type':mime,'cache-control':'no-store'});fs.createReadStream(file).pipe(res);
 });await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));return {base:`http://127.0.0.1:${server.address().port}/highschool-selection/`,close:()=>new Promise(resolve=>server.close(resolve))};
}
function svg(kind,number){return `<svg xmlns="http://www.w3.org/2000/svg" width="1240" height="1754" viewBox="0 0 1240 1754"><rect width="1240" height="1754" fill="white"/><path d="M70 180h1100M620 240v1330" stroke="#d8dee8" stroke-width="2"/><text x="70" y="100" font-family="sans-serif" font-size="44" fill="#182230">UI FIXTURE - ${kind.toUpperCase()} ${number}</text><text x="70" y="145" font-family="sans-serif" font-size="24" fill="#566274">Synthetic page for navigation and print checks</text>${Array.from({length:6},(_,i)=>`<rect x="${i%2?660:70}" y="${250+Math.floor(i/2)*420}" width="500" height="330" fill="#f5f6f8"/><text x="${i%2?690:100}" y="${310+Math.floor(i/2)*420}" font-family="sans-serif" font-size="30" fill="#182230">CONTENT ${i+1}</text>`).join('')}<text x="70" y="1690" font-family="sans-serif" font-size="24" fill="#566274">LETE-ON / UI FIXTURE / ${number}</text></svg>`;}
async function installApi(page,{compact=false}={}){
 const state={submissions:[],requests:[],failSubmit:false,failImage:false,failAnswers:false,versionChanged:false,denied:false,expired:false,answerDelay:0,attempts:[]};
 const samples=compact?[{...editions.find(e=>e.programId==='DP'),id:'ui-workspace',title:'화면 검수용 모의고사 · 공통수학1 기본 1회',pageCount:3,answerPageCount:2,analysisPageCount:1,questionCount:50}]:editions;
 function report(exam,marks){const items=marks.map((m,i)=>({number:i+1,state:m==='O'?'correct':m==='X'?'wrong':'blank',majorUnit:i%2?'도형':'방정식',detailType:'화면 검수용 유형 안내'}));return {exam,gradingMethod:'self-reported',correctCount:marks.filter(x=>x==='O').length,wrongCount:marks.filter(x=>x==='X').length,blankCount:marks.filter(x=>!x).length,reviewCount:0,total:marks.length,domains:[{label:'대수',correct:marks.filter(x=>x==='O').length,total:marks.length}],items};}
 await page.route('https://fgahqumaldheqettmvqg.supabase.co/**',async route=>{
  const u=new URL(route.request().url());const action=u.searchParams.get('action');
  const json=(body,status=200)=>route.fulfill({status,contentType:'application/json',body:JSON.stringify(body)});
  if(u.pathname.includes('/ui-fixture/')){if(state.failImage){state.failImage=false;return route.fulfill({status:503,body:'fixture image failure'});}const m=u.pathname.match(/(paper|answers|analysis)\/(\d+)/);return route.fulfill({contentType:'image/svg+xml',body:svg(m[1],m[2])});}
  if(!u.pathname.endsWith('/highselect-exams'))throw Error('Unexpected external API');state.requests.push(action);
  if(action==='login')return json({token:'ui-fixture-session-token'});
  if(action==='logout')return json({ok:true});
  if(state.expired)return json({error:'login_required'},401);
  if(action==='exams')return json({name:'화면 검수',exams:samples});
  if(action==='attempts')return json({attempts:state.attempts});
  if(action==='attempt')return json({report:state.attempts[0].report});
  const exam=samples.find(e=>e.id===u.searchParams.get('exam'))||samples[0];
  if(state.denied)return json({error:'exam_not_approved'},403);
  if(['manifest','answers','analysis'].includes(action)){
   if(action==='answers'&&state.answerDelay)await new Promise(r=>setTimeout(r,state.answerDelay));
   if(action==='answers'&&state.failAnswers)return json({error:'storage_unavailable'},503);
   const kind=action==='manifest'?'paper':action;const count={paper:exam.pageCount,answers:exam.answerPageCount,analysis:exam.analysisPageCount}[kind];
   return json({exam:{...exam,version:state.versionChanged?'changed':'ui-v1'},questions:Array.from({length:exam.questionCount},(_,i)=>({number:i+1,responseType:'self-check'})),pages:Array.from({length:count},(_,i)=>({number:i+1,url:`https://fgahqumaldheqettmvqg.supabase.co/functions/v1/ui-fixture/${kind}/${i+1}?rev=${state.requests.length}`})),expiresAt:new Date(Date.now()+600000).toISOString()});
  }
  if(action==='submit'){const body=route.request().postDataJSON();if(state.failSubmit)return json({error:'storage_unavailable'},503);state.submissions.push(body);const result=report({...exam,version:'ui-v1'},body.responses);state.attempts=[{id:'fixture-attempt',report:result}];return json({report:result});}
  throw Error('Unexpected fixture action: '+action);
 });
 return state;
}
module.exports={startServer,installApi,editions};
