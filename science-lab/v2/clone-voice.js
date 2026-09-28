// 독쌤 목소리 음성 파일(scripts/omnivoice-docssam.py 로 GPU PC에서 생성).
// science-lab/audio/docssam/manifest.json 에 **있는 파일만** 쓴다 — 없는 줄은 null 을 돌려주고,
// 부르는 쪽이 예전 목소리(Supabase)로 넘어간다. 파일 이름 = <id>-<sha1("<목소리>|<글>") 앞 10자>.mp3
// (글이 바뀌면 이름이 바뀌어 옛 음성을 틀지 않는다).
// 목소리가 둘일 수 있다(manifest.voices 순서대로 찾는다):
//   docssam-clone-v2-slow — 공부 대사를 처음부터 느리게(0.8) 만든 것 → 원래 속도로 튼다
//   docssam-clone-v1      — 녹음 그대로의 빠르기(초당 약 6.5음절) → 공부 화면에서는 0.8배(높낮이 유지)
// 소개(광고) 페이지는 { study: false } 로 불러 언제나 원래 속도로 튼다(원장 결정 2026-09-28).
const DEFAULT_RATES = { 'docssam-clone-v2-slow': 1, 'docssam-clone-v1': 0.8 };
const BASE = new URL('../audio/docssam/', import.meta.url).href;
const voiceOfUrl = new Map();
let man = null;
function manifest() {
  return (man ||= fetch(BASE + 'manifest.json', { cache: 'no-cache' })
    .then((r) => (r.ok ? r.json() : null))
    .then((j) => {
      if (!j || !Array.isArray(j.files)) return null;
      const voices = Array.isArray(j.voices) ? j.voices : j.voice ? [j.voice] : [];
      const rates = { ...DEFAULT_RATES, ...(j.rates || {}) };
      if (j.voice && j.rate) rates[j.voice] = Number(j.rate);   // 옛 형식
      return voices.length ? { voices, rates, files: new Set(j.files) } : null;
    })
    .catch(() => null));
}
async function sha10(s) {
  const buf = await crypto.subtle.digest('SHA-1', new TextEncoder().encode(s));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('').slice(0, 10);
}
export async function cloneUrl(id, text) {
  if (!id || !text) return null;
  const m = await manifest(); if (!m) return null;
  for (const v of m.voices) {
    const f = `${id}-${await sha10(`${v}|${text}`)}.mp3`;
    if (m.files.has(f)) { voiceOfUrl.set(BASE + f, v); return BASE + f; }
  }
  return null;
}
// 복제 음성 파일이면 목소리에 맞는 속도로(높낮이 유지). 다른 음성(Supabase)은 그대로.
export async function tuneClone(audio, src, { study = true } = {}) {
  if (!audio || !src || !src.startsWith(BASE)) return;
  const m = await manifest(); const v = voiceOfUrl.get(src);
  const r = study ? (m?.rates?.[v] ?? DEFAULT_RATES[v] ?? 1) : 1;
  try { audio.preservesPitch = true; audio.defaultPlaybackRate = r; audio.playbackRate = r; } catch { /* 속도 조절이 안 되는 기기 */ }
}
