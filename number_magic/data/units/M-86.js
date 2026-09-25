/* Numbers of Magic — M-86 사분위수와 상자그림. 중3-2 p.128~143의 개념만 자체 문장으로 재구성한다. */
(function(){
'use strict';
window.NM_UNITS=window.NM_UNITS||{};
window.NM_UNITS['M-86']={
  id:'M-86',tier:'middle3',level:'38',order:7,generator:'md86_quartileBox',icon:'📦',
  title:{ko:'사분위수와 상자그림',en:'Quartiles & Box Plots',zh:'四分位数与箱形图'},
  subtitle:{ko:'자료를 네 구간으로 나누고 다섯 수로 분포를 그려 읽습니다',en:'Split data into quarters and read its five-number picture',zh:'把数据分成四段，用五数概括绘图并解读'},
  practice:{generator:'md86_quartileBox',level:'practice',count:6,params:{mode:'quartilesOdd'},intro:{ko:'정렬한 뒤 중앙값을 제외하고 양쪽의 중앙값을 구합니다.',en:'Sort, exclude the overall median, and find the medians of both halves.',zh:'排序后排除总中位数，再求左右两半的中位数。'}},
  discover:{
    title:{ko:'누미의 상자그림 노트',en:'Numi Box Plot Note',zh:'努米的箱形图笔记'},
    story:{hook:{ko:'자료를 전부 찍지 않고도 가운데 절반과 양끝을 한눈에 볼 수 있을까요?',en:'Can we see the middle half and both ends without plotting every value?',zh:'不画出每个数据，也能一眼看出中间一半和两端吗？'},history:{ko:'최솟값, Q1, 중앙값, Q3, 최댓값의 다섯 위치를 선과 상자로 이으면 분포의 중심과 퍼짐을 비교할 수 있습니다.',en:'Connecting the minimum, Q1, median, Q3, and maximum makes center and spread easy to compare.',zh:'把最小值、Q1、中位数、Q3、最大值连接成箱形图，就能比较中心与离散程度。'}},
    stages:[
      {tag:{ko:'① 사분위수',en:'1) Quartiles',zh:'① 四分位数'},head:{ko:'정렬 → Q2 → Q1·Q3',en:'sort → Q2 → Q1 and Q3',zh:'排序→Q2→Q1与Q3'},desc:{ko:'전체 중앙값이 Q2입니다. 자료가 홀수 개면 그 값을 제외한 작은 쪽과 큰 쪽의 중앙값이 Q1, Q3입니다.',en:'The overall median is Q2. For an odd count, exclude it before finding the medians of the lower and upper halves.',zh:'总中位数是Q2。数据为奇数个时，先排除它，再求左右两半的中位数作为Q1、Q3。'},mathSteps:['Q_1<Q_2<Q_3','\\mathrm{IQR}=Q_3-Q_1'],result:{ko:'상자는 가운데 약 50%',en:'The box holds the middle about 50%',zh:'箱体表示中间约50%'},book:{ko:'홀수 자료의 전체 중앙값을 작은 쪽이나 큰 쪽에 다시 넣지 않습니다.',en:'Do not reuse the overall median in either half for an odd data set.',zh:'奇数个数据的总中位数不能再放入左右两半。'}},
      {tag:{ko:'② 상자그림',en:'2) Box plot',zh:'② 箱形图'},head:{ko:'상자 Q1~Q3 · 선 Q2 · 수염 양끝',en:'box Q1–Q3 · line Q2 · whiskers to ends',zh:'箱体Q1~Q3·中线Q2·须到两端'},desc:{ko:'Q1과 Q3로 상자를 그리고 Q2에 선을 긋습니다. 상자에서 최솟값과 최댓값까지 수염을 잇습니다.',en:'Draw the box from Q1 to Q3, a median line at Q2, and whiskers to the minimum and maximum.',zh:'从Q1到Q3画箱体，在Q2画中线，再连接到最小值与最大值。'},mathSteps:['\\text{최솟값},\\;Q_1,\\;Q_2,\\;Q_3,\\;\\text{최댓값}'],result:{ko:'위치는 반드시 눈금에 맞춤',en:'Every mark must align to the scale',zh:'每个位置必须对准刻度'},book:{ko:'상자그림에서 평균이나 자료의 개별 개수는 읽을 수 없습니다.',en:'A box plot does not reveal the mean or each exact frequency.',zh:'箱形图不能读出平均数或各个数值的准确频数。'}}
    ],
    rule:{ko:'① 정렬 ② Q2 ③ 홀수면 Q2 제외 ④ Q1·Q3 ⑤ 상자 Q1~Q3 ⑥ 수염은 최솟값·최댓값',en:'1) Sort 2) Find Q2 3) Exclude Q2 if odd 4) Find Q1,Q3 5) Box Q1–Q3 6) Whiskers to min,max',zh:'①排序 ②求Q2 ③奇数时排除Q2 ④求Q1、Q3 ⑤画Q1~Q3箱体 ⑥须连到最小值、最大值'}
  },
  check:{fills:[
    {tex:{ko:'Q_1=4,\\;Q_3=11\\Rightarrow\\text{사분위수 범위}=\\square',en:'Q_1=4,\\;Q_3=11\\Rightarrow\\mathrm{IQR}=\\square',zh:'Q_1=4,\\;Q_3=11\\Rightarrow\\text{四分位距}=\\square'},answer:[7],hint:{ko:'Q3−Q1을 계산합니다.',en:'Compute Q3−Q1.',zh:'计算Q3−Q1。'}},
    {tex:{ko:'\\text{최솟값}=2,\\;\\text{최댓값}=18\\Rightarrow\\text{범위}=\\square',en:'\\text{min}=2,\\;\\text{max}=18\\Rightarrow\\text{range}=\\square',zh:'\\text{最小值}=2,\\;\\text{最大值}=18\\Rightarrow\\text{极差}=\\square'},answer:[16],hint:{ko:'최댓값−최솟값입니다.',en:'Maximum minus minimum.',zh:'最大值减最小值。'}}
  ],open:{ko:'상자그림만 보고는 알 수 없는 정보를 두 가지 말해봅니다.',en:'Name two things a box plot alone cannot tell you.',zh:'说出只看箱形图无法知道的两项信息。'},openHint:{ko:'평균, 자료의 정확한 개수·개별값',en:'mean; exact count or individual values',zh:'平均数；准确个数或各个数值'}},
  lab:{generator:'md86_quartileBox',level:'main',count:6,params:{mode:'boxRead'},intro:{ko:'선과 상자 끝을 눈금에 맞추어 읽습니다.',en:'Read every line and box edge against the scale.',zh:'按刻度读取每条线与箱边。'}},
  arena:{generator:'md86_quartileBox',level:'main',count:6,timeLimit:480,params:{mode:'boxDraw'},rule:{ko:'다섯 수를 표시한 뒤 상자, 중앙선, 수염 순서로 그립니다.',en:'Mark the five numbers, then draw the box, median, and whiskers.',zh:'先标五个数，再依次画箱体、中线和须。'}},
  stamp:{label:{ko:'상자그림 분석가',en:'Box Plot Analyst',zh:'箱形图分析师'},coins:60},
  voice:{correct:[{ko:'다섯 수와 상자 위치가 정확해! 📦',en:'The five numbers and box are accurate!',zh:'五个数和箱体位置都正确！'}],wrong:[{ko:'정렬, 중앙값 제외, 눈금 위치를 다시 확인해봐!',en:'Check sorting, median exclusion, and scale positions.',zh:'再检查排序、中位数排除和刻度位置！'}],finish:{ko:'상자그림 분석 완료! 📦',en:'Box plot analysis complete!',zh:'箱形图分析完成！'}}
};
if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
