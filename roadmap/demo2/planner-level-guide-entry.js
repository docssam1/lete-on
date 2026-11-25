/* Load draft projections and public reference data on demand. */
(function(g){
'use strict';
const doc=g.document,root=new URL('.',doc.currentScript.src);
const versions={
 PLANNER_LEVELS:'planner-levels.js?v=20261112-mid3',
 PLANNER_STANDARD_DETAILS:'planner-standard-data.js?v=20261112-mid3',
 PLANNER_ACADEMY_ROADMAPS:'planner-academy-data.js?v=20261029-soma-revision',
 PlannerLevelGuide:'planner-level-guide.js?v=20261126-start1',
 PlannerProgression:'planner-progression.js?v=20261123-guide1',
 PlannerStandard:'planner-standard.js?v=20261111-rev1',
 PlannerHighStudy:'planner-high-study.js?v=20261110-flow3',
 PlannerCurriculum:'planner-curriculum.js?v=20261110-flow3'
};
const requests=new Map();
function load(key){
 if(g[key])return Promise.resolve(g[key]);
 if(!requests.has(key)){
  const promise=new Promise((resolve,reject)=>{
   const script=doc.createElement('script');
   script.src=new URL(versions[key],root).href;
   const finish=()=>{
    if(g[key])resolve(g[key]);
    else{script.remove();reject(new Error('학습 자료를 불러오지 못했어요.'));}
   };
   script.onload=finish;script.onerror=finish;doc.head.append(script);
  }).catch(error=>{requests.delete(key);throw error;});
  requests.set(key,promise);
 }
 return requests.get(key);
}
async function loadStandard(answers){
 const supporting=[load('PLANNER_STANDARD_DETAILS'),load('PlannerProgression')];
 const highCourse=answers.schoolCourse==='high'||answers.deepCourse==='high'||(Number(answers.schoolExact)===19&&answers.schoolStatus==='done');
 if(highCourse)supporting.push(load('PlannerHighStudy').then(()=>load('PlannerCurriculum')));
 await Promise.all(supporting);
 return load('PlannerStandard');
}
function ensureStyle(){
 const styleUrl=new URL('planner-level-guide.css?v=20261126-start1',root).href;
 const bundle=doc.documentElement.dataset.runtimeStyle;
 const bundleUrl=bundle?new URL(bundle,root).href:null;
 if([...doc.querySelectorAll('link[rel=stylesheet]')].some(link=>link.href===styleUrl||link.href===bundleUrl))return;
 const style=doc.createElement('link');style.rel='stylesheet';style.href=styleUrl;doc.head.append(style);
}
async function show(guide){
 const content=guide.querySelector('[data-planner-level-guide-content]');
 if(!guide.open||!content||content.dataset.guideState==='ready'||content.dataset.guideState==='loading')return;
 ensureStyle();
 content.dataset.guideState='loading';
 content.innerHTML='<p role="status">진도 비교 기준을 불러오고 있어요.</p>';
 try{
  const [renderer]=await Promise.all([load('PlannerLevelGuide'),load('PLANNER_LEVELS'),load('PLANNER_STANDARD_DETAILS'),load('PLANNER_ACADEMY_ROADMAPS')]);
  if(!content.isConnected)return;
  const report=renderer.render({learner:content.dataset.learner,month:Number(content.dataset.month),embedded:true});
  if(!report)throw new Error('기준표를 불러오지 못했어요.');
  content.innerHTML=report;
  content.dataset.guideState='ready';
 }catch{
  content.dataset.guideState='error';
  content.innerHTML='<p role="status">기준표를 불러오지 못했어요.</p><button type="button" data-level-guide-retry>다시 불러오기</button>';
 }
}
doc.addEventListener('toggle',event=>{
 if(event.target.matches?.('details[data-level-guide-load]'))show(event.target);
},true);
doc.addEventListener('click',event=>{
 const retry=event.target.closest?.('[data-level-guide-retry]');
 const guide=retry?.closest('details[data-level-guide-load]');
 if(guide){guide.querySelector('summary').focus({preventScroll:true});show(guide);}
});
doc.querySelectorAll('details[data-level-guide-load][open]').forEach(show);
g.PlannerLevelGuideEntry=Object.freeze({loadStandard});
})(window);
