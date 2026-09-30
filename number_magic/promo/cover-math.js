/* The about.html gold-star motif, with the requested visible regrouping:
 * 8+7 -> 8+2+5 -> 10+5 -> 15. Digits split and move; whole formulas do not
 * simply crossfade. Text/typography around this component belongs to the page. */
(function(){
 'use strict';
 const host=document.querySelector('#coverMath');if(!host)return;
 const canvas=host.querySelector('canvas'),ctx=canvas&&canvas.getContext('2d');if(!ctx)return;
 const equation=host.querySelector('.cover-equation');if(!equation)return;
 const tokenSpec=[['eight','8'],['plusA','+'],['seven','7'],['two','2'],['plusB','+'],['five','5'],['ten','10'],['fifteen','15']];
 // Tolerate an older cached document while keeping a single node per digit.
 if(equation.dataset.animation!=='regrouping'||!equation.querySelector('[data-token="two"]')){
  equation.dataset.animation='regrouping';
  equation.innerHTML=tokenSpec.map(([id,text])=>'<span class="cover-number'+(text==='+'?' cover-eq-op':'')+(id==='two'?' is-transfer':'')+'" data-token="'+id+'">'+text+'</span>').join('');
 }
 const tokens=Object.fromEntries(tokenSpec.map(([id])=>[id,equation.querySelector('[data-token="'+id+'"]')]));
 const eqStatic=host.querySelector('.cover-math-static'),expressions=['8 + 7','8 + 2 + 5','10 + 5','15'];
 if(eqStatic)eqStatic.replaceChildren(...expressions.map((expression,index)=>{const line=document.createElement('span');line.textContent=(index?' = ':'')+expression;return line;}));
 const reduced=matchMedia('(prefers-reduced-motion:reduce)');
 const LOOP=9600,TRAVEL_START=4000,TRAVEL_END=5000,BURST_START=7500,BURST_END=8900;
 const stars=Array.from({length:140},()=>({x:Math.random(),y:Math.random()*.9,r:Math.random()*1.3+.4,sp:Math.random()*.8+.3,ph:Math.random()*Math.PI*2,baseA:Math.random()*.5+.35,gold:Math.random()<.6}));
 const burstParticles=Array.from({length:44},()=>({a:Math.random()*Math.PI*2,sp:36+Math.random()*88,r:Math.random()*2+1,drop:16+Math.random()*36}));
 let active=true,intersecting=true,raf=0,start=null,elapsed=0,W=1,H=1,EW=1,EH=1,EX=0,EY=0;
 function smooth(t,a,b){if(t<=a)return 0;if(t>=b)return 1;const p=(t-a)/(b-a);return p*p*(3-2*p);}
 function mix(a,b,p){return a+(b-a)*p;}
 function phase(time){return((time%LOOP)+LOOP)%LOOP;}
 function token(id,x,opacity,y=0,scale=1){
  const el=tokens[id];el.style.opacity=Math.max(0,Math.min(1,opacity));
  el.style.transform='translate3d('+(x*EW).toFixed(3)+'px,'+y.toFixed(3)+'px,0) translate(-50%,-50%) scale('+scale.toFixed(4)+')';
 }
 function drawStars(t,animate){
  ctx.clearRect(0,0,W,H);
  for(const s of stars){
   const tw=animate?.35+.65*(.5+.5*Math.sin(t*.0011*s.sp+s.ph)):.55+.45*s.baseA;
   ctx.globalAlpha=tw*s.baseA;ctx.fillStyle=s.gold?'#F5D98B':'#EAF2FF';ctx.beginPath();ctx.arc(s.x*W,s.y*H,s.r,0,Math.PI*2);ctx.fill();
  }
  ctx.globalAlpha=1;
 }
 function drawGlowDot(x,y,r,alpha){
  const g=ctx.createRadialGradient(x,y,0,x,y,r*4.2);
  g.addColorStop(0,'rgba(245,217,139,'+(.9*alpha)+')');g.addColorStop(1,'rgba(245,217,139,0)');
  ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r*4.2,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='rgba(255,247,224,'+alpha+')';ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();
 }
 function drawTravel(t,x,y){
  if(t<TRAVEL_START||t>TRAVEL_END)return;
  const p=(t-TRAVEL_START)/(TRAVEL_END-TRAVEL_START),fade=smooth(p,0,.12)*(1-smooth(p,.82,1));
  [-7,7].forEach(off=>drawGlowDot(EX+x*EW+off,EY+EH/2+y-EH*.18,2.1,fade));
 }
 function drawBurst(t){
  if(t<BURST_START||t>BURST_END)return;
  const p=(t-BURST_START)/(BURST_END-BURST_START),fade=1-p;
  for(const b of burstParticles){const dist=b.sp*p;ctx.globalAlpha=fade;ctx.fillStyle='#F5D98B';ctx.beginPath();ctx.arc(EX+EW*.5+Math.cos(b.a)*dist,EY+EH/2+Math.sin(b.a)*dist+b.drop*p*p,b.r,0,Math.PI*2);ctx.fill();}
  ctx.globalAlpha=1;
 }
 function initial(opacity){
  token('eight',.27,opacity);token('plusA',.5,opacity);token('seven',.73,opacity);
  token('two',.73,0);token('plusB',.69,0);token('five',.73,0);token('ten',.27,0);token('fifteen',.5,0);
 }
 function render(time){
  if(reduced.matches){
   equation.style.visibility='hidden';if(eqStatic)eqStatic.style.display='block';
   host.dataset.step='static';host.dataset.expression=expressions.join(' = ');drawStars(0,false);return;
  }
  equation.style.visibility='';if(eqStatic)eqStatic.style.display='none';
  const t=phase(time);drawStars(t,true);
  // Each completed expression gets a readable hold, with a continuous reset.
  if(t>=9200){initial(smooth(t,9200,9600));host.dataset.step='0';host.dataset.expression=expressions[0];return;}
  const split=smooth(t,1600,2500),sevenOut=smooth(t,1600,1940),splitIn=smooth(t,1850,2280);
  const gather=smooth(t,4000,5000),merge=smooth(t,4700,5100),removePlus=smooth(t,4000,4400);
  const finish=smooth(t,6500,7250),finishOut=smooth(t,6900,7350),result=smooth(t,7050,7450),show=1-smooth(t,8900,9200);
  const twoX=mix(mix(.73,.5,split),.27,gather),arc=-Math.sin(gather*Math.PI)*Math.min(32,EH*.28);
  token('eight',mix(mix(.27,.12,split),.27,gather),(1-merge)*show);
  token('plusA',mix(mix(.5,.31,split),.27,gather),(1-removePlus)*show);
  token('seven',.73,(1-sevenOut)*show,0,1-.1*sevenOut);
  token('two',twoX,splitIn*(1-merge)*show,arc,1+.06*Math.sin(gather*Math.PI));
  token('plusB',mix(.69,.5,gather),splitIn*(1-smooth(t,6500,6850))*show);
  token('five',mix(mix(mix(.73,.88,split),.73,gather),.5,finish),splitIn*(1-finishOut)*show);
  token('ten',mix(.27,.5,finish),merge*(1-finishOut)*show);
  token('fifteen',.5,result*show,0,.95+.05*result);
  drawTravel(t,twoX,arc);drawBurst(t);
  const step=t<2050?0:t<4900?1:t<7250?2:3;
  host.dataset.step=String(step);host.dataset.expression=expressions[step];
 }
 function resize(){
  const width=canvas.clientWidth,height=canvas.clientHeight;if(!width||!height)return;
  W=width;H=height;const dpr=Math.min(devicePixelRatio||1,2);
  canvas.width=Math.max(1,Math.round(W*dpr));canvas.height=Math.max(1,Math.round(H*dpr));ctx.setTransform(dpr,0,0,dpr,0,0);
  // Cache the untransformed equation box; the whole book can rotate independently.
  EW=Math.max(1,equation.clientWidth);EH=Math.max(1,equation.clientHeight);EX=0;EY=0;
  let node=equation;while(node&&node!==host){EX+=node.offsetLeft;EY+=node.offsetTop;node=node.offsetParent;}
  render(elapsed);
 }
 function stop(){if(raf)cancelAnimationFrame(raf);raf=0;start=null;host.dataset.running='false';}
 function tick(ts){
  if(!active||!intersecting||document.hidden||reduced.matches){stop();return;}
  if(start===null)start=ts-elapsed;elapsed=phase(ts-start);render(elapsed);raf=requestAnimationFrame(tick);
 }
 function sync(){stop();render(elapsed);if(active&&intersecting&&!document.hidden&&!reduced.matches){host.dataset.running='true';raf=requestAnimationFrame(tick);}}
 const observer=new ResizeObserver(resize);observer.observe(host);observer.observe(equation);
 const visibility=new IntersectionObserver(entries=>{intersecting=entries.some(entry=>entry.isIntersecting);sync();},{threshold:.05});visibility.observe(host);
 reduced.addEventListener('change',()=>{sync();resize();});document.addEventListener('visibilitychange',sync);
 if(document.fonts)document.fonts.ready.then(resize);
 window.NMCoverMath={
  setActive(value){active=Boolean(value);sync();},
  getState(){return{active,running:Boolean(raf),elapsed,expression:host.dataset.expression,step:host.dataset.step,loop:LOOP,source:'about.html:initHeroShow',sequence:'visible-regrouping'};},
  seek(time){elapsed=phase(Number(time)||0);start=null;render(elapsed);}
 };
 resize();sync();
})();
