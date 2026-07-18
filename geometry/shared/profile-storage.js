const PROFILE_KEY = "gfield-profile";

export function readProfile() {
  try {
    const value = JSON.parse(localStorage.getItem(PROFILE_KEY) || "{}");
    return value && typeof value === "object" ? value : {};
  } catch {
    return {};
  }
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
