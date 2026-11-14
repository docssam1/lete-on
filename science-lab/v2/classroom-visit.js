// 열어 본 화면의 위치만 저장한다. 활동 수행·정오·수업 완료를 뜻하지 않는다.
export const CLASSROOM_VISIT_KEY = 'classroomVisit';
const clone = value => JSON.parse(JSON.stringify(value));
const validId = value => typeof value === 'string' && /^[\w:.-]{1,160}$/.test(value);
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const validDescriptor = value => value && validId(value.unit) && typeof value.revision === 'string' && /^[a-f0-9]{16}$/.test(value.revision) && Array.isArray(value.slideIds) && value.slideIds.length > 0 && value.slideIds.length <= 2000 && value.slideIds.every(validId) && new Set(value.slideIds).size === value.slideIds.length;

export function classroomViewDescriptor(unit, slides) {
  if (!validId(unit) || !Array.isArray(slides) || !slides.length || slides.length > 2000) return null;
  const ids = slides.map(slide => slide.id);
  if (!ids.every(validId) || new Set(ids).size !== ids.length) return null;
  // 내용/순서가 달라진 수업을 구별하는 지문이다. 원고·답안을 저장하지 않는다.
  const text = JSON.stringify(slides.map(s => [s.id, s.title, s.kind, s.phase, s.body]));
  let a = 2166136261, b = 5381;
  for (let i = 0; i < text.length; i++) { const c = text.charCodeAt(i); a = Math.imul(a ^ c, 16777619); b = Math.imul(b, 33) ^ c; }
  const revision = [a, b].map(n => (n >>> 0).toString(16).padStart(8, '0')).join('');
  return { unit, revision, slideIds: ids };
}

function validCurrent(unit, value) {
  if (!validDescriptor(value) || value.unit !== unit) return false;
  if (Object.keys(value).some(key => !['unit', 'revision', 'slideIds', 'lastSlideId', 'lastNumber', 'visitedIds', 'updatedAt'].includes(key))) return false;
  const ids = value.slideIds, seen = value.visitedIds;
  if (!Array.isArray(ids) || !ids.length || ids.length > 2000 || !ids.every(validId) || new Set(ids).size !== ids.length) return false;
  if (!Array.isArray(seen) || !seen.length || seen.length > ids.length || new Set(seen).size !== seen.length || !seen.every(id => ids.includes(id))) return false;
  return Number.isInteger(value.lastNumber) && value.lastNumber >= 1 && value.lastNumber <= ids.length && ids[value.lastNumber - 1] === value.lastSlideId && seen.includes(value.lastSlideId) && Number.isSafeInteger(value.updatedAt) && value.updatedAt >= 0;
}
function validRecord(unit, record) {
  return record?.schema === 1 && Object.keys(record).every(key => ['schema', 'current', 'history'].includes(key)) && validCurrent(unit, record.current) && Array.isArray(record.history) && record.history.every(value => validCurrent(unit, value));
}
export function classroomVisitSummary(unit, record) {
  if (!validRecord(unit, record)) return null;
  const c = record.current;
  return { lastNumber: c.lastNumber, total: c.slideIds.length, viewed: c.visitedIds.length, updatedAt: c.updatedAt };
}
export function resumeClassroomIndex(descriptor, record) {
  if (!validDescriptor(descriptor) || !validRecord(descriptor.unit, record) || record.current.revision !== descriptor.revision || !same(record.current.slideIds, descriptor.slideIds)) return 0;
  return record.current.lastNumber - 1;
}
export function recordClassroomView(descriptor, record, index, now) {
  if (!validDescriptor(descriptor) || !Number.isInteger(index) || index < 0 || index >= descriptor.slideIds.length || !Number.isSafeInteger(now) || now < 0) return null;
  // 알 수 없는 형식을 덮어쓰지 않고 이전 원고의 열람 기록도 보존한다.
  if (record != null && !validRecord(descriptor.unit, record)) return null;
  const prior = record?.current;
  const currentVersion = prior?.revision === descriptor.revision && same(prior.slideIds, descriptor.slideIds);
  const seen = new Set(currentVersion ? prior.visitedIds : []);
  seen.add(descriptor.slideIds[index]);
  return { schema: 1, current: { ...clone(descriptor), lastSlideId: descriptor.slideIds[index], lastNumber: index + 1, visitedIds: descriptor.slideIds.filter(id => seen.has(id)), updatedAt: Math.max(now, prior?.updatedAt || 0) }, history: [...clone(record?.history || []), ...(!currentVersion && prior ? [clone(prior)] : [])] };
}

// 적용 단원·학생 모드·화면의 생존은 호출부에서 정한다. 저장 실패로 수업을 막지 않는다.
export function classroomVisitHandlers(unit, store, isActive, now = Date.now) {
  let slidesRef, descriptor;
  const describe = slides => { if (slides !== slidesRef) { slidesRef = slides; descriptor = classroomViewDescriptor(unit, slides); } return descriptor; };
  return {
    resolveResume(slides) {
      if (!isActive()) return 0;
      try { return resumeClassroomIndex(describe(slides), store.get(unit)[CLASSROOM_VISIT_KEY]); } catch { return 0; }
    },
    onView(slides, index) {
      if (!isActive()) return;
      try {
        const next = recordClassroomView(describe(slides), store.get(unit)[CLASSROOM_VISIT_KEY], index, now());
        if (next && isActive()) store.set(unit, { [CLASSROOM_VISIT_KEY]: next });
      } catch { /* 저장할 수 없어도 수업은 계속 연다. */ }
    },
  };
}
