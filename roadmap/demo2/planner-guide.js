/*
 * Parent roadmap guide: an open explanation shows the face; waiting shows the
 * whole approved figure. `speaking` means the explanation is visible, not audio.
 * No audio, mouth animation, automatic dismissal, or stored plan changes.
 *
 * Load after planner-editorial.css and before planner-ui.js, then call:
 *   PlannerGuide.mount(document);
 *   PlannerGuide.update(document.querySelector('#pathwayCoach'),
 *     {speaking: true, expression: 'think'});
 * Existing #pathwaySummary / #questionHelp nodes and their content are retained.
 * A text change opens a new explanation; mount() is safe to call after renders.
 */
(function(global){
 'use strict';
 const frames=Object.freeze({
  listen:'docssam-math-A1-mouth-closed.png',
  think:'docssam-math-B2-puzzled-thinking.png',
  encourage:'docssam-math-B4-encourage.png',
  praise:'docssam-math-B3-praise.png',
  happy:'docssam-math-B5-happy-thumbs-up.png'
 });
 const states=new WeakMap();
 const scriptURL=typeof document!=='undefined'&&document.currentScript?.src;
 const assetRoot=scriptURL?new URL('../v31/assets/math-docssam/',scriptURL).href:'../v31/assets/math-docssam/';
 let sequence=0;

 function hosts(root){
  if(!root)return[];
  if(root.matches?.('.guide'))return[root];
  return Array.from(root.querySelectorAll?.('.pathway-coach .guide, #conversation .guide')||[]);
 }
 function explanation(guide){
  const owner=guide.closest('.pathway-coach, #conversation');
  return owner?.querySelector('#pathwaySummary, #questionHelp')||null;
 }
 function textOf(el){return(el?.textContent||'').replace(/\s+/g,' ').trim();}

 function paint(state){
  const {guide,bubble,img,button,caption}=state;
  const hasText=!!textOf(bubble);
  const opened=state.speaking&&hasText;
  guide.dataset.guideState=opened?'speaking':'idle';
  guide.dataset.guideExpression=state.expression;
  // The closed-mouth face is a static reading cue, never simulated speech.
  const frame=opened?'listen':state.expression;
  const src=assetRoot+frames[frame];
  if(img.getAttribute('src')!==src)img.setAttribute('src',src);
  bubble.hidden=!opened;
  button.hidden=!hasText;
  button.textContent=opened?'안내 접기':'다시 보기';
  button.setAttribute('aria-expanded',String(opened));
  caption.textContent=opened?'독쌤의 안내':'독쌤과 함께 살펴보기';
  state.speaking=opened;
 }

 function attach(guide,options){
  const bubble=explanation(guide);
  if(!bubble)return null;
  let state=states.get(guide);
  if(state){
   if(options.expression&&frames[options.expression])state.expression=options.expression;
   if(typeof options.speaking==='boolean')state.speaking=options.speaking;
   paint(state);return state;
  }
  const doc=guide.ownerDocument;
  const oldImage=guide.querySelector('img');
  const portrait=doc.createElement('span');portrait.className='planner-guide-portrait';portrait.setAttribute('aria-hidden','true');
  const img=oldImage||doc.createElement('img');img.alt='';img.classList.add('planner-guide-image');img.width=1024;img.height=1536;img.decoding='async';
  if(oldImage)oldImage.replaceWith(portrait);else guide.prepend(portrait);
  portrait.append(img);
  const meta=doc.createElement('div');meta.className='planner-guide-meta';
  // Preserve the existing name, progress label, IDs and event-bound nodes.
  for(const node of Array.from(guide.childNodes))if(node!==portrait)meta.append(node);
  guide.append(meta);
  const caption=doc.createElement('span');caption.className='planner-guide-caption';meta.append(caption);
  const button=doc.createElement('button');button.type='button';button.className='planner-guide-toggle';
  if(!bubble.id)bubble.id='planner-guide-explanation-'+(++sequence);
  button.setAttribute('aria-controls',bubble.id);meta.append(button);
  guide.classList.add('planner-guide');bubble.classList.add('planner-guide-bubble');
  state={guide,bubble,img,button,caption,expression:frames[options.expression]?options.expression:'listen',speaking:options.speaking!==false,lastText:textOf(bubble)};
  states.set(guide,state);
  button.addEventListener('click',()=>{state.speaking=!state.speaking;paint(state);});
  state.observer=new MutationObserver(()=>{
   const text=textOf(bubble);
   if(text===state.lastText)return;
   state.lastText=text;state.speaking=!!text;paint(state);
  });
  state.observer.observe(bubble,{childList:true,subtree:true,characterData:true});
  paint(state);return state;
 }

 function mount(root=global.document,options={}){return hosts(root).map(g=>attach(g,options)).filter(Boolean).length;}
 function update(root=global.document,options={}){return mount(root,options);}
 global.PlannerGuide=Object.freeze({mount,update});
})(typeof window!=='undefined'?window:globalThis);
