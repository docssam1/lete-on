// 레이키즈 학습(sm/) 입장 — 원장 2026-11-12 「원생만(DEMO 없음) · 학부모가 접속 · 로그인 방법은 필즈와 같아」
//  · 로그인은 필즈 더 클래식과 같은 fields-auth(승인번호 + 아이 이름, 12시간 세션)를 그대로 쓴다.
//  · 들어갈 수 있는 사람: 관리자(DOCSSAM) 또는 승인 관리에서 「레이키즈」 권한을 켠 승인번호.
//  · 화면 잠금이다. 정답·원본은 이 저장소에 두지 않는다(정답 확인이 필요해지면 세션을 확인하는 서버 함수로).
import { login, logout, loggedIn, checkSession } from "../../fields-classic/question-bank/study-progress.js?v=20261111p";

export const PERMISSION = "레이키즈";
export { login, logout, loggedIn };

const allowed = (me) => Boolean(me) && (me.type === "admin" || (me.permissions || []).includes(PERMISSION));

// 서버에서 세션을 다시 확인하고 { ok, me, why } — why: login(로그인 필요) | permission(권한 없음)
export async function gate() {
  const me = loggedIn() ? await checkSession().then(() => loggedIn()) : null;
  if (!me) return { ok: false, why: "login" };
  return allowed(me) ? { ok: true, me } : { ok: false, why: "permission", me };
}

// 로그인 실패 까닭을 학부모가 알아듣는 말로
export function loginError(error) {
  const code = String(error?.message || "");
  if (code === "trial_expired") return "체험 기간이 끝났어요. 학원에 문의해 주세요.";
  if (code === "paused") return "지금은 멈춘 계정이에요. 학원에 문의해 주세요.";
  if (error?.status === 401 || /invalid|not_found|mismatch/.test(code)) return "승인번호나 아이 이름이 맞지 않아요. 다시 확인해 주세요.";
  return "지금 연결이 어려워요. 잠시 뒤에 다시 해 주세요.";
}
