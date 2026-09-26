#!/usr/bin/env node
/* ============================================================
   수의 마법 쇼릴 — 잇기 (capture.js 다음)
   seg-*.mp4 를 0.5초 교차 페이드로 잇고, 자막(caption.html 을 찍은 투명 PNG)을 겹쳐
   numbers-of-magic-showreel.mp4(1920×1080·30fps·H.264) + 10초 미리보기 + 12칸 밀착 인화지(contact sheet)를 만든다.

     node scripts/showreel/compose.js --out=/tmp/reel      # capture.js 와 같은 --out
   ============================================================ */
'use strict';
const fs = require('fs'), path = require('path'), os = require('os');
const { execFileSync } = require('child_process');
const L = require('./lib');
const outArg = process.argv.find(a => a.startsWith('--out='));
const OUT = outArg ? path.resolve(outArg.slice(6)) : path.join(os.tmpdir(), 'nm-showreel');
const FF = L.FF;
const XF = 0.5;   /* 교차 페이드 */

const SEGS = ['title', 'village', 'story', 'road', 'hero-M-14', 'hero-M-19', 'hero-M-73', 'hero-M-80', 'hero-M-86', 'sheets', 'end'];
/* 자막: 어느 장면(첫 seg)부터 몇 초, 어디에 */
const CAPS = [
  { seg:'title',     n:'01', ko:'숫자가 마법이 되는 곳',            en:'Where numbers become magic',            pos:'tl', from:0.5, to:-0.4 },
  { seg:'village',   n:'02', ko:'마을을 걸으며 배워요',             en:'Learn by exploring the village',        pos:'bl', from:0.6, to:-0.5 },
  { seg:'story',     n:'03', ko:'유아부터 미적분까지, 한 권의 이야기', en:'One story, from preschool to calculus', pos:'bl', from:0.6, to:-0.5 },
  { seg:'road',      n:'04', ko:'지금 어디까지 왔는지, 한 길로',     en:'See the whole road at a glance',        pos:'bl', from:0.6, to:-0.5 },
  { seg:'hero-M-14', n:'05', ko:'개념은 손에 잡히는 3D로',           en:'Concepts you can almost touch',         pos:'tl', from:0.5, abs:6.2 },
  { seg:'sheets',    n:'06', ko:'종이 학습지도 같은 흐름으로',        en:'The same flow, on paper',               pos:'bl', from:0.6, to:-0.6 },
];

function probe(f){
  try { execFileSync(FF, ['-hide_banner', '-i', f], { stdio:['ignore', 'pipe', 'pipe'] }); } catch(e){
    const m = String(e.stderr).match(/Duration: (\d+):(\d+):([\d.]+)/); if(m) return +m[1] * 3600 + +m[2] * 60 + +m[3]; }
  throw new Error('길이를 못 읽음 ' + f);
}

(async () => {
  const segs = SEGS.map(s => ({ s, f:path.join(OUT, `seg-${s}.mp4`) }));
  const miss = segs.filter(x => !fs.existsSync(x.f)); if(miss.length) throw new Error('없는 장면: ' + miss.map(x => x.s).join(', '));
  let t = 0; segs.forEach((x, i) => { x.d = probe(x.f); x.start = t; t += x.d - (i < segs.length - 1 ? XF : 0); });
  const total = t;
  const at = Object.fromEntries(segs.map(x => [x.s, x]));

  /* 자막 PNG */
  const capDir = path.join(OUT, 'captions'); fs.mkdirSync(capDir, { recursive:true });
  const { server, base } = await L.serve();
  const browser = await L.launch();
  const { ctx, page } = await L.newPage(browser, { w:1920, h:1080, dpr:1, state:null });
  for(const c of CAPS){
    await page.goto(`${base}/number_magic/scripts/showreel/caption.html?` + new URLSearchParams({ ko:c.ko, en:c.en, n:c.n, pos:c.pos }));
    await page.waitForFunction(() => window.__ready === true); await page.waitForTimeout(400);
    c.png = path.join(capDir, `cap-${c.n}.png`);
    await page.screenshot({ path:c.png, omitBackground:true });
    const sg = at[c.seg]; c.a = sg.start + c.from; c.b = c.abs ? sg.start + c.abs : sg.start + sg.d + c.to;
  }
  await ctx.close(); await browser.close(); server.close();

  /* 필터 그래프 */
  const args = ['-y', '-hide_banner', '-loglevel', 'error'];
  segs.forEach(x => args.push('-i', x.f));
  CAPS.forEach(c => args.push('-loop', '1', '-framerate', '30', '-t', (c.b - c.a + 0.1).toFixed(3), '-i', c.png));
  const fl = [];
  segs.forEach((x, i) => fl.push(`[${i}:v]settb=AVTB,fps=30,format=yuv420p,setsar=1[v${i}]`));
  let cur = 'v0';
  for(let i = 1; i < segs.length; i++){
    const off = (segs[i].start).toFixed(3);
    fl.push(`[${cur}][v${i}]xfade=transition=fade:duration=${XF}:offset=${off}[x${i}]`); cur = `x${i}`;
  }
  CAPS.forEach((c, k) => {
    const j = segs.length + k, d = c.b - c.a;
    fl.push(`[${j}:v]format=rgba,fade=t=in:st=0:d=0.45:alpha=1,fade=t=out:st=${(d - 0.45).toFixed(3)}:d=0.45:alpha=1,setpts=PTS+${c.a.toFixed(3)}/TB[c${k}]`);
    fl.push(`[${cur}][c${k}]overlay=0:0:eof_action=pass:enable='between(t,${c.a.toFixed(3)},${c.b.toFixed(3)})'[o${k}]`); cur = `o${k}`;
  });
  fl.push(`[${cur}]fade=t=in:st=0:d=0.5,fade=t=out:st=${(total - 0.9).toFixed(3)}:d=0.9:color=white,format=yuv420p[out]`);
  const reel = path.join(OUT, 'numbers-of-magic-showreel.mp4');
  args.push('-filter_complex', fl.join(';'), '-map', '[out]', '-c:v', 'libx264', '-preset', 'slow', '-crf', process.env.SR_CRF || '20',
    '-profile:v', 'high', '-pix_fmt', 'yuv420p', '-r', '30', '-movflags', '+faststart', '-t', total.toFixed(3), reel);
  console.log(`잇는 중… 총 ${total.toFixed(2)}초`);
  execFileSync(FF, args, { stdio:'inherit' });

  /* 10초 미리보기 — 장면마다 한 토막씩(960×540) */
  const picks = [['title', 2.4], ['village', 7.6], ['story', 1.8], ['story', 5.0], ['road', 7.8], ['hero-M-14', 0.6], ['hero-M-73', 0.6], ['sheets', 0.3], ['sheets', 12.4], ['end', 3.0]]
    .map(([s, o]) => at[s].start + o);
  const sel = picks.map(p => `between(t,${p.toFixed(2)},${(p + 1).toFixed(2)})`).join('+');
  execFileSync(FF, ['-y', '-hide_banner', '-loglevel', 'error', '-i', reel, '-vf', `select='${sel}',setpts=N/30/TB,scale=960:540:flags=lanczos`, '-an', '-r', '30', '-t', '10',
    '-c:v', 'libx264', '-crf', '23', '-preset', 'medium', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', path.join(OUT, 'numbers-of-magic-preview-10s.mp4')], { stdio:'inherit' });

  /* 밀착 인화지 12칸 */
  const times = Array.from({ length:12 }, (_, i) => 1.2 + i * (total - 2.4) / 11);
  const frames = path.join(OUT, 'cs'); fs.mkdirSync(frames, { recursive:true });
  times.forEach((tt, i) => execFileSync(FF, ['-y', '-hide_banner', '-loglevel', 'error', '-ss', tt.toFixed(2), '-i', reel, '-frames:v', '1', '-vf', 'scale=640:360', path.join(frames, `f${String(i).padStart(2, '0')}.png`)]));
  execFileSync(FF, ['-y', '-hide_banner', '-loglevel', 'error', '-framerate', '1', '-i', path.join(frames, 'f%02d.png'), '-vf', 'tile=4x3:padding=8:margin=8:color=white', '-frames:v', '1', path.join(OUT, 'numbers-of-magic-contact-sheet.png')]);
  console.log('\n장면 시각');
  segs.forEach(x => console.log(`  ${x.s.padEnd(10)} ${x.start.toFixed(2)}–${(x.start + x.d).toFixed(2)}`));
  console.log(`\n✓ ${reel}  ${(fs.statSync(reel).size / 1048576).toFixed(1)} MB  ${total.toFixed(2)}s`);
})().catch(e => { console.error(e); process.exit(1); });
