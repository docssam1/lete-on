// Optional student notes are evidence of what the learner wrote, never model answers.
export const escapeText = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const brightnessLabels = {off:'꺼짐',dim:'약하게 켜짐',bright:'밝게 켜짐',other:'다른 결과 / 잘 모르겠어요'};
export const noteKeys = ['predictionReason','trouble','changedThought','nextQuestion'];
const plain = value => value && typeof value === 'object' && !Array.isArray(value) ? value : {};
export function prepareNotebook(state) {
  state.comparisonNotes = plain(state.comparisonNotes);
  state.workbookNotes = plain(state.workbookNotes);
  state.recordSets = plain(state.recordSets);
  state.records = plain(state.records);
  const kind = state.recordKind === 'real' ? 'real' : 'screen';
  state.recordKind = kind;
  // Migrate the previous single-source record without inventing an observation.
  if (!Object.hasOwn(state.recordSets,kind)) state.recordSets[kind] = {...state.records};
  state.records = {...plain(state.recordSets[kind])};
  return state;
}
export function selectRecordSource(state, kind) {
  state.recordSets[state.recordKind] = {...state.records};
  state.recordKind = kind === 'real' ? 'real' : 'screen';
  state.records = {...plain(state.recordSets[state.recordKind])};
}
export function comparisonNote(key, label, state, stopped = false) {
  if (!key) return '<p class="note-empty">전지 한 개 이상을 남긴 비교를 고르면 관찰 메모를 적을 수 있어요.</p>';
  const note = plain(state.comparisonNotes[key]);
  return `<details class="notebook-note"><summary>${escapeText(label)} · 내가 본 결과 적기 <small>선택</small></summary><div class="notebook-fields"><p>직접 본 것을 골라요. 예상과 달라도 괜찮아요.</p><label for="comparison-brightness">내 눈에 보인 밝기</label><select id="comparison-brightness" data-comparison-brightness="${key}" ${stopped?'disabled':''}><option value="">아직 적지 않았어요</option>${Object.entries(brightnessLabels).map(([value,text])=>`<option value="${value}" ${note.brightness===value?'selected':''}>${text}</option>`).join('')}</select><label for="comparison-reason">어느 길을 보고 그렇게 생각했나요?</label><textarea id="comparison-reason" data-comparison-reason="${key}" rows="2" maxlength="1200" ${stopped?'disabled':''}>${escapeText(note.reason)}</textarea><p class="note-save" aria-live="polite">내가 적은 내용은 ‘교재 보기 → 내 기록’에 이어져요.</p></div></details>`;
}
function field(key, title, hint, state) {
  return `<details class="notebook-note"><summary>${title} <small>선택 기록</small></summary><div class="notebook-fields"><label for="note-${key}">${hint}</label><textarea id="note-${key}" data-workbook-note="${key}" rows="3" maxlength="1800">${escapeText(state.workbookNotes[key])}</textarea><p class="note-save" aria-live="polite">이 기기에 저장하고 교재의 내 기록에서 볼 수 있어요.</p></div></details>`;
}
export function notebookSupport(id, state, teacher = false) {
  if (teacher) return '';
  if (id === 'predict') return field('predictionReason','내 예상의 까닭','어떤 연결을 떠올리며 예상했나요?',state);
  if (id === 'test') return field('trouble','다르게 보이거나 막힌 곳','어떤 문제가 있었나요? 어디를 확인하고, 다시 보니 어땠나요?',state);
  if (id === 'concept') return field('changedThought','실험 뒤 달라진 생각','처음 생각과 비교해서 지금은 어떻게 생각하나요?',state);
  if (id === 'finish') return field('nextQuestion','다음에 알아보고 싶은 것','오늘의 실험에서 새로 생긴 질문을 적어요.',state);
  if (id === 'report') return `<details class="notebook-evidence"><summary>내가 남긴 관찰을 보며 설명하기</summary><p><b>처음 예상</b><br>${escapeText(state.prediction||'아직 적지 않았어요')}</p><p><b>내가 적은 ${state.recordKind==='real'?'실물 교구':'화면'} 관찰</b></p><dl>${[['off','가운데'],['low','1단'],['high','2단']].map(([key,label])=>`<div><dt>${label}</dt><dd>${escapeText(brightnessLabels[state.records[key]]||'아직 적지 않았어요')}</dd></div>`).join('')}</dl><p>이 결과를 근거로 스위치가 어떤 길을 고르는지 설명해요.</p></details>`;
  return '';
}
