// Deterministic, high-resolution mathematical illustrations. No source scans or SVG assets.
const fs=require('node:fs'),path=require('node:path');
const {chromium}=require('playwright');
const {entries}=require('../challenge/exam-priority.js');
const out=path.resolve(__dirname,'../challenge/assets/priority');
(async()=>{
  fs.mkdirSync(out,{recursive:true});
  const browser=await chromium.launch({headless:true});
  try{
    const page=await browser.newPage();
    await page.setContent('<html lang="ko"><canvas></canvas></html>');
    const questions=Object.values(entries()).flatMap(rounds=>Object.values(rounds).flatMap(items=>Object.values(items)));
    for(const q of questions){
      const id=q.typeId.replace('priority-','');
      for(const answer of (q.solutionDiagram?[false,true]:[false])){
        const png=await page.evaluate(({id,p,answer})=>{
          const W=answer?240:660,H=answer?240:id==='length-units'?170:220,S=3,c=document.querySelector('canvas');c.width=W*S;c.height=H*S;
          const g=c.getContext('2d');g.scale(S,S);g.fillStyle='white';g.fillRect(0,0,W,H);
          const ink='#24455e',blue='#328cca',orange='#eb9635',teal='#348f87',lineColor='#bed0dd';
          const textBoxes=[];
          function text(t,x,y,size=17,color=ink,align='center'){
            g.fillStyle=color;g.font=`500 ${size}px "Malgun Gothic",sans-serif`;g.textAlign=align;g.textBaseline='middle';
            const m=g.measureText(String(t)),box={text:String(t),left:x-m.actualBoundingBoxLeft,right:x+m.actualBoundingBoxRight,top:y-m.actualBoundingBoxAscent,bottom:y+m.actualBoundingBoxDescent};
            if(box.left<0||box.right>W||box.top<0||box.bottom>H)throw Error('Canvas text clipped: '+t);
            for(const b of textBoxes)if(box.left<b.right&&box.right>b.left&&box.top<b.bottom&&box.bottom>b.top)throw Error('Canvas labels overlap: '+b.text+' / '+t);
            textBoxes.push(box);g.fillText(t,x,y);
          }
          function poly(points,fill,stroke=ink,width=1.5){g.beginPath();points.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.closePath();if(fill){g.fillStyle=fill;g.fill();}if(stroke){g.strokeStyle=stroke;g.lineWidth=width;g.stroke();}}
          function line(points,color=ink,width=1.5){g.beginPath();points.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.strokeStyle=color;g.lineWidth=width;g.lineCap='round';g.lineJoin='round';g.stroke();}
          function rect(x,y,w,h,fill='white',stroke=lineColor,r=0){g.beginPath();g.roundRect(x,y,w,h,r);if(fill){g.fillStyle=fill;g.fill();}if(stroke){g.strokeStyle=stroke;g.lineWidth=1.2;g.stroke();}}
          function circle(x,y,r,fill,stroke=ink,width=1.3){g.beginPath();g.arc(x,y,r,0,Math.PI*2);if(fill){g.fillStyle=fill;g.fill();}if(stroke){g.strokeStyle=stroke;g.lineWidth=width;g.stroke();}}
          function arrow(x,y,dx,dy,color=ink){line([[x,y],[x+dx,y+dy]],color,1.8);const a=Math.atan2(dy,dx);line([[x+dx-8*Math.cos(a-.5),y+dy-8*Math.sin(a-.5)],[x+dx,y+dy],[x+dx-8*Math.cos(a+.5),y+dy-8*Math.sin(a+.5)]],color,1.8);}
          // Geometry paper-fold worksheet reference: an arc crosses the crease,
          // while offset sheet outlines visibly distinguish the layered packet.
          function foldArc(from,control,to){
            g.beginPath();g.moveTo(...from);g.quadraticCurveTo(...control,...to);g.strokeStyle='#bc4e46';g.lineWidth=3;g.lineCap='round';g.stroke();
            const a=Math.atan2(to[1]-control[1],to[0]-control[0]);
            poly([to,[to[0]-12*Math.cos(a-.5),to[1]-12*Math.sin(a-.5)],[to[0]-12*Math.cos(a+.5),to[1]-12*Math.sin(a+.5)]],'#bc4e46',null);
          }
          function foldedGrid(x,y,s,cols,rows,layers){
            for(let k=layers-1;k>0;k--)rect(x+k*2.5,y+k*2.5,s*cols,s*rows,'#fff3ef','#b77870');
            grid(x,y,s,cols,rows,layers===2?'#f6cec7':'#efb4ab');
          }
          function crease(a,b){g.save();g.setLineDash([4,4]);line([a,b],'#b66b61',1.7);g.restore();}
          function grid(x,y,s,cols,rows,fill='white'){rect(x,y,s*cols,s*rows,fill,ink);for(let i=1;i<cols;i++)line([[x+i*s,y],[x+i*s,y+rows*s]],lineColor,.8);for(let j=1;j<rows;j++)line([[x,y+j*s],[x+cols*s,y+j*s]],lineColor,.8);}
          const objects=[];
          function pencil(x,y,w,color){
            objects.push({kind:'pencil-'+color,x,y,w});
            const h=20,tip=19;
            const grad=g.createLinearGradient(0,y,0,y+h);grad.addColorStop(0,color);grad.addColorStop(.35,'#d0e3ed');grad.addColorStop(.47,color);grad.addColorStop(1,color);
            rect(x,y,w-tip,h,grad,'#54768a',3);poly([[x+w-tip,y],[x+w,y+h/2],[x+w-tip,y+h]],'#e6c394','#b28a64',.8);
            poly([[x+w-7,y+h/2-3.4],[x+w,y+h/2],[x+w-7,y+h/2+3.4]],'#4d565e',null);line([[x+6,y+5],[x+w-tip-5,y+5]],'rgba(255,255,255,.5)',1);line([[x+3,y+h-4],[x+w-tip-3,y+h-4]],'rgba(0,0,0,.1)',1);
            rect(x,y,8,h,'#e9aba7','#a99b93',3);rect(x+8,y,7,h,'#b9c5ce','#7f8b94',1);
          }
          function crayon(x,y,w){
            objects.push({kind:'crayon',x,y,w});const tip=17,h=23;
            const grad=g.createLinearGradient(0,y,0,y+h);grad.addColorStop(0,'#e9b774');grad.addColorStop(.45,'#f7d5a6');grad.addColorStop(1,'#cd8441');
            rect(x,y,w-tip,h,grad,'#b27c4c',4);poly([[x+w-tip,y],[x+w,y+h/2],[x+w-tip,y+h]],'#d88b46','#af723b',1);
            rect(x+10,y+1,w-tip-19,h-2,'#f8ebd5',null,1);rect(x+13,y+1,3,h-2,'#d3a977',null);rect(x+w-tip-15,y+1,3,h-2,'#d3a977',null);
            g.fillStyle='#df9e5d';g.beginPath();g.ellipse(x+(w-tip)/2,y+h/2,(w-tip)*.19,5,0,0,Math.PI*2);g.fill();
          }
          function nail(x,y,w){
            objects.push({kind:'nail',x,y,w});poly([[x,y+9],[x+7,y+5],[x+w-5,y+5],[x+w-5,y+13],[x+7,y+13]],'#a6b0b7','#667783',1);
            for(let k=9;k<w-7;k+=4)line([[x+k-2,y+4],[x+k+2,y+14]],'#667783',1.2);
            rect(x+w-5,y,5,18,'#d5dce1','#667783',1);line([[x+w-3,y+4],[x+w-3,y+14]],'#81909a',.8);
          }
          function eraser(x,y,w){
            objects.push({kind:'eraser',x,y,w});
            const grad=g.createLinearGradient(x,y,x,y+23);grad.addColorStop(0,'#fff7ed');grad.addColorStop(1,'#e3d4c0');rect(x,y,w,23,grad,'#ac9b86',4);
            rect(x+w*.2,y+1,w*.58,21,'#f0b8b7',null,1);line([[x+w*.2,y+1],[x+w*.2,y+22]],'#c58e8d',.8);line([[x+w*.78,y+1],[x+w*.78,y+22]],'#c58e8d',.8);line([[x+5,y+4],[x+w-5,y+4]],'#fff9f3',1.1);
          }
          function clip(x,y,w){
            objects.push({kind:'clip',x,y,w});
            // The outermost curved endpoints are exactly x and x+w.
            g.beginPath();g.roundRect(x+1,y+1,w-2,14,7);g.strokeStyle='#5a8098';g.lineWidth=2;g.stroke();
            g.beginPath();g.moveTo(x+w*.28,y+5);g.lineTo(x+w-10,y+5);g.bezierCurveTo(x+w-3,y+5,x+w-3,y+11,x+w-10,y+11);g.lineTo(x+11,y+11);g.strokeStyle='#7796ac';g.lineWidth=1.7;g.stroke();
          }
          function guides(x,y,w,h){g.save();g.setLineDash([3,3]);line([[x,y],[x,y+h]],'#9db0bd',1);line([[x+w,y],[x+w,y+h]],'#9db0bd',1);g.restore();}
          if(id==='length-units'){
            const u=60,x=90,total=p.pencilUnits+p.topLeft+p.topRight;
            guides(x,36,total*u,106);
            for(let i=0;i<p.topLeft;i++)clip(x+i*u,55,u);
            pencil(x+p.topLeft*u,52,p.pencilUnits*u,'#e9ba46');
            for(let i=0;i<p.topRight;i++)clip(x+(p.topLeft+p.pencilUnits+i)*u,55,u);
            for(let i=0;i<p.bottomLeft;i++)clip(x+i*u,112,u);
            crayon(x+p.bottomLeft*u,107,p.crayonUnits*u);
            for(let i=0;i<p.bottomRight;i++)clip(x+(p.bottomLeft+p.crayonUnits+i)*u,112,u);
          }else if(id==='diagonal-length'){
            p.paths.forEach((points,i)=>{const x=17+i*218,y=65,s=23;grid(x,y,s,p.columns,p.rows);text(p.labels[i],x+92,30,22,[blue,orange,teal][i]);line(points.map(([a,b])=>[x+a*s,y+b*s]),[blue,orange,teal][i],4);points.filter((_,j)=>j===0||j===points.length-1).forEach(([a,b])=>circle(x+a*s,y+b*s,3.2,[blue,orange,teal][i],null));});
          }else if(id==='route-count'){
            const ox=170,oy=175,sx=105,sy=65;
            for(let y=0;y<=p.rows;y++)line([[ox,oy-y*sy],[ox+p.columns*sx,oy-y*sy]],'#5485a6',4);
            for(let x=0;x<=p.columns;x++)line([[ox+x*sx,oy],[ox+x*sx,oy-p.rows*sy]],'#5485a6',4);
            for(let y=0;y<=p.rows;y++)for(let x=0;x<=p.columns;x++)circle(ox+x*sx,oy-y*sy,4,'white','#5485a6',2);
            const bx=ox+2.5*sx,by=oy-sy;rect(bx-15,by-16,30,32,'white',null);line([[bx-9,by-9],[bx+9,by+9]],'#cb5160',4);line([[bx-9,by+9],[bx+9,by-9]],'#cb5160',4);
            text('★',ox+sx,oy-sy,28,orange);circle(ox,oy,6,blue,null);circle(ox+3*sx,oy-2*sy,6,teal,null);text('출발',ox-42,oy,18);text('도착',ox+3*sx+42,oy-2*sy,18);
          }else if(id==='card-rank'){
            p.cards.forEach((n,i)=>{const x=90+i*125;rect(x+3,62,100,110,'#dce8ee',null,10);const grad=g.createLinearGradient(x,56,x,166);grad.addColorStop(0,'#fbfdff');grad.addColorStop(1,'#edf5fb');rect(x,56,100,110,grad,'#709cb9',10);text(n,x+50,111,43,ink);});
          }else if(id==='fold-holes'){
            if(answer){grid(20,20,50,4,4);[1,2,13,14].forEach(k=>circle(45+k%4*50,45+Math.floor(k/4)*50,13,null,'#cc5a7b',3));}
            else{
              const sx=[12,174,336,508],y=43,s=32;
              grid(sx[0],y,s,4,4,'#fce8e3');crease([sx[0]+64,y],[sx[0]+64,y+128]);text('처음',sx[0]+64,194,16);
              foldedGrid(sx[1]+2*s,y,s,2,4,2);crease([sx[1]+64,y+64],[sx[1]+128,y+64]);text('한 번 접은 뒤',sx[1]+64,194,14);
              foldedGrid(sx[2]+2*s,y+2*s,s,2,2,4);circle(sx[2]+(p.hole[0]+.5)*s,y+(p.hole[1]+.5)*s,6,'white','#a33e61',1.8);text('두 번 접고 뚫기',sx[2]+64,194,14);
              grid(sx[3],y,s,4,4);text('모두 펼친 모습',sx[3]+64,194,15);
              foldArc([sx[0]+32,y+64],[sx[0]+64,y-2],[sx[0]+96,y+64]);
              foldArc([sx[1]+96,y+32],[sx[1]+52,y+64],[sx[1]+96,y+96]);
              arrow(148,105,17,0,'#9aa9b3');arrow(314,105,17,0,'#9aa9b3');arrow(481,105,20,0,'#9aa9b3');
            }
          }else if(id==='cube-top-view'){
            function top(x,y,s,filled,label){grid(x,y,s,3,3);filled.forEach(i=>rect(x+i%3*s,y+Math.floor(i/3)*s,s,s,'#8fbee0','#5a8eaf'));text('앞',x+s*1.5,y+s*3+15,13);if(label)text(label,x+s*1.5,y-15,18);}
            if(answer){top(45,28,50,p.heights.flatMap((row,y)=>row.flatMap((h,x)=>h?[y*3+x]:[])),'');}
            else{
              // Orthographic isometric projection, uniform cube edges and visible top faces.
              const project=(x,y,z)=>[145+(x-y)*31,92+(x+y)*15.5-z*31];
              for(let y=0;y<3;y++)for(let x=0;x<3;x++)poly([[x,y,0],[x+1,y,0],[x+1,y+1,0],[x,y+1,0]].map(a=>project(...a)),'#f5f9fc','#b9ccd8',.8);
              const cubes=[];p.heights.forEach((row,y)=>row.forEach((h,x)=>{for(let z=0;z<h;z++)cubes.push([x,y,z]);}));cubes.sort((a,b)=>a[0]+a[1]-b[0]-b[1]||a[2]-b[2]);
              cubes.forEach(([x,y,z])=>{
                poly([[x+1,y,z],[x+1,y+1,z],[x+1,y+1,z+1],[x+1,y,z+1]].map(a=>project(...a)),'#6c9fc8','#416d91',1.2);
                poly([[x,y+1,z],[x+1,y+1,z],[x+1,y+1,z+1],[x,y+1,z+1]].map(a=>project(...a)),'#92bddd','#416d91',1.2);
                poly([[x,y,z+1],[x+1,y,z+1],[x+1,y+1,z+1],[x,y+1,z+1]].map(a=>project(...a)),'#d2e6f4','#416d91',1.2);
              });
              p.heights.forEach((row,y)=>row.forEach((h,x)=>{if(!h)return;const [u,v]=project(x+.5,y+.5,h),pixel=g.getImageData(Math.round(u*S),Math.round(v*S),1,1).data;if(pixel[0]!==210||pixel[1]!==230||pixel[2]!==244)throw Error('Required top face occluded: '+[x,y]);}));
              const [fx,fy]=project(1.5,3.5,0);text('앞',fx,fy+4,16);arrow(fx,fy-10,14,-7,ink);
              text('보기',449,15,17);p.options.forEach((cells,i)=>top(286+i*92,69,26,cells,['①','②','③','④'][i]));
            }
          }
          if(id==='length-units'){
            const sizes={};for(const o of objects){if(sizes[o.kind]&&sizes[o.kind]!==o.w)throw Error('Inconsistent object scale: '+o.kind);sizes[o.kind]=o.w;}
            const pencilW=sizes['pencil-#e9ba46'],crayonW=sizes.crayon;
            if(pencilW+(p.topLeft+p.topRight)*sizes.clip!==crayonW+(p.bottomLeft+p.bottomRight)*sizes.clip)throw Error('Mixed-row endpoints do not match givens');
            if(objects.some(o=>o.kind==='eraser'))throw Error('Old eraser conversion diagram retained');
          }
          return c.toDataURL('image/png').split(',')[1];
        },{id,p:q.payload,answer});
        fs.writeFileSync(path.join(out,id+(answer?'-answer':'')+'.png'),Buffer.from(png,'base64'));
      }
    }
    console.log(JSON.stringify({assets:fs.readdirSync(out).filter(n=>n.endsWith('.png')),scale:3}));
  }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
