/* A continuous cylindrical paper surface, approximated by adjacent DOM strips.
 * No flat-leaf rotate animation: every strip has its own tangent and depth.
 * from/to are full-spread DOM snapshots (replace live canvases/videos first).
 * NMPageCurl.turn({container,from,to,direction:1|-1,narrow,onComplete,duration})
 * returns {cancel,finish,getState,finished}. Neither snapshot is mutated.
 */
(function () {
  'use strict';
  const activeTurns = new WeakMap();
  const clamp = (x,a,b) => Math.max(a,Math.min(b,x));
  const ease = t => t*t*(3-2*t);
  const round = x => Math.round(x*1000)/1000;

  // Arc coordinate s remains continuous across every strip boundary.
  // theta(s) = base + bend*(2s/width - 1).
  // Integrating (cos(theta), sin(theta)) gives an inextensible cylinder arc.
  function curve(width, progress, count) {
    const q=clamp(progress,0,1),base=Math.PI*q;
    const bend=Math.min(.96,base*.9,(Math.PI-base)*.9);
    const theta0=base-bend,k=2*bend/width,points=[];
    for(let i=0;i<=count;i++){
      const s=width*i/count,theta=theta0+k*s;
      const x=bend<.00001?s*Math.cos(base):(Math.sin(theta)-Math.sin(theta0))/k;
      const z=bend<.00001?s*Math.sin(base):(Math.cos(theta0)-Math.cos(theta))/k;
      points.push({s,x,z,theta});
    }
    return {progress:q,base,bend,points};
  }

  function displayOf(source) {
    if(source.dataset.curlDisplay) return source.dataset.curlDisplay;
    if(source.isConnected){const display=getComputedStyle(source).display;if(display!=='none')return display;}
    if(source.classList.contains('panel-menu'))return 'grid';
    if(source.classList.contains('panel-video')||source.classList.contains('panel-village'))return 'block';
    if(source.classList.contains('book-panel'))return 'flex';
    return source.style.display||'block';
  }

  function copy(source,width,height,display) {
    const clone=source.cloneNode(true);
    clone.classList.remove('turn-snapshot');
    clone.classList.add('nm-curl-content');
    clone.removeAttribute('hidden');clone.removeAttribute('inert');
    clone.setAttribute('aria-hidden','true');clone.inert=true;
    const elements=[clone,...clone.querySelectorAll('*')];
    for(const el of elements){
      ['id','for','aria-labelledby','aria-describedby','data-panel'].forEach(attr=>el.removeAttribute(attr));
      if(el.matches('a,button,input,select,textarea,[tabindex]'))el.tabIndex=-1;
    }
    clone.style.setProperty('display',display,'important');
    clone.style.setProperty('width',width+'px','important');
    clone.style.setProperty('height',height+'px','important');
    clone.style.setProperty('min-width','0','important');
    clone.style.setProperty('min-height','0','important');
    clone.style.setProperty('inset','auto','important');
    clone.style.setProperty('top','0','important');
    clone.style.setProperty('left','0','important');
    clone.style.setProperty('margin','0','important');
    return clone;
  }

  function turn(options) {
    const opts=options||{},container=opts.container,from=opts.from,to=opts.to;
    if(!container||!from||!to)throw new TypeError('NMPageCurl.turn requires container, from and to.');
    if(activeTurns.has(container))activeTurns.get(container).finish();
    const done=typeof opts.onComplete==='function'?opts.onComplete:()=>{};
    const narrow=Boolean(opts.narrow),backward=Number(opts.direction)<0;
    const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
    // All layout reads happen before writing the overlay; none occur in RAF.
    const bounds=container.getBoundingClientRect(),fullWidth=bounds.width,height=bounds.height;
    const displays={from:displayOf(from),to:displayOf(to)};
    if(reduced||fullWidth<2||height<2){
      done();
      return {cancel(){},finish(){},getState:()=>({done:true,progress:1,reduced}),finished:Promise.resolve()};
    }
    const width=narrow?fullWidth:fullWidth/2,spine=narrow?0:width;
    // A little material overlap seals subpixel seams under perspective. The
    // narrow-screen budget stays smaller while retaining a genuinely curved face.
    const count=narrow?32:42,arcWidth=width/count,overlap=1.25;
    const duration=clamp(Number(opts.duration)||1100,700,1800);
    const overlay=document.createElement('div');
    overlay.className='nm-curl-overlay';overlay.dataset.direction=backward?'backward':'forward';
    overlay.dataset.narrow=String(narrow);overlay.dataset.progress='0';
    overlay.setAttribute('aria-hidden','true');overlay.inert=true;
    overlay.style.setProperty('--curl-height',height+'px');
    overlay.style.setProperty('--curl-perspective',Math.max(2400,width*5)+'px');

    // The outgoing opposite page remains underneath the moving physical leaf.
    // On a single page, backward navigation reveals an incoming leaf over it.
    if(!narrow||backward){
      const still=document.createElement('div');still.className='nm-curl-still';
      still.style.width=width+'px';still.style.height=height+'px';
      still.style.left=(!narrow&&backward?width:0)+'px';
      const image=copy(from,fullWidth,height,displays.from);
      image.style.setProperty('left',(!narrow&&backward?-width:0)+'px','important');
      still.append(image);overlay.append(still);
    }
    const shadow=document.createElement('div');shadow.className='nm-curl-cast-shadow';
    shadow.style.width=width+'px';shadow.style.height=height+'px';overlay.append(shadow);
    const sheet=document.createElement('div');sheet.className='nm-curl-sheet';overlay.append(sheet);
    const strips=[];
    const frontSource=backward?to:from,backSource=backward?from:to;
    const frontDisplay=backward?displays.to:displays.from,backDisplay=backward?displays.from:displays.to;
    const frontMaster=copy(frontSource,fullWidth,height,frontDisplay);
    const backMaster=copy(backSource,fullWidth,height,backDisplay);
    for(let i=0;i<count;i++){
      const s=i*arcWidth,faceWidth=arcWidth+(i===count-1?0:overlap);
      const strip=document.createElement('div');strip.className='nm-curl-strip';
      strip.dataset.strip=String(i);strip.style.width=faceWidth+'px';strip.style.height=height+'px';
      const front=document.createElement('div'),back=document.createElement('div');
      front.className='nm-curl-face is-front';back.className='nm-curl-face is-back';
      const frontContent=frontMaster.cloneNode(true),backContent=backMaster.cloneNode(true);
      frontContent.style.setProperty('left',-(narrow?s:width+s)+'px','important');
      // On the back face local x runs in the opposite material direction.
      // At progress=1 it lands at its original readable destination x.
      backContent.style.setProperty('left',-(width-s-faceWidth)+'px','important');
      const frontShade=document.createElement('span'),backShade=document.createElement('span');
      frontShade.className='nm-curl-shade';backShade.className='nm-curl-shade';
      front.append(frontContent,frontShade);back.append(backContent,backShade);strip.append(front,back);
      if(i===count-1){const edge=document.createElement('span');edge.className='nm-curl-free-edge';strip.append(edge);}
      sheet.append(strip);strips.push({el:strip,frontShade,backShade});
    }
    container.append(overlay);container.classList.add('has-page-curl');
    let raf=0,startTime=0,completed=false,resolveFinished;
    let latest={done:false,progress:0,curveProgress:backward?1:0,bend:0,depth:0,angleSpread:0,strips:count};
    const finished=new Promise(resolve=>{resolveFinished=resolve;});

    function render(progress){
      const p=clamp(progress,0,1),q=backward?1-ease(p):ease(p),shape=curve(width,q,count);
      const pulse=Math.sin(Math.PI*q);
      let minAngle=Infinity,maxAngle=-Infinity,maxDepth=0,minX=0,maxX=0;
      for(let i=0;i<count;i++){
        const a=shape.points[i],b=shape.points[i+1],dx=b.x-a.x,dz=b.z-a.z;
        const theta=Math.atan2(dz,dx),chord=Math.hypot(dx,dz),entry=strips[i];
        const angle=-theta*180/Math.PI;
        entry.el.style.transform='translate3d('+round(spine+a.x)+'px,0,'+round(a.z+.45)+'px) rotateY('+round(angle)+'deg) scaleX('+round(chord/arcWidth)+')';
        entry.el.dataset.angle=String(round(angle));entry.el.dataset.depth=String(round(a.z));
        const grazing=1-Math.abs(Math.cos(theta));
        entry.frontShade.style.opacity=String(round(pulse*(.04+grazing*.27)));
        entry.backShade.style.opacity=String(round(pulse*(.025+grazing*.19)));
        minAngle=Math.min(minAngle,angle);maxAngle=Math.max(maxAngle,angle);maxDepth=Math.max(maxDepth,a.z);
        minX=Math.min(minX,a.x,b.x);maxX=Math.max(maxX,a.x,b.x);
      }
      const shadowPad=width*.035*pulse,spread=Math.max(.045,(maxX-minX+shadowPad*2)/width);
      shadow.style.transform='translate3d('+round(spine+minX-shadowPad)+'px,0,0) scaleX('+round(spread)+')';
      shadow.style.opacity=String(round(pulse*.35));
      overlay.dataset.progress=String(round(p));overlay.dataset.curveProgress=String(round(q));
      overlay.dataset.bend=String(round(shape.bend));
      latest={done:false,progress:p,curveProgress:q,bend:shape.bend,depth:maxDepth,angleSpread:maxAngle-minAngle,strips:count};
    }
    function complete(){
      if(completed)return;completed=true;cancelAnimationFrame(raf);raf=0;
      overlay.remove();container.classList.remove('has-page-curl');
      if(activeTurns.get(container)===control)activeTurns.delete(container);
      latest=Object.assign({},latest,{done:true,progress:1});
      window.removeEventListener('resize',complete);document.removeEventListener('visibilitychange',visibility);
      try{done();}finally{resolveFinished();}
    }
    function visibility(){if(document.hidden)complete();}
    function step(now){
      if(completed)return;
      if(!container.isConnected){complete();return;}
      if(!startTime)startTime=now;
      const progress=clamp((now-startTime)/duration,0,1);render(progress);
      if(progress>=1)complete();else raf=requestAnimationFrame(step);
    }
    const control={cancel:complete,finish:complete,getState:()=>Object.assign({},latest),finished};
    activeTurns.set(container,control);
    window.addEventListener('resize',complete,{once:true});document.addEventListener('visibilitychange',visibility);
    render(0);raf=requestAnimationFrame(step);
    return control;
  }
  window.NMPageCurl={turn,curve};
})();
