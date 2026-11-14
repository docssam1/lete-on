// 사이트에 이미 공개된 상담 안내를 상담 지식 시드로 뽑는다. 출력: seed.json, seed.sql
// 실행: node roadmap/supabase/knowledge-seed/build-seed.mjs  (데이터베이스에는 쓰지 않는다)
import vm from 'node:vm';
import {readFileSync,writeFileSync} from 'node:fs';
const here=new URL('.',import.meta.url),demo=new URL('../../demo2/',import.meta.url);
const w={};
for(const f of ['planner-counselling-updates.js','planner-admissions-evidence.js','planner-education-news.js'])
  vm.runInNewContext(readFileSync(new URL(f,demo),'utf8'),{window:w,Intl,Date});
const U=w.PlannerCounsellingUpdates,A=w.PlannerAdmissionsEvidence,N=w.PlannerEducationNews;
const out=[],seen=new Set();
const add=(key,row)=>{if(seen.has(key))return;seen.add(key);out.push({seed_key:key,kind:'site',origin:'seed',status:'approved',...row,
  title:row.title.slice(0,120),body:row.body.slice(0,4000),source:(row.source||'').slice(0,500)});};
for(const stage of ['preschool','elementary','middle']){
  const g=U.data(stage);if(!g)continue;
  if(g.policy)add('updates:'+stage+':policy',{stage,title:'제도 변화 · '+g.label,body:g.policy.headline,source:g.policy.sources.map(s=>s.label+' '+s.url).join(' / '),checked_on:g.updatedAt});
  for(const it of g.items)add('updates:'+it.id,{stage:U.commonAdvice[it.id]?'all':stage,title:it.question,body:it.answer+(it.options?.length?' 살펴볼 점: '+it.options.join(', ')+'.':''),source:'로드맵 상담 안내 '+g.updatedAt,checked_on:g.updatedAt});
}
const stageOf=n=>n<=6?'elementary':n<=9?'middle':'high';
for(let n=1;n<=12;n++){
  const ctx={country:'kr',grade:n},m=A.model(ctx);
  for(const c of m.comments)add('admissions:'+m.stage+':'+c.id,{stage:stageOf(n),title:m.title+' · '+c.title,body:c.text,source:'로드맵 대입 준비 안내(공식 발표 대조 2026-10-26)',checked_on:'2026-10-26'});
  for(const q of A.questions(ctx))add('admissions:'+m.stage+':q:'+q.id,{stage:stageOf(n),title:q.question,body:q.answer,source:'로드맵 대입 준비 안내',checked_on:'2026-10-26'});
}
for(const n of N.items)add('news:'+n.id,{stage:n.stage==='middle'||n.stage==='high'||n.stage==='elementary'?n.stage:'all',title:n.title,body:[n.body,n.focus,n.advice].filter(Boolean).join(' '),source:(n.news?.sources||[]).map(([name,url])=>name+' '+url).join(' / ')||'로드맵 교육 뉴스 읽기',checked_on:n.news?.date||null});
const lit=v=>v==null||v===''?'null':"'"+String(v).replace(/'/g,"''")+"'";
const sql='-- build-seed.mjs가 만든 파일. 사이트에 공개된 안내라 승인 상태로 넣는다.\ninsert into public.roadmap_knowledge (seed_key,kind,origin,status,stage,title,body,source,checked_on,approved_at) values\n'+
  out.map(r=>`(${lit(r.seed_key)},'site','seed','approved',${lit(r.stage)},${lit(r.title)},${lit(r.body)},${lit(r.source)},${lit(r.checked_on)},now())`).join(',\n')+
  '\non conflict (seed_key) do nothing;\n';
writeFileSync(new URL('seed.json',here),JSON.stringify(out,null,1)+'\n');
writeFileSync(new URL('seed.sql',here),sql);
console.log(out.length+' rows');
