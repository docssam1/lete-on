#!/usr/bin/env node
/* ============================================================
   수의 마법 쇼릴 v2 — 잇기 (capture.js 다음)
   seg-*.mp4 를 잘라(in/out) 0.5초 교차 페이드로 잇고, 자막(caption.html → 투명 PNG)을 겹치고,
   내레이션(narration/<목소리>/nNN.mp3)을 장면마다 놓고, 수식으로 만든 배경 소리(ambient-bed.py)를 아주 낮게 깐다.

     node scripts/showreel/compose.js --out=/tmp/reel                       # capture.js 와 같은 --out
     node scripts/showreel/compose.js --out=/tmp/reel --voice=ko-KR-Chirp3-HD-Aoede
       (목소리 폴더는 narration.json 의 voice 가 기본. 그 폴더에 없는 줄은 기본 목소리로 채우고 알린다)

   만드는 것(--out 안):
     numbers-of-magic-showreel-v2.mp4            영상 + 내레이션 + 배경 소리
     numbers-of-magic-showreel-v2-voiceonly.mp4  영상 + 내레이션만
     numbers-of-magic-preview-10s.mp4            10초 미리보기(v2, 소리 포함)
     numbers-of-magic-contact-sheet.png          12칸 밀착 인화지
   소리: AAC 192k 48kHz 스테레오, 두 번 재는 loudnorm 으로 -16 LUFS / -1.5 dBTP.
   ============================================================ */
'use strict';
const fs = require('fs'), path = require('path'), os = require('os');
const { execFileSync } = require('child_process');
const L = require('./lib');
const arg = k => { const a = process.argv.find(x => x.startsWith(`--${k}=`)); return a ? a.slice(k.length + 3) : null; };
const OUT = arg('out') ? path.resolve(arg('out')) : path.join(os.tmpdir(), 'nm-showreel');
const FF = L.FF;
const XF = 0.5;
const NAR = JSON.parse(fs.readFileSync(path.join(__dirname, 'narration.json'), 'utf8'));
const VOICE = arg('voice') || NAR.voice;
const NOBED = process.argv.includes('--no-bed');

/* 장면 순서 · 자르기 · 내레이션 · 자막. at = 장면 시작에서 내레이션이 시작하는 초 */
const PLAN = [
  { seg:'title',      out:6.6,  n:'n01', at:0.5, cap:{ ko:'숫자가 마법이 되는 곳',              en:'Where numbers become magic',               pos:'tl' } },
  { seg:'philosophy', out:13.6, n:'n02', at:0.6, cap:{ ko:'독쌤의 철학 — 수는 마법이다',        en:"DOCSSAM's philosophy: numbers are magic",  pos:'br', to:-0.6 } },
  { seg:'village',    out:9.6,  n:'n03', at:0.6, cap:{ ko:'마을을 걸으며 오늘의 마법을 찾아요', en:"Explore the village, find today's magic",   pos:'bl' } },
  { seg:'story',      out:9.6,  n:'n04', at:0.7, cap:{ ko:'유아부터 미적분까지, 한 권의 이야기', en:'One story, from preschool to calculus',    pos:'bl' } },
  { seg:'road',       out:10.0, n:'n05', at:0.6, cap:{ ko:'지금 어디까지 왔는지, 한 길로',       en:'See the whole road at a glance',           pos:'bl' } },
  { seg:'pace',       out:8.4,  n:'n06', at:0.3, cap:{ ko:'아이 빠르기에 맞춰 속도와 양을 조절', en:"Set the pace and amount to fit your child", pos:'bl' } },
  { seg:'notify',     out:8.0,  n:'n07', at:0.5, cap:{ ko:'학부모님 휴대폰으로 매주 안내',       en:"Weekly updates to parents' phones",        pos:'bl' } },
  { seg:'hero-M-14',  out:4.1,  n:'n08', at:0.5, span_n:true, cap:{ ko:'개념은 손에 잡히는 3D로',             en:'Concepts you can almost touch',            pos:'tl', span:3 } },
  { seg:'hero-M-19',  out:4.1 },
  { seg:'hero-M-80',  out:4.1 },
  { seg:'creative',   out:11.2, n:'n09', at:0.6, cap:{ ko:'창의 연산 — 어려운 수를 쉬운 수로 펼쳐요', en:'Creative arithmetic: unfold hard numbers into easy ones', pos:'br' } },
  { seg:'sheets',     out:9.4,  n:'n10', at:0.6, cap:{ ko:'종이 학습지도 같은 흐름으로',         en:'The same flow, on paper',                  pos:'bl' } },
  { seg:'end',        out:9.6,  n:'n11', at:0.9 },
];

function probe(f){
  try { execFileSync(FF, ['-hide_banner', '-i', f], { stdio:['ignore', 'pipe', 'pipe'] }); } catch(e){
    const m = String(e.stderr).match(/Duration: (\d+):(\d+):([\d.]+)/); if(m) return +m[1] * 3600 + +m[2] * 60 + +m[3]; }
  throw new Error('길이를 못 읽음 ' + f);
}
const ff = (args, quiet = true) => execFileSync(FF, ['-y', '-hide_banner', '-loglevel', quiet ? 'error' : 'info', ...args], { stdio:['ignore', 'pipe', 'pipe'], maxBuffer:64 << 20 });
function measure(f){
  const p = require('child_process').spawnSync(FF, ['-hide_banner', '-i', f, '-af', 'loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json', '-f', 'null', '-'], { encoding:'utf8', maxBuffer:64 << 20 });
  const m = p.stderr.match(/\{[\s\S]*?\}/g); return JSON.parse(m[m.length - 1]);
}
function normalize(inp, out){   /* 두 번 재는 loudnorm → AAC 192k */
  const m = measure(inp);
  ff(['-i', inp, '-af', `loudnorm=I=-16:TP=-1.5:LRA=11:measured_I=${m.input_i}:measured_TP=${m.input_tp}:measured_LRA=${m.input_lra}:measured_thresh=${m.input_thresh}:offset=${m.target_offset}:linear=true,aresample=48000`,
    '-ac', '2', '-c:a', 'aac', '-b:a', '192k', out]);
  const r = measure(out); return r.input_i;
}

(async () => {
  /* 1. 장면 */
  const segs = PLAN.map(p => Object.assign({ f:path.join(OUT, `seg-${p.seg}.mp4`) }, p));
  const miss = segs.filter(x => !fs.existsSync(x.f)); if(miss.length) throw new Error('없는 장면: ' + miss.map(x => x.seg).join(', '));
  /* 2. 내레이션 길이에 맞춰 장면 길이를 정한다 — 목소리 폴더를 바꿔도 다시 찍지 않고 이것만 다시 돌리면 된다.
        장면 길이 ≥ (내레이션 시작 + 길이 + 숨 BREATH + 교차 XF). 찍은 길이보다 길어야 하면 마지막 장면을 멈춘 채 늘리고 알린다. */
  const BREATH = +(arg('breath') || 0.9);
  const voiceDir = n => { const a = path.join(__dirname, 'narration', VOICE, n + '.mp3'); if(fs.existsSync(a)) return a;
    const b = path.join(__dirname, 'narration', NAR.voice, n + '.mp3'); console.log(`  (${VOICE} 에 ${n} 없음 → ${NAR.voice})`); return b; };
  let t = 0;
  segs.forEach((x, i) => {
    const full = probe(x.f); x.in = x.in || 0;
    if(x.n){ x.nf = voiceDir(x.n); x.nd = probe(x.nf); }
    const need = x.n && !x.span_n ? x.in + x.at + x.nd + BREATH + XF : 0;
    x.out = Math.max(x.out || full, need);
    x.hold = Math.max(0, x.out - full);
    if(x.hold > 0.05) console.log(`  ⚠ ${x.seg}: 내레이션이 길어 마지막 장면을 ${x.hold.toFixed(2)}초 멈춰 늘림(찍은 길이 ${full.toFixed(2)}초)`);
    x.d = x.out - x.in; x.start = t; t += x.d - (i < segs.length - 1 ? XF : 0); });
  const total = t;
  const lines = segs.filter(x => x.n).map(x => ({ n:x.n, f:x.nf, a:x.start + x.at, d:x.nd, seg:x.seg }));
  lines.forEach((l, i) => { const nx = lines[i + 1]; l.room = (nx ? nx.a : total) - (l.a + l.d);
    if(l.room < 0.8) console.log(`  ⚠ ${l.n} 뒤 다음 내레이션까지 ${l.room.toFixed(2)}초`); });

  /* 3. 자막 PNG */
  const capDir = path.join(OUT, 'captions-v2'); fs.mkdirSync(capDir, { recursive:true });
  const caps = [];
  { const { server, base } = await L.serve();
    const browser = await L.launch();
    const { ctx, page } = await L.newPage(browser, { w:1920, h:1080, dpr:1, state:null });
    let k = 0;
    for(const x of segs){
      if(!x.cap) continue; k++;
      const c = Object.assign({ n:String(k).padStart(2, '0') }, x.cap);
      await page.goto(`${base}/number_magic/scripts/showreel/caption.html?` + new URLSearchParams({ ko:c.ko, en:c.en, n:c.n, pos:c.pos }));
      await page.waitForFunction(() => window.__ready === true); await page.waitForTimeout(300);
      c.png = path.join(capDir, `cap-${c.n}.png`);
      await page.screenshot({ path:c.png, omitBackground:true });
      const i = segs.indexOf(x), last = segs[i + (c.span || 1) - 1];
      c.a = x.start + 0.55; c.b = last.start + last.d + (c.to != null ? c.to : -0.5);
      caps.push(c);
    }
    await ctx.close(); await browser.close(); server.close(); }

  /* 4. 영상(무음) */
  const video = path.join(OUT, 'v2-video.mp4');
  { const args = [];
    segs.forEach(x => args.push('-i', x.f));
    caps.forEach(c => args.push('-loop', '1', '-framerate', '30', '-t', (c.b - c.a + 0.1).toFixed(3), '-i', c.png));
    const fl = [];
    segs.forEach((x, i) => fl.push(`[${i}:v]${x.hold > 0.05 ? `tpad=stop_mode=clone:stop_duration=${(x.hold + 0.1).toFixed(3)},` : ''}trim=start=${x.in}:end=${x.out},setpts=PTS-STARTPTS,settb=AVTB,fps=30,format=yuv420p,setsar=1[v${i}]`));
    let cur = 'v0';
    for(let i = 1; i < segs.length; i++){ fl.push(`[${cur}][v${i}]xfade=transition=fade:duration=${XF}:offset=${segs[i].start.toFixed(3)}[x${i}]`); cur = `x${i}`; }
    caps.forEach((c, k) => { const j = segs.length + k, d = c.b - c.a;
      fl.push(`[${j}:v]format=rgba,fade=t=in:st=0:d=0.45:alpha=1,fade=t=out:st=${(d - 0.45).toFixed(3)}:d=0.45:alpha=1,setpts=PTS+${c.a.toFixed(3)}/TB[c${k}]`);
      fl.push(`[${cur}][c${k}]overlay=0:0:eof_action=pass:enable='between(t,${c.a.toFixed(3)},${c.b.toFixed(3)})'[o${k}]`); cur = `o${k}`; });
    fl.push(`[${cur}]fade=t=in:st=0:d=0.5,fade=t=out:st=${(total - 0.9).toFixed(3)}:d=0.9:color=white,format=yuv420p[out]`);
    args.push('-filter_complex', fl.join(';'), '-map', '[out]', '-c:v', 'libx264', '-preset', 'slow', '-crf', process.env.SR_CRF || '20',
      '-profile:v', 'high', '-pix_fmt', 'yuv420p', '-r', '30', '-t', total.toFixed(3), video);
    console.log(`영상 잇는 중… ${total.toFixed(2)}초`);
    ff(args); }

  /* 5. 소리 — 내레이션 트랙 */
  const voiceWav = path.join(OUT, 'v2-voice.wav');
  { const args = [];
    lines.forEach(l => args.push('-i', l.f));
    const fl = lines.map((l, i) => `[${i}:a]aresample=48000,aformat=channel_layouts=stereo,adelay=${Math.round(l.a * 1000)}|${Math.round(l.a * 1000)}[a${i}]`);
    fl.push(`${lines.map((_, i) => `[a${i}]`).join('')}amix=inputs=${lines.length}:normalize=0,apad=whole_dur=${total.toFixed(3)},atrim=0:${total.toFixed(3)}[v]`);
    ff([...args, '-filter_complex', fl.join(';'), '-map', '[v]', '-c:a', 'pcm_s16le', voiceWav]); }

  /* 6. 배경 소리(수식) — 목소리보다 약 20dB 아래 */
  const mixWav = path.join(OUT, 'v2-mix.wav');
  if(!NOBED){
    const bed = path.join(OUT, 'v2-bed.wav');
    execFileSync('python3', [path.join(__dirname, 'ambient-bed.py'), bed, total.toFixed(3), segs.map(x => x.start.toFixed(3)).join(','),
      lines.map(l => `${l.a.toFixed(2)}-${(l.a + l.d).toFixed(2)}`).join(',')], { stdio:'inherit' });
    const vI = +measure(voiceWav).input_i, bI = +measure(bed).input_i;
    const gain = (vI - 20) - bI;
    console.log(`  음량: 목소리 ${vI} LUFS · 배경 ${bI} LUFS → 배경 ${gain.toFixed(1)} dB (목소리 −20)`);
    ff(['-i', voiceWav, '-i', bed, '-filter_complex', `[1:a]volume=${gain.toFixed(2)}dB[b];[0:a][b]amix=inputs=2:normalize=0:duration=first[m]`, '-map', '[m]', '-c:a', 'pcm_s16le', mixWav]);
  }

  /* 7. 소리 맞추기 + 합치기 */
  const outs = [];
  for(const [name, wav] of [['numbers-of-magic-showreel-v2-voiceonly.mp4', voiceWav], ...(NOBED ? [] : [['numbers-of-magic-showreel-v2.mp4', mixWav]])]){
    const aac = path.join(OUT, name.replace('.mp4', '.m4a'));
    const li = normalize(wav, aac);
    const o = path.join(OUT, name);
    ff(['-i', video, '-i', aac, '-map', '0:v', '-map', '1:a', '-c', 'copy', '-movflags', '+faststart', '-shortest', o]);
    fs.unlinkSync(aac);
    outs.push([o, li]);
  }
  const main = outs[outs.length - 1][0];

  /* 8. 10초 미리보기 — 장면마다 한 토막(소리 포함) */
  const at = Object.fromEntries(segs.map(x => [x.seg, x]));
  const picks = [['title', 3.0], ['philosophy', 8.4], ['village', 5.4], ['story', 4.0], ['pace', 5.6], ['notify', 5.4], ['hero-M-14', 1.0], ['creative', 3.0], ['sheets', 6.8], ['end', 2.2]]
    .map(([s, o]) => at[s].start + o);
  { const fl = [], ins = [];
    picks.forEach((p, i) => { fl.push(`[0:v]trim=start=${p.toFixed(2)}:duration=1,setpts=PTS-STARTPTS,scale=960:540:flags=lanczos[v${i}]`);
      fl.push(`[0:a]atrim=start=${p.toFixed(2)}:duration=1,asetpts=PTS-STARTPTS,afade=t=in:d=0.04,afade=t=out:st=0.94:d=0.06[a${i}]`); ins.push(`[v${i}][a${i}]`); });
    fl.push(`${ins.join('')}concat=n=${picks.length}:v=1:a=1[v][a]`);
    ff(['-i', main, '-filter_complex', fl.join(';'), '-map', '[v]', '-map', '[a]', '-c:v', 'libx264', '-crf', '23', '-preset', 'medium', '-pix_fmt', 'yuv420p', '-r', '30',
      '-c:a', 'aac', '-b:a', '128k', '-movflags', '+faststart', path.join(OUT, 'numbers-of-magic-preview-10s.mp4')]); }

  /* 9. 밀착 인화지 12칸 */
  const frames = path.join(OUT, 'cs'); fs.mkdirSync(frames, { recursive:true });
  Array.from({ length:12 }, (_, i) => 1.4 + i * (total - 2.8) / 11).forEach((tt, i) =>
    ff(['-ss', tt.toFixed(2), '-i', main, '-frames:v', '1', '-vf', 'scale=640:360', path.join(frames, `f${String(i).padStart(2, '0')}.png`)]));
  ff(['-framerate', '1', '-i', path.join(frames, 'f%02d.png'), '-vf', 'tile=4x3:padding=8:margin=8:color=white', '-frames:v', '1', path.join(OUT, 'numbers-of-magic-contact-sheet.png')]);

  console.log('\n장면 시각 (내레이션)');
  segs.forEach(x => { const l = lines.find(y => y.seg === x.seg);
    console.log(`  ${x.seg.padEnd(11)} ${x.start.toFixed(2)}–${(x.start + x.d).toFixed(2)}${l ? `   ${l.n} ${l.a.toFixed(2)}–${(l.a + l.d).toFixed(2)} (여유 ${l.room.toFixed(1)}초)` : ''}`); });
  outs.forEach(([o, li]) => console.log(`✓ ${o}  ${(fs.statSync(o).size / 1048576).toFixed(1)} MB  ${li} LUFS`));
  console.log(`  목소리: ${VOICE}   총 ${total.toFixed(2)}초`);
})().catch(e => { console.error(e.stderr ? String(e.stderr) : e); process.exit(1); });
