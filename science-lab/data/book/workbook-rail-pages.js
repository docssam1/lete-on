// Match teacher continuations to source content instead of assuming equal page numbers.
const signature=(page,continued=false)=>`${page.section}\u0000${continued?page.title.replace(/\s*·\s*이어서$/u,''):page.title}`;
const questionIds=page=>page.blocks.filter(block=>block.type==='questions').flatMap(block=>block.ids);
const titles=['핵심 정리','더 알아보기','내가 정리할 것'];

export function withMatchedWorkbookRails(workbook,notes){
 if(workbook.pages.length!==notes.length||notes.some(row=>!Array.isArray(row)||row.length!==3||row.some(text=>typeof text!=='string'||!text.trim())))throw Error('교재와 오른쪽 원고의 내용 묶음 수가 다릅니다.');
 const bySignature=new Map(),byQuestion=new Map();
 workbook.pages.forEach((page,index)=>{
  const key=signature(page),same=bySignature.get(key)||[];same.push(index);bySignature.set(key,same);
  for(const id of questionIds(page)){
   if(byQuestion.has(id))throw Error('오른쪽 원고의 기준 문항이 여러 쪽에 겹칩니다.');
   byQuestion.set(id,index);
  }
 });
 const revise=(page,index)=>{
  if(page.rail?.length!==3||page.rail[1].title!=='더 알아보기')throw Error('교재의 오른쪽 정리 칸이 다릅니다.');
  return {...page,rail:page.rail.map((note,i)=>({...note,title:titles[i],text:notes[index][i]}))};
 };
 const teacherIndex=page=>{
  const candidates=bySignature.get(signature(page,true))||[],ids=questionIds(page);
  if(!ids.length){if(candidates.length!==1)throw Error('교사용 내용 묶음을 하나로 정할 수 없습니다.');return candidates[0];}
  const matches=new Set(ids.map(id=>{
   if(!byQuestion.has(id))throw Error('교사용 문항의 학생용 기준 쪽이 없습니다.');
   return byQuestion.get(id);
  }));
  if(matches.size!==1)throw Error('교사용 한 쪽에 서로 다른 원고 묶음의 문항이 섞였습니다.');
  const index=[...matches][0];
  if(!candidates.includes(index))throw Error('교사용 문항과 표제의 원고 묶음이 다릅니다.');
  return index;
 };
 return {...workbook,pages:workbook.pages.map(revise),...(workbook.teacherStudentPages?{teacherStudentPages:workbook.teacherStudentPages.map(page=>page.kind==='duplex-blank'?page:revise(page,teacherIndex(page)))}:{})};
}
