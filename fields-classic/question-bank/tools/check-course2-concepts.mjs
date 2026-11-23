// 2과정 개념 꾸러미·문제 생성기 검사(원장 2026-11-23 「1과정에 했던 실수를 그대로 하네 · 색종이는 접는 과정을 보여 주던지 화살표로 · 디지털수인데 왜 아라비아 수를 써」)
// node fields-classic/question-bank/tools/check-course2-concepts.mjs  — 실패가 있으면 exit 1
//  ① 디지털 숫자: 디지털 꾸러미의 보기·숫자 나열·「디지털 숫자 N」을 아라비아 숫자로 쓰지 않는다 → [[d:N]](digital-inline.js)
//  ② 색종이: 색종이를 접는 꾸러미 그림은 장면 줄(fold-visuals.js foldWordStrip 등 — class fold-*-svg)로 그린다
//  ③ 문제 글: 「디지털 숫자로 쓴 123」처럼 디지털 수를 글 속 아라비아 숫자로 쓰지 않는다
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

const unique = [...new Set(fails)];
if (unique.length) { console.log(unique.join("\n")); console.log(`COURSE2_CONCEPTS_FAIL ${unique.length}`); process.exit(1); }
console.log("COURSE2_CONCEPTS_OK");
