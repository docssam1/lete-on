"use strict";
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const crypto=require("node:crypto");
const {execFileSync}=require("node:child_process");
const {chromium}=require("playwright");
const out=process.env.HSE_SCREENSHOT_DIR;
assert(out&&/^[EG]:[/\\]/i.test(out),"Evidence must stay on E:/G:");
fs.mkdirSync(out,{recursive:true});
const assets=["source-6-2-stack-models.js","source-6-2-stack-renderer.mjs","source-6-2-stack-review.html","source-6-2-stack-review.css"];
const hashes=()=>Object.fromEntries(assets.map(n=>[n,crypto.createHash("sha256").update(fs.readFileSync(path.join(__dirname,n))).digest("hex")]));
const originalHashes=hashes();
async function pixels(page,options={}) {
  return page.evaluate(({reference,poison})=>{
    const data=window.stackReview.stack.inspect(), colors=[0xc5d9dc,0xdbe5e3,0xfafcf8,0xd2d6d5,0xe2eee8,0xe7ece8], errors=[];
    if(reference)data.cells=reference;
    function transform(m,v){return [0,1,2,3].map(r=>m[r]*v[0]+m[r+4]*v[1]+m[r+8]*v[2]+m[r+12]*v[3]);}
    function unproject(x,y,z){const a=transform(data.projectionInverse,[x,y,z,1]), b=transform(data.world,a.map(n=>n/a[3]));return b.slice(0,3).map(n=>n/b[3]);}
    function project(point){const p=transform(data.projection,transform(data.view,[...point,1]));return [(p[0]/p[3]+1)*data.width/2,(1-p[1]/p[3])*data.height/2];}
    function intersect(origin,dir,cell){
      let lo=-Infinity,hi=Infinity,face=-1;
      for(let axis=0;axis<3;axis++){
        // Exact edge rays need a floating-point tolerance, not a screen-size allowance.
        const min=cell[axis]-.5-1e-9,max=cell[axis]+.5+1e-9;
        if(Math.abs(dir[axis])<1e-10){if(origin[axis]<min||origin[axis]>max)return null;continue;}
        let a=(min-origin[axis])/dir[axis],b=(max-origin[axis])/dir[axis];
        let entryFace=axis*2+1;
        if(a>b){[a,b]=[b,a];entryFace=axis*2;}
        if(a>lo){lo=a;face=entryFace;}hi=Math.min(hi,b);
        if(lo>hi)return null;
      }
      if(hi<0)return null;
      return {t:lo,face,hit:origin.map((v,i)=>v+lo*dir[i]),cell};
    }
    const edges=[];
    for(const cell of data.cells)for(let axis=0;axis<3;axis++){
      const other=[0,1,2].filter(n=>n!==axis);
      for(const a of [-.5,.5])for(const b of [-.5,.5]){
        const p=[...cell],q=[...cell];p[axis]-=.5;q[axis]+=.5;p[other[0]]+=a;q[other[0]]+=a;p[other[1]]+=b;q[other[1]]+=b;
        edges.push({p,q,a:project(p),b:project(q)});
      }
    }
    function visibleEdgeNear(x,y){
      for(const edge of edges){
        const {a,b,p,q}=edge,dx=b[0]-a[0],dy=b[1]-a[1];
        const t=Math.max(0,Math.min(1,((x-a[0])*dx+(y-a[1])*dy)/(dx*dx+dy*dy)));
        const px=a[0]+dx*t,py=a[1]+dy*t;
        if(Math.hypot(px-x,py-y)>2)continue;
        const point=p.map((v,i)=>v+(q[i]-v)*t),origin=unproject(px/data.width*2-1,1-py/data.height*2,-1),far=unproject(px/data.width*2-1,1-py/data.height*2,1),dir=far.map((v,i)=>v-origin[i]);
        const hits=data.cells.map(cell=>intersect(origin,dir,cell)).filter(Boolean).sort((a,b)=>a.t-b.t);
        if(hits.length&&Math.hypot(...hits[0].hit.map((v,i)=>v-point[i]))<.025)return true;
      }
      return false;
    }
    function edgePixel(rgb){
      return [...colors,0xffffff].some(color=>{
        const face=[color>>16&255,color>>8&255,color&255],d=face.map(v=>v-17);
        const t=Math.max(0,Math.min(1,rgb.reduce((s,v,i)=>s+(v-17)*d[i],0)/d.reduce((s,v)=>s+v*v,0)));
        return rgb.every((v,i)=>Math.abs(v-(17+t*d[i]))<=4);
      });
    }
    let checked=0, visible=0, minX=data.width,minY=data.height,maxX=0,maxY=0;
    for(let y=0;y<data.height;y++)for(let x=0;x<data.width;x++){
      const i=(y*data.width+x)*4;
      if(data.pixels[i]<245||data.pixels[i+1]<245||data.pixels[i+2]<245){visible++;minX=Math.min(minX,x);maxX=Math.max(maxX,x);minY=Math.min(minY,y);maxY=Math.max(maxY,y);}
    }
    const seen=new Set();let poisonExercised=false;
    for(let y=3;y<data.height;y+=8)for(let x=3;x<data.width;x+=8){
      const nx=(x+.5)/data.width*2-1,ny=1-(y+.5)/data.height*2;
      const origin=unproject(nx,ny,-1),far=unproject(nx,ny,1), dir=far.map((v,i)=>v-origin[i]);
      const hits=data.cells.map(cell=>intersect(origin,dir,cell)).filter(Boolean).sort((a,b)=>a.t-b.t);
      if(!hits.length){
        const i=(y*data.width+x)*4;
        const rgb=[...data.pixels.slice(i,i+3)];
        if(rgb.some(v=>v<251)&&!(edgePixel(rgb)&&visibleEdgeNear(x+.5,y+.5)))errors.push({x,y,unexpectedForeground:true});
        continue;
      }
      const {face,hit,cell}=hits[0],axis=Math.floor(face/2);
      const expected=colors[face],rgb=[expected>>16&255,expected>>8&255,expected&255],i=(y*data.width+x)*4;
      if(poison==='red-near-edge'&&!poisonExercised&&hit.some((v,i)=>i!==axis&&Math.abs(Math.abs(v-cell[i])-.5)<.06)&&!visibleEdgeNear(x+.5,y+.5)){
        data.pixels.set([255,0,0],i);poisonExercised=true;
      }
      const actual=[...data.pixels.slice(i,i+3)];
      if(rgb.some((v,k)=>Math.abs(actual[k]-v)>3)&&!(edgePixel(actual)&&visibleEdgeNear(x+.5,y+.5)))errors.push({x,y,face,cell,hit,expected:rgb,actual});
      seen.add(cell.join(','));checked++;
    }
    const frame=document.querySelector('#scene').getBoundingClientRect(),labelErrors=[];
    for(const el of document.querySelectorAll('.source62-stack-direction')){
      const box=el.getBoundingClientRect(), style=getComputedStyle(el);
      if(box.left<frame.left||box.right>frame.right||box.top<frame.top||box.bottom>frame.bottom)labelErrors.push('Direction clipped');
      if(style.color!=='rgb(0, 0, 0)'||+style.fontWeight!==400||parseFloat(style.fontSize)<14)labelErrors.push('Direction typography');
    }
    return {errors:errors.slice(0,10),poisonExercised,labelErrors,checked,visible,seen:seen.size,cubeCount:data.cubeCount,meshCount:data.meshCount,revision:data.revision,
      margin:Math.min(minX,minY,data.width-1-maxX,data.height-1-maxY),bounds:[minX,minY,maxX,maxY],overflow:document.documentElement.scrollWidth>innerWidth+1};
  },options);
}
(async()=>{
  const browser=await chromium.launch({headless:true,executablePath:process.env.HSE_CHROMIUM_EXECUTABLE,args:["--enable-unsafe-swiftshader"]});
  const rows=[];
  try{
    for(const width of [1440,390,320])for(const source of [0,1])for(const pool of [0,1,2]){
      const page=await browser.newPage({viewport:{width,height:900}}),errors=[];
      page.on('pageerror',e=>errors.push(e.message));
      await page.goto(process.env.HSE_STACK_REVIEW_URL||'http://127.0.0.1:8897/hselementary/question-bank/source-6-2-stack-review.html');
      await page.waitForFunction(()=>window.stackReview?.ready);
      await page.selectOption('#source',String(source));await page.selectOption('#pool',String(pool));
      await page.evaluate(()=>document.fonts.ready);
      await page.waitForFunction(()=>document.querySelector('#scene').dataset.printReady==='true');
      const result=await pixels(page);
      await page.screenshot({path:path.join(out,`stack-${source}-v${pool}-${width}.png`),fullPage:true});
      assert.deepEqual(result.errors,[],`Analytic ray vs raster ${source}/${pool}/${width}`);
      assert.deepEqual(result.labelErrors,[]);
      assert(result.checked>100&&result.visible>1000&&result.margin>10&&!result.overflow,JSON.stringify(result));
      assert.equal(result.cubeCount,result.meshCount);
      if(width===1440&&source===0&&pool===0){
        const poisoned=await pixels(page,{poison:'red-near-edge'});
        assert(poisoned.poisonExercised&&poisoned.errors.length>0,'Near-edge wrong colors must not be exempt');
        const reference=await page.evaluate(()=>window.stackReview.stack.inspect().cells);
        await page.evaluate(()=>{
          const heights=window.stackReview.pool.heights.map(row=>[...row]);heights[0][0]--;
          window.stackReview.replaceHeights(heights);
        });
        assert((await pixels(page,{reference})).errors.length>0,'Normal reference must reject a cube removed from the actual GPU scene');
        await page.evaluate(()=>window.stackReview.replaceHeights(window.stackReview.pool.heights));
        assert.deepEqual((await pixels(page)).errors,[],'Restored GPU scene must pass');
      }
      const prefix=`stack-${source}-v${pool}-${width}`;
      await page.screenshot({path:path.join(out,`${prefix}.png`),fullPage:true});
      const initial=await page.evaluate(()=>Array.from(window.stackReview.stack.inspect().world));
      const box=await page.locator('#scene').boundingBox();
      await page.mouse.move(box.x+box.width*.55,box.y+box.height*.45);await page.mouse.down();
      await page.mouse.move(box.x+box.width*.8,box.y+box.height*.55,{steps:8});await page.mouse.up();
      const rotated=await page.evaluate(()=>Array.from(window.stackReview.stack.inspect().world));
      assert(initial.some((v,i)=>Math.abs(v-rotated[i])>.01),'Canvas must actually rotate');
      const after=await pixels(page);assert.deepEqual(after.errors,[]);assert.deepEqual(after.labelErrors,[]);assert(after.margin>10);
      await page.locator('#reset').click();
      const reset=await page.evaluate(()=>Array.from(window.stackReview.stack.inspect().world));
      assert(initial.every((v,i)=>Math.abs(v-reset[i])<1e-8),'Canonical camera reset');
      const final=await pixels(page);assert.deepEqual(final.errors,[]);
      if(width===1440){
        await page.emulateMedia({media:'print'});
        const file=path.join(out,`${prefix}-a4.pdf`);
        await page.pdf({path:file,format:'A4',printBackground:true,preferCSSPageSize:true});
        const pages=+execFileSync(process.env.HSE_PDFINFO_EXECUTABLE,[file],{encoding:'utf8'}).match(/^Pages:\s+(\d+)/m)[1];
        assert.equal(pages,1,'One source stack and views fit one A4');
        const print=await page.evaluate(()=>({ready:document.querySelector('#scene').dataset.printReady,img:document.querySelector('.source62-stack-print')?.naturalWidth,canvas:getComputedStyle(document.querySelector('canvas')).display}));
        assert.equal(print.ready,'true');assert(print.img>100);assert.equal(print.canvas,'none');
        await page.emulateMedia({media:'screen'});
      }
      assert.deepEqual(errors,[]);
      rows.push({source,pool,width,...result,rotated:true});
      await page.close();
    }
    const adversarial=[[[1,1]],[[1],[1]],[[3,1]],[[1],[3]],[[3,0],[1,2]],[[1,3],[2,0]],[[6,1,0],[2,0,1]]];
    const test=await browser.newPage({viewport:{width:390,height:900}});
    await test.goto(process.env.HSE_STACK_REVIEW_URL||'http://127.0.0.1:8897/hselementary/question-bank/source-6-2-stack-review.html');
    await test.waitForFunction(()=>window.stackReview?.ready);
    const regression=[];
    for(const [i,heights] of adversarial.entries()){
      await test.evaluate(h=>window.stackReview.replaceHeights(h),heights);
      const result=await pixels(test);assert.deepEqual(result.errors,[],`Adversarial occlusion ${i}`);assert.deepEqual(result.labelErrors,[]);assert(result.checked>100&&result.margin>10);
      regression.push({heights,...result});
    }
    await test.close();
    assert.deepEqual(hashes(),originalHashes,'Runtime changed during audit');
    fs.writeFileSync(path.join(out,'stack-browser-result.json'),JSON.stringify({states:rows.length,rows,regression,negativeControl:'Normal reference rejects one highest cube removed from the actual GPU scene; near-edge red pixel rejected without a broad face-edge exemption',assetHashes:originalHashes,scope:'Internal locked source-model review, not learner bank publication or difficulty approval'},null,2));
    console.log(`3D stack review: ${rows.length} states and ${regression.length} adversarial stacks; source models, analytic ray/pixel occlusion, rejection control, actual rotation/reset, desktop/mobile, six one-page A4s and asset hashes passed. Learner release is controlled separately by inventory and actual-bank audits.`);
  }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
