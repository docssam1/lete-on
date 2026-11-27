// Related learning standards, not a claim that a student performed or achieved them.
// Codes and unit scope: Education Ministry 2022-33, Annex 9, 6과09-01~04.
const groups={
 '6과09-01':[1,2,3,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,65,66,67,68,81,83,84,85,86,90,97,100,101,102,103,104,106,111,118,121,126],
 '6과09-02':[4,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,69,70,71,72,73,74,75,76,82,87,88,89,91,98,107,108,109,110,112,119,123],
 '6과09-03':[53,54,55,56,57,58,92,113],
 '6과09-04':[59,60,61,62,63,64,77,78,79,80,93,94,95,96,114,115,116,117,120,122,124,128],
};
const links={};
for(const [standard,numbers]of Object.entries(groups))for(const no of numbers){
 if(links[no])throw Error('산과 염기 성취기준의 문항 번호가 겹칩니다.');
 links[no]=Object.freeze([standard]);
}
// General laboratory conduct and learner-selected reflection span more than one standard.
links[99]=Object.freeze(['6과09-02','6과09-04']);
links[105]=Object.freeze(['6과09-01','6과09-02']);
for(const no of [125,127])links[no]=Object.freeze(Object.keys(groups));
if(Object.keys(links).length!==128||Array.from({length:128},(_,i)=>i+1).some(no=>!links[no]))throw Error('산과 염기 성취기준 연결이 빠졌습니다.');
export const ACID_QUESTION_STANDARDS=Object.freeze(links);
function codesFor(id,no){
 if(id!==`c22-s61-u01-w${String(no).padStart(3,'0')}`||!links[no])throw Error('산과 염기 문항 ID와 성취기준 번호가 다릅니다.');
 return links[no];
}
export function withAcidWorkbookStandards(question){
 const codes=codesFor(question.id,question.no),{standard:_standard,standards:_standards,...content}=question;
 return {...content,standards:[...codes],...(codes.length===1?{standard:codes[0]}:{})};
}
export function withAcidItemStandards(item){
 const ref=item.workbookRef;if(ref?.unit!=='c22-s61-u01')return item;
 const codes=codesFor(ref.id,ref.no),taxonomy=item.taxonomy||{};
 if(codes.length===1&&taxonomy.standard===codes[0]&&!taxonomy.standards)return item;
 if(codes.length>1&&!taxonomy.standard&&Array.isArray(taxonomy.standards)&&taxonomy.standards.length===codes.length&&taxonomy.standards.every((code,i)=>code===codes[i]))return item;
 const {standard:_standard,standards:_standards,...rest}=taxonomy;
 return {...item,taxonomy:{...rest,...(codes.length===1?{standard:codes[0]}:{standards:[...codes]})}};
}
