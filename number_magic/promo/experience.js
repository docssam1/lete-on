/* Numbers of Magic advertisement manipulatives, 2026-09.
 * Provenance: user's confirmed promo topics (equal sharing of ten; multiply to ten),
 * existing C-02's multiply-to-ten relation, M-series reciprocal / calculus concepts.
 * These are labelled concept previews, NOT replacement lessons or generators.
 * API: NMPromoExperience.create(host, {mode}) -> setMode, setActive, capture, destroy, getState.
 * Dependencies: the same local Three.js used by app/town3d. No CDN or tracking.
 */
(function () {
  'use strict';
  const scriptURL = document.currentScript ? document.currentScript.src : new URL('experience.js', location.href).href;
  const threeURL = new URL('../../world-explorer/vendor/three.module.js', scriptURL).href;
  let threePromise;
  const modes = ['preschool', 'elementary', 'middle', 'high'];
  const aliases = { split: 'preschool', multiply: 'elementary', reciprocal: 'middle', calculus: 'high', kinder:'preschool', primary:'elementary', secondary:'middle' };
  const tr=(ko,en,zh)=>window.NMPromoI18n?window.NMPromoI18n.text(ko,en,zh):ko;
  const titles = { preschool:{ko:'두 접시를 똑같이 만들기',en:'Share equally between two plates',zh:'把两个盘子分得一样多'}, elementary:{ko:'곱하여 10이 되는 수',en:'Numbers that multiply to ten',zh:'乘积为10的数'}, middle:{ko:'두 수의 곱은 일정합니다',en:'The product stays constant',zh:'两个数的乘积保持不变'}, high:{ko:'조각을 모아 넓이 구하기',en:'Add pieces to estimate an area',zh:'拼合小块，估算面积'} };
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const normalizeMode = m => modes.includes(m) ? m : aliases[m] || 'preschool';
  const fmt = n => Number.isInteger(n) ? String(n) : String(Number(n.toFixed(2)));
  function create(host, options) {
    if (!host || !(host instanceof Element)) throw new TypeError('A host element is required.');
    const state = {mode:normalizeMode(options && options.mode), left:3, total:10, a:2, b:1, k:6, xIndex:5, divisions:8};
    let active = true, destroyed = false, T, renderer, scene, camera, model;
    let raf = 0, previousTime = 0, moving = [], rayTargets = [], resizeObserver;
    let renderNeeded = true;
    const root = document.createElement('div');
    root.className = 'nm-experience';
    if(options && options.compact)root.classList.add('is-compact');
    root.innerHTML = '<div class="nm-experience__stage"><canvas aria-hidden="true"></canvas><span class="nm-experience__badge">개념 미리보기 · 직접 해보기</span><div class="nm-experience__fallback"></div><div class="nm-experience__equation" aria-live="polite" aria-atomic="true"></div></div><p class="nm-experience__instruction"></p><div class="nm-experience__controls"></div><p class="nm-experience__feedback" aria-live="polite"></p>';
    host.append(root);
    const stage=root.querySelector('.nm-experience__stage'), canvas=root.querySelector('canvas'), fallback=root.querySelector('.nm-experience__fallback');
    const equation=root.querySelector('.nm-experience__equation'), instruction=root.querySelector('.nm-experience__instruction'), controls=root.querySelector('.nm-experience__controls'), feedback=root.querySelector('.nm-experience__feedback');
    function button(label, action, value) { return '<button type="button" data-xp-action="'+action+'"'+(value===undefined?'':' data-xp-value="'+value+'"')+'>'+label+'</button>'; }
    function updateUI() {
      root.dataset.mode=state.mode;
      root.classList.toggle('is-solved',state.mode==='preschool'&&state.left===5);
      root.setAttribute('role','group'); root.setAttribute('aria-label',window.NMPromoI18n?window.NMPromoI18n.pick(titles[state.mode]):titles[state.mode].ko);
      root.querySelector('.nm-experience__badge').textContent=tr('개념 미리보기 · 직접 해보기','Explore a concept · try it','概念预览 · 动手试试');
      if (state.mode==='preschool') {
        equation.innerHTML=state.left===5?tr('<b>5개씩</b> 똑같아요!','<b>5 each</b> — equal!','<b>各5颗</b>，一样多！'):'<b>'+state.left+'</b>'+tr('개','','颗')+' <span class="nm-experience__operator">·</span> <b>'+(10-state.left)+'</b>'+tr('개','','颗');
        instruction.textContent=tr('구슬을 옮겨 두 친구에게 똑같이 나누어 주세요.','Move the beads to share equally between two friends.','移动珠子，平均分给两个朋友。');
        controls.innerHTML=button(tr('← 한 알','← One bead','← 一颗'),'split',1)+button(tr('한 알 →','One bead →','一颗 →'),'split',-1);
        controls.children[0].disabled=state.left===10; controls.children[1].disabled=state.left===0;
        feedback.textContent=state.left===5?tr('2개를 옮겨 5개씩! 모두 10개인 것은 같아요.','Move two: five each! The total is still ten.','移动两颗后各有五颗！总数仍然是十颗。'):tr('어느 쪽에서 몇 개를 옮기면 같아질까요?','Which way should you move them, and how many?','从哪边移几颗，才能一样多？');
        fallback.innerHTML='<div class="nm-experience__beads">'+[state.left,10-state.left].map(n=>'<div class="nm-experience__bead-group">'+Array.from({length:n},()=>'<i class="nm-experience__bead"></i>').join('')+'</div>').join('')+'</div>';
      } else if(state.mode==='elementary') {
        equation.innerHTML=state.a+' <span class="nm-experience__operator">×</span> <b>'+state.b+'</b> <span class="nm-experience__operator">=</span> '+state.a*state.b;
        instruction.textContent=tr(state.a+'와 곱하여 10이 되는 짝을 찾아보세요.','What number times '+state.a+' makes ten?','哪个数乘'+state.a+'等于10？');
        controls.innerHTML=[1,2,5,10].map(n=>button(String(n),'factor',n)).join('')+button(tr('다른 짝 ↗','Another pair ↗','换一组 ↗'),'challenge');
        controls.lastElementChild.classList.add('nm-experience__next');
        controls.querySelectorAll('[data-xp-action="factor"]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.xpValue)===state.b)));
        const groups=tr(state.a+'개씩 '+state.b+'묶음',state.b+' groups of '+state.a,state.b+'组，每组'+state.a+'个');
        feedback.textContent=state.a*state.b===10?tr('10 완성! ','That makes ten! ','凑成10了！')+groups:groups+tr('. 10이 되는 짝은 무엇일까요?','. Which pair makes ten?','。哪一对能凑成10？');
        fallback.textContent=groups+' = '+state.a*state.b;
      } else if(state.mode==='middle') {
        const x=[-6,-3,-2,-1,1,2,3,6][state.xIndex], y=state.k/x;
        equation.innerHTML=fmt(x)+' <span class="nm-experience__operator">×</span> <b>'+fmt(y)+'</b> <span class="nm-experience__operator">=</span> '+state.k;
        instruction.textContent=tr('점을 움직여도 두 수의 곱은 일정합니다.','Move the point. The product stays constant.','移动点，两个数的乘积仍然不变。');
        controls.innerHTML=button(tr('비례상수 +6','Constant +6','比例常数 +6'),'sign',6)+button(tr('비례상수 −6','Constant −6','比例常数 −6'),'sign',-6)+'<label class="nm-experience__slider">'+tr('x 값','x value','x值')+'<input type="range" min="0" max="7" step="1" value="'+state.xIndex+'" data-xp-range="x" aria-label="'+tr('x 좌표 선택','Choose the x coordinate','选择x坐标')+'" aria-valuetext="'+x+'"></label>';
        controls.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.xpValue)===state.k)));
        feedback.textContent=(state.k>0?tr('양수이면 제1·3사분면','Positive: quadrants I and III','正数：第一、三象限'):tr('음수이면 제2·4사분면','Negative: quadrants II and IV','负数：第二、四象限'))+' · (x, y) = ('+fmt(x)+', '+fmt(y)+')';
        fallback.textContent='y = '+state.k+' ÷ x · '+tr('점','point','点')+' ('+fmt(x)+', '+fmt(y)+')';
      } else {
        const n=state.divisions, area=8/3-2/(3*n*n);
        equation.innerHTML=tr('넓이','Area','面积')+' <span class="nm-experience__operator">≈</span> <b>'+area.toFixed(3)+'</b>';
        instruction.textContent=tr('더 잘게 나누면, 곡선 아래가 채워집니다.','Smaller pieces fill the area under the curve.','分得更细，就能填满曲线下方。');
        controls.innerHTML=[4,8,16,32].map(n=>button(n+tr('조각',' pieces','块'),'divisions',n)).join('');
        controls.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.xpValue)===n)));
        feedback.textContent=tr('y = x² · 0부터 2까지 · 가운데 높이로 어림한 넓이','y = x² · from 0 to 2 · midpoint-height estimate','y = x² · 从0到2 · 用中点高度估算面积');
        fallback.textContent=tr(n+'조각의 넓이 합 ',n+' pieces add up to ',n+'块面积之和 ')+area.toFixed(3)+tr(' · 실제 넓이 8/3',' · exact area 8/3',' · 实际面积8/3');
      }
      renderNeeded=true;
    }
    function disposeModel() {
      if(!model) return;
      const geos=new Set(), mats=new Set(), textures=new Set();
      model.traverse(o=>{if(o.geometry)geos.add(o.geometry);if(o.material)(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>{mats.add(m);if(m.map)textures.add(m.map);});});
      geos.forEach(g=>g.dispose()); mats.forEach(m=>m.dispose()); textures.forEach(t=>t.dispose());
      scene.remove(model); model=null; moving=[]; rayTargets=[];
    }
    function standard(color, extras){return new T.MeshStandardMaterial(Object.assign({color,roughness:.3,metalness:.04},extras||{}));}
    function mesh(geo,mat,x,y,z){const m=new T.Mesh(geo,mat);m.position.set(x||0,y||0,z||0);m.castShadow=true;m.receiveShadow=true;model.add(m);return m;}
    function label(text,x,y,z,size,color) {
      const c=document.createElement('canvas'); c.width=256;c.height=128;
      const ctx=c.getContext('2d');ctx.font='700 66px Arial, sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle=color||'#315b4d';ctx.fillText(text,128,68);
      const texture=new T.CanvasTexture(c);texture.colorSpace=T.SRGBColorSpace;
      const sprite=new T.Sprite(new T.SpriteMaterial({map:texture,transparent:true,depthTest:false}));sprite.scale.set(size*2,size,1);sprite.position.set(x,y,z);model.add(sprite);return sprite;
    }
    function tube(points,color,radius){return mesh(new T.TubeGeometry(new T.CatmullRomCurve3(points),Math.max(24,points.length*2),radius||.035,6,false),standard(color,{roughness:.45}));}
    function tray(x,z,w,d,color){const base=mesh(new T.CylinderGeometry(1,1,.18,64),standard(color||'#ede4cf',{roughness:.5}),x,-.22,z);base.scale.set(w/2,1,d/2);const inner=mesh(new T.CylinderGeometry(.9,.9,.06,64),standard('#fffcf3',{roughness:.55}),x,-.10,z);inner.scale.set(w/2,1,d/2);}
    function splitTargets() {
      moving.forEach((m,i)=>{
        const isLeft=i<state.left, count=isLeft?state.left:10-state.left, local=isLeft?i:i-state.left;
        const cols=Math.min(3,count), row=Math.floor(local/3), rowCount=Math.min(3,count-row*3);
        m.target.set((isLeft?-1.45:1.45)+(local%3-(rowCount-1)/2)*.59,.28,(row-(Math.ceil(count/3)-1)/2)*.53);
        m.mesh.material.color.set(isLeft?'#1f947b':'#e6aa3e');m.mesh.userData.left=isLeft;
      });
      if(reduced.matches)moving.forEach(m=>m.mesh.position.copy(m.target));
    }
    function build() {
      if(!T||!renderer||destroyed)return;
      disposeModel();model=new T.Group();scene.add(model);
      if(state.mode==='preschool') {
        camera.position.set(0,4.3,5.6);camera.lookAt(0,0,0);
        tray(-1.45,0,2.75,2.6);tray(1.45,0,2.75,2.6);
        const sphere=new T.SphereGeometry(.29,32,24);
        for(let i=0;i<10;i++){const ball=mesh(sphere,standard('#1f947b',{roughness:.19}),0,.28,0);moving.push({mesh:ball,target:new T.Vector3()});rayTargets.push(ball);}
        splitTargets();moving.forEach(m=>m.mesh.position.copy(m.target));
      } else if(state.mode==='elementary') {
        const groups=state.b,perGroup=state.a,pitch=.48,tokenCols=Math.min(5,perGroup),tokenRows=Math.ceil(perGroup/5);
        const plateWidth=tokenCols*pitch+.26,plateDepth=tokenRows*pitch+.36,groupCols=Math.min(3,groups),groupRows=Math.ceil(groups/groupCols);
        const wholeWidth=groupCols*(plateWidth+.26),wholeDepth=groupRows*(plateDepth+.32);
        camera.position.set(0,5.6,6.7);camera.lookAt(0,0,0);
        model.scale.setScalar(Math.min(1.8,5.5/Math.max(wholeWidth,wholeDepth)));
        const sphere=new T.SphereGeometry(.185,24,16),isTen=groups*perGroup===10;
        for(let group=0;group<groups;group++) {
          const row=Math.floor(group/groupCols),countInRow=Math.min(groupCols,groups-row*groupCols);
          const cx=(group%groupCols-(countInRow-1)/2)*(plateWidth+.26),cz=(row-(groupRows-1)/2)*(plateDepth+.32);
          tray(cx,cz,plateWidth,plateDepth);
          for(let token=0;token<perGroup;token++) {const ball=mesh(sphere,standard(group%2?'#e1aa45':'#318e79',{roughness:.2}),cx+(token%tokenCols-(tokenCols-1)/2)*pitch,.18,cz+(Math.floor(token/tokenCols)-(tokenRows-1)/2)*pitch);if(isTen)moving.push({mesh:ball,target:ball.position.clone()});}
        }
      } else if(state.mode==='middle') {
        camera.position.set(.25,.4,11.8);camera.lookAt(0,0,0);const s=.49;
        const board=mesh(new T.BoxGeometry(7,7,.16),standard('#fffdf4',{roughness:.88}),0,0,-.2);board.castShadow=false;
        const gridMat=new T.LineBasicMaterial({color:'#d5dbcb',transparent:true,opacity:.8});
        for(let i=-6;i<=6;i++) {if(!i)continue;for(const p of [[[i*s,-3.1,0],[i*s,3.1,0]],[[-3.1,i*s,0],[3.1,i*s,0]]]){const geo=new T.BufferGeometry().setFromPoints(p.map(q=>new T.Vector3(...q)));model.add(new T.Line(geo,gridMat));}}
        tube([new T.Vector3(-3.2,0,.01),new T.Vector3(3.2,0,.01)],'#64897b',.012);tube([new T.Vector3(0,-3.2,.01),new T.Vector3(0,3.2,.01)],'#64897b',.012);
        label('x',3.32,-.23,.05,.28);label('y',-.23,3.29,.05,.28);label('0',-.18,-.22,.06,.24);
        for(const v of [-6,-3,3,6]){label(String(v),v*s,-.2,.05,.22);label(String(v),-.22,v*s,.05,.22);}
        for(const sign of [-1,1]) {const pts=[];for(let i=0;i<=70;i++){const x=sign*(1+i*5/70);pts.push(new T.Vector3(x*s,state.k/x*s,.11));}tube(pts,state.k>0?'#198576':'#b16b55',.048);}
        const x=[-6,-3,-2,-1,1,2,3,6][state.xIndex];
        mesh(new T.SphereGeometry(.15,24,20),standard('#e6ae42',{metalness:.2,roughness:.18}),x*s,state.k/x*s,.24);
        label(state.k>0?'I':'II',state.k>0?2.7:-2.7,2.65,.03,.35,'#a3afa1');
        label(state.k>0?'III':'IV',state.k>0?-2.7:2.7,-2.65,.03,.35,'#a3afa1');
      } else {
        camera.position.set(5.7,4.6,9.6);camera.lookAt(.1,1.55,0);
        mesh(new T.BoxGeometry(6.35,.14,1.8),standard('#e6ddc6',{roughness:.65}),0,-.15,0);
        const n=state.divisions,dx=2/n,step=5.5/n;
        for(let i=0;i<n;i++) {const x=(i+.5)*dx,h=x*x;mesh(new T.BoxGeometry(step*.95,h,.72),standard(i%2?'#4f9b87':'#207e69',{roughness:.34}),-2.75+(i+.5)*step,h/2,0);}
        const pts=[];for(let i=0;i<=80;i++){const x=i/40;pts.push(new T.Vector3(-2.75+x*2.75,x*x,.49));}tube(pts,'#d19b34',.045);
        tube([new T.Vector3(-2.88,0,.51),new T.Vector3(2.95,0,.51)],'#4a7161',.02);
        tube([new T.Vector3(-2.78,0,.51),new T.Vector3(-2.78,4.2,.51)],'#8d9f89',.018);
        label('0',-2.75,-.34,.65,.3);label('1',0,-.34,.65,.3);label('2',2.75,-.34,.65,.3);label('4',-3.03,4,.55,.28);
        label('y = x²',1.25,4.2,.4,.36,'#446c59');
      }
      resize();renderNeeded=true;start();
    }
    function resize() {
      if(!renderer||!camera)return;
      const w=Math.max(1,stage.clientWidth),h=Math.max(1,stage.clientHeight);
      renderer.setSize(w,h,false);camera.aspect=w/h;
      const fitDistance=state.mode==='preschool'?7.06:10.5;
      camera.fov=state.mode==='middle'?Math.max(38,2*Math.atan(3.9/11.8/Math.max(.55,w/h))*180/Math.PI):Math.max(39,2*Math.atan(3.4/fitDistance/Math.max(.55,w/h))*180/Math.PI);
      camera.updateProjectionMatrix();renderNeeded=true;start();
    }
    function render(time) {
      raf=0;if(destroyed||!active||document.hidden||!renderer)return;
      const dt=Math.min(.05,(time-(previousTime||time))/1000);previousTime=time;
      let transition=false;
      moving.forEach((m,i)=>{const dist=m.mesh.position.distanceTo(m.target);if(dist>.001){m.mesh.position.lerp(m.target,reduced.matches?1:1-Math.exp(-dt*10));transition=true;}if(!reduced.matches&&state.mode==='elementary')m.mesh.position.y=m.target.y+Math.sin(time*.0015+i*.45)*.022;});
      if(renderNeeded||transition||(!reduced.matches&&moving.length))renderer.render(scene,camera);
      renderNeeded=false;
      if((!reduced.matches&&moving.length)||transition)raf=requestAnimationFrame(render);
    }
    function start(){if(!raf&&renderer&&active&&!destroyed&&!document.hidden)raf=requestAnimationFrame(render);}
    function setMode(mode){state.mode=normalizeMode(mode);updateUI();build();}
    function setActive(value){active=Boolean(value);if(!active){cancelAnimationFrame(raf);raf=0;previousTime=0;}else{renderNeeded=true;resize();start();}}
    function action(e){const b=e.target.closest('[data-xp-action]');if(!b||!controls.contains(b))return;const a=b.dataset.xpAction,v=Number(b.dataset.xpValue);
      const hadFocus=document.activeElement===b;
      if(a==='split'){state.left=Math.max(0,Math.min(10,state.left+v));updateUI();splitTargets();start();}
      if(a==='factor'){state.b=v;updateUI();build();}
      if(a==='challenge'){const sequence=[2,5,10,1];state.a=sequence[(sequence.indexOf(state.a)+1)%sequence.length];state.b=state.a===10?2:1;updateUI();build();}
      if(a==='sign'){state.k=v;updateUI();build();}
      if(a==='divisions'){state.divisions=v;updateUI();build();}
      if(hadFocus){const replacement=Array.from(controls.querySelectorAll('button')).find(el=>el.dataset.xpAction===a&&el.dataset.xpValue===b.dataset.xpValue&&!el.disabled);if(replacement)replacement.focus({preventScroll:true});}
    }
    function range(e){if(!e.target.matches('[data-xp-range="x"]'))return;state.xIndex=Number(e.target.value);const hadFocus=document.activeElement===e.target;updateUI();const replacement=controls.querySelector('input');if(hadFocus&&replacement)replacement.focus();build();}
    function pick(e){if(!T||!rayTargets.length||state.mode!=='preschool')return;const rect=canvas.getBoundingClientRect(),ndc=new T.Vector2((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1),ray=new T.Raycaster();ray.setFromCamera(ndc,camera);const hit=ray.intersectObjects(rayTargets)[0];if(hit){const index=moving.findIndex(m=>m.mesh===hit.object),boundary=hit.object.userData.left?state.left-1:state.left;[moving[index],moving[boundary]]=[moving[boundary],moving[index]];state.left+=hit.object.userData.left?-1:1;updateUI();splitTargets();start();}}
    function visibility(){if(document.hidden){cancelAnimationFrame(raf);raf=0;}else{renderNeeded=true;start();}}
    function motion(){renderNeeded=true;start();}
    controls.addEventListener('click',action);controls.addEventListener('input',range);canvas.addEventListener('click',pick);document.addEventListener('visibilitychange',visibility);reduced.addEventListener('change',motion);window.addEventListener('nm-promo-languagechange',updateUI);
    updateUI();
    (threePromise||(threePromise=import(threeURL))).then(module=>{
      if(destroyed)return;T=module;
      try{
        renderer=new T.WebGLRenderer({canvas,antialias:true,alpha:true,powerPreference:'low-power'});
        renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.65));renderer.outputColorSpace=T.SRGBColorSpace;
        renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.3;renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;
        scene=new T.Scene();camera=new T.PerspectiveCamera(39,1,.1,60);
        scene.add(new T.HemisphereLight('#fff9e9','#6e8271',2));
        const light=new T.DirectionalLight('#fff3d8',3.4);light.position.set(-3,7,5);light.castShadow=true;light.shadow.mapSize.set(512,512);light.shadow.camera.left=-6;light.shadow.camera.right=6;light.shadow.camera.top=6;light.shadow.camera.bottom=-6;light.shadow.bias=-.001;scene.add(light);
        const fill=new T.DirectionalLight('#c7e6e7',1.1);fill.position.set(5,2,-4);scene.add(fill);
        fallback.hidden=true;root.dataset.renderer='webgl';build();resizeObserver=new ResizeObserver(resize);resizeObserver.observe(stage);
      }catch(error){root.dataset.renderer='fallback';fallback.hidden=false;if(renderer)renderer.dispose();renderer=null;canvas.hidden=true;}
    }).catch(()=>{if(!destroyed){root.dataset.renderer='fallback';canvas.hidden=true;fallback.hidden=false;}});
    return {
      setMode,setActive,
      capture(){if(destroyed||!renderer||!scene||!camera)return null;try{renderer.render(scene,camera);return canvas.toDataURL('image/png');}catch(error){return null;}},
      getState:()=>Object.assign({},state,{active,renderer:root.dataset.renderer||'loading'}),
      destroy(){if(destroyed)return;destroyed=true;cancelAnimationFrame(raf);if(resizeObserver)resizeObserver.disconnect();controls.removeEventListener('click',action);controls.removeEventListener('input',range);canvas.removeEventListener('click',pick);document.removeEventListener('visibilitychange',visibility);reduced.removeEventListener('change',motion);window.removeEventListener('nm-promo-languagechange',updateUI);disposeModel();if(scene)scene.traverse(o=>{if(o.shadow)o.shadow.dispose();});if(renderer)renderer.dispose();root.remove();}
    };
  }
  window.NMPromoExperience={create};
})();
