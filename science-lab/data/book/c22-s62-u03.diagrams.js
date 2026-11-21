// 부품의 실제 크기와 생김새가 아닌 연결 관계를 나타내는 설명 그림이다.
const esc=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;');
const text=(x,y,s,size=18)=>`<text x="${x}" y="${y}" font-size="${size}" fill="#2a241c">${esc(s)}</text>`;
const line=(x1,y1,x2,y2)=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#2f6b4a" stroke-width="3"/>`;
const battery=(x,y)=>`<rect x="${x}" y="${y}" width="95" height="35" fill="#e9f0e7" stroke="#2f6b4a" stroke-width="2"/>${text(x+10,y+25,'+')}${text(x+70,y+25,'−')}`;
const panel=(offset,open)=>{
 const x=n=>n+offset;
 return text(x(18),28,open?'스위치를 열었을 때':'스위치를 닫았을 때')+
  line(x(45),164,x(20),164)+line(x(20),164,x(20),75)+line(x(20),75,x(132),75)+
  `<circle cx="${x(155)}" cy="75" r="23" fill="${open?'#fdfbf5':'#f6e7b9'}" stroke="#2f6b4a" stroke-width="2"/>`+
  line(x(140),60,x(170),90)+line(x(140),90,x(170),60)+text(x(133),125,'전구')+
  line(x(178),75,x(220),75)+line(x(220),75,x(250),open?50:75)+line(x(250),75,x(280),75)+
  line(x(280),75,x(280),164)+line(x(280),164,x(140),164)+battery(x(45),147)+text(x(195),110,'스위치',16)+text(x(65),211,'전지 한 개',16);
};
const wrap=(body,box,label,caption)=>`<figure class="electricity-book-diagram"><svg xmlns="http://www.w3.org/2000/svg" viewBox="${box}" role="img" aria-label="${label}">${body}</svg><figcaption>${caption}</figcaption></figure>`;
export const electricityCircuitFigure=wrap(panel(0,false)+panel(315,true),'0 0 615 225','전지와 전구 하나의 닫힌 회로와 스위치가 열린 회로의 비교','연결 관계를 나타낸 설명 그림이에요. 실제 전구의 옆 금속과 바닥 금속은 서로 다른 두 접점에 해당해요.');
export const electricitySeriesFigure=wrap(battery(35,48)+line(130,65,210,65)+battery(210,48)+line(35,65,12,65)+line(305,65,328,65)+text(128,29,'서로 다른 극끼리 연결',16)+text(42,117,'남은 +극')+text(225,117,'남은 −극'),'0 0 340 135','첫 전지의 마이너스극과 둘째 전지의 플러스극을 연결하고 바깥의 두 극을 남긴 전지 직렬연결','전지 두 개의 직렬연결을 나타낸 회로의 일부예요. 남은 두 극을 전구가 있는 회로에 연결해요.');
