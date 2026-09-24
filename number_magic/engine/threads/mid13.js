/* MD84 대표값. 근거: 디딤돌 개념연산 1-2 p.224~230. p.231 이후는 제외. */
(function(){
'use strict';
const R=NM_RNG.R,pick=NM_RNG.pick;
function shuffle(rng,a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=R(rng,0,i),v=a[i];a[i]=a[j];a[j]=v;}return a;}
function unique(rng,n,lo,hi,avoid){const used=new Set(avoid||[]),a=[];while(a.length<n){const v=R(rng,lo,hi);if(!used.has(v)){used.add(v);a.push(v);}}return a;}
function median(a){const s=a.slice().sort(function(x,y){return x-y;}),n=s.length;return n%2?s[(n-1)/2]:(s[n/2-1]+s[n/2])/2;}
function list(a){return '\\left\\{'+a.join(',\\;')+'\\right\\}';}
function boxes(n){return Array.from({length:n},function(){return '\\square';}).join(',\\;');}
function base(mode,values,answer,tex,solution){
  return {prompt:{
    ko:mode==='summary'?'자료를 작은 값부터 정리한 뒤 평균, 중앙값, 최빈값을 차례로 구합니다.':mode.indexOf('median')===0?'자료를 작은 값부터 크기순으로 나열한 뒤 한가운데를 찾습니다.':'각 값이 나온 횟수를 세어 가장 많이 나타난 값을 찾습니다.',
    en:mode==='summary'?'Order the data, then find the mean, median, and mode.':mode.indexOf('median')===0?'Order the data and find the middle.':'Count each value and find the most frequent value or values.',
    zh:mode==='summary'?'先排序，再依次求平均数、中位数和众数。':mode.indexOf('median')===0?'先排序，再找出正中间。':'统计次数，找出出现最多的值。'
  },tex:tex,answer:answer,answerType:'number',widget:'numpad',negative:false,stats:{mode:mode,values:values.slice()},solution:solution};
}
NM_TGEN.md84_center=function(params,rng){
  const mode=params.mode||'medianOdd';
  if(mode==='medianOdd'){
    const n=pick(rng,[5,7,9]),v=shuffle(rng,unique(rng,n,1,60)),s=v.slice().sort(function(a,b){return a-b;}),ans=median(v);
    const p=base(mode,v,ans,list(v)+'\\quad\\text{중앙값}=\\square',[{tex:'\\text{크기순}:\\;'+s.join(',\\;')},{tex:'\\text{한가운데 값}=\\square',blank:ans}]);p.stats.ordered=s;return p;
  }
  if(mode==='medianEven'){
    const n=pick(rng,[4,6,8]),v=shuffle(rng,unique(rng,n,1,70)),s=v.slice().sort(function(a,b){return a-b;}),a=s[n/2-1],b=s[n/2],ans=(a+b)/2;
    const p=base(mode,v,ans,list(v)+'\\quad\\text{중앙값}=\\square',[{tex:'\\text{가운데 두 값}:\\;'+a+',\\;'+b},{tex:'\\dfrac{'+a+'+'+b+'}{2}=\\square',blank:ans}]);p.stats.ordered=s;return p;
  }
  if(mode==='modeSingle'){
    const target=R(rng,2,30),v=shuffle(rng,[target,target,target].concat(unique(rng,4,1,40,[target])));
    return base(mode,v,target,list(v)+'\\quad\\text{최빈값}=\\square',[{tex:target+'\\text{은(는) }3\\text{번 나타남}'},{tex:'\\text{가장 많이 나타난 값}=\\square',blank:target}]);
  }
  if(mode==='modeMultiple'){
    const pair=unique(rng,2,2,30).sort(function(a,b){return a-b;}),v=shuffle(rng,[pair[0],pair[0],pair[0],pair[1],pair[1],pair[1]].concat(unique(rng,2,1,40,pair)));
    const p=base(mode,v,pair,list(v)+'\\quad\\text{최빈값}=\\left('+boxes(2)+'\\right)',[{tex:pair[0]+',\\;'+pair[1]+'\\text{이(가) 각각 }3\\text{번 나타남}'},{tex:'\\text{최빈값}=\\left('+boxes(2)+'\\right)',blank:pair}]);p.stats.modes=pair.slice();return p;
  }
  if(mode==='modeCategory'){
    const banks=[['독서','게임','운동','그림','음악'],['사과','배','귤','포도','복숭아'],['빨강','노랑','초록','파랑','보라'],['축구','야구','농구','수영','배드민턴']];
    const labels=shuffle(rng,pick(rng,banks)),winner=R(rng,0,4),counts=unique(rng,5,2,12),letters=['A','B','C','D','E'];counts[winner]=R(rng,15,22);
    const legend=labels.map(function(v,i){return letters[i]+'='+v;}).join(', ');
    const tex='\\begin{array}{c|ccccc}\\text{항목}&A&B&C&D&E\\\\\\text{횟수}&'+counts.join('&')+'\\end{array}\\quad\\text{최빈 항목 번호}=\\square';
    const p=base(mode,counts,winner+1,tex,[{tex:'\\text{가장 큰 횟수}='+counts[winner]},{tex:letters[winner]+'='+(winner+1)+'\\quad\\Rightarrow\\quad\\square',blank:winner+1}]);
    p.prompt.ko=legend+'. 표에서 가장 많이 나타난 항목의 번호를 입력하세요(A=1, …, E=5).';p.prompt.en=legend+'. Enter the most frequent category number (A=1, ..., E=5).';p.prompt.zh=legend+'。请输入出现最多项目的编号(A=1，…，E=5)。';p.stats={mode:mode,labels:labels,counts:counts,winner:winner};return p;
  }
  if(mode!=='summary')throw new RangeError('MD84 unknown mode: '+mode);
  let v,ans,s;
  for(let tries=0;tries<256;tries++){
    const modal=R(rng,4,26),candidate=shuffle(rng,[modal,modal,modal].concat(unique(rng,4,1,35,[modal]))),sum=candidate.reduce(function(a,b){return a+b;},0);
    if(sum%7)continue;s=candidate.slice().sort(function(a,b){return a-b;});const mean=sum/7,med=median(candidate);if(mean===med&&med===modal)continue;v=candidate;ans=[mean,med,modal];break;
  }
  if(!v){v=[2,5,8,8,8,12,13];s=v.slice();ans=[8,8,8];}
  const sum=v.reduce(function(a,b){return a+b;},0);
  const p=base(mode,v,ans,list(v)+'\\quad(\\text{평균},\\;\\text{중앙값},\\;\\text{최빈값})=\\left('+boxes(3)+'\\right)',[{tex:'\\text{평균}=\\dfrac{'+sum+'}{7}=\\square',blank:ans[0]},{tex:'\\text{크기순 한가운데}=\\square',blank:ans[1]},{tex:'\\text{가장 많이 나타난 값}=\\square',blank:ans[2]}]);p.stats.ordered=s;p.stats.sum=sum;p.stats.modes=[ans[2]];return p;
};
if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_TGEN;
})();
