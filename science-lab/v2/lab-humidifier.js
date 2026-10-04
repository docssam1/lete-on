// 관찰의 방향을 비교하는 교육 모형. stage는 예시 관찰 단계(0~2), 실제 방울 수·시간·습도 측정값이 아니다.
export const WATERS=['실온 물','따뜻한 물'], SURFACES=['실온','차갑게'];
export function humidifierModel(water,surface){
  if(!WATERS.includes(water)||!SURFACES.includes(surface))throw new RangeError('unknown condition');
  const stage=(water==='따뜻한 물'?1:0)+(surface==='차갑게'?1:0);
  return {stage,result:['눈에 띄는 물방울 없음','작은 물방울이 맺힘','물방울이 더 뚜렷하게 맺힘'][stage]};
}
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
export async function mountHumidifier(el,opts={}){
  let engine,rig,stage;
  try{const [E,M]=await Promise.all([import('../engine.js'),import('../scenes/mini-humidifier.js')]);engine=E;rig=M;if(opts.force2D||!E.Stage.canWebGL())rig=null;}catch{rig=null;}
  if(!el.isConnected)return {};
  const rows=(opts.rows||[]).slice();let water=WATERS[1],surface=SURFACES[0],running=false,completed=false,t=0,dead=false;
  el.innerHTML=`<div class="modes" role="group" aria-label="물의 온도">${WATERS.map(w=>`<button type="button" data-water="${w}">${w}</button>`).join('')}</div><div class="modes" role="group" aria-label="판의 냉각">${SURFACES.map(s=>`<button type="button" data-surface="${s}">판 ${s}</button>`).join('')}</div><div class="lab3d">${rig?'<canvas aria-label="미니 가습기 3D 실험. 판 아래의 물방울을 관찰해요."></canvas>':'<div class="humidifier-2d" role="img" aria-label="미니 가습기 2D 관찰"><div class="hu-plate"></div><div class="hu-drops"></div><div class="hu-cup"></div></div>'}<p class="lab3d-tip" data-tip aria-live="polite">조건을 고르고 실험 시작을 눌러요.</p><div class="lab3d-btns"><button type="button" class="btn primary" data-run>실험 시작</button><button type="button" class="btn" data-record disabled>표에 적기</button></div></div><p class="hu-model-note">관찰 단계는 예시 모형이에요. 실제 방울 수·시간과 같지 않아요. 실온 물에서도 증발해요. 실제 응결은 습도와 온도에 따라 달라져요.</p><table class="lab-table"><thead><tr><th>물</th><th>판</th><th>관찰한 모습</th></tr></thead><tbody></tbody></table>`;
  const $=q=>el.querySelector(q), tip=s=>$('[data-tip]').textContent=s,record=$('[data-record]'),run=$('[data-run]');
  let apparatus;
  if(rig){try{stage=new engine.Stage($('canvas'));apparatus=rig.buildHumidifier();stage.root.add(apparatus);stage.setView({theta:.4,phi:1.42});/* 판 높이 가까이 — 판 아래 물방울이 핵심 */}catch{el.querySelector('canvas')?.remove();stage?.dispose();return mountHumidifier2D(el,opts);}}
  function drawRows(){ $('tbody').innerHTML=rows.map(r=>`<tr><td>${esc(r.water)}</td><td>${esc(r.surface)}</td><td>${esc(r.result)}</td></tr>`).join('');}
  function showDrops(n){if(apparatus){apparatus.userData.showDrops(n);}else{const d=$('.hu-drops');if(d)d.textContent=n===2?'💧 💧 💧':n===1?'💧':'';}}
  function choose(){t=0;running=false;completed=false;record.disabled=true;run.disabled=false;showDrops(0);if(apparatus){apparatus.userData.arrows.visible=false;apparatus.userData.setCold(surface==='차갑게');}el.querySelectorAll('[data-water]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.water===water)));el.querySelectorAll('[data-surface]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.surface===surface)));tip(`${water} · 판 ${surface}. 실험 시작을 눌러 관찰해요.`);}
  function done(){running=false;completed=true;run.disabled=false;record.disabled=false;const m=humidifierModel(water,surface);showDrops(m.stage);tip(`${m.result}. 표에 적고 다른 판 조건과 비교해요.`);}
  let timer=null;
  run.onclick=()=>{if(running||dead)return;completed=false;record.disabled=true;run.disabled=true;showDrops(0);running=true;t=0;tip('관찰 중이에요. 물에서 판 아래로 눈을 옮겨 봐요.');if(apparatus)apparatus.userData.arrows.visible=true;if(matchMedia('(prefers-reduced-motion: reduce)').matches)done();else if(!stage){clearInterval(timer);timer=setInterval(()=>{if(dead){clearInterval(timer);return;}if(opts.isActive&&!opts.isActive())return;t+=.1;if(t>=3){clearInterval(timer);done();}},100);}};
  record.onclick=()=>{if(!completed||running||dead)return;const m=humidifierModel(water,surface);rows.push({water,surface,...m});drawRows();opts.onRecord?.(rows.slice());};
  el.querySelectorAll('[data-water]').forEach(b=>b.onclick=()=>{water=b.dataset.water;clearInterval(timer);choose();});el.querySelectorAll('[data-surface]').forEach(b=>b.onclick=()=>{surface=b.dataset.surface;clearInterval(timer);choose();});
  if(stage)stage.update=dt=>{if(dead||(opts.isActive&&!opts.isActive())||!running)return;t+=dt;showDrops(t>1.6?humidifierModel(water,surface).stage:0);if(t>=3)done();};
  const dispose=()=>{if(dead)return;dead=true;clearInterval(timer);stage?.dispose();};
  if(engine)engine.watchDetached(el,dispose);else{const ob=new MutationObserver(()=>{if(!el.isConnected){ob.disconnect();dispose();}});ob.observe(document.body,{childList:true,subtree:true});}
  choose();drawRows();return {rows,dispose};
}
// 명시적 저사양 경로도 같은 기록·시작·비교 계약을 쓴다.
export async function mountHumidifier2D(el,opts={}){return mountHumidifier(el,{...opts,force2D:true});}
