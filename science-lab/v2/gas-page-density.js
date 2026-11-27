// Join adjacent checks on the same topic. Keep drawing space and question data intact.
export const GAS_DENSITY_VERSION='20261124-gas-page-density';
const unit='c22-s42-u03',prior='35754854c8b36d32',cache=new WeakMap();
function fingerprint(value){let a=2166136261,b=3335557771;for(const c of JSON.stringify(value)){const n=c.charCodeAt(0);a=Math.imul(a^n,16777619);b=Math.imul(b^n,2246822519);}return(a>>>0).toString(16).padStart(8,'0')+(b>>>0).toString(16).padStart(8,'0');}
const groups=[
 [36,38,'부피를 비교하기 전에 살펴요','공기가 차지하는 공간을 비교할 때는 공기의 양과 바깥 압력 등 다른 조건도 살펴요.','중학교에서는 온도가 높아질수록 기체 입자의 운동이 활발해진다고 설명해요. 입자 자체가 커지는 것은 아니에요.','부피를 비교하기 전에 같게 할 조건을 말해 보세요.'],
 [47,48,'공기의 무게를 비교해요','작은 차이가 보이지 않으면 저울과 공기 출입을 살펴요. 같은 용기에 공기를 넣기 전과 후를 비교해요.','중학교에서는 질량과 무게를 구별해요. 물체에 들어 있는 물질의 양인 질량과 중력이 작용하는 힘인 무게는 서로 다른 양이에요.','전후 그림에서 같게 그린 부분을 찾아보세요. 아직 잘 모르겠는 점을 한 가지 말해 보세요.'],
 [62,63,'주머니의 변화를 살펴요','같은 양의 공기로 온도에 따른 부피를 비교해요. 변화가 잘 보이지 않으면 새는 곳과 기다린 시간도 확인해요.','중학교에서는 기체의 온도와 부피 관계를 비교할 때 같은 양의 기체와 일정한 압력이 필요함을 배워요. 단단한 용기처럼 부피가 고정된 경우도 구별해요.','같게 둘 조건과 더 확인할 점을 한 가지씩 짚어 보세요.'],
 [70,71,'기체의 성질을 찾아 소개해요','기체의 성질과 쓰임을 자료에서 찾아요. 조사한 내용과 직접 관찰한 결과는 구별해요.','중학교에서는 순물질과 혼합물을 구별해요. 산소는 한 종류의 물질이고 공기는 여러 기체가 섞인 것이에요.','질소의 성질과 식품 포장의 쓰임을 연결해 말해 보세요.'],
 [78,79,'만든 장치의 시험 기록을 읽어요','같은 조건의 시험 결과를 비교해요. 종이가 달라지면 성공한 횟수도 달라질 수 있어요.','중학교에서는 기체의 압력과 부피를 입자 모형으로 설명해요. 고등학교에서는 압력·부피·온도의 관계를 수식으로 나타내며 절대온도를 사용해요.','같게 둔 조건과 바꾼 조건을 찾아보세요.']
];
const ids=p=>p.blocks.flatMap(b=>b.ids||[]),number=id=>Number(id?.split('-w').at(-1));
export function withGasPageDensity(w){
 if(w?.unit!==unit||fingerprint(w)!==prior)return w;if(cache.has(w))return cache.get(w);
 function arrange(input){const pages=[];for(let i=0;i<input.length;i++){
  const p=input[i],g=groups.find(([a])=>number(ids(p)[0])===a);if(!g){pages.push(ids(p).includes(unit+'-w045')?{...p,layout:'gas-density-matching'}:p);continue;}
  const next=input[i+1],all=[...ids(p),...ids(next)];if(all.length!==g[1]-g[0]+1||all.some((id,k)=>number(id)!==g[0]+k))throw Error('Incomplete gas density group '+g[0]);
  if(g[0]===70||g[0]===78){const q=w.questions.find(q=>q.no===g[1]);if(q.given?.length!==1||!p.blocks.some(b=>b.type==='text'&&b.text===q.given[0]))throw Error('Gas shared data differ '+g[1]);}
  const at=p.blocks.findIndex(b=>b.type==='questions'),prefix=p.blocks.slice(0,at),suffix=[...p.blocks.slice(at+1),...next.blocks].filter(b=>b.type!=='questions');
  pages.push({...p,layout:'gas-density',section:'연습 '+g[0]+'~'+g[1],title:g[2],...([70,78].includes(g[0])?{lead:g[0]+'~'+g[1]+'번은 같은 자료를 보고 풀어요.'}:{}),blocks:[...prefix,{type:'questions',ids:all},...(g[0]===47?[]:suffix)],rail:[{title:'핵심 정리',text:g[3]},{title:'더 알아보기',text:g[4]},{title:'내가 정리할 것',text:g[5]}],...(p.teacherNote||next.teacherNote?{teacherNote:[p.teacherNote,next.teacherNote].filter(Boolean).join(' ')}:{})});i++;
 }return pages;}
 const result={...w,pages:arrange(w.pages),teacherStudentPages:arrange(w.teacherStudentPages)};cache.set(w,result);return result;
}
