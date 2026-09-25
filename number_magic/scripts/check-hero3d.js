#!/usr/bin/env node
/* 수학 이야기 3D 대표 그림 검사(2026-09-26)
   data/hero3d.js 에 등록된 유닛마다: 유닛이 있고, assets/hero3d/<유닛>.webp 가 있고(1600×1000 WebP),
   alt 가 ko·en·zh 셋 다 있고, scripts/hero3d/scenes.js 에 장면이 있다(다시 구울 수 있어야 한다).
   그림 파일만 있고 등록이 없는 유닛도 실패 — 앱·인쇄에 안 나오는 그림이 된다. */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
global.window = {};
require(path.join(ROOT, 'data', 'hero3d.js'));
const H = window.NM_HERO3D || {};
const scenes = fs.readFileSync(path.join(ROOT, 'scripts', 'hero3d', 'scenes.js'), 'utf8');
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
}
for(const f of fs.readdirSync(path.join(ROOT, 'assets', 'hero3d'))){
  const uid = f.replace(/\.webp$/, '');
  if(!H[uid]) bad.push(`${f}: data/hero3d.js 에 등록 안 됨`);
}
if(bad.length){ console.log('✗ 실패\n  ' + bad.join('\n  ')); process.exit(1); }
console.log(`3D 대표 그림 ${Object.keys(H).length}개 — 파일·크기·3개 언어 alt·장면 모두 있음`);
