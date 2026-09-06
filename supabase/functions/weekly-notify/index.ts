// Numbers of Magic — 주간 학부모 알림 발송 (알리고 SMS/LMS)  v17
// 트리거: POST { trigger_key, dry?, test_phone?, probe?, force? }  — pg_cron(매시 정각) 또는 수동 curl.
//   발송 요일·시각(v13, 원장 "요일 지정"): nm_notify_settings(send_dow 0=일…6=토, send_hour 0~23, KST)이 전역 기본,
//   nm_contacts.send_dow 가 학부모별 덮어쓰기. 매시 깨어나 KST 요일·시각이 맞는 연락처만 보낸다. force:true 면 무시(수동).
//   주 2회반(v15, 원장 "주 2회 선택일 수도"): 프로필 roadCadence='w2' 면 한 주에 두 번(k=1,2). 2번째 요일은 send_dow2(전역 기본 4=목,
//   nm_contacts.send_dow2). 학습지도 k별 두 벌(nm_weekly_pdf.k / ws.html?k=2). 중복 방지 kind = 'weekly' | 'weekly-2'.
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
// 문안(v11, 원장: "학습지 PDF 링크를"): nm_weekly_pdf(profile_name, week_key)의 URL(GitHub Actions가 월 00:30 KST에 생성)
//   → 없으면 ws.html 웹 학습지 → 그것도 없으면 일반 안내.
// 단문(v14, 원장: "단문 문자로 간단히, 비용 아끼자"): 링크를 /w/?YYWW.TOKEN 짧은 주소로 바꾸고
//   본문을 90바이트(EUC-KR: 한글 2·영숫자 1) 안에 맞춰 msg_type SMS 로 보낸다. 넘치면 LMS 로 자동 전환.
//   주차 키는 KST 날짜 기준(일 23:00 UTC 실행이 UTC로는 아직 일요일이라 지난 주가 되는 것을 막는다).
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

function calLabel(cadence: string, k = 1): string {
  // 이번 주 월요일 기준 "M월 N주차" (앱 exam.js calLabelFor와 같은 규칙, KST). 주 2회반은 "M월 N-k주차".
  const now = new Date(Date.now() + 9 * 3600000); // KST
  const d = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const day = (d.getDay() + 6) % 7;
  d.setDate(d.getDate() - day);
  const m = d.getMonth() + 1;
  const nth = Math.floor((d.getDate() - 1) / 7) + 1;
  return cadence === "w2" ? `${m}월 ${nth}-${k}주차` : `${m}월 ${nth}주차`;
}

const APP_BASE = "https://docssam1.github.io/lete-on/number_magic";

function kstNow(): Date { return new Date(Date.now() + 9 * 3600000); }

// 짧은 링크: <저장소 루트>/w/?YYWW.PART  (PART = PDF 토큰(hex 8자) 또는 과정 키). /w/index.html 이 풀어 준다.
// 51자 — 단문 90바이트에서 한글 이름·주차까지 넣으려면 이 길이여야 한다(number_magic/ 밑이면 넘친다).
const SHORT_BASE = "https://docssam1.github.io/lete-on/w/";
function shortLink(wk: string, part: string): string {
  const m = /^(\d{4})-W(\d{2})$/.exec(wk);
  const yyww = m ? m[1].slice(2) + m[2] : wk;
  return `${SHORT_BASE}?${yyww}.${part}`;
}

// 학습지 링크: ① nm_weekly_pdf 의 PDF(토큰) ② ws.html(과정 키) ③ 없음
async function worksheetLink(sb: any, profileName: string, wk: string, digest: any, k = 1): Promise<{ url: string; kind: "pdf" | "web" | "" }> {
  try {
    const { data } = await sb.from("nm_weekly_pdf").select("url").eq("profile_name", profileName).eq("week_key", wk).eq("k", k).limit(1);
    const u = data && data[0] && data[0].url;
    const m = u ? /\/nm-worksheets\/[^/]+\/([0-9a-f]+)\.pdf/.exec(String(u)) : null;
    if (m) return { url: shortLink(wk, m[1]), kind: "pdf" };
    if (u) return { url: String(u), kind: "pdf" };
  } catch (_) { /* 표가 없거나 권한 문제면 웹 링크로 */ }
  if (digest && digest.courseKey) return { url: shortLink(wk, String(digest.courseKey) + (k > 1 ? `-${k}` : "")), kind: "web" };
  return { url: "", kind: "" };
}

// EUC-KR 기준 바이트 수(한글·기호 2, ASCII 1). 알리고 단문 한도 90.
function smsBytes(s: string): number {
  let n = 0;
  for (const ch of s) n += (ch.codePointAt(0)! < 128) ? 1 : 2;
  return n;
}

function composeMsg(profileName: string, digest: any, cadence: string, link: { url: string; kind: string }, k = 1): { title: string; msg: string; msgType: "SMS" | "LMS" } {
  const cal = calLabel(cadence, k);
  // 단문 — 원장이 확정한 형식(2026-09-06 "이정도가 딱 단문이다"):
  //   [numbers of magic] 8월 5-1주차 학습지⏎https://docssam1.github.io/lete-on/w/?2636.e07b75a2   (89바이트, 12월도 90)
  // 이름은 넣지 않는다(한글 3자면 이미 넘친다). 링크가 없으면 장문 폴백.
  // v17(원장 "magic 다음에 이름을 넣자"): 이름을 넣으면 '학습지'(6바이트)를 뺀다 — 3자 이름+12월+주2회도 90 안.
  // 4자 이상 이름 등으로 넘치면 이름 없는 형식으로.
  if (link.url) {
    const named = `[numbers of magic] ${profileName} ${cal}\n${link.url}`;
    if (profileName && smsBytes(named) <= 90) return { title: "", msg: named, msgType: "SMS" };
    const short = `[numbers of magic] ${cal} 학습지\n${link.url}`;
    if (smsBytes(short) <= 90) return { title: "", msg: short, msgType: "SMS" };
  }
  // 장문 폴백
  const cur = digest && digest.courseTitle
    ? `이번 주 과정: ${digest.courseNum}. ${digest.courseTitle}`
    : "이번 주 학습지가 준비되었어요";
  const linkLine = link.url
    ? `학습지: ${link.url}\n`
    : `앱 > 학습지 모드 > 연산 로드맵에서 이번 주 학습지를 뽑을 수 있어요.\n`;
  const msg = `[numbers of magic] ${cal} 학습지\n${profileName} 학생 · ${cur}\n${linkLine}문의·수신해지: 학원`;
  return { title: `${cal} 학습지`, msg, msgType: "LMS" };
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

async function sendOne(sb: any, phone: string, title: string, msg: string, msgType: "SMS" | "LMS" = "LMS"): Promise<SendResult> {
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
        body: JSON.stringify({ receiver: phone, msg, title, msg_type: msgType }),
      });
      const j: any = await r.json().catch(() => ({}));
      return { ok: r.ok && j.ok === true, detail: JSON.stringify(j).slice(0, 500), via: "relay" };
    }
    // 3) 알리고 — DB 외부 IP로 호출. 단문이면 SMS(제목 없음), 넘치면 LMS. 큐잉만 하고 결과는 reconcile이 채운다.
    const q = new URLSearchParams(msgType === "SMS" ? { receiver: phone, msg, msg_type: "SMS" } : { receiver: phone, msg, msg_type: "LMS", title });
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
  const force = !!body.force;
  const now = kstNow();
  const wk = weekKey(now); // KST 기준 주차 (런타임 TZ는 UTC라 getFullYear 등이 KST 달력 날짜를 돌려준다)
  const kstDow = now.getUTCDay(), kstHour = now.getUTCHours(); // +9h 시프트한 Date의 UTC 필드 = KST 달력

  // 전역 발송 설정
  const settings: Record<string, string> = { send_dow: "1", send_dow2: "4", send_hour: "8" };
  try {
    const { data } = await sb.from("nm_notify_settings").select("key, value");
    for (const r of data ?? []) settings[r.key] = String(r.value);
  } catch (_) { /* 기본값 */ }
  const gHour = parseInt(settings.send_hour, 10);
  const gDow = parseInt(settings.send_dow, 10);
  const gDow2 = parseInt(settings.send_dow2, 10);

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
    const demo = { courseKey: "C4", courseNum: 4, courseTitle: "두 자리 올림 덧뺄셈" }; // 시험 문자에도 실제 링크가 실리도록
    const tName = String(body.test_name || "테스트");
    const tCad = body.test_cadence === "w2" ? "w2" : "w1";
    const tK = tCad === "w2" && Number(body.test_k) === 2 ? 2 : 1;
    const link = await worksheetLink(sb, tName, wk, demo, tK);
    const { title, msg, msgType } = composeMsg(tName, demo, tCad, link, tK);
    if (dry) return new Response(JSON.stringify({ week: wk, test: true, dry: true, phone, cadence: tCad, k: tK, title, msg, msgType, bytes: smsBytes(msg), link }), { headers: { "Content-Type": "application/json" } });
    const res = await sendOne(sb, phone, title, msg, msgType);
    const { error: lErr } = await sb.from("nm_notify_log").insert({ phone, week_key: wk + "-t" + Date.now().toString(36), kind: "test", ok: res.ok, detail: res.detail, request_id: res.request_id ?? null });
    return new Response(JSON.stringify({ week: wk, test: true, phone, ...res, log_error: lErr ? lErr.message : undefined }), { headers: { "Content-Type": "application/json" } });
  }

  // 시각 게이트: 설정 시각이 아니면 아무것도 안 한다(매시 호출되므로). force/dry 는 통과.
  if (!force && !dry && kstHour !== gHour) {
    return new Response(JSON.stringify({ week: wk, kst: { dow: kstDow, hour: kstHour }, skip: "not-send-hour", send_hour: gHour }), { headers: { "Content-Type": "application/json" } });
  }

  const { data: contacts, error: cErr } = await sb
    .from("nm_contacts").select("profile_name, phone, send_dow, send_dow2")
    .eq("active", true).eq("consent", true);
  if (cErr) return new Response(JSON.stringify({ error: cErr.message }), { status: 500 });

  const results: any[] = [];
  for (const c of contacts ?? []) {
    const phone = String(c.phone).replace(/\D/g, "");
    if (!/^01\d{8,9}$/.test(phone)) { results.push({ phone: c.phone, skip: "bad-phone" }); continue; }

    // 프로필 state에서 주간 요약(weeklyDigest, 앱이 저장)과 주기(roadCadence) 읽기
    const { data: prof } = await sb.from("nm_profiles").select("state")
      .eq("name", c.profile_name).limit(1);
    const st = prof && prof[0] && prof[0].state || {};
    const cadence = st.roadCadence === "w2" ? "w2" : "w1";
    const ks = cadence === "w2" ? [1, 2] : [1];

    for (const k of ks) {
      const kind = k === 1 ? "weekly" : "weekly-2";
      // 요일 게이트: 학부모별 send_dow / send_dow2, 없으면 전역
      const own = k === 1 ? c.send_dow : c.send_dow2;
      const dow = (own === null || own === undefined) ? (k === 1 ? gDow : gDow2) : Number(own);
      if (!force && !dry && dow !== kstDow) { results.push({ phone, k, skip: "not-send-day", send_dow: dow }); continue; }

      // 회차당 1회 상한 — 이미 보냈으면 건너뜀
      const { data: dup } = await sb.from("nm_notify_log").select("id")
        .eq("phone", phone).eq("week_key", wk).eq("kind", kind).limit(1);
      if (dup && dup.length) { results.push({ phone, k, skip: "already-sent" }); continue; }

      const link = await worksheetLink(sb, c.profile_name, wk, st.weeklyDigest, k);
      const { title, msg, msgType } = composeMsg(c.profile_name, st.weeklyDigest, cadence, link, k);

      if (dry) { results.push({ phone, k, dry: true, send_dow: dow, title, msg, msgType, bytes: smsBytes(msg), link: link.kind }); continue; }

      const res = await sendOne(sb, phone, title, msg, msgType);
      // 로그 insert 실패는 조용히 넘기지 않는다(상한이 이 로그에 기대므로). 2026-09-05: 열 추가 뒤 PostgREST
      // 스키마 캐시가 안 갱신돼 insert가 통째로 실패했던 적이 있다(notify pgrst, 'reload schema' 로 해결).
      const { error: lErr } = await sb.from("nm_notify_log").insert({ phone, week_key: wk, kind, ok: res.ok, detail: res.detail, request_id: res.request_id ?? null });
      results.push({ phone, k, ok: res.ok, via: res.via, request_id: res.request_id, detail: res.ok ? undefined : res.detail, log_error: lErr ? lErr.message : undefined });
    }
  }
  return new Response(JSON.stringify({ week: wk, kst: { dow: kstDow, hour: kstHour }, settings: { send_dow: gDow, send_dow2: gDow2, send_hour: gHour }, count: results.length, results }), {
    headers: { "Content-Type": "application/json" },
  });
});
