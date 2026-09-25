/* ============================================================
   Numbers of Magic — MD86 사분위수와 상자그림.

   근거 범위: 디딤돌수학 개념연산 중3-2 인쇄 p.128~143.
   원본 문항·수치·문장·그림은 복제하지 않는다. 자료를 정렬하고 중앙값을
   제외한 두 절반의 중앙값으로 Q1/Q3를 구하는 교과 절차, 다섯 수 요약,
   상자그림 작성·읽기만 자체 유한 난수 문항으로 구현한다.
   ============================================================ */
(function(){
'use strict';

const R=NM_RNG.R,pick=NM_RNG.pick;
function L3(ko,en,zh){return{ko,en,zh};}
function shuffle(rng,a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=R(rng,0,i),t=a[i];a[i]=a[j];a[j]=t;}return a;}
function median(sorted){const n=sorted.length;return n%2?sorted[(n-1)/2]:(sorted[n/2-1]+sorted[n/2])/2;}
function quartiles(values){
  const ordered=values.slice().sort(function(a,b){return a-b;}),n=ordered.length,half=Math.floor(n/2);
  const lower=ordered.slice(0,half),upper=ordered.slice(n-half);
  return {ordered,min:ordered[0],q1:median(lower),median:median(ordered),q3:median(upper),max:ordered[n-1]};
}
function listTex(a){return '\\left\\{'+a.join(',\\;')+'\\right\\}';}
function boxes(n){return Array.from({length:n},function(){return '\\square';}).join(',\\;');}
function makeOrdered(rng,n){
  const out=[R(rng,0,18)];
  for(let i=1;i<n;i++)out.push(out[i-1]+R(rng,1,6));
  return out;
}
function makeData(rng,parity){
  const n=pick(rng,parity==='odd'?[7,9,11]:parity==='even'?[8,10,12]:[7,8,9,10,11,12]);
  const ordered=makeOrdered(rng,n);
  return {shown:shuffle(rng,ordered),summary:quartiles(ordered)};
}
function makeFive(rng){
  const a=[R(rng,0,20)];
  for(let i=1;i<5;i++)a.push(a[i-1]+R(rng,2,8));
  return {min:a[0],q1:a[1],median:a[2],q3:a[3],max:a[4]};
}
function scaleFor(s){
  const lo=Math.floor(s.min/5)*5,rawHi=Math.ceil(s.max/5)*5,hi=rawHi===lo?lo+5:rawHi;
  const span=hi-lo,tickStep=span<=15?1:span<=30?2:5;
  return {lo,hi,tickStep};
}
function plot(s,blank){
  const scale=scaleFor(s),g={kind:'boxPlot',lo:scale.lo,hi:scale.hi,tickStep:scale.tickStep,blank:!!blank};
  if(!blank)Object.assign(g,s);
  return g;
}
function base(mode,prompt,tex,answer,solution,model){
  return {prompt,tex,answer,answerType:'number',widget:'numpad',negative:false,solution,quartileModel:Object.freeze(Object.assign({mode},model))};
}
function orderedStep(s){return {tex:'\\text{크기순}:\\;'+s.ordered.join(',\\;')};}
function quartileProblem(rng,parity){
  const d=makeData(rng,parity),s=d.summary,mode=parity==='odd'?'quartilesOdd':'quartilesEven';
  const middleNote=parity==='odd'?'\\text{전체 중앙값은 양쪽 절반에서 제외}':'\\text{자료를 같은 수의 두 절반으로 나눔}';
  return base(mode,
    L3('자료를 정렬한 뒤 제1·제2·제3사분위수를 차례로 구합니다.','Order the data, then find Q1, Q2, and Q3.','将数据排序后，依次求Q1、Q2、Q3。'),
    listTex(d.shown)+'\\quad(Q_1,Q_2,Q_3)=\\left('+boxes(3)+'\\right)',
    [s.q1,s.median,s.q3],
    [orderedStep(s),{tex:middleNote},{tex:'Q_1=\\square,\\;Q_2=\\square,\\;Q_3=\\square',blank:[s.q1,s.median,s.q3]}],
    Object.assign({values:d.shown},s)
  );
}
function spreadProblem(rng){
  const d=makeData(rng,'any'),s=d.summary,range=s.max-s.min,iqr=s.q3-s.q1;
  return base('spread',
    L3('자료의 범위와 사분위수 범위를 구합니다.','Find the range and interquartile range.','求极差和四分位距。'),
    listTex(d.shown)+'\\quad(\\text{범위},\\;\\text{사분위수 범위})=\\left('+boxes(2)+'\\right)',
    [range,iqr],
    [orderedStep(s),{tex:'\\text{범위}='+s.max+'-'+s.min+'=\\square',blank:range},{tex:'\\text{사분위수 범위}='+s.q3+'-'+s.q1+'=\\square',blank:iqr},{tex:'(\\text{범위},\\;\\text{사분위수 범위})=\\left('+boxes(2)+'\\right)',blank:[range,iqr]}],
    Object.assign({values:d.shown,range,iqr},s)
  );
}
function fiveNumberProblem(rng){
  const d=makeData(rng,'any'),s=d.summary;
  return base('fiveNumber',
    L3('자료를 정렬하여 상자그림에 필요한 다섯 수를 구합니다.','Order the data and find the five numbers needed for a box plot.','排序后求绘制箱形图所需的五个数。'),
    listTex(d.shown)+'\\quad(\\min,Q_1,Q_2,Q_3,\\max)=\\left('+boxes(5)+'\\right)',
    [s.min,s.q1,s.median,s.q3,s.max],
    [orderedStep(s),{tex:'(\\min,Q_1,Q_2,Q_3,\\max)=\\left('+boxes(5)+'\\right)',blank:[s.min,s.q1,s.median,s.q3,s.max]}],
    Object.assign({values:d.shown},s)
  );
}
function readProblem(rng){
  const s=makeFive(rng),range=s.max-s.min,iqr=s.q3-s.q1;
  const asks=[
    {key:'min',ko:'최솟값',en:'minimum',zh:'最小值',answer:s.min},
    {key:'q1',ko:'제1사분위수',en:'Q1',zh:'第一四分位数',answer:s.q1},
    {key:'median',ko:'중앙값',en:'median',zh:'中位数',answer:s.median},
    {key:'q3',ko:'제3사분위수',en:'Q3',zh:'第三四分位数',answer:s.q3},
    {key:'max',ko:'최댓값',en:'maximum',zh:'最大值',answer:s.max},
    {key:'range',ko:'범위',en:'range',zh:'极差',answer:range},
    {key:'iqr',ko:'사분위수 범위',en:'interquartile range',zh:'四分位距',answer:iqr}
  ],ask=pick(rng,asks);
  const p=base('boxRead',
    L3('상자그림의 선과 상자 끝을 눈금에 맞추어 읽습니다.','Read the whiskers, box edges, and median from the scale.','根据刻度读取须端、箱边和中位数。'),
    '\\text{'+ask.ko+'}=\\square',ask.answer,
    [{tex:'(\\min,Q_1,Q_2,Q_3,\\max)=\\left('+[s.min,s.q1,s.median,s.q3,s.max].join(',\\;')+'\\right)'},{tex:'\\text{'+ask.ko+'}=\\square',blank:ask.answer}],
    Object.assign({ask:ask.key,range,iqr},s)
  );
  p.graph=plot(s,false);return p;
}
function drawProblem(rng){
  const s=makeFive(rng),values=[s.min,s.q1,s.median,s.q3,s.max];
  const p=base('boxDraw',
    L3('주어진 다섯 수를 눈금에 표시해 상자그림을 완성합니다.','Plot the five-number summary and complete the box plot.','把五数概括标在刻度上，完成箱形图。'),
    '(\\min,Q_1,Q_2,Q_3,\\max)=\\left('+values.join(',\\;')+'\\right)',values,
    [{tex:'Q_1\\text{부터 }Q_3\\text{까지 상자를 그림}'},{tex:'Q_2\\text{에 중앙선, 최솟값과 최댓값까지 수염을 그림}'},
     {tex:'\\text{그린 상자그림에서 다시 읽기: }(\\min,Q_1,Q_2,Q_3,\\max)=\\left('+boxes(5)+'\\right)',blank:values.slice()}],
    Object.assign({manualDrawing:true},s)
  );
  p.graph=plot(s,true);p.solutionGraph=plot(s,false);
  p.answerNote=L3('완성된 상자그림은 정답지에서 확인','Check the completed box plot in the answer key','在答案页核对完整箱形图');
  return p;
}

NM_TGEN.md86_quartileBox=function(params,rng){
  const mode=(params&&params.mode)||'quartilesOdd';
  if(mode==='quartilesOdd')return quartileProblem(rng,'odd');
  if(mode==='quartilesEven')return quartileProblem(rng,'even');
  if(mode==='spread')return spreadProblem(rng);
  if(mode==='fiveNumber')return fiveNumberProblem(rng);
  if(mode==='boxRead')return readProblem(rng);
  if(mode==='boxDraw')return drawProblem(rng);
  throw new RangeError('MD86 unknown mode: '+mode);
};
NM_TGEN.md86Quartiles=quartiles;
if(typeof module!=='undefined'&&module.exports)module.exports=NM_TGEN;
})();
