import { properties } from './core.js?v=quad-1';
import { translation } from './i18n.js?v=quad-1';

export const dimensions = Object.freeze({ width:400, height:400, gridMin:32, gridMax:368, step:56 });
const esc = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[char]));
const xy = ([x,y]) => [32 + 56*x, 32 + 56*y];
const line = (a,b,attrs='') => `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" ${attrs}/>`;
const unit = (a,b) => { const d=Math.hypot(b[0]-a[0],b[1]-a[1]); return d ? [(b[0]-a[0])/d,(b[1]-a[1])/d] : [0,0]; };
const same = (a,b) => a && b && a[0]===b[0] && a[1]===b[1];

export function renderProblem(p, {lang='ko', reveal=false, interactive=false, selectedPoint, selectedIds=[]}={}) {
  const t=translation(lang), build=p.domain==='build';
  const chosen=selectedPoint ?? (build && reveal ? p.example : undefined);
  const occupied=build && chosen && p.vertices.some(point=>same(point,chosen));
  const vertices=build ? [...p.vertices.slice(0,3), ...(chosen && !occupied ? [chosen] : [])] : p.vertices;
  const points=vertices.map(xy), props=points.length===4 ? properties(vertices) : null;
  const clues=p.domain==='classify', marks=clues || reveal;
  const pieces=[];
  pieces.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400" role="${interactive?'group':'img'}" aria-label="${esc(t.grid)}" data-domain="${esc(p.domain)}" data-reveal="${reveal}" font-family="Arial, sans-serif">`);
  pieces.push('<rect width="400" height="400" fill="#ffffff"/>');
  for(let n=0;n<7;n++) {
    pieces.push(line(xy([n,0]),xy([n,6]),'stroke="#e4e8ed" stroke-width="1"'));
    pieces.push(line(xy([0,n]),xy([6,n]),'stroke="#e4e8ed" stroke-width="1"'));
  }
  for(let y=0;y<7;y++) for(let x=0;x<7;x++) {const [cx,cy]=xy([x,y]);pieces.push(`<circle cx="${cx}" cy="${cy}" r="2" fill="#9aa7b5"/>`);}
  const complete=points.length===4;
  pieces.push(`<${complete?'polygon':'polyline'} data-shape="${complete?'complete':'open'}" points="${points.map(v=>v.join(',')).join(' ')}" fill="${complete?'#24616c0d':'none'}" stroke="#24616c" stroke-width="3" stroke-linejoin="round"/>`);
  if(marks && props?.valid) {
    if(clues || p.domain==='parallel' || build) props.parallelPairs.forEach(pair=>{
      const sides=pair==='ab-cd'?[0,2]:[1,3],count=pair==='ab-cd'?1:2;
      for(const side of sides) {
        const a=points[side],b=points[(side+1)%4],u=unit(a,b);
        const canonical=u[0]<0 || (Math.abs(u[0])<1e-8 && u[1]<0) ? u.map(v=>-v) : u;
        for(let k=0;k<count;k++) {
          const offset=(k-(count-1)/2)*9, m=[(a[0]+b[0])/2+canonical[0]*offset,(a[1]+b[1])/2+canonical[1]*offset];
          const back=[m[0]-canonical[0]*6,m[1]-canonical[1]*6],n=[-canonical[1]*4,canonical[0]*4];
          pieces.push(`<path data-mark="parallel" d="M ${back[0]+n[0]} ${back[1]+n[1]} L ${m[0]} ${m[1]} L ${back[0]-n[0]} ${back[1]-n[1]}" fill="none" stroke="#9b3f58" stroke-width="2"/>`);
        }
      }
    });
    if(clues || p.domain==='right' || build) props.rightVertices.forEach(id=>{
      const i='ABCD'.indexOf(id),o=points[i],u=unit(o,points[(i+3)%4]),v=unit(o,points[(i+1)%4]),s=12;
      const a=[o[0]+u[0]*s,o[1]+u[1]*s],b=[a[0]+v[0]*s,a[1]+v[1]*s],c=[o[0]+v[0]*s,o[1]+v[1]*s];
      pieces.push(`<polyline data-mark="right" points="${[a,b,c].map(v=>v.join(',')).join(' ')}" fill="none" stroke="#9b3f58" stroke-width="2"/>`);
    });
    if(clues || build) props.equalSideGroups.forEach((group,g)=>group.forEach(i=>{
      const a=points[i],b=points[(i+1)%4],u=unit(a,b),n=[-u[1],u[0]];
      for(let k=0;k<g+1;k++) {
        const along=.32*Math.hypot(b[0]-a[0],b[1]-a[1])+(k-g/2)*6,m=[a[0]+u[0]*along,a[1]+u[1]*along];
        pieces.push(line([m[0]-n[0]*5,m[1]-n[1]*5],[m[0]+n[0]*5,m[1]+n[1]*5],'data-mark="equal" stroke="#9b3f58" stroke-width="2"'));
      }
    }));
  }
  const center=points.reduce((a,b)=>[a[0]+b[0]/points.length,a[1]+b[1]/points.length],[0,0]);
  points.forEach((point,i)=>{
    const id='ABCD'[i],u=unit(center,point),lx=Math.max(12,Math.min(388,point[0]+u[0]*19)),ly=Math.max(14,Math.min(386,point[1]+u[1]*19));
    pieces.push(`<circle data-vertex-dot="${id}" cx="${point[0]}" cy="${point[1]}" r="5" fill="${i===3&&build?'#9b3f58':'#24616c'}"/>`);
    pieces.push(`<text data-label="${id}" x="${lx}" y="${ly}" text-anchor="middle" dominant-baseline="central" font-size="15" font-weight="700" fill="#182230" stroke="#fff" stroke-width="4" paint-order="stroke">${id}</text>`);
  });
  if(interactive && build) for(let y=0;y<7;y++) for(let x=0;x<7;x++) {
    const [cx,cy]=xy([x,y]),active=same(chosen,[x,y]);
    pieces.push(`<g class="point-choice" data-point="${x},${y}" role="button" aria-label="${esc(t.candidate(x,y))}" aria-pressed="${!!active}" tabindex="${x===0&&y===0?'0':'-1'}"><rect x="${cx-27.5}" y="${cy-27.5}" width="55" height="55" fill="transparent" rx="3"/><circle class="focus-ring" cx="${cx}" cy="${cy}" r="10" fill="none" stroke="${active?'#9b3f58':'transparent'}" stroke-width="2"/></g>`);
  }
  if(interactive && p.domain==='right') points.forEach(([cx,cy],i)=>{
    const id='ABCD'[i];pieces.push(`<g class="point-choice" data-vertex="${id}" role="checkbox" aria-label="${esc(t.vertex(id))}" aria-checked="${selectedIds.includes(id)}" tabindex="${i===0?'0':'-1'}"><rect x="${cx-27.5}" y="${cy-27.5}" width="55" height="55" fill="transparent" rx="3"/><circle class="focus-ring" cx="${cx}" cy="${cy}" r="10" fill="none" stroke="${selectedIds.includes(id)?'#2456c4':'transparent'}" stroke-width="2"/></g>`);
  });
  pieces.push('</svg>');return pieces.join('');
}
