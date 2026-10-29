// 학생별 학습 진도표(원장 2026-10-29 「학생 개인에 대한 학습 진도 상황표 · 진도표가 쭉 나왔으면 · 명절은 빼고 ·
//   빠진 날이 있으면 진도가 밀리고 보강을 하면 줄어들도록 보강하기 기능도」) — 계산만 한다. 화면은 plan.js.
//   차시 순서: 시작 진도(권·단원·차시)부터 끝 권까지 단원마다 1차시, 2차시 …(sessionCount)
//   날짜: 시작일부터 수업 요일마다 한 차시. 명절(아래 표)·쉬는 날은 건너뛰고, 결석한 날은 그 차시가 다음 수업으로 밀리고,
//         보강한 날(요일과 상관없이)은 한 차시를 더 해서 밀린 만큼 당겨진다.
import { sessionCount } from "./study-deck.js?v=20261029f";

// 명절(설·추석 연휴와 그 대체공휴일). 관보·월력요항으로 해마다 확인해 더한다.
// 2027 설은 한국 시간으로 2월 7일(일) — 그래서 2월 6~8일에 대체공휴일 9일. 2028 추석 당일은 개천절과 겹쳐 10월 5일이 대체공휴일.
export const HOLIDAYS = Object.freeze([
  { name: "설날 연휴", dates: ["2026-02-16", "2026-02-17", "2026-02-18"] },
  { name: "추석 연휴", dates: ["2026-09-24", "2026-09-25", "2026-09-26"] },
  { name: "설날 연휴", dates: ["2027-02-06", "2027-02-07", "2027-02-08", "2027-02-09"] },
  { name: "추석 연휴", dates: ["2027-09-14", "2027-09-15", "2027-09-16"] },
  { name: "설날 연휴", dates: ["2028-01-26", "2028-01-27", "2028-01-28"] },
  { name: "추석 연휴", dates: ["2028-10-02", "2028-10-03", "2028-10-04", "2028-10-05"] }
]);
const HOLIDAY_OF = new Map(HOLIDAYS.flatMap(({ name, dates }) => dates.map((date) => [date, name])));
export const holidayName = (date) => HOLIDAY_OF.get(date) || "";

export const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];
const pad = (n) => String(n).padStart(2, "0");
export const ymd = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const parseYmd = (text) => { const [y, m, d] = String(text).split("-").map(Number); return new Date(y, (m || 1) - 1, d || 1); };
export const today = () => ymd(new Date());

export function defaultPlan(curriculum) {
  return { start: today(), days: [2, 4], from: { book: curriculum[0].id, unit: 0, part: 1 }, toBook: curriculum.at(-1).id, holidays: true, off: [], absent: [], makeup: [] };
}

// 시작 진도부터 끝 권까지의 차시 { book, unit, part, parts, lastPart, booktest }
export function sessionSequence(curriculum, from, toBook) {
  const out = [];
  const first = Math.max(0, curriculum.findIndex((book) => book.id === from.book));
  const last = Math.max(first, curriculum.findIndex((book) => book.id === toBook));
  for (let b = first; b <= last; b += 1) {
    const book = curriculum[b];
    book.units.forEach((unit, u) => {
      const parts = sessionCount(unit);
      for (let p = 1; p <= parts; p += 1) {
        if (b === first && (u < from.unit || (u === from.unit && p < from.part))) continue;
        out.push({ book: book.id, bookLabel: book.label, unit: u, unitLabel: unit.label, part: p, parts, lastPart: p === parts, booktest: p === parts && u === book.units.length - 1 && Boolean(book.source.unitTestQuestions?.length) });
      }
    });
  }
  return out;
}

// 날짜마다 무슨 날인지 정해 차시를 놓는다. withChanges=false 면 결석·보강 없이(처음 계획 — 밀린 정도를 잴 때)
export function schedule(plan, sessions, { withChanges = true } = {}) {
  const days = new Set(plan.days || []);
  const off = new Set(plan.off || []);
  const absent = new Set(withChanges ? plan.absent || [] : []);
  const makeup = new Set(withChanges ? plan.makeup || [] : []);
  const rows = [];
  let next = 0;
  const cursor = parseYmd(plan.start);
  // 보강은 시작일 전이어도 셈하지 않는다. 넉넉히 4년까지만 본다(요일을 하나도 안 고른 경우를 막는다)
  for (let guard = 0; guard < 1500 && next < sessions.length; guard += 1, cursor.setDate(cursor.getDate() + 1)) {
    const date = ymd(cursor), regular = days.has(cursor.getDay());
    if (makeup.has(date)) { rows.push({ date, type: "makeup", session: sessions[next], index: next }); next += 1; continue; }
    if (!regular) continue;
    const holiday = plan.holidays !== false ? holidayName(date) : "";
    if (holiday) { rows.push({ date, type: "holiday", label: holiday }); continue; }
    if (off.has(date)) { rows.push({ date, type: "off", label: "쉬는 날" }); continue; }
    if (absent.has(date)) { rows.push({ date, type: "absent", label: "결석", session: sessions[next], index: next }); continue; }
    rows.push({ date, type: "class", session: sessions[next], index: next });
    next += 1;
  }
  return rows;
}

// 처음 계획과 비교해 몇 차시 밀렸는지(+ 밀림, − 앞섬). 오늘까지 지난 날만 센다.
export function delayOf(plan, upTo = today()) {
  const absent = (plan.absent || []).filter((date) => date <= upTo && date >= plan.start).length;
  const makeup = (plan.makeup || []).filter((date) => date <= upTo && date >= plan.start).length;
  return { absent, makeup, behind: absent - makeup };
}
