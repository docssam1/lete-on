/* The actual about.html:initHeroShow, fitted to the book cover.
 * Preserve its equation, 7.4-second timing, two travelling stars and final burst.
 * Only lifecycle control and cached local coordinates are added for the book. */
(function(){
 'use strict';
 const host=document.querySelector('#coverMath');if(!host)return;
 const canvas=host.querySelector('canvas'),ctx=canvas&&canvas.getContext('2d');if(!ctx)return;
 const equation=host.querySelector('.cover-equation');if(!equation)return;
 // Old cached HTML must not leave the earlier 5+7 adaptation on this cover.
 if(!equation.querySelector('[data-equation="a"]'))equation.innerHTML='<span class="cover-eq-line" data-equation="a"><span data-token="eight">8</span><span class="cover-eq-op" data-token="plusA">+</span><span data-token="seven">7</span></span><span class="cover-eq-line" data-equation="b"><span data-token="ten">10</span><span class="cover-eq-op" data-token="plusB">+</span><span data-token="five">5</span></span><span class="cover-eq-line" data-equation="c"><span data-token="fifteen">15</span></span>';
 const eqA=equation.querySelector('[data-equation="a"]'),eqB=equation.querySelector('[data-equation="b"]'),eqC=equation.querySelector('[data-equation="c"]');
 const lines=[eqA,eqB,eqC],dig7=eqA.querySelector('[data-token="seven"]'),dig8=eqA.querySelector('[data-token="eight"]');
 const eqStatic=host.querySelector('.cover-math-static'),caption=host.querySelector('.cover-math-caption');
 const expressions=['8 + 7','10 + 5','15'];
 if(eqStatic)eqStatic.textContent=expressions.join(' = ');
 if(caption)caption.textContent='수는, 펼치면 쉬워진다';
 const reduced=matchMedia('(prefers-reduced-motion:reduce)');
 const LOOP=7400,TRAVEL_START=2100,TRAVEL_END=2950,BURST_START=4700,BURST_END=6300;
 const stars=Array.from({length:140},()=>({x:Math.random(),y:Math.random()*.9,r:Math.random()*1.3+.4,sp:Math.random()*.8+.3,ph:Math.random()*Math.PI*2,baseA:Math.random()*.5+.35,gold:Math.random()<.6}));
 const burstParticles=Array.from({length:44},()=>({a:Math.random()*Math.PI*2,sp:36+Math.random()*88,r:Math.random()*2+1,drop:16+Math.random()*36}));
 let active=true,intersecting=true,raf=0,start=null,elapsed=0,W=1,H=1,anchors=null;
 function smooth01(t,a,b){if(t<=a)return 0;if(t>=b)return 1;const x=(t-a)/(b-a);return x*x*(3-2*x);}
 function fadeWin(t,inA,inB,outA,outB){return Math.min(smooth01(t,inA,inB),1-smooth01(t,outA,outB));}
 function phase(time){return((time%LOOP)+LOOP)%LOOP;}
 // Offsets ignore the cover's own 3D transform. Read them only on resize/font
 // load, not during every animation frame (the original measured each frame).
 function localCenter(el){
  let x=el.offsetWidth/2,y=el.offsetHeight/2,node=el;
  while(node&&node!==host){x+=node.offsetLeft;y+=node.offsetTop;node=node.offsetParent;}
  return{x,y};
 }
 function scaledCenter(point,scale){return{x:anchors.a.x+(point.x-anchors.a.x)*scale,y:anchors.a.y+(point.y-anchors.a.y)*scale};}
 function drawStars(t,animate){
  ctx.clearRect(0,0,W,H);
  for(const s of stars){
   const tw=animate?.35+.65*(.5+.5*Math.sin(t*.0011*s.sp+s.ph)):.55+.45*s.baseA;
   ctx.globalAlpha=tw*s.baseA;ctx.fillStyle=s.gold?'#F5D98B':'#EAF2FF';
   ctx.beginPath();ctx.arc(s.x*W,s.y*H,s.r,0,Math.PI*2);ctx.fill();
  }
  ctx.globalAlpha=1;
 }
 function drawGlowDot(x,y,r,alpha){
  const g=ctx.createRadialGradient(x,y,0,x,y,r*4.2);
  g.addColorStop(0,'rgba(245,217,139,'+(.9*alpha)+')');g.addColorStop(1,'rgba(245,217,139,0)');
  ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r*4.2,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='rgba(255,247,224,'+alpha+')';ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();
 }
 function drawTravel(t,scale){
  if(!anchors||t<TRAVEL_START||t>TRAVEL_END)return;
  const p=(t-TRAVEL_START)/(TRAVEL_END-TRAVEL_START),e=p<.5?4*p*p*p:1-Math.pow(-2*p+2,3)/2;
  const from=scaledCenter(anchors.seven,scale),to=scaledCenter(anchors.eight,scale),arc=-Math.sin(p*Math.PI)*44;
  const edge=smooth01(p,0,.12)*(1-smooth01(p,.88,1));
  [-7,7].forEach(off=>drawGlowDot(from.x+(to.x-from.x)*e+off*(1-Math.abs(p-.5)*.7),from.y+(to.y-from.y)*e+arc,2.1,.4+.6*edge+.4*(1-edge)));
 }
 function drawBurst(t){
  if(!anchors||t<BURST_START||t>BURST_END)return;
  const p=(t-BURST_START)/(BURST_END-BURST_START),fade=Math.max(0,1-p),c=anchors.c;
  for(const b of burstParticles){const dist=b.sp*p;ctx.globalAlpha=fade;ctx.fillStyle='#F5D98B';ctx.beginPath();ctx.arc(c.x+Math.cos(b.a)*dist,c.y+Math.sin(b.a)*dist+b.drop*p*p,b.r,0,Math.PI*2);ctx.fill();}
  ctx.globalAlpha=1;
 }
 function render(time){
  if(reduced.matches){
   lines.forEach(el=>{el.style.display='none';});if(eqStatic)eqStatic.style.display='block';
   host.dataset.step='static';host.dataset.expression=expressions.join(' = ');drawStars(0,false);return;
  }
  lines.forEach(el=>{el.style.display='';});if(eqStatic)eqStatic.style.display='none';
  const t=phase(time),opacities=[fadeWin(t,0,600,2500,3000),fadeWin(t,2700,3200,4000,4400),fadeWin(t,4300,4700,6100,6400)];
  const largest=Math.max(...opacities),step=largest>0?opacities.indexOf(largest):(t<2700?0:t<4300?1:2);
  host.dataset.step=String(step);host.dataset.expression=expressions[step];
  drawStars(t,true);drawTravel(t,.94+.06*opacities[0]);drawBurst(t);
  lines.forEach((el,i)=>{el.style.opacity=opacities[i];el.style.transform='scale('+(.94+.06*opacities[i])+')';});
 }
 function resize(){
  const width=canvas.clientWidth,height=canvas.clientHeight;if(!width||!height)return;
  W=width;H=height;const dpr=Math.min(devicePixelRatio||1,2);
  canvas.width=Math.max(1,Math.round(W*dpr));canvas.height=Math.max(1,Math.round(H*dpr));ctx.setTransform(dpr,0,0,dpr,0,0);
  anchors={a:localCenter(eqA),c:localCenter(eqC),seven:localCenter(dig7),eight:localCenter(dig8)};render(elapsed);
 }
 function stop(){if(raf)cancelAnimationFrame(raf);raf=0;start=null;host.dataset.running='false';}
 function tick(ts){
  if(!active||!intersecting||document.hidden||reduced.matches){stop();return;}
  if(start===null)start=ts-elapsed;elapsed=phase(ts-start);render(elapsed);raf=requestAnimationFrame(tick);
 }
 function sync(){stop();render(elapsed);if(active&&intersecting&&!document.hidden&&!reduced.matches){host.dataset.running='true';raf=requestAnimationFrame(tick);}}
 const observer=new ResizeObserver(resize);observer.observe(host);
 const visibility=new IntersectionObserver(entries=>{intersecting=entries.some(entry=>entry.isIntersecting);sync();},{threshold:.05});visibility.observe(host);
 reduced.addEventListener('change',()=>{sync();resize();});document.addEventListener('visibilitychange',sync);
 if(document.fonts)document.fonts.ready.then(resize);
 window.NMCoverMath={
  setActive(value){active=Boolean(value);sync();},
  getState(){return{active,running:Boolean(raf),elapsed,expression:host.dataset.expression,step:host.dataset.step,loop:LOOP,source:'about.html:initHeroShow'};},
  seek(time){elapsed=phase(Number(time)||0);start=null;render(elapsed);}
 };
 resize();sync();
})();
