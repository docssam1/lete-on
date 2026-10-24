#!/usr/bin/env node
'use strict';
// Synthetic local catalog, shop and storage checks. Blocks every external request.
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict'),vm=require('node:vm'),crypto=require('node:crypto');
const {chromium}=require('./lib/playwright');
const ROOT=path.resolve(__dirname,'../..'),OUT=process.env.NM_COSMETICS_ARTIFACTS||'/tmp/nm-cosmetics51-preview';
const ctx={window:{},document:{documentElement:{lang:'ko'}}};vm.createContext(ctx);
const load=f=>vm.runInContext(fs.readFileSync(path.join(ROOT,'number_magic',f),'utf8'),ctx,{filename:f});
load('data/numi-avatar.js');const original=JSON.parse(JSON.stringify(ctx.window.NM_AVATAR));
load('data/cosmetics-catalog.js');load('app/numi-render.js');
const C=ctx.window.NM_COSMETICS,all=Object.entries(C.groups).flatMap(([type,list])=>list.map(item=>({type,item})));
assert.equal(all.length,51);assert.equal(C.groups.hat.length,18);assert.equal(C.groups.cape.length,15);assert.equal(C.groups.bg.length,18);
assert.equal(new Set(all.map(x=>x.item.id)).size,51);
for(const [key,items]of Object.entries(original))assert.deepEqual(JSON.parse(JSON.stringify(ctx.window.NM_AVATAR[key].slice(0,items.length))),items,'approved catalog entries unchanged');
const artHashes=new Set();
for(const {type,item}of all){
  assert.equal(item.free,false);assert([80,180,360,600].includes(item.price));assert(['common','rare','epic','legendary'].includes(item.rarity));
  for(const lang of ['ko','en','zh']){assert(item[lang]);assert(item.description[lang]);}
  const html=ctx.window.renderNumiChar({number:3,color:'blue',hat:'none',cape:'none',bg:'plain',[type]:item.id},100);
  const marker=`data-nm-cosmetic="${type}:${item.id}"`;
  assert(html.includes(marker),'purchased item has visible original SVG');
  const start=html.indexOf(marker),next=html.indexOf('</svg>',start),art=html.slice(start,next).replace(marker,'').replace(/nmweave_nm\d+/g,'nmweave_UID');
  assert(/<(path|circle|ellipse|polygon|rect)\b/.test(art));
  const hash=crypto.createHash('sha256').update(art).digest('hex');assert(!artHashes.has(hash),'art is not a duplicate color-only entry');artHashes.add(hash);
  assert.equal(C.needsSprite({[type]:item.id}),type!=='bg');
}
const lengths=Object.values(ctx.window.NM_AVATAR).map(x=>x.length);C.register();assert.deepEqual(Object.values(ctx.window.NM_AVATAR).map(x=>x.length),lengths,'registration is idempotent');
assert.equal(C.needsSprite({hat:'wizard',cape:'red'}),false);
const townSource=fs.readFileSync(path.join(ROOT,'number_magic/app/town3d/town3d.js'),'utf8');
const mainSource=fs.readFileSync(path.join(ROOT,'number_magic/app/main.js'),'utf8');
const modelStart=mainSource.indexOf('const buddyModel=(()=>{'),modelEnd=mainSource.indexOf('})();',modelStart)+5;
const modelBody=mainSource.slice(modelStart,modelEnd)+'\nwindow.fixtureModel=buddyModel;';
const modelFor=character=>{ctx.S={character};ctx.NM_COSMETICS=C;ctx.C3_SYMS=['plus','minus','times','divide','equal','percent','pi','sigma','infinity','sqrt'];vm.runInContext('{'+modelBody+'}',ctx);return ctx.window.fixtureModel;};
for(const {type,item}of all){const character={number:3,color:'blue',hat:'none',cape:'none',bg:'plain',[type]:item.id};assert.equal(modelFor(character)===null,type!=='bg','the actual main builder keeps new wearable art via billboard fallback');}
assert(modelFor({number:3,color:'blue',hat:'wizard',cape:'red'}),'legacy model remains a 3D model');
assert.equal(modelFor({number:77,color:'blue',hat:'none',cape:'none'}),null,'legacy double-digit sprite fallback preserved');
const spriteSource=townSource.slice(townSource.indexOf('const svgToImg ='),townSource.indexOf('const POSES ='))+
  'const CW=160,CH=200;\n'+townSource.slice(townSource.indexOf('async function bakeHtml('),townSource.indexOf('/* 그림의 위·아래 끝'));
const fixture=`<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Original wizard cosmetics — local preview</title>
<link rel="stylesheet" href="/number_magic/app/closet.css"><style>body{margin:0;background:#f7f0e3;color:#493c32;font-family:Arial,sans-serif}main{padding:24px;max-width:1260px;margin:auto}h1{font-family:Georgia,serif;font-weight:500;margin:0 0 8px}h2{font-size:18px;margin:24px 0 12px}.note{color:#786950;font-size:14px}.board{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:10px}.card{display:flex;min-width:0;flex-direction:column;align-items:center;justify-content:center;background:#fffaf0;border:1px solid #d9c9a9;border-radius:14px;padding:8px;min-height:177px;overflow:hidden}.card .name{font-size:13px;margin:4px 0;text-align:center}.card small{font-size:10px;color:#80694c}.numi-fig{flex:0 0 auto}.nm-human{position:relative}.nm-human img{width:100%;height:100%;object-fit:contain}.nm-party{position:relative}.nm-party-buddy{position:absolute;left:55%;bottom:0}.nmc-wrap{background:#fffdf8}button{cursor:pointer}.card:focus-visible{outline:3px solid #896d37}@media(max-width:600px){main{padding:12px}.board{grid-template-columns:repeat(3,minmax(0,1fr));gap:7px}.card{min-height:165px;padding:5px}.card .name{font-size:11px}.card small{font-size:9px}}</style>
<main><h1>수의 마법 · 새로운 51가지 꾸미기</h1><p class="note">Original SVG art · synthetic local preview · portrait backgrounds do not replace the village map</p><div id="board"></div><div id="closet" hidden></div></main>
<script>window.NM_CHAR_BASE='/number_magic/assets/characters/';</script><script src="/number_magic/data/numi-avatar.js"></script><script src="/number_magic/data/cosmetics-catalog.js"></script><script src="/number_magic/data/human-avatars.js"></script><script src="/number_magic/app/numi-render.js"></script><script src="/number_magic/app/character-state.js"></script><script src="/number_magic/app/closet.js"></script>
<script>
const groups=NM_COSMETICS.groups,labels={hat:'모자 18종 · 서로 다른 실루엣',cape:'망토 15종 · 재단과 문양',bg:'초상 배경 18종 · 마을 지도와 별개'};
document.getElementById('board').innerHTML=Object.entries(groups).map(([type,items])=>'<section data-group="'+type+'"><h2>'+labels[type]+'</h2><div class="board">'+items.map(item=>'<div class="card" data-item="'+item.id+'">'+renderNumiChar({number:3,color:'blue',hat:'none',cape:'none',bg:'plain',[type]:item.id},100)+'<span class="name">'+item.ko+'</span><small>'+item.rarity+' · '+item.price+' coins</small></div>').join('')+'</div></section>').join('');
const saved=()=>JSON.parse(localStorage.getItem('cosmetic-fixture')||'null');
window.fixtureState=saved()||{coins:100000,character_unlocked:{number_99:true},character:{number:3,color:'blue',hat:'none',cape:'none',bg:'plain'},progress:{keep:{done:true}},name:'Synthetic only'};
const persist=()=>localStorage.setItem('cosmetic-fixture',JSON.stringify(window.fixtureState));
window.mountCloset=()=>{document.getElementById('board').hidden=true;document.getElementById('closet').hidden=false;screenCloset(document.getElementById('closet'),{char:fixtureState.character,coins:fixtureState.coins,unlocked:fixtureState.character_unlocked,lang:new URLSearchParams(location.search).get('lang')||'ko',human:{id:'fixture',kind:'boy',look:'boy',outfit:'original'},onPurchase(type,id){const r=NM_CHARACTER_STATE.purchase(fixtureState,type,id,NM_AVATAR,NM_HUMANS);if(r.ok)persist();return r;},onSave(char){fixtureState.character=char;persist();return true;},onSaveHuman(){return true;}});};
window.ready=true;
</script><script>${spriteSource}
window.checkTownSprites=async()=>{const results=[],keys=new Set();for(const [type,items]of Object.entries(NM_COSMETICS.groups))for(const item of items){const html=renderNumiChar({number:3,color:'blue',hat:'none',cape:'none',bg:'plain',[type]:item.id},64),canvas=await bakeHtml(html),pixels=canvas.getContext('2d').getImageData(0,0,canvas.width,canvas.height).data;let alpha=0;for(let i=3;i<pixels.length;i+=4)if(pixels[i]>32)alpha++;const key=canvas.toDataURL();results.push({type,id:item.id,pixels:alpha,unique:!keys.has(key)});keys.add(key);}return results;};
</script>`;
const MIME={'.html':'text/html','.js':'application/javascript','.css':'text/css','.png':'image/png','.svg':'image/svg+xml'};
const server=http.createServer((req,res)=>{const p=req.url.split('?')[0];if(p==='/cosmetics-fixture.html'){res.setHeader('Content-Type','text/html');return res.end(fixture);}const f=path.resolve(ROOT,'.'+decodeURIComponent(p));if(!f.startsWith(ROOT+path.sep)||!fs.existsSync(f)||!fs.statSync(f).isFile()){res.writeHead(404);return res.end();}res.setHeader('Content-Type',MIME[path.extname(f)]||'application/octet-stream');fs.createReadStream(f).pipe(res);});
(async()=>{fs.mkdirSync(OUT,{recursive:true});await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port,browser=await chromium.launch({headless:true}),reports=[];
try{for(const [width,lang]of [[1360,'ko'],[390,'ko'],[390,'en'],[390,'zh']]){
 const context=await browser.newContext({viewport:{width,height:920},reducedMotion:'reduce'}),page=await context.newPage(),errors=[];let externalWrites=0;
 page.on('pageerror',e=>errors.push(e.message));await page.route('**/*',r=>{if(r.request().url().startsWith(base+'/')&&r.request().method()==='GET')return r.continue();externalWrites++;return r.abort();});
 await page.goto(base+'/cosmetics-fixture.html?lang='+lang);await page.waitForFunction(()=>window.ready);await page.locator('.card img').evaluateAll(imgs=>Promise.all(imgs.map(i=>i.complete?Promise.resolve():new Promise(r=>{i.onload=r;i.onerror=r;}))));
 assert.equal(await page.locator('[data-nm-cosmetic]').count(),51);
 assert.equal(await page.locator('.card img').evaluateAll(imgs=>imgs.every(i=>i.complete&&i.naturalWidth>0)),true,'all approved character PNGs decode');
 const svg=await page.evaluate(()=>{const roots=[...document.querySelectorAll('.card svg')],ids=[...document.querySelectorAll('.card [id]')].map(e=>e.id);return {invalidPoints:[...document.querySelectorAll('polygon')].some(e=>/[Zz]/.test(e.getAttribute('points'))),uniqueIds:ids.length===new Set(ids).size,geometry:roots.every(s=>s.querySelectorAll('path,circle,ellipse,polygon,rect').length>0),overflow:document.documentElement.scrollWidth>innerWidth};});
 assert.deepEqual(svg,{invalidPoints:false,uniqueIds:true,geometry:true,overflow:false});
 let townSpriteFrames=0;if(width===1360){const frames=await page.evaluate(()=>window.checkTownSprites());assert.equal(frames.length,51);assert(frames.every(x=>x.pixels>200&&x.unique),'every original SVG survives the real town billboard baker');townSpriteFrames=frames.length;}
 if(lang==='ko'){await page.screenshot({path:path.join(OUT,width+'-board.png'),fullPage:true});for(const type of ['hat','cape','bg'])await page.locator('[data-group="'+type+'"]').screenshot({path:path.join(OUT,width+'-'+type+'.png')});}
 await page.evaluate(()=>window.mountCloset());
 const state=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('cosmetic-fixture')||JSON.stringify(window.fixtureState)));
 const originalState=await state();let total=0;
 for(const {type,item}of all){await page.locator('[data-nmc-act="tab"][data-tab="'+type+'"]').click();await page.locator('[data-nmc-act="item"][data-type="'+type+'"][data-id="'+item.id+'"]').click();assert.equal((await state()).coins,100000-total,'preview never charges');assert.equal(await page.locator('#nmc-preview [data-nm-cosmetic="'+type+':'+item.id+'"]').count(),1);await page.locator('[data-nmc-act="confirm"]').click();total+=item.price;const s=await state();assert.equal(s.coins,100000-total);assert.equal(s.character[type],item.id);assert.equal(s.character_unlocked[type+'_'+item.id],true);}
 const after=await state();assert.deepEqual(after.progress,originalState.progress);assert.equal(after.name,originalState.name);assert.equal(after.character_unlocked.number_99,true);assert.equal(Object.keys(after.character_unlocked).length,52);
 await page.reload();await page.waitForFunction(()=>window.ready);await page.evaluate(()=>window.mountCloset());assert.deepEqual(await state(),after,'all selections and purchases survive reload');
 for(const type of ['hat','cape','bg']){const item=C.groups[type][0];await page.locator('[data-nmc-act="tab"][data-tab="'+type+'"]').click();await page.locator('[data-nmc-act="item"][data-type="'+type+'"][data-id="'+item.id+'"]').click();await page.locator('[data-nmc-act="confirm"]').click();assert.equal((await state()).coins,after.coins,'owned items never charge again');}
 await page.locator('[data-nmc-act="tab"][data-tab="hat"]').click();await page.screenshot({path:path.join(OUT,width+'-'+lang+'-closet.png'),fullPage:false});
 assert.deepEqual(errors,[]);assert.equal(externalWrites,0);reports.push({width,lang,originalCatalogPreserved:true,rendered:51,uniqueOriginalArt:51,purchasedExactlyOnce:51,selectionPersisted:true,oldOwnedPreserved:true,studentProgressPreserved:true,townSpriteFrames,svg,externalWrites});await context.close();
}fs.writeFileSync(path.join(OUT,'report.json'),JSON.stringify({catalogVersion:C.version,totalNewItems:51,reports},null,2));console.log('OK: 51 original paid SVG cosmetics; 4 browser conditions, 204 purchases/preview/cancel-safe wallet, all selection persistence, preserved student records, no external writes. Evidence: '+OUT);
}finally{await browser.close();await new Promise(r=>server.close(r));}})().catch(e=>{console.error(e);process.exitCode=1;});
