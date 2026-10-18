// Continuous physical paper geometry. Coordinates and source identities survive folds.
import {clipHalfPlane,reflectAcross,polygonArea,polygonCentroid,pt} from '../games/paper-fold/reverse-fold.js?v=20261018-3';
export {polygonArea,polygonCentroid};
export const EPS=1e-7;
export const square=()=>[{x:0,y:0},{x:1,y:0},{x:1,y:1},{x:0,y:1}];
export const line=(nx,ny,c,moving=1)=>{const n=Math.hypot(nx,ny);if(!n)throw Error('Empty fold normal');return {nx:nx/n,ny:ny/n,c:c/n,moving};};
export const signed=(f,p)=>f.nx*p.x+f.ny*p.y-f.c;
export const reflect=(f,p)=>reflectAcross(f,p);
export const box=poly=>({left:Math.min(...poly.map(p=>p.x)),right:Math.max(...poly.map(p=>p.x)),top:Math.min(...poly.map(p=>p.y)),bottom:Math.max(...poly.map(p=>p.y))});
export function insideWithMargin(poly,p,margin=.008){
  if(!inside(poly,p))return false;
  return poly.every((a,i)=>{const b=poly[(i+1)%poly.length],dx=b.x-a.x,dy=b.y-a.y,length=dx*dx+dy*dy,t=length?Math.max(0,Math.min(1,((p.x-a.x)*dx+(p.y-a.y)*dy)/length)):0;return Math.hypot(p.x-a.x-t*dx,p.y-a.y-t*dy)>margin;});
}
export function cleanPolygon(poly){
  let out=poly.filter((p,i)=>Math.hypot(p.x-poly[(i+poly.length-1)%poly.length].x,p.y-poly[(i+poly.length-1)%poly.length].y)>EPS);
  let changed=true;
  while(changed&&out.length>3){changed=false;out=out.filter((p,i)=>{const a=out[(i+out.length-1)%out.length],b=out[(i+1)%out.length];if(Math.abs((p.x-a.x)*(b.y-p.y)-(p.y-a.y)*(b.x-p.x))<EPS){changed=true;return false;}return true;});}
  return out;
}
export function intersectConvex(a,b){
  let out=a;let area=0;b.forEach((p,i)=>{const q=b[(i+1)%b.length];area+=p.x*q.y-q.x*p.y;});
  for(let i=0;i<b.length&&out.length>=3;i++){const p=b[i],q=b[(i+1)%b.length],f={nx:p.y-q.y,ny:q.x-p.x,c:(p.y-q.y)*p.x+(q.x-p.x)*p.y};out=clipHalfPlane(out,f,area>=0?1:-1);}
  return out.length>=3?cleanPolygon(out):[];
}
export function inside(poly,p){
  let result=false;
  for(let i=0,j=poly.length-1;i<poly.length;j=i++){
    const a=poly[j],b=poly[i],v=(b.x-a.x)*(p.y-a.y)-(b.y-a.y)*(p.x-a.x);
    if(Math.abs(v)<EPS&&p.x>=Math.min(a.x,b.x)-EPS&&p.x<=Math.max(a.x,b.x)+EPS&&p.y>=Math.min(a.y,b.y)-EPS&&p.y<=Math.max(a.y,b.y)+EPS)return true;
    if((a.y>p.y)!==(b.y>p.y)&&p.x<(b.x-a.x)*(p.y-a.y)/(b.y-a.y)+a.x)result=!result;
  }
  return result;
}
export function initialLayers(numbered=false){
  return numbered?Array.from({length:16},(_,id)=>{const x=id%4/4,y=Math.floor(id/4)/4;return {id,front:true,ink:[1,0,0,1],poly:[{x,y},{x:x+.25,y},{x:x+.25,y:y+.25},{x,y:y+.25}],dot:{x:x+.125,y:y+.125}};}):[{id:0,front:true,poly:square()}];
}
export function reflectInk(ink=[1,0,0,1],f){const n=Math.hypot(f.nx,f.ny),x=f.nx/n,y=f.ny/n,a=1-2*x*x,b=-2*x*y,d=1-2*y*y;return [a*ink[0]+b*ink[1],b*ink[0]+d*ink[1],a*ink[2]+b*ink[3],b*ink[2]+d*ink[3]].map(v=>Math.abs(v)<1e-8?0:v);}
export function foldLayers(layers,f){
  const fixed=[],moving=[];
  for(const layer of layers){
    const a=clipHalfPlane(layer.poly,f,-f.moving),b=clipHalfPlane(layer.poly,f,f.moving);
    if(a.length>=3&&polygonArea(a)>EPS)fixed.push({...layer,poly:cleanPolygon(a),dot:layer.dot&&signed(f,layer.dot)*f.moving<=EPS?layer.dot:null});
    if(b.length>=3&&polygonArea(b)>EPS)moving.push({...layer,front:!layer.front,ink:reflectInk(layer.ink,f),poly:cleanPolygon(b.map(p=>reflect(f,p))),dot:layer.dot&&signed(f,layer.dot)*f.moving>=-EPS?reflect(f,layer.dot):null});
  }
  return [...fixed,...moving.reverse()];
}
export const layerStages=(folds,numbered=false)=>folds.reduce((stages,f)=>[...stages,foldLayers(stages.at(-1),f)],[initialLayers(numbered)]);
export function paperAfter(folds){return folds.reduce((poly,f)=>cleanPolygon(clipHalfPlane(poly,f,-f.moving)),square());}
export function reflectMark(mark,f){return mark.kind==='circle'?{...mark,center:reflect(f,mark.center)}:{...mark,poly:mark.poly.map(p=>reflect(f,p))};}
export function markContains(mark,p){return mark.kind==='circle'?Math.hypot(p.x-mark.center.x,p.y-mark.center.y)<=mark.radius+EPS:inside(mark.poly,p);}
export const markKey=m=>m.kind==='circle'?`c:${m.center.x.toFixed(6)},${m.center.y.toFixed(6)},${m.radius}`:'p:'+m.poly.map(p=>`${p.x.toFixed(6)},${p.y.toFixed(6)}`).sort().join(';');
export function unfoldMarks(marks,folds,paperStages=null){
  const stages=[marks];for(let i=folds.length-1;i>=0;i--){const f=folds[i];let copies=stages.at(-1);
    if(paperStages&&polygonArea(paperStages[i+1])>polygonArea(paperStages[i])*.50001){
      const landing=clipHalfPlane(paperStages[i],f,f.moving).map(q=>reflect(f,q));
      copies=copies.flatMap(m=>{if(m.kind!=='polygon')throw Error('Curved partial-fold clipping is not supported');const poly=intersectConvex(m.poly,landing);if(poly.length<3||polygonArea(poly)<EPS)return [];const shape=Math.abs(polygonArea(poly)-polygonArea(m.poly))<EPS?m.shape:classify(poly)==='triangle'?'triangle':'other';return [{...m,shape,poly}];});
    }
    const all=[...stages.at(-1),...copies.map(m=>reflectMark(m,f))];stages.push([...new Map(all.map(m=>[markKey(m),m])).values()]);
  }return stages;
}
export function layerDepth(layers){let min=Infinity,max=0;for(let y=0;y<37;y++)for(let x=0;x<37;x++){const q={x:(x+.379)/37,y:(y+.613)/37},count=layers.reduce((n,l)=>n+(inside(l.poly,q)?1:0),0);if(count){min=Math.min(min,count);max=Math.max(max,count);}}return {min,max};}
export function boundaryLayers(poly,layers,marks=[]){
  const center=polygonCentroid(poly),result=[];
  poly.forEach((a,i)=>{const b=poly[(i+1)%poly.length],dx=b.x-a.x,dy=b.y-a.y,length=dx*dx+dy*dy,ts=[0,1],add=t=>{if(t>EPS&&t<1-EPS)ts.push(t);};
    for(const layer of layers)for(const q of layer.poly)if(Math.abs(dx*(q.y-a.y)-dy*(q.x-a.x))<EPS)add(((q.x-a.x)*dx+(q.y-a.y)*dy)/length);
    for(const m of marks)if(m.kind==='circle'){const x=a.x-m.center.x,y=a.y-m.center.y,B=2*(dx*x+dy*y),C=x*x+y*y-m.radius*m.radius,D=B*B-4*length*C;if(D>=0){add((-B-Math.sqrt(D))/(2*length));add((-B+Math.sqrt(D))/(2*length));}}
    else m.poly.forEach((c,j)=>{const d=m.poly[(j+1)%m.poly.length],sx=d.x-c.x,sy=d.y-c.y,den=dx*sy-dy*sx;if(Math.abs(den)<EPS)return;const t=((c.x-a.x)*sy-(c.y-a.y)*sx)/den,u=((c.x-a.x)*dy-(c.y-a.y)*dx)/den;if(u>=-EPS&&u<=1+EPS)add(t);});
    const sorted=[...new Set(ts.map(t=>Math.round(t*1e8)/1e8))].sort((x,y)=>x-y);
    for(let j=1;j<sorted.length;j++){const t=(sorted[j-1]+sorted[j])/2,q={x:a.x+dx*t,y:a.y+dy*t};if(marks.some(m=>markContains(m,q)))continue;const inner={x:q.x*.9999+center.x*.0001,y:q.y*.9999+center.y*.0001},count=layers.filter(l=>inside(l.poly,inner)).length;if(count)result.push({a:{x:a.x+dx*sorted[j-1],y:a.y+dy*sorted[j-1]},b:{x:a.x+dx*sorted[j],y:a.y+dy*sorted[j]},layers:count});}
  });return result;
}
export function targetNumbers(folds,marks){
  const dots=Array.from({length:16},(_,id)=>({id,point:{x:id%4/4+.125,y:Math.floor(id/4)/4+.125}}));
  return dots.filter(({point})=>{for(const f of folds)if(signed(f,point)*f.moving>EPS)point=reflect(f,point);return marks.some(m=>markContains(m,point));}).map(x=>x.id);
}
export function classify(poly){
  const p=cleanPolygon(poly);if(p.length===3)return 'triangle';
  if(p.length===4){const lengths=p.map((a,i)=>Math.hypot(a.x-p[(i+1)%4].x,a.y-p[(i+1)%4].y));if(Math.max(...lengths)-Math.min(...lengths)<1e-5)return 'rhombus';return 'quadrilateral';}return 'other';
}
// Build planar faces from finite scissor segments, splitting at every intersection.
export function partitionPaper(cuts){
  const border=square().map((p,i)=>[p,square()[(i+1)%4]]),segments=[...border,...cuts],splits=segments.map(()=>[0,1]);
  const cross=(a,b)=>a.x*b.y-a.y*b.x,sub=(a,b)=>({x:a.x-b.x,y:a.y-b.y});
  segments.forEach(([a,b],i)=>segments.forEach(([c,d],j)=>{if(j<=i)return;const r=sub(b,a),s=sub(d,c),den=cross(r,s),q=sub(c,a);if(Math.abs(den)<EPS)return;const t=cross(q,s)/den,u=cross(q,r)/den;if(t>=-EPS&&t<=1+EPS&&u>=-EPS&&u<=1+EPS){splits[i].push(Math.max(0,Math.min(1,t)));splits[j].push(Math.max(0,Math.min(1,u)));}}));
  const key=p=>`${Math.round(p.x*1e6)},${Math.round(p.y*1e6)}`,vertices=new Map(),neighbors=new Map();
  segments.forEach(([a,b],i)=>{const ts=[...new Set(splits[i].map(t=>Math.round(t*1e8)/1e8))].sort((a,b)=>a-b);for(let j=1;j<ts.length;j++){if(ts[j]-ts[j-1]<EPS)continue;const pair=[ts[j-1],ts[j]].map(t=>pt(a.x+(b.x-a.x)*t,a.y+(b.y-a.y)*t)),[ka,kb]=pair.map(key);pair.forEach(p=>vertices.set(key(p),p));for(const [u,v] of [[ka,kb],[kb,ka]]){if(!neighbors.has(u))neighbors.set(u,new Set());neighbors.get(u).add(v);}}});
  const sorted=new Map([...neighbors].map(([k,ns])=>{const a=vertices.get(k);return [k,[...ns].sort((u,v)=>Math.atan2(vertices.get(u).y-a.y,vertices.get(u).x-a.x)-Math.atan2(vertices.get(v).y-a.y,vertices.get(v).x-a.x))];}));
  const visited=new Set(),faces=[];
  for(const [start,ns] of sorted)for(const end of ns){if(visited.has(start+'|'+end))continue;let a=start,b=end,poly=[];for(let safety=0;safety<1000;safety++){const edge=a+'|'+b;if(visited.has(edge))break;visited.add(edge);poly.push(vertices.get(a));const opts=sorted.get(b),next=opts[(opts.indexOf(a)-1+opts.length)%opts.length];a=b;b=next;if(a===start&&b===end)break;}
    const signedArea=poly.reduce((sum,p,i)=>sum+p.x*poly[(i+1)%poly.length].y-poly[(i+1)%poly.length].x*p.y,0)/2;if(signedArea>EPS)faces.push(cleanPolygon(poly));
  }
  return faces;
}
export function unfoldCuts(cuts,folds){let result=cuts;for(const f of [...folds].reverse()){const all=[...result,...result.map(s=>s.map(p=>reflect(f,p)))];result=[...new Map(all.map(s=>[s.map(p=>`${p.x.toFixed(6)},${p.y.toFixed(6)}`).sort().join('|'),s])).values()];}return result;}
