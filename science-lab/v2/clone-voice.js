// 독쌤 목소리 음성 파일(scripts/omnivoice-docssam.py 로 GPU PC에서 생성).
// science-lab/audio/docssam/manifest.json 에 **있는 파일만** 쓴다 — 없는 줄은 null 을 돌려주고,
// 부르는 쪽이 예전 목소리(Supabase)로 넘어간다. 파일 이름 = <id>-<sha1("<voice>|<text>") 앞 10자>.mp3
// (글이 바뀌면 이름이 바뀌어 옛 음성을 틀지 않는다).
// 재생 속도: 녹음의 말 빠르기(초당 약 6.5음절)가 공부하기엔 빨라 0.8배로 튼다(목소리 높낮이는 그대로).
// 나중에 느리게 다시 만들면(omnivoice-docssam.py --speed) manifest 의 rate 가 1 이 되어 원래 속도로 튼다.
const DEFAULT_RATE = 0.8;
const BASE = new URL('../audio/docssam/', import.meta.url).href;
let man = null;
function manifest() {
  return (man ||= fetch(BASE + 'manifest.json', { cache: 'no-cache' })
    .then((r) => (r.ok ? r.json() : null))
    .then((j) => (j && j.voice && Array.isArray(j.files) ? { voice: j.voice, files: new Set(j.files), rate: Number(j.rate) || DEFAULT_RATE } : null))
    .catch(() => null));
}
async function sha10(s) {
  const buf = await crypto.subtle.digest('SHA-1', new TextEncoder().encode(s));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('').slice(0, 10);
}
export async function cloneUrl(id, text) {
  if (!id || !text) return null;
  const m = await manifest(); if (!m) return null;
  const f = `${id}-${await sha10(`${m.voice}|${text}`)}.mp3`;
  return m.files.has(f) ? BASE + f : null;
}
// 복제 음성 파일이면 느리게(높낮이 유지), 다른 음성(Supabase)은 그대로
export async function tuneClone(audio, src) {
  if (!audio || !src || !src.startsWith(BASE)) return;
  const m = await manifest(); const r = m?.rate || DEFAULT_RATE;
  try { audio.preservesPitch = true; audio.defaultPlaybackRate = r; audio.playbackRate = r; } catch { /* 속도 조절이 안 되는 기기 */ }
}
