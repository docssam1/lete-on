(() => {
  /* ================= 1회성 이관: sessionStorage → localStorage =================
     예전 버전은 로그인/채점 데이터를 sessionStorage(탭 단위)에 저장했다.
     새 탭에서 분석지를 열면 로그인이 풀리고 채점 결과가 사라지는 문제가 있어
     localStorage로 전환한다. 기존 사용자가 가지고 있던 sessionStorage 값은
     한 번만 localStorage로 복사한다(이미 localStorage에 값이 있으면 건너뜀). */
  try {
    const MIGRATE_EXACT_KEYS = ["hs-student", "hs-code"];
    const MIGRATE_PREFIXES = ["hsm-answer-", "hsm-ox-", "hs-mock-", "hs-final-", "hs-diagnostic-"];
    for (let i = 0; i < sessionStorage.length; i++) {
      const k = sessionStorage.key(i);
      if (!k) continue;
      const shouldMigrate = MIGRATE_EXACT_KEYS.includes(k) || MIGRATE_PREFIXES.some(prefix => k.startsWith(prefix));
      if (shouldMigrate && localStorage.getItem(k) === null) {
        localStorage.setItem(k, sessionStorage.getItem(k));
      }
    }
  } catch (e) {}

  const NAME_KEY = "hs-student";
  const CODE_KEY = "hs-code";
  const STARTED_PREFIX = "hsm-started-";
  const USAGE_PERIOD_DAYS = 180; /* 6개월 */

  const trim = value => String(value ?? "").trim();
  const upper = value => trim(value).toUpperCase();
  const data = () => window.HSMIDDLE_DATA || {};
  const studentCodeMap = () => data().studentCode || {};
  const accessMap = () => data().access || {};

  const normalizeName = name => trim(name);
  const normalizeCode = code => upper(code);

  const accessList = name => {
    const list = accessMap()[normalizeName(name)];
    return Array.isArray(list) ? list.slice() : [];
  };

  const canAccess = (name, examKey) => {
    return accessList(name).includes(examKey);
  };

  const isAdmin = name => {
    const list = data().admins;
    return Array.isArray(list) && list.includes(normalizeName(name));
  };

  const isValidStudent = (name, code) => {
    const normalizedName = normalizeName(name);
    const normalizedCode = normalizeCode(code);
    if (!normalizedName || !normalizedCode) return false;
    const codeMap = studentCodeMap();
    const expected = normalizeCode(codeMap[normalizedName]);
    return Boolean(expected) && expected === normalizedCode;
  };

  const readSession = () => {
    const name = localStorage.getItem(NAME_KEY) || "";
    const code = localStorage.getItem(CODE_KEY) || "";
    return {
      name,
      code,
      valid: isValidStudent(name, code),
      access: accessList(name),
    };
  };

  const writeSession = (name, code) => {
    const normalizedName = normalizeName(name);
    const normalizedCode = normalizeCode(code);
    localStorage.setItem(NAME_KEY, normalizedName);
    localStorage.setItem(CODE_KEY, normalizedCode);
    return { name: normalizedName, code: normalizedCode, valid: isValidStudent(normalizedName, normalizedCode) };
  };

  const clearSession = () => {
    localStorage.removeItem(NAME_KEY);
    localStorage.removeItem(CODE_KEY);
  };

  /* ================= 이용 기간 (첫 로그인 후 6개월) =================
     서버가 없으므로 기기·브라우저 단위로만 관리된다. 학생이 다른 기기나
     브라우저(또는 시크릿 모드)로 접속하면 이 기록은 공유되지 않는다. */
  const startedAt = name => {
    return localStorage.getItem(STARTED_PREFIX + normalizeName(name)) || null;
  };

  const markStart = name => {
    const k = STARTED_PREFIX + normalizeName(name);
    if (!localStorage.getItem(k)) {
      localStorage.setItem(k, new Date().toISOString());
    }
  };

  const daysLeft = name => {
    const started = startedAt(name);
    if (!started) return USAGE_PERIOD_DAYS;
    const startedTime = new Date(started).getTime();
    if (Number.isNaN(startedTime)) return USAGE_PERIOD_DAYS;
    const elapsedDays = Math.floor((Date.now() - startedTime) / 86400000);
    return USAGE_PERIOD_DAYS - elapsedDays;
  };

  const isExpired = name => {
    if (isAdmin(name)) return false;
    return daysLeft(name) <= 0;
  };

  window.HSMIDDLE_AUTH = {
    NAME_KEY,
    CODE_KEY,
    normalizeName,
    normalizeCode,
    accessList,
    canAccess,
    isAdmin,
    isValidStudent,
    readSession,
    writeSession,
    clearSession,
    startedAt,
    markStart,
    daysLeft,
    isExpired,
  };
})();
