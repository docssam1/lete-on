#!/usr/bin/env node
/* ============================================================
   수의 마법 쇼릴 v4 — 잇기 (capture.js 다음). 같은 촬영분으로 세 컷을 만든다.
     node scripts/showreel/compose.js --out=<capture.js 와 같은 폴더> --cut=full   # 3막 전체(≈2:00~2:20)
     node scripts/showreel/compose.js --out=… --cut=60                              # 60초(카톡·블로그) — 훅 → n02 → n04 → n08 → n10 → n12
     node scripts/showreel/compose.js --out=… --cut=vert                            # 15~20초 세로(1080×1920, 소리 없이도 읽히게) — 촬영분은 <out>/vert/
     [--voice=omnivoice-rec|omnivoice|ko-KR-Chirp3-HD-Leda] [--dry] [--no-bed] [--breath=0.7]

   장면(PLAN)은 토막(seg)들의 묶음이다. n 이 붙은 토막이 묶음의 머리이고, 묶음 길이 = at + 내레이션 + 숨(breath) + 다음 전환.
   마지막 토막만 늘거나 줄고(stretch 면 클립 전체를 비례로), 찍은 길이를 넘으면 마지막 장면을 멈춘 채 늘린다.
   그래서 목소리 폴더를 바꿔도(--voice) 다시 찍지 않고 이것만 다시 돌리면 된다.
   sent:k = 그 줄을 k번째 문장 끝(무음 틈)에서 자른다 — 낱말 중간은 절대 자르지 않는다.
   자막 문구는 narration.json 의 줄마다 있는 cap{ko,en}. 훅(hook)·각주(foot)는 토막에 직접 적는다.
   목소리: --voice > omnivoice-rec(원장 녹음 복제) > omnivoice > narration.json 의 voice. 어디에도 없는 줄은 4.5초 무음으로 자리만 잡고 경고한다.

   만드는 것(--out 안): numbers-of-magic-showreel-v4[-60s|-15s-vertical][-voiceonly].mp4 + 각 -send.mp4(crf 23~, 29MB 미만) ·
     numbers-of-magic-v4[-60s|-15s-vertical]-contact-sheet.png · (full 만) numbers-of-magic-v4-preview-10s.mp4
   소리: AAC 192k 48kHz 스테레오, 두 번 재는 loudnorm → -16 LUFS / -1.5 dBTP.
   ============================================================ */
'use strict';
const fs = require('fs'), path = require('path'), os = require('os');
const { execFileSync, spawnSync } = require('child_process');
const L = require('./lib');
const arg = k => { const a = process.argv.find(x => x.startsWith(`--${k}=`)); return a ? a.slice(k.length + 3) : null; };
const OUT = arg('out') ? path.resolve(arg('out')) : path.join(os.tmpdir(), 'nm-showreel');
const CUT = arg('cut') || 'full';
const VERT = CUT === 'vert';
const SRC = VERT ? path.join(OUT, 'vert') : OUT;
const W = VERT ? 1080 : 1920, H = VERT ? 1920 : 1080;
const SUFFIX = CUT === 'full' ? '' : CUT === '60' ? '-60s' : '-15s-vertical';
const FF = L.FF;
const XF = 0.4;
const BREATH = +(arg('breath') || 0.7);
const NAR = JSON.parse(fs.readFileSync(path.join(__dirname, 'narration.json'), 'utf8'));
const VOICE = arg('voice') || ['omnivoice-rec', 'omnivoice'].find(v => fs.existsSync(path.join(__dirname, 'narration', v, 'n01.mp3'))) || NAR.voice;
const VOICE_FALLBACK = ['omnivoice-rec', 'omnivoice', NAR.voice];
/* '신비로운 만화 음성' — 음높이는 그대로, 짧은 방 울림 + 살짝 맑게. --dry 면 원음 */
const VOICE_FX = process.argv.includes('--dry') ? '' : ',highpass=f=70,equalizer=f=5200:t=q:w=1.1:g=1.8,aecho=0.9:0.55:31|57|89:0.15|0.11|0.07';
const NOBED = process.argv.includes('--no-bed');
const INTRO = path.join(L.APP, 'assets/gemini_generated_video_c12e6123.mp4');
const HOOK = { ko:'우리 아이,\n**지금 속도**로 어디까지 갈 수 있을까요?', en:"How far can your child go at today's pace?" };
const FOOT = { ko:'참고용 비교 · 결과를 약속하지 않습니다 · 연산 트랙 기준', en:'For reference only · no outcomes promised · arithmetic track' };

/* 토막: seg(파일 seg-<이름>.mp4 또는 file), in/out(초), xf(이 토막으로 들어오는 전환·길이), n(내레이션 줄 = 묶음 머리), at(시작 여유),
   min(최소 길이), breath(숨), stretch(비례로 늘림), sent(k번째 문장까지), pos(자막 자리), from(자막 시작: <1 이면 내레이션 비율), cap(줄 없는 자막), hook, foot */
const PLANS = {
  full:[
    { seg:'introvid', file:INTRO, in:0.9, out:9.6, audio:true },
    { seg:'mapreveal', in:0.0, n:'n01', at:0.35, xf:['fade', 0.9], min:5.0, pos:'bl' },
    { seg:'philosophy', in:0.0, n:'n02', at:0.5, xf:['fadewhite', 0.45], stretch:true, pos:'br', from:0.05 },
    { seg:'pillars', in:0.0, n:'n03', at:0.5, xf:['fadewhite', 0.5], stretch:true, pos:'bl', from:0.42 },
    { seg:'diagnose', in:0.0, out:3.6, n:'n04', at:0.35, xf:['slideup', 0.4], pos:'br' },
    { seg:'compare', in:0.0, xf:['fade', 0.35], min:9.5, foot:true },
    { seg:'road', in:5.5, out:9.4, n:'n05', at:0.3, xf:['smoothright', 0.4], pos:'br' },
    { seg:'pace', in:0.6, xf:['fade', 0.35], min:4.0 },
    { seg:'village', in:0.9, n:'n06', at:0.35, xf:['circleopen', 0.45], min:4.6, pos:'bl' },
    { seg:'story', in:0.4, n:'n07', at:0.35, xf:['smoothleft', 0.4], min:4.8, pos:'bl' },
    { seg:'creative3', in:0.1, n:'n08', at:0.3, xf:['circleopen', 0.45], min:7.2, pos:'br' },
    { seg:'hero-M-19', in:0.3, out:3.4, n:'n09', at:0.3, xf:['fadewhite', 0.4], breath:0.0, pos:'tl' },
    { seg:'hist', in:0.2, out:3.6, xf:['smoothleft', 0.35] },
    { seg:'arena', in:0.2, xf:['smoothleft', 0.35], min:1.8 },
    { seg:'examroad', in:0.0, out:4.2, n:'n10', at:0.15, xf:['smoothleft', 0.3], pos:'br' },
    { seg:'creative', in:2.2, out:5.2, xf:['fadewhite', 0.35] },
    { seg:'sheets', in:4.4, out:6.8, xf:['fade', 0.35] },
    { seg:'exammore', in:0.0, xf:['slideup', 0.4], min:4.5 },
    { seg:'notify', in:0.5, n:'n11', at:0.3, xf:['slideleft', 0.4], min:4.8, pos:'bl' },
    { seg:'end', in:0.0, n:'n12', at:0.9, xf:['fadewhite', 0.6], stretch:true, min:8.0 },
  ],
  60:[
    { seg:'compare', in:7.4, out:10.7, hook:HOOK, foot:true },
    { seg:'philosophy', in:0.0, n:'n02', at:0.4, sent:2, xf:['fadewhite', 0.45], stretch:true, pos:'br', from:0.05 },
    { seg:'diagnose', in:0.0, out:3.6, n:'n04', at:0.35, sent:2, xf:['slideup', 0.4], pos:'br' },
    { seg:'compare', in:0.0, xf:['fade', 0.35], min:9.0, foot:true },
    { seg:'creative3', in:0.1, n:'n08', at:0.3, xf:['circleopen', 0.45], min:7.2, pos:'br' },
    { seg:'examroad', in:0.0, out:4.2, n:'n10', at:0.15, xf:['smoothleft', 0.3], pos:'br' },
    { seg:'creative', in:2.2, out:5.2, xf:['fadewhite', 0.35] },
    { seg:'sheets', in:4.4, out:6.8, xf:['fade', 0.35] },
    { seg:'exammore', in:0.0, xf:['slideup', 0.4], min:4.5 },
    { seg:'end', in:0.0, n:'n12', at:0.9, xf:['fadewhite', 0.6], stretch:true, min:8.0 },
  ],
  vert:[
    { seg:'compare', in:0.0, out:3.4, hook:HOOK, foot:true },
    { seg:'compare', in:6.9, out:10.6, xf:['fade', 0.35], foot:true, pos:'bl', cap:{ ko:'지금 속도로 어디까지 — 진단으로 확인해요', en:'See where this pace leads' } },
    { seg:'mathbox', in:0.0, out:5.0, xf:['fadewhite', 0.45], pos:'bl', cap:{ ko:'1275 = 999 + 276 — 수를 펼치면 쉬워져요', en:'Unfold the number, and it gets easy' } },
    { seg:'vend', in:0.0, out:5.0, xf:['fadewhite', 0.6] },
  ],
};
const PLAN = PLANS[CUT]; if(!PLAN) throw new Error('--cut=full|60|vert');

function probe(f){
  const r = spawnSync(FF, ['-hide_banner', '-i', f], { encoding:'utf8' });
  const m = String(r.stderr).match(/Duration: (\d+):(\d+):([\d.]+)/); if(m) return +m[1] * 3600 + +m[2] * 60 + +m[3];
  throw new Error('길이를 못 읽음 ' + f);
}
const ff = args => execFileSync(FF, ['-y', '-hide_banner', '-loglevel', 'error', ...args], { stdio:['ignore', 'pipe', 'pipe'], maxBuffer:64 << 20 });
function measure(f){
  const p = spawnSync(FF, ['-hide_banner', '-i', f, '-af', 'loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json', '-f', 'null', '-'], { encoding:'utf8', maxBuffer:64 << 20 });
  const m = p.stderr.match(/\{[\s\S]*?\}/g); return JSON.parse(m[m.length - 1]);
}
function normalize(inp, out, I = -16){
  const m = measure(inp);
  ff(['-i', inp, '-af', `loudnorm=I=${I}:TP=-1.5:LRA=11:measured_I=${m.input_i}:measured_TP=${m.input_tp}:measured_LRA=${m.input_lra}:measured_thresh=${m.input_thresh}:offset=${m.target_offset}:linear=true,aresample=48000`,
    '-ac', '2', '-c:a', 'aac', '-b:a', '192k', out]);
  return measure(out).input_i;
}
/* k번째 문장의 끝(초) — 무음 틈(≥0.18초) 중 원고상 문장 비율에 가장 가까운 것. 틈의 시작 + 0.1 에서 자른다 */
function sentenceCut(file, text, k, dur){
  const nS = (text.match(/[.!?]/g) || []).length || 1;
  const p = spawnSync(FF, ['-hide_banner', '-i', file, '-af', 'silencedetect=n=-35dB:d=0.18', '-f', 'null', '-'], { encoding:'utf8' });
  const gaps = []; let st = null;
  for(const m of String(p.stderr).matchAll(/silence_(start|end): ([\d.]+)/g)){ if(m[1] === 'start') st = +m[2]; else if(st != null){ if(st > 0.3 && +m[2] < dur - 0.2) gaps.push({ s:st, e:+m[2] }); st = null; } }
  if(!gaps.length) return null;
  const target = dur * k / nS;
  const g = gaps.reduce((a, b) => Math.abs(b.s - target) < Math.abs(a.s - target) ? b : a);
  return Math.min(dur, g.s + 0.1);
}

(async () => {
  /* 1. 토막 · 묶음 · 길이 */
  const segs = PLAN.map(p => Object.assign({ f:p.file || path.join(SRC, `seg-${p.seg}.mp4`) }, p));
  const miss = segs.filter(x => !fs.existsSync(x.f)); if(miss.length) throw new Error('없는 장면: ' + miss.map(x => x.seg).join(', ') + ` (${SRC})`);
  const voiceFile = n => {
    for(const v of [VOICE, ...VOICE_FALLBACK]){ const f = path.join(__dirname, 'narration', v, n + '.mp3'); if(fs.existsSync(f)){ if(v !== VOICE) console.log(`  (${VOICE} 에 ${n} 없음 → ${v})`); return f; } }
    const f = path.join(OUT, `silent-${n}.wav`); ff(['-f', 'lavfi', '-i', 'anullsrc=r=48000:cl=stereo', '-t', '4.5', f]);
    console.log(`  ⚠ ${n}: 어느 목소리 폴더에도 없음 — 4.5초 무음으로 자리만 잡음`); return f; };
  segs.forEach(x => { x.full = probe(x.f); x.in = x.in || 0; x.out = Math.min(x.out || x.full, x.full); x.xfd = x.xf ? x.xf[1] : 0; });
  const groups = []; segs.forEach(x => { if(x.n || !groups.length) groups.push([x]); else groups[groups.length - 1].push(x); });
  groups.forEach((g, gi) => {
    const head = g[0]; if(!head.n) return;
    head.nf = voiceFile(head.n); head.nd = probe(head.nf);
    if(head.sent){ const line = NAR.lines.find(l => l.id === head.n); const c = sentenceCut(head.nf, line ? line.text : '', head.sent, head.nd);
      if(c && c < head.nd - 0.3){ head.ncut = c; console.log(`  ${head.n}: ${head.sent}번째 문장 끝 ${c.toFixed(2)}초에서 자름(전체 ${head.nd.toFixed(2)}초)`); head.nd = c; } }
    const nextXf = (groups[gi + 1] && groups[gi + 1][0].xfd) || 0;
    const need = head.at + head.nd + (head.breath != null ? head.breath : BREATH) + nextXf;
    const last = g[g.length - 1];
    const others = g.slice(0, -1).reduce((a, x) => a + (x.out - x.in), 0) - g.slice(1).reduce((a, x) => a + x.xfd, 0);
    const dl = Math.max(last.min || 1.2, need - others);
    if(last.stretch){
      last.rate = dl / (last.full - last.in); last.out = last.full;
      if(last.rate < 0.7 || last.rate > 1.5) console.log(`  ⚠ ${last.seg}: ${last.rate.toFixed(2)}배로 늘림 — 다시 찍는 게 좋다(capture.js ${last.seg})`);
      last.hold = 0; last.d = dl; return; }
    last.out = last.in + dl;
    last.hold = Math.max(0, last.out - last.full);
    if(last.hold > 0.05) console.log(`  ⚠ ${last.seg}: 찍은 길이보다 ${last.hold.toFixed(2)}초 길다 — 마지막 장면을 멈춘 채 늘림`);
  });
  let t = 0;
  segs.forEach((x, i) => { if(!x.stretch) x.d = x.out - x.in; if(i) t -= x.xfd; x.start = t; t += x.d; });
  const total = t;
  const lines = segs.filter(x => x.n).map(x => ({ n:x.n, f:x.nf, a:x.start + x.at, d:x.nd, cut:x.ncut, seg:x.seg }));
  lines.forEach((l, i) => { const nx = lines[i + 1]; l.room = (nx ? nx.a : total) - (l.a + l.d); });
  const gEnd = x => { const g = groups.find(g => g.includes(x)); const l = g[g.length - 1]; return l.start + l.d; };

  /* 2. 자막·훅·각주 PNG — 튀어나오기(13장) → 머묾 → 사라지기(10장) */
  const capDir = path.join(OUT, `captions-v4${SUFFIX}`); fs.rmSync(capDir, { recursive:true, force:true }); fs.mkdirSync(capDir, { recursive:true });
  const caps = [];
  { const { server, base } = await L.serve();
    const browser = await L.launch();
    const { ctx, page } = await L.newPage(browser, { w:W, h:H, dpr:1, state:null });
    let k = 0, kk = 0;   /* k = 자막 번호(화면에 보임), kk = 파일 번호 */
    const shoot = async (c, params, frames = true) => {
      await page.goto(`${base}/number_magic/scripts/showreel/caption.html?` + new URLSearchParams(Object.assign({ v:VERT ? '1' : '0' }, params)));
      await page.waitForFunction(() => window.__ready === true); await page.waitForTimeout(250);
      c.dir = path.join(capDir, String(++kk).padStart(2, '0') + '-' + c.kind); fs.mkdirSync(c.dir);
      const nIn = frames ? 13 : 10, nOut = frames ? 10 : 10;
      for(let i = 0; i < nIn; i++){ await page.evaluate(p => window.pose(p), i / (nIn - 1)); await page.screenshot({ path:path.join(c.dir, `in${String(i).padStart(2, '0')}.png`), omitBackground:true }); }
      for(let i = 0; i < nOut; i++){ await page.evaluate(p => window.pose(-p), (i + 1) / nOut); await page.screenshot({ path:path.join(c.dir, `out${String(i).padStart(2, '0')}.png`), omitBackground:true }); }
      caps.push(c); };
    for(const x of segs){
      const line = x.n && NAR.lines.find(l => l.id === x.n);
      const capTxt = (line && line.cap) || x.cap;
      if(capTxt){ k++; const c = Object.assign({ n:String(k).padStart(2, '0'), kind:'cap' }, capTxt);
        c.a = x.start + (x.from != null ? (x.from < 1 && x.nd ? x.at + x.from * x.nd : x.from) : x.xfd + 0.1); c.b = gEnd(x) - 0.35;
        await shoot(c, { ko:c.ko, en:c.en, n:c.n, pos:x.pos || 'bl' }); }
      if(x.hook){ const c = Object.assign({ n:'', kind:'hook' }, x.hook); c.a = x.start + 0.25; c.b = x.start + x.d - 0.25;
        await shoot(c, { hook:'1', ko:c.ko, en:c.en }); }
      if(x.foot){ const c = Object.assign({ n:'', kind:'foot' }, FOOT); c.a = x.start + (x.hook ? 0.1 : x.xfd); c.b = x.start + x.d - 0.15;
        await shoot(c, { foot:'1', ko:c.ko, en:c.en }, false); }
    }
    await ctx.close(); await browser.close(); server.close(); }

  /* 3. 영상 */
  const video = path.join(OUT, `v4${SUFFIX}-video.mp4`);
  { const args = [];
    segs.forEach(x => args.push('-i', x.f));
    caps.forEach(c => { args.push('-framerate', '30', '-i', path.join(c.dir, 'in%02d.png'), '-framerate', '30', '-i', path.join(c.dir, 'out%02d.png')); });
    const fl = [];
    segs.forEach((x, i) => fl.push(`[${i}:v]${x.hold > 0.05 ? `tpad=stop_mode=clone:stop_duration=${(x.hold + 0.2).toFixed(3)},` : ''}trim=start=${x.in}:end=${x.out},setpts=${x.stretch ? x.rate.toFixed(4) + '*' : ''}(PTS-STARTPTS),scale=${W}:${H}:flags=lanczos,settb=AVTB,fps=30,format=yuv420p,setsar=1[v${i}]`));
    let cur = 'v0';
    for(let i = 1; i < segs.length; i++){ const [tr, d] = segs[i].xf || ['fade', 0.4];
      fl.push(`[${cur}][v${i}]xfade=transition=${tr}:duration=${d}:offset=${segs[i].start.toFixed(3)}[x${i}]`); cur = `x${i}`; }
    caps.forEach((c, k) => { const j = segs.length + k * 2, nIn = c.kind === 'foot' ? 10 : 13, hold = Math.max(0.2, c.b - c.a - nIn / 30 - 10 / 30);
      fl.push(`[${j}:v]format=rgba,tpad=stop_mode=clone:stop_duration=${hold.toFixed(3)}[ci${k}]`);
      fl.push(`[${j + 1}:v]format=rgba[co${k}]`);
      fl.push(`[ci${k}][co${k}]concat=n=2:v=1:a=0,setpts=PTS+${c.a.toFixed(3)}/TB[c${k}]`);
      fl.push(`[${cur}][c${k}]overlay=0:0:eof_action=pass:enable='between(t,${c.a.toFixed(3)},${(c.b + 0.05).toFixed(3)})'[o${k}]`); cur = `o${k}`; });
    fl.push(`[${cur}]fade=t=in:st=0:d=0.4,fade=t=out:st=${(total - 0.8).toFixed(3)}:d=0.8:color=white,format=yuv420p[out]`);
    args.push('-filter_complex', fl.join(';'), '-map', '[out]', '-c:v', 'libx264', '-preset', 'slow', '-crf', '20', '-profile:v', 'high', '-pix_fmt', 'yuv420p', '-r', '30', '-t', total.toFixed(3), video);
    console.log(`영상 잇는 중(${CUT})… ${total.toFixed(2)}초`);
    for(let k = 0; ; k++){   /* 이 ffmpeg 빌드는 큰 필터 그래프에서 가끔 SIGSEGV 로 죽는다 — 세 번까지 */
      try { ff(k ? ['-filter_complex_threads', '1', ...args] : args); break; }
      catch(e){ if(k >= 2 || e.signal !== 'SIGSEGV') throw e; console.log(`  (ffmpeg ${e.signal} — 다시 ${k + 2}번째)`); }
    } }

  /* 4. 소리 — 내레이션(문장 자르기 포함) + 인트로 영상 소리 */
  const introSeg = segs.find(x => x.audio);
  const voiceOnly = path.join(OUT, `v4${SUFFIX}-voiceonly.wav`);
  let vI = null;
  if(lines.length){
    const voiceWav = path.join(OUT, `v4${SUFFIX}-voice.wav`);
    const args = []; lines.forEach(l => args.push('-i', l.f));
    const fl = lines.map((l, i) => `[${i}:a]${l.cut ? `atrim=0:${l.cut.toFixed(3)},afade=t=out:st=${(l.cut - 0.12).toFixed(3)}:d=0.12,` : ''}aresample=48000,aformat=channel_layouts=stereo,adelay=${Math.round(l.a * 1000)}|${Math.round(l.a * 1000)}[a${i}]`);
    fl.push(`${lines.map((_, i) => `[a${i}]`).join('')}amix=inputs=${lines.length}:normalize=0${VOICE_FX},apad=whole_dur=${total.toFixed(3)},atrim=0:${total.toFixed(3)}[v]`);
    ff([...args, '-filter_complex', fl.join(';'), '-map', '[v]', '-c:a', 'pcm_s16le', voiceWav]);
    vI = +measure(voiceWav).input_i;
    if(introSeg){
      const introWav = path.join(OUT, `v4${SUFFIX}-intro.wav`), d = introSeg.out - introSeg.in;
      ff(['-ss', String(introSeg.in), '-t', String(d + 1.0), '-i', introSeg.f, '-af', `aresample=48000,aformat=channel_layouts=stereo,afade=t=in:d=0.3,afade=t=out:st=${(d - 0.3).toFixed(2)}:d=1.0,apad=whole_dur=${total.toFixed(3)},atrim=0:${total.toFixed(3)}`, '-c:a', 'pcm_s16le', introWav]);
      const iI = +measure(introWav).input_i, introGain = (vI - 3) - iI;
      ff(['-i', voiceWav, '-i', introWav, '-filter_complex', `[1:a]volume=${introGain.toFixed(2)}dB[i];[0:a][i]amix=inputs=2:normalize=0:duration=first[m]`, '-map', '[m]', '-c:a', 'pcm_s16le', voiceOnly]);
      console.log(`  인트로 소리 ${iI} LUFS → ${introGain.toFixed(1)} dB`);
    } else fs.copyFileSync(voiceWav, voiceOnly);
  } else ff(['-f', 'lavfi', '-i', 'anullsrc=r=48000:cl=stereo', '-t', total.toFixed(3), '-c:a', 'pcm_s16le', voiceOnly]);

  /* 5. 배경 음악(수식) — 목소리보다 약 14dB 아래, 말할 때 더 내려간다. 소리 없는 컷은 음악만 */
  const mixWav = path.join(OUT, `v4${SUFFIX}-mix.wav`);
  if(!NOBED){
    const bed = path.join(OUT, `v4${SUFFIX}-bed.wav`);
    const bedStart = introSeg ? introSeg.start + introSeg.d - 0.8 : 0;
    const starts = introSeg ? [introSeg.start + introSeg.d - 0.6, ...groups.slice(2).map(g => g[0].start)] : groups.map(g => g[0].start);
    execFileSync('python3', [path.join(__dirname, 'ambient-bed.py'), bed, total.toFixed(3), starts.map(v => v.toFixed(3)).join(','),
      lines.map(l => `${l.a.toFixed(2)}-${(l.a + l.d).toFixed(2)}`).join(','), groups.slice(1).map(g => g[0].start.toFixed(3)).join(','), 'v4', bedStart.toFixed(2)], { stdio:'inherit' });
    const bI = +measure(bed).input_i;
    const gain = (vI != null ? vI - 14 : -16) - bI;
    console.log(`  음량: 목소리 ${vI} · 배경 ${bI} LUFS → 배경 ${gain.toFixed(1)} dB`);
    ff(['-i', voiceOnly, '-i', bed, '-filter_complex', `[1:a]volume=${gain.toFixed(2)}dB[b];[0:a][b]amix=inputs=2:normalize=0:duration=first[m]`, '-map', '[m]', '-c:a', 'pcm_s16le', mixWav]);
  }

  /* 6. 소리 맞추기 + 합치기 + 보내기용(29MB 미만) */
  const outs = [];
  const variants = lines.length ? [[`numbers-of-magic-showreel-v4${SUFFIX}-voiceonly`, voiceOnly]] : [];
  if(!NOBED) variants.push([`numbers-of-magic-showreel-v4${SUFFIX}`, mixWav]);
  for(const [name, wav] of variants){
    const aac = path.join(OUT, name + '.m4a');
    const li = normalize(wav, aac, lines.length ? -16 : -17);
    const o = path.join(OUT, name + '.mp4');
    ff(['-i', video, '-i', aac, '-map', '0:v', '-map', '1:a', '-c', 'copy', '-movflags', '+faststart', '-shortest', o]);
    const send = path.join(OUT, name + '-send.mp4');
    for(const crf of [23, 25, 27, 29]){
      ff(['-i', video, '-i', aac, '-map', '0:v', '-map', '1:a', '-c:v', 'libx264', '-preset', 'slow', '-crf', String(crf), '-profile:v', 'high', '-pix_fmt', 'yuv420p', '-c:a', 'copy', '-movflags', '+faststart', '-shortest', send]);
      if(fs.statSync(send).size < 29 * 1048576) break;
    }
    fs.unlinkSync(aac);
    outs.push([o, li, send]);
  }
  const main = outs[outs.length - 1][0];

  /* 7. 10초 미리보기(full 만) */
  if(CUT === 'full'){
    const pick = (s, o) => { const x = segs.find(y => y.seg === s); return x.start + Math.min(o, x.d - 1); };
    const picks = [pick('introvid', 5.5), pick('mapreveal', 2.0), pick('philosophy', 3.0), pick('pillars', 6.5), pick('compare', 8.6), pick('village', 2.6), pick('creative3', 5.4), pick('hist', 1.8), pick('examroad', 2.2), pick('end', 3.4)];
    const fl = [], ins = [];
    picks.forEach((p, i) => { fl.push(`[0:v]trim=start=${p.toFixed(2)}:duration=1,setpts=PTS-STARTPTS,scale=960:540:flags=lanczos[v${i}]`);
      fl.push(`[0:a]atrim=start=${p.toFixed(2)}:duration=1,asetpts=PTS-STARTPTS,afade=t=in:d=0.04,afade=t=out:st=0.94:d=0.06[a${i}]`); ins.push(`[v${i}][a${i}]`); });
    fl.push(`${ins.join('')}concat=n=${picks.length}:v=1:a=1[v][a]`);
    ff(['-i', main, '-filter_complex', fl.join(';'), '-map', '[v]', '-map', '[a]', '-c:v', 'libx264', '-crf', '23', '-preset', 'medium', '-pix_fmt', 'yuv420p', '-r', '30',
      '-c:a', 'aac', '-b:a', '128k', '-movflags', '+faststart', path.join(OUT, 'numbers-of-magic-v4-preview-10s.mp4')]);
  }

  /* 8. 밀착 인화지 12칸 */
  const frames = path.join(OUT, `cs4${SUFFIX}`); fs.rmSync(frames, { recursive:true, force:true }); fs.mkdirSync(frames, { recursive:true });
  Array.from({ length:12 }, (_, i) => 0.8 + i * (total - 1.6) / 11).forEach((tt, i) =>
    ff(['-ss', tt.toFixed(2), '-i', main, '-frames:v', '1', '-vf', VERT ? 'scale=360:640' : 'scale=640:360', path.join(frames, `f${String(i).padStart(2, '0')}.png`)]));
  ff(['-framerate', '1', '-i', path.join(frames, 'f%02d.png'), '-vf', `tile=${VERT ? '6x2' : '4x3'}:padding=8:margin=8:color=white`, '-frames:v', '1', path.join(OUT, `numbers-of-magic-v4${SUFFIX}-contact-sheet.png`)]);

  console.log('\n장면 시각 (내레이션)');
  segs.forEach(x => { const l = lines.find(y => y.seg === x.seg && x.n);
    console.log(`  ${x.seg.padEnd(11)} ${x.start.toFixed(2)}–${(x.start + x.d).toFixed(2)}  [${x.in.toFixed(1)}–${x.out.toFixed(1)}${x.stretch ? ' ×' + x.rate.toFixed(2) : ''}]${l ? `   ${l.n} ${l.a.toFixed(2)}–${(l.a + l.d).toFixed(2)}${l.cut ? ' (잘라 ' + l.cut.toFixed(1) + '초)' : ''} (다음 줄까지 ${l.room.toFixed(1)}초)` : ''}`); });
  outs.forEach(([o, li, send]) => console.log(`✓ ${o}  ${(fs.statSync(o).size / 1048576).toFixed(1)} MB  ${li} LUFS\n  ${send}  ${(fs.statSync(send).size / 1048576).toFixed(1)} MB`));
  console.log(`  컷 ${CUT} · 목소리 ${lines.length ? VOICE : '없음'} · 총 ${total.toFixed(2)}초`);
})().catch(e => { console.error(e.stderr ? String(e.stderr).slice(-1500) : '', 'signal=' + e.signal, String(e.message || e).slice(0, 300)); process.exit(1); });
