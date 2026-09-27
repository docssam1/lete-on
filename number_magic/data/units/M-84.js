/* Numbers of Magic — M-84 대표값. 원본 문항은 싣지 않고 중1-2 p.224~230의 정의만 참고한다. */
(function(){
'use strict';
window.NM_UNITS=window.NM_UNITS||{};
window.NM_UNITS['M-84']={
  id:'M-84',tier:'middle1',level:'31',order:7,generator:'md84_center',icon:'📊',
  title:{ko:'대표값: 평균·중앙값·최빈값',en:'Mean, Median & Mode',zh:'平均数·中位数·众数'},
  subtitle:{ko:'정렬해서 가운데를 찾고, 횟수를 세어 가장 많이 나타난 값을 찾습니다',en:'Sort to find the middle; count frequencies to find the mode',zh:'排序找中间值，统计次数找众数'},
  practice:{generator:'md84_center',level:'practice',count:6,params:{mode:'medianOdd'},intro:{ko:'먼저 자료를 작은 값부터 크기순으로 놓습니다.',en:'First order the data from least to greatest.',zh:'先把数据按从小到大排列。'}},
  discover:{
    title:{ko:'누미의 대표값 노트',en:'Numi Center Note',zh:'努米的代表值笔记'},
    story:{hook:{ko:'자료 전체를 한눈에 설명하려면 어떤 수를 골라야 할까요?',en:'Which number can describe a whole data set at a glance?',zh:'用哪个数能概括整组数据呢？'},history:{ko:'평균은 모든 값을 사용하고, 중앙값은 정렬했을 때 가운데를 보며, 최빈값은 가장 자주 나온 값을 봅니다.',en:'The mean uses every value, the median uses the ordered middle, and the mode uses the most frequent value.',zh:'平均数使用全部数值，中位数看排序后的中间，众数看出现次数最多的值。'}},
    stages:[
      {tag:{ko:'① 중앙값',en:'1) Median',zh:'① 中位数'},head:{ko:'2,5,7,9,12 → 7',en:'2,5,7,9,12 → 7',zh:'2,5,7,9,12 → 7'},desc:{ko:'홀수 개면 한가운데 하나, 짝수 개면 가운데 둘의 평균입니다.',en:'Use the single middle for odd counts and average the two middles for even counts.',zh:'奇数个取正中一个，偶数个取中间两个的平均数。'},mathSteps:['2<5<7<9<12',{ko:'\\text{가운데}=7',en:'\\text{middle}=7',zh:'\\text{中间}=7'}],result:{ko:'정렬이 먼저!',en:'Sort first!',zh:'先排序！'},book:{ko:'자료의 순서를 그대로 보고 가운데를 고르면 안 됩니다.',en:'Do not pick the middle before sorting.',zh:'不能按原来的顺序直接取中间。'}},
      {tag:{ko:'② 최빈값',en:'2) Mode',zh:'② 众数'},head:{ko:'3,3,5,7,7 → 3과 7',en:'3,3,5,7,7 → 3 and 7',zh:'3,3,5,7,7 → 3和7'},desc:{ko:'가장 많이 나타난 횟수가 같으면 최빈값이 둘 이상일 수 있습니다.',en:'A tie for the highest frequency gives more than one mode.',zh:'最高出现次数相同时，众数可以有多个。'},mathSteps:[{ko:'3\\text{: }2\\text{번}',en:'3\\text{: }2\\text{ times}',zh:'3\\text{: }2\\text{次}'},{ko:'7\\text{: }2\\text{번}',en:'7\\text{: }2\\text{ times}',zh:'7\\text{: }2\\text{次}'}],result:{ko:'최빈값은 하나라고 정해져 있지 않습니다.',en:'There need not be only one mode.',zh:'众数不一定只有一个。'},book:{ko:'범주 자료에도 최빈값을 사용할 수 있습니다.',en:'Mode also works for categorical data.',zh:'类别资料也可以求众数。'}}
    ],
    rule:{ko:'① 중앙값은 정렬 ② 짝수 개면 가운데 둘의 평균 ③ 최빈값은 최고 횟수에 묶인 값을 모두 쓴다',en:'1) Sort for the median 2) Average two middles for even counts 3) Include every value tied for highest frequency',zh:'① 中位数先排序 ② 偶数个取中间两个的平均 ③ 并列最高频的值全部写出'}
  },
  check:{fills:[{tex:{ko:'1,4,6,8,9\\text{의 중앙값}=\\square',en:'\\text{median of }1,4,6,8,9=\\square',zh:'1,4,6,8,9\\text{的中位数}=\\square'},answer:[6],hint:{ko:'크기순 한가운데를 봅니다.',en:'Look at the ordered middle.',zh:'看排序后的正中间。'}},{tex:{ko:'2,2,5,7,7\\text{의 최빈값}=\\square,\\square',en:'\\text{modes of }2,2,5,7,7=\\square,\\square',zh:'2,2,5,7,7\\text{的众数}=\\square,\\square'},answer:[2,7],hint:{ko:'가장 많이 나타난 두 값을 모두 씁니다.',en:'Write both tied values.',zh:'把并列最多的两个数都写出。'}}],open:{ko:'평균, 중앙값, 최빈값의 차이를 한 문장씩 말해봅니다.',en:'Explain the difference among mean, median, and mode.',zh:'分别说明平均数、中位数和众数。'},openHint:{ko:'합÷개수 / 정렬 뒤 가운데 / 가장 많이 나타난 값',en:'sum divided by count / ordered middle / most frequent',zh:'总和除以个数 / 排序后的中间 / 出现最多'}},
  lab:{generator:'md84_center',level:'main',count:6,params:{mode:'modeSingle'},intro:{ko:'횟수를 표시하며 최빈값을 찾아봅니다.',en:'Mark frequencies to find the mode.',zh:'标记次数，找出众数。'}},
  arena:{generator:'md84_center',level:'main',count:8,timeLimit:300,params:{mode:'summary'},rule:{ko:'평균·중앙값·최빈값을 정의대로 차례로 구합니다.',en:'Find mean, median, and mode in order.',zh:'按定义依次求平均数、中位数和众数。'}},
  stamp:{label:{ko:'대표값 분석가',en:'Center Analyst',zh:'代表值分析师'},coins:50},
  voice:{correct:[{ko:'정확해! 📊',en:'Correct!',zh:'正确！'}],wrong:[{ko:'정렬과 횟수 세기를 다시 확인해봐!',en:'Check the ordering and frequency count.',zh:'再检查排序和次数！'}],finish:{ko:'대표값 분석 완료! 📊',en:'Center analysis complete!',zh:'代表值分析完成！'}}
};
if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
