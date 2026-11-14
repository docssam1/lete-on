import{items}from'./c22-s62-u01.js';
const definitions=[
 ['태양 고도를 읽는 기준을 확인해요','태양 고도','수평면과 태양을 향한 방향 사이의 각을 표시해요.','E1'],
 ['태양 고도 측정기의 기준과 고정 상태를 살펴요','측정기','받침은 수평, 막대는 수직인지 확인하고 같은 기준으로 읽어요.','E1'],
 ['태양 고도와 그림자 길이의 관계를 다시 살펴요','태양 고도·그림자 길이','같은 막대에서 두 시각의 태양 고도와 그림자 길이를 함께 비교해요.','E1'],
 ['표와 그래프의 시각·값·단위를 확인해요','표와 그래프','가로축과 세로축이 나타내는 양을 읽고 같은 조건의 값을 비교해요.','E1'],
 ['태양 고도와 기온이 가장 높은 시각을 구별해요','기온의 변화','지표와 공기가 데워지는 시간과 구름·바람의 영향도 살펴요.','E1'],
 ['계절별 태양 남중 고도를 같은 장소에서 비교해요','태양 남중 고도','같은 지역에서 날짜를 달리한 남중 무렵의 고도를 비교해요.','E2'],
 ['일출·일몰 시각으로 낮의 길이를 구해요','낮의 길이','같은 날 같은 장소의 일몰 시각에서 일출 시각을 빼요.','E2'],
 ['빛의 총량과 단위 면적이 받은 양을 구별해요','태양 에너지','같은 빛이 퍼진 면적과 한 칸이 받은 에너지를 나누어 비교해요.','E3'],
 ['빛의 각도 이외의 실험 조건도 확인해요','비교 조건','광원의 밝기·중심 거리·시간·종이의 성질을 같게 두고 각도를 바꾸어요.','E3'],
 ['계절 변화의 원인을 자전축·공전과 연결해요','계절 변화','기울어진 자전축을 유지한 공전에서 고도·낮의 길이·받는 에너지까지 설명해요.','E4'],
 ['공전 모형에서 자전축의 방향을 유지해요','자전축 모형','기울기와 공간에서 향하는 방향을 유지하며 같은 지역의 남중을 맞추어요.','E4'],
 ['자료의 조건과 햇빛의 생활 속 관계를 살펴요','자료의 조건','장소·날짜·시각과 빛의 방향을 확인하고 자료에서 알 수 있는 것을 설명해요.','E2'],
 ['두 반구의 반대 계절을 구별해요','북반구·남반구','같은 시기에 두 반구가 햇빛을 받는 각도와 시간을 비교해요.','E4']
];
export const misconceptions=Object.fromEntries(definitions.map(([label,term,fix,element],i)=>['M'+String(i+1).padStart(2,'0'),{label,terms:[term],fix,element}]));
export const typed={},distractors={},written={},cloze={},cells={};
for(const q of items){const ac=q.answerContract,mis='M'+(q.type||q.taxonomy.type).slice(1);if(ac.type==='short-text')typed[q.id]={any:mis};if(q.choices)distractors[q.id]=Object.fromEntries(q.choices.map((_,i)=>[i,[].concat(ac.answers??ac.answer).includes(i)?null:mis]).filter(([,m])=>m));}
export const remedy=Object.fromEntries(Object.keys(misconceptions).map(code=>[code,{step:3}]));
