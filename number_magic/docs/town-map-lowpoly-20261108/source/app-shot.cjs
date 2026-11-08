const fs=require('fs'),path=require('path'),http=require('http');
const {chromium}=require('/home/user/lete-on/number_magic/scripts/lib/playwright');
const root='/home/user/lete-on',NEW=process.argv[2],OUT=process.argv[3];
const server=http.createServer((req,res)=>{const f=path.resolve(root,'.'+decodeURIComponent(req.url.split('?')[0]));if(!f.startsWith(root+'/')||!fs.existsSync(f)||!fs.statSync(f).isFile()){res.writeHead(404);return res.end();}res.setHeader('Content-Type',({'.html':'text/html','.js':'application/javascript','.css':'text/css','.jpg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml','.webp':'image/webp'})[path.extname(f)]||'application/octet-stream');fs.createReadStream(f).pipe(res);});
(async()=>{await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port;const b=await chromium.launch({args:['--disable-webgl','--disable-webgl2']});
for(const [w,h,tag] of [[1280,800,'pc'],[390,844,'phone']]){for(const which of ['old','new']){
 const c=await b.newContext({viewport:{width:w,height:h},deviceScaleFactor:2,reducedMotion:'reduce'}),p=await c.newPage();
 await c.route('**/*',r=>{const u=r.request().url();if(which==='new'&&u.includes('/number_magic/assets/map.jpg'))return r.fulfill({contentType:'image/jpeg',body:fs.readFileSync(NEW)});if(u.startsWith(base+'/')&&r.request().method()==='GET')return r.continue();return r.abort();});
 await c.route('**/app/entry.js?*',r=>r.fulfill({contentType:'application/javascript',body:'window.NM_ENTRY={mode:"fixture"};'}));
 await c.addInitScript(()=>{localStorage.setItem('nm_preview_state_v1',JSON.stringify({lang:'ko',onboarded:true,name:'민지',view:'town',avatar:{kind:'girl',name:'민지'},character:{number:3,color:'gold'},coins:120,progress:{'N-01':{done:true}},r0BannerSeen:true,attend:{last:new Date(Date.now()+9*3600000).toISOString().slice(0,10),days:1},account:{status:'active'}}));});
 await p.goto(base+'/number_magic/index.html?enter=1');
 if(!await p.locator('#townVp').count())await p.locator('#ttGame:visible,.t3d-btn[data-id="game"]').first().click();
 await p.waitForSelector('#townVp.is-illustrated');await p.waitForTimeout(1200);
 await p.screenshot({path:path.join(OUT,`${tag}-${which}.png`)});await c.close();}}
await b.close();server.close();})().catch(e=>{console.error(e);process.exit(1)});
