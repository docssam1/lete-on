import { countries, COUNTRY_TOTAL, continentNames, rewards, buildings } from './countries.js';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7/+esm';
import { feature, mesh } from 'https://cdn.jsdelivr.net/npm/topojson-client@3/+esm';

const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
const storageKey = 'gfield-world-explorer-v1';
const defaultState = { points:0, streak:0, solved:[], ownedRewards:[], ownedBuildings:[], audio:false, continent:'all', mode:'flag' };
const isoNumeric = {KR:'410',JP:'392',CN:'156',IN:'356',TH:'764',ID:'360',GB:'826',FR:'250',DE:'276',IT:'380',ES:'724',GR:'300',EG:'818',ZA:'710',KE:'404',NG:'566',US:'840',CA:'124',MX:'484',BR:'076',AR:'032',PE:'604',AU:'036',NZ:'554'};
const numericCountry = new Map(countries.map(c => [isoNumeric[c.id], c]));
const focusViews = {
  all:{x:0,y:0,k:1}, asia:{x:-425,y:-60,k:1.72}, europe:{x:-105,y:28,k:2.45}, africa:{x:-125,y:-190,k:1.85},
  'north-america':{x:305,y:-40,k:1.72}, 'south-america':{x:190,y:-285,k:1.92}, oceania:{x:-570,y:-300,k:2.05}
};

let state = loadState();
let current = null;
let locked = false;
let atlas = null;
let svg, mapRoot, projection, geoPath, zoom;

function loadState(){ try{return {...defaultState,...JSON.parse(localStorage.getItem(storageKey)||'{}')}}catch{return {...defaultState}} }
function saveState(){ localStorage.setItem(storageKey,JSON.stringify(state)); }
function sample(list){ return list[Math.floor(Math.random()*list.length)]; }
function shuffle(list){ return [...list].sort(()=>Math.random()-.5); }
function pool(){ const filtered=state.continent==='all'?countries:countries.filter(c=>c.continent===state.continent); return filtered.length>=4?filtered:countries; }
function speak(text){ if(!state.audio||!('speechSynthesis'in window))return; speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(text);u.lang='ko-KR';u.rate=.95;speechSynthesis.speak(u); }
function guide(text){ $('#guideMessage').textContent=text;speak(text); }
function toast(text){ const el=$('#toast');el.textContent=text;el.classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.classList.remove('show'),1800); }

async function initAtlas(){
  svg=d3.select('#atlasSvg');
  const width=1000,height=520;
  projection=d3.geoNaturalEarth1().fitExtent([[24,24],[width-24,height-24]],{type:'Sphere'});
  geoPath=d3.geoPath(projection);
  mapRoot=svg.append('g').attr('class','atlas-root');
  mapRoot.append('path').datum(d3.geoGraticule10()).attr('class','graticule').attr('d',geoPath);
  mapRoot.append('path').datum({type:'Sphere'}).attr('class','sphere-outline').attr('d',geoPath);
  try{
    const world=await fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json').then(r=>{if(!r.ok)throw new Error('map');return r.json()});
    atlas=feature(world,world.objects.countries).features;
    mapRoot.append('g').attr('id','countryPaths').selectAll('path').data(atlas).join('path')
      .attr('class','country').attr('d',geoPath).attr('data-numeric',d=>String(d.id).padStart(3,'0'))
      .on('pointerenter',(event,d)=>showMapTooltip(event,d)).on('pointermove',(event,d)=>showMapTooltip(event,d))
      .on('pointerleave',hideMapTooltip).on('click',(_,d)=>selectMappedCountry(d));
    mapRoot.append('path').datum(mesh(world,world.objects.countries,(a,b)=>a!==b)).attr('class','country-border').attr('d',geoPath);
    mapRoot.append('g').attr('id','atlasMarkers');
    zoom=d3.zoom().scaleExtent([1,5]).translateExtent([[-250,-180],[1250,720]]).on('zoom',event=>mapRoot.attr('transform',event.transform));
    svg.call(zoom).on('dblclick.zoom',null);
    $('#zoomIn').onclick=()=>svg.transition().duration(260).call(zoom.scaleBy,1.35);
    $('#zoomOut').onclick=()=>svg.transition().duration(260).call(zoom.scaleBy,1/1.35);
    $('#resetMap').onclick=()=>focusMap('all');
    $('#mapLoading').classList.add('hide');
    renderMapState();focusMap(state.continent,false);
  }catch(error){
    $('#mapLoading').innerHTML='<b>지도를 불러오지 못했어요.<br>인터넷 연결을 확인해 주세요.</b>';
    console.error(error);
  }
}

function showMapTooltip(event,d){
  const id=String(d.id).padStart(3,'0'); const known=numericCountry.get(id); const tip=$('#mapTooltip');
  const rect=$('#worldMap').getBoundingClientRect(); tip.hidden=false; tip.textContent=known?`${known.flag} ${known.name}`:'세계의 한 국가';
  tip.style.left=`${event.clientX-rect.left}px`;tip.style.top=`${event.clientY-rect.top}px`;
}
function hideMapTooltip(){ $('#mapTooltip').hidden=true; }
function selectMappedCountry(d){ const c=numericCountry.get(String(d.id).padStart(3,'0')); if(!c)return; state.continent=c.continent;$('#continentFilter').value=c.continent;focusMap(c.continent);nextQuiz();updateStatus(); }
function focusMap(continent,animate=true){ if(!svg||!zoom)return; const v=focusViews[continent]||focusViews.all; const t=d3.zoomIdentity.translate(v.x,v.y).scale(v.k); const target=animate?svg.transition().duration(650).ease(d3.easeCubicOut):svg;target.call(zoom.transform,t); }
function renderMapState(){
  if(!atlas||!mapRoot)return;
  mapRoot.selectAll('.country').attr('class',d=>{
    const c=numericCountry.get(String(d.id).padStart(3,'0')); const classes=['country'];
    if(c&&state.solved.includes(c.id))classes.push('solved');
    if(c&&current&&c.id===current.id&&state.mode==='location')classes.push('current');
    return classes.join(' ');
  });
  const markerData=countries.filter(c=>state.solved.includes(c.id)&&isoNumeric[c.id]).map(c=>{
    const shape=atlas.find(d=>String(d.id).padStart(3,'0')===isoNumeric[c.id]);return shape?{...c,point:geoPath.centroid(shape)}:null;
  }).filter(Boolean);
  const markers=mapRoot.select('#atlasMarkers').selectAll('text').data(markerData,d=>d.id);
  markers.join(enter=>enter.append('text').attr('class','flag-pin').attr('x',d=>d.point[0]).attr('y',d=>d.point[1]-5).text(d=>d.flag).attr('opacity',0).transition().duration(350).attr('opacity',1),update=>update.attr('x',d=>d.point[0]).attr('y',d=>d.point[1]-5),exit=>exit.remove());
  const target=current&&state.mode==='location'&&isoNumeric[current.id]?atlas.find(d=>String(d.id).padStart(3,'0')===isoNumeric[current.id]):null;
  const pulse=mapRoot.select('#atlasMarkers').selectAll('circle').data(target?[geoPath.centroid(target)]:[]);
  pulse.join('circle').attr('class','target-pulse').attr('cx',d=>d[0]).attr('cy',d=>d[1]);
}

function updateStatus(){
  $('#points').textContent=state.points;$('#streak').textContent=state.streak;$('#solved').textContent=state.solved.length;$('#totalCountries').textContent=COUNTRY_TOTAL;
  $('#speakToggle').textContent=state.audio?'🔊 음성 끄기':'🔈 음성 켜기';$('#speakToggle').setAttribute('aria-pressed',String(state.audio));
  renderMapState();renderProgress();renderCollections();saveState();
}
function renderProgress(){
  const root=$('#continentProgress');root.innerHTML='';
  Object.entries(continentNames).filter(([id])=>id!=='all').forEach(([id,name])=>{const items=countries.filter(c=>c.continent===id);const solved=items.filter(c=>state.solved.includes(c.id)).length;const chip=document.createElement('button');chip.className=`progress-chip ${state.continent===id?'active':''}`;chip.textContent=`${name} ${solved}/${items.length}`;chip.onclick=()=>setContinent(id);root.appendChild(chip)});
}
function renderCollections(){
  const inv=$('#inventory');inv.innerHTML='';rewards.forEach(item=>{const owned=state.ownedRewards.includes(item.id);const el=document.createElement('button');el.className=`reward ${owned?'':'locked'}`;el.innerHTML=`<b>${item.icon}</b><br>${item.name}<br><small>${owned?'보유':item.cost+'P'}</small>`;el.onclick=()=>buy(item,'reward');inv.appendChild(el)});
  const build=$('#buildings');build.innerHTML='';buildings.forEach(item=>{const owned=state.ownedBuildings.includes(item.id);const el=document.createElement('button');el.className=`reward ${owned?'':'locked'}`;el.innerHTML=`<b>${item.icon}</b><br>${item.name}<br><small>${owned?'건설 완료':item.cost+'P'}</small>`;el.onclick=()=>buy(item,'building');build.appendChild(el)});
}
function buy(item,type){ const key=type==='reward'?'ownedRewards':'ownedBuildings';if(state[key].includes(item.id))return toast('이미 가지고 있어요.');if(state.points<item.cost)return toast(`포인트가 ${item.cost-state.points}점 더 필요해요.`);state.points-=item.cost;state[key].push(item.id);updateStatus();guide(`${item.name}을 획득했어! 세계 마을이 더 멋져졌네.`); }

function nextQuiz(){
  locked=false;$('#nextButton').disabled=true;const available=pool();const unsolved=available.filter(c=>!state.solved.includes(c.id));current=sample(unsolved.length?unsolved:available);
  const alternatives=shuffle(available.filter(c=>c.id!==current.id)).slice(0,3);const choices=shuffle([current,...alternatives]);renderQuizVisual();
  const answers=$('#answers');answers.innerHTML='';choices.forEach((c,index)=>{const button=document.createElement('button');button.innerHTML=`<span>${index+1}</span> ${c.name}`;button.dataset.countryId=c.id;button.onclick=()=>answer(c,button);answers.appendChild(button)});guide(modeIntro());renderMapState();
}
function modeIntro(){ if(state.mode==='flag')return'국기를 자세히 보고 나라 이름을 골라 보자!';if(state.mode==='clue')return'지리와 역사 단서를 읽고 나라를 찾아보자!';return'지도에 빛나는 나라의 위치를 보고 맞혀 보자!'; }
function renderQuizVisual(){
  const visual=$('#quizVisual');visual.innerHTML='';const heading=$('#quizHeading');
  if(state.mode==='flag'){heading.textContent='국기를 보고 나라를 맞혀요';visual.innerHTML=`<div class="big-flag" aria-label="국기">${current.flag}</div>`;$('#quizPrompt').textContent='이 국기는 어느 나라의 국기일까요?'}
  else if(state.mode==='clue'){heading.textContent='정보를 읽고 나라를 맞혀요';visual.innerHTML=`<div class="clue-card">${current.clue}<br><small>역사 단서 · ${current.history}</small></div>`;$('#quizPrompt').textContent='설명에 알맞은 나라는 어디일까요?'}
  else{heading.textContent='위치를 보고 나라를 맞혀요';visual.innerHTML=`<div class="clue-card"><b>${continentNames[current.continent]}</b> 지도를 확대했어요.<br><small>붉게 빛나는 국가의 이름을 골라 보세요.</small></div>`;$('#quizPrompt').textContent='지도에서 표시된 나라는 어디일까요?';focusMap(current.continent)}
}
function answer(choice,button){
  if(locked)return;locked=true;const buttons=$$('#answers button');const correctButton=buttons.find(b=>b.dataset.countryId===current.id);
  if(choice.id===current.id){button.classList.add('correct');state.streak+=1;const first=!state.solved.includes(current.id);const gained=10+Math.min(state.streak,5)*2+(first?15:0);state.points+=gained;if(first)state.solved.push(current.id);guide(`정답! ${current.name}. ${current.geography} ${gained}포인트를 받았어.`);toast(`+${gained}P`);setTimeout(()=>openCountryCard(current),550)}
  else{button.classList.add('wrong');correctButton?.classList.add('correct');state.streak=0;guide(`아쉽다. 정답은 ${current.name}이야. ${current.location}에 있는 나라야.`)}
  $('#nextButton').disabled=false;updateStatus();
}
function openCountryCard(c){ $('#countryCard').innerHTML=`<section class="country-info"><h2>${c.flag} ${c.name}</h2><p>${c.clue}</p><div class="facts"><div class="fact"><b>수도</b><br>${c.capital}</div><div class="fact"><b>위치</b><br>${c.location}</div><div class="fact"><b>언어</b><br>${c.language}</div><div class="fact"><b>화폐</b><br>${c.currency}</div></div><h3>지리</h3><p>${c.geography}</p><h3>인문·문화</h3><p>${c.human}</p><h3>역사</h3><p>${c.history}</p><p><b>나라 보상:</b> ${c.reward} · ${c.building}</p></section>`;$('#countryDialog').showModal(); }
function setContinent(id){state.continent=id;$('#continentFilter').value=id;focusMap(id);nextQuiz();updateStatus()}

$$('.mode-tabs button').forEach(button=>button.addEventListener('click',()=>{$$('.mode-tabs button').forEach(b=>b.classList.remove('active'));button.classList.add('active');state.mode=button.dataset.mode;nextQuiz();updateStatus()}));
$('#continentFilter').addEventListener('change',event=>setContinent(event.target.value));
$('#speakToggle').addEventListener('click',()=>{state.audio=!state.audio;updateStatus();guide(state.audio?'음성 안내를 시작할게!':'음성 안내를 껐어.')});
$('#hintButton').addEventListener('click',()=>{const text=`힌트: 수도는 ${current.capital}, 위치는 ${current.location}이야.`;toast(text);guide(text)});
$('#nextButton').addEventListener('click',nextQuiz);$('#closeDialog').addEventListener('click',()=>$('#countryDialog').close());$('#countryDialog').addEventListener('click',event=>{if(event.target===$('#countryDialog'))$('#countryDialog').close()});
$('#continentFilter').value=state.continent;$$('.mode-tabs button').forEach(b=>b.classList.toggle('active',b.dataset.mode===state.mode));
updateStatus();nextQuiz();initAtlas();