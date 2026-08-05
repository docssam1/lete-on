(() => {
  /* ================= Supabase(hsm_students / hsm_attempts) 연동 =================
     fetch로 REST API(/rest/v1/)를 직접 호출한다. 외부 라이브러리는 쓰지 않는다.
     모든 함수는 실패해도 예외를 던지지 않고 폴백 값을 돌려준다.
     — 서버가 죽어도 학생이 시험을 못 보는 일은 없어야 한다. */

  const BASE = "https://fgahqumaldheqettmvqg.supabase.co/rest/v1";
  const ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZnYWhxdW1hbGRoZXFldHRtdnFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE2NjAzNDcsImV4cCI6MjA5NzIzNjM0N30.iUXLFteDc_xIp_Xj506BKTxnZRYMObmTYQ2Dgh9RAqs";
  const TIMEOUT_MS = 8000;

  function ready() {
    try {
      return typeof navigator === "undefined" || navigator.onLine !== false;
    } catch (e) {
      return true;
    }
  }

  /* 공통 요청 헬퍼. 네트워크 오류·타임아웃이면 null을 돌려준다(예외를 던지지 않는다). */
  async function request(path, options) {
    let controller = null;
    let timer = null;
    try {
      controller = new AbortController();
      timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
      const opts = options || {};
      const res = await fetch(BASE + path, {
        method: opts.method || "GET",
        headers: Object.assign(
          {
            apikey: ANON_KEY,
            Authorization: "Bearer " + ANON_KEY,
            "Content-Type": "application/json",
          },
          opts.headers || {}
        ),
        body: opts.body,
        signal: controller.signal,
      });
      let data = null;
      try {
        data = await res.json();
      } catch (e) {
        data = null;
      }
      return { ok: res.ok, status: res.status, data };
    } catch (e) {
      return null;
    } finally {
      if (timer) clearTimeout(timer);
    }
  }

  async function markStart(name) {
    const n = String(name == null ? "" : name).trim();
    if (!n) return false;
    const res = await request("/hsm_students", {
      method: "POST",
      headers: { Prefer: "resolution=ignore-duplicates" },
      body: JSON.stringify({ name: n }),
    });
    return !!(res && res.ok);
  }

  async function getStart(name) {
    const n = String(name == null ? "" : name).trim();
    if (!n) return null;
    const res = await request(
      "/hsm_students?name=eq." + encodeURIComponent(n) + "&select=started_at",
      { method: "GET" }
    );
    if (!res || !res.ok || !Array.isArray(res.data) || !res.data.length) return null;
    return res.data[0].started_at || null;
  }

  /* → [{attempt,score,correct,answered,states,created_at}, ...] attempt 오름차순
     서버 실패 시 null(빈 배열과 구분해 호출부가 로컬 값으로 폴백할 수 있도록 한다). */
  async function listAttempts(name, round) {
    const n = String(name == null ? "" : name).trim();
    const r = String(round == null ? "" : round).trim();
    if (!n || !r) return null;
    const res = await request(
      "/hsm_attempts?student=eq." +
        encodeURIComponent(n) +
        "&round=eq." +
        encodeURIComponent(r) +
        "&order=attempt.asc&select=attempt,score,correct,answered,states,created_at",
      { method: "GET" }
    );
    if (!res || !res.ok || !Array.isArray(res.data)) return null;
    return res.data;
  }

  /* rec={score,correct,answered,states} → {ok:true,attempt:n} | {ok:false,reason:'full'|'offline'}
     attempt 번호는 기존 개수+1. 3건이면 시도하지 않는다. */
  async function addAttempt(name, round, rec) {
    const n = String(name == null ? "" : name).trim();
    const r = String(round == null ? "" : round).trim();
    if (!n || !r || !rec) return { ok: false, reason: "offline" };

    const existing = await listAttempts(n, r);
    if (existing === null) return { ok: false, reason: "offline" };
    if (existing.length >= 3) return { ok: false, reason: "full" };

    const attempt = existing.length + 1;
    const res = await request("/hsm_attempts", {
      method: "POST",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify({
        student: n,
        round: r,
        attempt: attempt,
        score: rec.score,
        correct: rec.correct,
        answered: rec.answered,
        states: rec.states || {},
      }),
    });

    if (!res) return { ok: false, reason: "offline" };
    if (res.ok) return { ok: true, attempt: attempt };

    /* 409(중복 PK) 또는 CHECK 위반(attempt 1~3)이면 정원이 찬 것으로 본다 */
    const errCode = res.data && res.data.code;
    if (res.status === 409 || errCode === "23514") return { ok: false, reason: "full" };
    return { ok: false, reason: "offline" };
  }

  /* 관리자용. 전체 기록 → [{student,round,attempt,score,created_at}, ...] */
  async function allAttempts() {
    const res = await request(
      "/hsm_attempts?select=student,round,attempt,score,created_at&order=student.asc,round.asc,attempt.asc",
      { method: "GET" }
    );
    if (!res || !res.ok || !Array.isArray(res.data)) return [];
    return res.data;
  }

  window.HSMIDDLE_CLOUD = {
    ready,
    markStart,
    getStart,
    listAttempts,
    addAttempt,
    allAttempts,
  };
})();
