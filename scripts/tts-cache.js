/**
 * TTS 재합성 캐시 — 같은 글을 같은 목소리로 두 번 사기지 않는다
 * ---------------------------------------------------------------------------
 * 왜 필요한가 (2026-09-21 측정):
 *   generate-audio.js 는 `type === 'original'` 만 건너뛰고 **나머지는 매 실행 전부
 *   다시 합성**했다. 재어 보니 한 번 실행에 약 208,811자다(창작 지문 110편 179,143자 +
 *   라이팅 빌리지 4,668자 + 라이브러리 36쪽 ≈ 25,000자). 그런데 워크플로는 `lc*.js`·
 *   `lesson*.js`·`ws*.js`·`sl*.js` 중 **하나라도 건드린 푸시마다** 돈다 — 레슨 한 줄을
 *   고쳐도 전 교재가 다시 과금된다. 달에 다섯 번만 푸시해도 100만 자가 넘는다.
 *
 * 어떻게 고치나:
 *   글과 목소리를 합쳐 해시를 내고, 지난번에 올린 해시와 같으면 건너뛴다.
 *   "지문을 고치면 음성도 새로 만든다"는 원래 의도는 그대로다 — 글이 바뀌면 해시가
 *   바뀌니까. 안 바뀐 것만 안 산다.
 *
 * 명세는 Supabase Storage 안에 둔다(`audio/_tts-<name>.json`).
 *   · 저장소에 커밋하지 않으므로 워크플로에 쓰기 권한을 더 줄 필요가 없다
 *   · 음성 파일과 같은 자리에 있어 둘이 따로 놀 수 없다
 *
 * 첫 실행은 명세가 비어 있어 전부 다시 만든다(약 208,811자, 한 번). 그 뒤로는 바뀐
 * 것만 만든다. 이미 올라간 음성이 현재 글과 맞다고 확신할 때는 `SEED_TTS_CACHE=1`
 * 로 돌리면 **합성 없이 해시만 기록**해 그 한 번의 비용도 건너뛴다.
 *   ⚠ 씨앗 모드는 "지금 스토리지에 있는 MP3 = 지금 데이터 파일의 글"이라고 **믿는**
 *     것이다. 어긋나 있으면 그 어긋남을 그대로 굳힌다. 앱의 AUDIO_STALE 이 비어 있는
 *     동안(= 앱이 저장된 음성을 그대로 믿는 동안)만 쓸 것.
 */
'use strict';
const crypto = require('crypto');

const SEED = process.env.SEED_TTS_CACHE === '1';

function hashOf(text, voice) {
  return crypto.createHash('sha1').update(String(voice || '') + '\n' + String(text || ''), 'utf8')
    .digest('hex').slice(0, 20);
}

/** 명세를 읽어 온다. 없으면 빈 것으로 시작한다(첫 실행). */
async function load(httpRequest, supabaseUrl, supabaseKey, name) {
  const path = `/storage/v1/object/audio/_tts-${name}.json`;
  try {
    const res = await httpRequest({
      hostname: new URL(supabaseUrl).hostname, path, method: 'GET',
      headers: { Authorization: `Bearer ${supabaseKey}` },
    });
    if (res.status !== 200) return {};
    const body = typeof res.body === 'string' ? res.body : String(res.body || '');
    const map = JSON.parse(body);
    return (map && typeof map === 'object') ? map : {};
  } catch (e) { return {}; }
}

/** 명세를 올린다. 실패해도 이번 실행을 망치지는 않는다(다음 실행이 다시 만들 뿐). */
async function save(uploadToSupabase, map, name) {
  try {
    await uploadToSupabase(Buffer.from(JSON.stringify(map, null, 0), 'utf8'),
      `_tts-${name}.json`, 'application/json');
    return true;
  } catch (e) {
    console.warn(`⚠  TTS 캐시 명세를 올리지 못했습니다(${e.message}) — 다음 실행은 전부 다시 만듭니다.`);
    return false;
  }
}

module.exports = { hashOf, load, save, SEED };
