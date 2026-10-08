#!/usr/bin/env node
/* 실사 그림 표 검사 — data/real-art.js(window.NM_REAL_ART)의 모든 파일이
   ① assets/images/real/ 에 있고 ② 512×512 ③ 투명 배경(PNG color type 6 = RGBA) ④ 600KB 이하인지 본다.
   표에 없는 PNG(고아 파일)는 경고만 한다(재작업 대기분을 미리 넣어 둘 수 있다).
   2026-10-08 — 실사-2차 3회분이 1254px·최대 2.6MB 로 와서, 줄이지 않고 넣는 실수를 막으려 만들었다. */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.join(__dirname, '..');
const DIR = path.join(ROOT, 'assets/images/real');
const MAX_KB = 600;

const w = {}; w.window = w; vm.createContext(w);
vm.runInContext(fs.readFileSync(path.join(ROOT, 'data/real-art.js'), 'utf8'), w, { filename: 'data/real-art.js' });
const map = w.NM_REAL_ART || {};

const bad = [], used = new Set();
for (const [tok, file] of Object.entries(map)) {
  used.add(file);
  const p = path.join(DIR, file);
  if (!/^[a-z0-9-]+\.png$/.test(file)) { bad.push(`${tok}: 파일 이름 형식(${file})`); continue; }
  if (!fs.existsSync(p)) { bad.push(`${tok}: 파일 없음(${file})`); continue; }
  const b = fs.readFileSync(p);
  if (b.length < 26 || b.readUInt32BE(0) !== 0x89504e47) { bad.push(`${tok}: PNG 아님(${file})`); continue; }
  const W = b.readUInt32BE(16), H = b.readUInt32BE(20), ct = b[25];
  if (W !== 512 || H !== 512) bad.push(`${tok}: ${W}×${H} — 512×512 이어야 함(${file})`);
  if (ct !== 6) bad.push(`${tok}: color type ${ct} — 투명 RGBA(6) 이어야 함(${file})`);
  if (b.length > MAX_KB * 1024) bad.push(`${tok}: ${Math.round(b.length / 1024)}KB — ${MAX_KB}KB 이하로(${file})`);
}
const orphans = fs.readdirSync(DIR).filter(f => f.endsWith('.png') && !used.has(f));

console.log(`실사 표 ${Object.keys(map).length}토큰 · 파일 ${used.size}개 검사`);
if (orphans.length) console.log(`[경고] 표에 없는 PNG ${orphans.length}개: ${orphans.join(', ')}`);
if (bad.length) { console.log(`\n✗ 실패 ${bad.length}건`); bad.forEach(x => console.log('  ' + x)); process.exit(1); }
console.log('통과 — 표의 모든 실사 그림이 있고, 512×512 투명 PNG 이며 용량 안이다.');
