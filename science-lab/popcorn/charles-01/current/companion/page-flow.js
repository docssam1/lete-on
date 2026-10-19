// Keep the original controls and source nodes; only divide their reading surface.
const mounted=new WeakMap();
const atomic='p,h1,h2,h3,h4,figure,li,label,button,a,table,details,.source-step,.mag-article-head,.mag-coach,.source-report-label,.mag-issue-close,.mag-cover-number,.page-flow-chapter';
export function mountPageFlow(source,{onChange=()=>{}}={}){
 if(!source)return null;
 if(mounted.has(source))return mounted.get(source);
 let index=0,active=false,scheduled=0,disposed=false,pages=[],units=[];
 const originalText=source.textContent.replace(/\s+/g,' ').trim();
 const step=source.querySelector(':scope>.source-step'),head=source.querySelector(':scope>.mag-article-head');
 if(step&&head&&step.nextElementSibling===head){const chapter=document.createElement('div');chapter.className='page-flow-chapter';source.insertBefore(chapter,step);chapter.append(step,head);}
 function collect(node,trail=[]){
  if(node.nodeType===3){if(node.textContent.trim()){const p=document.createElement('p');p.append(node);units.push(p);}return;}
  if(node.nodeType!==1)return;
  if(node.matches('dialog,script,style'))return;
  if(node.matches(atomic)||!node.children.length){
   let unit=node;
   for(const parent of [...trail].reverse()){
    const shell=parent.cloneNode(false);shell.removeAttribute('id');shell.removeAttribute('hidden');shell.removeAttribute('aria-labelledby');shell.classList.add('page-flow-context');shell.append(unit);unit=shell;
   }
   const box=document.createElement('div');box.className='page-flow-unit';box.append(unit);units.push(box);return;
  }
  for(const child of [...node.childNodes])collect(child,[...trail,node]);
 }
 for(const node of [...source.childNodes])collect(node);
 source.replaceChildren();source.classList.add('page-flow-source');
 const surface=document.createElement('div');surface.className='page-flow-surface';source.append(surface);
 function announce(){onChange(getState());}
 function show(n){index=Math.max(0,Math.min(pages.length-1,n));pages.forEach((p,i)=>p.hidden=i!==index);source.dataset.flowPage=String(index);announce();}
 function page(){const p=document.createElement('div');p.className='page-flow-page';surface.append(p);pages.push(p);return p;}
 function height(){return surface.clientHeight||source.clientHeight;}
 function fits(p){return p.scrollHeight<=height()+1;}
 function splitText(box){
  const p=box.querySelector('p');if(!p||p.children.length||p.closest('figure,button,a,label'))return null;
  const text=p.textContent,parts=text.match(/[^.!?。！？]+[.!?。！？]*\s*/g)||[text];
  if(parts.length<2)return null;
  return parts.map(t=>{const b=box.cloneNode(true);b.querySelectorAll('[id]').forEach(el=>el.removeAttribute('id'));b.querySelector('p').textContent=t;return b;});
 }
 function measure(){
  scheduled=0;if(!active||disposed||height()<70)return;
  const anchor=pages[index]?.querySelector('.page-flow-unit')?.dataset.flowUnit;
  for(const u of units)u.remove();surface.replaceChildren();pages=[];
  let p=page();const expanded=[];
  for(let n=0;n<units.length;n++){
   const u=units[n];u.dataset.flowUnit=String(n);p.append(u);
   if(!fits(p)&&p.children.length>1){u.remove();p=page();p.append(u);}
   if(!fits(p)){
    const textParts=splitText(u);
    if(textParts){u.remove();for(const part of textParts){part.dataset.flowUnit=String(n);p.append(part);if(!fits(p)&&p.children.length>1){part.remove();p=page();p.append(part);}expanded.push(part);}continue;}
   }
   expanded.push(u);
  }
  units=expanded;
  while(pages.length>1&&!pages.at(-1).children.length)pages.pop().remove();
  const anchorPage=anchor?pages.findIndex(p=>[...p.children].some(u=>u.dataset.flowUnit===anchor)):-1;
  show(anchorPage>=0?anchorPage:index);
 }
 function schedule(){if(active&&!scheduled)scheduled=requestAnimationFrame(measure);}
 const observer=new ResizeObserver(schedule);observer.observe(source);
 source.addEventListener('load',schedule,true);source.addEventListener('toggle',schedule,true);
 document.fonts?.ready.then(schedule);
 function getState(){return {page:index,pages:pages.length,active,sourceText:originalText,overflow:pages[index]?pages[index].scrollHeight>height()+1:false};}
 const api={source,setActive(value){active=value;if(active)schedule();},next(){if(!pages.length)measure();if(index<pages.length-1){show(index+1);return true;}return false;},previous(){if(index>0){show(index-1);return true;}return false;},show(n=0){show(n);},getState,refresh:schedule,dispose(){disposed=true;observer.disconnect();cancelAnimationFrame(scheduled);source.removeEventListener('load',schedule,true);source.removeEventListener('toggle',schedule,true);}};
 mounted.set(source,api);return api;
}
