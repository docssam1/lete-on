/* Numbers of Magic — M-87 산점도와 상관관계. 중3-2 p.144~153의 개념만 자체 문장으로 재구성한다. */
(function(){
'use strict';
window.NM_UNITS=window.NM_UNITS||{};
window.NM_UNITS['M-87']={
  id:'M-87',tier:'middle3',level:'39',order:8,generator:'md87_scatter',icon:'⠿',
  title:{ko:'산점도와 상관관계',en:'Scatter Plots & Correlation',zh:'散点图与相关关系'},
  subtitle:{ko:'두 변량의 순서쌍을 점으로 나타내고 전체 점구름의 방향을 읽습니다',en:'Plot ordered pairs and read the direction of the whole point cloud',zh:'把两个变量的有序数对描成点，并判断整体点云的方向'},
  practice:{generator:'md87_scatter',level:'practice',count:12,params:{mode:'plot'},intro:{ko:'표의 (x,y)를 한 점씩 빈 모눈에 찍습니다. 점끼리 선으로 잇지 않습니다.',en:'Plot each (x,y) from the table on the blank grid. Do not connect the points.',zh:'把表中的(x,y)逐点描在空白方格中，不要连线。'}},
  discover:{
    title:{ko:'누미의 산점도 노트',en:'Numi Scatter Plot Note',zh:'努米的散点图笔记'},
    story:{hook:{ko:'한 학생의 두 기록은 (x,y) 한 점이 됩니다. 여러 학생의 점을 한꺼번에 보면 두 변량이 함께 움직이는 경향이 보입니다.',en:'Two measurements for one student form one point (x,y). Looking at all points reveals how the variables tend to move together.',zh:'同一名学生的两个记录组成一个点(x,y)，把所有点放在一起就能看出两个变量共同变化的趋势。'},history:{ko:'산점도는 각 점을 따로 잇는 그래프가 아닙니다. 점들의 전체 방향과 모인 정도를 읽는 그림입니다.',en:'A scatter plot does not connect individual points. It shows the overall direction and tightness of a point cloud.',zh:'散点图不把各点相连，而是观察点云整体的方向与紧密程度。'}},
    stages:[
      {tag:{ko:'① 표 → 순서쌍 → 점',en:'1) table → pair → point',zh:'① 表→有序数对→点'},head:{ko:'한 행이 한 점',en:'one row, one point',zh:'一行对应一个点'},desc:{ko:'첫째 변량을 x, 둘째 변량을 y로 두고 표의 같은 열에 있는 두 값을 (x,y)로 묶어 찍습니다.',en:'Use the first variable as x and the second as y; pair values from the same column as (x,y).',zh:'把第一个变量作为x、第二个变量作为y，同一列的两个数配成(x,y)描点。'},mathSteps:['(x,y)',{ko:'\\text{x축 먼저, y축 다음}',en:'\\text{x-axis first, then y-axis}',zh:'\\text{先找x轴，再找y轴}'}],result:{ko:'표의 자료 수=점의 수',en:'number of records = number of points',zh:'资料个数=点的个数'},book:{ko:'산점도의 점은 선으로 잇지 않습니다.',en:'Do not connect scatter-plot points.',zh:'散点图中的点不连线。'}},
      {tag:{ko:'② 방향과 강도',en:'2) direction and strength',zh:'② 方向与强弱'},head:{ko:'오른쪽 위 / 오른쪽 아래 / 방향 없음',en:'up-right / down-right / no direction',zh:'右上/右下/无明显方向'},desc:{ko:'x가 커질수록 y도 대체로 커지면 양, y가 작아지면 음, 일정한 방향이 보이지 않으면 상관관계가 없습니다.',en:'If y tends to rise as x rises, correlation is positive; if it falls, negative; without a clear direction, there is no correlation.',zh:'x增大时y大致增大为正相关，大致减小为负相关，没有明显方向则无相关。'},mathSteps:[{ko:'\\nearrow:\\text{ 양}',en:'\\nearrow:\\text{ positive}',zh:'\\nearrow:\\text{ 正相关}'},{ko:'\\searrow:\\text{ 음}',en:'\\searrow:\\text{ negative}',zh:'\\searrow:\\text{ 负相关}'}],result:{ko:'더 가늘게 모일수록 더 강함',en:'a tighter cloud means stronger correlation',zh:'点云越狭长，相关越强'},book:{ko:'상관관계는 인과관계를 뜻하지 않으며, 한 점보다 전체 경향을 봅니다.',en:'Correlation is not causation; read the overall trend rather than one point.',zh:'相关不等于因果，要看整体趋势而不是单个点。'}}
    ],
    rule:{ko:'① 같은 열의 값을 (x,y)로 묶는다 ② x축, y축 순서로 점을 찍는다 ③ 점은 잇지 않는다 ④ 오른쪽 위는 양, 오른쪽 아래는 음 ⑤ 방향이 없으면 무상관 ⑥ 더 가늘게 모일수록 강하다',en:'1) pair values in the same column 2) plot x then y 3) do not connect points 4) up-right is positive, down-right negative 5) no direction means no correlation 6) tighter means stronger',zh:'①同列配成(x,y) ②先x后y描点 ③点不连线 ④右上为正、右下为负 ⑤无方向为无相关 ⑥越紧密越强'}
  },
  check:{fills:[
    {tex:{ko:'(3,7)\\text{에서 먼저 찾는 축은 }\\square\\;(1=x,2=y)',en:'For (3,7), find which axis first? \\square\\;(1=x,2=y)',zh:'描(3,7)时先找哪个轴？\\square\\;(1=x,2=y)'},answer:[1],hint:{ko:'순서쌍은 x부터 읽습니다.',en:'Read x first in an ordered pair.',zh:'有序数对先读x。'}},
    {tex:{ko:'x\\uparrow,\\;y\\downarrow\\Rightarrow\\square\\;(1=양,2=음)',en:'x\\uparrow,\\;y\\downarrow\\Rightarrow\\square\\;(1=positive,2=negative)',zh:'x\\uparrow,\\;y\\downarrow\\Rightarrow\\square\\;(1=正,2=负)'},answer:[2],hint:{ko:'오른쪽 아래로 향하면 음의 상관관계입니다.',en:'A down-right trend is negative.',zh:'右下趋势是负相关。'}}
  ],open:{ko:'산점도의 점을 선으로 잇지 않는 까닭을 말해봅니다.',en:'Explain why scatter-plot points are not connected.',zh:'说明为什么散点图中的点不连线。'},openHint:{ko:'각 점은 서로 다른 대상의 한 쌍 자료입니다.',en:'Each point is a paired record for a different subject.',zh:'每个点是不同对象的一对资料。'}},
  lab:{generator:'md87_scatter',level:'main',count:24,params:{mode:'read'},intro:{ko:'조건을 만족하는 점을 경계까지 포함해 정확히 셉니다.',en:'Count points satisfying the condition, including boundaries.',zh:'准确数出满足条件的点，并包含边界。'}},
  arena:{generator:'md87_scatter',level:'main',count:24,timeLimit:720,params:{mode:'strength'},rule:{ko:'전체 방향과 점구름의 모인 정도를 따로 확인합니다.',en:'Check overall direction and tightness separately.',zh:'分别判断整体方向和点云的紧密程度。'}},
  stamp:{label:{ko:'산점도 분석가',en:'Scatter Plot Analyst',zh:'散点图分析师'},coins:55},
  voice:{correct:[{ko:'점 하나가 아니라 전체 경향을 정확히 읽었어! ⠿',en:'You read the overall trend, not just one point!',zh:'你读出了整体趋势，而不是只看一个点！'}],wrong:[{ko:'x가 커질 때 점구름이 어느 방향으로 향하는지 다시 봐!',en:'Look again at the direction of the cloud as x increases.',zh:'再看x增大时点云朝哪个方向！'}],finish:{ko:'산점도 분석 완료! ⠿',en:'Scatter plot analysis complete!',zh:'散点图分析完成！'}}
};
if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
