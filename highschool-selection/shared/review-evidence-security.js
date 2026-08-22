(function (root, factory) {
  "use strict";
  const api = factory();
  root.HIGHSELECT_REVIEW_EVIDENCE_SECURITY = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  const EXAM_ID = "sh-selection-r01";
  const ROUND_CODE = "SH-R01";
  const PANEL_ROLES = Object.freeze(["problem", "source-key", "independent-audit"]);
  const IMAGE_MIMES = new Set(["image/png", "image/jpeg", "image/webp"]);
  const PACKET_KEYS = Object.freeze([
    "examId", "roundCode", "reviewVersion", "itemId", "number", "expiresAt", "sourceFingerprintMatched", "panels"
  ]);
  const PANEL_KEYS = Object.freeze(["role", "url", "mimeType"]);
  const PRIVATE_KEYS = Object.freeze([
    "answer", "answers", "answerKey", "answerSpec", "correctAnswer", "solution", "explanation",
    "questionText", "prompt", "sourcePath", "filePath", "pdfUrl", "downloadUrl", "storageUrl",
    "pageImage", "imageData", "rawText", "content", "html"
  ]);
  const PRIVATE_LOCATION_PATTERN = /(?:^[A-Za-z]:[\\/]|file:\/\/|\\\\[^\\]+\\|\.(?:pdf|hwp)(?:$|[?#]))/i;

  function fail(message) { throw new Error(message); }
  function exactKeys(value, allowed, label) {
    if (!value || typeof value !== "object" || Array.isArray(value)) fail(`${label} 형식이 올바르지 않습니다.`);
    const actual = Object.keys(value).sort().join("|");
    if (actual !== allowed.slice().sort().join("|")) fail(`${label} 필드가 올바르지 않습니다.`);
  }
  function inspectPrivate(value, location) {
    if (typeof value === "string" && PRIVATE_LOCATION_PATTERN.test(value)) fail(`${location}에 비공개 위치가 포함되어 있습니다.`);
    if (!value || typeof value !== "object") return;
    Object.keys(value).forEach(function (key) {
      if (PRIVATE_KEYS.includes(key)) fail(`${location}.${key}는 근거 응답에 포함할 수 없습니다.`);
      inspectPrivate(value[key], `${location}.${key}`);
    });
  }
  function cleanHost(value) { return String(value || "").trim().toLowerCase(); }
  function signedImage(rawUrl, mimeType, expiresAt, runtime, now) {
    const hosts = new Set((runtime && runtime.assetHosts || []).map(cleanHost).filter(Boolean));
    if (!hosts.size) fail("허용된 검수 이미지 서버가 설정되지 않았습니다.");
    const mime = String(mimeType || "").toLowerCase();
    if (!IMAGE_MIMES.has(mime)) fail("검수 이미지 형식이 올바르지 않습니다.");
    const expires = Date.parse(expiresAt || "");
    const ttlLimit = Math.min(10 * 60 * 1000, Math.max(1, Number(runtime.maxPageUrlTtlSeconds || 0)) * 1000);
    if (!Number.isFinite(expires) || expires <= now || expires - now > ttlLimit) fail("검수 이미지 만료시간이 올바르지 않습니다.");
    let url;
    try { url = new URL(String(rawUrl || "")); } catch (_) { fail("검수 이미지 주소가 올바르지 않습니다."); }
    if (url.protocol !== "https:" || !hosts.has(cleanHost(url.hostname))) fail("허용되지 않은 검수 이미지 주소입니다.");
    if (/\.(?:pdf|hwp)(?:$|[?#])/i.test(url.pathname + url.search + url.hash)) fail("원본 문서 직접 경로는 사용할 수 없습니다.");
    return Object.freeze({ url: url.href, mimeType: mime });
  }

  function validateEvidencePacket(packet, item, runtime, nowMs) {
    exactKeys(packet, PACKET_KEYS, "검수 근거 응답");
    if (packet.examId !== EXAM_ID || packet.roundCode !== ROUND_CODE) fail("검수 시험 식별자가 일치하지 않습니다.");
    if (!item || packet.itemId !== item.id || packet.number !== item.number) fail("검수 문항 식별자가 일치하지 않습니다.");
    if (typeof packet.reviewVersion !== "string" || !packet.reviewVersion.trim() || packet.reviewVersion.length > 120) fail("검수 버전이 올바르지 않습니다.");
    if (packet.sourceFingerprintMatched !== true) fail("원본 파일 지문이 일치하지 않습니다.");
    if (!Array.isArray(packet.panels) || packet.panels.length !== PANEL_ROLES.length) fail("검수 근거 이미지 수가 올바르지 않습니다.");
    inspectPrivate(packet, "packet");

    const now = Number.isFinite(nowMs) ? nowMs : Date.now();
    const seen = new Set();
    const panels = packet.panels.map(function (panel) {
      exactKeys(panel, PANEL_KEYS, "검수 근거 이미지");
      if (!PANEL_ROLES.includes(panel.role) || seen.has(panel.role)) fail("검수 근거 이미지 역할이 올바르지 않습니다.");
      seen.add(panel.role);
      const image = signedImage(panel.url, panel.mimeType, packet.expiresAt, runtime || {}, now);
      return Object.freeze({ role: panel.role, url: image.url, mimeType: image.mimeType });
    });
    if (PANEL_ROLES.some(function (role) { return !seen.has(role); })) fail("필수 검수 근거 이미지가 없습니다.");
    return Object.freeze({
      examId: EXAM_ID,
      roundCode: ROUND_CODE,
      reviewVersion: packet.reviewVersion,
      itemId: item.id,
      number: item.number,
      expiresAt: String(packet.expiresAt),
      sourceFingerprintMatched: true,
      panels: Object.freeze(panels)
    });
  }

  return Object.freeze({ EXAM_ID, ROUND_CODE, PANEL_ROLES, PRIVATE_KEYS, validateEvidencePacket });
});
