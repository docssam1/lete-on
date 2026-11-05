// Student-facing wording over generated workbook data. Questions and answers stay intact.
// Learning terms follow Education Ministry 2022-33, Annex 9; codes remain in question metadata.
const warmupUnits=new Set([
 'c22-s32-u01','c22-s32-u02','s41-u01','c22-s42-u01','c22-s51-u03',
 's31-u01','s31-u02','s31-u03','s31-u04','c22-s42-u02','c22-s32-u03','s41-u02','s41-u03',
]);
const warmupHints={
 'c22-s42-u01':'기억에 남는 달의 모양이나 별자리를 자유롭게 적어 보아요.',
 's31-u02':'내가 알고 있는 동물은 어떤 특징이 있나요? 자유롭게 적어 보아요.',
 's31-u03':'주변에서 본 식물의 잎은 어떤 모양이었나요? 자유롭게 적어 보아요.',
};
const guides={
 'c22-s42-u01':{
  heads:['배울 내용','해 볼 활동'],rows:[
   ['달의 모양과 표면','달을 관찰하고 여러 날 동안 모양 변화 살펴보기'],
   ['태양계의 구성원','태양과 행성을 조사하고 행성 모형 만들기'],
   ['별과 별자리','별의 뜻을 알고 북극성 주변의 별자리 관찰하기'],
  ],
 },
 'c22-s42-u02':{
  heads:['배울 내용','해 볼 활동'],rows:[
   ['생태계의 구성 요소','생물 요소와 비생물 요소를 조사하고 분류하기'],
   ['생물의 먹이 관계','먹고 먹히는 관계를 조사하여 먹이그물로 나타내기'],
   ['인간 활동과 생태계 보전','인간 활동의 영향을 조사하고 보전을 위해 할 일을 토의하여 실천하기'],
  ],
 },
 'c22-s51-u03':{
  heads:['배울 내용','해 볼 활동'],rows:[
   ['용해와 용액','용해 현상을 관찰하고 용해 전과 후의 무게 비교하기'],
   ['물에 녹는 용질의 양','용질의 종류나 물의 온도를 바꾸어 녹는 양 비교하기'],
   ['용액의 진하기','용질과 용매의 양을 달리하고 같은 물체의 뜨는 정도 비교하기'],
   ['생활 속 용액의 쓰임','용액이 쓰이는 사례를 조사하고 필요성을 알리는 자료 만들어 공유하기'],
   ['문제로 확인하기','객관식·복수선택·빈칸·연결·순서·단답·서술·그림 문제 풀기'],
  ],
 },
 's31-u01':{
  heads:['배울 내용','살펴볼 것','설명할 내용'],rows:[
   ['물체를 밀거나 당길 때의 변화','힘을 주기 전과 후의 움직임과 모양','힘을 주면 물체에 어떤 변화가 생기는지 설명하기'],
   ['수평잡기로 무게 비교하기','판자의 수평과 물체를 놓은 위치','가운데에서 같은 거리에 놓은 두 물체의 무게 비교하기'],
   ['저울로 무게 비교하기','영점과 저울이 가리키는 값, 단위','정확한 무게 비교에 저울이 필요한 까닭 설명하기'],
   ['생활 속 지레와 빗면','같은 물체를 같은 높이로 들어 올릴 때 드는 힘','도구의 쓰임을 조사하고 힘의 크기 비교하기'],
  ],
 },
 's31-u02':{
  heads:['배울 내용','해 볼 활동'],rows:[
   ['여러 가지 동물의 특징','동물을 관찰하고 생김새의 공통점과 차이점 찾기'],
   ['특징에 따른 동물 분류','관찰한 특징으로 기준을 정하여 동물 분류하기'],
   ['사는 환경과 동물의 생활','생김새와 생활 방식이 환경과 관련된 점 조사하기'],
   ['동물의 특징을 이용한 생활용품','생활용품을 설계하고 친구와 의견 나누기'],
  ],
 },
 's31-u03':{
  heads:['배울 내용','해 볼 활동'],rows:[
   ['여러 가지 식물의 특징','잎의 모양·끝·가장자리 등 생김새 관찰하기'],
   ['특징에 따른 식물 분류','잎의 특징으로 기준을 정하여 식물 분류하기'],
   ['사는 환경과 식물의 생활','생김새와 생활 방식이 환경과 관련된 점 조사하기'],
   ['식물의 특징을 이용한 생활용품','생활용품을 설계하고 친구와 의견 나누기'],
  ],
 },
 'c22-s32-u04':{
  heads:['배울 내용','살펴볼 자료','해 볼 활동'],rows:[
   ['감염병의 사례와 위험성','생활 속 감염병 사례','감염병의 위험성 토의하기'],
   ['감염 과정과 생활 습관','접촉·비말·공기·물과 음식 등을 통한 감염 사례','생활 습관과 감염병 유행의 관계 설명하기'],
   ['손 씻기와 감염병 예방','손 모형에서 반짝이 가루가 옮겨 가는 모습','모형으로 손 씻기의 효과 알아보기'],
   ['감염병 예방 수칙','손 씻기·기침 예절·환기 등의 생활 습관','예방 수칙을 공유하고 생활에서 실천하기'],
  ],
 },
 'c22-s42-u04':{
  heads:['배울 내용','해 볼 활동','연습 문항'],rows:[
   ['기후변화의 사례','지역·기간·평년값을 확인하며 기후 자료 살펴보기','5~12,47~54'],
   ['인간 활동과 기후변화','인간 활동과 기후변화의 관계 토의하기','13~16,27~28'],
   ['기후변화가 생활과 환경에 미치는 영향','해수면 상승으로 인한 피해를 모형실험으로 알아보기','17~22,29~30,55~62'],
   ['기후변화 대응 방법','대응 방법을 조사하고 생활 속에서 실천하기','23~26,63~70'],
   ['배운 내용 정리하기','자료로 알게 된 내용과 실천한 일을 설명하기','31~46,71~80'],
  ],
 },
};
const openingText={
 'c22-s51-u03':'설탕이 물에 녹으면 없어진 걸까요? 용해 전과 후의 무게를 비교하고, 용질의 종류와 물의 온도에 따라 녹는 양이 어떻게 달라지는지 알아보아요. 용액의 진하기도 비교해 보아요.',
 's31-u02':'여러 가지 동물을 관찰하고 생김새의 특징에 따라 분류해요. 동물의 생김새와 생활 방식이 사는 환경과 어떤 관련이 있는지 알아보고, 동물의 특징을 이용한 생활용품을 설계해요.',
 's31-u03':'여러 가지 식물의 잎을 관찰하고 특징에 따라 분류해요. 식물의 생김새와 생활 방식이 사는 환경과 어떤 관련이 있는지 알아보고, 식물의 특징을 이용한 생활용품을 설계해요.',
};
export const STUDENT_OPENING_UNITS=Object.freeze([...new Set([...warmupUnits,...Object.keys(guides)])]);
export function withStudentOpeningLanguage(workbook){
 const unit=workbook.unit,guide=guides[unit],warmup=warmupUnits.has(unit);
 if(!guide&&!warmup)return workbook;
 const revise=(page,index)=>{
  if(index>1)return page;
  const blocks=page.blocks.map(block=>{
   if(index===0){
    if(warmup&&block.type==='field')return {...block,title:'워밍업',...(warmupHints[unit]?{hint:warmupHints[unit]}:{})};
    if(openingText[unit]&&block.type==='text')return {...block,text:openingText[unit]};
   }
   if(index===1&&guide){
    if(block.type==='table')return {...block,heads:[...guide.heads],rows:guide.rows.map(row=>[...row])};
    if(block.type==='field')return {...block,title:'궁금한 점'};
   }
   return block;
  });
  return {...page,...(index===1&&guide?{title:'이번 단원에서 배울 내용'}:{}),...(index===0&&unit==='s31-u03'?{title:'식물의 생김새와 생활을 알아보아요'}:{}),blocks};
 };
 return {...workbook,pages:workbook.pages.map(revise),...(workbook.teacherStudentPages?{teacherStudentPages:workbook.teacherStudentPages.map(revise)}:{})};
}

export const STUDENT_GUIDE_VERSION='20261105-student-guide';
export const STUDENT_GUIDE_UNITS=Object.freeze(['s41-u02','s41-u03','c22-s42-u04','c22-s61-u03','c22-s61-u04','c22-s62-u01']);
const guideSentences={
 's41-u02':[
  ['4과10-01 물의 세 상태와 주변의 예','물의 세 가지 상태를 알아보고 우리 주변에서 예를 찾아요.'],
  ['4과10-02 다섯 상태 변화의 관찰','물이 얼거나 얼음이 녹을 때, 물이 증발하거나 끓을 때, 수증기가 응결할 때의 변화를 관찰해요.'],
  ['4과10-03 상태 변화를 이용하는 물 얻는 장치','물의 상태 변화를 이용하여 물을 얻는 장치를 설계하고 만들어요.'],
 ],
 's41-u03':[
  ['4과11-01 흐르는 물의 작용과 강 지형','흐르는 물의 작용과 강 주변 지형의 특징을 연결해요.'],
  ['4과11-02 화산·분출물과 모형 표현','화산 활동으로 나오는 물질을 알아보고, 화산 활동을 모형으로 나타내요.'],
  ['4과11-03 화성암 관찰과 분류','현무암과 화강암을 관찰하고 특징에 따라 분류해요.'],
  ['4과11-04 생활 영향 조사와 대처 실천','화산 활동과 지진이 우리 생활에 미치는 영향을 조사하고 대처 방법을 실천해요.'],
 ],
 'c22-s42-u04':[
  ['현행 교육과정의 사례·생활 영향·대응 실천을 중심으로 공부해요. 자료를 읽거나 계획을 만든 것과 실제로 해 본 것을 나누어 남겨요.','기후변화가 우리 생활과 환경에 미치는 영향을 자료에서 찾아보아요. 대응 방법을 조사하고 생활에서 실천할 수 있는 일을 정해 해 보아요. 조사한 내용과 직접 실천한 일을 구별해 적어요.'],
 ],
};
const guideSections={
 'c22-s61-u03':{'단원 수행평가 A · 6과11-01':'단원 수행평가 A','단원 수행평가 B · 6과11-02':'단원 수행평가 B','단원 수행평가 C · 6과11-03':'단원 수행평가 C'},
 'c22-s61-u04':{'단원 수행평가 A · 6과12-01':'단원 수행평가 A','단원 수행평가 B · 6과12-02':'단원 수행평가 B','단원 수행평가 C · 6과12-03':'단원 수행평가 C'},
 'c22-s62-u01':{'단원 수행평가 · 6과13-01':'단원 수행평가 A','단원 수행평가 · 6과13-02':'단원 수행평가 B','단원 수행평가 · 6과13-03':'단원 수행평가 C'},
};
export function withStudentGuideLanguage(workbook){
 if(!STUDENT_GUIDE_UNITS.includes(workbook.unit))return workbook;
 const sentences=new Map(guideSentences[workbook.unit]||[]);
 const revise=value=>{
  if(typeof value==='string')return sentences.get(value)||value;
  if(Array.isArray(value))return value.map(revise);
  if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).map(([key,entry])=>[key,revise(entry)]));
  return value;
 };
 const pages=rows=>rows.map(page=>({...page,section:guideSections[workbook.unit]?.[page.section]||page.section,blocks:revise(page.blocks)}));
 return {...workbook,pages:pages(workbook.pages),...(workbook.teacherStudentPages?{teacherStudentPages:pages(workbook.teacherStudentPages)}:{})};
}

export const ACTIVITY_GUIDE_VERSION='20261105-activity-guide';
const activityGuideSentences={
 's31-u01':[
  ['공을 밀고, 수레를 당기고, 찰흙을 눌러 보아요. 물체의 움직임과 모양을 살피고, 수평과 저울로 무게를 비교해요. 생활 도구가 어떻게 도움을 주는지도 근거로 설명해요.','공을 밀고, 수레를 당기고, 찰흙을 눌러 보아요. 물체의 움직임과 모양을 살피고, 수평잡기와 저울로 무게를 비교해요. 생활 도구가 어떻게 도움을 주는지도 근거로 설명해요.'],
  ['같은 거리에서 수평으로 무게 비교','받침점에서 같은 거리에 놓고 수평잡기로 무게 비교'],
  ['수평과 저울의 기초','수평잡기와 저울의 기초'],
  ['수평과 저울의 순서','수평잡기와 저울의 순서'],
  ['힘을 주기 전과 뒤의 움직임·모양을 비교해요. 무게 비교에는 수평의 거리 조건과 저울의 값·단위를 근거로 써요.','힘을 주기 전후의 움직임과 모양을 비교해요. 수평잡기로 무게를 비교할 때는 받침점에서 같은 거리에 놓아요. 저울의 값과 단위를 함께 읽어요.'],
 ],
 'c22-s52-u02':[
  ['고체·물·공기와 빛에서 열이 이동하는 모습 비교하기','전도·대류·복사로 열이 이동하는 모습 비교하기'],
 ],
};
export const ACTIVITY_GUIDE_UNITS=Object.freeze(Object.keys(activityGuideSentences));
export function withActivityGuideLanguage(workbook){
 const entries=activityGuideSentences[workbook.unit];
 if(!entries)return workbook;
 const sentences=new Map(entries);
 const revise=value=>{
  if(typeof value==='string')return sentences.get(value)||value;
  if(Array.isArray(value))return value.map(revise);
  if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).map(([key,entry])=>[key,revise(entry)]));
  return value;
 };
 return {...workbook,pages:revise(workbook.pages),...(workbook.teacherStudentPages?{teacherStudentPages:revise(workbook.teacherStudentPages)}:{})};
}
