import { animalActivities, animals } from '../data/activities/s31-u02.animal.js';
import { emptyDrawing, validDrawing, drawingSvg, escapeLife as esc } from './life-records.js';
export const ANIMAL_KEY = 'sciLab.animal.s31-u02';
export const emptyAnimalDraft = (a) => ({ values: Object.fromEntries(a.fields.map((f) => [f.key, ''])), drawing: emptyDrawing(), groups: Object.fromEntries(animals.map((x) => [x.id, { group: '', evidence: '' }])), editingId: '' });
export const emptyAnimal = () => ({ version: 1, drafts: Object.fromEntries(animalActivities.map((a) => [a.id, emptyAnimalDraft(a)])), records: [] });
const text = (v) => typeof v === 'string' && v.length <= 10000;
const date = (s) => { if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false; const d = new Date(s + 'T00:00:00Z'); return Number.isFinite(+d) && d.toISOString().slice(0, 10) === s; };
const validDraft = (a, d) => d && a.fields.every((f) => text(d.values?.[f.key]) && (f.type !== 'date' || !d.values[f.key] || date(d.values[f.key]))) && validDrawing(d.drawing) && text(d.editingId) && animals.every((x) => ['', 'a', 'b', 'unknown'].includes(d.groups?.[x.id]?.group) && text(d.groups[x.id].evidence));
export function validAnimal(s) {
  return s?.version === 1 && animalActivities.every((a) => validDraft(a, s.drafts?.[a.id])) && Array.isArray(s.records) && s.records.length <= 200 && new Set(s.records.map((r) => r.id)).size === s.records.length && s.records.every((r) => typeof r.id === 'string' && r.id.length > 0 && r.id.length <= 200 && animalActivities.some((a) => a.id === r.kind && validDraft(a, r.data)));
}
export function animalDraftError(a, d) {
  if (!validDraft(a, d)) return '기록 형식과 날짜·그림을 확인해 주세요.';
  const missing = a.required.find((k) => !d.values[k].trim());
  if (missing) return `${a.fields.find((f) => f.key === missing).label}을 적어 주세요.`;
  if (a.classify && d.values.groupA.trim() === d.values.groupB.trim()) return '두 모둠 이름을 서로 구별해 주세요.';
  if (a.classify && animals.some((x) => !d.groups[x.id].group || !d.groups[x.id].evidence.trim())) return '각 동물의 모둠과 근거를 적어 주세요. 자료가 부족하면 더 확인을 골라요.';
  return '';
}
export function saveAnimalRecord(s, kind, id) {
  const a = animalActivities.find((a) => a.id === kind), d = s.drafts[kind], error = a && animalDraftError(a, d);
  if (!a || error) throw Error(error || '활동을 확인해 주세요.');
  const target = d.editingId || id, record = { id: target, kind, data: structuredClone(d) };
  record.data.editingId = '';
  const ix = s.records.findIndex((r) => r.id === target);
  if (ix < 0) { if (s.records.length >= 200 || s.records.some((r) => r.id === id)) throw Error('기록 수나 이름을 확인해 주세요.'); s.records.push(record); }
  else { if (s.records[ix].kind !== kind) throw Error('수정할 기록의 활동이 달라요.'); s.records[ix] = record; }
  s.drafts[kind] = emptyAnimalDraft(a); return record;
}
export function loadAnimal(storage) {
  try { const raw = storage.getItem(ANIMAL_KEY); if (!raw) return emptyAnimal(); const s = JSON.parse(raw); if (!validAnimal(s)) throw Error(); return s; }
  catch { throw Error('저장된 기록을 읽지 못했어요. 기존 기록은 덮어쓰지 않아요. 현재 내용은 기록 파일로 보관해 주세요.'); }
}
export function animalReportSections(s) {
  if (!validAnimal(s)) return {};
  return Object.fromEntries(animalActivities.map((a) => [`animal.${a.id}`, s.records.filter((r) => r.kind === a.id).map((r, i) => {
    const d = r.data;
    return `${a.title} ${i + 1}\n` + a.fields.map((f) => `${f.label}: ${d.values[f.key] || '미기록'}`).join('\n')
      + (a.classify ? '\n' + animals.map((x) => `${x.name}: ${({ a: d.values.groupA, b: d.values.groupB, unknown: '더 확인' })[d.groups[x.id].group] || '미기록'} / 근거: ${d.groups[x.id].evidence || '미기록'}`).join('\n') : '')
      + (a.draw ? `\n그림 설명: ${d.drawing.description || '미기록'} · 실제 그림은 내 탐구 기록의 내려받는 자료에 함께 있어요.` : '');
  }).join('\n\n')]));
}
export function animalReportHtml(s) {
  if (!validAnimal(s)) throw Error('기록 형식을 확인해 주세요.');
  const line = (label, value) => `<h2>${esc(label)}</h2><p>${esc(value || '미기록').replace(/\n/g, '<br>')}</p>`;
  const records = s.records.map((r) => {
    const a = animalActivities.find((a) => a.id === r.kind), d = r.data;
    return `<section class="sheet"><header>GFIELD · 동물의 생활 · 내가 보관한 활동 기록</header><h1>${esc(a.title)}</h1>${a.fields.map((f) => line(f.label, d.values[f.key])).join('')}${a.classify ? `<table><thead><tr><th>동물</th><th>모둠</th><th>근거</th></tr></thead><tbody>${animals.map((x) => `<tr><td>${x.name}</td><td>${esc(({ a: d.values.groupA, b: d.values.groupB, unknown: '더 확인' })[d.groups[x.id].group] || '미기록')}</td><td>${esc(d.groups[x.id].evidence)}</td></tr>`).join('')}</tbody></table>` : ''}${a.draw ? `<figure class="drawing-group"><div class="drawing">${drawingSvg(d.drawing)}</div>${line('그림 설명', d.drawing.description)}</figure>` : ''}<footer>학생이 입력한 기록입니다. 실제 수행 여부와 열린 설계는 선생님과 함께 확인해요.</footer></section>`;
  }).join('');
  return `<!doctype html><html lang="ko"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>동물의 생활 · 내 활동 기록</title><style>*{box-sizing:border-box}body{font:16px/1.7 'Pretendard','Apple SD Gothic Neo',sans-serif;color:#182230;background:#f5f6f8;margin:0}.sheet{max-width:210mm;margin:16px auto;padding:18mm;background:white;overflow-wrap:anywhere;break-after:page}.sheet:last-child{break-after:auto}.report-note{max-width:186mm;margin:16px auto;padding:8px;color:#566274;font-size:13px}h1{font-size:25px}h2{font-size:17px;margin-bottom:8px}p{white-space:normal}header,footer{color:#566274;font-size:12px}table{width:100%;border-collapse:collapse;font-size:14px}th,td{border:1px solid #566274;padding:8px;text-align:left}tr,.drawing-group{break-inside:avoid}.drawing-group{margin:16px 0}svg{display:block;width:100%;height:auto}.drawing{border:1px solid #566274;margin:16px 0}@page{size:A4;margin:14mm 12mm}@media print{body{background:white}body:before{content:'GFIELD · 지필드';position:fixed;top:45%;left:15%;transform:rotate(-30deg);font-size:40px;opacity:.07;pointer-events:none}.sheet{padding:0;margin:0;max-width:none}thead{display:table-header-group}}@media(max-width:600px){.sheet{margin:8px;padding:20px}}</style><body><p class="report-note">이 자료에는 보관한 기록만 들어 있어요. 작성 중인 내용까지 옮기려면 기록 파일(JSON)을 함께 보관해 주세요.</p>${records || '<section class="sheet"><h1>동물의 생활 · 내 활동 기록</h1><p>아직 보관한 활동 기록이 없어요.</p></section>'}</body></html>`;
}
