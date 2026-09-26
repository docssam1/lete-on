#!/usr/bin/env node
/* ============================================================
   수의 마법 쇼릴 v3 — 잇기 (capture.js 다음)
   원장 피드백(2026-09-26): 인트로 영상 → 맵 · "환영합니다" · 설명이 졸리지 않게(대사 + 0.6초) · 배경음 ON ·
   곱해서 10 만들기 · 진단 속도 비교.

   장면(PLAN)은 여러 토막(seg)을 한 내레이션 줄에 묶을 수 있다. 줄이 붙은 묶음의 길이 =
   시작 여유(at) + 내레이션 길이 + 숨(BREATH) + 전환(XF) — 마지막 토막만 늘거나 줄고, 찍은 길이를 넘으면 마지막 장면을 멈춘 채 늘린다.
   그래서 목소리 폴더를 바꿔도(--voice) 다시 찍지 않고 이것만 다시 돌리면 된다(약 4분).

     node scripts/showreel/compose.js --out=<capture.js 와 같은 폴더> [--voice=omnivoice|ko-KR-Chirp3-HD-Leda] [--dry] [--no-bed] [--breath=0.6]

   만드는 것(--out 안):
     numbers-of-magic-showreel-v3.mp4 / -v3-voiceonly.mp4        crf 20 원본
     numbers-of-magic-showreel-v3-send.mp4 / -v3-voiceonly-send.mp4   메신저로 보내기용(crf 23, 29MB 미만이 되게 자동 조정)
     numbers-of-magic-v3-preview-10s.mp4 · numbers-of-magic-v3-contact-sheet.png
   소리: AAC 192k 48kHz 스테레오, 두 번 재는 loudnorm → -16 LUFS / -1.5 dBTP.
   seg-compare.mp4(진단 속도 비교, 다른 작업이 만드는 화면)가 있으면 진단 장면에 넣고, 없으면 학습 속도 카드로 대신한다.
   ============================================================ */
'use strict';
const fs = require('fs'), path = require('path'), os = require('os');
const { execFileSync, spawnSync } = require('child_process');
const L = require('./lib');
const arg = k => { const a = process.argv.find(x => x.startsWith(`--${k}=`)); return a ? a.slice(k.length + 3) : null; };
const OUT = arg('out') ? path.resolve(arg('out')) : path.join(os.tmpdir(), 'nm-showreel');
const FF = L.FF;
const XF = 0.4;
const BREATH = +(arg('breath') || 0.6);
const NAR = JSON.parse(fs.readFileSync(path.join(__dirname, 'narration.json'), 'utf8'));
/* 목소리 폴더 한 곳: --voice. 기본 omnivoice(원장 "음성은 이제 omni보이스"), 없으면 narration.json 의 voice. 빠진 줄은 그 voice 로 */
const VOICE = arg('voice') || (fs.existsSync(path.join(__dirname, 'narration', 'omnivoice', 'n01.mp3')) ? 'omnivoice' : NAR.voice);
/* '신비로운 만화 음성' — 음높이는 그대로, 짧은 방 울림 + 살짝 맑게. --dry 면 원음 */
const VOICE_FX = process.argv.includes('--dry') ? '' : ',highpass=f=70,equalizer=f=5200:t=q:w=1.1:g=1.8,aecho=0.9:0.55:31|57|89:0.15|0.11|0.07';
const NOBED = process.argv.includes('--no-bed');
const INTRO = path.join(L.APP, 'assets/gemini_generated_video_c12e6123.mp4');
const HAS_COMPARE = fs.existsSync(path.join(OUT, 'seg-compare.mp4'));

/* 토막: seg(파일 seg-<이름>.mp4 또는 file), in/out(초), xf(이 토막으로 들어오는 전환 종류·길이).
   n 이 있는 토막 = 묶음의 시작(뒤따르는 토막 중 n 없는 것까지 한 묶음). cap = 자막(묶음 전체에 걸친다). */
const PLAN = [
  { seg:'introvid', file:INTRO, in:0.9, out:9.6, audio:true },
  { seg:'mapreveal', in:0.0, out:5.6, n:'n01', at:0.35, xf:['fade', 0.9], min:4.2,
    cap:{ ko:'수학 마법 나라에 온 걸 환영해요', en:'Welcome to the land of math magic', pos:'bl' } },
  { seg:'philosophy', in:0.0, n:'n02', at:0.5, xf:['fadewhite', 0.45],
    cap:{ ko:'독쌤의 철학 — 수를 정복해야 수학을 정복한다', en:"DOCSSAM's philosophy: master numbers, master math", pos:'br', from:0.72 } },
  { seg:'village', in:0.9, n:'n03', at:0.35, xf:['circleopen', 0.45], min:4.6,
    cap:{ ko:'마을을 걸으며 오늘의 마법을 찾아요', en:"Explore the village, find today's magic", pos:'bl' } },
  { seg:'story', in:0.4, n:'n04', at:0.35, xf:['smoothleft', 0.4], min:4.8,
    cap:{ ko:'유아부터 미적분까지, 한 권의 모험 이야기', en:'One adventure, from preschool to calculus', pos:'bl' } },
  { seg:'diagnose', in:0.0, out:4.4, n:'n05', at:0.35, xf:['slideup', 0.4],
    cap:{ ko:'연산 단계 진단 · 지금 속도 비교', en:'Diagnose the level, compare the pace', pos:'br' } },
  HAS_COMPARE ? { seg:'compare', in:0.0, xf:['fade', 0.35] } : { seg:'pace', in:3.7, out:9.6, xf:['fade', 0.35] },
  { seg:'road', in:6.5, out:9.4, n:'n06', at:0.25, xf:['smoothright', 0.4],
    cap:{ ko:'내 길이 한눈에 · 속도와 양은 딱 맞게', en:'Your road at a glance, the pace that fits', pos:'br' } },
  { seg:'pace', in:0.9, out:7.4, xf:['fade', 0.35], min:2.5 },
  { seg:'notify', in:0.5, n:'n07', at:0.3, xf:['slideleft', 0.4], min:4.8,
    cap:{ ko:'학부모님 휴대폰으로 매주 안내', en:"Weekly updates to parents' phones", pos:'bl' } },
  { seg:'creative3', in:0.1, n:'n08', at:0.3, xf:['circleopen', 0.45], min:7.2,
    cap:{ ko:'창의 연산 — 2×5=10 짝을 먼저!', en:'Creative arithmetic: pair 2×5=10 first', pos:'br' } },
  { seg:'hero-M-14', in:0.4, out:3.1, n:'n09', at:0.3, xf:['fadewhite', 0.4],
    cap:{ ko:'개념은 손에 잡히는 3D로', en:'Concepts you can almost touch', pos:'tl' } },
  { seg:'hero-M-19', in:0.3, out:2.9, xf:['smoothleft', 0.35] },
  { seg:'hero-M-80', in:0.3, out:3.4, xf:['smoothleft', 0.35], min:2.2 },
  { seg:'creative', in:2.2, out:5.2, n:'n10', at:0.3, xf:['slideup', 0.4],
    cap:{ ko:'같은 흐름 그대로, 종이 학습지로', en:'The same flow, on paper', pos:'br' } },
  { seg:'sheets', in:4.4, out:9.4, xf:['fade', 0.4], min:2.4 },
  { seg:'end', in:0.0, out:7.4, n:'n11', at:0.9, xf:['fadewhite', 0.6], min:6.2 },
];

function probe(f){
  const r = spawnSync(FF, ['-hide_banner', '-i', f], { encoding:'utf8' });
  const m = String(r.stderr).match(/Duration: (\d+):(\d+):([\d.]+)/); if(m) return +m[1] * 3600 + +m[2] * 60 + +m[3];
  throw new Error('길이를 못 읽음 ' + f);
}
const ff = args => execFileSync(FF, ['-y', '-hide_banner', '-loglevel', 'error', ...args], { stdio:['ignore', 'pipe', 'pipe'], maxBuffer:64 << 20 });
function measure(f, extra = ''){
  const p = spawnSync(FF, ['-hide_banner', '-i', f, '-af', `${extra}loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json`, '-f', 'null', '-'], { encoding:'utf8', maxBuffer:64 << 20 });
  const m = p.stderr.match(/\{[\s\S]*?\}/g); return JSON.parse(m[m.length - 1]);
}
function normalize(inp, out){
  const m = measure(inp);
  ff(['-i', inp, '-af', `loudnorm=I=-16:TP=-1.5:LRA=11:measured_I=${m.input_i}:measured_TP=${m.input_tp}:measured_LRA=${m.input_lra}:measured_thresh=${m.input_thresh}:offset=${m.target_offset}:linear=true,aresample=48000`,
    '-ac', '2', '-c:a', 'aac', '-b:a', '192k', out]);
  return measure(out).input_i;
}

(async () => {
  /* 1. 토막 · 묶음 · 길이 */
  const segs = PLAN.map(p => Object.assign({ f:p.file || path.join(OUT, `seg-${p.seg}.mp4`) }, p));
  const miss = segs.filter(x => !fs.existsSync(x.f)); if(miss.length) throw new Error('없는 장면: ' + miss.map(x => x.seg).join(', '));
  const voiceFile = n => { const a = path.join(__dirname, 'narration', VOICE, n + '.mp3'); if(fs.existsSync(a)) return a;
    console.log(`  (${VOICE} 에 ${n} 없음 → ${NAR.voice})`); return path.join(__dirname, 'narration', NAR.voice, n + '.mp3'); };
  segs.forEach(x => { x.full = probe(x.f); x.in = x.in || 0; x.out = Math.min(x.out || x.full, x.full); x.xfd = x.xf ? x.xf[1] : 0; });
  /* 묶음 */
  const groups = []; segs.forEach(x => { if(x.n || !groups.length) groups.push([x]); else groups[groups.length - 1].push(x); });
  groups.forEach((g, gi) => {
    const head = g[0]; if(!head.n) return;
    head.nf = voiceFile(head.n); head.nd = probe(head.nf);
    const nextXf = (groups[gi + 1] && groups[gi + 1][0].xfd) || 0;
    const need = head.at + head.nd + BREATH + nextXf;
    /* 묶음 길이(겹침 빼고) = Σd - Σ(묶음 안 전환) */
    const last = g[g.length - 1];
    const others = g.slice(0, -1).reduce((a, x) => a + (x.out - x.in), 0) - g.slice(1).reduce((a, x) => a + x.xfd, 0);
    let dl = Math.max(last.min || 1.2, need - others);
    last.out = last.in + dl;
    last.hold = Math.max(0, last.out - last.full);
    if(last.hold > 0.05) console.log(`  ⚠ ${last.seg}: 찍은 길이보다 ${last.hold.toFixed(2)}초 길다 — 마지막 장면을 멈춘 채 늘림`);
  });
  let t = 0;
  segs.forEach((x, i) => { x.d = x.out - x.in; if(i) t -= x.xfd; x.start = t; t += x.d; });
  const total = t;
  const lines = segs.filter(x => x.n).map(x => ({ n:x.n, f:x.nf, a:x.start + x.at, d:x.nd, seg:x.seg }));
  lines.forEach((l, i) => { const nx = lines[i + 1]; l.room = (nx ? nx.a : total) - (l.a + l.d); });
  const gEnd = x => { const g = groups.find(g => g[0] === x); const l = g[g.length - 1]; return l.start + l.d; };

  /* 2. 자막 — 튀어나오기(0.42초, 살짝 튕김) → 머묾 → 사라지기(0.3초) 프레임 */
  const capDir = path.join(OUT, 'captions-v3'); fs.rmSync(capDir, { recursive:true, force:true }); fs.mkdirSync(capDir, { recursive:true });
  const caps = [];
  { const { server, base } = await L.serve();
    const browser = await L.launch();
    const { ctx, page } = await L.newPage(browser, { w:1920, h:1080, dpr:1, state:null });
    let k = 0;
    for(const x of segs){
      if(!x.cap) continue; k++;
      const c = Object.assign({ n:String(k).padStart(2, '0') }, x.cap);
      await page.goto(`${base}/number_magic/scripts/showreel/caption.html?` + new URLSearchParams({ ko:c.ko, en:c.en, n:c.n, pos:c.pos }));
      await page.waitForFunction(() => window.__ready === true); await page.waitForTimeout(250);
      c.dir = path.join(capDir, c.n); fs.mkdirSync(c.dir);
      for(let i = 0; i < 13; i++){ await page.evaluate(p => window.pose(p), i / 12); await page.screenshot({ path:path.join(c.dir, `in${String(i).padStart(2, '0')}.png`), omitBackground:true }); }
      for(let i = 0; i < 10; i++){ await page.evaluate(p => window.pose(-p), (i + 1) / 10); await page.screenshot({ path:path.join(c.dir, `out${String(i).padStart(2, '0')}.png`), omitBackground:true }); }
      const end = gEnd(x);
      c.a = x.start + (c.from != null ? (c.from < 1 ? x.at + c.from * x.nd : c.from) : x.xfd + 0.1);
      c.b = end - 0.35;
      caps.push(c);
    }
    await ctx.close(); await browser.close(); server.close(); }

  /* 3. 영상 */
  const video = path.join(OUT, 'v3-video.mp4');
  { const args = [];
    segs.forEach(x => args.push('-i', x.f));
    caps.forEach(c => { args.push('-framerate', '30', '-i', path.join(c.dir, 'in%02d.png'), '-framerate', '30', '-i', path.join(c.dir, 'out%02d.png')); });
    const fl = [];
    segs.forEach((x, i) => fl.push(`[${i}:v]${x.hold > 0.05 ? `tpad=stop_mode=clone:stop_duration=${(x.hold + 0.2).toFixed(3)},` : ''}trim=start=${x.in}:end=${x.out},setpts=PTS-STARTPTS,scale=1920:1080:flags=lanczos,settb=AVTB,fps=30,format=yuv420p,setsar=1[v${i}]`));
    let cur = 'v0';
    for(let i = 1; i < segs.length; i++){ const [tr, d] = segs[i].xf || ['fade', 0.4];
      fl.push(`[${cur}][v${i}]xfade=transition=${tr}:duration=${d}:offset=${segs[i].start.toFixed(3)}[x${i}]`); cur = `x${i}`; }
    caps.forEach((c, k) => { const j = segs.length + k * 2, hold = Math.max(0.2, c.b - c.a - 0.43 - 0.33);
      fl.push(`[${j}:v]format=rgba,tpad=stop_mode=clone:stop_duration=${hold.toFixed(3)}[ci${k}]`);
      fl.push(`[${j + 1}:v]format=rgba[co${k}]`);
      fl.push(`[ci${k}][co${k}]concat=n=2:v=1:a=0,setpts=PTS+${c.a.toFixed(3)}/TB[c${k}]`);
      fl.push(`[${cur}][c${k}]overlay=0:0:eof_action=pass:enable='between(t,${c.a.toFixed(3)},${(c.b + 0.05).toFixed(3)})'[o${k}]`); cur = `o${k}`; });
    fl.push(`[${cur}]fade=t=in:st=0:d=0.4,fade=t=out:st=${(total - 0.8).toFixed(3)}:d=0.8:color=white,format=yuv420p[out]`);
    args.push('-filter_complex', fl.join(';'), '-map', '[out]', '-c:v', 'libx264', '-preset', 'slow', '-crf', '20', '-profile:v', 'high', '-pix_fmt', 'yuv420p', '-r', '30', '-t', total.toFixed(3), video);
    console.log(`영상 잇는 중… ${total.toFixed(2)}초`);
    ff(args); }

  /* 4. 내레이션 트랙 (+ 인트로 영상 자체 소리) */
  const introSeg = segs.find(x => x.audio);
  const voiceWav = path.join(OUT, 'v3-voice.wav');
  { const args = []; lines.forEach(l => args.push('-i', l.f));
    const fl = lines.map((l, i) => `[${i}:a]aresample=48000,aformat=channel_layouts=stereo,adelay=${Math.round(l.a * 1000)}|${Math.round(l.a * 1000)}[a${i}]`);
    fl.push(`${lines.map((_, i) => `[a${i}]`).join('')}amix=inputs=${lines.length}:normalize=0${VOICE_FX},apad=whole_dur=${total.toFixed(3)},atrim=0:${total.toFixed(3)}[v]`);
    ff([...args, '-filter_complex', fl.join(';'), '-map', '[v]', '-c:a', 'pcm_s16le', voiceWav]); }
  const introWav = path.join(OUT, 'v3-intro.wav');
  { const d = introSeg.out - introSeg.in;
    ff(['-ss', String(introSeg.in), '-t', String(d + 1.0), '-i', introSeg.f, '-af', `aresample=48000,aformat=channel_layouts=stereo,afade=t=in:d=0.3,afade=t=out:st=${(d - 0.3).toFixed(2)}:d=1.0,apad=whole_dur=${total.toFixed(3)},atrim=0:${total.toFixed(3)}`, '-c:a', 'pcm_s16le', introWav]); }
  const vI = +measure(voiceWav).input_i;
  const iI = +measure(introWav).input_i;
  const introGain = (vI - 3) - iI;   /* 인트로 소리는 목소리보다 3dB 아래 */
  const voiceOnly = path.join(OUT, 'v3-voiceonly.wav');
  ff(['-i', voiceWav, '-i', introWav, '-filter_complex', `[1:a]volume=${introGain.toFixed(2)}dB[i];[0:a][i]amix=inputs=2:normalize=0:duration=first[m]`, '-map', '[m]', '-c:a', 'pcm_s16le', voiceOnly]);

  /* 5. 배경 음악(수식) — 목소리보다 약 14dB 아래, 말할 때 더 내려간다 */
  const mixWav = path.join(OUT, 'v3-mix.wav');
  if(!NOBED){
    const bed = path.join(OUT, 'v3-bed.wav');
    const bedStart = introSeg.start + introSeg.d - 0.8;
    const starts = [introSeg.start + introSeg.d - 0.6, ...groups.slice(2).map(g => g[0].start)];
    execFileSync('python3', [path.join(__dirname, 'ambient-bed.py'), bed, total.toFixed(3), starts.map(v => v.toFixed(3)).join(','),
      lines.map(l => `${l.a.toFixed(2)}-${(l.a + l.d).toFixed(2)}`).join(','), groups.slice(1).map(g => g[0].start.toFixed(3)).join(','), 'v3', bedStart.toFixed(2)], { stdio:'inherit' });
    const bI = +measure(bed).input_i;
    const gain = (vI - 14) - bI;
    console.log(`  음량: 목소리 ${vI} · 인트로 ${iI}(→${introGain.toFixed(1)}dB) · 배경 ${bI} LUFS → 배경 ${gain.toFixed(1)} dB (목소리 −14)`);
    ff(['-i', voiceOnly, '-i', bed, '-filter_complex', `[1:a]volume=${gain.toFixed(2)}dB[b];[0:a][b]amix=inputs=2:normalize=0:duration=first[m]`, '-map', '[m]', '-c:a', 'pcm_s16le', mixWav]);
  }

  /* 6. 소리 맞추기 + 합치기 + 보내기용 */
  const outs = [];
  for(const [name, wav] of [['numbers-of-magic-showreel-v3-voiceonly', voiceOnly], ...(NOBED ? [] : [['numbers-of-magic-showreel-v3', mixWav]])]){
    const aac = path.join(OUT, name + '.m4a');
    const li = normalize(wav, aac);
    const o = path.join(OUT, name + '.mp4');
    ff(['-i', video, '-i', aac, '-map', '0:v', '-map', '1:a', '-c', 'copy', '-movflags', '+faststart', '-shortest', o]);
    /* 보내기용: crf 23 부터, 29MB 넘으면 올린다 */
    const send = path.join(OUT, name + '-send.mp4');
    for(const crf of [23, 25, 27, 29]){
      ff(['-i', video, '-i', aac, '-map', '0:v', '-map', '1:a', '-c:v', 'libx264', '-preset', 'slow', '-crf', String(crf), '-profile:v', 'high', '-pix_fmt', 'yuv420p', '-c:a', 'copy', '-movflags', '+faststart', '-shortest', send]);
      if(fs.statSync(send).size < 29 * 1048576) break;
    }
    fs.unlinkSync(aac);
    outs.push([o, li, send]);
  }
  const main = outs[outs.length - 1][0];

  /* 7. 10초 미리보기(소리 포함) */
  const pick = (s, o) => { const x = segs.find(y => y.seg === s); return x.start + Math.min(o, x.d - 1); };
  const picks = [pick('introvid', 5.5), pick('mapreveal', 1.2), pick('philosophy', 3.5), pick('village', 2.6), pick('diagnose', 1.2), pick('notify', 4.4), pick('creative3', 1.6), pick('creative3', 5.4), pick('hero-M-19', 0.6), pick('end', 2.0)];
  { const fl = [], ins = [];
    picks.forEach((p, i) => { fl.push(`[0:v]trim=start=${p.toFixed(2)}:duration=1,setpts=PTS-STARTPTS,scale=960:540:flags=lanczos[v${i}]`);
      fl.push(`[0:a]atrim=start=${p.toFixed(2)}:duration=1,asetpts=PTS-STARTPTS,afade=t=in:d=0.04,afade=t=out:st=0.94:d=0.06[a${i}]`); ins.push(`[v${i}][a${i}]`); });
    fl.push(`${ins.join('')}concat=n=${picks.length}:v=1:a=1[v][a]`);
    ff(['-i', main, '-filter_complex', fl.join(';'), '-map', '[v]', '-map', '[a]', '-c:v', 'libx264', '-crf', '23', '-preset', 'medium', '-pix_fmt', 'yuv420p', '-r', '30',
      '-c:a', 'aac', '-b:a', '128k', '-movflags', '+faststart', path.join(OUT, 'numbers-of-magic-v3-preview-10s.mp4')]); }

  /* 8. 밀착 인화지 12칸 */
  const frames = path.join(OUT, 'cs3'); fs.mkdirSync(frames, { recursive:true });
  Array.from({ length:12 }, (_, i) => 1.4 + i * (total - 2.8) / 11).forEach((tt, i) =>
    ff(['-ss', tt.toFixed(2), '-i', main, '-frames:v', '1', '-vf', 'scale=640:360', path.join(frames, `f${String(i).padStart(2, '0')}.png`)]));
  ff(['-framerate', '1', '-i', path.join(frames, 'f%02d.png'), '-vf', 'tile=4x3:padding=8:margin=8:color=white', '-frames:v', '1', path.join(OUT, 'numbers-of-magic-v3-contact-sheet.png')]);

  console.log('\n장면 시각 (내레이션)');
  segs.forEach(x => { const l = lines.find(y => y.seg === x.seg && x.n);
    console.log(`  ${x.seg.padEnd(11)} ${x.start.toFixed(2)}–${(x.start + x.d).toFixed(2)}  [${x.in.toFixed(1)}–${x.out.toFixed(1)}]${l ? `   ${l.n} ${l.a.toFixed(2)}–${(l.a + l.d).toFixed(2)} (다음 줄까지 ${l.room.toFixed(1)}초)` : ''}`); });
  outs.forEach(([o, li, send]) => console.log(`✓ ${o}  ${(fs.statSync(o).size / 1048576).toFixed(1)} MB  ${li} LUFS\n  ${send}  ${(fs.statSync(send).size / 1048576).toFixed(1)} MB`));
  console.log(`  목소리: ${VOICE}   총 ${total.toFixed(2)}초   진단 비교 화면: ${HAS_COMPARE ? 'seg-compare' : '없음(학습 속도 카드로 대신)'}`);
})().catch(e => { console.error(e.stderr ? String(e.stderr) : '', 'signal=' + e.signal, 'status=' + e.status, String(e.message || e).slice(0, 300)); process.exit(1); });
