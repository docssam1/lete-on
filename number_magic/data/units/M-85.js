/* Numbers of Magic — M-85 산포도. 중3-2 p.112~125의 개념만 자체 문장으로 재구성한다. */
(function(){
'use strict';
window.NM_UNITS=window.NM_UNITS||{};
window.NM_UNITS['M-85']={
  id:'M-85',tier:'middle3',level:'37',order:6,generator:'md85_dispersion',icon:'📊',
  title:{ko:'산포도: 편차·분산·표준편차',en:'Dispersion',zh:'离散程度'},
  subtitle:{ko:'평균에서 떨어진 정도를 계산하고 두 자료의 고른 정도를 비교합니다',en:'Measure distance from the mean and compare consistency',zh:'计算数据离平均数的程度，并比较两组数据的均匀程度'},
  practice:{generator:'md85_dispersion',level:'practice',count:6,params:{mode:'deviation'},intro:{ko:'편차는 변량에서 평균을 뺍니다.',en:'A deviation is a value minus the mean.',zh:'偏差等于变量减去平均数。'}},
  discover:{
    title:{ko:'누미의 산포도 노트',en:'Numi Dispersion Note',zh:'努米的离散程度笔记'},
    story:{hook:{ko:'평균이 같은 두 반도 점수의 고른 정도는 다를 수 있습니다.',en:'Two classes with the same mean can still differ in consistency.',zh:'平均数相同的两个班，成绩的均匀程度也可能不同。'},history:{ko:'평균은 자료의 중심을 말하고, 분산과 표준편차는 그 중심에서 얼마나 흩어졌는지를 말합니다.',en:'The mean locates the center; variance and standard deviation describe spread around it.',zh:'平均数表示中心，方差和标准差表示数据在中心周围的分散程度。'}},
    stages:[
      {tag:{ko:'① 편차',en:'1) Deviation',zh:'① 偏差'},head:{ko:'변량 − 평균',en:'value − mean',zh:'变量−平均数'},desc:{ko:'평균보다 작으면 음수, 크면 양수이며 편차의 합은 0입니다.',en:'It is negative below the mean, positive above it, and all deviations sum to zero.',zh:'小于平均数为负，大于平均数为正，所有偏差之和为0。'},mathSteps:['d=x-\\overline{x}','\\sum d=0'],result:{ko:'방향과 거리의 출발점',en:'Direction and distance from the center',zh:'离中心的方向与距离'},book:{ko:'편차는 평균에서 변량을 빼는 것이 아니라 변량에서 평균을 뺍니다.',en:'Subtract the mean from the value, not the value from the mean.',zh:'是变量减平均数，不是平均数减变量。'}},
      {tag:{ko:'② 분산과 표준편차',en:'2) Variance and SD',zh:'② 方差与标准差'},head:{ko:'제곱해서 평균, 다시 제곱근',en:'square, average, then root',zh:'平方、平均、再开方'},desc:{ko:'편차의 부호가 지워지도록 제곱해 평균을 내면 분산, 그 양의 제곱근이 표준편차입니다.',en:'Square deviations to remove signs and average them for variance; take the positive square root for standard deviation.',zh:'把偏差平方去掉符号并求平均得到方差；方差的正平方根就是标准差。'},mathSteps:['V=\\dfrac{\\sum d^2}{n}','\\sigma=\\sqrt V'],result:{ko:'작을수록 평균 가까이에 모임',en:'Smaller means tighter clustering',zh:'越小越集中在平均数附近'},book:{ko:'분산은 제곱 단위, 표준편차는 원래 자료와 같은 단위입니다.',en:'Variance uses squared units; standard deviation uses the original unit.',zh:'方差是平方单位，标准差与原数据单位相同。'}}
    ],
    rule:{ko:'① 편차=변량−평균 ② 편차의 합=0 ③ 분산=편차 제곱의 평균 ④ 표준편차=√분산 ⑤ 산포도가 작을수록 더 고르다',en:'1) deviation=value−mean 2) deviations sum to zero 3) variance=mean squared deviation 4) SD=√variance 5) smaller spread means more consistent',zh:'①偏差=变量−平均数 ②偏差和=0 ③方差=偏差平方的平均数 ④标准差=√方差 ⑤离散程度越小越均匀'}
  },
  check:{fills:[
    {tex:{ko:'\\overline{x}=7,\\;x=10\\Rightarrow\\text{편차}=\\square',en:'\\overline{x}=7,\\;x=10\\Rightarrow\\text{deviation}=\\square',zh:'\\overline{x}=7,\\;x=10\\Rightarrow\\text{偏差}=\\square'},answer:[3],hint:{ko:'10−7을 계산합니다.',en:'Compute 10−7.',zh:'计算10−7。'}},
    {tex:{ko:'\\text{편차 }(-3,1,2,x)\\Rightarrow x=\\square',en:'\\text{deviations }(-3,1,2,x)\\Rightarrow x=\\square',zh:'\\text{偏差 }(-3,1,2,x)\\Rightarrow x=\\square'},answer:[0],hint:{ko:'편차의 합은 0입니다.',en:'Deviations sum to zero.',zh:'偏差之和为0。'}}
  ],open:{ko:'평균이 같아도 표준편차가 다를 수 있는 까닭을 말해봅니다.',en:'Explain why equal means can come with different standard deviations.',zh:'说明平均数相同而标准差可能不同的原因。'},openHint:{ko:'평균은 중심, 표준편차는 흩어진 정도',en:'mean=center; standard deviation=spread',zh:'平均数表示中心，标准差表示分散程度'}},
  lab:{generator:'md85_dispersion',level:'main',count:6,params:{mode:'varianceStd'},intro:{ko:'평균부터 표준편차까지 순서대로 계산합니다.',en:'Calculate from the mean through the standard deviation in order.',zh:'按顺序从平均数算到标准差。'}},
  arena:{generator:'md85_dispersion',level:'main',count:8,timeLimit:420,params:{mode:'compare'},rule:{ko:'평균과 산포도를 따로 비교합니다.',en:'Compare centers and spread separately.',zh:'分别比较平均数与离散程度。'}},
  stamp:{label:{ko:'산포도 분석가',en:'Dispersion Analyst',zh:'离散程度分析师'},coins:55},
  voice:{correct:[{ko:'자료의 중심과 흩어짐을 정확히 읽었어! 📊',en:'You read both center and spread!',zh:'你准确读出了中心和分散程度！'}],wrong:[{ko:'편차의 합과 제곱의 평균을 다시 확인해봐!',en:'Check the deviation sum and mean of the squares.',zh:'再检查偏差和与平方的平均数！'}],finish:{ko:'산포도 분석 완료! 📊',en:'Dispersion analysis complete!',zh:'离散程度分析完成！'}}
};
if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
