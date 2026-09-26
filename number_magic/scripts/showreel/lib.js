/* 쇼릴 공용 — 저장소 루트를 http 로 띄우고, 가짜 시계로 한 프레임씩 찍어 ffmpeg 로 넘긴다.
   (swiftshader 는 3D 를 1fps 도 못 그리므로 실시간 녹화가 아니라 "시계를 1/30초씩 밀고 찍기") */
'use strict';
const fs = require('fs'), path = require('path'), http = require('http');
const { spawn, execFileSync } = require('child_process');
const { chromium } = require('../lib/playwright');
const APP = path.resolve(__dirname, '../..'), ROOT = path.resolve(APP, '..');
const FPS = 30;
const TYPES = { '.html':'text/html', '.js':'text/javascript', '.mjs':'text/javascript', '.css':'text/css', '.json':'application/json', '.webp':'image/webp', '.png':'image/png', '.jpg':'image/jpeg', '.svg':'image/svg+xml', '.woff2':'font/woff2', '.woff':'font/woff', '.ttf':'font/ttf', '.mp3':'audio/mpeg', '.mp4':'video/mp4', '.glb':'model/gltf-binary' };

function serve(mounts = {}){
  return new Promise(res => {
    const server = http.createServer((req, rs) => {
      const url = decodeURIComponent(req.url.split('?')[0]);
      const m = Object.keys(mounts).find(k => url.startsWith(k));
      const base = m ? mounts[m] : ROOT;
      const p = path.join(base, m ? url.slice(m.length) : url);
      if(!p.startsWith(base) || !fs.existsSync(p) || fs.statSync(p).isDirectory()){ rs.writeHead(404); return rs.end(); }
      rs.writeHead(200, { 'Content-Type':TYPES[path.extname(p)] || 'application/octet-stream' }); fs.createReadStream(p).pipe(rs);
    });
    server.listen(0, () => res({ server, base:`http://localhost:${server.address().port}` }));
  });
}

/* 글꼴은 curl(에이전트 프록시 인증서를 믿는다)로 받아 넘기고, 나머지 외부 요청(supabase·GA 등)은 끊는다 */
const UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36';
const fontCache = new Map();
async function routeNet(ctx){
  await ctx.route(url => !/^http:\/\/localhost/.test(url.href) && !/^(data|blob):/.test(url.href), async route => {
    const url = route.request().url();
    if(!/^https:\/\/(fonts\.googleapis\.com|fonts\.gstatic\.com|cdn\.jsdelivr\.net\/gh\/orioncactus)\//.test(url)) return route.abort();
    try {
      if(!fontCache.has(url)) fontCache.set(url, execFileSync('curl', ['-sSfL', '--max-time', '30', '-A', UA, url], { maxBuffer:64 << 20, stdio:['ignore', 'pipe', 'ignore'] }));
      const ext = (url.split('?')[0].match(/\.(\w+)$/) || [])[1];
      const type = /googleapis/.test(url) || ext === 'css' ? 'text/css' : ext === 'woff' ? 'font/woff' : ext === 'ttf' ? 'font/ttf' : 'font/woff2';
      await route.fulfill({ status:200, body:fontCache.get(url), headers:{ 'content-type':type, 'access-control-allow-origin':'*' } });
    } catch(e){ await route.abort(); }
  });
}

async function launch(){
  return chromium.launch({ args:['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--disable-background-timer-throttling', '--disable-renderer-backgrounding'] });
}

const STATE = { lang:'ko', onboarded:true, name:'민준', view:'town', avatar:{ kind:'boy' }, account:{ status:'active' }, placement:{ course:'C29', self:true }, coins:120 };

async function newPage(browser, { w = 1920, h = 1080, state = STATE, dpr = 1 } = {}){
  const ctx = await browser.newContext({ viewport:{ width:w, height:h }, deviceScaleFactor:dpr });
  await routeNet(ctx);
  if(state) await ctx.addInitScript(s => { try { if(!sessionStorage.__sr){ localStorage.setItem('nm_state_v1', s); sessionStorage.__sr = 1; } } catch(e){} }, JSON.stringify(state));
  const page = await ctx.newPage();
  page.__errs = [];
  page.on('pageerror', e => page.__errs.push(e.message));
  page.on('console', m => { if(m.type() === 'error' && !/Failed to load resource|net::ERR/.test(m.text())) page.__errs.push(m.text()); });
  return { ctx, page };
}

/* 한 장면 = 한 개의 무손실에 가까운 중간 mp4. frames(page) 는 async generator 처럼 shot() 을 부른다 */
/* libx264 가 든 ffmpeg: FFMPEG 환경변수 > 이 작업 세션의 imageio_ffmpeg 바이너리 > PATH 의 ffmpeg */
const FF = process.env.FFMPEG || [
  '/tmp/claude-0/-home-user-lete-on/88888ecf-1e64-5f01-8516-3c15c45b79de/scratchpad/pyenv/imageio_ffmpeg/binaries/ffmpeg-linux-x86_64-v7.0.2',
].find(p => fs.existsSync(p)) || 'ffmpeg';
function encoder(out, w, h, fps = FPS){
  const ff = spawn(FF, ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', '-',
    '-vf', `scale=${w}:${h}:flags=lanczos,format=yuv420p`, '-c:v', 'libx264', '-preset', 'medium', '-crf', '14', '-r', String(fps), out], { stdio:['pipe', 'inherit', 'inherit'] });
  let n = 0;
  return {
    async push(buf){ n++; if(!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r)); },
    get count(){ return n; },
    close(){ return new Promise(r => { ff.on('close', r); ff.stdin.end(); }); },
  };
}

/* 가상 시간: Playwright clock(타이머·Date·performance.now) + 우리 rAF 큐(한 프레임에 딱 한 번) +
   CSS/Web Animations 도 멈춰 두고 프레임마다 1/30초씩 민다. 그래야 느린 swiftshader 에서도 움직임이 고르다. */
const VT_INIT = () => {
  let q = [];
  const raf = cb => { q.push(cb); return q.length; };
  const caf = () => {};
  Object.defineProperty(window, 'requestAnimationFrame', { configurable:true, get:() => raf, set:() => {} });
  Object.defineProperty(window, 'cancelAnimationFrame', { configurable:true, get:() => caf, set:() => {} });
  window.__srFlush = (stepMs) => {
    const cbs = q; q = [];
    const now = performance.now();
    for(const cb of cbs){ try { cb(now); } catch(e){ console.error('raf', e && e.message); } }
    if(stepMs !== undefined && document.getAnimations){
      for(const a of document.getAnimations()){
        try {
          if(!a.__sr){ a.__sr = 1; a.pause(); a.currentTime = 0; }
          else { if(a.playState !== 'paused') a.pause(); a.currentTime = (a.currentTime || 0) + stepMs; }
        } catch(e){}
      }
    }
    return cbs.length;
  };
};
async function virtualTime(page){
  const T0 = new Date('2026-09-26T10:00:00').getTime();
  await page.clock.install({ time:T0 });
  await page.clock.pauseAt(T0 + 1000);   /* install 만 하면 시계가 실시간으로 흐른다 — 멈춰 두고 우리가 민다 */
  await page.addInitScript(VT_INIT);
}
/* 가상 시간 ms 만큼 진행(프레임 단위로 rAF 를 부른다). 찍지 않고 건너뛸 때 */
async function advance(page, ms, step = 100){
  for(let t = 0; t < ms; t += step){ await page.clock.runFor(step); await page.evaluate(s => window.__srFlush && window.__srFlush(s), step); }
}
/* 한 프레임: 시간 1/30초 → rAF 한 번 → 캡처 */
async function frame(page, cdp, quality = 93){
  const step = 1000 / FPS;
  await page.clock.runFor(step);
  await page.evaluate(s => window.__srFlush && window.__srFlush(s), step);
  const r = await cdp.send('Page.captureScreenshot', { format:'jpeg', quality });
  return Buffer.from(r.data, 'base64');
}

function ease(t){ t = Math.max(0, Math.min(1, t)); return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
function lerp(a, b, t){ return a + (b - a) * t; }

module.exports = { FF, ROOT, APP, FPS, serve, launch, newPage, encoder, ease, lerp, STATE, virtualTime, advance, frame };
