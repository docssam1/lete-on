// Transfer scored item outcomes between the teacher pilot and a member's roadmap.
(function (g) {
  'use strict';
  const schema = 'gfield.assessment-results.v1';
  const key = 'gfield.demo2.assessment-results.v1';
  const phases = ['initial','recheck'];
  const outcomes = ['independent','assisted','wrong','pending','unanswered','unlearned'];
  const tracks = ['curriculum','thinking'];
  const identity = a => JSON.stringify([a.track,a.bookId || '',a.semester,a.unitId,a.id]);
  function label(value,limit) {
    if (typeof value !== 'string' || !value.trim() || value.length > limit || /[\x00-\x1f]/.test(value)) throw Error('결과 파일의 문항 또는 단원 표시를 확인해 주세요.');
    return value.trim();
  }
  function validate(doc, day) {
    if (doc?.schema !== schema || doc.demo || doc.sample || !Array.isArray(doc.attempts) || !doc.attempts.length || doc.attempts.length > 4000)
      throw Error('단원평가에서 내보낸 실제 평가 결과 파일을 선택해 주세요.');
    let count = 0;
    return doc.attempts.map(a => {
      if (!a || !tracks.includes(a.track) || !g.PlannerBookPace.validDay(a.date) || a.date > day ||
        !Array.isArray(a.items) || !a.items.length || a.items.length > 200 || a.demo || a.sample)
        throw Error('평가 날짜·과정·문항 목록을 확인해 주세요.');
      count += a.items.length;
      if (count > 50000) throw Error('한 번에 가져올 수 있는 문항 수를 넘었어요.');
      const clean = {id:label(a.id,180),date:a.date,track:a.track,semester:label(a.semester,100),
        unitId:label(a.unitId,180),unitTitle:label(a.unitTitle || a.unitId,180)};
      if (a.bookId) clean.bookId = label(a.bookId,180);
      clean.items = a.items.map(i => {
        if (!i || !phases.includes(i.phase) || !outcomes.includes(i.outcome)) throw Error('문항의 평가 단계나 풀이 상태를 확인해 주세요.');
        const item = {id:label(i.id,220),phase:i.phase,outcome:i.outcome};
        if (i.typeId) item.typeId=label(i.typeId,220);
        return item;
      });
      return clean;
    });
  }
  function merge(existing,incoming) {
    const rows = new Map(existing.map(a => [identity(a),a]));
    for (const a of incoming) rows.set(identity(a),a);
    return [...rows.values()];
  }
  function compact(a) {
    return [a.id,a.date,a.track,a.semester,a.unitId,a.unitTitle,a.bookId || '',a.items.map(i =>
      [i.id,phases.indexOf(i.phase),outcomes.indexOf(i.outcome),...(i.typeId ? [i.typeId] : [])])];
  }
  function expand(row) {
    const [id,date,track,semester,unitId,unitTitle,bookId,items] = row;
    return {id,date,track,semester,unitId,unitTitle,...(bookId ? {bookId} : {}),items:items.map(([id,p,o,typeId]) =>
      ({id,phase:phases[p],outcome:outcomes[o],...(typeId ? {typeId} : {})}))};
  }
  async function encode(attempts) {
    const text = JSON.stringify(attempts.map(compact));
    if (text.length < 2500 || !g.CompressionStream || !g.DecompressionStream) return '1:'+text;
    const stream = new Blob([text]).stream().pipeThrough(new g.CompressionStream('gzip'));
    const bytes = new Uint8Array(await new Response(stream).arrayBuffer());
    const pieces=[];
    for (let at=0; at<bytes.length; at+=8000) pieces.push(String.fromCharCode(...bytes.subarray(at,at+8000)));
    return 'z:'+btoa(pieces.join(''));
  }
  async function decode(raw) {
    if (!raw) return [];
    let text;
    if (raw.startsWith('z:')) {
      const bytes = Uint8Array.from(atob(raw.slice(2)),c=>c.charCodeAt(0));
      text = await new Response(new Blob([bytes]).stream().pipeThrough(new g.DecompressionStream('gzip'))).text();
    } else if (raw.startsWith('1:')) text = raw.slice(2);
    else throw Error('기존 평가 기록의 형식을 확인할 수 없어요.');
    return JSON.parse(text).map(expand);
  }
  g.PlannerAssessmentRecords=Object.freeze({key,schema,validate,merge,encode,decode});
})(typeof window==='object'?window:globalThis);
