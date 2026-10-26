#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),{execFileSync}=require('node:child_process');
const {chromium}=require('./lib/playwright');const root=path.resolve(__dirname,'..');
function context(old){const c={console,URL,document:{currentScript:null}};c.window=c;vm.createContext(c);for(const f of ['engine/rng.js','engine/threads/ns_ad.js','engine/threads/sb.js','data/threads.js','engine/c0-cognitive.js','app/c0-concrete.js']){if(old&&f==='app/c0-concrete.js')continue;vm.runInContext(old&&f==='engine/c0-cognitive.js'?execFileSync('git',['show','037f5086:number_magic/'+f],{encoding:'utf8',cwd:root}):fs.readFileSync(path.join(root,f),'utf8'),c);}return c;}
const c=context(false),old=context(true);let samples=0;
for(const id of ['AD1','SB1'])for(let seed=0;seed<1024;seed++){
 const params={max:9,maxSum:9,c0:{block:'D',max:10}},gen=c.NM_TGEN[c.NM_THREADS[id].gen],p=c.NM_C0.generate(id,1,params,c.NM_RNG.mulberry32(seed),gen),prior=old.NM_C0.generate(id,1,params,old.NM_RNG.mulberry32(seed),gen);
 assert.equal(JSON.stringify(p),JSON.stringify(prior));
 if(id==='AD1'){
  const html=c.NM_C0_CONCRETE.html(p,false,id,'ko');assert.equal((html.match(/<img /g)||[]).length,p.answer);assert(!html.includes('<svg'));
  assert(html.includes('답을 쓰는 칸'));assert(c.NM_C0_CONCRETE.html(p,true,id,'ko').includes(`모두 ${p.answer}개`));
 }else assert.equal(c.NM_C0_CONCRETE.html(p,false,id,'ko'),'');samples++;
}
for(const id of ['AD1','SB1'])for(const lang of ['ko','en','zh'])assert(!/그림|picture|看图/.test(c.NM_C0.copy(id,1).instr[lang]));
assert.equal(c.NM_C0_CONCRETE.html({cubes:{piles:[2,3],moveTo:4},answer:4},true,'AD1','ko'),'');
(async()=>{const browser=await chromium.launch();try{
 const page=await browser.newPage({viewport:{width:390,height:844}});
 await page.route('http://c0.test/**',route=>{const rel=new URL(route.request().url()).pathname.slice(1);if(!rel)return route.fulfill({contentType:'text/html',body:'<html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="font-family:sans-serif"><main></main><script src="/app/c0-concrete.js"></script></body></html>'});const f=path.resolve(root,rel);if(!f.startsWith(root+path.sep)||!fs.existsSync(f))return route.abort();return route.fulfill({path:f,contentType:f.endsWith('.png')?'image/png':'application/javascript; charset=utf-8'});});
 await page.goto('http://c0.test/');
 for(const media of ['screen','print'])for(const width of [390,718]){
  await page.setViewportSize({width,height:1000});await page.emulateMedia({media});
  await page.evaluate(()=>{document.querySelector('main').innerHTML=NM_C0_CONCRETE.html({cubes:{piles:[1,8],moveTo:9},answer:9},false,'AD1','ko');});
  await page.evaluate(()=>Promise.all([...document.images].map(im=>im.decode())));
  const result=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,images:[...document.images].every(im=>im.naturalWidth>0&&im.getBoundingClientRect().width>=20),box:(()=>{const r=document.querySelector('.nm-c0-concrete-box').getBoundingClientRect();return [r.width,r.height]})()}));
  assert(!result.overflow);assert(result.images);assert(result.box[0]>=83&&result.box[1]>=67);
  if(media==='screen'&&width===390)await page.screenshot({path:'/tmp/nm-c0-concrete-390.png'});
 }
 await page.pdf({path:'/tmp/nm-c0-concrete.pdf',format:'A4',printBackground:true});
 console.log(`PASS ${samples} original-seed output comparisons; bead counts and answer hiding; approved PNG load/390px/A4 layout/large answer boxes.`);
 }finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
