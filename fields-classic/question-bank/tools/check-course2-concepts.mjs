// 2과정 개념 꾸러미·문제 생성기 검사(원장 2026-11-23 「1과정에 했던 실수를 그대로 하네 · 색종이는 접는 과정을 보여 주던지 화살표로 · 디지털수인데 왜 아라비아 수를 써」)
// node fields-classic/question-bank/tools/check-course2-concepts.mjs  — 실패가 있으면 exit 1
//  ① 디지털 숫자: 디지털 꾸러미의 보기·숫자 나열·「디지털 숫자 N」을 아라비아 숫자로 쓰지 않는다 → [[d:N]](digital-inline.js)
//  ② 색종이: 색종이를 접는 꾸러미 그림은 장면 줄(fold-visuals.js foldWordStrip 등 — class fold-*-svg)로 그린다
//  ③ 문제 글: 「디지털 숫자로 쓴 123」처럼 디지털 수를 글 속 아라비아 숫자로 쓰지 않는다
//  ④ 그림 속 길이 글자는 점선 호(2·3과정 + 1과정 3권·6권 문제 그림·워밍업 유형 예제)
import { PACK_BOOKS } from "../course2-concepts/packs.js";

const fails = [];
const strip = (s) => String(s ?? "").replace(/\[\[d:[0-9:]+(?:\|[mh])?\]\]/g, "▣");
const isDigitalPack = (p) => /디지털/.test(`${p.title} ${p.recall?.text} ${p.recall?.ask}`);
const isFoldPack = (p) => /색종이/.test(JSON.stringify([p.title, p.recall?.text, p.recall?.ask, p.summary, p.example?.prompt]));
const draw = (f) => (typeof f === "function" ? f() : String(f ?? ""));
const FOLD_SVG = /class="fold-[a-z-]*svg"/;

for (const [bookId, book] of Object.entries(PACK_BOOKS)) {
  for (const [key, list] of Object.entries(book)) for (const p of list) {
    const at = `${bookId} ${key} ${p.id}`;
    if (isDigitalPack(p)) {
      const texts = [p.recall?.ask, p.recall?.why, p.recall?.hint, ...(p.summary?.facts || []), p.pitfall, p.example?.prompt,
        ...(p.example?.steps || []).flatMap((s) => [s.ask, s.why, s.hint])];
      (p.recall?.options || []).forEach((o) => { if (/^\s*[0-9:]+\s*$/.test(o)) fails.push(`${at}: 되짚기 보기 「${o}」가 아라비아 숫자 — [[d:${o.trim()}]]`); });
      for (const t of texts) {
        const s = strip(t);
        if (/\d\s*(?:[·↔,]|–)\s*\d/.test(s.replace(/\d+\s*~\s*\d+/g, "").replace(/\d+\s*[×+−=]\s*\d+/g, ""))) fails.push(`${at}: 숫자 나열이 아라비아 숫자 — 「${s.slice(0, 60)}」`);
        if (/디지털 숫자(?:로 쓴)?\s*「?\d+(?!\d*자리)/.test(s)) fails.push(`${at}: 「디지털 숫자 N」을 아라비아 숫자로 — 「${s.slice(0, 60)}」`);
      }
    }
    if (isFoldPack(p)) for (const part of ["recall", "summary", "example"]) {
      const f = p[part]?.figure;
      if (f && /색종이|접/.test(JSON.stringify(p[part])) && !FOLD_SVG.test(draw(f))) fails.push(`${at}: ${part} 색종이 그림이 장면 줄(fold-visuals)이 아님`);
    }
  }
}

// ③ 생성기 문제 글
const BOOKS = ["g1", "g2", "g3", "g4", "g5", "a1", "a2", "a3", "a4", "a5"];
for (const b of BOOKS) {
  const mod = await import(`../course2-${b}-generators.js`);
  const gens = Object.values(mod).find((v) => v && typeof v === "object" && !Array.isArray(v) && Object.values(v).every((fn) => typeof fn === "function"));
  for (const [name, fn] of Object.entries(gens || {})) for (const difficulty of [1, 2, 3]) for (let k = 0; k < 4; k += 1) {
    let r; try { r = fn({ difficulty }); } catch { continue; }
    const prompt = String(r?.prompt || "");
    if (/디지털 숫자(?:로 쓴)?\s*「?\d+(?!\d*자리)/.test(prompt)) { fails.push(`${b} ${name}: 문제 글에 디지털 수를 아라비아 숫자로 — 「${prompt.slice(0, 60)}」`); break; }
  }
}

// ④ 길이 표시(스킬 gfield-textbook-design 4-3, 원장 2026-11-24 「도형의 변의 길이를 점선 호를 사용하여 길이를 써야지 기준이잖아」):
//    그림 속 「12cm」 같은 길이 글자는 바깥 곡선 점선의 끊은 자리 글자(length-dim.js·kit dim — 명조 style)여야 한다. 변 옆 맨 글자는 실패.
const LEN_TEXT = /<text\b([^>]*)>\s*([\d.]+\s*(?:cm|m|㎝))\s*<\/text>/g;
// 예외(길이가 아니거나 호를 둘 자리가 없는 것): 조각마다 안에 쓴 둘레(G4 직사각형 조각) · 30px 안팎의 가장 작은 정사각형 안 한 변(G2 피보나치)
const LEN_OK = new Set(["rect-parts", "c2RectPartsPerimeter", "c2FibonacciRect"]);
const plainLengths = (svgText) => [...String(svgText).matchAll(LEN_TEXT)].filter((m) => !/Serif|serif/.test(m[1])).map((m) => m[2]);
for (const [bookId, book] of Object.entries(PACK_BOOKS)) for (const [key, list] of Object.entries(book)) for (const p of list) for (const part of ["recall", "summary", "example"]) {
  const f = p[part]?.figure; if (!f || LEN_OK.has(p.id)) continue;
  const bad = plainLengths(draw(f)); if (bad.length) fails.push(`${bookId} ${key} ${p.id} ${part}: 길이를 맨 글자로 — ${bad.slice(0, 3).join(", ")} (점선 호로)`);
}
for (const b of BOOKS) {
  const mod = await import(`../course2-${b}-generators.js`);
  const gens = Object.values(mod).find((v) => v && typeof v === "object" && !Array.isArray(v) && Object.values(v).every((fn) => typeof fn === "function"));
  for (const [name, fn] of Object.entries(gens || {})) for (const difficulty of [1, 2, 3]) for (let k = 0; k < 4; k += 1) {
    let r; try { r = fn({ difficulty }); } catch { continue; }
    const bad = LEN_OK.has(name) ? [] : plainLengths(r?.visual?.html || ""); if (bad.length) { fails.push(`${b} ${name}: 그림 길이를 맨 글자로 — ${bad.slice(0, 3).join(", ")} (점선 호로)`); break; }
  }
}

// ④-1 1과정(원장 2026-11-24 「배꿔」 — 1과정 그림도 같은 기준): 3권·6권 문제 그림, 워밍업 유형 예제(거리 줄·사각형)의 길이 글자
{
  const { BOOK03_GENERATORS } = await import("../book03-generators.js");
  const { book03Markup } = await import("../book03-renderers.js");
  const M6 = await import("../book06-generators.js");
  const { book06Markup } = await import("../book06-renderers.js");
  const books = [["3권", BOOK03_GENERATORS, book03Markup], ["6권", Object.assign({}, ...Object.values(M6).filter((v) => v && typeof v === "object")), book06Markup]];
  for (const [name, gens, markup] of books) for (const [k, fn] of Object.entries(gens)) for (const difficulty of [1, 2, 3]) for (let i = 0; i < 3; i += 1) {
    let r; try { r = fn({ difficulty }); } catch { continue; }
    if (!r?.visual) continue; let html = ""; try { html = markup(r.visual) || ""; } catch { continue; }
    const bad = plainLengths(html); if (bad.length) { fails.push(`1과정 ${name} ${k}: 그림 길이를 맨 글자로 — ${bad.slice(0, 3).join(", ")} (점선 호로)`); break; }
  }
  const { TYPE_EXAMPLE_SETS } = await import("../golden-bell-type-examples.js");
  const { figureMarkup } = await import("../golden-bell-type-examples-view.js");
  const seen = new Set(), figs = [];
  const walk = (o, d = 0) => { if (!o || d > 9 || seen.has(o)) return; if (typeof o === "function") { if (o.length === 0) { try { walk(o(), d + 1); } catch { /* 예제 만들기 실패는 다른 검사가 본다 */ } } return; } if (typeof o !== "object") return; seen.add(o); if (o.kind === "dist-line" || o.kind === "quad") figs.push(o); Object.values(o).forEach((v) => walk(v, d + 1)); };
  walk(TYPE_EXAMPLE_SETS);
  for (const f of figs) { const bad = plainLengths(figureMarkup(f)); if (bad.length) { fails.push(`워밍업 유형 예제 ${f.kind}: 길이를 맨 글자로 — ${bad.slice(0, 3).join(", ")}`); break; } }
}

const unique = [...new Set(fails)];
if (unique.length) { console.log(unique.join("\n")); console.log(`COURSE2_CONCEPTS_FAIL ${unique.length}`); process.exit(1); }
console.log("COURSE2_CONCEPTS_OK");
