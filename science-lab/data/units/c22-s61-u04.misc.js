import{items}from'./c22-s61-u04.js';
// 원래 문항의 의미를 기준으로 만든 진단표. 편집 문항은 diagnosticOverride로 구별한다.
export const misconceptions={
 M01:{label:'관찰하는 방향과 동쪽·서쪽을 다시 확인해요',terms:['남쪽','동쪽','서쪽'],fix:'남쪽을 바라보는 사람의 왼쪽과 오른쪽에 방위를 표시해요.',element:'E1'},
 M02:{label:'자전과 공전의 중심·주기를 구별해요',terms:['자전','공전','하루','일 년'],fix:'자전은 자전축을 중심으로 하루에 한 바퀴, 공전은 태양 둘레를 일 년에 한 바퀴 도는 운동이에요.',element:'E2'},
 M03:{label:'같은 지역에서 낮과 밤이 바뀌는 까닭을 확인해요',terms:['낮','밤','태양빛'],fix:'지구의를 돌리며 같은 지역 표시가 빛을 받는 때와 받지 않는 때를 비교해요.',element:'E2'},
 M04:{label:'지구의 자전과 하늘에서 보이는 이동을 구별해요',terms:['자전 방향','위치 변화'],fix:'지구는 서쪽에서 동쪽으로 자전하고, 남쪽 하늘의 천체는 반대로 움직이는 것처럼 보여요.',element:'E2'},
 M05:{label:'지구의 공전과 계절별 별자리의 관계를 확인해요',terms:['공전','계절별 별자리'],fix:'태양과 별 카드를 고정하고 지구의 위치를 바꾸며 한밤중에 바라보는 방향을 비교해요.',element:'E3'},
 M06:{label:'관찰 조건과 자료에서 확인한 내용을 구별해요',terms:['장소','날짜','시각','방향'],fix:'하루의 변화를 볼 때는 같은 날의 시각을, 계절별 변화를 볼 때는 날짜를 바꾸어 비교해요.',element:'E1'},
 M07:{label:'모형의 각 부분이 무엇을 나타내는지 확인해요',terms:['지구의','광원','모형실험'],fix:'지구의는 지구를, 광원은 태양을 나타내요. 모형으로 나타내지 못한 점도 찾아보아요.',element:'E4'},
 M08:{label:'관찰한 변화와 관련된 지구의 운동을 함께 설명해요',terms:['위치 변화','자전','공전'],fix:'어떤 조건에서 무엇이 달라졌는지 말하고, 자전이나 공전으로 그 까닭을 설명해요.',element:'E4'},
};
const codes={T01:'M04',T02:'M03',T03:'M02',T04:'M04',T05:'M05',T06:'M02',T07:'M06',T08:'M04',T09:'M03',T10:'M07',T11:'M01',T12:'M06',T13:'M08'};
export const typed={},distractors={},written={},cloze={},cells={};
for(const q of items){
 const ac=q.answerContract,code=codes[q.type||q.taxonomy.type];
 if(ac.type==='short-text')typed[q.id]={any:code};
 if(q.choices)distractors[q.id]=Object.fromEntries(q.choices.map((_,i)=>[i,[].concat(ac.answers??ac.answer).includes(i)?null:code]).filter(([,m])=>m));
}
export const remedy=Object.fromEntries(Object.keys(misconceptions).map(code=>[code,{step:3}]));
