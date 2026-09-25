#!/usr/bin/env node
/* 수학 이야기 3D 대표 그림 검사(2026-09-26)
   data/hero3d.js 에 등록된 유닛마다: 유닛이 있고, assets/hero3d/<유닛>.webp 가 있고(1600×1000 WebP),
   alt 가 ko·en·zh 셋 다 있고, app/hero3d/scenes.js 에 장면이 있고(다시 구울 수 있어야 한다), 그 장면이 움직인다(k.onFrame).
   그림 파일만 있고 등록이 없는 유닛도 실패 — 앱·인쇄에 안 나오는 그림이 된다. */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
global.window = {};
require(path.join(ROOT, 'data', 'hero3d.js'));
const H = window.NM_HERO3D || {};
const scenes = fs.readFileSync(path.join(ROOT, 'app', 'hero3d', 'scenes.js'), 'utf8');
const bad = [];
const webpSize = buf => {
  if(buf.toString('ascii', 0, 4) !== 'RIFF' || buf.toString('ascii', 8, 12) !== 'WEBP') return null;
  const chunk = buf.toString('ascii', 12, 16);
  if(chunk === 'VP8 ') return [buf.readUInt16LE(26) & 0x3fff, buf.readUInt16LE(28) & 0x3fff];
  if(chunk === 'VP8L'){ const b = buf.readUInt32LE(21); return [(b & 0x3fff) + 1, ((b >> 14) & 0x3fff) + 1]; }
  if(chunk === 'VP8X') return [1 + buf.readUIntLE(24, 3), 1 + buf.readUIntLE(27, 3)];
  return null;
};
for(const [uid, v] of Object.entries(H)){
  if(!fs.existsSync(path.join(ROOT, 'data', 'units', uid + '.js'))) bad.push(`${uid}: 유닛 파일 없음`);
  const f = path.join(ROOT, 'assets', 'hero3d', uid + '.webp');
  if(!fs.existsSync(f)) bad.push(`${uid}: 그림 없음(node scripts/build-hero3d.js ${uid})`);
  else { const sz = webpSize(fs.readFileSync(f)); if(!sz || sz[0] !== 1600 || sz[1] !== 1000) bad.push(`${uid}: 그림 크기 ${sz ? sz.join('×') : 'WebP 아님'} (1600×1000 이어야)`); }
  for(const l of ['ko', 'en', 'zh']) if(!(v.alt && typeof v.alt[l] === 'string' && v.alt[l].trim())) bad.push(`${uid}: alt.${l} 없음`);
  if(!new RegExp(`'${uid}'\\s*:`).test(scenes)) bad.push(`${uid}: scenes.js 에 장면 없음`);
  /* 앱에서 움직이는 장면이어야 한다(원장 "동작도 하는거야?" → "1") — 장면 본문에 k.onFrame 이 있는지 */
  else { const st = scenes.indexOf(`'${uid}'`), nx = scenes.slice(st + 1).search(/\n  '[A-Z]-\d+'\s*:/); const body = scenes.slice(st, nx < 0 ? undefined : st + 1 + nx);
    if(!/k\.onFrame\(/.test(body)) bad.push(`${uid}: 움직임(k.onFrame) 없음`);
    /* 자막 안내(원장 "안내도" → "1"): caps.P 가 움직임 한 바퀴(cyc(t, N))와 같고, 줄마다 ko·en·zh, 위치는 0 부터 커지는 순 */
    const cm = body.match(/caps:\{ P:(\d+), list:\[([\s\S]*?)\n  \]\}/);
    if(!cm) bad.push(`${uid}: 자막(caps) 없음`);
    else {
      const P = +cm[1], cy = body.match(/cyc\(t, (\d+)\)/);
      if(cy && +cy[1] !== P) bad.push(`${uid}: 자막 한 바퀴 ${P}초 ≠ 움직임 ${cy[1]}초`);
      let rows; try { rows = JSON.parse('[' + cm[2].replace(/\[(\d?\.?\d+),/g, '[$1,') + ']'); } catch(e){ rows = null; }
      if(!rows || !rows.length) bad.push(`${uid}: 자막 줄을 읽지 못함`);
      else {
        if(rows[0][0] !== 0) bad.push(`${uid}: 첫 자막이 0 에서 시작하지 않음`);
        rows.forEach((r, i) => { if(r.length !== 4 || r.slice(1).some(x => typeof x !== 'string' || !x.trim())) bad.push(`${uid}: 자막 ${i + 1}줄 3개 언어 아님`);
          if(i && r[0] <= rows[i - 1][0]) bad.push(`${uid}: 자막 ${i + 1}줄 위치 순서`);
          if(/\b(mod|gcd|max|min)\b|[≡∈∣]/.test(r.slice(1).join(' '))) bad.push(`${uid}: 자막 ${i + 1}줄 교육과정 밖 표기`); });
      }
    }
  }
}
for(const f of fs.readdirSync(path.join(ROOT, 'assets', 'hero3d'))){
  const uid = f.replace(/\.webp$/, '');
  if(!H[uid]) bad.push(`${f}: data/hero3d.js 에 등록 안 됨`);
}
if(bad.length){ console.log('✗ 실패\n  ' + bad.join('\n  ')); process.exit(1); }
console.log(`3D 대표 그림 ${Object.keys(H).length}개 — 파일·크기·3개 언어 alt·장면·움직임·자막(한 바퀴 일치) 모두 있음`);
