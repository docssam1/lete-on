import { animalActivities, animals, photoCredit } from '../data/activities/s31-u02.animal.js';
import { ANIMAL_KEY, emptyAnimal, emptyAnimalDraft, loadAnimal, validAnimal, saveAnimalRecord, animalReportHtml } from './animal-records.js';
import { drawingSvg, emptyDrawing, escapeLife as esc } from './life-records.js';
let instance = 0;
export function mountAnimal(host, opts = {}) {
  const personal = opts.personal !== false, prefix = `animal-${++instance}`;
  let state = emptyAnimal(), tab = animalActivities.some((a) => a.id === opts.tab) ? opts.tab : 'observe', error = '', writable = true, undo = null, disposed = false;
  try { if (personal) state = loadAnimal(localStorage); } catch (e) { error = e.message; writable = false; }
  host.classList.add('life-notebook', 'animal-notebook');
  const $ = (s) => host.querySelector(s), activity = () => animalActivities.find((a) => a.id === tab), draft = () => state.drafts[tab];
  const announce = (text) => { $('[data-animal-message]').textContent = text; };
  const button = (text, action, attr = '') => `<button type="button" data-animal-action="${action}" ${attr}>${text}</button>`;
  function persist() {
    if (disposed) return;
    let saved = false;
    try { if (personal && writable && validAnimal(state)) { localStorage.setItem(ANIMAL_KEY, JSON.stringify(state)); saved = true; } } catch { error = '기기에 저장하지 못했어요. 기록 파일을 내려받아 보관해 주세요.'; }
    const el = $('[data-animal-save]');
    if (el) el.textContent = !personal ? '수업용 임시 기록 · 개인 저장과 분리되어 있어요.' : saved ? '이 기기에 저장했어요.' : error || '저장하지 못했어요. 파일로 기록을 보관해 주세요.';
    const undoButton = $('[data-animal-action=undo]'); if (undoButton) undoButton.disabled = !undo;
    opts.onRecord?.(state.records.map((r) => ({ kind: r.kind, title: animalActivities.find((a) => a.id === r.kind).title })));
  }
  function field(f, value, path) {
    const id = `${prefix}-${path}`;
    return `<div class="life-field"><label for="${id}">${esc(f.label)}</label>${f.hint ? `<p class="life-hint">${esc(f.hint)}</p>` : ''}${f.type === 'date' ? `<input type="date" id="${id}" data-animal-field="${path}" value="${esc(value)}">` : `<textarea id="${id}" data-animal-field="${path}" maxlength="10000">${esc(value)}</textarea>`}</div>`;
  }
  const drawing = () => `<section class="animal-draw"><h3>관찰·설계를 그림으로 남겨요</h3><p class="life-hint" id="${prefix}-draw-help">손가락·마우스로 그려요. 키보드에서는 방향키로 이동하고 Space로 펜을 내리거나 올려요. Enter·Escape는 선을 끝내요.</p><div class="life-board" tabindex="0" role="group" aria-label="관찰·설계 그림 그리는 곳" aria-describedby="${prefix}-draw-help">${drawingSvg(draft().drawing, false)}<span class="life-cursor" aria-hidden="true"></span></div><div class="life-controls">${button('펜 내리기', 'pen', 'aria-pressed="false"')}${[['← 왼쪽','-1,0'],['위쪽 ↑','0,-1'],['오른쪽 →','1,0'],['↓ 아래쪽','0,1']].map(([t,v]) => button(t,'move',`data-dir="${v}"`)).join('')}${button('마지막 선 되돌리기','undo-line')}${button('그림 비우기','clear-drawing')}</div>${field({ label:'그림 설명', hint:'몸의 어느 부분이나 설계의 어떤 기능인지 이름표와 글로도 설명해요.' },draft().drawing.description,'drawing')}</section>`;
  const groups = () => `<section><h3>사진 8개의 모둠과 근거</h3><p>사진에 가려진 부분은 없다고 단정하지 않아요. 확인하지 못하면 더 확인으로 남겨요.</p><div class="animal-cards">${animals.map((x) => `<article><img src="${x.image}" alt="관찰 자료: ${x.name}" width="240" height="180"><h4>${x.name}</h4><label for="${prefix}-${x.id}-group">${x.name} 모둠</label><select id="${prefix}-${x.id}-group" data-animal-group="${x.id}">${[['','아직 정하지 않음'],['a',draft().values.groupA || '가 모둠'],['b',draft().values.groupB || '나 모둠'],['unknown','더 확인']].map(([v,t]) => `<option value="${v}"${draft().groups[x.id].group===v?' selected':''}>${esc(t)}</option>`).join('')}</select><label for="${prefix}-${x.id}-evidence">${x.name} 근거·더 확인할 부분</label><textarea id="${prefix}-${x.id}-evidence" maxlength="10000" data-animal-evidence="${x.id}">${esc(draft().groups[x.id].evidence)}</textarea></article>`).join('')}</div><p class="life-hint">출처: ${photoCredit}</p></section>`;
  function render() {
    endStroke(); const a = activity(), d = draft();
    host.innerHTML = `<header class="life-heading"><h2>동물의 생활 · 내 탐구 기록</h2><p data-animal-save role="status"></p><div class="life-controls">${button('내 기록 자료 내려받기','html')}${button('기록 파일 보관','json')}<label class="life-file">기록 파일 불러오기<input type="file" accept="application/json,.json" data-animal-import></label></div></header><nav class="life-tabs" aria-label="동물 탐구 활동">${animalActivities.map((x) => button(x.title,'tab',`data-tab="${x.id}" aria-pressed="${tab===x.id}"`)).join('')}</nav><p data-animal-message role="alert"></p><main class="life-pane"><h3>${a.question}</h3><p>${a.intro}</p><details><summary>활동 방법</summary><ol>${a.steps.map((s) => `<li>${esc(s)}</li>`).join('')}</ol></details>${tab==='observe' ? `<div class="animal-cards observation">${animals.map((x) => `<figure><img src="${x.image}" alt="${x.name} 관찰 자료"><figcaption>${x.name}</figcaption></figure>`).join('')}</div><p class="life-hint">출처: ${photoCredit}</p>` : ''}<form data-animal-form>${a.fields.map((f) => field(f,d.values[f.key],f.key)).join('')}${a.classify?groups():''}${a.draw?drawing():''}<button type="submit" class="life-primary">${d.editingId?'고친 기록 보관':'새 활동 기록 보관'}</button>${button('빈 활동으로 새로 쓰기','new')}</form><h3>보관한 ${a.title} · ${state.records.filter((r)=>r.kind===tab).length}개</h3><div class="life-records">${state.records.filter((r)=>r.kind===tab).map((r) => `<article><h4>${esc(Object.values(r.data.values).find(Boolean) || a.title)}</h4>${a.fields.map((f) => `<p><b>${esc(f.label)}</b><br>${esc(r.data.values[f.key]||'미기록')}</p>`).join('')}${a.classify?`<p>${animals.map((x)=>`${x.name}: ${esc(({a:r.data.values.groupA,b:r.data.values.groupB,unknown:'더 확인'})[r.data.groups[x.id].group]||'미기록')} · ${esc(r.data.groups[x.id].evidence)}`).join('<br>')}</p>`:''}${a.draw?`<div class="life-thumb">${drawingSvg(r.data.drawing)}</div><p>${esc(r.data.drawing.description)}</p>`:''}${button('이 기록 고치기','edit',`data-id="${esc(r.id)}"`)}${button('이 기록 지우기','remove',`data-id="${esc(r.id)}"`)}</article>`).join('')||'<p>아직 보관한 기록이 없어요. 실제로 한 활동을 적어 보관해요.</p>'}</div></main><div class="life-controls">${button('마지막 기록 변경 되돌리기','undo',undo?'':'disabled')}</div>`;
    if (a.draw) wireDrawing(); persist();
  }
  let stroke = null, down = false, cursor = [320,180], paint = () => {};
  function endStroke() { if (stroke) { stroke=null; persist(); } down=false; }
  function wireDrawing() {
    const board=$('.life-board'), svg=board.querySelector('svg');
    paint=()=>{ svg.innerHTML=new DOMParser().parseFromString(drawingSvg(draft().drawing,false),'image/svg+xml').documentElement.innerHTML; const c=$('.life-cursor');c.style.left=`${cursor[0]/640*100}%`;c.style.top=`${cursor[1]/360*100}%`;const b=$('[data-animal-action=pen]');b.textContent=down?'펜 올리기':'펜 내리기';b.setAttribute('aria-pressed',String(down)); };
    const start=()=>{endStroke();if(draft().drawing.strokes.length>=500)return false;stroke=[];draft().drawing.strokes.push(stroke);return true;};
    const point=()=>{if(!stroke)return;if(draft().drawing.strokes.reduce((n,s)=>n+s.length,0)>=20000){if(!stroke.length)draft().drawing.strokes.pop();endStroke();announce('그림의 점이 많아요. 파일로 보관한 뒤 선을 정리해 주세요.');return;}if(!stroke.length||stroke.at(-1).some((x,i)=>Math.abs(x-cursor[i])>=2))stroke.push([...cursor]);paint();};
    board.onpointerdown=(ev)=>{if(ev.button!==0||!ev.isPrimary||!start())return;board.setPointerCapture(ev.pointerId);movePointer(ev);point();board.focus({preventScroll:true});ev.preventDefault();};
    const movePointer=(ev)=>{const b=board.getBoundingClientRect();cursor=[Math.round(Math.max(0,Math.min(640,(ev.clientX-b.left)/b.width*640))),Math.round(Math.max(0,Math.min(360,(ev.clientY-b.top)/b.height*360)))];};
    board.onpointermove=(ev)=>{if(board.hasPointerCapture(ev.pointerId)){movePointer(ev);point();}};
    for(const type of ['pointerup','pointercancel','lostpointercapture'])board.addEventListener(type,()=>{endStroke();paint();});
    board._move=(dx,dy)=>{cursor=[Math.max(0,Math.min(640,cursor[0]+dx*8)),Math.max(0,Math.min(360,cursor[1]+dy*8))];if(down)point();paint();};
    board._pen=()=>{if(down)endStroke();else if(start()){down=true;point();}paint();};
    board.onkeydown=(ev)=>{const m={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]};if(m[ev.key]){ev.preventDefault();board._move(...m[ev.key]);}else if(ev.code==='Space'){ev.preventDefault();board._pen();}else if(['Enter','Escape'].includes(ev.key)){ev.preventDefault();endStroke();paint();}};paint();
  }
  const snapshot=()=>{endStroke();undo=structuredClone(state);};
  const download=(text,type,name)=>{const url=URL.createObjectURL(new Blob([text],{type})),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
  host.addEventListener('input',(e)=>{
    const k=e.target.dataset.animalField;
    if(k){if(k==='drawing')draft().drawing.description=e.target.value;else draft().values[k]=e.target.value;
      if(['groupA','groupB'].includes(k))host.querySelectorAll('[data-animal-group]').forEach((s)=>{s.querySelector(`option[value="${k==='groupA'?'a':'b'}"]`).textContent=e.target.value||`${k==='groupA'?'가':'나'} 모둠`;});
    } else if(e.target.dataset.animalEvidence)draft().groups[e.target.dataset.animalEvidence].evidence=e.target.value;else if(e.target.dataset.animalGroup)draft().groups[e.target.dataset.animalGroup].group=e.target.value;else return;
    persist();
  });
  host.addEventListener('submit',(e)=>{if(!e.target.matches('[data-animal-form]'))return;e.preventDefault();snapshot();try{saveAnimalRecord(state,tab,crypto.randomUUID());render();announce('활동 기록을 보관했어요. 실제 수행과 설계 내용은 선생님과 함께 확인해요.');}catch(err){announce(err.message);}});
  host.addEventListener('click',(e)=>{
    const b=e.target.closest('[data-animal-action]');if(!b)return;const action=b.dataset.animalAction;
    if(action==='tab'){endStroke();tab=b.dataset.tab;render();$(`[data-tab="${tab}"]`).focus({preventScroll:true});}
    else if(action==='pen')$('.life-board')._pen();else if(action==='move')$('.life-board')._move(...b.dataset.dir.split(',').map(Number));
    else if(action==='undo-line'){snapshot();draft().drawing.strokes.pop();paint();persist();}
    else if(action==='clear-drawing'){snapshot();const description=draft().drawing.description;draft().drawing=emptyDrawing();draft().drawing.description=description;paint();persist();announce('그림을 비웠어요. 마지막 변경 되돌리기로 복원할 수 있어요.');}
    else if(action==='undo'&&undo){endStroke();const before=state;state=undo;undo=before;render();announce('마지막 기록 변경을 되돌렸어요.');}
    else if(action==='new'){snapshot();state.drafts[tab]=emptyAnimalDraft(activity());render();announce('빈 활동을 열었어요. 이전 보관 기록은 그대로 있어요.');}
    else if(action==='edit'){snapshot();const r=state.records.find((r)=>r.id===b.dataset.id);state.drafts[tab]=structuredClone(r.data);draft().editingId=r.id;render();announce('기록을 수정 중이에요. 고친 기록 보관을 누르면 반영돼요.');}
    else if(action==='remove'){snapshot();state.records=state.records.filter((r)=>r.id!==b.dataset.id);if(draft().editingId===b.dataset.id)draft().editingId='';render();announce('기록을 지웠어요. 마지막 변경 되돌리기로 복원할 수 있어요.');}
    else if(action==='json'){endStroke();download(JSON.stringify(state,null,2),'application/json','동물의생활-기록.json');}
    else if(action==='html'){endStroke();download(animalReportHtml(state),'text/html;charset=utf-8','동물의생활-내기록.html');}
  });
  host.addEventListener('change',async(e)=>{if(!e.target.matches('[data-animal-import]'))return;const file=e.target.files[0];e.target.value='';if(!file)return;try{if(file.size>8_000_000)throw Error('파일이 너무 커요.');const s=JSON.parse(await file.text());if(disposed)return;if(!validAnimal(s))throw Error('이 단원의 올바른 기록 파일이 아니에요. 기존 내용은 보존했어요.');snapshot();state=s;render();announce(writable?'기록 파일을 불러왔어요.':'파일을 열었어요. 기존 기기 기록 보호를 위해 자동 저장은 하지 않아요. 파일로 다시 보관해 주세요.');}catch(err){if(!disposed)announce(err instanceof SyntaxError ? '기록 파일을 읽지 못했어요. 올바른 JSON 파일인지 확인해 주세요. 기존 내용은 보존했어요.' : err.message);}});
  render();if(error)announce(error);
  return { dispose(){endStroke();disposed=true;}, getState:()=>structuredClone(state) };
}
