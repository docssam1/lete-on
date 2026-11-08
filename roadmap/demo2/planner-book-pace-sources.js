// Match dated evidence to a single book, edition and unit of measure.
(function (g) {
  'use strict';
  const limit = 99999, dayMs = 86400000;
  const statuses = {curriculum:'schoolStatus', arithmetic:'calcStatus', thinking:'thinkingStatus'};
  const laneIds = {curriculum:'school', arithmetic:'calc', thinking:'thinking'};
  const key = (...parts) => JSON.stringify(parts);
  const compact = s => String(s || '').replace(/\s+/g,'');
  const validDay = s => g.PlannerMockFeedback.dayOK(s);
  const position = n => Number.isSafeInteger(n) && n >= 0 && n <= limit;

  function parts(value) {
    try { const a = JSON.parse(value); return Array.isArray(a) ? a : []; } catch { return []; }
  }

  // A roadmap month is a calendar month. Preserve the anchor's day where possible
  // (e.g. Jan 31 + one month is Feb 28). Fractional blocks occupy part of a month.
  function atMonth(anchor, amount) {
    const day = new Date(anchor + 'T00:00:00Z');
    function boundary(offset) {
      const month = day.getUTCMonth() + offset, year = day.getUTCFullYear();
      const last = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
      return Date.UTC(year, month, Math.min(day.getUTCDate(),last));
    }
    const n = Math.floor(amount), start = boundary(n), next = boundary(n + 1);
    return start + dayMs * Math.round((next - start) / dayMs * (amount - n));
  }

  function sameBlock(book, title) {
    if (compact(title) === compact(book.title)) return true;
    if (book.track !== 'curriculum') return false;
    const [stage, name] = parts(parts(book.id)[2]);
    if (!stage || !name) return false;
    // A scheduled high-school block may explicitly pair the reported book with a
    // companion (e.g. 기본정석 + 쎈). A '+' in the product name is significant.
    return compact(String(title).split(/\s+\+\s+/)[0]) === compact(stage + name);
  }

  function calendar(book, courses, program, context) {
    const track = courses?.tracks?.[book.track];
    const block = track?.blocks?.find(b => sameBlock(book,b.title));
    if (!block || !Number.isFinite(block.start) || !Number.isFinite(block.end) ||
        block.start < 0 || block.end <= block.start || block.end > 240) return {};
    const {year,mon} = context.fields || {};
    const monthly = year + '-' + String(mon).padStart(2,'0') + '-01';
    const anchor = validDay(program?.startDate) ? [program.startDate, track.changedOn].filter(validDay).sort().at(-1) : monthly;
    if (!validDay(anchor)) return {};
    const source = context.mock?.lanes?.find(l => l.id === laneIds[book.track])?.blocks?.find(b =>
      sameBlock(book,b.title) && b.start === block.start && b.end === block.end);
    const openEnd = block.continues || block.endClipped || source?.continues || source?.endClipped;
    return {startDate:new Date(atMonth(anchor,block.start)).toISOString().slice(0,10),
      endDate:openEnd ? null : new Date(atMonth(anchor,block.end) - dayMs).toISOString().slice(0,10),
      calendarSource:validDay(program?.startDate) ? 'weekly' : 'monthly'};
  }

  // Accept one explicit numbered page/chapter range. A chapter heading attached
  // to page work does not attest to independent solving of the entire chapter.
  function interval(label) {
    const text = String(label || '').normalize('NFKC');
    const page = /(?:\bpp?\.?\s*(\d{1,5})(?:\s*[~～–—-]\s*(?:pp?\.?\s*)?(\d{1,5}))?|(\d{1,5})(?:\s*(?:쪽|페이지)?\s*[~～–—-]\s*(\d{1,5}))?\s*(?:쪽|페이지))/gi;
    const pages = Array.from(text.matchAll(page));
    if (pages.length === 1) {
      const m = pages[0];
      const a = Number(m[1] || m[3]), b = Number(m[2] || m[4] || a);
      // If an adjacent digit or separator remains, the range was partial or ambiguous.
      const rest = text.slice(0,m.index) + ' ' + text.slice(m.index + m[0].length);
      if (a > 0 && b >= a && !/[~～–—]|\d\s*[-,]\s*$/.test(rest) &&
          !/\d$/.test(text.slice(0,m.index))) return {unit:'page',start:a,end:b};
    }
    if (pages.length) return null;
    // Only a whole named chapter/range counts, never "3단원 확인 문제 1~5번".
    const ch = text.trim().match(/^(?:제\s*)?(\d{1,3})(?:\s*(?:단원)?\s*[~～–—-]\s*(?:제\s*)?(\d{1,3}))?\s*단원(?:\s*전체)?$/);
    return ch && +ch[1] > 0 && +(ch[2] || ch[1]) >= +ch[1] ?
      {unit:'chapter',start:+ch[1],end:+(ch[2] || ch[1])} : null;
  }

  function assignedRange(item, book) {
    if (item?.kind !== 'book' || item.track !== book.track) return null;
    const id = parts(item.id), u = parts(item.unitId);
    const numeric = id[0] === 'manual' && id[1] === book.rangeId;
    const catalog = id[0] === 'book' && key('range',id[1],id[2]) === book.rangeId && id[3] === item.unitId;
    if (!numeric && !catalog) return null;
    if (u[0] === 'edition' && book.editionId === u[1]) {
      const n = book.chapterIds.indexOf(String(u[2])) + 1;
      if (n) return {unit:'chapter',start:n,end:n};
    }
    if (numeric && (id[3] || null) === book.editionId) return interval(id[2]);
    return null;
  }

  function registration(book, current, context, a) {
    const isCurrent = current.has(book.id);
    const status = statuses[book.track];
    const p = isCurrent && !context.fields?.pendingStatus?.[status] && g.PlannerIntake.progressValue(a,status);
    const measured = p && !p.estimated && position(p.done) && position(p.total) &&
      p.total > p.done && ['unit','page'].includes(p.unit) ? p : null;
    if (!isCurrent || book.track !== 'curriculum') return {measured};
    const descriptor = g.PlannerBookChecks.descriptor('school',context.answers,context.fields);
    const edition = g.PlannerBookChecks.model(context.bookChecks,descriptor);
    return {measured, edition:edition.confirmed ? edition : null};
  }

  function observations(book, unit, explicit = []) {
    const dates = new Map();
    function day(date) {
      if (!dates.has(date)) dates.set(date,{ranges:[],reported:null});
      return dates.get(date);
    }
    for (const row of book.ranges || []) {
      if (row.unit === unit) day(row.date).ranges.push(row);
    }
    for (const row of Array.isArray(explicit) ? explicit : []) {
      const date = row?.date;
      if ((!row?.unit || row.unit === unit) && position(row.position) && validDay(date) && date <= book.today)
        day(date).reported = row.position;
    }
    const covered = new Uint8Array(limit + 2), history = [];
    let previous = null;
    for (const [date, evidence] of [...dates].sort(([a],[b]) => a.localeCompare(b))) {
      const {ranges,reported} = evidence;
      for (const range of ranges) if (range.solo) covered.fill(1,range.start,range.end + 1);
      // A studied-only item supplies no new independent evidence; it also does
      // not revoke a separate direct cumulative report for an overlapping range.
      if (reported !== null) {
        covered.fill(0,1);
        covered.fill(1,1,reported + 1);
      }
      const n = covered.indexOf(0,1) - 1;
      if (reported === null && (n === 0 || previous === n)) continue;
      history.push({date,position:n,unit,manual:reported !== null});
      previous = n;
    }
    return history;
  }

  function build({source,context = {},program,courses,records,today = g.PlannerWeeklyModel.today()} = {}) {
    const ctx = {...context,fields:context.fields || {},answers:context.answers || {}};
    const a = g.PlannerIntake.effective(ctx.answers);
    // The session-based projection can move on while the child's actual book is
    // still in progress. Keep the intake choice available in that case.
    const actual = g.PlannerUnitSources.build({...ctx,weekStart:today,today,week:null,mock:null}).manualBooks;
    const current = new Set(actual.map(b => b.id));
    const all = new Map(actual.map(b => [b.id,b]));
    for (const book of source?.manualBooks || []) if (!all.has(book.id)) all.set(book.id,book);
    const logs = g.PlannerUnitChecks.restore(records).entries;
    const books = [...all.values()].map(raw => {
      const {measured,edition} = registration(raw,current,ctx,a);
      const chapterIds = (edition?.units || []).map(u => u.id);
      const chapters = (edition?.units || []).map(u => u.title);
      const editionId = edition?.book.id || null;
      const unit = measured?.unit === 'page' ? 'page' : measured?.unit === 'unit' || chapters.length ? 'chapter' : null;
      const total = unit === 'chapter' && chapters.length ? chapters.length : measured?.total ?? null;
      const startPosition = measured?.total === total ? measured.done : null;
      const dates = calendar(raw,courses,program,ctx);
      const suggested = {unit,total,startPosition,endPosition:total,startDate:dates.startDate || null,endDate:dates.endDate || null};
      const complete = unit && startPosition !== null && suggested.startDate && suggested.endDate > suggested.startDate;
      const prefix = edition?.units.findIndex(u => u.status !== 'independent');
      const known = prefix === -1 ? chapters.length : prefix;
      const book = {id:key(raw.id,editionId),rangeId:raw.id,title:raw.title,track:raw.track,editionId,edition:edition?.book.title || null,
        chapterIds,chapters,today,suggested,defaultGoal:complete ? {...suggested} : null,calendarSource:dates.calendarSource || null,
        undatedPosition:known > 0 ? known : null,ranges:[]};
      for (const {item,marks} of logs) {
        const range = assignedRange(item,book);
        if (!range) continue;
        for (const [week,bits,when] of marks) {
          const date = when || week;
          if (date <= today) book.ranges.push({...range,date,solo:!!(bits & 2)});
        }
      }
      book.observations = [...observations(book,'page'),...observations(book,'chapter')];
      return book;
    });
    return {books};
  }
  g.PlannerBookPaceSources = Object.freeze({build,observations});
})(window);
