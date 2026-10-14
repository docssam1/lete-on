// Result presentation only. No learning values, progress models or records are changed here.
export const referenceDisplayUrls={S1:'reference/display/S1.html',S2:'reference/display/S2.html',S3:'reference/display/S3.html',S4:'reference/display/S4.html'};
const chartPositions=new Map();
export function sourcePositionNote(course,{sourceCandidate=false}={}){
 if(!sourceCandidate)return {position:'unmapped',text:'현재 기록은 남겨 두었어요. 이 교재·범위는 원표에 직접 연결되지 않아 표준 위치를 따로 확인해야 해요.'};
 if(course.completion==='unknown'){
  if(course.completionInput==='unentered')return {position:'progress-unentered',text:'원표에서 비교할 과정은 찾았어요. 진행 상태를 아직 입력하지 않아 ◆ 위치는 표시하지 않았어요. 지금 기록만으로도 이어서 볼 수 있어요.'};
  if(course.completionInput==='reported')return {position:'progress-unknown',text:'원표에서 비교할 과정은 찾았어요. 진행 상태를 모른다고 답해 ◆ 위치는 표시하지 않았어요. 지금 기록만으로도 이어서 볼 수 있어요.'};
  return {position:'progress-unconfirmed',text:'원표에서 비교할 과정은 찾았어요. 이전 기록의 진행 상태가 미확인이라 ◆ 위치는 표시하지 않았어요. 기존 기록은 그대로 남겨 두었어요.'};
 }
 return {position:'unmapped',text:'현재 기록은 남겨 두었어요. 이 교재의 표준 위치는 별도로 확인해야 해요.'};
}
export function mountResultView(root,{state}={}){
 if(!root)return {dispose(){}};
 const scroller=root.querySelector('.chart-scroll'),marker=root.querySelector('.today-marker');
 const context=scroller?JSON.stringify([state?.id||'',state?.wizard?.quick?.stage||'',state?.profile?.reportedAge??'',scroller.dataset.chartContext||'']):'';
 const centerCurrent=()=>{
  if(!scroller||!marker)return;
  const at=marker.getBoundingClientRect().left-scroller.getBoundingClientRect().left+scroller.scrollLeft;
  const label=root.querySelector('.chart-label');
  const fixedWidth=label?.getBoundingClientRect().width||0;
  scroller.scrollLeft=Math.max(0,at-(scroller.clientWidth+fixedWidth)/2);
 };
 if(scroller){
  if(chartPositions.has(context))scroller.scrollLeft=chartPositions.get(context);
  else centerCurrent();
 }
 const remember=()=>{if(scroller)chartPositions.set(context,scroller.scrollLeft);};
 const onClick=event=>{if(event.target.closest('[data-show-current-month]')){event.preventDefault();centerCurrent();remember();}};
 root.addEventListener('click',onClick);
 scroller?.addEventListener('scroll',remember,{passive:true});
 return {dispose(){remember();root.removeEventListener('click',onClick);scroller?.removeEventListener('scroll',remember);}};
}
