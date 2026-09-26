// 독쌤 목소리 = 원장님 녹음을 복제한 음성(scripts/omnivoice-docssam.py, 원장 PC GPU에서 생성).
// science-lab/audio/docssam/manifest.json 에 **있는 파일만** 쓴다 — 없는 줄은 null 을 돌려주고,
// 부르는 쪽이 예전 목소리(Supabase)로 넘어간다. 파일 이름 = <id>-<sha1("<voice>|<text>") 앞 10자>.mp3
// (글이 바뀌면 이름이 바뀌어 옛 음성을 틀지 않는다).
const BASE = new URL('../audio/docssam/', import.meta.url).href;
let man = null;
function manifest() {
  return (man ||= fetch(BASE + 'manifest.json', { cache: 'no-cache' })
    .then((r) => (r.ok ? r.json() : null))
    .then((j) => (j && j.voice && Array.isArray(j.files) ? { voice: j.voice, files: new Set(j.files) } : null))
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
