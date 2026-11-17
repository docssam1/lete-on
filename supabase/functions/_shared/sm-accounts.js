// 레이키즈(sm/) 전용 계정 — 원장 2026-11-17 「이메일 인증 받아 가입 하도록」.
//  프로젝트의 서버 함수 수가 요금제 한도에 차서 새 함수를 만들 수 없어, fields-members가 `sm-`로 시작하는 요청을 여기로 넘긴다.
//  · 보호자가 이메일 인증번호(Supabase Auth, 필즈 가입과 같은 메일)로 확인한 뒤 아이를 등록하고 승인번호를 정한다.
//  · 레이키즈 전용 계정(필즈 계정과 따로, 표 sm_accounts) · 인증만 하면 기간 없이 바로 계속 이용(원장 답).
//  계약(POST JSON, action):
//   보호자(Authorization: Bearer <이메일 인증 access token>)
//     sm-mine     → { email, children:[{ child, createdAt }] }
//     sm-register { child, code, consent:true } → { child }   — 승인번호는 해시로만 저장, 응답에도 다시 주지 않는다
//     sm-reissue  { child, code }               → { child }   — 승인번호를 새로 정하고 그 아이의 로그인을 모두 끊는다
//   아이(이름 + 승인번호)
//     sm-login    { name, code } → { token, expiresAt, name, permissions:["레이키즈"], type:"sm" }
//     sm-check    { token }      → { ok, name, permissions, type, expiresAt }
//     sm-logout   { token }      → { ok }
//  표(service_role만, RLS 켜고 정책 없음): sm_accounts · sm_sessions · sm_login_failures (migrations/20261117000000_sm_accounts.sql)
const CONSENT_VERSION = "sm-2026-11-17-v1";
const PERMISSIONS = ["레이키즈"];
const SESSION_MS = 12 * 60 * 60 * 1000;            // 필즈 로그인과 같은 12시간
const MAX_FAILS = 5, LOCK_MS = 60 * 60 * 1000;      // 같은 이름 1시간에 5번 틀리면 1시간 막기(필즈와 같게)
const MAX_CHILDREN = 6;                              // 한 이메일에 등록할 수 있는 아이 수

export class SmError extends Error { constructor(status, message) { super(message); this.status = status; } }

async function sha256(value) {
  const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(bytes), (b) => b.toString(16).padStart(2, "0")).join("");
}
const cleanName = (v) => String(v ?? "").normalize("NFKC").replace(/\s+/gu, "").trim();
const validName = (n) => n.length >= 1 && n.length <= 20 && !/[<>"'`\\/]/.test(n) && !["DOCSSAM", "DEMO"].includes(n.toUpperCase());
// 승인번호: 영문·숫자 4~20자, 대소문자 가리지 않음. 같은 글자만·차례(1234·ABCD)·아이 이름은 받지 않는다(필즈와 같은 규칙)
const SEQUENCES = ["0123456789", "9876543210", "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "ZYXWVUTSRQPONMLKJIHGFEDCBA", "QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];
function chosenCode(raw, child) {
  const code = String(raw ?? "").trim().toUpperCase();
  if (!/^[A-Z0-9]{4,20}$/.test(code)) throw new SmError(400, "code_invalid");
  if (/^(.)\1+$/.test(code) || SEQUENCES.some((seq) => seq.includes(code)) || code === child.toUpperCase()) throw new SmError(400, "code_weak");
  return code;
}
// 해시는 이름에 묶는다(같은 번호를 쓰는 다른 아이와 겹치지 않게, 필즈 해시와도 겹치지 않게)
const codeHash = (name, code) => sha256(`sm-auth|${name}|${code}`);
function newToken() {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

// 한 요청 처리 → 응답 몸(JSON 객체). 잘못되면 SmError
export async function handleSm(service, req, body, action) {
  // ── 보호자(이메일 인증) ──
  if (["sm-mine", "sm-register", "sm-reissue"].includes(action)) {
    const bearer = (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
    if (!bearer) throw new SmError(401, "email_required");
    const { data, error } = await service.auth.getUser(bearer);
    const user = data?.user, email = String(user?.email || "").toLowerCase();
    if (error || !user || !email || (!user.email_confirmed_at && !user.confirmed_at)) throw new SmError(401, "email_required");

    if (action === "sm-mine") {
      const { data: rows, error: e } = await service.from("sm_accounts").select("child_name,created_at").eq("parent_user_id", user.id).order("created_at");
      if (e) throw new Error(e.message);
      return { email, children: (rows || []).map((r) => ({ child: r.child_name, createdAt: r.created_at })) };
    }
    const child = cleanName(body.child);
    if (!validName(child)) throw new SmError(400, "child_invalid");
    const code = chosenCode(body.code, child);

    if (action === "sm-register") {
      if (body.consent !== true) throw new SmError(400, "consent_required");
      const { count, error: ce } = await service.from("sm_accounts").select("child_name", { count: "exact", head: true }).eq("parent_user_id", user.id);
      if (ce) throw new Error(ce.message);
      if ((count || 0) >= MAX_CHILDREN) throw new SmError(400, "too_many_children");
      const { data: taken } = await service.from("sm_accounts").select("child_name").eq("child_name", child).maybeSingle();
      if (taken) throw new SmError(409, "name_taken");
      const now = new Date().toISOString();
      const { error: ie } = await service.from("sm_accounts").insert({ child_name: child, parent_user_id: user.id, parent_email: email, code_hash: await codeHash(child, code), consent_version: CONSENT_VERSION, consent_at: now, created_at: now, updated_at: now });
      if (ie) { if (ie.code === "23505" || /duplicate|unique/i.test(ie.message)) throw new SmError(409, "name_taken"); throw new Error(ie.message); }
      return { child };
    }
    // sm-reissue — 이 보호자가 등록한 아이만
    const { data: row } = await service.from("sm_accounts").select("child_name,parent_user_id").eq("child_name", child).maybeSingle();
    if (!row || row.parent_user_id !== user.id) throw new SmError(404, "child_not_found");
    const { error: ue } = await service.from("sm_accounts").update({ code_hash: await codeHash(child, code), active: true, updated_at: new Date().toISOString() }).eq("child_name", child);
    if (ue) throw new Error(ue.message);
    await service.from("sm_sessions").delete().eq("child_name", child);
    await service.from("sm_login_failures").delete().eq("child_name", child);
    return { child };
  }

  // ── 아이 로그인 ──
  if (action === "sm-login") {
    const name = cleanName(body.name), code = String(body.code ?? "").trim().toUpperCase();
    if (!validName(name) || !/^[A-Z0-9]{4,20}$/.test(code)) throw new SmError(401, "invalid");
    const { data: acc } = await service.from("sm_accounts").select("child_name,code_hash,active").eq("child_name", name).maybeSingle();
    if (!acc) throw new SmError(401, "not_found");
    const { data: fail } = await service.from("sm_login_failures").select("fails,first_at,locked_until").eq("child_name", name).maybeSingle();
    if (fail?.locked_until && new Date(fail.locked_until).getTime() > Date.now()) throw new SmError(429, "locked");
    if (acc.active === false) throw new SmError(403, "paused");
    if (acc.code_hash !== await codeHash(name, code)) {
      const now = Date.now(), fresh = !fail || now - new Date(fail.first_at).getTime() > LOCK_MS, fails = (fresh ? 0 : fail.fails) + 1;
      await service.from("sm_login_failures").upsert(fails >= MAX_FAILS
        ? { child_name: name, fails: 0, first_at: new Date(now).toISOString(), locked_until: new Date(now + LOCK_MS).toISOString() }
        : { child_name: name, fails, first_at: fresh ? new Date(now).toISOString() : fail.first_at, locked_until: null });
      throw new SmError(401, "mismatch");
    }
    await service.from("sm_login_failures").delete().eq("child_name", name);
    const token = newToken(), expiresAt = new Date(Date.now() + SESSION_MS).toISOString();
    const { error: se } = await service.from("sm_sessions").insert({ token_hash: await sha256(token), child_name: name, expires_at: expiresAt });
    if (se) throw new Error(se.message);
    await service.from("sm_accounts").update({ last_login_at: new Date().toISOString() }).eq("child_name", name);
    await service.from("sm_sessions").delete().lt("expires_at", new Date().toISOString());   // 지난 세션 정리
    return { token, expiresAt, name, permissions: PERMISSIONS, type: "sm" };
  }
  if (action === "sm-check" || action === "sm-logout") {
    const token = String(body.token || "");
    if (!token) throw new SmError(401, "session_required");
    const hash = await sha256(token);
    if (action === "sm-logout") { await service.from("sm_sessions").delete().eq("token_hash", hash); return { ok: true }; }
    const { data: s } = await service.from("sm_sessions").select("child_name,expires_at").eq("token_hash", hash).maybeSingle();
    if (!s || new Date(s.expires_at).getTime() < Date.now()) throw new SmError(401, "session_expired");
    const { data: acc } = await service.from("sm_accounts").select("active").eq("child_name", s.child_name).maybeSingle();
    if (!acc || acc.active === false) throw new SmError(401, "session_expired");
    return { ok: true, name: s.child_name, permissions: PERMISSIONS, type: "sm", expiresAt: s.expires_at };
  }
  throw new SmError(400, "action_invalid");
}
