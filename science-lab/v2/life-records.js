// 한살이의 실제 관찰 기록. 비어 있는 기록에서 결과나 완료 상태를 만들지 않는다.
import { performance } from '../data/activities/s31-u04.performance.js';
export const LIFE_KEY = 'sciLab.life.s31-u04';
export const escapeLife = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const copy = (v) => JSON.parse(JSON.stringify(v));
export const emptyDrawing = () => ({ strokes: [], description: '' });
const emptyExperiment = () => ({ question: '', hypothesis: '', change: '', same: '', measure: '', rows: [], conclusion: '' });
const emptyResultDraft = () => ({ date: '', a: '', b: '', fact: '' });
export const emptyLife = () => ({ version: 1, observations: [],
  draft: { date: '', species: '', stage: '', facts: '', thought: '', editingId: '', drawing: emptyDrawing() },
  experimentDraft: emptyResultDraft(), experiment: emptyExperiment(),
  experimentId: 'legacy', experimentArchives: [],
  drawings: { original: emptyDrawing(), similar: emptyDrawing() },
  intro: { title: '', species: '', sequence: '', evidence: '', audience: '', method: '', sharedDate: '', question: '', revision: '' },
});
export function validDrawing(d) {
  return d && typeof d.description === 'string' && Array.isArray(d.strokes) && d.strokes.length <= 500
    && d.strokes.reduce((n, s) => n + (Array.isArray(s) ? s.length : 20001), 0) <= 20000
    && d.strokes.every((s) => Array.isArray(s) && s.length > 0 && s.every((p) => Array.isArray(p) && p.length === 2 && p.every(Number.isFinite) && p[0] >= 0 && p[0] <= 640 && p[1] >= 0 && p[1] <= 360));
}
const textFields = (o, names) => o && names.every((k) => typeof o[k] === 'string' && o[k].length <= 10000);
const validDate = (s) => /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(Date.parse(s)) && new Date(s).toISOString().slice(0, 10) === s;
const distinctIds = (rows) => rows.every((r) => r.id) && new Set(rows.map((r) => r.id)).size === rows.length;
const validExperiment = (ex) => textFields(ex, ['question', 'hypothesis', 'change', 'same', 'measure', 'conclusion'])
  && Array.isArray(ex.rows) && ex.rows.length <= 500
  && ex.rows.every((r) => textFields(r, ['id', 'date', 'a', 'b', 'fact']) && validDate(r.date) && (r.question === undefined || textFields(r, ['question']))) && distinctIds(ex.rows);
const validArchives = (s) => s.experimentArchives === undefined ? s.experimentId === undefined
  : textFields(s, ['experimentId']) && !!s.experimentId && Array.isArray(s.experimentArchives) && s.experimentArchives.length < 50
    && s.experimentArchives.every((a) => textFields(a, ['id']) && a.id !== s.experimentId && validExperiment(a.experiment) && textFields(a.draft, ['date', 'a', 'b', 'fact'])) && distinctIds(s.experimentArchives);
export function validLife(s) {
  return s?.version === 1 && Array.isArray(s.observations) && s.observations.length <= 500
    && textFields(s.draft, ['date', 'species', 'stage', 'facts', 'thought', 'editingId']) && validDrawing(s.draft.drawing)
    && textFields(s.experimentDraft, ['date', 'a', 'b', 'fact'])
    && s.observations.every((r) => textFields(r, ['id', 'date', 'species', 'stage', 'facts', 'thought']) && validDate(r.date) && validDrawing(r.drawing)) && distinctIds(s.observations)
    && validExperiment(s.experiment) && validArchives(s)
    && validDrawing(s.drawings?.original) && validDrawing(s.drawings?.similar)
    && textFields(s.intro, ['title', 'species', 'sequence', 'evidence', 'audience', 'method', 'sharedDate', 'question', 'revision']);
}
// 이전 한 실험 파일도 그대로 읽는다. 새 저장은 별도 실험 목록을 함께 보관한다.
export function normalizeLife(s) {
  if (!validLife(s)) throw Error('기록 형식이 올바르지 않습니다.');
  const next = copy(s); next.experimentId ??= 'legacy'; next.experimentArchives ??= []; return next;
}
export const lifeExperiments = (s) => [...(s.experimentArchives || []).map((a) => ({ id: a.id, experiment: a.experiment, draft: a.draft })), { id: s.experimentId || 'legacy', experiment: s.experiment, draft: s.experimentDraft }];
export function newLifeExperiment(s, id, plan = {}) {
  const next = normalizeLife(s);
  if (!id || lifeExperiments(next).some((a) => a.id === id)) return { state: s, error: '실험 이름표를 새로 만들지 못했어요. 다시 시도해 주세요.' };
  if (next.experimentArchives.length >= 49) return { state: s, error: '실험이 50개예요. 기록 파일로 보관한 뒤 새 활동을 준비해 주세요.' };
  next.experimentArchives.push({ id: next.experimentId, experiment: next.experiment, draft: next.experimentDraft });
  next.experimentId = id; next.experiment = { ...emptyExperiment(), ...plan, rows: [] }; next.experimentDraft = emptyResultDraft();
  if (!validLife(next)) return { state: s, error: '실험 계획을 읽지 못했어요. 기존 내용은 유지했어요.' };
  return { state: next, error: '' };
}
export function selectLifeExperiment(s, id) {
  const next = normalizeLife(s), ix = next.experimentArchives.findIndex((a) => a.id === id);
  if (id === next.experimentId) return next;
  if (ix < 0) throw Error('보관한 실험을 찾지 못했습니다.');
  const selected = next.experimentArchives[ix];
  next.experimentArchives[ix] = { id: next.experimentId, experiment: next.experiment, draft: next.experimentDraft };
  next.experimentId = selected.id; next.experiment = selected.experiment; next.experimentDraft = selected.draft; return next;
}
export function loadLife(storage) {
  try { const raw = storage.getItem(LIFE_KEY); if (!raw) return { state: emptyLife(), error: '' };
    const state = normalizeLife(JSON.parse(raw)); return { state, error: '' };
  } catch { return { state: emptyLife(), error: '저장된 기록을 읽지 못했어요. 기존 저장 자료는 덮어쓰지 않아요. 현재 작성 내용은 파일로 보관할 수 있어요.' }; }
}
export function saveLife(storage, state) {
  if (!validLife(state)) return false;
  try { storage.setItem(LIFE_KEY, JSON.stringify(state)); return true; } catch { return false; }
}
export function observationError(draft) {
  if (!validDate(draft.date)) return '관찰한 날짜를 적어 주세요.';
  if (!draft.species.trim()) return '관찰한 생물의 이름을 적어 주세요.';
  if (!draft.facts.trim()) return '직접 본 모습이나 행동을 글로 적어 주세요.';
  if (!draft.drawing.strokes.length) return '직접 본 모습을 그림으로도 남겨 주세요. 방향 단추와 펜 단추로도 그릴 수 있어요.';
  return '';
}
export function addObservation(state, id) {
  const error = observationError(state.draft); if (error) return { state, error };
  if (state.observations.length >= 500 && !state.observations.some((r) => r.id === id)) return { state, error: '기록이 500개예요. 파일로 보관하고 필요한 기록을 정리해 주세요.' };
  const next = copy(state), record = { ...copy(state.draft), id }; delete record.editingId;
  const ix = next.observations.findIndex((r) => r.id === id);
  if (ix >= 0) next.observations[ix] = record; else next.observations.push(record);
  next.observations.sort((a, b) => a.date.localeCompare(b.date));
  next.draft = { ...emptyLife().draft, species: record.species };
  return { state: next, error: '' };
}
export function experimentError(e, row) {
  if (['question', 'hypothesis', 'change', 'same', 'measure'].some((k) => !e[k].trim())) return '탐구 문제·예상·다르게 할 조건·같게 할 조건·관찰 방법을 먼저 적어 주세요.';
  if (!validDate(row.date) || ['a', 'b', 'fact'].some((k) => !row[k].trim())) return '실험 날짜와 두 조건에서 실제로 본 결과, 비교한 사실을 모두 적어 주세요.';
  if (e.rows.length >= 500) return '실험 기록이 500개예요. 파일로 보관하고 필요한 기록을 정리해 주세요.';
  return '';
}
export function lifeRows(s) {
  return s.observations.map((r) => ({ date: r.date, species: r.species, stage: r.stage, facts: r.facts, kind: '실제 관찰 입력' }))
    .concat(lifeExperiments(s).flatMap(({ experiment: ex }) => ex.rows.map((r) => ({ date: r.date, species: r.question ?? ex.question, stage: '비교 실험', facts: `가: ${r.a} / 나: ${r.b} / ${r.fact}`, kind: '실제 관찰 입력' }))));
}
export function drawingSvg(d, accessible = true) {
  const shapes = (validDrawing(d) ? d.strokes : []).map((s) => s.length === 1
    ? `<circle cx="${s[0][0]}" cy="${s[0][1]}" r="2" fill="#182230"/>`
    : `<polyline points="${s.map((p) => p.join(',')).join(' ')}" fill="none" stroke="#182230" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360"${accessible ? ' role="img" aria-label="내가 직접 그린 그림"' : ''}>${shapes}</svg>`;
}
// 다운로드한 HTML은 외부 스크립트·추적·전송 없이 열고 인쇄할 수 있다.
export function lifeReportHtml(s, { figureData = {} } = {}) {
  const e = escapeLife, text = (t) => e(t || '미기록').replace(/\n/g, '<br>');
  const line = (label, value) => `<p><b>${e(label)}</b><br>${text(value)}</p>`;
  const sheet = (title, body) => `<section class="sheet"><div class="watermark" aria-hidden="true">GFIELD · 지필드</div><header>지필드 과학 탐구 · 생물의 한살이</header><h1>${e(title)}</h1>${body}<footer>직접 작성한 학습 기록 · 자동 채점 결과가 아니에요</footer></section>`;
  const obs = s.observations.length ? s.observations.map((r, i) => sheet(`관찰 기록 ${i + 1}`, line('관찰 날짜', r.date) + line('생물·단계', [r.species, r.stage].filter(Boolean).join(' · '))
    + line('직접 본 사실', r.facts) + `<div class="drawing">${drawingSvg(r.drawing)}</div>` + line('그림 설명', r.drawing.description) + line('내 생각·궁금한 점', r.thought))).join('') : sheet('관찰 기록', '<p>아직 기록한 관찰이 없어요.</p>');
  const experiment = lifeExperiments(s).map(({ experiment: ex }, ix) => {
  const table = ex.rows.length ? `<table><thead><tr><th>날짜</th><th>가의 실제 결과</th><th>나의 실제 결과</th><th>비교한 사실</th></tr></thead><tbody>${ex.rows.map((r) => `<tr>${[r.date + (r.question !== undefined && r.question !== ex.question ? ` · 기록 당시 문제: ${r.question}` : ''), r.a, r.b, r.fact].map((v) => `<td>${text(v)}</td>`).join('')}</tr>`).join('')}</tbody></table>` : '<p>실험 결과: 미기록</p>';
  return sheet(`비교 실험 ${ix + 1} · 계획`, line('탐구 문제', ex.question) + line('실험 전 예상', ex.hypothesis) + line('다르게 할 조건', ex.change) + line('같게 할 조건', ex.same) + line('관찰·측정 방법', ex.measure))
    + sheet(`비교 실험 ${ix + 1} · 결과와 결론`, line('탐구 문제', ex.question) + table + line('기록을 근거로 쓴 결론', ex.conclusion));
  }).join('');
  const drawings = performance.map((a) => sheet(a.label,
    `<p>${e(a.context)}</p>${/^data:image\/webp;base64,[a-z0-9+/=]+$/i.test(figureData[a.key] || '') ? `<img class="reference-photo" src="${figureData[a.key]}" alt="${e(a.figureAlt)}">` : ''}<p>${e(a.prompt)}</p><div class="drawing">${drawingSvg(s.drawings[a.key])}</div>` + line('그림 설명', s.drawings[a.key].description) + '<p>그림과 설명은 선생님과 함께 확인해요. 자동으로 점수를 매기지 않아요.</p>' + (a.sourceCaption ? `<p>${e(a.sourceCaption)}</p>` : ''))).join('');
  const intro = s.intro, shared = intro.sharedDate && intro.audience && intro.method ? `학생이 적은 공유 기록: ${intro.sharedDate} · ${intro.audience} · ${intro.method}` : '아직 공유 기록이 없어요.';
  return `<!doctype html><html lang="ko"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>생물의 한살이 · 내 탐구 기록</title><style>
    *{box-sizing:border-box}body{margin:0;background:#f5f6f8;color:#182230;font:16px/1.7 'Pretendard','Apple SD Gothic Neo','Malgun Gothic',sans-serif}.sheet{position:relative;isolation:isolate;background:white;max-width:210mm;min-height:270mm;margin:16px auto;padding:18mm;overflow-wrap:anywhere;break-after:page}.sheet:last-child{break-after:auto}.sheet>*:not(.watermark){position:relative}header,footer{font-size:12px;color:#566274}footer{margin-top:24px}h1{font-size:24px}table{width:100%;border-collapse:collapse;font-size:14px}th,td{border:1px solid #566274;padding:8px;vertical-align:top}thead{display:table-header-group}tr{break-inside:avoid}.reference-photo{display:block;width:240px;max-width:100%;height:auto;margin:12px 0}.drawing{border:1px solid #566274;break-inside:avoid}.drawing svg{display:block;width:100%;height:auto}.watermark{position:absolute;top:45%;left:15%;transform:rotate(-30deg);font-size:40px;color:#e1e5ec;z-index:-1;pointer-events:none}@page{size:A4;margin:10mm}@media print{body{background:white}.sheet{margin:0;padding:8mm;min-height:270mm;max-width:none}.watermark{display:none}body::before{content:"GFIELD · 지필드";position:fixed;top:45%;left:15%;transform:rotate(-30deg);font-size:40px;color:#182230;opacity:.08;z-index:100;pointer-events:none}p{orphans:3;widows:3}}@media(max-width:600px){.sheet{padding:20px;margin:12px;min-height:auto}table{font-size:12px}th,td{padding:4px}}
    </style>${obs}${experiment}${drawings}${sheet(intro.title || '한살이 소개 자료', line('소개할 생물', intro.species) + line('한살이 순서와 특징', intro.sequence) + line('내 기록에서 찾은 근거', intro.evidence) + '<p>' + e(shared) + '</p>' + line('들은 질문', intro.question) + line('자료를 고치거나 더 관찰할 점', intro.revision))}</html>`;
}
