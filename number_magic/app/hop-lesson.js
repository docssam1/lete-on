/* N-07 수직선 뛰기 체험(2026-10-06) — 교재 G1-7호 "주사위 던지기·개구리의 위치·도미노".
   수학 상태는 data/living-lessons.js(kind:'hop')가 정하고, 여기는 SVG 로 그리기만 한다(그림이 답을 정하지 않는다).
   0에서 첫 주사위만큼 뛰고, 둘째 주사위만큼 + 면 앞으로·− 면 되돌아온다. 개구리는 실사 소품(assets/images/real/frog.png — 2026-10-07 실사-2차, 그 전엔 토끼). */
const copy={
 ko:{title:'개구리의 수직선 뛰기',ask:(a,op,c)=>`주사위 ${a}, 그리고 ${c}! 0에서 ${a}칸 뛴 다음 ${c}칸 ${op==='+'?'앞으로':'되돌아'} 와요. 개구리는 어디에 설까요?`,
  guess:'먼저 개구리가 설 자리를 골라 보세요. 그다음 직접 뛰어 확인해요.',stage1:n=>`첫 주사위만큼! ${n}칸 더 뛰어요.`,stage2:(op,n)=>op==='+'?`이제 앞으로 ${n}칸 더!`:`이제 되돌아 ${n}칸 더!`,
  right:(a,op,c,x)=>`맞았어요! ${a} ${op==='+'?'+':'−'} ${c} = ${x}. ${op==='+'?'앞으로 뛰면 더하기예요.':'되돌아오면 빼기예요.'}`,
  wrong:(p,x,op)=>`${p}(으)로 생각했는데 개구리는 ${x}에 섰어요. ${op==='+'?'앞으로 뛰면 커져요.':'되돌아오면 작아져요.'}`,
  done:(a,op,c,x)=>`개구리가 ${x}에 섰어요. ${a} ${op==='+'?'+':'−'} ${c} = ${x}.`,
  hop:'한 칸 뛰기',undo:'되돌리기',reset:'처음부터',next:'다른 수로',prediction:'개구리가 설 자리',scene:'수직선과 개구리. 그림을 누르거나 한 칸 뛰기 버튼을 누르세요.',
  legend:['첫 주사위만큼','앞으로(+)','되돌아(−)']},
 en:{title:'Frog Hops on the Number Line',ask:(a,op,c)=>`Dice ${a} and ${c}! Hop ${a} from 0, then ${c} ${op==='+'?'forward':'back'}. Where will the frog land?`,
  guess:'First pick where the frog will land, then hop to check.',stage1:n=>`The first die: ${n} more hop${n>1?'s':''}.`,stage2:(op,n)=>op==='+'?`Now ${n} more forward!`:`Now ${n} more back!`,
  right:(a,op,c,x)=>`Right! ${a} ${op==='+'?'+':'−'} ${c} = ${x}. ${op==='+'?'Hopping forward is adding.':'Hopping back is subtracting.'}`,
  wrong:(p,x,op)=>`You guessed ${p}, but the frog landed on ${x}. ${op==='+'?'Forward makes it bigger.':'Going back makes it smaller.'}`,
  done:(a,op,c,x)=>`The frog landed on ${x}. ${a} ${op==='+'?'+':'−'} ${c} = ${x}.`,
  hop:'Hop once',undo:'Undo',reset:'Reset',next:'Try other numbers',prediction:'Where it lands',scene:'Number line and frog. Tap the picture or the Hop button.',
  legend:['First die','Forward (+)','Back (−)']},
 zh:{title:'青蛙在数轴上跳',ask:(a,op,c)=>`骰子${a}和${c}！从0跳${a}格，再${op==='+'?'往前':'往回'}跳${c}格。青蛙会停在哪里？`,
  guess:'先猜猜青蛙停在哪里，再跳一跳验证。',stage1:n=>`按第一个骰子！还要跳${n}格。`,stage2:(op,n)=>op==='+'?`再往前跳${n}格！`:`再往回跳${n}格！`,
  right:(a,op,c,x)=>`对了！${a}${op==='+'?'+':'−'}${c}=${x}。${op==='+'?'往前跳就是加。':'往回跳就是减。'}`,
  wrong:(p,x,op)=>`你猜的是${p}，青蛙停在了${x}。${op==='+'?'往前跳会变大。':'往回跳会变小。'}`,
  done:(a,op,c,x)=>`青蛙停在了${x}。${a}${op==='+'?'+':'−'}${c}=${x}。`,
  hop:'跳一格',undo:'撤回',reset:'重新开始',next:'换一组数',prediction:'青蛙停的位置',scene:'数轴和青蛙。点图或按“跳一格”。',
  legend:['第一个骰子','往前（+）','往回（−）']}
};
const X=n=>24+n*31.2, LINE_Y=136;
const COL={first:'#C9A063',plus:'#D9534F',minus:'#16417C',ink:'#1A2233'};
const PIPS={1:[[0,0]],2:[[-1,-1],[1,1]],3:[[-1,-1],[0,0],[1,1]],4:[[-1,-1],[1,-1],[-1,1],[1,1]],5:[[-1,-1],[1,-1],[0,0],[-1,1],[1,1]],6:[[-1,-1],[1,-1],[-1,0],[1,0],[-1,1],[1,1]]};
function die(x,y,n,col){
 return `<rect x="${x-17}" y="${y-17}" width="34" height="34" rx="7" fill="#fff" stroke="${col}" stroke-width="3"/>`+
  (PIPS[n]||[]).map(([i,j])=>`<circle cx="${x+i*9}" cy="${y+j*9}" r="3.4" fill="#D9534F"/>`).join('');
}
function arc(from,to,col){
 /* 되돌아오는 뜀은 더 높게 — 앞으로 뛴 자국과 겹치지 않게 */
 const x1=X(from),x2=X(to),mx=(x1+x2)/2,y=LINE_Y-8,d=to>from?1:-1,h=d<0?52:26;
 return `<path d="M ${x1} ${y} Q ${mx} ${y-h} ${x2} ${y}" fill="none" stroke="${col}" stroke-width="3" stroke-linecap="round" stroke-dasharray="2 5"/>`+
  `<path d="M ${x2-d*7} ${y-7} L ${x2} ${y} L ${x2-d*8.5} ${y+1}" fill="none" stroke="${col}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`;
}
export function mount(host,uid,lang){
 const api=window.NM_LIVING_LESSONS;if(!host||!api||!api.has(uid))return null;
 if(host.__livingLesson)host.__livingLesson.dispose();
 const t=copy[lang]||copy.ko;let state=api.create(uid),disposed=false,motion=null;
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
 host.classList.add('nm-live-lesson','nm-hop-lesson');host.dataset.lesson=uid;
 host.innerHTML=`<header class="nm-live-head"><h2>${t.title}</h2><span class="nm-live-round"></span></header>
  <p class="nm-live-question"></p>
  <div class="nm-live-stage nm-hop-stage" data-renderer="svg" role="img" aria-label="${t.scene}"></div>
  <div class="nm-live-legend"><span><i class="gold"></i>${t.legend[0]}</span><span><i class="red"></i>${t.legend[1]}</span><span><i></i>${t.legend[2]}</span></div>
  <div class="nm-live-equation" role="status" aria-live="polite" aria-atomic="true"></div>
  <div class="nm-live-predict-label">${t.prediction}</div>
  <div class="nm-live-predict" role="group" aria-label="${t.prediction}"></div>
  <p class="nm-live-feedback" aria-live="polite"></p>
  <div class="nm-live-actions"><button class="primary" data-act="hop">${t.hop}</button><button data-act="undo">${t.undo}</button><button data-act="reset">${t.reset}</button><button class="next" data-act="next">${t.next}</button></div>`;
 const $=sel=>host.querySelector(sel),stage=$('.nm-hop-stage');
 function draw(v){
  let s=`<svg class="nm-hop-svg" viewBox="0 0 360 170" preserveAspectRatio="xMidYMid meet" aria-hidden="true">`;
  s+=`<path d="M 0 170 L 0 120 Q 180 112 360 120 L 360 170 Z" fill="#cfe5c2"/>`;
  s+=die(40,30,v.a,COL.first)+`<text x="80" y="42" text-anchor="middle" font-size="34" font-weight="800" fill="${v.op==='+'?COL.plus:COL.minus}">${v.op==='+'?'+':'−'}</text>`+die(118,30,v.c,v.op==='+'?COL.plus:COL.minus);
  s+=`<line x1="12" y1="${LINE_Y}" x2="348" y2="${LINE_Y}" stroke="${COL.ink}" stroke-width="3" stroke-linecap="round"/>`;
  for(let n=0;n<=10;n++)s+=`<line x1="${X(n)}" y1="${LINE_Y-7}" x2="${X(n)}" y2="${LINE_Y+7}" stroke="${COL.ink}" stroke-width="2.4"/><text data-tick="${n}" x="${X(n)}" y="${LINE_Y+26}" text-anchor="middle" font-size="16" font-weight="800" fill="${n===v.pos?COL.plus:'#4a5468'}">${n}</text>`;
  s+='<g class="nm-hop-trails"></g>';
  const rx=X(v.pos);
  s+=`<g class="nm-hop-frog" style="transform:translate(${rx}px,0)"><ellipse class="nm-hop-shadow" cx="0" cy="${LINE_Y-4}" rx="14" ry="3" fill="${COL.ink}" opacity=".15"/>`+
   `<g class="nm-hop-body"><image href="assets/images/real/frog.png" x="-23" y="${LINE_Y-50}" width="46" height="46"/></g></g>`;
  return s+`</svg>`;
 }
 function feedback(v){
  if(v.complete){if(v.prediction===null)return t.done(v.a,v.op,v.c,v.answer);return v.prediction===v.answer?t.right(v.a,v.op,v.c,v.answer):t.wrong(v.prediction,v.answer,v.op);}
  if(!v.hops.length&&v.prediction===null)return t.guess;
  return v.stage===1?t.stage1(v.remaining):t.stage2(v.op,v.remaining);
 }
 function update(rebuild){
  if(disposed)return;
  const v=api.snapshot(state);host.dataset.complete=String(v.complete);host.dataset.total=v.pos;host.dataset.round=v.round;
  $('.nm-live-round').textContent=`${v.round+1} / ${v.rounds}`;
  $('.nm-live-question').textContent=t.ask(v.a,v.op,v.c);
  /* 개구리 노드를 매 클릭마다 다시 만들면 transition은 출발점 없이 순간 이동한다.
     회차를 바꿀 때만 무대를 만들고, 위치·자국·현재 눈금은 같은 노드에서 갱신한다. */
  if(rebuild)stage.innerHTML=draw(v);
  stage.querySelector('.nm-hop-frog').style.transform=`translate(${X(v.pos)}px,0)`;
  stage.querySelector('.nm-hop-body image').setAttribute('transform',v.dir<0?'scale(-1,1)':'scale(1,1)');
  stage.querySelector('.nm-hop-trails').innerHTML=v.hops.map((h,i)=>arc(h[0],h[1],i<v.a?COL.first:(v.op==='+'?COL.plus:COL.minus))).join('');
  stage.querySelectorAll('[data-tick]').forEach(el=>el.setAttribute('fill',+el.dataset.tick===v.pos?COL.plus:'#4a5468'));
  $('.nm-live-equation').textContent=`${v.a} ${v.op==='+'?'+':'−'} ${v.c} = ${v.complete?v.answer:'□'}`;
  $('.nm-live-feedback').textContent=feedback(v);
  $('[data-act="hop"]').disabled=v.complete;$('[data-act="undo"]').disabled=!v.hops.length;
  if(rebuild){
   const c=[...new Set([v.answer-2,v.answer-1,v.answer,v.answer+1,v.answer+2].map(n=>Math.max(0,Math.min(10,n))))].sort((x,y)=>x-y);
   $('.nm-live-predict').innerHTML=c.map(n=>`<button data-predict="${n}" aria-pressed="false">${n}</button>`).join('');
  }
  host.querySelectorAll('[data-predict]').forEach(b=>{
   b.setAttribute('aria-pressed',String(+b.dataset.predict===v.prediction));
   b.classList.toggle('is-confirmed',v.complete&&+b.dataset.predict===v.answer);
   b.classList.toggle('is-revised',v.complete&&+b.dataset.predict===v.prediction&&v.prediction!==v.answer);
   b.disabled=v.complete;
  });
  host.querySelectorAll('[data-act="hop"],[data-act="undo"],[data-predict]').forEach(b=>b.setAttribute('aria-disabled',String(b.disabled)));
 }
 function busy(value){
  host.dataset.moving=String(value);stage.setAttribute('aria-busy',String(value));
  const v=api.snapshot(state);
  /* 이동 중 native disabled를 켜면 키보드 초점이 사라진다. 초점은 유지하고 action에서 재입력을 막는다. */
  const hopButton=$('[data-act="hop"]'),undoButton=$('[data-act="undo"]');
  hopButton.disabled=v.complete;undoButton.disabled=!v.hops.length;
  [hopButton,undoButton,...host.querySelectorAll('[data-predict]')].forEach(b=>b.setAttribute('aria-disabled',String(value||b.disabled)));
 }
 function cancelMotion(commit){
  if(!motion)return;
  const active=motion;motion=null;
  active.animations.forEach(a=>{a.onfinish=null;a.cancel();});
  if(commit)state=active.next;
  if(!disposed)busy(false);
 }
 function hop(next){
  const before=api.snapshot(state),after=api.snapshot(next);
  if(before.pos===after.pos)return;
  const frog=stage.querySelector('.nm-hop-frog'),body=stage.querySelector('.nm-hop-body'),shadow=stage.querySelector('.nm-hop-shadow');
  if(reduced.matches||typeof frog.animate!=='function'){state=next;update(false);return;}
  body.querySelector('image').setAttribute('transform',after.pos<before.pos?'scale(-1,1)':'scale(1,1)');
  const options={duration:360,easing:'linear'},height=after.pos<before.pos?26:18;
  const position=frog.animate([{transform:`translate(${X(before.pos)}px,0)`},{transform:`translate(${X(after.pos)}px,0)`}],options);
  const lift=body.animate(Array.from({length:9},(_,i)=>{const u=i/8;return {offset:u,transform:`translateY(${-4*height*u*(1-u)}px)`};}),options);
  const shade=shadow.animate([{opacity:.15},{opacity:.06,offset:.5},{opacity:.15}],options);
  motion={next,animations:[position,lift,shade]};busy(true);
  /* 상태·정답·자국은 착지한 뒤 확정한다. 연속 클릭은 한 번의 뜀으로 세며 초기화/다음 회차는 즉시 취소한다. */
  position.onfinish=()=>{if(disposed||!motion||motion.next!==next)return;cancelMotion(true);update(false);};
 }
 function action(name,value){
  if(disposed)return;
  if(motion){if(name!=='next'&&name!=='reset')return;cancelMotion(false);}
  const next=api.act(state,name,value);
  if(name==='hop'){hop(next);return;}
  state=next;update(name==='next'||name==='reset');
 }
 function onClick(e){
  const b=e.target.closest('button');
  if(b&&host.contains(b)&&!b.disabled){if(b.hasAttribute('data-predict'))action('predict',+b.dataset.predict);else if(b.dataset.act)action(b.dataset.act);return;}
  if(e.target.closest('.nm-hop-stage'))action('hop');
 }
 host.addEventListener('click',onClick);update(true);busy(false);
 function onReduce(e){if(e.matches&&motion){cancelMotion(true);update(false);}}
 reduced.addEventListener('change',onReduce);
 function dispose(){if(disposed)return;disposed=true;cancelMotion(false);host.removeEventListener('click',onClick);reduced.removeEventListener('change',onReduce);observer.disconnect();delete host.__livingLesson;}
 const observer=new MutationObserver(()=>{if(!host.isConnected)dispose();});observer.observe(document.body,{childList:true,subtree:true});
 const controller={dispose,getState:()=>api.snapshot(state)};host.__livingLesson=controller;
 return controller;
}
