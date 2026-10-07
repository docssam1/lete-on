/* Real, countable 3D manipulatives; exact maths lives in data/living-lessons.js.
   No image billboards. The village's articulated number guide shares its geometry cache. */
const copy={
 ko:{tenTitle:'10을 채우는 수',signedTitle:'0이 되는 한 쌍',tenAsk:'몇 개를 더 놓으면 10이 될까요?',signedAsk:'붉은 수와 검은 수를 합하면 얼마입니까?',
  guess:'먼저 답을 골라 보세요. 교구로 확인해도 좋아요.',right:'생각한 수가 맞아요. 이제 직접 옮겨 확인해 보세요.',try:'빈칸을 살펴보고 하나씩 옮겨 확인해 보세요.',signedRight:'예측이 맞습니다. 서로 반대인 두 수를 짝지어 확인해 보세요.',signedTry:'양수와 음수 한 개씩 짝지어 합이 0인 부분을 찾아보세요.',
  add:'한 개 옮기기',pair:'한 쌍 묶기',undo:'되돌리기',reset:'처음부터',next:'다른 수로',loading:'입체 교구를 준비하고 있어요',
  original:'처음 놓인 수',added:'직접 옮기는 수',positive:'양수 (+1)',negative:'음수 (−1)',fallback:'입체 화면을 사용할 수 없어 수 카드로 표시합니다. 아래 버튼으로 똑같이 조작할 수 있습니다.',
  scene:'입체 수 교구. 교구를 누르거나 아래 조작 버튼을 사용하세요.',tenDone:'열 칸을 모두 채웠어요. 모자란 수만큼 옮겼네요!',signedDone:'반대인 수를 한 쌍씩 묶어도 전체 합은 같습니다.',
  remaining:n=>`빈칸이 ${n}개 남았어요.`,paired:n=>`(+1)과 (−1)은 합이 0입니다. 지금 ${n}쌍을 옆으로 옮겼습니다.`,
  prediction:'예측한 답',choosePositive:'붉은 막대를 골랐습니다. 검은 막대를 눌러 한 쌍을 만드세요.',chooseNegative:'검은 막대를 골랐습니다. 붉은 막대를 눌러 한 쌍을 만드세요.',
  tenProof:(b,n)=>`${b}에 ${n}을 더하면 10. 10에서 ${n}을 빼면 ${b}.`,signedProof:(p,n)=>`붉은 막대 ${p}개, 검은 막대 ${n}개가 남았습니다.`},
 en:{tenTitle:'Partners that make 10',signedTitle:'A pair that makes zero',tenAsk:'How many more will make 10?',signedAsk:'What is the sum of the red and black numbers?',
  guess:'Make a prediction, then test it with the pieces.',right:'Good prediction. Move the pieces to check.',try:'Look at the spaces. Move one piece at a time to check.',signedRight:'Your prediction is correct. Pair opposite numbers to check.',signedTry:'Pair one positive with one negative to find a sum of zero.',
  add:'Move one',pair:'Pair opposites',undo:'Undo',reset:'Reset',next:'Try other numbers',loading:'Preparing the 3D pieces',original:'Starting number',added:'Moved pieces',positive:'Positive (+1)',negative:'Negative (−1)',
  fallback:'3D is unavailable. Number cards and the same controls remain available.',scene:'3D number pieces. Tap a piece or use the action buttons below.',tenDone:'All ten spaces are filled. You moved exactly the missing number!',signedDone:'Pairing opposite numbers leaves the total unchanged.',
  remaining:n=>`${n} spaces remain.`,paired:n=>`(+1) and (−1) make zero. ${n} pairs have been moved aside.`,prediction:'Your prediction',choosePositive:'Red selected. Tap a black rod to make a pair.',chooseNegative:'Black selected. Tap a red rod to make a pair.',
  tenProof:(b,n)=>`${b} + ${n} = 10, so 10 − ${n} = ${b}.`,signedProof:(p,n)=>`${p} red and ${n} black rods remain.`},
 zh:{tenTitle:'凑成10的好朋友',signedTitle:'和为0的一对',tenAsk:'再放几个就能凑成10？',signedAsk:'红色的数与黑色的数相加，和是多少？',
  guess:'先猜一猜，再动手验证。',right:'猜对了。动手移动棋子来验证吧。',try:'看看空格，一个一个移动来验证。',signedRight:'预测正确。把相反的数配对验证。',signedTry:'把一个正数和一个负数配成和为0的一对。',
  add:'移动一个',pair:'配成一对',undo:'撤回',reset:'重新开始',next:'换一组数',loading:'正在准备立体教具',original:'原来的数',added:'移入的数',positive:'正数 (+1)',negative:'负数 (−1)',
  fallback:'无法显示立体教具，改用数字卡片。下方按钮仍可进行相同操作。',scene:'立体数字教具。点击棋子或使用下方按钮。',tenDone:'十个格子都填满了！移入的个数正好是缺少的数。',signedDone:'将相反的数配对，总和不变。',
  remaining:n=>`还剩${n}个空格。`,paired:n=>`(+1)与(−1)的和为0。已移开${n}对。`,prediction:'预测的答案',choosePositive:'已选红色。点击黑色算筹组成一对。',chooseNegative:'已选黑色。点击红色算筹组成一对。',
  tenProof:(b,n)=>`${b}加${n}等于10，10减${n}等于${b}。`,signedProof:(p,n)=>`还剩${p}根红算筹和${n}根黑算筹。`}
};
const signed=n=>n>0?'+'+n:n<0?'−'+Math.abs(n):'0';

export async function mount(host,uid,lang,options={}){
 if(['A-02','M-02','T-DV4'].includes(uid))return (await import('./activity-journey.js')).mount(host,uid,lang,options);
 const api=window.NM_LIVING_LESSONS;if(!host||!host.isConnected||!api||!api.has(uid))return null;
 if(api.create(uid).kind==='hop')return (await import('./hop-lesson.js?v=20261007-frog')).mount(host,uid,lang);   /* 유아 수직선 뛰기(N-07) */
 if(!['ten','signed'].includes(api.create(uid).kind))return (await import('./strategy-lesson.js')).mount(host,uid,lang);
 if(host.__livingLesson)host.__livingLesson.dispose();
 const t=copy[lang]||copy.ko,ten=api.create(uid).kind==='ten';let state=api.create(uid),selected=null,visual=null,disposed=false;
 host.classList.add('nm-live-lesson');host.dataset.lesson=uid;
 host.innerHTML=`<header class="nm-live-head"><h2>${ten?t.tenTitle:t.signedTitle}</h2><span class="nm-live-round"></span></header>
  <p class="nm-live-question">${ten?t.tenAsk:t.signedAsk}</p>
  <div class="nm-live-stage"><div class="nm-live-loading" role="status">${t.loading}</div><div class="nm-live-fallback" aria-hidden="true"></div></div>
  <div class="nm-live-legend">${ten?`<span><i></i>${t.original}</span><span><i class="gold"></i>${t.added}</span>`:`<span><i class="red"></i>${t.positive}</span><span><i class="black"></i>${t.negative}</span>`}</div>
  <div class="nm-live-equation" role="status" aria-live="polite" aria-atomic="true"></div>
  <div class="nm-live-predict-label">${t.prediction}</div>
  <div class="nm-live-predict" role="group" aria-label="${t.prediction}"></div>
  <p class="nm-live-feedback" aria-live="polite"></p>
  <div class="nm-live-actions"><button class="primary" data-act="${ten?'add':'pair'}">${ten?t.add:t.pair}</button><button data-act="undo">${t.undo}</button><button data-act="reset">${t.reset}</button><button class="next" data-act="next">${t.next}</button></div>
  <div class="nm-live-evidence"></div><p class="nm-live-render-note" hidden>${t.fallback}</p>`;
 const $=sel=>host.querySelector(sel),stage=$('.nm-live-stage');
 const feedback=()=>{
  const v=api.snapshot(state);
  if(selected)return selected.sign==='positive'?t.choosePositive:t.chooseNegative;
  if(v.complete){
   if(v.prediction!==null&&v.prediction!==v.answer){
    if(lang==='ko')return ten?`${v.prediction}개로 예상했지만, ${v.answer}개를 옮겨야 10이 되네요.`:`예상한 값은 ${signed(v.prediction)}이지만, 남은 수는 ${signed(v.answer)}입니다. 0인 쌍을 옮겨도 합은 변하지 않습니다.`;
    if(lang==='zh')return `预测的是${v.prediction}，实际验证的答案是${v.answer}。`;
    return `You predicted ${v.prediction}. The pieces show that the answer is ${v.answer}.`;
   }
   return ten?t.tenDone:t.signedDone;
  }
  if(ten&&v.added)return t.remaining(v.remaining);
  if(!ten&&v.pairs)return t.paired(v.pairs);
  if(v.prediction===null)return !ten&&lang==='ko'?'먼저 답을 예측하고, 교구를 조작하여 확인하세요.':t.guess;
  return v.prediction===v.answer?(ten?t.right:t.signedRight):(ten?t.try:t.signedTry);
 };
 function update(rebuildChoices){
  if(disposed)return;
  const v=api.snapshot(state);host.dataset.complete=String(v.complete);host.dataset.total=v.total;host.dataset.round=v.round;
  $('.nm-live-round').textContent=`${v.round+1} / ${v.rounds}`;
  $('.nm-live-equation').textContent=ten?`${v.base} + ${v.added||(!v.complete?'□':0)} = ${v.added?v.total:10}`:`(${signed(v.positive)}) + (${signed(-v.negative)}) = ${v.pairs||v.complete?signed(v.total):'□'}`;
  $('.nm-live-feedback').textContent=feedback();
  $('.nm-live-evidence').textContent=ten?(v.complete?t.tenProof(v.base,v.added):''):(v.pairs?t.paired(v.pairs)+' '+t.signedProof(v.positiveLeft,v.negativeLeft):'');
  $('[data-act="'+(ten?'add':'pair')+'"]').disabled=v.complete;
  $('[data-act="undo"]').disabled=!(v.added||v.pairs);
  if(rebuildChoices){
   const choices=ten?[1,2,3,4,5]:[...new Set([v.answer,-v.answer,0,v.positive+v.negative])].sort((a,b)=>a-b);
   if(!ten&&choices.length<3)choices.push(-2);
   $('.nm-live-predict').innerHTML=choices.map(n=>`<button data-predict="${n}" aria-pressed="false">${ten?n:signed(n)}</button>`).join('');
  }
  host.querySelectorAll('[data-predict]').forEach(b=>{
   b.setAttribute('aria-pressed',String(+b.dataset.predict===v.prediction));
   b.classList.toggle('is-confirmed',v.complete&&+b.dataset.predict===v.answer);
   b.classList.toggle('is-revised',v.complete&&+b.dataset.predict===v.prediction&&v.prediction!==v.answer);
   b.disabled=v.complete;
  });
  $('.nm-live-fallback').innerHTML=ten?Array.from({length:10},(_,i)=>`<span class="${i<v.base?'filled':i<v.base+v.added?'new':''}">${i<v.base+v.added?'●':'○'}</span>`).join(''):
    `${Array.from({length:v.positiveLeft},()=>'<span class="red">+1</span>').join('')}${Array.from({length:v.negativeLeft},()=>'<span class="black">−1</span>').join('')}${v.complete&&!v.total?'<span>0</span>':''}`;
  if(visual)visual.sync(v);
 }
 function action(name,value){
  if(disposed)return;selected=null;
  state=api.act(state,name,value);update(name==='next'||name==='reset');
  if(visual&&name!=='predict')visual.respond();
 }
 function onClick(e){
  const b=e.target.closest('button');if(!b||!host.contains(b)||b.disabled)return;
  if(b.hasAttribute('data-predict'))action('predict',+b.dataset.predict);
  else if(b.dataset.act)action(b.dataset.act);
 }
 host.addEventListener('click',onClick);update(true);
 function dispose(){if(disposed)return;disposed=true;host.removeEventListener('click',onClick);observer.disconnect();if(visual)visual.dispose();delete host.__livingLesson;}
 const observer=new MutationObserver(()=>{if(!host.isConnected)dispose();});observer.observe(document.body,{childList:true,subtree:true});
 const controller={dispose,getState:()=>api.snapshot(state)};host.__livingLesson=controller;
 try{
  const [THREE,chars]=await Promise.all([import('../../world-explorer/vendor/three.module.js'),import('./char3d/char3d.js?v=20261003-dot-journeys')]);
  if(disposed||!host.isConnected)return controller;
  visual=createScene(stage,THREE,chars,ten,t,()=>api.snapshot(state),hit=>{
   if(ten){action('add',hit.index);return;}
   if(selected&&selected.sign!==hit.sign){action('pair',{[selected.sign]:selected.index,[hit.sign]:hit.index});return;}
   selected=hit;$('.nm-live-feedback').textContent=feedback();visual.select(hit);
  });
  visual.sync(api.snapshot(state),true);stage.dataset.renderer='webgl';
 }catch(e){
  if(visual)visual.dispose();visual=null;
  if(!disposed){stage.dataset.renderer='fallback';$('.nm-live-render-note').hidden=false;}
 }
 return controller;
}

function createScene(stage,T,chars,ten,text,getState,onHit){
 const canvas=document.createElement('canvas');canvas.setAttribute('role','img');canvas.setAttribute('aria-label',text.scene);
 const renderer=new T.WebGLRenderer({canvas,antialias:true,alpha:false,powerPreference:'low-power'});
 const onFailure=[()=>{renderer.dispose();renderer.forceContextLoss();canvas.remove();}];
 try{
 renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;
 renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;
 const scene=new T.Scene();scene.background=new T.Color('#ecece2');
 const camera=new T.PerspectiveCamera(34,1,.1,80),target=new T.Vector3(0,.25,.5);
 const geometries=new Set(),materials=new Set();
 onFailure.push(()=>{geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());});
 const geo=g=>(geometries.add(g),g),mat=m=>(materials.add(m),m);
 const material=(color,rough=.35)=>mat(new T.MeshPhysicalMaterial({color,roughness:rough,metalness:.04,clearcoat:.5,clearcoatRoughness:.25}));
 function roundBox(w,h,d,r){
  const shape=new T.Shape(),x=-w/2,y=-d/2;
  shape.moveTo(x+r,y);shape.lineTo(x+w-r,y);shape.quadraticCurveTo(x+w,y,x+w,y+r);shape.lineTo(x+w,y+d-r);shape.quadraticCurveTo(x+w,y+d,x+w-r,y+d);shape.lineTo(x+r,y+d);shape.quadraticCurveTo(x,y+d,x,y+d-r);shape.lineTo(x,y+r);shape.quadraticCurveTo(x,y,x+r,y);
  const bevel=Math.min(r/2,h/3);const g=new T.ExtrudeGeometry(shape,{depth:h-2*bevel,bevelEnabled:true,bevelSize:bevel,bevelThickness:bevel,bevelSegments:3,curveSegments:5});
  g.rotateX(-Math.PI/2);g.translate(0,bevel,0);return geo(g);
 }
 function mesh(g,m,x,y,z){const o=new T.Mesh(g,m);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;scene.add(o);return o;}
 const paper=material('#e3e1d2',.7),trayMat=material('#c1d5c3',.48),recess=material('#526e5c',.72),blue=material('#1575ac'),gold=material('#f5b935'),red=material('#c04730'),black=material('#303941');
 mesh(roundBox(12,.35,8,.35),paper,0,-.45,.4);
 const hemisphere=new T.HemisphereLight('#fffbea','#718a7e',2.05);scene.add(hemisphere);
 const sun=new T.DirectionalLight('#fff1d4',3.1);sun.position.set(-3,9,6);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);
 Object.assign(sun.shadow.camera,{left:-7,right:7,top:6,bottom:-6,near:1,far:25});sun.shadow.bias=-.0005;sun.shadow.normalBias=.025;scene.add(sun);
 const fill=new T.DirectionalLight('#d9eaff',1.3);fill.position.set(6,5,-3);scene.add(fill);
 const guide=chars.makeCharacter(T,{kind:'buddy',buddy:{number:0,color:'orange',hat:'wizard',cape:'purple'},height:2.15,blob:false,shadows:true});
 onFailure.push(()=>guide.dispose());
 guide.object.position.set(-3.6,-.08,-1.05);guide.face(.15);scene.add(guide.object);
 const pieces=[],spares=[],wells=[],zeroPairs=[];const pieceGeo=ten?roundBox(.69,.28,.68,.17):geo(new T.CapsuleGeometry(.13,1.3,6,12));
 const slot=i=>new T.Vector3(-1.75+(i%5)*.93,.13,-.65+Math.floor(i/5)*1.05);
 if(ten){
  mesh(roundBox(5.2,.18,2.65,.2),trayMat,.1,-.09,-.1);
  const wellGeo=roundBox(.80,.04,.80,.16);
  for(let i=0;i<10;i++){const p=slot(i);wells.push(mesh(wellGeo,recess,p.x,.10,p.z));pieces.push(mesh(pieceGeo,blue,p.x,p.y,p.z));}
  for(let i=0;i<5;i++){const o=mesh(pieceGeo,gold,-1.7+i*.9,-.02,2.15);o.userData.index=i;spares.push(o);}
 }else{
  mesh(roundBox(5.5,.15,3.05,.2),trayMat,.1,-.1,-.1);
  for(let i=0;i<8;i++){const sign=i<4?'positive':'negative',j=i%4;const o=mesh(pieceGeo,material(i<4?'#c04730':'#303941'),(i<4?-1.95:1.0)+j*.35,.16,-.1);o.rotation.x=Math.PI/2;o.userData.sign=sign;o.userData.index=j;pieces.push(o);}
  const zeroGeo=roundBox(.66,.025,.64,.12);
  for(let i=0;i<4;i++)zeroPairs.push(mesh(zeroGeo,recess,-1.65+i*1.13,-.065,2.02));
 }
 stage.appendChild(canvas);
 let disposed=false,raf=0,visible=true,last=0,time=0,motionEnd=0,shownRound=-1,highlight=null;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)'),poses=new Map();
 const pointer=new T.Vector2(),ray=new T.Raycaster();let down=null;
 function resize(){if(disposed)return;const w=Math.max(1,stage.clientWidth),h=Math.max(1,stage.clientHeight);renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();
  const width=9.6,dist=width/(2*Math.tan(T.MathUtils.degToRad(17))*camera.aspect);const d=Math.max(dist,11.5);
  camera.position.set(.1,d*.62,d*.8+.5);camera.lookAt(target);wake();}
 function destination(o,p,immediate){
  const prev=poses.get(o);
  if(!immediate&&!reduced.matches&&prev&&prev.to.equals(p))return;
  const snap=immediate||reduced.matches||o.position.distanceToSquared(p)<1e-9;
  poses.set(o,{from:snap?p.clone():o.position.clone(),to:p,start:performance.now()-(snap?550:0)});
  if(snap)o.position.copy(p);
 }
 function sync(v,immediate){
  if(disposed)return;highlight=null;
  const reset=immediate||shownRound!==v.round;shownRound=v.round;
  if(ten){
   for(let i=0;i<10;i++){const o=pieces[i];o.visible=i<v.base;destination(o,slot(i),reset);o.userData.active=false;}
   for(let i=0;i<5;i++){const o=spares[i],movedIndex=v.moved.indexOf(i);o.visible=true;o.userData.active=movedIndex<0&&!v.complete;
    destination(o,movedIndex<0?new T.Vector3(-1.7+i*.9,-.02,2.15):slot(v.base+movedIndex),reset);}
  }else{
   pieces.forEach((o,i)=>{const j=i%4,pos=i<4,count=pos?v.positive:v.negative;o.visible=j<count;
    const pairIndex=v.paired.findIndex(pair=>pair[pos?'positive':'negative']===j),paired=pairIndex>=0;o.userData.active=o.visible&&!paired;
    const p=paired?new T.Vector3(-1.8+pairIndex*1.13+(pos?0:.26),.12,2.02):new T.Vector3((pos?-1.95:1.0)+j*.35,.16,-.1);
    destination(o,p,reset);o.rotation.x=Math.PI/2;o.scale.setScalar(paired?.66:1);
   });zeroPairs.forEach((o,i)=>o.visible=i<v.pairs);
  }
  motionEnd=reduced.matches?0:performance.now()+650;wake();
 }
 function frame(now){
  raf=0;if(disposed)return;if(!stage.isConnected){dispose();return;}
  if(document.hidden||!visible)return;
  const dt=Math.min(.05,(now-(last||now))/1000);last=now;time+=dt;
  for(const [o,p]of poses){const f=reduced.matches?1:Math.min(1,(now-p.start)/550),e=f*f*(3-2*f);o.position.lerpVectors(p.from,p.to,e);if(f<1)o.position.y+=Math.sin(f*Math.PI)*.56;}
  if(!reduced.matches)guide.update(dt,time);
  if(!ten)for(const o of pieces)o.material.emissive.set(highlight&&highlight.sign===o.userData.sign&&highlight.index===o.userData.index?'#775219':'#000000');
  renderer.render(scene,camera);
  if(!reduced.matches||now<motionEnd)raf=requestAnimationFrame(frame);
 }
 function wake(){if(!disposed&&!raf&&visible&&!document.hidden){last=performance.now();raf=requestAnimationFrame(frame);}}
 function hit(e){
  const rect=canvas.getBoundingClientRect();pointer.set((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1);ray.setFromCamera(pointer,camera);
  const active=(ten?spares:pieces).filter(o=>o.visible&&o.userData.active);
  const pick=ray.intersectObjects(active,false)[0];if(pick)onHit({sign:pick.object.userData.sign,index:pick.object.userData.index});
 }
 const onDown=e=>{down={x:e.clientX,y:e.clientY};},onUp=e=>{if(down&&Math.hypot(e.clientX-down.x,e.clientY-down.y)<12)hit(e);down=null;},onCancel=()=>{down=null;};
 canvas.addEventListener('pointerdown',onDown);canvas.addEventListener('pointerup',onUp);canvas.addEventListener('pointercancel',onCancel);
 const ro=new ResizeObserver(resize);ro.observe(stage);
 const io=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)wake();else{cancelAnimationFrame(raf);raf=0;}},{threshold:.02});io.observe(stage);
 const onVisibility=()=>{if(document.hidden){cancelAnimationFrame(raf);raf=0;}else wake();};document.addEventListener('visibilitychange',onVisibility);
 const onReduce=()=>{motionEnd=0;wake();};reduced.addEventListener('change',onReduce);
 const contextLost=e=>{e.preventDefault();stage.dataset.renderer='fallback';const note=stage.parentElement.querySelector('.nm-live-render-note');if(note)note.hidden=false;dispose();};canvas.addEventListener('webglcontextlost',contextLost);
 function dispose(){
  if(disposed)return;disposed=true;cancelAnimationFrame(raf);ro.disconnect();io.disconnect();document.removeEventListener('visibilitychange',onVisibility);reduced.removeEventListener('change',onReduce);
  canvas.removeEventListener('pointerdown',onDown);canvas.removeEventListener('pointerup',onUp);canvas.removeEventListener('pointercancel',onCancel);canvas.removeEventListener('webglcontextlost',contextLost);
  guide.dispose();geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());if(sun.shadow.map)sun.shadow.map.dispose();renderer.dispose();renderer.forceContextLoss();canvas.remove();
 }
 resize();
 return {sync,select:sign=>{highlight=sign;wake();},respond:()=>{if(!reduced.matches)guide.wave();wake();},dispose};
 }catch(e){for(const release of onFailure.reverse()){try{release();}catch(ignore){}}throw e;}
}
