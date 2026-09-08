import { translation } from './i18n.js?v=circle-1';

export const dimensions = Object.freeze({width:400,height:400,gridMin:32,gridMax:368,step:56});
const esc = value => String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
const xy = ([x,y]) => [32+56*x,32+56*y];
const same = (a,b) => a && b && a[0]===b[0] && a[1]===b[1];
const circle = (cx,cy,r,attrs='') => `<circle cx="${cx}" cy="${cy}" r="${r}" ${attrs}/>`;
const line = (a,b,attrs='') => `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" ${attrs}/>`;
const label = (x,y,text,attrs='',fontSize=18) => `<text x="${x}" y="${y}" text-anchor="middle" font-size="${fontSize}" fill="#182230" stroke="#fff" stroke-width="4" paint-order="stroke" ${attrs}>${esc(text)}</text>`;
const outline = 'fill="none" stroke="#24616c" stroke-width="3"';

export function renderProblem(p,{lang='ko',reveal=false,interactive=false,selectedPoint=null,selectedIds=[],construction=null,traceProgress=0}={}) {
  const t=translation(lang), grid=p.domain==='center'||p.domain==='draw';
  const parts=[`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400" preserveAspectRatio="xMidYMid meet" role="${interactive?'group':'img'}" aria-label="${esc(grid?t.grid:t.diagram)}" data-domain="${esc(p.domain)}" data-reveal="${reveal}" font-family="Arial, sans-serif">`,`<rect width="400" height="400" fill="#fff"/>`];
  if(grid) {
    for(let n=0;n<7;n++) {
      parts.push(line(xy([n,0]),xy([n,6]),'data-grid-line="vertical" stroke="#e4e8ed"'));
      parts.push(line(xy([0,n]),xy([6,n]),'data-grid-line="horizontal" stroke="#e4e8ed"'));
    }
    for(let y=0;y<7;y++)for(let x=0;x<7;x++)parts.push(circle(...xy([x,y]),2,'data-grid-dot="true" fill="#9aa7b5"'));
  }
  if(p.domain==='center') {
    parts.push(circle(...xy(p.center),p.radius*56,`data-circle="given" ${outline}`));
    const point=selectedPoint || (reveal?p.center:null);
    if(point)parts.push(circle(...xy(point),6,`data-selected-center="${point}" fill="#9b3f58"`));
    if(reveal)parts.push(label(xy(p.center)[0]+14,xy(p.center)[1]-12,'O','data-center-label="true"'));
  } else if(p.domain==='parts') {
    p.segments.forEach((segment,i)=>{
      const cx=100+(i%2)*200,cy=112+Math.floor(i/2)*200,scale=13;
      const map=([x,y])=>[cx+(x-p.center[0])*scale,cy-(y-p.center[1])*scale];
      parts.push(`<g data-part="${esc(segment.id)}" data-selected="${selectedIds.includes(segment.id)}">`);
      parts.push(label(cx,cy-84,segment.id,'data-part-label="true" font-weight="700"'));
      parts.push(circle(cx,cy,p.radius*scale,`data-circle="part" ${outline}`));
      parts.push(circle(cx,cy,3,'data-center="true" fill="#182230"'));
      const a=map(segment.start),b=map(segment.end),dx=b[0]-a[0],dy=b[1]-a[1],length=Math.hypot(dx,dy)||1;
      parts.push(label(cx-dy/length*25,cy+dx/length*25+5,'O','',14));
      parts.push(line(map(segment.start),map(segment.end),`data-segment="${esc(segment.id)}" stroke="#9b3f58" stroke-width="4"`));
      for(const point of [segment.start,segment.end])parts.push(circle(...map(point),4,'data-endpoint="true" fill="#9b3f58"'));
      parts.push('</g>');
    });
  } else if(p.domain==='measure') {
    parts.push(circle(200,200,128,`data-circle="given" ${outline}`));
    parts.push(line(p.given==='radius'?[200,200]:[72,200],[328,200],'data-given-segment="true" stroke="#9b3f58" stroke-width="4"'));
    parts.push(circle(200,200,4,'data-center="true" fill="#182230"'),label(185,224,'O'));
    parts.push(label(p.given==='radius'?264:200,179,`${p.given==='radius'?p.radius:p.radius*2} cm`,'data-given-length="true" font-weight="700"'));
    if(reveal)parts.push(label(200,367,t.answerLength(p.given==='radius'?'diameter':'radius',p.given==='radius'?p.radius*2:p.radius),'data-answer-length="true"'));
  } else if(p.domain==='draw') {
    const [ox,oy]=xy(p.center);
    parts.push(circle(ox,oy,4,'data-given-center="true" fill="#24616c"'),label(ox+14,oy-12,'O','data-given-label="true"'));
    const attempt=construction || (reveal?{center:p.center,radius:p.radius}:null);
    const progress=construction?Math.max(0,Math.min(1,Number(traceProgress)||0)):(reveal?1:0);
    if(attempt) {
      const [cx,cy]=xy(attempt.center),r=56*attempt.radius,angle=progress*Math.PI*2;
      const end=[cx+r*Math.cos(angle),cy+r*Math.sin(angle)];
      parts.push(`<g data-construction-center="${esc(attempt.center)}" data-construction-radius="${attempt.radius}" data-trace-progress="${progress}">`);
      if(progress===1)parts.push(circle(cx,cy,r,`data-trace="complete" ${outline}`));
      else if(progress>0)parts.push(`<path data-trace="partial" d="M ${cx+r} ${cy} A ${r} ${r} 0 ${progress>.5?1:0} 1 ${end[0]} ${end[1]}" ${outline}/>`);
      parts.push(line([cx,cy],end,'data-compass-arm="true" stroke="#9b3f58" stroke-width="3"'));
      parts.push(circle(cx,cy,6,`data-selected-center="${esc(attempt.center)}" fill="#9b3f58"`));
      parts.push(circle(...end,5,'data-compass-tip="true" fill="#182230"'));
      parts.push('</g>');
    }
  }
  if(interactive && grid)for(let y=0;y<7;y++)for(let x=0;x<7;x++) {
    const [cx,cy]=xy([x,y]),active=same(selectedPoint,[x,y]);
    parts.push(`<g class="point-choice" data-point="${x},${y}" role="button" aria-label="${esc(t.candidate(x,y))}" aria-pressed="${!!active}" tabindex="${x===0&&y===0?'0':'-1'}"><rect x="${cx-27.5}" y="${cy-27.5}" width="55" height="55" fill="transparent" rx="3"/><circle class="focus-ring" cx="${cx}" cy="${cy}" r="11" fill="none" stroke="${active?'#9b3f58':'transparent'}" stroke-width="2"/></g>`);
  }
  return parts.join('')+'</svg>';
}
