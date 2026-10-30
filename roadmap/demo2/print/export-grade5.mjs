/** Export the very same grade-5 model used by planner.html, without browser storage. */
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import vm from 'node:vm';
export const root=resolve(dirname(fileURLToPath(import.meta.url)),'../../..');
export function exportGrade5(value=null){
 const window={},sandbox=vm.createContext({window,console});
 // Match the production dependency order. No app bootstrap or saved learner is read.
 for(const file of ['planner-levels.js','planner.js','demo-content.js','planner-intake.js','planner-progression.js','planner-transition.js','planner-study-plan.js','planner-study-plan-view.js','planner-report.js'])vm.runInContext(readFileSync(resolve(root,'roadmap/demo2',file),'utf8'),sandbox,{filename:file});
 const state=window.PlannerStudyPlan.restore(value),plan=window.PlannerStudyPlanView.model(state),report=window.PlannerStudyPlanView.reportModel(state);
 const graph=window.PlannerStudyPlanView.graph(plan).match(/<svg\b[\s\S]*?<\/svg>/)?.[0];
 if(!graph)throw Error('The production graph is missing.');
 for(const outlook of plan.scienceOutlook){outlook.startLabel=window.PlannerStudyPlan.dateAt(outlook.start).label;outlook.endLabel=window.PlannerStudyPlan.dateAt(outlook.end-1).label;}
 const calendar=[];
 for(let start=0;start<plan.horizon;start+=6){
  const end=Math.min(start+6,plan.horizon),months=plan.months.slice(start,end);
  const rows=plan.lanes.map(l=>{
   const cells=[];
   for(let at=start;at<end;at++){
    const within=l.blocks.filter(b=>b.start<at+1&&b.end>at),b=within[0];
    const texts=[...new Set(within.map(b=>b.title+(b.book&&!b.title.includes(b.book)?'\n'+b.book:'')))];
    const text=texts.join('\n→ ')||(l.id==='thinking'&&at>=8?'6개월 과정 종료\n다음 과정은 별도 선택':'별도 과정 추가 없음');
    const cell={span:1,text,tone:b?l.blocks.indexOf(b)%4:4,exam:within.some(b=>b.kind==='exam'||b.examFocus)};
    const last=cells.at(-1);if(last&&last.text===text&&last.tone===cell.tone&&last.exam===cell.exam)last.span++;else cells.push(cell);
   }
   return {id:l.id,label:l.label,cells};
  });
  calendar.push({start,end,title:months[0].year+'년 '+months[0].month+'월 - '+months.at(-1).year+'년 '+months.at(-1).month+'월',months,rows});
 }
 return JSON.parse(JSON.stringify({schema:'gfield-print-v1',sample:true,profile:'grade5-balanced',state,plan,report,calendar,graph:graph.replace('<svg ','<svg xmlns="http://www.w3.org/2000/svg" ').replace(/<title>[\s\S]*?<\/title>/g,'').replace('<svg xmlns=', '<svg font-family="Pretendard Variable" font-size="16" xmlns=')}));
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const out=resolve(process.argv[2]||resolve(root,'tmp/pdfs/grade5')),state=process.argv[3]?JSON.parse(readFileSync(process.argv[3],'utf8')):null;
 mkdirSync(out,{recursive:true});const data=exportGrade5(state);
 writeFileSync(resolve(out,'report.json'),JSON.stringify(data,null,2));writeFileSync(resolve(out,'graph.svg'),data.graph);
 console.log(JSON.stringify({output:out,months:data.plan.horizon,blocks:data.plan.lanes.map(l=>[l.id,l.blocks.length]),state:data.state}));
}
