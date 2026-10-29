(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.HSE_SOURCE_52_CONGRUENCE_PAGE30_E44_SYNTHETIC = api;
  api.install(root);
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  const sourceItemId = "5-2-u3-e4-example-4";
  const generatorKey = "source52EquilateralCompositeAnglesSyntheticPage30Example44";
  const definition = Object.freeze({ sourceItemId, generatorKey, sourcePdfPage: 26, sourcePrintedPage: 30 });
  const pools = Object.freeze([65,72,75]);
  const radians = degrees => degrees * Math.PI / 180;
  const round = value => Number(value.toFixed(6));
  const esc = value => String(value).replace(/[&<>"']/g, ch => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[ch]));

  function rotate(point, degrees) {
    const a = radians(degrees), c = Math.cos(a), s = Math.sin(a);
    return { x: point.x * c - point.y * s, y: point.x * s + point.y * c };
  }
  function distance(a, b) { return Math.hypot(a.x - b.x, a.y - b.y); }
  function angle(a, vertex, b) {
    const u = { x:a.x-vertex.x, y:a.y-vertex.y }, v = { x:b.x-vertex.x, y:b.y-vertex.y };
    const cosine = (u.x*v.x+u.y*v.y)/(Math.hypot(u.x,u.y)*Math.hypot(v.x,v.y));
    return Math.acos(Math.max(-1,Math.min(1,cosine))) * 180 / Math.PI;
  }

  function model(variant=0,difficulty=0) {
    const index=((variant%3)+3)%3, offset=[-1,0,1].includes(difficulty)?difficulty:0, given=pools[index]+offset;
    // △GND is isosceles with GN=ND and base angles given.
    const G = { x:0, y:0 }, N = { x:1, y:0 };
    const base = 2 * Math.cos(radians(given));
    const D = { x:base*Math.cos(radians(given)), y:base*Math.sin(radians(given)) };
    // Equilateral △GNM is placed opposite D across GN.
    const M = { x:0.5, y:-Math.sqrt(3)/2 };
    // Equilateral △GDR: choose the orientation that places R outside △GND.
    const gd = { x:D.x-G.x, y:D.y-G.y };
    const turn = rotate(gd, 60);
    const R = { x:G.x+turn.x, y:G.y+turn.y };
    const points = Object.fromEntries(Object.entries({G,N,D,M,R}).map(([k,p])=>[k,Object.freeze({x:round(p.x),y:round(p.y)})]));
    const a1 = angle(M,D,N), a2 = angle(G,R,N), angleG = angle(N,G,D), angleD = angle(G,D,N);
    const rTriangle = angle(G,R,D);
    return Object.freeze({ given, index, points:Object.freeze(points), sideGN:distance(G,N), sideND:distance(N,D), sideGD:distance(G,D), sideDR:distance(D,R), sideGR:distance(G,R), sideGM:distance(G,M), sideMN:distance(M,N), angleAtG:angleG, angleAtD:angleD, angleMND:angle(M,N,D), angleNDR:angle(N,D,R), angleGRD:rTriangle, answer1:round(a1), answer2:round(a2) });
  }

  function arc(points, vertex, first, second, radius, className) {
    const v=points[vertex], a=points[first], b=points[second];
    const t1=Math.atan2(a.y-v.y,a.x-v.x), t2=Math.atan2(b.y-v.y,b.x-v.x);
    let delta=((t2-t1+Math.PI*3)%(Math.PI*2))-Math.PI;
    const s={x:v.x+radius*Math.cos(t1),y:v.y+radius*Math.sin(t1)};
    const e={x:v.x+radius*Math.cos(t1+delta),y:v.y+radius*Math.sin(t1+delta)};
    return `<path class="${className}" d="M${round(s.x)} ${round(s.y)} A${radius} ${radius} 0 0 ${delta >= 0 ? 1 : 0} ${round(e.x)} ${round(e.y)}"/>`;
  }

  function diagram(shape, solution = false) {
    const basePoints = Object.values(shape.points).map(p=>rotate(p,-120));
    const minX=Math.min(...basePoints.map(p=>p.x)), maxX=Math.max(...basePoints.map(p=>p.x));
    const minY=Math.min(...basePoints.map(p=>p.y)), maxY=Math.max(...basePoints.map(p=>p.y));
    const width=500,height=330,pad=60;
    const scale=Math.min((width-2*pad)/(maxX-minX),(height-2*pad)/(maxY-minY));
    const project=p=>({x:round(pad+(p.x-minX)*scale+(width-2*pad-(maxX-minX)*scale)/2), y:round(height-pad-(p.y-minY)*scale-(height-2*pad-(maxY-minY)*scale)/2)});
    const p=Object.fromEntries(Object.entries(shape.points).map(([k,v])=>[k,project(rotate(v,-120))]));
    const line=(a,b,cls="")=>`<line${cls?` class="${cls}"`:""} x1="${p[a].x}" y1="${p[a].y}" x2="${p[b].x}" y2="${p[b].y}"/>`;
    const label=(key,text,dx,dy,cls="")=>`<text class="source52-p30e44-label${cls?` ${cls}`:""}" x="${round(p[key].x+dx)}" y="${round(p[key].y+dy)}">${text}</text>`;
    const centerLabel=(v,a,b,dist,text,cls)=>{const u={x:p[a].x-p[v].x,y:p[a].y-p[v].y},w={x:p[b].x-p[v].x,y:p[b].y-p[v].y},un=Math.hypot(u.x,u.y),wn=Math.hypot(w.x,w.y),dx=u.x/un+w.x/wn,dy=u.y/un+w.y/wn,n=Math.hypot(dx,dy);return `<text class="${cls}" x="${round(p[v].x+dx/n*dist-8)}" y="${round(p[v].y+dy/n*dist+5)}">${text}</text>`};
    const given=`${arc(p,"G","N","D",19,"source52-p30e44-angle")}${centerLabel("G","N","D",42,`${shape.given}°`,"source52-p30e44-given")}`;
    const [v,a,b]=[["D","M","N"],["N","G","D"],["R","N","D"]][shape.index];
    const result=[shape.answer1,180-2*shape.given,30][shape.index];
    const targets=`${arc(p,v,a,b,20,solution?"source52-p30e44-answer-arc":"source52-p30e44-target-arc")}${centerLabel(v,a,b,43,solution?`${result}°`:"?",solution?"source52-p30e44-answer":"source52-p30e44-target")}`;
    const tick=(a,b)=>{const dx=p[b].x-p[a].x,dy=p[b].y-p[a].y,len=Math.hypot(dx,dy),mx=(p[a].x+p[b].x)/2,my=(p[a].y+p[b].y)/2,nx=-dy/len*6,ny=dx/len*6;return `<line class="source52-p30e44-equal" x1="${round(mx-nx)}" y1="${round(my-ny)}" x2="${round(mx+nx)}" y2="${round(my+ny)}"/>`};
    const equalSideMark=`${tick("G","N")}${tick("N","D")}`;
    const labelSet=`${label("G","ㄱ",-18,-12)}${label("N","ㄴ",-18,19)}${label("D","ㄷ",-8,20)}${label("M","ㅁ",-17,-10)}${label("R","ㄹ",12,5)}`;
    const aria=`이등변삼각형과 두 정삼각형, ㄱㄴ과 ㄴㄷ이 같고 ∠ㄴㄱㄷ은 ${shape.given}도${solution?`, 표시한 각은 ${result}도`:`, 표시한 각을 구함`}`;
    return `<svg class="source52-p30e44-diagram" viewBox="0 0 ${width} ${height}" role="img" aria-label="${esc(aria)}" xmlns="http://www.w3.org/2000/svg"><g class="source52-p30e44-lines">${line("G","N")}${line("N","D")}${line("G","D")}${line("G","M")}${line("M","N")}${line("G","R")}${line("D","R")}${line("N","R")}${line("M","D")}</g>${given}${equalSideMark}${targets}${labelSet}</svg>`;
  }

  function makeQuestion(variant=0,difficultyOffset=0,reviewLocked=false) {
    const index=((variant%3)+3)%3,shape=model(index,difficultyOffset),theta=shape.given,center=180-2*theta,answers=[shape.answer1,center,30],names=["ㅁㄷㄴ","ㄱㄴㄷ","ㄴㄹㄷ"],answer=answers[index],d=[-1,0,1].includes(difficultyOffset)?difficultyOffset:0;
    const prompt=`<div class="source52-p30e44-question"><p>ㄱㄴ=ㄴㄷ인 삼각형 ㄱㄴㄷ의 바깥쪽에 각각 정삼각형 ㄱㄴㅁ과 ㄱㄷㄹ을 만들었습니다. ∠ㄴㄱㄷ=${theta}°일 때 그림의 ∠${names[index]}의 크기를 구하세요.</p>${diagram(shape)}<div class="source52-p30e44-workspace" role="group" aria-label="풀이 공간"><span>풀이</span><div></div></div></div>`;
    const steps=index===0?`<li>ㄱㄴ=ㄴㄷ이므로 ∠ㄱㄷㄴ=${theta}°, ∠ㄱㄴㄷ=180°−2×${theta}°=${center}°입니다.</li><li>△ㄱㄴㅁ이 정삼각형이므로 ㄴㅁ=ㄴㄷ이고 ∠ㅁㄴㄷ=60°+${center}°=${60+center}°입니다.</li><li>△ㅁㄴㄷ은 이등변삼각형이므로 ∠ㅁㄷㄴ=(180°−${60+center}°)÷2=<b>${answer}°</b>입니다.</li>`:index===1?`<li>ㄱㄴ=ㄴㄷ이므로 △ㄱㄴㄷ에서 두 밑각 ∠ㄴㄱㄷ과 ∠ㄱㄷㄴ은 각각 ${theta}°입니다.</li><li>세 각의 합이 180°이므로 ∠ㄱㄴㄷ=180°−2×${theta}°=<b>${answer}°</b>입니다.</li>`:`<li>ㄱㄴ=ㄴㄷ이고 정삼각형 ㄱㄷㄹ에서 ㄱㄹ=ㄷㄹ이며 ㄴㄹ은 공통입니다. 따라서 △ㄴㄱㄹ과 △ㄴㄷㄹ은 세 변이 각각 같아 합동입니다.</li><li>∠ㄱㄹㄴ=∠ㄴㄹㄷ이고, ∠ㄱㄹㄷ=60°이므로 ∠ㄴㄹㄷ=60°÷2=<b>30°</b>입니다.</li>`;
    const solution=`<div class="source52-p30e44-solution"><ol>${steps}</ol></div>`;
    return {prompt:`<div data-source-item="${sourceItemId}" data-source-item-id="${sourceItemId}" data-pool-index="${index}">${prompt}</div>`,answer:`${answer}°`,solution,sourceItemId,generator:generatorKey,generationMode:"fixed-verified-pool",verifiedPoolIndex:index,verifiedVariantCount:3,verifiedVariantTarget:3,verifiedVariantId:`${sourceItemId}:v${index}`,difficultyOffset:d,difficultyLevel:d+2,difficultyRank:d+2,variantProvenance:"synthetic-source-structure",sourceValuesExcluded:true,sourceStructurePreserved:true,answerVisualRequired:true,answerVisualStatus:reviewLocked?"locked":"verified-reconstruction",answerVisual:diagram(shape,true),publisherKeyVerified:false,publisherAnswerVerified:false,handwrittenAnswerVerified:false,answerVerification:"independent-sss-congruence-and-coordinate-angle",answerModel:shape,reviewLocked};
  }

  function install(target) {
    const api=target?.HSE_GENERATORS;
    if(!api||typeof api.generatorKey!=="function"||typeof api.generate!=="function")return false;
    if(api.__source52P30E44SyntheticInstalled)return true;
    const previousKey=api.generatorKey.bind(api),previousGenerate=api.generate.bind(api);
    const matches=type=>type&&(type.id===sourceItemId||type.sourceItemId===sourceItemId||type.generatorKey===generatorKey);
    api.generatorKey=type=>matches(type)?type.id===sourceItemId&&type.sourceItemId===sourceItemId&&type.generatorKey===generatorKey&&type.reviewLocked===false&&type.sourceVerified===true?generatorKey:"":previousKey(type);
    api.generate=(type,rank,difficulty,seed,variant=0)=>matches(type)?api.generatorKey(type)?makeQuestion(variant,difficulty??0,type.reviewLocked!==false):null:previousGenerate(type,rank,difficulty,seed,variant);
    if(Array.isArray(api.names)&&!api.names.includes(generatorKey))api.names.push(generatorKey);
    Object.defineProperty(api,"__source52P30E44SyntheticInstalled",{value:true});
    return true;
  }

  return Object.freeze({definition,pools,model,diagram,makeQuestion,install});
});
