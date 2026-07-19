const PROFILE_KEY = "gfield-profile";

export function readProfile() {
  try {
    const value = JSON.parse(localStorage.getItem(PROFILE_KEY) || "{}");
    return value && typeof value === "object" ? value : {};
  } catch {
    return {};
  }
}

// Additive write: callers pass the full profile object they just read+mutated.
// Never called with a partial object, so existing keys are preserved.
export function writeProfile(profile) {
  const safe = profile && typeof profile === "object" ? profile : {};
  safe.version = Math.max(2, Number(safe.version) || 0);
  safe.lastPlayedAt = Date.now();
  localStorage.setItem(PROFILE_KEY, JSON.stringify(safe));
  return safe;
}

export function readGameProgress(gameId) {
  const progress = readProfile().progress?.[gameId];
  return progress && typeof progress === "object" ? progress : {};
}

export function saveGameProgress(gameId, progress) {
  const profile = readProfile();
  profile.version = Math.max(2, Number(profile.version) || 0);
  profile.progress = profile.progress && typeof profile.progress === "object" ? profile.progress : {};
  profile.progress[gameId] = { ...profile.progress[gameId], ...progress, updatedAt: Date.now() };
  profile.lastPlayedAt = Date.now();
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}
