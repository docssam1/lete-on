(function (root) {
  "use strict";

  const RESPONSE_TYPES = Object.freeze(["input", "multi_input", "ordered_list", "unordered_set", "self_check"]);
  const RESPONSE_TYPE_SET = new Set(RESPONSE_TYPES);

  function canonicalType(value) {
    const type = String(value || "").trim().toLowerCase();
    return type === "ox" ? "self_check" : type;
  }

  function halfWidth(value) {
    return String(value == null ? "" : value)
      .replace(/[！-～]/g, function (char) { return String.fromCharCode(char.charCodeAt(0) - 0xfee0); })
      .replace(/　/g, " ");
  }

  function cleanValue(value) {
    return halfWidth(value).trim();
  }

  function listValues(raw) {
    const source = Array.isArray(raw)
      ? raw
      : (raw && typeof raw === "object" && Array.isArray(raw.items) ? raw.items : halfWidth(raw).split(/[,\n]+/));
    return source.map(cleanValue).filter(Boolean);
  }

  function unorderedValues(raw) {
    return listValues(raw).slice().sort(function (left, right) {
      const a = left.toLocaleLowerCase("ko-KR");
      const b = right.toLocaleLowerCase("ko-KR");
      return a < b ? -1 : (a > b ? 1 : (left < right ? -1 : (left > right ? 1 : 0)));
    });
  }

  function parseStoredArray(raw) {
    if (Array.isArray(raw)) return raw;
    if (raw && typeof raw === "object" && Array.isArray(raw.value)) return raw.value;
    try {
      const parsed = JSON.parse(String(raw == null ? "" : raw));
      if (Array.isArray(parsed)) return parsed;
      if (parsed && Array.isArray(parsed.value)) return parsed.value;
      if (parsed && Array.isArray(parsed.slots)) return parsed.slots.map(function (slot) { return slot && slot.value; });
    } catch (_) { /* A legacy scalar becomes the first slot below. */ }
    return raw == null || raw === "" ? [] : [raw];
  }

  function multiValues(question, raw) {
    const fields = Array.isArray(question && question.fields) ? question.fields : [];
    const stored = parseStoredArray(raw);
    return fields.map(function (_, index) { return cleanValue(stored[index]); });
  }

  function isAnswered(question, raw) {
    const type = canonicalType(question && question.responseType);
    if (type === "multi_input") return multiValues(question, raw).some(Boolean);
    if (type === "ordered_list" || type === "unordered_set") return listValues(raw).length > 0;
    return cleanValue(raw) !== "";
  }

  function collect(question, raw) {
    const type = canonicalType(question && question.responseType);
    if (!RESPONSE_TYPE_SET.has(type)) throw new Error("지원하지 않는 답안 입력 방식입니다.");

    if (type === "multi_input") {
      const fields = Array.isArray(question.fields) ? question.fields : [];
      return {
        value: multiValues(question, raw),
        slotIds: fields.map(function (field, index) { return String(field.slotId || `slot-${index + 1}`); }),
        groupIds: fields.map(function (field) { return field.groupId ? String(field.groupId) : null; })
      };
    }
    if (type === "ordered_list") return { value: listValues(raw) };
    if (type === "unordered_set") return { value: unorderedValues(raw) };
    if (type === "self_check") {
      const value = cleanValue(raw).toLowerCase();
      return { value: value === "o" || value === "x" ? value : "" };
    }
    return { value: cleanValue(raw) };
  }

  root.HIGHSELECT_RESPONSE_CONTRACT = {
    RESPONSE_TYPES,
    canonicalType,
    listValues,
    unorderedValues,
    multiValues,
    isAnswered,
    collect
  };
  if (typeof module !== "undefined" && module.exports) module.exports = root.HIGHSELECT_RESPONSE_CONTRACT;
})(typeof window !== "undefined" ? window : globalThis);
