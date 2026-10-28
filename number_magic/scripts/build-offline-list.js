#!/usr/bin/env node
/* 「다 받아 두기」 목록(offline-files.json)을 만든다(2026-10-28, 수의 마법 앱).
 * sw.js 가 이 목록을 전부 받아 두면 그 뒤로는 인터넷 없이도 공부할 수 있다.
 * 넣는 것: 앱이 실제로 부르는 화면·스크립트·데이터·글꼴·그림·음성.
 * 빼는 것: 광고(promo)·랜딩·영상·원본 소스(*-src)·문서(md)·검사 도구 — 앱 화면에는 안 나온다.
 *   node number_magic/scripts/build-offline-list.js          목록 다시 만들기
 *   node number_magic/scripts/build-offline-list.js --check  목록이 지금 파일과 맞는지만(어긋나면 exit 1) */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'offline-files.json');
const PAGES = ['access.html', 'index.html', 'install.html', 'ws.html', 'drill.html', 'manifest.webmanifest'];
const DIRS = ['app', 'engine', 'data', 'vendor', 'audio/omni',
  'assets/app-icons', 'assets/audio', 'assets/characters', 'assets/fonts', 'assets/hero3d',
  'assets/images', 'assets/magazine', 'assets/stages'];
const SINGLE = ['assets/favicon.png', 'assets/gfield-logo.svg', 'assets/gfield-logo.png', 'assets/map.jpg'];
/* number_magic 밖이지만 index.html 이 부르는 것(같은 사이트라 서비스 워커가 받아 준다) */
const OUTSIDE = ['../geometry/worksheet/render.js'];
const EXT = /\.(js|mjs|css|json|woff2?|ttf|otf|png|webp|jpe?g|svg|gif|mp3|m4a|ogg|wav)$/i;
const SKIP = [/(^|\/)[^/]*-src(\/|$)/, /(^|\/)\./, /\.md$/i, /(^|\/)(scripts|docs|labs|promo|landing)(\/|$)/,
  /voice-(recheck|release|video)-\d+\.json$/, /review-candidates\.json$/, /(^|\/)LICENSE$/];
const MAX_BYTES = 8 * 1024 * 1024;   // 한 파일이 이보다 크면 넣지 않는다(목록 검사가 알려 준다)

function walk(rel, out) {
  const abs = path.join(ROOT, rel);
  if (!fs.existsSync(abs)) return;
  const st = fs.statSync(abs);
  if (st.isDirectory()) { for (const name of fs.readdirSync(abs).sort()) walk(rel + '/' + name, out); return; }
  if (!EXT.test(rel) || SKIP.some((re) => re.test(rel))) return;
  if (st.size > MAX_BYTES) { console.warn('너무 커서 뺌:', rel, (st.size / 1048576).toFixed(1) + 'MB'); return; }
  out.push({ rel, size: st.size });
}

function build() {
  const items = [];
  for (const p of PAGES.concat(SINGLE)) walk(p, items);
  for (const d of DIRS) walk(d, items);
  for (const o of OUTSIDE) { const abs = path.join(ROOT, o); if (fs.existsSync(abs)) items.push({ rel: o, size: fs.statSync(abs).size }); }
  const seen = new Set(), files = [];
  let bytes = 0;
  for (const it of items) { if (seen.has(it.rel)) continue; seen.add(it.rel); files.push(it.rel); bytes += it.size; }
  return { note: '수의 마법 앱 「다 받아 두기」 목록 — scripts/build-offline-list.js 가 만든다. 손으로 고치지 말 것.', count: files.length, bytes, files };
}

const list = build();
const text = JSON.stringify(list, null, 0).replace(/","/g, '",\n"') + '\n';
if (process.argv.includes('--check')) {
  const now = fs.existsSync(OUT) ? fs.readFileSync(OUT, 'utf8') : '';
  if (now !== text) { console.error('offline-files.json 이 지금 파일과 다릅니다. node number_magic/scripts/build-offline-list.js 로 다시 만드세요.'); process.exit(1); }
  console.log('offline-files.json OK —', list.count, '개,', (list.bytes / 1048576).toFixed(1) + 'MB');
} else {
  fs.writeFileSync(OUT, text);
  console.log('offline-files.json —', list.count, '개,', (list.bytes / 1048576).toFixed(1) + 'MB');
}
