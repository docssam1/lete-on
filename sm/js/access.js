// 유아 영재 학습 게임(sm/) 입장 — 원장 2026-11-12 「원생만(DEMO 없음) · 학부모가 접속 · 로그인 방법은 필즈와 같아」
//  · 원생: 필즈 더 클래식과 같은 fields-auth(승인번호 + 아이 이름, 12시간 세션) — 관리자(DOCSSAM) 또는 「레이키즈」 권한(내부 ID, 화면 이름은 「유아 영재 학습 게임」)을 켠 승인번호.
//  · 이메일 가입(원장 2026-11-17 「이메일 인증 받아 가입 하도록」): 전용 계정(필즈와 따로, 기간 없이 계속 이용).
//    보호자 이메일 인증 → 아이 등록·승인번호 정하기(signup.html). 로그인은 같은 칸(아이 이름 + 승인번호)에서 전용 계정을 먼저 보고,
//    없거나 맞지 않으면 필즈 승인번호로 다시 본다. 서버는 fields-members의 sm-* 요청(_shared/sm-accounts.js).
//  · 화면 잠금이다. 정답·원본은 이 저장소에 두지 않는다(정답 확인이 필요해지면 세션을 확인하는 서버 함수로).
import { login as fieldsLogin, logout as fieldsLogout, loggedIn as fieldsLoggedIn, checkSession } from "../../fields-classic/question-bank/study-progress.js?v=20261111p";

export const PERMISSION = "레이키즈";   // 권한 내부 ID — 이미 켠 승인번호가 있어 바꾸지 않는다(원장 2026-11-23 「이름을 레이키즈라 하지마」는 화면 이름)
export const SB = "https://fgahqumaldheqettmvqg.supabase.co";
export const ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZnYWhxdW1hbGRoZXFldHRtdnFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE2NjAzNDcsImV4cCI6MjA5NzIzNjM0N30.iUXLFteDc_xIp_Xj506BKTxnZRYMObmTYQ2Dgh9RAqs";
const MEMBERS = `${SB}/functions/v1/fields-members`;
const SM_KEY = "sm_sess";   // 이 탭에서만: { token, name, until }

// 전용 계정 요청(fields-members sm-*). bearer: 보호자 이메일 인증 토큰
export async function smCall(body, bearer = "") {
  const response = await fetch(MEMBERS, { method: "POST", headers: { "Content-Type": "application/json", apikey: ANON, ...(bearer ? { Authorization: `Bearer ${bearer}` } : {}) }, body: JSON.stringify(body), cache: "no-store" });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) { const error = new Error(data.error || "request_failed"); error.status = response.status; throw error; }
  return data;
}
const smSaved = () => { try { const s = JSON.parse(sessionStorage.getItem(SM_KEY) || "null"); return s && s.until > Date.now() ? s : null; } catch { return null; } };
const smClear = () => { try { sessionStorage.removeItem(SM_KEY); } catch { /* 없음 */ } };

// 로그인: 전용 계정 → 안 되면 필즈 승인번호
export async function login(code, name) {
  try {
    const r = await smCall({ action: "sm-login", name, code });
    try { sessionStorage.setItem(SM_KEY, JSON.stringify({ token: r.token, name: r.name, until: Date.parse(r.expiresAt) })); } catch { /* 저장 안 됨 */ }
    return { name: r.name, type: "sm", permissions: r.permissions };
  } catch (smError) {
    if (["locked", "paused"].includes(smError.message)) throw smError;   // 전용 계정이 있고 막힌 경우는 그 까닭을 알린다
    try { return await fieldsLogin(code, name); }
    catch (fieldsError) { throw smError.message === "mismatch" ? smError : fieldsError; }
  }
}
export async function logout() {
  const s = smSaved();
  if (s) { smCall({ action: "sm-logout", token: s.token }).catch(() => {}); smClear(); }
  await fieldsLogout().catch(() => {});
}
export const loggedIn = () => smSaved() ? { name: smSaved().name, type: "sm", permissions: [PERMISSION] } : fieldsLoggedIn();

const allowed = (me) => Boolean(me) && (me.type === "admin" || (me.permissions || []).includes(PERMISSION));

// 공개 입구(sm/open/, 원장 2026-11-12 「권한 없이 열리는 공개 페이지」): 페이지가 SM_OPEN을 켜면 로그인·권한 확인 없이 연다.
//  공개 입구에도 교재 지문 파일은 없다(저장소 밖). 진행 기록은 이 기기에만 「친구」 이름으로 남는다.
export const OPEN = globalThis.SM_OPEN === true;
// 서버에서 세션을 다시 확인하고 { ok, me, why } — why: login(로그인 필요) | permission(권한 없음)
export async function gate() {
  if (OPEN) return { ok: true, me: { name: "친구", type: "guest", open: true } };
  const s = smSaved();
  if (s) {
    try { const r = await smCall({ action: "sm-check", token: s.token }); return { ok: true, me: { name: r.name, type: "sm", permissions: r.permissions } }; }
    catch (error) { if (error.status === 401) smClear(); else return { ok: true, me: { name: s.name, type: "sm", permissions: [PERMISSION] } }; }   // 연결이 잠깐 안 되면 이 탭의 세션으로
  }
  const me = fieldsLoggedIn() ? await checkSession().then(() => fieldsLoggedIn()) : null;
  if (!me) return { ok: false, why: "login" };
  return allowed(me) ? { ok: true, me } : { ok: false, why: "permission", me };
}

// 로그인 실패 까닭을 학부모가 알아듣는 말로
export function loginError(error) {
  const code = String(error?.message || "");
  if (code === "trial_expired") return "체험 기간이 끝났어요. 학원에 문의해 주세요.";
  if (code === "paused") return "지금은 멈춘 계정이에요. 학원에 문의해 주세요.";
  if (code === "locked" || error?.status === 429) return "여러 번 틀려서 1시간 동안 잠겼어요. 승인번호를 잊었으면 「승인번호를 잊었어요」로 새로 정해 주세요.";
  if (error?.status === 401 || /invalid|not_found|mismatch/.test(code)) return "승인번호나 아이 이름이 맞지 않아요. 다시 확인해 주세요.";
  return "지금 연결이 어려워요. 잠시 뒤에 다시 해 주세요.";
}
