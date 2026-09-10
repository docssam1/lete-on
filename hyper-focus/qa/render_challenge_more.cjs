const fs=require('node:fs'),path=require('node:path'),{chromium}=require('playwright');
const {all}=require('../challenge/exam-more.js'),{tileBases,tileSolutions}=require('./challenge-more-solvers.cjs');
const out=path.resolve(__dirname,'../challenge/assets/more');fs.mkdirSync(out,{recursive:true});
async function draw({v,answer,bases,tileParts}){
 const canvas=document.createElement('canvas');canvas.width=1980;canvas.height=660;
 const c=canvas.getContext('2d');c.scale(3,3);c.fillStyle='#ffffff';c.fillRect(0,0,660,220);
 const ink='#24475d',blue='#2788c4',green='#58a76a',red='#db6964',yellow='#efba35',purple='#9573bd';
 const colors=[green,blue,yellow,purple,red];const bounds=[];
 const line=(ps,color=ink,width=1.3,dash=[])=>{c.beginPath();c.strokeStyle=color;c.lineWidth=width;c.lineJoin='round';c.lineCap='round';c.setLineDash(dash);ps.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.stroke();c.setLineDash([]);};
 const poly=(ps,fill,stroke=ink)=>{c.beginPath();ps.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fillStyle=fill;c.fill();c.strokeStyle=stroke;c.lineWidth=1.2;c.stroke();};
 const rect=(x,y,w,h,fill='#ffffff',stroke='#87a6b7')=>{c.fillStyle=fill;c.fillRect(x,y,w,h);c.strokeStyle=stroke;c.lineWidth=1.2;c.strokeRect(x,y,w,h);};
 const text=(s,x,y,size=21,color=ink)=>{c.font=`600 ${size}px "Malgun Gothic",sans-serif`;c.textAlign='center';c.textBaseline='middle';c.fillStyle=color;const m=c.measureText(String(s));if(x-m.width/2<0||x+m.width/2>660||y-size/2<0||y+size/2>220)throw Error('Clipped label '+s);c.fillText(String(s),x,y);bounds.push({s,x,y});};
 const circle=(x,y,r,fill,stroke=ink)=>{c.beginPath();c.arc(x,y,r,0,Math.PI*2);c.fillStyle=fill;c.fill();c.lineWidth=1;c.strokeStyle=stroke;c.stroke();};
 const arrow=(x,y,u,w)=>{line([[x,y],[u,w]],blue,2.6);const a=Math.atan2(w-y,u-x);poly([[u,w],[u-9*Math.cos(a-.45),w-9*Math.sin(a-.45)],[u-9*Math.cos(a+.45),w-9*Math.sin(a+.45)]],blue,blue);};
 const pips=(n,x,y,w,h)=>{if(n===null){rect(x+w*.2,y+h*.2,w*.6,h*.6,'#fff');return;}const pts={1:[[.5,.5]],2:[[.25,.25],[.75,.75]],3:[[.25,.25],[.5,.5],[.75,.75]],4:[[.25,.25],[.75,.25],[.25,.75],[.75,.75]],5:[[.25,.25],[.75,.25],[.5,.5],[.25,.75],[.75,.75]],6:[[.25,.22],[.75,.22],[.25,.5],[.75,.5],[.25,.78],[.75,.78]]}[n];if(!pts){text(n,x+w/2,y+h/2,22);return;}pts.forEach(([a,b])=>circle(x+a*w,y+b*h,3.6,ink,ink));};
 const shape=(name,x,y,r=14)=>{if(['●','동그라미'].includes(name))circle(x,y,r,blue,blue);else if(['▲','세모'].includes(name))poly([[x,y-r],[x-r,y+r],[x+r,y+r]],green,green);else if(['네모','■'].includes(name))rect(x-r,y-r,r*2,r*2,red,red);else if(['별','★'].includes(name))poly(Array.from({length:10},(_,i)=>{const a=-Math.PI/2+i*Math.PI/5,z=i%2?r*.44:r;return[x+z*Math.cos(a),y+z*Math.sin(a)];}),yellow,'#b58327');else text(name,x,y,21);};
 const drawCells=(ps,x,y,u,fill)=>ps.forEach(([a,b])=>rect(x+a*u,y+b*u,u,u,fill));
 const faceMark=(label,ps)=>{if(typeof label!=='number'){c.save();c.transform((ps[1][0]-ps[0][0])/60,(ps[1][1]-ps[0][1])/60,(ps[3][0]-ps[0][0])/60,(ps[3][1]-ps[0][1])/60,ps[0][0],ps[0][1]);shape(label,30,30,12);c.restore();return;}const coords={1:[[.5,.5]],2:[[.28,.28],[.72,.72]],3:[[.25,.25],[.5,.5],[.75,.75]],4:[[.25,.25],[.75,.25],[.25,.75],[.75,.75]],5:[[.25,.25],[.75,.25],[.5,.5],[.25,.75],[.75,.75]],6:[[.25,.22],[.75,.22],[.25,.5],[.75,.5],[.25,.78],[.75,.78]]}[label];for(const [a,b] of coords){const x=ps[0][0]*(1-a)*(1-b)+ps[1][0]*a*(1-b)+ps[2][0]*a*b+ps[3][0]*(1-a)*b;const y=ps[0][1]*(1-a)*(1-b)+ps[1][1]*a*(1-b)+ps[2][1]*a*b+ps[3][1]*(1-a)*b;circle(x,y,3.4,ink,ink);}};
 const box=(x,y,w,h,depth,labels)=>{const top=[[x,y],[x+depth,y-depth*.66],[x+w+depth,y-depth*.66],[x+w,y]],front=[[x,y],[x+w,y],[x+w,y+h],[x,y+h]],right=[[x+w,y],[x+w+depth,y-depth*.66],[x+w+depth,y+h-depth*.66],[x+w,y+h]];poly(top,'#edf6fb');poly(right,'#cbdfea');poly(front,'#f9fcfe');faceMark(labels[0],front);faceMark(labels[1],top);faceMark(labels[2],right);};
 if(v.kind==='card-boxes'){
  v.cards.forEach((n,i)=>{rect(94+i*59,13,42,37,'#f3f7fb');text(n,115+i*59,32,22);});
  const groups=answer?v.answer:v.anchors;
  groups.forEach((a,i)=>{const x=21+i*218;rect(x,81,200,119,'#fff','#7897aa');text(['가','나','다'][i]+'  (합 '+v.totals[i]+')',x+100,103,18);a.forEach((n,j)=>{const w=43,gap=10,start=x+(200-a.length*w-(a.length-1)*gap)/2;rect(start+j*(w+gap),131,w,45,'#fff');if(n!==null)text(n,start+j*(w+gap)+w/2,154,23);});});
 }else if(v.kind==='cards'){
  const rows=v.rows,dy=rows.length>1?67:70;rows.forEach((row,j)=>{const gap=12,w=Math.min(580/row.length-gap,rows.length===1&&row.length===1?560:190),all=row.length*w+(row.length-1)*gap,x=(660-all)/2,y=(220-rows.length*dy)/2+j*dy;row.forEach((s,i)=>{rect(x+i*(w+gap),y,w,49,'#f6fafc','#a8c1d1');text(s,x+i*(w+gap)+w/2,y+25,typeof s==='number'?26:row.length>2?18:24);});});
 }else if(v.kind==='net'){
  const labels=answer?v.answer:v.labels,cells=[[0,1],[1,1],[2,1],[3,1],[1,0],[1,2]],u=57,x=216,y=23;
  labels.forEach((s,i)=>{const [a,b]=cells[i],fills={'파랑':'#dceef9','빨강':'#f8dfdc','노랑':'#fff3c4'};rect(x+a*u,y+b*u,u,u,fills[s]||'#fff');if(/^[1-6]$/.test(String(s)))pips(Number(s),x+a*u,y+b*u,u,u);else text(s,x+a*u+u/2,y+b*u+u/2,21);});
 }else if(v.kind==='groups'){
  v.counts.forEach((n,i)=>{const x=95+i*105,y=170;for(let j=0;j<n;j++)circle(x,y-j*27,10,v.colors[i%2],v.colors[i%2]);text(i+1+'번째',x,201,16);});text('…',610,113,29);
 }else if(v.kind==='beads'){
  v.colors.forEach((color,i)=>circle(45+i*46,108,15,color==='W'?'#ffffff':blue,color==='W'?'#687f91':blue));text('…',620,108,27);
 }else if(v.kind==='domino'){
  const n=v.pairs.length,u=n>4?45:54,gap=18,total=n*u*2+(n-1)*gap,x=(660-total)/2;
  v.pairs.forEach((p,i)=>{rect(x+i*(u*2+gap),77,u*2,u,'#fff1d8','#cfa563');line([[x+i*(u*2+gap)+u,77],[x+i*(u*2+gap)+u,77+u]],'#cfa563');p.forEach((n,j)=>pips(n,x+i*(u*2+gap)+j*u,77,u,u));});
 }else if(v.kind==='grid'){
  const u=48,x=(660-v.w*u)/2,y=(220-v.h*u)/2;
  for(let a=0;a<v.w;a++)for(let b=0;b<v.h;b++)rect(x+a*u,y+b*u,u,u,'#fff','#98abb7');
  const point=n=>[x+(n%v.w+.5)*u,y+(Math.floor(n/v.w)+.5)*u];
  if(answer)v.answer.forEach((p,i)=>line(p.map(point),[blue,green,red][i%3],4));
  Object.entries(v.labels).forEach(([n,s])=>{const [a,b]=point(Number(n));circle(a,b,17,'#fff','#fff');shape(s,a,b,11);});
 }else if(v.kind==='routes'){
  const u=32,y=57;v.paths.forEach((ps,i)=>{const x=55+i*208;for(let j=0;j<=v.size;j++){line([[x+j*u,y],[x+j*u,y+v.size*u]],'#d1dce2',.8);line([[x,y+j*u],[x+v.size*u,y+j*u]],'#d1dce2',.8);}text(['가','나','다'][i],x+u*2,30,23);line(ps.map(([a,b])=>[x+a*u,y+b*u]),colors[i],3.4);circle(x+ps[0][0]*u,y+ps[0][1]*u,3,colors[i],colors[i]);});
 }else if(v.kind==='tiles'){
  const u=29,x=275,y=9;drawCells(v.target,x,y,u,'#fff');if(answer){tileParts.forEach((p,i)=>drawCells(p,x,y,u,[green,blue][i]));}else{bases.forEach((p,i)=>{const x=52+i*124,y=146;drawCells(p,x,y,17,colors[i]);text(['①','②','③','④','⑤'][i],x+25,207,18);});}
 }else if(v.kind==='die'){
  box(76,80,66,64,32,[v.front,v.top,v.right]);text('처음 모습',122,177,18);
  const u=53,x=330,y=v.moves.includes('D')?100:113,points=[[0,0]];v.moves.forEach(m=>{const [a,b]=points.at(-1);points.push([a+(m==='R'?1:m==='L'?-1:0),b+(m==='D'?1:m==='U'?-1:0)]);});
  const set=new Set;for(const [a,b] of points){const k=a+','+b;if(!set.has(k)){rect(x+a*u,y+b*u,u,u,'#f7fbfd');set.add(k);}}
  points.slice(1).forEach(([a,b],i)=>{const [p,q]=points[i];const offset=v.moves.length===2&&v.moves[1]==='L'?(i===0?-8:8):0;arrow(x+(p+.5)*u,y+(q+.5)*u+offset,x+(a+.5)*u,y+(b+.5)*u+offset);});
  text('출발',x+u/2,y+u+22,17);const [a,b]=points.at(-1);if(a||b){if(b>0)text('도착',x+(a+1)*u+27,y+(b+.5)*u,17);else text('도착',x+(a+.5)*u,y+b*u-17,17);}text('종이 위쪽',550,25,16);arrow(622,52,622,15);
 }else if(v.kind==='boxes'){
  v.views.forEach((labels,i)=>box(115+i*315,i?65:81,i?77:107,i?107:77,45,labels));
 }else if(v.kind==='tree'){
  const pts=[[330,33],[215,92],[418,92],[357,180],[504,180]],edges=[[0,1],[0,2],[2,3],[2,4]];edges.forEach(([a,b])=>line([pts[a],pts[b]],'#9ab7c7'));pts.forEach(([x,y],i)=>{circle(x,y,26,'#eff6fb','#8caebe');text(v.values[i],x,y,24);});
 }else if(v.kind==='partition'){
  const u=27,x=235,y=24;drawCells(v.cells,x,y,u,'#fff');
  if(answer)v.answer.forEach((part,i)=>drawCells(part,x,y,u,[green,blue,yellow][i]));
 }else if(v.kind==='circle-seats'){
  circle(330,115,49,'#f1f7fc','#8ba9bb');
  [[330,38],[410,115],[330,192],[250,115]].forEach(([x,y],i)=>{rect(x-32,y-18,64,36,'#fff');if(i===0)text(v.label,x,y,18);});
  const ps=Array.from({length:18},(_,i)=>{const a=-1.2+i*.05;return[330+102*Math.cos(a),115+102*Math.sin(a)];});line(ps,blue,2);arrow(...ps.at(-2),...ps.at(-1));text('시계 방향',487,61,17);
 }else if(v.kind==='pattern'||v.kind==='pattern-assembly'){
  const x=135,y=105,r=60,vertices=Array.from({length:6},(_,i)=>[x+r*Math.cos(i*Math.PI/3),y+r*Math.sin(i*Math.PI/3)]);poly(vertices,'#fff');vertices.forEach(p=>line([[x,y],p],'#b5c1c7',1,[3,3]));
  const tris=(cx,cy,indices,color)=>{const vs=Array.from({length:6},(_,i)=>[cx+r*Math.cos(i*Math.PI/3),cy+r*Math.sin(i*Math.PI/3)]);poly([[cx,cy],...indices.map(i=>vs[i])],color);};
  if(v.kind==='pattern-assembly'){text(v.pieces+'조각',135,187,19);if(answer)v.answer.forEach((group,i)=>poly([[x,y],...group.map(j=>vertices[j]),vertices[(group.at(-1)+1)%6]],v.pieces===2?[red,'#ed9790'][i]:[blue,'#75b3d9','#4e9bcf'][i]));}
  tris(325,84,[0,1,2,3],red);text('빨간 조각',325,178,17);
  if(v.mode!=='red'){tris(455,76,[0,1,2],blue);text('파란 조각',468,178,17);}
  tris(567,76,[0,1],green);text('초록 조각',590,178,17);
 }else if(v.kind==='bricks-stack'){
  // Orthographic ray intersections ensure rear faces cannot paint over front blocks.
  const pile=(bricks,cx,cy,u)=>{
   const project=([x,y,z])=>[cx+(x-y)*u*Math.sqrt(3)/2,cy+(x+y)*u/2-z*u];
   const corners=bricks.flatMap(([x,y,z,dx,dy,dz])=>[0,dx].flatMap(a=>[0,dy].flatMap(b=>[0,dz].map(d=>project([x+a,y+b,z+d])))));
   const sx=Math.max(0,Math.floor(Math.min(...corners.map(p=>p[0]))*3)-4),sy=Math.max(0,Math.floor(Math.min(...corners.map(p=>p[1]))*3)-4);
   const w=Math.min(1980-sx,Math.ceil(Math.max(...corners.map(p=>p[0]))*3)-sx+5),h=Math.min(660-sy,Math.ceil(Math.max(...corners.map(p=>p[1]))*3)-sy+5);
   const off=document.createElement('canvas');off.width=w;off.height=h;const d=off.getContext('2d'),data=d.createImageData(w,h),ids=new Int16Array(w*h);ids.fill(-1);
   for(let py=0;py<h;py++)for(let px=0;px<w;px++){
    const a=((px+sx+.5)/3-cx)/(u*Math.sqrt(3)/2),b=((py+sy+.5)/3-cy)/u,origin=[b+a/2,b-a/2,0];
    let nearest=-Infinity,code=-1;
    bricks.forEach((brick,i)=>{let enter=-Infinity,leave=Infinity,face=0;for(let axis=0;axis<3;axis++){const lo=brick[axis]-origin[axis],hi=brick[axis]+brick[axis+3]-origin[axis];enter=Math.max(enter,lo);if(hi<leave){leave=hi;face=axis;}}if(leave>=enter&&leave>nearest){nearest=leave;code=i*3+face;}});
    ids[py*w+px]=code;
   }
   const colors=[[148,189,173],[183,212,197],[220,237,229]],edge=[49,88,77];
   for(let y=0;y<h;y++)for(let x=0;x<w;x++){const index=y*w+x,code=ids[index];if(code<0)continue;let outline=false;for(const [dx,dy] of [[-2,0],[2,0],[0,-2],[0,2]]){const a=x+dx,b=y+dy;if(a<0||a>=w||b<0||b>=h||ids[b*w+a]!==code){outline=true;break;}}const rgb=outline?edge:colors[code%3];data.data.set([...rgb,255],index*4);}
   d.putImageData(data,0,0);c.drawImage(off,sx/3,sy/3,w/3,h/3);
  };
  text('보기',92,40,16);pile([[0,0,0,2,1,1]],82,88,21);text('블록 1개',94,140,15);
  pile(v.bricks,304,100,30);
  // Side elevation is a spatial clue, not a labelled count or worked hint.
  const x=504,y=66,u=30,owners=Array.from({length:3},()=>Array(3).fill(-1));
  for(let a=0;a<3;a++)for(let z=0;z<3;z++)for(let b=0;b<4;b++){
   const owner=v.bricks.findIndex(([bx,by,bz,dx,dy,dz])=>b>=bx&&b<bx+dx&&a>=by&&a<by+dy&&z>=bz&&z<bz+dz);
   if(owner>=0)owners[a][z]=owner;
  }
  for(let a=0;a<3;a++)for(let z=0;z<3;z++){const owner=owners[a][z];if(owner<0)continue;c.fillStyle='#edf6f1';c.fillRect(x+a*u,y+(2-z)*u,u,u);for(const [da,dz,edge] of [[-1,0,[[a,2-z],[a,3-z]]],[1,0,[[a+1,2-z],[a+1,3-z]]],[0,1,[[a,2-z],[a+1,2-z]]],[0,-1,[[a,3-z],[a+1,3-z]]]])if(owners[a+da]?.[z+dz]!==owner)line(edge.map(([b,d])=>[x+b*u,y+d*u]),'#6c9282',1.2);}
  text('옆에서 본 모양',549,186,15);
 }else if(v.kind==='bricks'){
  const pr=([x,y,z])=>[168+x*48+y*22,183-y*17-z*39];
  v.bricks.forEach(([x,y,z,dx,dy,dz],i)=>{const f=[[x,y,z],[x+dx,y,z],[x+dx,y,z+dz],[x,y,z+dz]].map(pr),t=[[x,y,z+dz],[x+dx,y,z+dz],[x+dx,y+dy,z+dz],[x,y+dy,z+dz]].map(pr),r=[[x+dx,y,z],[x+dx,y+dy,z],[x+dx,y+dy,z+dz],[x+dx,y,z+dz]].map(pr);poly(t,'#dfeeda');poly(r,'#89b697');poly(f,i%2?'#c1d9ce':'#b2d4c1');});
 }else if(v.kind==='length'){
  const u=39,x=110,total=11,redUnits=total-v.topLeft-v.topRight,blueUnits=total-v.bottomLeft-v.bottomRight;
  const clip=(x,y)=>{c.strokeStyle='#697f8e';c.lineWidth=2;c.beginPath();c.roundRect(x+1,y,u-2,14,7);c.stroke();c.beginPath();c.roundRect(x+5,y+4,u-10,6,3);c.stroke();};
  for(const k of [0,total])line([[x+k*u,45],[x+k*u,169]],'#9caebb',1,[4,4]);
  [[v.topLeft,v.topRight,redUnits,red,66],[v.bottomLeft,v.bottomRight,blueUnits,blue,132]].forEach(([left,right,units,color,y])=>{for(let i=0;i<left;i++)clip(x+i*u,y+5);rect(x+left*u,y,units*u,25,color,color);for(let i=0;i<right;i++)clip(x+(left+units+i)*u,y+5);});
 }else throw Error('Unknown visual '+v.kind);
 if(answer){
  // A separate close-up render keeps answer nets and drawn paths readable at print size.
  const gridCrop=v.kind==='grid'?[(660-v.w*48)/2-8,(220-v.h*48)/2-8,v.w*48+16,v.h*48+16]:null;
  const crops={net:[204,12,252,196],tiles:[260,0,154,140],partition:[220,10,210,192],'pattern-assembly':[65,35,140,160]},crop=gridCrop||crops[v.kind];
  if(crop){const [x,y,w,h]=crop,output=document.createElement('canvas');output.width=1440;output.height=960;const d=output.getContext('2d');d.fillStyle='#fff';d.fillRect(0,0,1440,960);const scale=Math.min(1380/w,900/h),dw=w*scale,dh=h*scale;d.drawImage(canvas,x*3,y*3,w*3,h*3,(1440-dw)/2,(960-dh)/2,dw,dh);return output.toDataURL('image/png');}
 }
 return canvas.toDataURL('image/png');
}
if(require.main===module)(async()=>{const browser=await chromium.launch({headless:true}),page=await browser.newPage();try{const items=Object.values(all).flatMap(r=>[...r.main,...r.extra]).filter(q=>q.visual);for(const q of items){const tileParts=q.payload.kind==='tiles'?tileSolutions(q.payload.target)[0].parts:null;for(const answer of q.visual.answer?[false,true]:[false]){const data=await page.evaluate(draw,{v:q.visual,answer,bases:tileBases,tileParts});fs.writeFileSync(path.join(out,q.id+(answer?'-answer':'')+'.png'),Buffer.from(data.split(',')[1],'base64'));}}console.log(JSON.stringify({items:items.length,assets:fs.readdirSync(out).filter(n=>n.endsWith('.png')).length}));}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
module.exports={draw};
