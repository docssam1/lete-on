import { plantActivities, leafPhotos, photoCredit } from '../data/activities/s31-u03.plant.js';
import { PLANT_KEY, emptyPlant, emptyPlantDraft, loadPlant, validPlant, savePlantRecord, plantReportHtml, addLeafSample, reuseLeafSamples } from './plant-records.js';
import { drawingSvg, emptyDrawing, escapeLife as esc } from './life-records.js';
let instance = 0;
export function mountPlant(host, opts = {}) {
  const personal = opts.personal !== false, prefix = `plant-${++instance}`;
  let state = emptyPlant(), tab = plantActivities.some((a) => a.id === opts.tab) ? opts.tab : 'observe', error = '', writable = true, undo = null, disposed = false, lastSaved = false;
  try { if (personal) state = loadPlant(localStorage); } catch (e) { error = e.message; writable = false; }
  host.classList.add('life-notebook', 'plant-notebook');
  const $ = (s) => host.querySelector(s), activity = () => plantActivities.find((a) => a.id === tab), draft = () => state.drafts[tab];
  const announce = (text) => { $('[data-plant-message]').textContent = text; };
  const button = (text, action, attr = '') => `<button type="button" data-plant-action="${action}" ${attr}>${text}</button>`;
  function persist() {
    if (disposed) return;
    let saved = false;
    try { if (personal && writable && validPlant(state)) { localStorage.setItem(PLANT_KEY, JSON.stringify(state)); saved = true; } } catch { error = '기기에 저장하지 못했어요. 기록 파일을 내려받아 보관해 주세요.'; }
    lastSaved = saved;
    const el = $('[data-plant-save]');
    if (el) el.textContent = !personal ? '수업용 임시 기록 · 개인 저장과 분리되어 있어요.' : saved ? '이 기기에 저장했어요.' : error || '저장하지 못했어요. 파일로 기록을 보관해 주세요.';
    const undoButton = $('[data-plant-action=undo]'); if (undoButton) undoButton.disabled = !undo;
    opts.onRecord?.(state.records.map((r) => ({ kind: r.kind, title: plantActivities.find((a) => a.id === r.kind).title })));
  }
  function field(f, value, path) {
    const id = `${prefix}-${path}`;
    return `<div class="life-field"><label for="${id}">${esc(f.label)}</label>${f.hint ? `<p class="life-hint">${esc(f.hint)}</p>` : ''}${f.type === 'date' ? `<input type="date" id="${id}" data-plant-field="${path}" value="${esc(value)}">` : `<textarea id="${id}" data-plant-field="${path}" maxlength="10000">${esc(value)}</textarea>`}</div>`;
  }
  const drawing = () => `<section class="plant-draw"><h3>관찰·설계를 그림으로 남겨요</h3><p class="life-hint" id="${prefix}-draw-help">손가락·마우스로 그려요. 키보드에서는 방향키로 이동하고 Space로 펜을 내리거나 올려요. Enter·Escape는 선을 끝내요.</p><div class="life-board" tabindex="0" role="group" aria-label="관찰·설계 그림 그리는 곳" aria-describedby="${prefix}-draw-help">${drawingSvg(draft().drawing, false)}<span class="life-cursor" aria-hidden="true"></span></div><div class="life-controls">${button('펜 내리기', 'pen', 'aria-pressed="false"')}${[['← 왼쪽','-1,0'],['위쪽 ↑','0,-1'],['오른쪽 →','1,0'],['↓ 아래쪽','0,1']].map(([t,v]) => button(t,'move',`data-dir="${v}"`)).join('')}${button('마지막 선 되돌리기','undo-line')}${button('그림 비우기','clear-drawing')}</div>${field({ label:'그림 설명', hint:'잎의 어느 부분이나 설계의 어떤 기능인지 이름표와 글로도 설명해요.' },draft().drawing.description,'drawing')}</section>`;
  const sampleRows = (d, editable = true) => d.samples.map((r) => {
    const photo=leafPhotos.find((x)=>x.id===r.photoId);
    if(!editable)return `<article><h4>${esc(r.name)}</h4><p><b>출처</b> ${esc(r.source)}</p><p><b>모둠</b> ${esc(({a:d.values.groupA,b:d.values.groupB,unknown:'더 확인'})[r.group]||'미기록')}</p><p><b>근거</b> ${esc(r.evidence)}</p></article>`;
    const id=esc(prefix+'-'+r.id);
    return `<article>${photo?`<img src="${photo.image}" alt="${esc(photo.name)} 잎 관찰 자료">`:''}<label for="${id}-name">잎 이름표</label><input id="${id}-name" maxlength="200" data-sample-id="${esc(r.id)}" data-sample-field="name" value="${esc(r.name)}"><label for="${id}-source">잎 자료 출처·구한 곳</label><textarea id="${id}-source" maxlength="10000" data-sample-id="${esc(r.id)}" data-sample-field="source">${esc(r.source)}</textarea><label for="${id}-group">${esc(r.name||'이 잎')} 모둠</label><select id="${id}-group" data-sample-id="${esc(r.id)}" data-sample-field="group">${[['','아직 정하지 않음'],['a',d.values.groupA||'가 모둠'],['b',d.values.groupB||'나 모둠'],['unknown','더 확인']].map(([v,t])=>`<option value="${v}"${r.group===v?' selected':''}>${esc(t)}</option>`).join('')}</select><label for="${id}-evidence">이 잎을 놓은 근거·더 확인할 부분</label><textarea id="${id}-evidence" maxlength="10000" data-sample-id="${esc(r.id)}" data-sample-field="evidence">${esc(r.evidence)}</textarea>${button('이 분류에서 잎 자료 빼기','remove-sample',`data-id="${esc(r.id)}"`)}</article>`;
  }).join('');
  const groups = () => `<section><h3>내가 분류할 잎 자료 · ${draft().samples.length}개</h3><p>실제 잎과 사진 자료를 출처로 구별해요. 같은 사진의 크기만 비교하여 실제 잎이 더 크다고 하지 않아요.</p><div class="life-controls">${button('잎 이름표 직접 추가','add-sample')}${button('제공 사진 6개 가져오기','photo-samples')}${button('마지막 분류의 잎으로 새 기준 쓰기','reuse-samples')}</div><p class="life-hint">새 기준 쓰기는 잎 자료만 가져와요. 기준·모둠·근거는 새로 쓰고 이전 분류는 보관해요. 작성 중인 내용은 마지막 변경 되돌리기로 복원할 수 있어요.</p><details data-leaf-observations><summary>내 관찰 기록에서 잎 가져오기</summary>${state.records.filter((r)=>r.kind==='observe').map((r)=>button(esc(r.data.values.plant)+' · '+esc(r.data.values.date),'observation-sample',`data-id="${esc(r.id)}"`)).join('')||'<p>보관한 잎 관찰 기록이 아직 없어요.</p>'}</details><div class="plant-cards">${sampleRows(draft())||'<p>분류할 잎 자료를 추가해 주세요.</p>'}</div><p class="life-hint">제공 사진 출처: ${photoCredit}</p></section>`;
  function render() {
    endStroke(); const a = activity(), d = draft();
    host.innerHTML = `<header class="life-heading"><h2>식물의 생활 · 내 탐구 기록</h2><p data-plant-save role="status"></p><div class="life-controls">${button('내 기록 자료 내려받기','html')}${button('기록 파일 보관','json')}<label class="life-file">기록 파일 불러오기<input type="file" accept="application/json,.json" data-plant-import></label></div></header><nav class="life-tabs" aria-label="식물 탐구 활동">${plantActivities.map((x) => button(x.title,'tab',`data-tab="${x.id}" aria-pressed="${tab===x.id}"`)).join('')}</nav><p data-plant-message role="alert"></p><main class="life-pane"><h3>${a.question}</h3><p>${a.intro}</p><details><summary>활동 방법</summary><ol>${a.steps.map((s) => `<li>${esc(s)}</li>`).join('')}</ol></details>${tab==='observe' ? `<div class="plant-cards observation">${leafPhotos.map((x) => `<figure><img src="${x.image}" alt="${x.name} 관찰 자료"><figcaption>${x.name}</figcaption></figure>`).join('')}</div><p class="life-hint">출처: ${photoCredit}</p>` : ''}<form data-plant-form>${a.fields.map((f) => field(f,d.values[f.key],f.key)).join('')}${a.classify?groups():''}${a.draw?drawing():''}<button type="submit" class="life-primary">${d.editingId?'고친 기록 보관':'새 활동 기록 보관'}</button>${button('빈 활동으로 새로 쓰기','new')}</form><h3>보관한 ${a.title} · ${state.records.filter((r)=>r.kind===tab).length}개</h3><div class="life-records">${state.records.filter((r)=>r.kind===tab).map((r) => `<article><h4>${esc(Object.values(r.data.values).find(Boolean) || a.title)}</h4>${a.fields.map((f) => `<p><b>${esc(f.label)}</b><br>${esc(r.data.values[f.key]||'미기록')}</p>`).join('')}${a.classify?`<div class="plant-saved-samples">${sampleRows(r.data,false)}</div>`:''}${a.draw?`<div class="life-thumb">${drawingSvg(r.data.drawing)}</div><p>${esc(r.data.drawing.description)}</p>`:''}${button('이 기록 고치기','edit',`data-id="${esc(r.id)}"`)}${button('이 기록 지우기','remove',`data-id="${esc(r.id)}"`)}</article>`).join('')||'<p>아직 보관한 기록이 없어요. 실제로 한 활동을 적어 보관해요.</p>'}</div></main><div class="life-controls">${button('마지막 기록 변경 되돌리기','undo',undo?'':'disabled')}</div>`;
    if (a.draw) wireDrawing(); persist();
  }
  let stroke = null, down = false, cursor = [320,180], paint = () => {};
  function endStroke() { if (stroke) { stroke=null; persist(); } down=false; }
  function wireDrawing() {
    const board=$('.life-board'), svg=board.querySelector('svg');
    paint=()=>{ svg.innerHTML=new DOMParser().parseFromString(drawingSvg(draft().drawing,false),'image/svg+xml').documentElement.innerHTML; const c=$('.life-cursor');c.style.left=`${cursor[0]/640*100}%`;c.style.top=`${cursor[1]/360*100}%`;const b=$('[data-plant-action=pen]');b.textContent=down?'펜 올리기':'펜 내리기';b.setAttribute('aria-pressed',String(down)); };
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
    const k=e.target.dataset.plantField;
    if(k){if(k==='drawing')draft().drawing.description=e.target.value;else draft().values[k]=e.target.value;
      if(['groupA','groupB'].includes(k))host.querySelectorAll('[data-sample-field=group]').forEach((s)=>{s.querySelector(`option[value="${k==='groupA'?'a':'b'}"]`).textContent=e.target.value||`${k==='groupA'?'가':'나'} 모둠`;});
    } else if(e.target.dataset.sampleId){const row=draft().samples.find((r)=>r.id===e.target.dataset.sampleId);if(!row||!['name','source','group','evidence'].includes(e.target.dataset.sampleField))return;row[e.target.dataset.sampleField]=e.target.value;}else return;
    persist();
  });
  host.addEventListener('submit',(e)=>{if(!e.target.matches('[data-plant-form]'))return;e.preventDefault();snapshot();try{savePlantRecord(state,tab,crypto.randomUUID());render();announce(personal&&!lastSaved?'현재 화면에 기록했지만 기기에는 저장하지 못했어요. 기록 파일을 내려받아 보관해 주세요.':'활동 기록을 보관했어요. 실제 수행과 설계 내용은 선생님과 함께 확인해요.');}catch(err){announce(err.message);}});
  host.addEventListener('click',(e)=>{
    const b=e.target.closest('[data-plant-action]');if(!b)return;const action=b.dataset.plantAction;
    if(action==='tab'){endStroke();tab=b.dataset.tab;render();$(`[data-tab="${tab}"]`).focus({preventScroll:true});}
    else if(action==='pen')$('.life-board')._pen();else if(action==='move')$('.life-board')._move(...b.dataset.dir.split(',').map(Number));
    else if(action==='undo-line'){snapshot();draft().drawing.strokes.pop();paint();persist();}
    else if(action==='clear-drawing'){snapshot();const description=draft().drawing.description;draft().drawing=emptyDrawing();draft().drawing.description=description;paint();persist();announce('그림을 비웠어요. 마지막 변경 되돌리기로 복원할 수 있어요.');}
    else if(action==='undo'&&undo){endStroke();const before=state;state=undo;undo=before;render();announce('마지막 기록 변경을 되돌렸어요.');}
    else if(action==='new'){snapshot();state.drafts[tab]=emptyPlantDraft(activity());render();announce('빈 활동을 열었어요. 이전 보관 기록은 그대로 있어요.');}
    else if(action==='edit'){snapshot();const r=state.records.find((r)=>r.id===b.dataset.id);state.drafts[tab]=structuredClone(r.data);draft().editingId=r.id;render();announce('기록을 수정 중이에요. 고친 기록 보관을 누르면 반영돼요.');}
    else if(action==='remove'){snapshot();state.records=state.records.filter((r)=>r.id!==b.dataset.id);if(draft().editingId===b.dataset.id)draft().editingId='';render();announce('기록을 지웠어요. 마지막 변경 되돌리기로 복원할 수 있어요.');}
    else if(['add-sample','photo-samples','observation-sample','reuse-samples','remove-sample'].includes(action)){
      snapshot();try{
        if(action==='add-sample')addLeafSample(state,{id:crypto.randomUUID()});
        else if(action==='photo-samples'){const pending=leafPhotos.filter((p)=>!draft().samples.some((r)=>r.id==='photo-'+p.id));if(draft().samples.length+pending.length>40)throw Error('한 분류에는 잎 자료를 40개까지 넣을 수 있어요.');for(const p of pending)addLeafSample(state,{id:'photo-'+p.id,name:p.name,source:photoCredit,photoId:p.id});}
        else if(action==='observation-sample'){const r=state.records.find((r)=>r.id===b.dataset.id&&r.kind==='observe');if(!r)throw Error('관찰 기록을 찾지 못했어요.');addLeafSample(state,{id:'observe-'+r.id,name:r.data.values.plant,source:r.data.values.source});}
        else if(action==='reuse-samples')reuseLeafSamples(state);
        else draft().samples=draft().samples.filter((r)=>r.id!==b.dataset.id);
        render();if(action==='observation-sample'){const detail=$('[data-leaf-observations]');if(detail)detail.open=true;[...host.querySelectorAll('[data-plant-action=observation-sample]')].find((x)=>x.dataset.id===b.dataset.id)?.focus({preventScroll:true});}announce('잎 자료를 반영했어요. 출처·분류 기준과 근거를 확인해 주세요.');
      }catch(err){announce(err.message);}
    }
    else if(action==='json'){endStroke();download(JSON.stringify(state,null,2),'application/json','식물의생활-기록.json');}
    else if(action==='html'){endStroke();download(plantReportHtml(state),'text/html;charset=utf-8','식물의생활-내기록.html');}
  });
  host.addEventListener('change',async(e)=>{if(!e.target.matches('[data-plant-import]'))return;const file=e.target.files[0];e.target.value='';if(!file)return;try{if(file.size>8_000_000)throw Error('파일이 너무 커요.');const s=JSON.parse(await file.text());if(disposed)return;if(!validPlant(s))throw Error('이 단원의 올바른 기록 파일이 아니에요. 기존 내용은 보존했어요.');snapshot();state=s;render();announce(writable?'기록 파일을 불러왔어요.':'파일을 열었어요. 기존 기기 기록 보호를 위해 자동 저장은 하지 않아요. 파일로 다시 보관해 주세요.');}catch(err){if(!disposed)announce(err instanceof SyntaxError ? '기록 파일을 읽지 못했어요. 올바른 JSON 파일인지 확인해 주세요. 기존 내용은 보존했어요.' : err.message);}});
  render();if(error)announce(error);
  return { dispose(){endStroke();disposed=true;}, getState:()=>structuredClone(state) };
}
