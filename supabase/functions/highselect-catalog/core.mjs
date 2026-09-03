const SCHEMA_VERSION = "highselect-private-edge-catalog/v1";
const ALLOWED_QUERY_KEYS = new Set(["profiles", "q", "limit", "includeCandidates", "action"]);

function clean(value) { return String(value == null ? "" : value).trim(); }

function normalizedSearchText(item) {
  return [
    item.questionId, item.sourceLabel, item.semester, item.majorUnit, item.minorUnit,
    item.typeId, item.typeLabel, item.domainGroup, item.taxonomyReviewStatus
  ].map(clean).join(" ").toLocaleLowerCase("ko-KR");
}

function validateSnapshot(snapshot) {
  if (!snapshot || snapshot.schemaVersion !== SCHEMA_VERSION) throw new Error("catalog_snapshot_invalid");
  if (!Array.isArray(snapshot.profiles) || !Array.isArray(snapshot.items) || !Array.isArray(snapshot.representativeAnalyses)) {
    throw new Error("catalog_snapshot_invalid");
  }
  return snapshot;
}

function searchSnapshot(snapshotValue, searchParams) {
  const snapshot = validateSnapshot(snapshotValue);
  for (const key of searchParams.keys()) {
    if (!ALLOWED_QUERY_KEYS.has(key)) throw new Error("query_invalid");
  }
  const requested = Array.from(new Set(clean(searchParams.get("profiles")).split(",").map(clean).filter(Boolean)));
  const known = new Set(snapshot.profiles.map(profile => profile.profileId));
  if (!requested.length || requested.some(profileId => !known.has(profileId))) throw new Error("profiles_invalid");
  const limitText = searchParams.get("limit");
  const limit = limitText == null ? 100 : Number(limitText);
  if (!Number.isSafeInteger(limit) || limit < 1 || limit > 300) throw new Error("limit_invalid");
  const includeCandidatesText = searchParams.get("includeCandidates");
  if (includeCandidatesText != null && !["0", "1"].includes(includeCandidatesText)) throw new Error("include_candidates_invalid");
  const includeCandidates = includeCandidatesText === "1";
  const query = clean(searchParams.get("q")).toLocaleLowerCase("ko-KR");
  const items = snapshot.items.filter(item => {
    const fits = Array.isArray(item.profiles) ? item.profiles : [];
    if (!fits.some(fit => requested.includes(fit.profileId))) return false;
    if (!includeCandidates && item.releaseEligible !== true) return false;
    return !query || normalizedSearchText(item).includes(query);
  }).slice(0, limit);
  return {
    schemaVersion: SCHEMA_VERSION,
    snapshotRevision: clean(snapshot.snapshotRevision),
    profiles: snapshot.profiles.filter(profile => requested.includes(profile.profileId)),
    representativeAnalyses: snapshot.representativeAnalyses.filter(analysis => requested.includes(analysis.profileId)),
    items,
    count: items.length
  };
}

export { SCHEMA_VERSION, ALLOWED_QUERY_KEYS, validateSnapshot, searchSnapshot };
