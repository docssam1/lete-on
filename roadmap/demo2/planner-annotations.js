/* Editorial guidance uses the chosen plan. It never changes course dates, curve data or learner answers. */
(function(global){
'use strict';
const NS='http://www.w3.org/2000/svg';
function narrative(p,kind='graph'){
 if(p.standard)return {label:'현재 공부에서 이어지는 기준입니다',text:p.standard.sequential?'응용 다음에는 같은 학기의 심화를 연결했습니다. 연산은 별도로 이어가며, 상위 두 단계도 같은 기간 동안 계속 공부하는 모습으로 비교합니다.':'교과·사고력·심화·연산을 각자의 현재 진도에서 이어가는 기준입니다. 추가 회차는 아직 적용하지 않았습니다. 맞춤 계획에서 시간을 더 배분했을 때의 차이를 살펴볼 수 있습니다.'};
 if(!p.book||!p.range)return {label:'출발점을 함께 잡아볼게요',text:'현재 공부하는 교재와 이어갈 범위부터 골라주세요. 선택한 내용이 지도와 월별 계획에 차례로 담깁니다.'};
 if(kind==='map')return {label:'이 로드맵을 읽는 순서',text:`${p.book} ${global.PlannerTransition.schoolLabel(p.d.n)}에서 출발해 ${global.PlannerTransition.schoolLabel(p.d.range.end)}까지 연결했습니다. 지점을 누르면 그 학기에 병행할 심화와 연산을 함께 살펴볼 수 있습니다.`};
 if(p.d.s.axis!=='school')return {label:'영역마다 따로 살펴봅니다',text:'교과의 추가 회차를 사고력이나 연산의 속도에 그대로 적용하지 않았습니다. 각 영역의 현재 범위와 비교 예시를 나누어 살펴보세요.'};
 if(p.state==='catch')return {label:'같은 범위에 이른 다음도 봅니다',text:`${global.PlannerTransition.meetingText(p.m)} 필요한 복습은 유지합니다. 이후는 학습 성향에 따라 달라짐.`};
 if(p.state==='outside')return {label:'여기부터는 참고 일정입니다',text:`${global.PlannerTransition.meetingText(p.m)} 만나는 지점은 선택한 교재 범위 밖의 참고 일정입니다. 이후는 학습 성향에 따라 달라짐.`};
 if(p.state==='no-catch')return {label:'차이가 조금씩 생기는 구간을 보세요',text:'학습량을 늘린 경우의 선이 현재 속도선에서 서서히 벌어집니다. 이 조건에서는 24개월 안에 상위 예시와 만나지 않으며, 6개월 적응 뒤에는 목표 회차를 더 늘리지 않고 유지합니다. 이후는 학습 성향에 따라 달라짐.'};
 if(p.state==='review')return {label:'이번 선택은 공부의 깊이에 쓰는 시간입니다',text:'늘린 시간을 복습과 심화에 먼저 배분했으므로 진도선은 겹칩니다. 같은 범위를 더 독립적으로 풀고 설명하게 되는지 확인해 보세요.'};
 if(p.state==='check')return {label:'진도를 더하기 전에 확인할 것이 있습니다',text:'현재 범위를 다른 날에도 혼자 풀고 설명할 수 있는지 먼저 살펴보세요. 확인하기 전에는 추가 회차로 앞당긴 일정을 표시하지 않습니다.'};
 if(p.state==='load'||p.state==='allocation')return {label:'같은 시간도 어디에 쓰느냐에 따라 달라집니다',text:'추가 분량의 용도와 목표 회차를 고르면 차이를 비교할 수 있습니다. 기존 복습·심화·연산을 덜어내는 계획으로 계산하지 않습니다.'};
 return {label:'지금의 흐름을 기준으로 봅니다',text:'현재 속도로 이어가는 선과, 같은 시간 동안 공부하는 상위 두 예시를 함께 보세요. 책의 진도와 이해의 깊이는 따로 확인해야 합니다.'};
}
function coach(p,page){
 const book=p.book||'현재 교재';
 const copy={book:`지금 쓰는 교재를 계속 사용해도 좋습니다. ${book}에서 무엇을 익혔고 어디에서 도움이 필요한지 먼저 짚어보겠습니다.`,range:'끝 학기를 고르면 중간 과정을 차례로 연결해 드립니다. 표시된 월은 비교를 위한 일정이니, 아이가 충분히 익혔는지 보며 조정해 주세요.',deep:'새 교과 진도와 심화의 속도를 꼭 맞출 필요는 없습니다. 이미 배운 범위에서 조건을 읽고 풀이의 이유를 설명하는 시간을 가져도 좋습니다.',deepScope:'심화에서 다룰 범위를 교과와 나란히 놓아보겠습니다. 같은 범위를 깊게 다룰지, 이미 배운 내용을 한 번 더 생각해 볼지 골라주세요.',cadence:'교과 뒤에 심화를 이어갈지, 같은 시기에 나란히 공부할지 정합니다. 병행을 고르더라도 심화에 필요한 기간까지 줄이지는 않습니다.',calc:'연산은 교과와 나란히 이어가는 별도의 흐름입니다. 권수보다 계산 원리와 반복되는 오류를 살피면서 필요한 범위를 정해 주세요.',checkpoint:'책을 끝냈다는 사실만으로 다음 범위를 정하지는 않겠습니다. 다른 날, 조건이 달라진 문제에서도 스스로 설명하는 모습을 떠올려 보세요.',tempo:'더하는 시간만큼 곧바로 빨라지는 것은 아닙니다. 복습과 심화는 지키면서 새 진도에 조금 더 배분했을 때의 차이를 비교해 보겠습니다.',allocation:'같은 추가 시간도 복습에 쓰는지, 새 진도에 나누는지에 따라 다릅니다. 지금 아이에게 더 필요한 쪽을 골라주세요.',load:'처음부터 목표 회차를 모두 채우지 않습니다. 2개월·4개월·6개월에 걸쳐 목표까지 조금씩 늘립니다. 그 뒤에는 회차를 더 늘리지 않고 합류까지 유지하는 흐름을 비교해 보세요.',summary:`${book}의 교재·범위와 병행 계획을 연결했습니다. 지도로 전체 흐름을 보고, 그래프와 표에서 시기와 회차를 차분히 비교해 보세요.`};
 return copy[page]||narrative(p,'map').text;
}
function svg(name,attrs={}){const n=document.createElementNS(NS,name);for(const [k,v]of Object.entries(attrs))n.setAttribute(k,v);return n;}
function note(copy,cls){const a=document.createElement('aside');a.className='editorial-note '+cls;a.setAttribute('aria-label','독쌤의 안내');const head=document.createElement('strong');head.className='editorial-note-label';head.textContent=copy.label;const text=document.createElement('p');text.textContent=copy.text;a.append(head,text);return a;}
function menuIcon(id){const paths={map:[['M2 17 12 22 22 17 12 12Z','#ad94c9'],['M2 13 12 18 22 13 12 8Z','#e5d8f2'],['M12 3c-5 0-5 6 0 10 5-4 5-10 0-10Z','#8963ac']],graph:[['M2 20 12 23 23 18 13 15Z','#c9b2de'],['M5 12 9 10 9 19 5 21Z','#a17fc2'],['M11 7 15 5 15 17 11 19Z','#8760ab'],['M17 3 21 1 21 15 17 17Z','#bda0d7']],table:[['M3 6 16 3 22 7 9 11Z','#f1e7fb'],['M3 6 9 11 9 22 3 17Z','#b89cd0'],['M9 11 22 7 22 18 9 22Z','#d8c4e8'],['M12 13 19 11M12 16 19 14M12 19 19 17','none']],records:[['M4 5 17 2 21 5 8 9Z','#eadcf5'],['M4 5 8 9 8 22 4 18Z','#a787c4'],['M8 9 21 5 21 18 8 22Z','#d8c1e9'],['M11 12 18 10M11 15 18 13M11 18 16 17','none']]};const icon=svg('svg',{viewBox:'0 0 24 24',class:'editorial-menu-icon sculpted-menu-icon','aria-hidden':'true'});for(const[d,fill]of paths[id]||paths.map)icon.append(svg('path',{d,fill,stroke:'#79558f','stroke-width':'.7','stroke-linejoin':'round','stroke-linecap':'round'}));return icon;}

function arrowOn(svgRoot,from,to,id,label){
 const group=svg('g',{class:'editorial-ink-arrow','aria-hidden':'true'}),defs=svg('defs'),marker=svg('marker',{id,viewBox:'0 0 10 10',refX:8,refY:5,markerWidth:6,markerHeight:6,orient:'auto'});marker.append(svg('path',{d:'M1 1L8 5L1 9',fill:'none',stroke:'#987044','stroke-width':'1.8','stroke-linecap':'round','stroke-linejoin':'round'}));defs.append(marker);group.append(defs);
 group.append(svg('path',{d:`M${from.x} ${from.y}Q${from.x+18} ${to.y-20} ${to.x} ${to.y}`,fill:'none',stroke:'#987044','stroke-width':'2','stroke-linecap':'round','marker-end':`url(#${id})`}));
 if(label){const text=svg('text',{x:from.x-8,y:from.y-10,class:'editorial-arrow-label'});text.textContent=label;group.append(text);}svgRoot.append(group);
}
function decorate(root,p){
 for(const tab of root.querySelectorAll('[role=tab][data-workspace-view]')){const label=tab.textContent,span=document.createElement('span');span.textContent=label;tab.replaceChildren(menuIcon(tab.dataset.workspaceView),span);}
 const terrain=root.querySelector('.course-route'),path=terrain?.querySelector('path');
 if(path&&p.rows.length>1){const wide=path.cloneNode();wide.classList.add('editorial-route-wash');path.before(wide);path.classList.add('editorial-route-ink');const count=p.rows.length-1,length=path.getTotalLength();for(let i=0;i<count;i++){const at=path.getPointAtLength(length*(i+.65)/count),before=path.getPointAtLength(Math.max(0,length*(i+.65)/count-25));arrowOn(terrain,{x:before.x,y:before.y-12},{x:at.x,y:at.y-2},'route-pen-'+i);}}
 const outcome=root.querySelector('.landscape-outcome');if(outcome){outcome.classList.add('editorial-route-note');const n=narrative(p,'map'),label=document.createElement('strong');label.textContent=n.label;outcome.prepend(label);outcome.querySelector('p').textContent=n.text+' '+outcome.querySelector('p').textContent;}
 const chart=root.querySelector('.transition-chart-wrap svg'),line=chart?.querySelector(p.d.s.axis==='school'&&p.m.adjusting?'.curve-gradual':'.curve-keep');
 if(chart&&line){const wide=line.cloneNode();wide.setAttribute('class','editorial-curve-wash');wide.setAttribute('aria-hidden','true');const wash=svg('g',{'aria-hidden':'true'});wash.append(wide);line.before(wash);
  const band=chart.querySelector('.curve-chase-window'),x=band?+band.getAttribute('x')+Math.min(+band.getAttribute('width')*.45,75):126;
  let lo=0,hi=line.getTotalLength();for(let i=0;i<24;i++){const mid=(lo+hi)/2;if(line.getPointAtLength(mid).x<x)lo=mid;else hi=mid;}const pt=line.getPointAtLength((lo+hi)/2);
  arrowOn(chart,{x:Math.min(620,pt.x+55),y:Math.max(60,pt.y-46)},{x:pt.x,y:pt.y-4},'curve-pen',band?'학습량을 서서히 늘리는 시기':'지금의 출발점');
 }
 const legend=root.querySelector('.transition-legend');if(legend){const anchor=root.querySelector('.transition-prep-note')?root.querySelector('.level-comparison')||legend:legend;anchor.after(note(narrative(p),'graph-coach-note'));}
}
function decorateCoach(el,p,page){if(!el)return;const kicker=document.createElement('span');kicker.className='speech-kicker';kicker.textContent='독쌤의 설계 메모';const text=document.createElement('span');text.className='speech-copy';text.textContent=coach(p,page);el.replaceChildren(kicker,text);el.classList.add('guide-speech');}
global.PlannerAnnotations=Object.freeze({narrative,coach,decorate,decorateCoach});
})(window);
