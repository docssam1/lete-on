// 주간 학습지 → 구조 자료(JSON) + 브라우저 PDF. node extract2.js <과정 C번호> <k> <출력 폴더>
// 인쇄 폭(190mm = 718px)으로 그려서 칸 위치를 mm 로 잰다(@page margin 10mm).
const fs=require('fs'),path=require('path'),http=require('http');
const {chromium}=require('../../scripts/lib/playwright');
const ROOT=path.resolve(__dirname,'../../..');
const [course,k,outDir]=process.argv.slice(2);
fs.mkdirSync(outDir,{recursive:true});
const srv=http.createServer((q,r)=>{const f=path.join(ROOT,decodeURIComponent(q.url.split('?')[0]));if(!fs.existsSync(f)||!fs.statSync(f).isFile()){r.writeHead(404);return r.end();}
 r.setHeader('Content-Type',{'.js':'application/javascript','.css':'text/css','.html':'text/html','.woff2':'font/woff2','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.json':'application/json'}[path.extname(f)]||'application/octet-stream');r.end(fs.readFileSync(f));});
(async()=>{await new Promise(r=>srv.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+srv.address().port+'/number_magic/';
 const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:718,height:1100}});
 await ctx.route('**/*',r=>r.request().url().startsWith('http://127.0.0.1')?r.continue():r.abort());
 const p=await ctx.newPage();
 await p.goto(base+`ws.html?w=2026-W39&c=${course}&n=check&k=${k}&cad=w2&auto=0`);
 await p.waitForFunction(()=>window.NM_WS_READY,{timeout:60000});
 await p.emulateMedia({media:'print'});
 await p.waitForTimeout(300);
 const data=await p.evaluate(()=>{
  const MM=25.4/96, M=10;
  const T=e=>e?(e.innerText||'').replace(/\s+/g,' ').trim():'';
  const flat=el=>{const c=el.cloneNode(true);
    c.querySelectorAll('.katex-display,.katex').forEach(k=>{const a=k.querySelector('annotation');k.replaceWith(document.createTextNode(a?'⟦'+a.textContent+'⟧':k.textContent));});
    c.querySelectorAll('svg,img').forEach(s=>s.remove());
    return c.textContent.replace(/\s+/g,' ').trim();};
  const svgs=[];const keepSvg=s=>{let x=s.outerHTML;if(!/xmlns=/.test(x.slice(0,300)))x=x.replace('<svg','<svg xmlns="http://www.w3.org/2000/svg"');svgs.push(x);return svgs.length-1;};
  const sheet=document.querySelector('.nm-print-sheet');
  const tops=[...sheet.children].flatMap(e=>e.matches('.nm-draw-answer-key')?[...e.children].filter(c=>c.matches('.nm-w2-page')):[e]).filter(e=>e.matches('.nm-print-cover,.nm-w2-page'));
  const rectIn=(el,pg)=>{const r=el.getBoundingClientRect(),q=pg.getBoundingClientRect();return [ (r.left-q.left)*MM+M, (r.top-q.top)*MM+M, r.width*MM, r.height*MM ];};
  const union=(els,pg)=>{const rs=els.map(e=>e.getBoundingClientRect()).filter(r=>r.width&&r.height);if(!rs.length)return null;
    const q=pg.getBoundingClientRect();const l=Math.min(...rs.map(r=>r.left)),t=Math.min(...rs.map(r=>r.top)),R=Math.max(...rs.map(r=>r.right)),B=Math.max(...rs.map(r=>r.bottom));
    return [(l-q.left)*MM+M,(t-q.top)*MM+M,(R-l)*MM,(B-t)*MM];};
  const rich=el=>[...el.querySelectorAll('svg,img,canvas,table,.nm-print-vp,.nm-nl,.nm-teach-graph,.nm-pe-panels')].some(e=>!e.matches('.nm-w2-board-mascot'));
  const out={tops:[],cvw:null,pages:[]};
  tops.forEach((pg,ti)=>{
   if(pg.matches('.nm-cvw')){
     const qr=pg.querySelector('svg');
     out.cvw={ti,kicker:T(pg.querySelector('.nm-cv-kicker')),title:T(pg.querySelector('.nm-cvw-title')),tagline:T(pg.querySelector('.nm-cvw-tagline')),
       course:T(pg.querySelector('.nm-cvw-course')),mentorImg:(pg.querySelector('.nm-series-mentor img')||{}).getAttribute?.('src')||'',
       mentorTitle:T(pg.querySelector('.nm-series-mentor b')),mentorText:T(pg.querySelector('.nm-series-mentor p')),daily:T(pg.querySelector('.nm-cvw-daily')),
       rows:[...pg.querySelectorAll('.nm-cvw-toc tbody tr')].map(tr=>[...tr.children].map(T)),
       qr:qr?keepSvg(qr):null,
       bottom:[...pg.querySelectorAll('*')].filter(e=>!e.children.length&&T(e)&&!e.closest('.nm-cvw-toc,.nm-cvw-hero,.nm-series-mentor,.nm-cv-brand')).map(T)};
     out.tops.push({kind:'cvw'});return;}
   if(pg.matches('.nm-print-cover')){out.tops.push({kind:'cover'});return;}
   const cls=pg.className.replace(/\bnm-w2-page\b/,'').replace(/nm-print-age-\S+/g,'').trim();
   const answer=pg.matches('.nm-print-answer-key');
   const learn=!answer&&(!cls||/^nm-mid-six$/.test(cls));
   const P={ti,cls,kind:answer?'answer':learn?'learn':'embed',parts:[]};
   const foot=pg.querySelector('.nm-w2-foot');P.foot={pg:T(foot&&foot.querySelector('.nm-w2-pg')),code:T(foot&&foot.querySelector('.nm-w2-foot-code'))};
   const head=pg.querySelector('.nm-w2-head');
   if(head)P.head={first:!!head.querySelector('.nm-w2-blank'),total:head.querySelector('.nm-w2-blank')?((T(head).match(/점수\s*:?\s*\/\s*(\d+)/)||[])[1]||''):'',code:T(head.querySelector('.nm-w2-head-code')),
     day:T(head.querySelector('.nm-w2-study-day')),no:T(head.querySelector('.nm-w2-head-no')),title:T(head.querySelector('.nm-w2-head-mid')).replace(/^\d+일차(–\d+일차)?\s*/,''),
     name:T(head.querySelector('.nm-w2-head-top b'))};
   if(answer){
     P.title=T(head);
     [...pg.children].filter(e=>e.matches('.nm-ak-section')).forEach(sec=>{
       const S={t:'ak',title:T(sec.querySelector('.nm-ak-subhead'))||'',guide:[],items:[],tips:[...sec.querySelectorAll('.nm-w2-concept-tip p')].map(flat)};
       if(rich(sec)&&sec.matches('.nm-lt-answer-key')){S.clip=rectIn(sec,pg);P.parts.push(S);return;}
       S.guide=[...sec.querySelectorAll('.nm-ak-guide-item')].map(flat);
       const groups=[...sec.querySelectorAll('.nm-ak-page')];
       const mk=it=>{const I={text:flat(it),chain:it.matches('.nm-ak-item-chain')};if(rich(it))I.clip=rectIn(it,pg);return I;};
       if(groups.length){groups.forEach(gp=>{const lb=T(gp.querySelector('.nm-ak-pg'));if(lb)S.items.push({pgLabel:lb});gp.querySelectorAll('.nm-ak-item').forEach(it=>S.items.push(mk(it)));});}
       else sec.querySelectorAll('.nm-ak-item').forEach(it=>S.items.push(mk(it)));
       if(!S.items.length&&!S.guide.length){S.raw=[...sec.children].filter(e=>!e.matches('.nm-ak-subhead')).map(flat).filter(Boolean);}
       P.parts.push(S);});
     out.pages.push(P);out.tops.push({kind:'page',pi:out.pages.length-1});return;}
   if(learn){
     [...pg.children].forEach(ch=>{
       const c=(ch.className||'').toString();
       if(/nm-w2-(wm|head|foot)\b/.test(c))return;
       if(/nm-w2-concept/.test(c)){
         const body=ch.querySelector('.nm-w2-board-body');
         const plain=body&&[...ch.children].every(e=>e.matches('.nm-w2-board,.nm-w2-concept-ramp'))&&[...body.children].every(e=>e.matches('.nm-mn-kicker,.nm-w2-concept-sentence'))&&!/nm-mid-concept|nm-w2-function-concept|nm-level-only-concept/.test(c);
         if(!plain)return P.parts.push({t:'clip',r:rectIn(ch,pg)});
       }
       if(/nm-w2-concept/.test(c))return P.parts.push(rich(ch)?{t:'clip',r:rectIn(ch,pg)}:{t:'concept',kicker:T(ch.querySelector('.nm-mn-kicker')),text:flat(ch.querySelector('.nm-w2-concept-sentence')||ch),ramp:T(ch.querySelector('.nm-w2-concept-ramp'))});
       if(/nm-w2-example/.test(c))return P.parts.push(rich(ch)?{t:'clip',r:rectIn(ch,pg)}:{t:'example',text:flat(ch)});
       if(/nm-w2-guide/.test(c)){
         if(rich(ch))return P.parts.push({t:'clip',r:rectIn(ch,pg)});
         return P.parts.push({t:'guide',title:T(ch.querySelector('.nm-w2-guide-title')),items:[...ch.querySelectorAll('.nm-w2-guide-item')].map(g=>({lab:T(g.querySelector('.nm-w2-guide-label')).replace(/[()]/g,''),text:flat(g).replace(/^\([^)]*\)\s*/,'')}))});}
       if(/nm-w2-instr/.test(c))return P.parts.push({t:'instr',text:T(ch)});
       if(/nm-w2-train-banner/.test(c))return P.parts.push({t:'banner'});
       if(/nm-w2-retry/.test(c)){const s=ch.querySelector('svg');return P.parts.push({t:'retry',qr:s?keepSvg(s):null});}
       if(/nm-w2-grid/.test(c)){
         const kind=(c.match(/nm-w2-grid-(\w+)/)||[])[1]||'';
         const items=[...ch.children].filter(e=>e.matches('.nm-w2-item'));
         const xs=[...new Set(items.map(e=>Math.round(e.getBoundingClientRect().left)))].sort((a,b)=>a-b);
         const ys=[...new Set(items.map(e=>Math.round(e.getBoundingClientRect().top)))].sort((a,b)=>a-b);
         const near=(arr,v)=>arr.findIndex(a=>Math.abs(a-v)<4);
         const G={t:'grid',kind,cols:xs.length,rows:ys.length,items:[]};
         items.forEach(it=>{const r=it.getBoundingClientRect();
           const no=T(it.querySelector('.nm-w2-num')).replace(/[()]/g,'');
           const I={no,challenge:/도전/.test(T(it.querySelector('.nm-w2-numrow'))),col:near(xs,Math.round(r.left)),row:near(ys,Math.round(r.top))};
           if(rich(it)&&kind!=='word'){const body=[...it.children].filter(e=>!e.matches('.nm-w2-numrow'));I.clip=union(body,pg);}
           else I.text=flat(it).replace(/^\(\d+\)\s*(여기부터 도전)?\s*/,'');
           G.items.push(I);});
         if(kind!=='word'&&G.items.some(i=>i.clip))return P.parts.push({t:'clip',fit:1,r:rectIn(ch,pg)});
         return P.parts.push(G);}
       if(T(ch)||ch.querySelector('svg,img'))P.parts.push({t:'clip',r:rectIn(ch,pg)});
     });
   }
   out.pages.push(P);out.tops.push({kind:'page',pi:out.pages.length-1});
  });
  out.svgs=svgs;return out;});
 data.svgs.forEach((s,i)=>fs.writeFileSync(path.join(outDir,`svg-${i}.svg`),s));delete data.svgs;
 await p.pdf({path:path.join(outDir,'src.pdf'),format:'A4',printBackground:true,preferCSSPageSize:true});
 fs.writeFileSync(path.join(outDir,'data.json'),JSON.stringify(data,null,1));
 await b.close();srv.close();
 console.log(course,'k'+k,'tops',data.tops.length,'learn',data.pages.filter(p=>p.kind==='learn').length,'embed',data.pages.filter(p=>p.kind==='embed').length,'answer',data.pages.filter(p=>p.kind==='answer').length);
})();
