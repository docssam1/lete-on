import {LAB_CONTENT} from './lab-content.js';
import {deriveOutcome,normalizeLabState} from './lab-model.js';

const $=q=>document.querySelector(q), e=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const copy=x=>JSON.parse(JSON.stringify(x)), key='popcorn.charles01.lab.v1';
const trainingIds=['ready','pouch','assembly-jaw','assembly-body','assembly-food','repair'];
const initialModel=()=>normalizeLabState({mode:'kit',assemblyStage:0,pole1:'N',pole2:'N',upperPole:'N',lowerPole:'N',food:'fish',foodPole:'S',distance:1,pouchOpen:false,hingeBlocked:false,labelsSwapped:false});
const guidedDemos=new WeakMap();
const createSession=()=>({index:0,model:initialModel(),assemblyProgress:0,assemblySelected:1,opened:false,records:[],drafts:{},pairs:{},lawShown:{},seen:[]});
const sessions={self:createSession(),teacher:createSession(),training:createSession()};
let role='self', scene=null, sceneReady=false, mounting=null, sceneAttempt=0, teacherGuides=null, paused=false, exploded=false, restoring=false, returnMagazine=false, returnReadingHash=null, wasFull=false;
const getSession=()=>sessions[role], stages=()=>role==='training'?LAB_CONTENT.stages.filter(s=>trainingIds.includes(s.id)):LAB_CONTENT.stages;
const getStage=()=>stages()[getSession().index], stageDraft=()=>getSession().drafts[getStage().id]??(getSession().drafts[getStage().id]={});
const phaseLabels={engage:'궁금한 시작',explore:'직접 탐구',explain:'원리 찾기',elaborate:'더 깊은 탐구',evaluate:'내 말로 정리'};
const labelMap={hypothesis:'자석의 어떤 힘을 이용하면 악어가 먹이를 먹을까요?','resting-jaw-reason':'평소 입이 열려 있는 까닭을 예상해요.','fish-prediction':'물고기를 가까이 하면?','carrot-prediction':'당근을 가까이 하면?','changed-condition':'무엇을 바꾸었나요?','same-conditions':'무엇을 같게 두었나요?','observed-difference':'어떤 차이를 관찰했나요?',claim:'내가 알아낸 점',evidence:'실제로 본 증거',reasoning:'그 증거를 자석의 극과 연결해 설명해요.',example1:'생활 속 자석 첫째',example2:'생활 속 자석 둘째',example3:'생활 속 자석 셋째',prediction:'실험 전 예상',observations:'내가 본 모습',reason:'내가 고른 이유','pole-blank':'자석에서 특히 클립이 잘 붙는 곳은?','fish-same-or-different':'물고기는 턱과 같은 극 / 다른 극?','carrot-same-or-different':'당근은 턱과 같은 극 / 다른 극?',topic:'탐구 주제',procedure:'내가 한 탐구 방법',results:'내 관찰을 정리해요.',conclusion:'왜 악어가 먹이를 먹었을까요?',fix:'잘 안된 점과 해결 방법','new-learning':'새로 알게 된 점','next-question':'다음에 더 알아보고 싶은 점','self-assessment':'잘한 것 / 더 해보고 싶은 것'};
const parts={'paper-B':'B · 몸통과 위턱','paper-E':'E · 아래턱','paper-D':'D · 자석 상자','disc-1':'위턱 동전자석','disc-2':'아래턱 동전자석','bar-magnet':'먹이 막대자석',fish:'물고기 그림',carrot:'당근 그림'};

function save(){
 if(role!=='self'||!$('#lab-remember').checked)return;
 try{localStorage.setItem(key,JSON.stringify({version:1,session:sessions.self}));$('#lab-storage-status').textContent='이 브라우저에서 이어 할 수 있어요.';}catch{$('#lab-storage-status').textContent='저장할 수 없어요. 기록을 내려받아 보관해요.';}
}
function restore(){
 try{const v=JSON.parse(localStorage.getItem(key)||'null');if(v?.version===1&&v.session&&Array.isArray(v.session.records)&&Array.isArray(v.session.seen)){
  sessions.self={...createSession(),...v.session,model:normalizeLabState(v.session.model)};
  sessions.self.index=Math.max(0,Math.min(LAB_CONTENT.stages.length-1,Number(v.session.index)||0));$('#lab-remember').checked=true;
 }}catch{}
}
function button(action,text,extra='',primary=false){return `<button type="button" data-lab-action="${action}" ${extra} class="${primary?'primary':''}">${e(text)}</button>`;}
function row(html){return `<div class="lab-control-row">${html}</div>`;}
function field(id,label,placeholder='내 말로 쓰거나, 말하고 나중에 기록해도 좋아요.'){
 if(role==='teacher')return `<p class="lab-note"><b>함께 생각할 질문</b><br/>${e(label)}</p>`;
 const d=stageDraft();return `<label for="lab-field-${id}">${e(label)}</label><textarea id="lab-field-${id}" data-lab-field="${id}" placeholder="${e(placeholder)}">${e(d[id]||'')}</textarea>`;
}
function fields(ids){return ids.filter(x=>x!=='selected-choice').map(x=>field(x,labelMap[x]||x)).join('');}
function recordButton(text='화면 결과를 기록해요'){return row(button('record',text,'',true));}
function distanceControl(){return `<label for="lab-distance">거리 · 가까이 ↔ 멀리</label><input id="lab-distance" type="range" min="0" max="100" value="${Math.round(getSession().model.distance*100)}" aria-label="자석이나 먹이의 거리"><div class="lab-control-row">${button('near','가까이 가져오기')}${button('far','멀리 놓기')}</div>`;}
function foodEndPole(m,food){const flipped=m.foodPole!==(m.food==='fish'?'S':'N');return food==='fish'?(flipped?'N':'S'):(flipped?'S':'N');}
function foodButtons(){const m=getSession().model;return row(button('fish',`물고기 · ${foodEndPole(m,'fish')}극`,`aria-pressed="${m.food==='fish'}"`)+button('carrot',`당근 · ${foodEndPole(m,'carrot')}극`,`aria-pressed="${m.food==='carrot'}"`));}
function polarityControls(){const m=getSession().model;return row(button('flipUpper',`위턱 ${m.upperPole}극 ↻`)+button('flipLower',`아래턱 ${m.lowerPole}극 ↻`)+button('restorePoles','원본 N–N으로'));}
function normalizeChoice(){return Array.from({length:2},(_,i)=>['N','S'].map(p=>p));}
function sceneState(){return copy(getSession().model);}
function observeText(){
 const m=getSession().model,d=deriveOutcome(m);
 if(!sceneReady)return '3D를 준비하는 중이에요. 준비되면 직접 움직여요.';
 if(m.mode==='kit')return getSession().opened?'부품을 눌러 이름과 쓰임을 살펴요.':'봉투를 흔들고 윗부분을 열어 보세요.';
 if(m.mode==='assembly')return `${Math.max(0,m.assemblyStage)} / 10 · ${m.assemblyStage?LAB_CONTENT.assemblyPhases[m.assemblyStage-1].title:'아래턱 도안을 준비했어요.'}`;
 if(m.distance>.82)return '멀리 놓은 상태예요. 가까이 가져오며 달라지는 모습을 보세요.';
 if(m.mode==='pairs')return d.pairs.label;
 if(m.mode==='clips')return d.clips.attracted?d.clips.label:'이 시료에서는 눈에 띄는 끌림을 나타내지 않아요.';
 return d.feeding.hingeBlocked?'힘은 작용하지만 턱이 막혀 있어요.':d.feeding.label;
}
function updateObservation(){
 $('#lab-observation').textContent=observeText();const slider=$('#lab-distance');if(slider)slider.value=String(Math.round(getSession().model.distance*100));
 if(scene)scene.setState(sceneState());
}
function renderRecords(){
 const rs=getSession().records;$('#lab-record-count').textContent=String(rs.length);
 if(!rs.length){$('#lab-records').innerHTML='<p class="lab-note">아직 남긴 기록이 없어요. 화면 실험은 “화면 결과 기록”, 실물 관찰은 직접 쓴 기록으로 따로 남겨요.</p>';return;}
 $('#lab-records').innerHTML=`<table class="lab-record-table"><thead><tr><th>출처</th><th>활동과 조건</th><th>기록</th></tr></thead><tbody>${rs.map(r=>`<tr><td class="origin">${r.kind==='virtual'?'화면 모형':r.kind==='real'?'실물 관찰':r.kind==='prediction'?'내 예상':'내 설명'}</td><td>${e(r.title)}${r.conditions?'<br/>'+e(r.conditions):''}</td><td>${e(r.observation||r.text)}</td></tr>`).join('')}</tbody></table>`;
}
function conditions(m){const positions=m.magnetType==='disc'?{north:'윗면',middle:'옆면',south:'아랫면'}:{north:'왼쪽 끝',middle:'가운데',south:'오른쪽 끝'},materials={steel:'철 클립',wood:'나무',plastic:'플라스틱'};return m.mode==='pairs'?`${m.pairKind==='disc-disc'?'동전–동전':'막대–동전'} · ${m.pole1}–${m.pole2}`:m.mode==='clips'?`${m.magnetType==='bar'?'막대':'동전'} · ${positions[m.clipPosition]} · ${materials[m.material]}`:`위턱 ${m.upperPole} · 아래턱 ${m.lowerPole} · 먹이 ${m.foodPole} · ${m.distance<.4?'가까이':'멀리'}`;}
function appendRecord(kind,data){
 if(!['self','teacher'].includes(role)){$('#lab-observation').textContent='조립 도우미는 사진과 모형을 살피는 곳이에요. 기록하려면 스스로 탐구로 들어가요.';return;}
 const s=getSession();s.records.push({id:`${role}-${Date.now()}-${s.records.length}`,kind,stageId:getStage().id,title:getStage().title,...data});save();renderRecords();
}
function recordTrial(){
 if(!sceneReady){$('#lab-observation').textContent='3D 실험이 아직 준비되지 않아 기록하지 않았어요. 다시 준비하거나 실물 관찰을 직접 적어요.';return;}
 const m=sceneState();appendRecord('virtual',{conditions:conditions(m),state:m,observation:observeText()});
 if(m.mode==='pairs'){getSession().pairs[`${m.pairKind}-${m.pole1}${m.pole2}`]=true;renderActivity();}
}
function recordText(kind='explanation'){
 const d=stageDraft(), labels={...labelMap,choice:'내가 고른 보기','pair-prediction':'두 자석에 대한 예상','real-observation':'실물 관찰'};getStage().activity.questions?.forEach((q,i)=>{labels[`question${i+1}`]=q;});const text=Object.entries(d).filter(([k,v])=>k!=='real-observation'&&String(v).trim()).map(([k,v])=>`${labels[k]||'내 생각'}: ${v}`).join('\n');
 if(!text){$('#lab-observation').textContent='아직 글이 없어요. 먼저 생각이나 관찰을 남겨요. 다음으로 이동해도 괜찮아요.';return;}
 appendRecord(kind,{text});$('#lab-observation').textContent=kind==='prediction'?'내 예상을 따로 남겼어요.':'내 설명을 기록했어요.';
}
function renderActivity(){
 const stage=getStage(),s=getSession(),m=s.model,a=stage.activity;let h='';
 if(a.type==='onboarding')h=`<p class="lab-note">화면 실험은 바로 시작할 수 있어요.<br/>실물 키트가 있다면 자석의 고정과 수량을 어른과 먼저 확인해요. 자석을 입·코·귀에 넣지 않아요. 빠지거나 느슨해진 자석이 있으면 멈추고 어른에게 알려요.</p>${row(button('start','랩코니와 시작해요','',true))}<p class="lab-note">조립만 바로 보고 싶다면 상단의 “조립하기”를 눌러요. 문제를 풀지 않아도 조립할 수 있어요.</p>`;
 else if(a.type==='unboxing')h=row(button('shake','봉투 흔들기')+button('open',s.opened?'다시 펼쳐 보기':'봉투 뜯기','',true))+`<div class="lab-part-list">${s.opened?Object.entries(parts).map(([id,text])=>button('part',text,`data-part="${id}"`)).join(''):''}</div><p class="lab-note">화면 준비물 모형이에요. 실제 키트의 구성·수량은 따로 확인해요.</p>`;
 else if(a.type==='prediction')h=(a.questions?a.questions.map((q,i)=>field(`question${i+1}`,q)).join(''):fields(a.fields||[]))+row(button('prediction','내 예상 남기기'));
 else if(a.type==='clip-probe')h=row(button('bar','막대자석',`aria-pressed="${m.magnetType==='bar'}"`)+button('disc','동전자석',`aria-pressed="${m.magnetType==='disc'}"`))+row(['north','middle','south'].map((pos,i)=>button('clipPosition',m.magnetType==='bar'?['왼쪽 끝','가운데','오른쪽 끝'][i]:['윗면','옆면','아랫면'][i],`data-position="${pos}" aria-pressed="${m.clipPosition===pos}"`)).join(''))+`<label for="lab-material">비교할 시료</label><select id="lab-material">${[['steel','철 클립'],['wood','나무'],['plastic','플라스틱']].map(([v,t])=>`<option value="${v}" ${m.material===v?'selected':''}>${t}</option>`).join('')}</select>`+distanceControl()+recordButton()+`<p class="lab-note">극 부근과 다른 곳의 반응을 비교해요. 클립 개수는 정확한 힘의 측정값이 아니에요.</p>`;
 else if(a.type==='magnet-pairs'){
  const ids=a.pairIds;h=`<label for="lab-pair-choice">관찰할 조합</label><select id="lab-pair-choice">${ids.map(id=>{const kind=id.startsWith('disc')?'disc-disc':'bar-disc',p=id.slice(-2);return `<option value="${id}" ${kind===m.pairKind&&p===m.pole1+m.pole2?'selected':''}>${kind==='disc-disc'?'동전–동전':'막대–동전'} · ${p[0]}–${p[1]}</option>`;}).join('')}</select>`+row(button('flip1',`첫째 ${m.pole1}극 ↻`)+button('flip2',`둘째 ${m.pole2}극 ↻`))+field('pair-prediction','이 조합은 어떻게 될 것 같나요?')+distanceControl()+recordButton()+`<div class="lab-trial-tags">${ids.map(id=>`<span class="${s.pairs[id]?'done':''}">${id.startsWith('disc')?'동전':'막대'} ${id.slice(-2)}${s.pairs[id]?' ✓':''}</span>`).join('')}</div><p class="lab-note">${Object.keys(s.pairs).length} / 8 조합을 기록했어요. 안 해 본 조합은 빈칸으로 남아요.</p>`;
 }
 else if(a.type==='assembly-training'){
  const [first,last]=a.phaseRange;s.assemblySelected=Math.max(first,Math.min(last,s.assemblySelected));const st=s.assemblySelected,p=LAB_CONTENT.assemblyPhases[st-1];
  h=`<div class="assembly-number">조립 ${String(st).padStart(2,'0')} / 10</div><p><b>${e(p.title)}</b></p><figure class="lab-inline-photo"><img src="../assets/${p.photo}" alt="조립 ${st} 실제 사진"></figure>${row(button('phasePrev','앞 단계 사진',` ${st===first?'disabled':''}`)+button('phaseNext','다음 단계 사진',` ${st===last?'disabled':''}`))}${row(button('perform','이 단계 조립하기','',true)+button('undo','붙이기 전으로')+button('replay','시범 다시 보기'))}${st===6?polarityControls():''}<p class="lab-note">실사와 3D를 번갈아 보고 모형을 돌려 확인해요. 질문의 정답으로 조립을 막지 않아요.</p>`;
 }
 else if(['feeding-trial','food-trial','fair-comparison','fault-repair','optional-challenge'].includes(a.type)||['fish-trial','carrot-trial'].includes(stage.id)){
  h=foodButtons()+distanceControl()+recordButton();
  if(a.type==='fault-repair')h+=polarityControls()+row(button('flipFood',`상자 속 막대 뒤집기 · 현재 ${m.foodPole}극`)+button('block',m.hingeBlocked?'턱 움직임 풀기':'턱을 막아 보기',`aria-pressed="${m.hingeBlocked}"`))+`<p class="lab-note">한 가지를 바꾸고 같은 먹이로 다시 시험해요.</p>`;
  if(a.type==='optional-challenge')h+=row(button('swapLabels',m.labelsSwapped?'이름표 되돌리기':'먹이 이름표만 바꾸기',`aria-pressed="${m.labelsSwapped}"`))+`<p class="lab-note">자석의 극은 그대로예요. 이름표만 바꿔서 비교해요. 영재 선발 검사가 아닌 선택 탐구예요.</p>`;
  if(a.fields)h+=fields(a.fields)+row(button('text','내 설명 기록'));
 }
 else if(['concept-from-records','explain-from-evidence'].includes(a.type)){
  h=fields(a.fields||['reasoning'])+row(button('showLaw',s.lawShown[stage.id]?'설명 접기':'원리 살펴보기'));
  if(s.lawShown[stage.id])h+=`<div class="lab-core-read">${stage.id==='magnet-pattern'?'자석에는 N극과 S극이 있어요. 같은 극끼리는 밀어내고, 다른 극끼리는 끌어당겨요.':'평소에는 두 턱의 N극이 마주 보고 밀어요. 물고기의 S극이 가까이 오면 턱의 N극과 서로 끌어당겨 입이 닫히는 모형이에요. 실제 몸체 이동은 마찰과 고정 상태에 따라 달라져요.'}</div>`;
  if(!s.records.some(r=>r.kind==='virtual'))h+='<p class="lab-hidden-note">아직 내 화면 관찰 기록이 없어요. 설명을 먼저 읽어도 실험 기록이 자동으로 생기지는 않아요.</p>';
  h+=row(button('text','내 설명 기록'));
 }
 else if(a.type==='everyday-observation')h=`<figure class="lab-inline-photo"><img src="../assets/living-case.png" alt="자석으로 닫는 실제 필통"></figure><a class="text-link" href="#library">실사 기사와 영상으로 더 보기 →</a>`+fields(a.fields)+row(button('text','내 발견 기록'));
 else if(a.type==='source-check')h=`<p><b>${e(a.question)}</b></p>`+a.choices.map((c,i)=>`<label class="lab-choice"><input type="radio" name="lab-check" data-lab-choice value="${i+1}" ${stageDraft().choice===String(i+1)?'checked':''}><span>${i+1}. ${e(c)}</span></label>`).join('')+fields(a.fields)+row(button('text','내 선택과 이유 기록'));
 else if(a.type==='journal')h=`<p class="lab-note">화면에서 본 것은 위의 “화면 모형 기록”에서 확인해요. 실물로 해 본 것만 아래에 직접 적어요.</p>`+field('real-observation','별도로 해 본 실물 관찰')+row(button('real','실물 관찰 따로 기록'))+fields(a.fields)+row(button('text','보고서 기록'))+`<a class="text-link" href="#notes">이전 교재에 쓴 내 글도 보기 →</a>`;
 else h=fields(a.fields||[])+distanceControl()+recordButton();
 const context=stage.id==='first-ideas'?['랩코니의 사전 이야기','랩코니가 보이지 않는 자석의 힘을 살펴보려 해요. 보이지 않는 힘을 어떤 모습으로 살펴볼지 생각하며 아래 질문을 읽어요. 철가루 실물 관찰은 어른과 밀봉 교구로 하고, 화면의 철 클립 관찰과 구분해요.']:stage.id==='food-predict'?['악어 앞에 놓인 두 먹이','완성한 악어 앞에 물고기와 당근이 놓여 있어요. 먹이를 천천히 가까이 가져가기 전에 어떤 모습일지 생각해 볼까요?']:stage.activity.type==='magnet-pairs'?['두 자석을 만나게 해 볼까요?','랩코니가 두 자석을 마주 놓으려 해요. 자석의 모양과 방향을 바꾸면 어떤 모습일지, 먼저 생각해 봐요.']:stage.id==='concept-check'?['이야기를 돌아봐요','자석과 먹이 사진을 다시 떠올려요. 질문을 읽으며 내 생각을 골라 보거나, 궁금한 점을 남겨도 좋아요.']:null;
 if(context)h=`<aside class="lab-before-question"><img src="../assets/labconi-charles.png" alt="이야기를 들려주는 랩코니"><strong>${e(context[0])}</strong><p>${e(context[1])}</p></aside>`+h;
 $('#lab-activity').innerHTML=h;
 window.dispatchEvent(new CustomEvent('popcornlab:guided-change'));
}
function prepareStage(){
 const s=getSession(),g=getStage(),m=s.model,t=g.activity.type;
 m.distance=1;
 if(['ready','pouch'].includes(g.id)){m.mode='kit';m.assemblyStage=s.opened?10:0;m.pouchOpen=s.opened;}
 else if(t==='clip-probe'){m.mode='clips';m.magnetType='bar';m.clipPosition='north';m.material='steel';}
 else if(['eight-pairs','magnet-pattern','first-ideas'].includes(g.id)){m.mode='pairs';m.pole1='N';m.pole2='N';}
 else if(t==='assembly-training'){m.mode='assembly';m.assemblyStage=s.assemblyProgress; s.assemblySelected=g.activity.phaseRange[0];}
 else{m.mode='feeding';m.assemblyStage=10;if(g.id==='fish-trial'||g.id==='carrot-trial'){const food=g.id==='fish-trial'?'fish':'carrot',foodPole=foodEndPole(m,food);m.food=food;m.foodPole=foodPole;}}
 m.labelsSwapped=false;m.hingeBlocked=false;
}
async function ensureScene(){
 if(scene){scene.setPaused(paused||document.hidden);return;}
 if(mounting)return mounting;
 mounting=(async()=>{
  try{const sceneUrl=new URL('./lab-scene.js?v=20261015-pouch-1',import.meta.url);if(sceneAttempt)sceneUrl.searchParams.set('retry',String(sceneAttempt));const mod=await import(sceneUrl.href);$('#lab-scene-host').replaceChildren();scene=await mod.mountLabScene($('#lab-scene-host'),{onAction:handleSceneAction});
   const snap=scene.getSnapshot();sceneReady=snap.webgl!==false&&snap.status!=='fallback'&&Boolean($('#lab-scene-host canvas'));
   $('#lab-retry').hidden=sceneReady;scene.setState(sceneState());scene.setPaused(paused||document.hidden);updateObservation();
  }catch(error){sceneReady=false;$('#lab-scene-host').innerHTML='<div class="lab-loading">3D를 불러오지 못했어요. “3D 다시 준비”를 눌러주세요.</div>';$('#lab-retry').hidden=false;$('#lab-observation').textContent='3D가 준비되지 않아 화면 실험을 완료로 처리하지 않았어요.';}
  finally{mounting=null;}
 })();return mounting;
}
function render(){
 const s=getSession(),g=getStage(),list=stages();$('.lab-screen').dataset.role=role;$('#lab-mode').value=role;
 const sourceStep=g.phase==='engage'?['UNIT','1','준비와 발견']:g.id==='report'?['STEP','3','탐구 보고서']:g.id==='concept-check'?['STEP','4','활동 평가']:['explain','elaborate','evaluate'].includes(g.phase)?['STEP','2','융합 사고']:['STEP','1','실험 탐구'];
 $('#lab-source-kind').textContent=sourceStep[0];$('#lab-source-number').textContent=sourceStep[1];$('#lab-source-label').textContent=sourceStep[2];
 $('#lab-title').textContent=role==='teacher'?'선생님과 자석 악어 탐구':role==='training'?'3D 자석 악어 조립 도우미':'먹이를 먹는 자석 악어';
 $('#lab-phase').textContent=phaseLabels[g.phase];$('#lab-count').textContent=`${String(s.index+1).padStart(2,'0')} / ${list.length}`;$('#lab-day').textContent=g.day===6?'주말 선택':`${g.day}일째`;
 $('#lab-stage-tag').textContent=phaseLabels[g.phase];$('#lab-stage-title').textContent=g.title;$('#lab-instruction').textContent=g.instruction;$('#lab-caption').textContent=g.caption;
 $('.labconi-guide').classList.toggle('ready',g.id==='ready');$('#labconi-start').disabled=g.id!=='ready';if(g.id==='ready'){$('#lab-caption').textContent='준비됐나요? 다음을 눌러 시작해요.';$('#lab-instruction').textContent='랩코니와 준비물을 살펴봐요. 다음을 누르면 봉투부터 열어 볼 수 있어요.';}
 $('#lab-help').hidden=true;$('#lab-help-toggle').setAttribute('aria-expanded','false');$('#lab-help').innerHTML=g.help.map(t=>`<p>${e(t)}</p>`).join('');
 $('#lab-prev').disabled=s.index===0;$('#lab-next').disabled=false;$('#lab-next').textContent='다음';
 $('#lab-next-hint').textContent=g.id==='pouch'&&!s.opened?'봉투를 열고 준비물을 살펴요.':g.activity.type==='assembly-training'?'먼저 사진과 모형을 번갈아 살펴요.':'내 속도로 이동해요. 하지 않은 실험은 미실행으로 남아요.';
 $('#lab-stage-list').innerHTML=list.map((x,i)=>`<button type="button" data-lab-stage="${i}" ${i===s.index?'aria-current="step"':''}>${String(i+1).padStart(2,'0')} ${e(x.title)}</button>`).join('');
 $('#lab-teacher-panel').hidden=role!=='teacher';$('#lab-teacher-content').hidden=true;if(role!=='teacher')$('#lab-teacher-content').replaceChildren();$('#lab-teacher-reveal').setAttribute('aria-expanded','false');
 renderActivity();renderRecords();updateObservation();if(g.id==='pouch'&&s.opened&&sceneReady&&scene?.getSnapshot()?.pouch&&!scene.getSnapshot().pouch.ready)$('#lab-next').disabled=true;save();
}
function goIndex(index){const s=getSession();s.index=Math.max(0,Math.min(stages().length-1,index));prepareStage();render();}
function setModel(patch,rerender=true){Object.assign(getSession().model,patch);if(rerender)renderActivity();updateObservation();save();}
function handleSceneAction(a){
 if(a.type==='pouchReady'){if(getStage().id==='pouch'&&getSession().opened){$('#lab-next').disabled=false;$('#lab-next-hint').textContent='준비물이 펼쳐졌어요. 살펴보고 다음을 눌러요.';$('#lab-activity').querySelectorAll('[data-lab-action="open"],[data-lab-action="shake"]').forEach(n=>n.disabled=false);}return;}
 if(a.type==='distance')setModel({distance:a.value},false);
 if(a.type==='flipPole'){const target=a.target;if(['pole1','pole2','upperPole','lowerPole'].includes(target))setModel({[target]:getSession().model[target]==='N'?'S':'N'});}
 if(a.type==='selectPart'){setModel({selectedPart:a.id},false);$('#lab-observation').textContent=parts[a.id]||'부품을 골랐어요.';}
 if(a.type==='contextLost'||a.type==='error'){sceneReady=false;$('#lab-retry').hidden=false;if(getStage().id==='pouch')$('#lab-next').disabled=false;$('#lab-observation').textContent='3D 화면이 멈췄어요. 기록은 그대로 두고 다시 준비할 수 있어요.';}
}
function actions(action,node){
 const s=getSession(),m=s.model,g=getStage();
 if(action==='start')goIndex(1);
 if(action==='shake')scene?.shakePouch?.();
 if(action==='open'){const replay=s.opened;s.opened=true;m.pouchOpen=true;m.assemblyStage=10;render();if(replay)scene?.replayPouch?.();if(sceneReady&&scene?.getSnapshot()?.pouch&&!scene.getSnapshot().pouch.ready){$('#lab-next').disabled=true;$('#lab-next-hint').textContent='봉투가 열리고 준비물이 펼쳐져요.';$('#lab-activity').querySelectorAll('[data-lab-action="open"],[data-lab-action="shake"]').forEach(n=>n.disabled=true);}}
 if(action==='part'){setModel({selectedPart:node.dataset.part},false);$('#lab-observation').textContent=parts[node.dataset.part];}
 if(action==='prediction')recordText('prediction');if(action==='text')recordText();if(action==='real'){
  const text=stageDraft()['real-observation'];if(text?.trim())appendRecord('real',{text});else $('#lab-observation').textContent='실물로 관찰한 것을 먼저 적어요.';
 }
 if(action==='near')setModel({distance:0},false);if(action==='far')setModel({distance:1},false);
 if(action==='bar'||action==='disc')setModel({magnetType:action,distance:1});
 if(action==='clipPosition')setModel({clipPosition:node.dataset.position,distance:1});
 if(action==='record')recordTrial();if(action==='flip1'||action==='flip2'){const k=action==='flip1'?'pole1':'pole2';setModel({[k]:m[k]==='N'?'S':'N'});}
 if(action==='fish'||action==='carrot')setModel({food:action,foodPole:foodEndPole(m,action),distance:1});
 if(action==='flipUpper'||action==='flipLower'){const k=action==='flipUpper'?'upperPole':'lowerPole';setModel({[k]:m[k]==='N'?'S':'N'});}
 if(action==='restorePoles')setModel({upperPole:'N',lowerPole:'N',foodPole:m.food==='fish'?'S':'N',hingeBlocked:false});
 if(action==='flipFood')setModel({foodPole:m.foodPole==='N'?'S':'N'});if(action==='block')setModel({hingeBlocked:!m.hingeBlocked});if(action==='swapLabels')setModel({labelsSwapped:!m.labelsSwapped});
 if(action==='phasePrev'||action==='phaseNext'){s.assemblySelected+=action==='phasePrev'?-1:1;renderActivity();}
 if(action==='perform'){s.assemblyProgress=s.assemblySelected;setModel({assemblyStage:s.assemblyProgress});}
 if(action==='undo'){s.assemblyProgress=Math.max(0,s.assemblySelected-1);setModel({assemblyStage:s.assemblyProgress});}
 if(action==='replay'){scene?.setState({...sceneState(),assemblyStage:Math.max(0,s.assemblySelected-1)});setTimeout(()=>{s.assemblyProgress=s.assemblySelected;setModel({assemblyStage:s.assemblySelected});},matchMedia('(prefers-reduced-motion: reduce)').matches?0:700);}
 if(action==='showLaw'){s.lawShown[g.id]=!s.lawShown[g.id];renderActivity();save();}
}
function previous(){
 const s=getSession(),g=getStage();
 if(g.activity.type==='assembly-training'){
  if(s.assemblySelected>g.activity.phaseRange[0]){s.assemblySelected--;s.assemblyProgress=Math.min(s.assemblyProgress,s.assemblySelected);setModel({assemblyStage:s.assemblyProgress});return;}
  const prior=stages()[s.index-1];if(prior?.activity.type==='assembly-training'){goIndex(s.index-1);s.assemblySelected=prior.activity.phaseRange[1];s.assemblyProgress=Math.min(s.assemblyProgress,s.assemblySelected);setModel({assemblyStage:s.assemblyProgress});return;}
 }
 goIndex(s.index-1);
}
function advance(){
 const s=getSession(),g=getStage(),a=g.activity;
 let demo=guidedDemos.get(s);if(!demo||demo.id!==g.id){demo={id:g.id,cursor:0};guidedDemos.set(s,demo);}
 if(g.id==='pouch'&&!s.opened){actions('open');return;}
 if(a.type==='assembly-training'){
  if(s.assemblyProgress!==s.assemblySelected||s.model.assemblyStage!==s.assemblySelected){actions('perform');$('#lab-next-hint').textContent=`조립 ${s.assemblySelected}단계의 모습을 살펴봐요.`;return;}
  if(s.assemblySelected<a.phaseRange[1]){s.assemblySelected++;renderActivity();$('#lab-next-hint').textContent='사진을 먼저 보고 다음을 눌러 붙이는 모습을 살펴요.';return;}
 }
 if(a.type==='clip-probe'){
  const trials=[['bar','north','steel'],['bar','middle','steel'],['bar','south','steel'],['disc','north','steel'],['disc','middle','steel'],['disc','south','steel'],['bar','north','wood'],['bar','north','plastic']];
  if(demo.cursor<trials.length){const [magnetType,clipPosition,material]=trials[demo.cursor++];setModel({magnetType,clipPosition,material,distance:0});$('#lab-next-hint').textContent=`화면 시범 ${demo.cursor} / ${trials.length} · 직접 본 모습은 따로 기록해요.`;return;}
 }
 if(a.type==='magnet-pairs'&&demo.cursor<a.pairIds.length){const id=a.pairIds[demo.cursor++],poles=id.slice(-2);setModel({pairKind:id.startsWith('disc')?'disc-disc':'bar-disc',pole1:poles[0],pole2:poles[1],distance:0});$('#lab-next-hint').textContent=`화면 시범 ${demo.cursor} / ${a.pairIds.length} · ${poles[0]}극과 ${poles[1]}극`;return;}
 if(['fish-trial','carrot-trial'].includes(g.id)&&demo.cursor===0){demo.cursor++;actions('near');$('#lab-next-hint').textContent='가까이 가져온 먹이와 입의 모습을 살펴봐요.';return;}
 if(a.type==='fair-comparison'&&demo.cursor<2){const food=demo.cursor++===0?'fish':'carrot';setModel({food,foodPole:foodEndPole(s.model,food),distance:0});$('#lab-next-hint').textContent='같은 거리에서 두 먹이의 반응을 비교해요.';return;}
 if(a.type==='fault-repair'&&demo.cursor<3){const step=demo.cursor++;if(step===0)actions('near');else setModel({hingeBlocked:step===1,distance:0});$('#lab-next-hint').textContent=['정상 움직임을 살펴봐요.','턱이 막힌 상태와 힘을 비교해요.','막힌 부분을 풀고 다시 살펴봐요.'][step];return;}
 if(a.type==='optional-challenge'&&demo.cursor<3){const step=demo.cursor++;if(step===0)actions('near');else actions('swapLabels');$('#lab-next-hint').textContent=['원래 이름표의 반응을 살펴봐요.','이름표만 바꾸어 같은 거리에서 살펴봐요.','이름표를 되돌려 비교해요.'][step];return;}
 if(['concept-from-records','explain-from-evidence'].includes(a.type)&&!s.lawShown[g.id]){actions('showLaw');$('#lab-next-hint').textContent='설명을 읽고 다음으로 이어 가요.';return;}
 if(!s.seen.includes(g.id))s.seen.push(g.id);
 const upcoming=stages()[s.index+1]||null;
 const event=new CustomEvent('popcornlab:before-advance',{cancelable:true,detail:{current:g,next:upcoming}});
 window.dispatchEvent(event);
 if(!event.defaultPrevented){if(upcoming)goIndex(s.index+1);else{$('#lab-root .lab-log-panel').open=true;location.hash='notes';}}
 save();
}
function enterMode(next){if(!['self','teacher','training'].includes(next))return;role=next;render();ensureScene();}
function route(){
 const h=location.hash.slice(1);if(!['lab','teach','build'].includes(h)){scene?.setPaused(true);return;}
 role=h==='teach'?'teacher':h==='build'?'training':'self';render();ensureScene();
 if(returnMagazine&&!$('#lab-magazine-return')){const btn=document.createElement('button');btn.id='lab-magazine-return';btn.textContent='읽던 잡지로';btn.type='button';btn.addEventListener('click',()=>{closeFull();location.hash='magazine';});$('.lab-top-actions').append(btn);}
 if(returnReadingHash&&!$('#lab-reading-return')){const btn=document.createElement('button');btn.id='lab-reading-return';btn.textContent='읽던 기사로';btn.type='button';btn.addEventListener('click',()=>{closeFull();location.hash=returnReadingHash;});$('.lab-top-actions').append(btn);}
 if($('#lab-reading-return'))$('#lab-reading-return').hidden=!returnReadingHash;
}
function closeFull(){document.body.classList.remove('lab-full');$('#lab-fullscreen').textContent='크게 보기';if(document.fullscreenElement)document.exitFullscreen().catch(()=>{});}
async function toggleFull(){
 if(document.body.classList.contains('lab-full')){closeFull();return;}
 document.body.classList.add('lab-full');$('#lab-fullscreen').textContent='작게 보기';try{await $('#lab-root').requestFullscreen?.();}catch{}
 scene?.setPaused(paused);
}

restore();
$('#lab-activity').addEventListener('click',ev=>{const n=ev.target.closest('[data-lab-action]');if(n)actions(n.dataset.labAction,n);});
$('#lab-activity').addEventListener('input',ev=>{
 const n=ev.target;if(n.id==='lab-distance'){setModel({distance:Number(n.value)/100},false);return;}
 if(n.dataset.labField&&role!=='teacher'){stageDraft()[n.dataset.labField]=n.value;save();}
});
$('#lab-activity').addEventListener('change',ev=>{
 const n=ev.target;if(n.id==='lab-material')setModel({material:n.value});
 if(n.id==='lab-pair-choice'){const p=n.value.slice(-2);setModel({pairKind:n.value.startsWith('disc')?'disc-disc':'bar-disc',pole1:p[0],pole2:p[1],distance:1});}
 if(n.matches('[data-lab-choice]')&&role!=='teacher'){stageDraft().choice=n.value;save();}
});
$('#lab-mode').addEventListener('change',ev=>{const v=ev.target.value;const hash=v==='teacher'?'teach':v==='training'?'build':'lab';if(location.hash!==`#${hash}`)location.hash=hash;else enterMode(v);});
$('#labconi-start').addEventListener('click',()=>{if(getStage().id==='ready')goIndex(1);});
$('#lab-prev').addEventListener('click',previous);
$('#lab-next').addEventListener('click',advance);
$('#lab-stage-list-toggle').addEventListener('click',()=>{const open=$('#lab-stage-list').hidden;$('#lab-stage-list').hidden=!open;$('#lab-stage-list-toggle').setAttribute('aria-expanded',String(open));});
$('#lab-stage-list').addEventListener('click',ev=>{const n=ev.target.closest('[data-lab-stage]');if(n)goIndex(Number(n.dataset.labStage));});
$('#lab-help-toggle').addEventListener('click',()=>{const open=$('#lab-help').hidden;$('#lab-help').hidden=!open;$('#lab-help-toggle').setAttribute('aria-expanded',String(open));});
$('#lab-teacher-reveal').addEventListener('click',async()=>{
 if(role!=='teacher')return;if(!teacherGuides)teacherGuides=(await import('./lab-teacher.js')).TEACHER_GUIDES;
 const guide=teacherGuides[getStage().id];$('#lab-teacher-content').innerHTML=`<strong>${e(guide.teacherPrompt)}</strong><p>${e(guide.notes)}</p>`;
 const open=$('#lab-teacher-content').hidden;$('#lab-teacher-content').hidden=!open;$('#lab-teacher-reveal').setAttribute('aria-expanded',String(open));
});
$('#lab-reset-camera').addEventListener('click',()=>scene?.resetView());
$('#lab-explode').addEventListener('click',()=>{exploded=!exploded;scene?.setExploded(exploded);$('#lab-explode').setAttribute('aria-pressed',String(exploded));});
$('#lab-poles').addEventListener('click',()=>{setModel({showPoles:!getSession().model.showPoles},false);$('#lab-poles').setAttribute('aria-pressed',String(getSession().model.showPoles));});
$('#lab-pause').addEventListener('click',()=>{paused=!paused;scene?.setPaused(paused);$('#lab-pause').setAttribute('aria-pressed',String(paused));$('#lab-pause').textContent=paused?'움직임 이어 보기':'움직임 멈춤';});
$('#lab-retry').addEventListener('click',()=>{scene?.dispose();scene=null;sceneReady=false;mounting=null;sceneAttempt++;ensureScene();});
$('#lab-fullscreen').addEventListener('click',toggleFull);
$('#lab-book').addEventListener('click',()=>{wasFull=document.body.classList.contains('lab-full');closeFull();window.dispatchEvent(new CustomEvent('popcornlab:book',{detail:{page:getStage().bookPage[0]||1}}));});
const back=document.createElement('button');back.type='button';back.id='lab-book-return';back.textContent='실험으로 돌아가기';back.hidden=true;$('.book-toolbar').append(back);
back.addEventListener('click',()=>{location.hash=role==='teacher'?'teach':role==='training'?'build':'lab';if(wasFull){wasFull=false;toggleFull();}});
$('#lab-remember').addEventListener('change',()=>{if($('#lab-remember').checked)save();else{try{localStorage.removeItem(key);}catch{}$('#lab-storage-status').textContent='탐구 저장을 껐어요. 현재 글은 남아 있어요.';}});
$('#lab-export').addEventListener('click',()=>{const data={title:'팝콘실험실 샤를 1호',role,modelLimits:LAB_CONTENT.modelContract,records:getSession().records,drafts:getSession().drafts};const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='팝콘실험실_샤를1호_화면탐구기록.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1500);});
window.addEventListener('popcornlab:route',event=>{if(event.detail.actual==='lab'){back.hidden=false;route();}else{scene?.setPaused(true);document.body.classList.remove('lab-full');}});
window.addEventListener('popcornlab:jump',event=>{returnMagazine=Boolean(event.detail.returnToMagazine);returnReadingHash=null;role='self';const index=LAB_CONTENT.stages.findIndex(s=>s.id===event.detail.stageId);goIndex(index<0?0:index);location.hash='lab';route();});
window.addEventListener('popcornreading:experiment',event=>{returnReadingHash=event.detail.returnHash;role='self';const index=LAB_CONTENT.stages.findIndex(s=>s.id===event.detail.stageId);goIndex(index<0?0:index);location.hash='lab';route();});
window.addEventListener('popcornreading:note',event=>{if(!['self','teacher'].includes(role))return;const s=getSession();s.records.push({id:`${role}-${Date.now()}-${s.records.length}`,kind:'explanation',stageId:'reading',title:event.detail.title,text:event.detail.text,language:event.detail.language});save();renderRecords();});
document.addEventListener('visibilitychange',()=>scene?.setPaused(document.hidden||paused||!['lab','teach','build'].includes(location.hash.slice(1))));
document.addEventListener('fullscreenchange',()=>{if(!document.fullscreenElement){document.body.classList.remove('lab-full');$('#lab-fullscreen').textContent='크게 보기';}});
document.addEventListener('keydown',ev=>{
 if(!['lab','teach','build'].includes(location.hash.slice(1))||ev.target.closest('input,textarea,select,button,a,dialog'))return;
 if(ev.key==='ArrowRight'){ev.preventDefault();$('#lab-next').click();}if(ev.key==='ArrowLeft'){ev.preventDefault();$('#lab-prev').click();}if(ev.key.toLowerCase()==='f'){ev.preventDefault();toggleFull();}
});
window.addEventListener('pagehide',()=>scene?.setPaused(true));
window.__POPCORN_LAB__={advance,useRole:next=>{if(['self','teacher','training'].includes(next)){role=next;render();window.dispatchEvent(new CustomEvent('popcornlab:role',{detail:{role}}));}},getState:()=>copy({role,stageId:getStage().id,session:getSession(),sceneReady}),getSnapshot:()=>scene?.getSnapshot(),goStage:id=>{const i=stages().findIndex(x=>x.id===id);if(i>=0)goIndex(i);},dispose:()=>{scene?.dispose();scene=null;sceneReady=false;}};
route();
