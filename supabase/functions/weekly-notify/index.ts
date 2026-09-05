// Numbers of Magic — 주간 학부모 알림 발송 (알리고 SMS/LMS)  v4
// 트리거: POST { trigger_key, dry?, test_phone? }  — pg_cron 또는 수동 curl.
//   dry:true      → 발송 없이 문안만 돌려준다.
//   test_phone    → 연락처를 돌지 않고 그 번호 한 건만 보낸다(연결 점검용, kind='test').
// 발송 경로(우선순위):
//   1) NOTIFY_RELAY_URL 이 Apps Script 웹앱(script.google.com)이면
//      gfield-report 가 쓰는 계약 그대로 POST {action:'aligo_sms', receiver, msg, targetDate:''}
//      → 응답 {result:'success'} 를 성공으로 본다. (키는 Apps Script 쪽에만 있다.)
//   2) NOTIFY_RELAY_URL 이 그 밖의 주소면 사설서버 릴레이(설계 §8):
//      POST {receiver, msg, title, msg_type:'LMS'} + X-Relay-Key → {ok:true|false}
//   3) NOTIFY_RELAY_URL 이 없으면 알리고 직접(ALIGO_API_KEY/USER_ID/SENDER) — IP 화이트리스트에 막힐 수 있음.
// 시크릿: NOTIFY_TRIGGER_KEY, NOTIFY_RELAY_URL?, NOTIFY_RELAY_KEY?, ALIGO_API_KEY?, ALIGO_USER_ID?, ALIGO_SENDER?
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

type SendResult = { ok: boolean; detail: string; via: string };

async function sendOne(phone: string, title: string, msg: string): Promise<SendResult> {
  const relay = (Deno.env.get("NOTIFY_RELAY_URL") ?? "").trim();
  try {
    if (relay && /script\.google(?:usercontent)?\.com/.test(relay)) {
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
        headers: { "Content-Type": "application/json", "X-Relay-Key": Deno.env.get("NOTIFY_RELAY_KEY") ?? "" },
        body: JSON.stringify({ receiver: phone, msg, title, msg_type: "LMS" }),
      });
      const j: any = await r.json().catch(() => ({}));
      return { ok: r.ok && j.ok === true, detail: JSON.stringify(j).slice(0, 500), via: "relay" };
    }
    // 3) 알리고 직접 (LMS — 본문이 90바이트를 넘으므로)
    const form = new FormData();
    form.set("key", Deno.env.get("ALIGO_API_KEY") ?? "");
    form.set("user_id", Deno.env.get("ALIGO_USER_ID") ?? "");
    form.set("sender", Deno.env.get("ALIGO_SENDER") ?? "");
    form.set("receiver", phone);
    form.set("msg", msg);
    form.set("msg_type", "LMS");
    form.set("title", title);
    const r = await fetch("https://apis.aligo.in/send/", { method: "POST", body: form });
    const j: any = await r.json();
    return { ok: String(j.result_code) === "1", detail: JSON.stringify(j).slice(0, 500), via: "aligo" };
  } catch (e) {
    return { ok: false, detail: String(e).slice(0, 500), via: relay ? "relay" : "aligo" };
  }
}

Deno.serve(async (req: Request) => {
  let body: any = {};
  try { body = await req.json(); } catch (_) { /* 빈 본문 허용 */ }
  const need = Deno.env.get("NOTIFY_TRIGGER_KEY");
  if (!need || body.trigger_key !== need) {
    return new Response(JSON.stringify({ error: "bad trigger_key" }), { status: 403 });
  }
  const dry = !!body.dry;
  const sb = createClient(SB_URL, SB_SERVICE);
  const wk = weekKey(new Date());

  // 연결 점검: 한 번호에 한 건만 (연락처·주1회 상한과 무관, kind='test')
  if (body.test_phone) {
    const phone = String(body.test_phone).replace(/\D/g, "");
    if (!/^01\d{8,9}$/.test(phone)) return new Response(JSON.stringify({ error: "bad test_phone" }), { status: 400 });
    const { title, msg } = composeMsg("테스트", null, "w1");
    if (dry) return new Response(JSON.stringify({ week: wk, test: true, dry: true, phone, title, msg }), { headers: { "Content-Type": "application/json" } });
    const res = await sendOne(phone, title, msg);
    await sb.from("nm_notify_log").insert({ phone, week_key: wk + "-t" + Date.now().toString(36), kind: "test", ok: res.ok, detail: res.detail });
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

    const res = await sendOne(phone, title, msg);
    await sb.from("nm_notify_log").insert({ phone, week_key: wk, kind: "weekly", ok: res.ok, detail: res.detail });
    results.push({ phone, ok: res.ok, via: res.via, detail: res.ok ? undefined : res.detail });
  }
  return new Response(JSON.stringify({ week: wk, count: results.length, results }), {
    headers: { "Content-Type": "application/json" },
  });
});
