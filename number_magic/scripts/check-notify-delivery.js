#!/usr/bin/env node
// weekly-notify 자동 발송 루프 모의 테스트 (네트워크 없음).
// index.ts 의 @@pure-start/@@pure-end 구간을 typescript 로 transpile 해 불러와 가짜 의존성으로 돌린다.
"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const vm = require("node:vm");

let ts;
try { ts = require("typescript"); } catch (_) {
  for (const p of [path.join(__dirname, "..", "..", "node_modules", "typescript"), path.join(__dirname, "..", "node_modules", "typescript")]) {
    try { ts = require(p); break; } catch (_e) { /* next */ }
  }
}
const strip = require('node:module').stripTypeScriptTypes;
if (!ts && !strip) { console.error("typescript 또는 Node 내장 TypeScript 도구가 필요합니다."); process.exit(2); }

const src = fs.readFileSync(path.join(__dirname, "..", "..", "supabase", "functions", "weekly-notify", "index.ts"), "utf8");
const a = src.indexOf("// @@pure-start"), b = src.indexOf("// @@pure-end");
assert.ok(a >= 0 && b > a, "pure markers missing");
const js = ts ? ts.transpileModule(src.slice(a, b), { compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.None } }).outputText : strip(src.slice(a,b));
const sandbox = { crypto: crypto.webcrypto, TextEncoder, Uint8Array, Array, String, Number };
vm.createContext(sandbox);
vm.runInContext(js + "\nthis.autoKind=autoKind;this.parseMembership=parseMembership;this.processContact=processContact;this.standardPart=standardPart;", sandbox);
const { autoKind, parseMembership, processContact, standardPart } = sandbox;

const sha16 = (s) => crypto.createHash("sha256").update(s).digest("hex").slice(0, 16);
const LINK = "https://lete-on.gfieldacademy.net/w/?m=abc123";
const CTX = { wk: "2026-W40", kstDow: 1, gDow: 1, gDow2: 4, force: false, dry: false };

// 가짜 의존성. rpcMap: k -> {data,error} 또는 함수. 로그 테이블은 unique(phone,week,kind) 흉내.
function makeDeps(opts = {}) {
  const log = new Map(); const calls = { rpc: [], sends: [], reserves: [], finals: [] };
  let id = 0;
  const d = {
    calls, log,
    membership: async (p) => {
      calls.rpc.push(p);
      const r = opts.rpc ? opts.rpc(p) : { data: { managed: false }, error: null };
      if (r instanceof Error) throw r;
      return r;
    },
    loadState: async () => opts.state || {},
    alreadyLogged: async (ph, w, k) => log.has(ph + "|" + w + "|" + k),
    reserve: async (ph, w, k) => {
      calls.reserves.push(k);
      if (opts.reserveError) return { id: null, error: opts.reserveError };
      const key = ph + "|" + w + "|" + k;
      if (log.has(key)) return { id: null, error: { code: "23505" } };
      log.set(key, ++id); return { id, error: null };
    },
    finalize: async (i, res) => { calls.finals.push([i, res.ok]); return opts.finalizeError ? { error: { message: "x" } } : { error: null }; },
    worksheetLink: async (k) => ({ url: "https://legacy/w/?x" + k, kind: "pdf" }),
    compose: (name, dg, cad, link, k) => ({ title: "", msg: `${name}|${cad}|${k}|${link.url}`, msgType: "SMS" }),
    bytes: (m) => m.length,
    send: async (ph, t, m) => { calls.sends.push({ ph, m }); return opts.sendResult || { ok: true, detail: "", via: "test" }; },
  };
  return d;
}
const mk = (name, ph = "01012345678") => ({ profile_name: name, phone: ph, send_dow: null, send_dow2: null });

(async () => {
  // 1) kind 파생: 이름 미포함, SHA-256 앞 16자
  assert.equal(await autoKind("김도윤", 1), "weekly-" + sha16("김도윤"));
  assert.equal(await autoKind("김도윤", 2), "weekly-2-" + sha16("김도윤"));
  assert.ok(!(await autoKind("김도윤", 1)).includes("김도윤"));
  assert.notEqual(await autoKind("형", 1), await autoKind("동생", 1));

  // 2) 형제(같은 번호, 다른 이름) 둘 다 발송 — 예전엔 두 번째가 막혔다
  {
    const d = makeDeps();
    const r1 = await processContact(d, mk("형"), CTX);
    const r2 = await processContact(d, mk("동생"), CTX);
    assert.equal(d.calls.sends.length, 2);
    assert.equal(r1[0].ok, true); assert.equal(r2[0].ok, true);
    // 같은 학생 재실행은 중복(23505) → 발송 없음
    const r3 = await processContact(d, mk("형"), CTX);
    assert.equal(r3[0].skip, "already-sent");
    assert.equal(d.calls.sends.length, 2);
    assert.deepEqual(d.calls.finals.map((f) => f[0]), [1, 2]);
  }

  // 3) 선점 오류(중복 아님)는 fail closed — 보내지 않음
  {
    const d = makeDeps({ reserveError: { code: "57014" } });
    const r = await processContact(d, mk("형"), CTX);
    assert.equal(r[0].skip, "log-unavailable");
    assert.equal(d.calls.sends.length, 0);
  }

  // 4) 선점은 발송보다 먼저, 갱신은 발송 뒤
  {
    const d = makeDeps(); const order = [];
    const r0 = d.reserve, s0 = d.send, f0 = d.finalize;
    d.reserve = async (...a) => { order.push("reserve"); return r0(...a); };
    d.send = async (...a) => { order.push("send"); return s0(...a); };
    d.finalize = async (...a) => { order.push("final"); return f0(...a); };
    await processContact(d, mk("형"), CTX);
    assert.deepEqual(order, ["reserve", "send", "final"]);
  }

  // 5) 애매한 실패(ok:null/false)도 재시도 없이 1회, finalize 오류는 log_error 로만
  {
    const d = makeDeps({ sendResult: { ok: false, detail: "timeout", via: "relay" }, finalizeError: true });
    const r = await processContact(d, mk("형"), CTX);
    assert.equal(d.calls.sends.length, 1);
    assert.equal(r[0].ok, false); assert.equal(r[0].log_error, "finalize_failed");
  }

  // 6) 레거시(managed:false): 프로필 주기·기존 링크, RPC k=1 한 번만(w1), 페이로드 모양
  {
    const d = makeDeps();
    const r = await processContact(d, mk("형"), CTX);
    assert.equal(d.calls.rpc.length, 1);
    assert.equal(JSON.stringify(d.calls.rpc[0]), JSON.stringify({ profileName: "형", phone: "01012345678", k: 1, week: "2026-W40" }));
    assert.ok(d.calls.sends[0].m.includes("https://legacy/w/?x1"));
    assert.equal(r.length, 1);
  }

  // 7) 레거시 w2 프로필: k=1,2 각각 조회, 요일 게이트 적용(k=2 는 목요일이라 월요일엔 건너뜀)
  {
    const d = makeDeps({ state: { roadCadence: "w2" } });
    const r = await processContact(d, mk("형"), CTX);
    assert.equal(r.find((x) => x.k === 2).skip, "not-send-day");
    assert.equal(d.calls.rpc.length, 1); // k=2 는 게이트 전에 조회하지 않음
    const d2 = makeDeps({ state: { roadCadence: "w2" } });
    await processContact(d2, mk("형"), { ...CTX, kstDow: 4, gDow: 4 });
    assert.deepEqual(d2.calls.rpc.map((p) => p.k), [1, 2]);
    assert.equal(d2.calls.sends.length, 2);
  }

  // 8) 관리 계정 + 개인 링크: 링크 사용, 서버 주기(w1)가 프로필(w2)을 이긴다
  {
    const d = makeDeps({ state: { roadCadence: "w2" }, rpc: () => ({ data: { managed: true, canUse: true, cadence: "w1", link: LINK }, error: null }) });
    const r = await processContact(d, mk("형"), CTX);
    assert.equal(d.calls.rpc.length, 1);
    assert.equal(r.length, 1);
    assert.ok(d.calls.sends[0].m.includes(LINK));
    assert.ok(!d.calls.sends[0].m.includes("legacy"));
  }

  // 9) 관리 + link null: 기존 학습지 폴백
  {
    const d = makeDeps({ rpc: () => ({ data: { managed: true, canUse: true, cadence: "w1", link: null }, error: null }) });
    await processContact(d, mk("형"), CTX);
    assert.ok(d.calls.sends[0].m.includes("https://legacy/w/?x1"));
  }

  // 10) 만료(canUse:false): 발송·선점 없음
  {
    const d = makeDeps({ rpc: () => ({ data: { managed: true, canUse: false, cadence: "w1", link: null }, error: null }) });
    const r = await processContact(d, mk("형"), CTX);
    assert.equal(r[0].skip, "membership-denied");
    assert.equal(d.calls.sends.length, 0); assert.equal(d.calls.reserves.length, 0);
  }

  // 11) RPC 오류 / 예외 / 이상 응답: fail closed
  for (const rpc of [
    () => ({ data: null, error: { message: "boom" } }),
    () => new Error("net"),
    () => ({ data: { managed: true, cadence: "w1" }, error: null }),
    () => ({ data: { managed: true, canUse: true, cadence: "w9", link: null }, error: null }),
    () => ({ data: { managed: true, canUse: true, cadence: "w1", link: "http://insecure/x" }, error: null }),
    () => ({ data: { managed: true, canUse: true, cadence: "w1", link: "https://a b" }, error: null }),
    () => ({ data: {}, error: null }),
  ]) {
    const d = makeDeps({ rpc });
    const r = await processContact(d, mk("형"), CTX);
    assert.equal(r[0].skip, "membership-error");
    assert.equal(d.calls.sends.length, 0); assert.equal(d.calls.reserves.length, 0);
  }

  // 12) 관리 w2: k=2 는 서버 주기 재확인. k=2 응답이 w1 이면 건너뜀, 오류면 fail closed
  {
    const T = { ...CTX, kstDow: 4, gDow: 4 };
    const mkRpc = (second) => (p) => p.k === 1
      ? { data: { managed: true, canUse: true, cadence: "w2", link: LINK }, error: null } : second;
    const ok = makeDeps({ rpc: mkRpc({ data: { managed: true, canUse: true, cadence: "w2", link: LINK + "2" }, error: null }) });
    await processContact(ok, mk("형"), T);
    assert.equal(ok.calls.sends.length, 2);
    assert.ok(ok.calls.sends[1].m.includes(LINK + "2"));
    const bad = makeDeps({ rpc: mkRpc({ data: { managed: true, canUse: true, cadence: "w1", link: null }, error: null }) });
    const rb = await processContact(bad, mk("형"), T);
    assert.equal(bad.calls.sends.length, 1);
    assert.equal(rb[1].skip, "membership-mismatch");
    const err = makeDeps({ rpc: mkRpc({ data: null, error: { message: "x" } }) });
    const re = await processContact(err, mk("형"), T);
    assert.equal(err.calls.sends.length, 1);
    assert.equal(re[1].skip, "membership-error");
  }

  // 13) dry: 선점·발송 없음, 문안만
  {
    const d = makeDeps();
    const r = await processContact(d, mk("형"), { ...CTX, dry: true, kstDow: 3 });
    assert.equal(r[0].dry, true);
    assert.equal(d.calls.reserves.length, 0); assert.equal(d.calls.sends.length, 0);
  }

  // 14) 잘못된 번호: RPC 호출 전에 건너뜀
  {
    const d = makeDeps();
    const r = await processContact(d, mk("형", "123"), CTX);
    assert.equal(r[0].skip, "bad-phone"); assert.equal(d.calls.rpc.length, 0);
  }

  // parseMembership 단독
  assert.equal(JSON.stringify(parseMembership({ data: { managed: false } })), '{"managed":false}');
  assert.equal(parseMembership(null), null);

  // 표준 학습지 회차(2026-10-28): 저장한 회차에서 주마다 나아가고, 주 2회는 두 회차, 마지막 회차에서 멈춘다
  {
    const dg = { courseKey: "C4", round: 2, roundAt: "2026-W40", rounds: 9, amount: 1 };
    assert.equal(standardPart(dg, "2026-W40", 1, "w1"), "C4.2");
    assert.equal(standardPart(dg, "2026-W43", 1, "w1"), "C4.5");
    assert.equal(standardPart(dg, "2026-W43", 1, "w2"), "C4.8");
    assert.equal(standardPart(dg, "2026-W43", 2, "w2"), "C4.9");
    assert.equal(standardPart(dg, "2026-W52", 1, "w1"), "C4.9", "stops at the last round");
    assert.equal(standardPart({ ...dg, roundAt: "2025-W52" }, "2026-W01", 1, "w1"), "C4.3", "crosses the year");
    assert.equal(standardPart(dg, "2026-W38", 1, "w1"), "C4.2", "never goes back");
    assert.equal(standardPart({ ...dg, amount: 1.25 }, "2026-W40", 1, "w1"), "C4.2L");
    assert.equal(standardPart({ ...dg, amount: 0.85 }, "2026-W40", 1, "w1"), "C4.2");
    for (const bad of [null, {}, { ...dg, round: 0 }, { ...dg, rounds: "x" }, { ...dg, roundAt: "2026-40" }, { ...dg, courseKey: "C4;x" }])
      assert.equal(standardPart(bad, "2026-W40", 1, "w1"), "", "malformed digest falls back");
    // 단문 90바이트: 가장 긴 형태(3자 이름 · 12월 5-2주차 · C73.12L)도 이름을 넣은 형식에 들어간다
    const bytes = (t) => [...t].reduce((n, ch) => n + (ch.codePointAt(0) < 128 ? 1 : 2), 0);
    const url = "https://docssam1.github.io/lete-on/w/?2652.C73.12L";
    assert.ok(bytes(`[numbers of magic] 김민준 12월 5-2주차\n${url}`) <= 90, "standard link keeps SMS");
    assert.ok(bytes(`[numbers of magic] 12월 5-2주차 학습지\n${url}`) <= 90, "standard link keeps SMS (no name)");
  }

  console.log("check-notify-delivery: OK");
})().catch((e) => { console.error(e); process.exit(1); });
