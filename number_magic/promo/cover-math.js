/* Adapted from about.html:initHeroShow: readable DOM equation + travelling gold
 * particles, not a new curriculum. Original 8+7→10+5→15; user-selected cover
 * sequence is 5+7→2+3+7→2+10→12. All four expressions equal twelve. */
(function(){
 'use strict';
 const host=document.querySelector('#coverMath');if(!host)return;
 const canvas=host.querySelector('canvas'),ctx=canvas.getContext('2d'),tokens=Object.fromEntries([...host.querySelectorAll('[data-token]')].map(el=>[el.dataset.token,el]));
 const reduced=matchMedia('(prefers-reduced-motion:reduce)'),expressions=['5 + 7','2 + 3 + 7','2 + 10','12'];
 const LOOP=8200;let active=true,raf=0,start=null,elapsed=0,W=1,H=1;
 const smooth=(t,a,b)=>{const x=Math.max(0,Math.min(1,(t-a)/(b-a)));return x*x*(3-2*x);};
 const blend=(a,b,p)=>a+(b-a)*p;
 function token(id,x,opacity,y=0,scale=1){const el=tokens[id];el.style.left='0';el.style.opacity=Math.max(0,Math.min(1,opacity));el.style.transform='translate('+Math.round(x*W)+'px, calc(-50% + '+y+'px)) translateX(-50%) scale('+scale+')';}
 function render(time){
  if(reduced.matches){host.dataset.step='static';host.dataset.expression=expressions.join(' = ');ctx.clearRect(0,0,W,H);return;}
  const t=((time%LOOP)+LOOP)%LOOP,split=smooth(t,1200,2100),gather=smooth(t,3400,4300),finish=smooth(t,5400,6300),reset=smooth(t,7500,8100),show=1-reset;
  const step=t<1700?0:t<3850?1:t<5850?2:3;host.dataset.step=String(step);host.dataset.expression=expressions[step];
  token('five',.26,(1-split)*show);token('two',blend(.26,.13,split)+(gather*.13),split*(1-finish)*show);
  token('plusA',.32,split*(1-gather)*show);token('three',blend(.26,.50,split)+gather*.24,split*(1-gather)*(1-finish)*show,-Math.sin(gather*Math.PI)*H*.12);
  token('plusB',blend(.50,.68,split)-gather*.18,(1-finish)*show);token('seven',blend(.74,.87,split)-gather*.13,(1-gather)*(1-finish)*show);
  token('ten',.74,gather*(1-finish)*show);token('twelve',.50,finish*show,0,.94+.06*finish);
  ctx.clearRect(0,0,W,H);
  for(let i=0;i<36;i++){const x=((i*73+29)%101)/101*W,y=((i*43+11)%97)/97*H,a=(.25+.18*Math.sin(t*.0011+i))*show;ctx.globalAlpha=a;ctx.fillStyle=i%3?'#efd397':'#fff7e0';ctx.beginPath();ctx.arc(x,y,i%4===0?1.1:.65,0,Math.PI*2);ctx.fill();}
  if(gather>0&&gather<1){for(let i=0;i<3;i++){const p=Math.max(0,Math.min(1,gather+i*.055));ctx.globalAlpha=Math.sin(p*Math.PI)*.8;ctx.fillStyle='#ffe9a9';ctx.beginPath();ctx.arc(blend(.50,.76,p)*W,H*.43-Math.sin(p*Math.PI)*H*.19+i*4,1.5,0,Math.PI*2);ctx.fill();}}
  const burst=smooth(t,6050,7200);if(burst>0&&burst<1){for(let i=0;i<20;i++){const a=i*Math.PI*.618*2,d=(15+(i%5)*7)*burst;ctx.globalAlpha=(1-burst)*show*.75;ctx.fillStyle='#ffdf89';ctx.beginPath();ctx.arc(W*.5+Math.cos(a)*d,H*.43+Math.sin(a)*d,1+(i%3)*.3,0,Math.PI*2);ctx.fill();}}
  ctx.globalAlpha=1;
 }
 function resize(){const r=host.querySelector('.cover-equation').getBoundingClientRect(),h=host.getBoundingClientRect();W=Math.max(1,r.width);H=Math.max(1,h.height);const dpr=Math.min(devicePixelRatio||1,1.5);canvas.width=Math.round(W*dpr);canvas.height=Math.round(H*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);render(elapsed);}
 function stop(){if(raf)cancelAnimationFrame(raf);raf=0;start=null;host.dataset.running='false';}
 function tick(ts){if(!active||document.hidden||reduced.matches){stop();return;}if(start===null)start=ts-elapsed;elapsed=(ts-start)%LOOP;render(elapsed);raf=requestAnimationFrame(tick);}
 function sync(){stop();if(active&&!document.hidden&&!reduced.matches){host.dataset.running='true';raf=requestAnimationFrame(tick);}else if(reduced.matches){host.dataset.step='static';host.dataset.expression=expressions.join(' = ');}}
 const observer=new ResizeObserver(resize);observer.observe(host);reduced.addEventListener('change',sync);document.addEventListener('visibilitychange',sync);
 window.NMCoverMath={setActive(value){active=Boolean(value);sync();},getState(){return{active,running:Boolean(raf),elapsed,expression:host.dataset.expression,step:host.dataset.step};},seek(time){elapsed=time;start=null;render(time);}};
 resize();sync();
})();
