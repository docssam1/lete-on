(() => {
  const NAME_KEY = "hs-student";
  const CODE_KEY = "hs-code";

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
    const name = sessionStorage.getItem(NAME_KEY) || "";
    const code = sessionStorage.getItem(CODE_KEY) || "";
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
    sessionStorage.setItem(NAME_KEY, normalizedName);
    sessionStorage.setItem(CODE_KEY, normalizedCode);
    return { name: normalizedName, code: normalizedCode, valid: isValidStudent(normalizedName, normalizedCode) };
  };

  const clearSession = () => {
    sessionStorage.removeItem(NAME_KEY);
    sessionStorage.removeItem(CODE_KEY);
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
  };
})();
