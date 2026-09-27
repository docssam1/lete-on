/* 브라우저 검사 공용 Playwright 로더 (2026-09-25)
   검사기 17개가 require('playwright') 만 해서, 그 모듈이 전역에 깔린 PC 밖에서는
   "Cannot find module" 으로 멈췄다. 여기서 한 번만 찾는다.
     1) 일반 require  2) NM_PLAYWRIGHT 경로  3) npm 전역(npm root -g)  4) /opt/node22 전역
   브라우저 실행 파일은 NM_CHROMIUM > 호출자가 준 executablePath > /opt/pw-browsers 의 chromium > Playwright 기본값.
   못 찾으면 exit 2 와 "미실행" — 통과(0)로 세지 않는다. 설치: npm i --no-save playwright@1.47.2 */
'use strict';
const fs = require('fs'), path = require('path');
function tryReq(p){ try { return require(p); } catch(e){ return null; } }
function globalRoot(){ try { return require('child_process').execSync('npm root -g', {encoding:'utf8', stdio:['ignore','pipe','ignore']}).trim(); } catch(e){ return ''; } }
const pw = tryReq('playwright')
  || (process.env.NM_PLAYWRIGHT && tryReq(process.env.NM_PLAYWRIGHT))
  || (globalRoot() && tryReq(path.join(globalRoot(), 'playwright')))
  || tryReq('/opt/node22/lib/node_modules/playwright');
if(!pw){
  console.log('미실행 — playwright 모듈을 찾지 못했다. `npm i --no-save playwright@1.47.2` 또는 NM_PLAYWRIGHT=<경로>');
  process.exit(2);
}
function bundledChromium(){
  const base = '/opt/pw-browsers';
  try {
    for(const d of fs.readdirSync(base).filter(n => /^chromium-\d+$/.test(n)).sort().reverse()){
      const exe = path.join(base, d, 'chrome-linux', 'chrome');
      if(fs.existsSync(exe)) return exe;
    }
  } catch(e){}
  return null;
}
const exe = process.env.NM_CHROMIUM || bundledChromium();
const chromium = Object.create(pw.chromium);
chromium.launch = (opts) => {
  const o = Object.assign({}, opts || {});
  if(!o.executablePath && exe) o.executablePath = exe;
  return pw.chromium.launch(o);
};
module.exports = Object.assign({}, pw, { chromium });
