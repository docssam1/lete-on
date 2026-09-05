// Numbers of Magic — 주간 학부모 알림 발송 (알리고 SMS/LMS)  v9
// 트리거: POST { trigger_key, dry?, test_phone?, probe? }  — pg_cron 또는 수동 curl.
//   dry:true      → 발송 없이 문안만 돌려준다.
//   test_phone    → 연락처를 돌지 않고 그 번호 한 건만 보낸다(연결 점검용, kind='test').
//   probe:true    → 릴레이에 {action:'ping'}만 보내 응답 원문을 돌려준다(문자 발송 없음, 연결·계약 확인용).
//   probe:'aligo' → 알리고 /remain/(잔여 건수 조회)로 키·IP 인증만 확인. 문자 발송 없음.
// 시크릿 읽기: 환경변수(Edge Secrets) 우선, 없으면 Vault(public.nm_notify_secret RPC, service_role 전용).
// 발송 경로(우선순위):
//   1) NOTIFY_RELAY_URL 이 Apps Script 웹앱(script.google.com)이면
//      gfield-report 가 쓰는 계약 그대로 POST {action:'aligo_sms', receiver, msg, targetDate:''}
//      → 응답 {result:'success'} 를 성공으로 본다. (키는 Apps Script 쪽에만 있다.)
//   2) NOTIFY_RELAY_URL 이 그 밖의 주소면 사설서버 릴레이(설계 §8):
//      POST {receiver, msg, title, msg_type:'LMS'} + X-Relay-Key → {ok:true|false}
//   3) NOTIFY_RELAY_URL 이 없으면 알리고 — 단, 이 함수의 외부 IP는 호출마다 바뀌어(확인: 54.180.141.19 → 13.209.98.43)
//      알리고 IP 화이트리스트에 못 올린다. 그래서 **DB(pg_net)에서 호출**한다: public.nm_aligo_send RPC가 Vault의
//      키·아이디·발신번호를 붙여 GET https://apis.aligo.in/send/?… 를 보내고(DB 외부 IP 54.116.72.251, 고정 —
//      알리고 관리자에 이 IP를 등록). /remain/ 이 GET 쿼리를 받는 것 확인(2026-09-05).
//      **비동기**: 함수는 큐에 넣고 request_id만 로그에 남긴 채 즉시 반환한다. 결과는 pg_cron 'nm-notify-reconcile'
//      (2분마다 nm_notify_reconcile())이 net._http_response 에서 맞춰 넣는다. 동기로 기다리면 pg_cron→pg_net→함수→pg_net
//      구조에서 pg_net 워커가 앞 배치(함수 호출)를 기다리느라 알리고 요청을 안 꺼내 서로 기다린다(2026-09-05 확인).
// 시크릿 이름: NOTIFY_TRIGGER_KEY, NOTIFY_RELAY_URL?, NOTIFY_RELAY_KEY?, ALIGO_API_KEY?, ALIGO_USER_ID?, ALIGO_SENDER?
// 설계: number_magic/알림서비스-설계.md — 번호는 nm_contacts(anon insert만)에만,
// 발송 이력은 nm_notify_log(주 1회 상한, (phone,week_key,kind) unique)로 중복 방지.
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const SB_URL = Deno.env.get("SUPABASE_URL")!;
const SB_SERVICE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

function weekKey(d: Date): string {
  // ISO 주 번호 — 같은 주 재발송 방지 키용
  const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const day = (t.getUTCDay() + 6) % 7;
  t.setUTCDate(t.getUTCDate() - day + 3);
  const firstThu = new Date(Date.UTC(t.getUTCFullYear(), 0, 4));
  const fday = (firstThu.getUTCDay() + 6) % 7;
  firstThu.setUTCDate(firstThu.getUTCDate() - fday + 3);
  const wk = 1 + Math.round((t.getTime() - firstThu.getTime()) / (7 * 86400000));
  return `${t.getUTCFullYear()}-W${String(wk).padStart(2, "0")}`;
}

function calLabel(cadence: string): string {
  // 이번 주 월요일 기준 "M월 N주차" (앱 exam.js calLabelFor와 같은 규칙, KST)
  const now = new Date(Date.now() + 9 * 3600000); // KST
  const d = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const day = (d.getDay() + 6) % 7;
  d.setDate(d.getDate() - day);
  const m = d.getMonth() + 1;
  const nth = Math.floor((d.getDate() - 1) / 7) + 1;
  return cadence === "w2" ? `${m}월 ${nth}주차(주2회)` : `${m}월 ${nth}주차`;
}

function composeMsg(profileName: string, digest: any, cadence: string): { title: string; msg: string } {
  const cal = calLabel(cadence);
  const cur = digest && digest.courseTitle
    ? `이번 주 과정: ${digest.courseNum}. ${digest.courseTitle}`
    : "이번 주 학습지가 준비되었어요";
  const msg =
    `[Numbers of Magic] ${cal} 학습 안내\n\n` +
    `${profileName} 학생\n${cur}\n\n` +
    `앱 > 학습지 모드 > 연산 로드맵에서 이번 주 학습지를 뽑을 수 있어요.\n` +
    `문의·수신해지: 학원으로 연락 주세요.`;
  return { title: `${cal} 학습 안내`, msg };
}

type SendResult = { ok: boolean | null; detail: string; via: string; request_id?: number };

// 환경변수 → Vault 순서로 시크릿을 읽는다. Vault 값은 원장이 대시보드/SQL로 넣고 git·클라이언트엔 없다.
async function secret(sb: any, name: string): Promise<string> {
  const env = (Deno.env.get(name) ?? "").trim();
  if (env) return env;
  try {
    const { data } = await sb.rpc("nm_notify_secret", { p_name: name });
    return String(data ?? "").trim();
  } catch (_) { return ""; }
}

function isAppsScript(url: string): boolean {
  return /script\.google(?:usercontent)?\.com/.test(url);
}

async function sendOne(sb: any, phone: string, title: string, msg: string): Promise<SendResult> {
  const relay = await secret(sb, "NOTIFY_RELAY_URL");
  try {
    if (relay && isAppsScript(relay)) {
      // 1) gfield-report Apps Script 웹앱 — 같은 계약(aligo_sms). 302 리다이렉트는 fetch가 따라간다.
      const r = await fetch(relay, {
        method: "POST",
        body: JSON.stringify({ action: "aligo_sms", receiver: phone, msg, targetDate: "" }),
      });
      const text = await r.text();
      let j: any = {};
      try { j = JSON.parse(text); } catch (_) { j = { raw: text.slice(0, 200) }; }
      return { ok: j.result === "success", detail: JSON.stringify(j).slice(0, 500), via: "apps_script" };
    }
    if (relay) {
      // 2) 사설서버 릴레이(설계 §8)
      const r = await fetch(relay, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Relay-Key": await secret(sb, "NOTIFY_RELAY_KEY") },
        body: JSON.stringify({ receiver: phone, msg, title, msg_type: "LMS" }),
      });
      const j: any = await r.json().catch(() => ({}));
      return { ok: r.ok && j.ok === true, detail: JSON.stringify(j).slice(0, 500), via: "relay" };
    }
    // 3) 알리고 — DB 외부 IP로 호출 (LMS — 본문이 90바이트를 넘으므로). 큐잉만 하고 결과는 reconcile이 채운다.
    const q = new URLSearchParams({ receiver: phone, msg, msg_type: "LMS", title });
    const id = await aligoEnqueue(sb, "send", q.toString());
    return { ok: null, detail: "queued", via: "aligo-db", request_id: id };
  } catch (e) {
    return { ok: false, detail: String(e).slice(0, 500), via: relay ? "relay" : "aligo-db" };
  }
}

// DB(pg_net) 큐에 알리고 호출을 넣고 request_id 를 돌려준다(응답은 기다리지 않는다 — 위 주석 참조).
async function aligoEnqueue(sb: any, endpoint: "send" | "remain", query: string): Promise<number> {
  const { data: id, error } = await sb.rpc("nm_aligo_send", { p_endpoint: endpoint, p_query: query });
  if (error) throw new Error("nm_aligo_send: " + error.message);
  return Number(id);
}

Deno.serve(async (req: Request) => {
  let body: any = {};
  try { body = await req.json(); } catch (_) { /* 빈 본문 허용 */ }
  const sb = createClient(SB_URL, SB_SERVICE);
  const need = await secret(sb, "NOTIFY_TRIGGER_KEY");
  if (!need || body.trigger_key !== need) {
    return new Response(JSON.stringify({ error: "bad trigger_key" }), { status: 403 });
  }
  const dry = !!body.dry;
  const wk = weekKey(new Date());

  // 연결·계약 확인: 릴레이에 ping 만 보낸다. 문자 발송 없음. Apps Script면 "Unknown action: ping" 류가 오면 정상.
  // 지난 실행분 결과 맞춰 넣기(SQL만, 싸다)
  try { await sb.rpc("nm_notify_reconcile"); } catch (_) { /* cron이 다시 한다 */ }

  if (body.probe === "aligo") {
    // 알리고 경로 점검: DB 외부 IP로 /remain/ 을 큐에 넣는다. 발송 없음. 결과는 몇 초 뒤
    // select public.nm_aligo_result(<request_id>) 로 읽는다(result_code -101 "-IP"면 DB IP 미등록).
    let id = 0, err = "";
    try { id = await aligoEnqueue(sb, "remain", ""); } catch (e) { err = String(e).slice(0, 200); }
    return new Response(JSON.stringify({ probe: "aligo", via: "aligo-db", request_id: id, error: err || undefined }), { headers: { "Content-Type": "application/json" } });
  }
  if (body.probe) {
    const relay = await secret(sb, "NOTIFY_RELAY_URL");
    if (!relay) return new Response(JSON.stringify({ probe: true, relay: false, note: "NOTIFY_RELAY_URL 없음 — 알리고 직접 경로" }), { headers: { "Content-Type": "application/json" } });
    let status = 0, text = "";
    try {
      const r = await fetch(relay, { method: "POST", body: JSON.stringify({ action: "ping" }) });
      status = r.status; text = (await r.text()).slice(0, 400);
    } catch (e) { text = String(e).slice(0, 400); }
    return new Response(JSON.stringify({ probe: true, via: isAppsScript(relay) ? "apps_script" : "relay", status, text }), { headers: { "Content-Type": "application/json" } });
  }

  // 연결 점검: 한 번호에 한 건만 (연락처·주1회 상한과 무관, kind='test')
  if (body.test_phone) {
    const phone = String(body.test_phone).replace(/\D/g, "");
    if (!/^01\d{8,9}$/.test(phone)) return new Response(JSON.stringify({ error: "bad test_phone" }), { status: 400 });
    const { title, msg } = composeMsg("테스트", null, "w1");
    if (dry) return new Response(JSON.stringify({ week: wk, test: true, dry: true, phone, title, msg }), { headers: { "Content-Type": "application/json" } });
    const res = await sendOne(sb, phone, title, msg);
    await sb.from("nm_notify_log").insert({ phone, week_key: wk + "-t" + Date.now().toString(36), kind: "test", ok: res.ok, detail: res.detail, request_id: res.request_id ?? null });
    return new Response(JSON.stringify({ week: wk, test: true, phone, ...res }), { headers: { "Content-Type": "application/json" } });
  }

  const { data: contacts, error: cErr } = await sb
    .from("nm_contacts").select("profile_name, phone")
    .eq("active", true).eq("consent", true);
  if (cErr) return new Response(JSON.stringify({ error: cErr.message }), { status: 500 });

  const results: any[] = [];
  for (const c of contacts ?? []) {
    const phone = String(c.phone).replace(/\D/g, "");
    if (!/^01\d{8,9}$/.test(phone)) { results.push({ phone: c.phone, skip: "bad-phone" }); continue; }

    // 주 1회 상한 — 이미 보냈으면 건너뜀
    const { data: dup } = await sb.from("nm_notify_log").select("id")
      .eq("phone", phone).eq("week_key", wk).eq("kind", "weekly").limit(1);
    if (dup && dup.length) { results.push({ phone, skip: "already-sent" }); continue; }

    // 프로필 state에서 주간 요약(weeklyDigest, 앱이 저장) 읽기
    const { data: prof } = await sb.from("nm_profiles").select("state")
      .eq("name", c.profile_name).limit(1);
    const st = prof && prof[0] && prof[0].state || {};
    const { title, msg } = composeMsg(c.profile_name, st.weeklyDigest, st.roadCadence || "w1");

    if (dry) { results.push({ phone, dry: true, title, msg }); continue; }

    const res = await sendOne(sb, phone, title, msg);
    await sb.from("nm_notify_log").insert({ phone, week_key: wk, kind: "weekly", ok: res.ok, detail: res.detail, request_id: res.request_id ?? null });
    results.push({ phone, ok: res.ok, via: res.via, request_id: res.request_id, detail: res.ok ? undefined : res.detail });
  }
  return new Response(JSON.stringify({ week: wk, count: results.length, results }), {
    headers: { "Content-Type": "application/json" },
  });
});
