#!/usr/bin/env node
'use strict';
// Synthetic local wallet only. No external requests, profile writes or messages.
const fs=require('fs'),path=require('path'),http=require('http'),assert=require('node:assert/strict');
const {chromium}=require('./lib/playwright');
const ROOT=path.resolve(__dirname,'../..'),OUT=process.env.NM_COLLECTION_ARTIFACTS||'/tmp/nm-collection-design';
const MIME={'.html':'text/html','.js':'application/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.woff2':'font/woff2'};
const server=http.createServer((req,res)=>{const f=path.resolve(ROOT,'.'+decodeURIComponent(req.url.split('?')[0]));if(!f.startsWith(ROOT+path.sep)||!fs.existsSync(f)||!fs.statSync(f).isFile()){res.writeHead(404);return res.end();}res.setHeader('Content-Type',MIME[path.extname(f)]||'application/octet-stream');fs.createReadStream(f).pipe(res);});
(async()=>{
  fs.mkdirSync(OUT,{recursive:true});await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port,b=await chromium.launch({headless:true,args:['--disable-webgl','--disable-webgl2']}),report=[];
  try{for(const [width,height,lang]of [[390,844,'ko'],[1280,900,'ko'],[390,844,'en'],[390,844,'zh'],[844,390,'ko']].filter(([w,h,l])=>!process.env.NM_COLLECTION_CASE||process.env.NM_COLLECTION_CASE===w+'x'+h+'-'+l)){
    const ctx=await b.newContext({viewport:{width,height},reducedMotion:'reduce'}),p=await ctx.newPage(),errors=[];
    p.on('pageerror',e=>errors.push(e.message));await ctx.route('**/*',r=>r.request().url().startsWith(base+'/')&&r.request().method()==='GET'?r.continue():r.abort());
    await ctx.route('**/app/entry.js?*',r=>r.fulfill({contentType:'application/javascript',body:'window.NM_ENTRY={mode:"fixture"};'}));
    await ctx.addInitScript(lang=>{const d=new Date(),day=[d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');localStorage.setItem(window.NM_STATE_KEY||'nm_preview_state_v1',JSON.stringify({lang,onboarded:true,name:'수집검수',avatar:{kind:'girl'},character:{number:3,color:'blue',hat:'none',cape:'none',bg:'plain'},character_unlocked:{number_99:true},coins:1000,progress:{},account:{status:'active'},attend:{last:day,days:1},coinLedger:[]}));},lang);
    const state=()=>p.evaluate(()=>JSON.parse(localStorage.getItem(window.NM_STATE_KEY||'nm_preview_state_v1'))),act=a=>p.locator('[data-nmc-act="'+a+'"]'),tab=t=>p.locator('.nmc-tab[data-tab="'+t+'"]'),item=(type,id)=>p.locator('.nmc-item[data-type="'+type+'"][data-id="'+id+'"]');
    const shot=async name=>{await p.evaluate(()=>document.fonts.ready);await p.screenshot({path:path.join(OUT,width+'x'+height+'-'+lang+'-'+name+'.png')});};
    await p.goto(base+'/number_magic/index.html?enter=1');await p.locator('.nm-title3d [data-id="game"]:visible,#ttGame:visible').first().click({timeout:60000});await p.locator('#charChipBtn').click();await p.waitForSelector('#nmc-name');
    const original=await state();
    assert.equal(await p.evaluate(()=>Object.values(NM_COSMETICS.groups).flat().length),51);
    assert.equal(await p.evaluate(()=>Object.values(NM_COSMETICS.groups).flat().filter(x=>x.free||x.price<=0).length),0);
    assert.equal(await p.evaluate(()=>NM_CHARACTER_STATE.gifts.length),4);
    const collection=[];
    for(const [type,count]of [['hat',18],['cape',15],['bg',18]]){
      await tab(type).click();
      assert.equal(await p.locator('.nmc-filters button').count(),4);
      assert.equal(await p.locator('#nmc-grid [data-nm-item-art]').count(),count,type+' distinct original item art');
      assert.equal(await p.locator('#nmc-grid [data-rarity=legendary]').count()>0,true,type+' legendary frame');
      const data=await p.evaluate(type=>{const slot={hat:'hats',cape:'capes',bg:'bgs'}[type],items=NM_AVATAR[slot],s=JSON.parse(localStorage.getItem(window.NM_STATE_KEY||'nm_preview_state_v1'));return{total:items.length,owned:items.filter(x=>x.free||!(x.price>0)||s.character_unlocked?.[type+'_'+x.id]).length};},type);
      assert.equal((await p.locator('.nmc-collection-head progress').getAttribute('max')),String(data.total));assert.equal((await p.locator('.nmc-collection-head progress').getAttribute('value')),String(data.owned));
      await p.locator('[data-f=owned]').click();assert.equal(await p.locator('.nmc-item').count(),data.owned);assert.equal(await p.locator('.nmc-item[data-owned=false]').count(),0);
      await p.locator('[data-f=shop]').click();assert.equal(await p.locator('.nmc-item').count(),data.total-data.owned);assert.equal(await p.locator('.nmc-item[data-owned=true]').count(),0);
      await p.locator('[data-f=affordable]').click();assert.equal(await p.locator('.nmc-item').count(),data.total-data.owned,'1000 coins cover every unowned '+type);
      await p.locator('[data-f=all]').click();await p.locator('#nmc-grid').scrollIntoViewIfNeeded();await shot(type+'-collection');collection.push({type,...data,newArt:count});
    }
    // Only the explicit gift registry may carry a completion-gift badge.
    const badges=[];
    for(const type of ['number','symbol']){
      await tab(type).click();await p.locator('[data-f=all]').click();
      const observed=await p.locator('.nmc-item:has(.nmc-ibadge)').evaluateAll(es=>es.map(e=>({type:e.dataset.type,id:e.dataset.id,text:e.querySelector('.nmc-ibadge').textContent})));
      const expected=await p.evaluate(type=>NM_CHARACTER_STATE.gifts.filter(g=>g.type===type).map(g=>String(g.id)).sort(),type);
      assert.deepEqual(observed.map(x=>x.id).sort(),expected);badges.push(...observed);
      if(type==='number'){assert.equal(await item('number','99').locator('.nmc-ibadge').count(),0,'old owned 99 is not labelled a completion gift');assert(!/보상|Reward|奖励/.test(await p.locator('.nmc-section-title').last().innerText()),'special number section is not a reward claim');}
    }
    const purchases=[];
    for(const [type,id,price]of [['hat','explorer-brim',80],['cape','atlas-scroll',600],['bg','book-arch',180]]){
      await tab(type).focus();await p.keyboard.press('Enter');await p.locator('[data-f=all]').click();const before=await state();
      await item(type,id).focus();await p.keyboard.press('Enter');assert.equal((await state()).coins,before.coins,'preview has no charge');assert.deepEqual((await state()).character,before.character,'preview has no equipment write');
      assert.equal(await p.locator('#nmc-preview [data-nm-cosmetic="'+type+':'+id+'"]').count(),1,'preview renders selected original art');
      await shot(type+'-preview');await act('confirm').focus();await p.keyboard.press('Enter');
      const after=await state();assert.equal(after.coins,before.coins-price,'explicit purchase debits once');assert.equal(after.character[type],id);assert.equal(after.character_unlocked[type+'_'+id],true);purchases.push({type,id,price,balance:after.coins});
    }
    await tab('hat').click();await item('hat','none').click();await act('confirm').click();await item('hat','explorer-brim').click();await act('confirm').click();assert.equal((await state()).coins,140,'owned item can be re-equipped without repurchase');
    await item('hat','observatory-dome').click();assert.equal(await act('confirm').isDisabled(),true,'legendary cannot be bought with an insufficient balance');await act('cancel').click();
    await p.locator('[data-f=affordable]').click();assert.equal(await p.locator('.nmc-item[data-id=observatory-dome]').count(),0,'affordable filter omits expensive items');
    const metrics=await p.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth+1,small:[...document.querySelectorAll('.nmc-wrap button')].filter(e=>{const r=e.getBoundingClientRect();return r.height&&Math.min(r.height,r.width)<44;}).map(e=>e.dataset.k),rarityLabels:[...document.querySelectorAll('.nmc-rarity')].map(e=>e.textContent)}));assert(!metrics.overflow);assert.deepEqual(metrics.small,[]);
    await act('points').click();const guide=await p.locator('.nmc-guide').innerText();assert(/20/.test(guide)&&/2/.test(guide));await shot('points');
    const final=await state();for(const key of ['name','progress','account'])assert.deepEqual(final[key],original[key],key+' preserved');assert.equal(final.character_unlocked.number_99,true,'old ownership preserved');assert.equal(final.coinLedger.length,3,'only explicit purchases create ledger debits');
    await p.locator('#backCloset').click();assert.equal(await p.locator('[data-nm-cosmetic="hat:explorer-brim"]').count()>0,true,'actual painted town keeps purchased hat');assert.equal(await p.locator('[data-nm-cosmetic="cape:atlas-scroll"]').count()>0,true,'actual painted town keeps purchased cape');await shot('town-equipped');
    assert.deepEqual(errors,[]);report.push({width,height,lang,newArt:51,newFreeItems:0,giftBadges:badges,collection,purchases,remaining:final.coins,ownedReequipNoCharge:true,insufficientRejected:true,oldOwnershipPreserved:true,actualTownHatCape:true,metrics,externalWrites:0});console.log('COLLECTION_CASE_OK '+width+'x'+height+' '+lang);await ctx.close();
  }
  fs.writeFileSync(path.join(OUT,'collection-browser.json'),JSON.stringify({ok:true,cases:report,externalWrites:0},null,2)+'\n');console.log('COLLECTION_BROWSER_OK cases='+report.length+' newItems=51 purchases=3 actualTownHatCape=true externalWrites=0');
  }finally{await b.close();server.close();}
})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
