/* Explicit ?speed=1 diagnostics. Durations only: no credentials, plans or uploads. */
(function(g,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else api.mount(g);})(typeof window==='undefined'?globalThis:window,()=>{
'use strict';
const KEY='gfield.roadmap.speed.v1',VERSION='20261116-mobile1',TTL=30*60*1000;
const phases=[['login_start','login_verified','로그인 확인'],['planner_navigation','input_ready','현재 공부 화면 준비'],['roadmap_start','roadmap_ready','로드맵 열기'],['study_start','study_ready','학습하기']];
const allowed=new Set(phases.flat().filter((_,i)=>i%3!==2).concat(['member_verified','plan_ready']));
function restore(raw,now){let d;try{d=JSON.parse(raw||'null');}catch{}const steps={};if(d?.version===VERSION&&Number.isFinite(d.startedAt)&&now-d.startedAt<TTL&&d.startedAt<=now){for(const [name,time]of Object.entries(d.steps||{}))if(allowed.has(name)&&Number.isFinite(time)&&time>=d.startedAt&&time<=now+1000)steps[name]=time;return {version:VERSION,startedAt:d.startedAt,steps,interrupted:(Array.isArray(d.interrupted)?d.interrupted:[]).filter(s=>allowed.has(s))};}return {version:VERSION,startedAt:now,steps,interrupted:[]};}
function measurements(d){return phases.map(([start,end,label])=>{const a=d.steps[start],b=d.steps[end],interrupted=d.interrupted.includes(start);return {label,start,end,ms:Number.isFinite(a)&&Number.isFinite(b)&&b>=a&&!interrupted?b-a:null,status:interrupted?'다른 앱으로 이동 · 다시 측정':Number.isFinite(a)?Number.isFinite(b)?'완료':'아직 완료되지 않음':'미측정'};});}
function summary(d,environment){const rows=measurements(d),intervals=rows.filter(r=>r.ms!==null).map(r=>[d.steps[r.start],d.steps[r.end]]).sort((a,b)=>a[0]-b[0]);let total=0,last=-Infinity;for(const [a,b]of intervals){total+=Math.max(0,b-Math.max(a,last));last=Math.max(last,b);}return ['로드맵 휴대폰 속도 점검 · '+VERSION,environment,...rows.map(r=>r.label+': '+(r.ms===null?r.status:(r.ms/1000).toFixed(2)+'초')),'측정된 처리 대기 합계: '+(total/1000).toFixed(2)+'초','입력·읽는 시간 제외. 미측정 단계를 0초로 계산하지 않습니다.','아이디·승인번호·학습 내용은 포함하지 않습니다.'].join('\n');}
function mount(g){
 if(!g.RoadmapSpeed||g.RoadmapSpeed.active!==true)return;
 const time=()=>g.performance.timeOrigin+g.performance.now(),doc=g.document;let d;try{d=restore(g.sessionStorage.getItem(KEY),time());}catch{d=restore(null,time());}
 let host,output,status,stopped=false;const pending=new Set();
 const environment=()=>{const ua=g.navigator.userAgent,device=/Android/.test(ua)?'Android':/iPhone|iPad/.test(ua)?'iOS':'데스크톱·기타';return '기기: '+device+' · 화면 '+g.innerWidth+'px · 브라우저 추정 연결 '+(g.navigator.connection?.effectiveType||'미확인');};
 function save(){try{g.sessionStorage.setItem(KEY,JSON.stringify(d));}catch{}if(output)output.textContent=summary(d,environment());}
 function mark(name,at=time()){
  if(stopped||!allowed.has(name))return;
  if(name==='login_start')d=restore(null,at);
  if((name==='roadmap_start'||name==='study_start')&&d.steps[name]&&!d.steps[name.replace('_start','_ready')])return;
  if(name.endsWith('_start')){delete d.steps[name.replace('_start','_ready')];d.interrupted=d.interrupted.filter(n=>n!==name);}
  d.startedAt=Math.min(d.startedAt,at);d.steps[name]=at;save();
 }
 function ready(name,selector){if(stopped||pending.has(name))return;pending.add(name);const began=time();let painted=false;
  const check=()=>{if(stopped)return;const visible=!doc.hidden&&[...doc.querySelectorAll(selector)].some(n=>n.getBoundingClientRect().width>0&&n.getBoundingClientRect().height>0&&g.getComputedStyle(n).visibility!=='hidden');if(visible&&painted){pending.delete(name);mark(name);return;}painted=visible;if(time()-began<TTL)g.requestAnimationFrame(check);else pending.delete(name);};g.requestAnimationFrame(check);
 }
 const queue=g.RoadmapSpeed.queue||[];g.RoadmapSpeed={active:true,mark,ready};for(const e of queue)e.selector?ready(e.name,e.selector):mark(e.name,e.at);
 if(/planner\.html$/.test(g.location.pathname))mark('planner_navigation',g.performance.timeOrigin);
 doc.addEventListener('visibilitychange',()=>{if(!doc.hidden)return;for(const [a,b]of phases)if(d.steps[a]&&!d.steps[b]&&!d.interrupted.includes(a))d.interrupted.push(a);save();});
 function panel(){
  const style=doc.createElement('style');style.textContent='#roadmapSpeed{position:fixed;z-index:1000000;bottom:8px;left:8px;right:8px;max-width:580px;margin:auto;padding:8px 12px;background:#fff;color:#32223e;border:1px solid #a28bb2;box-shadow:0 3px 16px #32223e22;font:14px/1.6 system-ui,sans-serif}#roadmapSpeed summary{cursor:pointer;min-height:36px}#roadmapSpeed pre{white-space:pre-wrap;max-height:34vh;overflow:auto;font:13px/1.7 system-ui,sans-serif}#roadmapSpeed button{font:inherit;min-height:44px;margin:4px;padding:8px 12px;border:1px solid #b9a7c6;background:white;color:#32223e;border-radius:6px}body{padding-bottom:100px!important}';doc.head.append(style);
  host=doc.createElement('aside');host.id='roadmapSpeed';host.setAttribute('aria-label','휴대폰 속도 점검');host.innerHTML='<details><summary>휴대폰 속도 점검 · 결과 보기</summary><pre></pre><p>로그인부터 로드맵과 학습하기까지 진행한 뒤 결과를 복사해 주세요. 이 기기에만 기록하며 자동 전송하지 않습니다.</p><button type="button" data-copy>결과 복사</button><button type="button" data-stop>점검 종료</button><p role="status"></p></details>';doc.body.append(host);output=host.querySelector('pre');status=host.querySelector('[role=status]');save();
  host.querySelector('[data-copy]').onclick=async()=>{try{await g.navigator.clipboard.writeText(summary(d,environment()));status.textContent='복사했습니다. 상담 대화에 붙여 넣어 주세요.';}catch{status.textContent='복사가 차단됐습니다. 위 결과 글을 길게 눌러 복사해 주세요.';}};
  host.querySelector('[data-stop]').onclick=()=>{stopped=true;try{g.sessionStorage.removeItem(KEY);}catch{}const url=new URL(g.location.href);url.searchParams.delete('speed');if(url.searchParams.has('next')){const next=new URL(url.searchParams.get('next'),url);next.searchParams.delete('speed');url.searchParams.set('next',next.pathname.split('/').at(-1)+next.search);}g.history.replaceState(null,'',url);host.remove();style.remove();g.RoadmapSpeed={active:false};};
 }
 if(doc.readyState==='loading')doc.addEventListener('DOMContentLoaded',panel,{once:true});else panel();
 return g.RoadmapSpeed;
}
return {restore,measurements,summary,mount};
});
