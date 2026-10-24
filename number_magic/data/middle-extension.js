/* Optional middle-school extension: 12 additional application/mixed-practice
   bundles after each grade's 20 core bundles. These are not new core sessions
   and are never inserted into NM_COURSES or given canonical source indices. */
(function(w){
'use strict';
const VERSION='20261024-middle-extension1',ANCHOR={1:'C31',2:'C34',3:'C37'};
const L=(ko,en,zh)=>({ko,en,zh});
// Each row selects existing advanced levels in a new combination. The final
// block applies the first two; it is still an existing generator, not a claim
// that the app has authored a new multi-stage word-problem type.
const PLANS={
  1:[
    [L('부호와 괄호의 종합 계산','Signs and nested operations','符号与括号综合运算'),['MD5@3','MD4@5','MD6@3']],
    [L('유리수와 거듭제곱의 연결','Rationals and signed powers','有理数与乘方的联系'),['MD7@4','MD3@3','MD5@4']],
    [L('두 문자로 나타내고 값 구하기','Two-variable expressions and values','双字母式与求值'),['MD47@3','MD48@3','MD49@3']],
    [L('분배법칙과 동류항 연결','Distribution and like terms','分配律与同类项'),['MD49@3','MD12@1','MD13@1']],
    [L('분수·소수 계수 방정식','Equations with fractional coefficients','分数与小数系数方程'),['MD50@4','MD14@3','MD49@3']],
    [L('항등식의 계수 비교 시작','Introducing coefficient comparison','初识恒等式系数比较'),['MD23@1','MD50@3','MD48@3']],
    [L('수·나이 문제를 식으로','Equations for numbers and ages','用方程解决数与年龄问题'),['MD50@4','MD70@1','MD49@3']],
    [L('거리·속력·시간 연결','Distance, speed and time','路程速度时间的联系'),['MD51@3','MD70@2','MD50@3']],
    [L('원가·정가·할인 연결','Cost, price and discounts','成本标价与折扣'),['MD49@3','MD70@3','MD50@4']],
    [L('비례식·좌표·그래프 읽기','Proportion, coordinates and graphs','比例坐标与读图'),['MD51@3','MD69@3','MD68@3']],
    [L('식의 전개와 계수 비교','Expansion and coefficient comparison','展开式与系数比较'),['MD12@1','MD23@1','MD49@3']],
    [L('문자식과 방정식 종합 적용','Mixed expressions and equation applications','代数式与方程综合应用'),['MD50@4','MD70@2','MD70@3']]
  ],
  2:[
    [L('지수법칙과 단항식 혼합','Exponents and mixed monomials','指数法则与单项式综合'),['MD10@4','MD10@5','MD11@3']],
    [L('빈칸 단항식과 식의 변형','Missing monomials and rearranging equations','求未知单项式与等式变形'),['MD11@4','MD13@6','MD14@3']],
    [L('분수 계수와 중첩 괄호','Fractional coefficients and nested brackets','分数系数与多层括号'),['MD12@4','MD12@5','MD13@5']],
    [L('전개에서 항등식으로','From expansion to identities','从展开式到恒等式'),['MD23@1','MD23@2','MD12@5']],
    [L('부등호 방향과 정수해','Inequality signs and integer solutions','不等号方向与整数解'),['MD64@2','MD64@4','MD64@3']],
    [L('평균 조건과 요금 비교','Average conditions and comparing fees','平均条件与费用比较'),['MD71@2','MD71@3','MD64@3']],
    [L('대입법·가감법 교차 적용','Substitution and elimination together','代入与加减法交叉应用'),['MD63@2','MD63@3','MD50@4']],
    [L('연립방정식의 거리·속력','Systems for distance and speed','路程速度的方程组'),['MD63@3','MD72@2','MD50@4']],
    [L('농도와 연립방정식','Mixtures and simultaneous equations','浓度与方程组'),['MD63@2','MD72@3','MD13@5']],
    [L('두 직선과 교점 연결','Two lines and their intersection','两条直线与交点'),['MD65@3','MD75@2','MD74@5']],
    [L('평행 조건과 요금 함수','Parallel conditions and fee functions','平行条件与费用函数'),['MD75@3','MD76@3','MD71@3']],
    [L('계수 비교와 연립 종합','Coefficient comparison and systems','系数比较与方程组综合'),['MD23@3','MD63@3','MD72@3']]
  ],
  3:[
    [L('근호와 곱셈공식 종합','Radicals and multiplication formulas','根式与乘法公式综合'),['MD83@5','MD83@6','MD19@5']],
    [L('켤레와 분모의 유리화','Conjugates and rationalizing denominators','共轭式与分母有理化'),['MD18@3','MD19@6','MD83@4']],
    [L('합·곱으로 식의 값 구하기','Expression values from sums and products','由和与积求式的值'),['MD91@1','MD91@2','MD19@7']],
    [L('인수분해를 수의 계산에','Using factoring in arithmetic','把因式分解用于数的计算'),['MD94@1','MD94@2','MD20@5']],
    [L('다항식 곱셈과 치환 전개','Polynomial products and substitution','多项式乘法与换元展开'),['MD21@1','MD21@3','MD19@8']],
    [L('세제곱 전개와 수의 계산','Cube expansions and arithmetic','立方展开与数的计算'),['MD22@1','MD22@2','MD94@3']],
    [L('대입에서 나머지정리로','From substitution to remainders','从代入到余数定理'),['MD24@1','MD24@2','MD48@2']],
    [L('삼차식의 근과 인수정리','Cubic roots and the factor theorem','三次式的根与因式定理'),['MD93@1','MD93@2','MD24@3']],
    [L('조립제법과 삼차식 인수분해','Synthetic division and cubic factoring','综合除法与三次式分解'),['MD21@2','MD93@3','MD20@6']],
    [L('치환을 이용한 인수분해','Factoring through substitution','利用换元法分解'),['MD25@3','MD20@6','MD19@8']],
    [L('중근 조건과 방정식 만들기','Repeated roots and building equations','重根条件与建立方程'),['MD26@3','MD66@7','MD77@3']],
    [L('세제곱 공식과 인수분해 종합','Cube identities and mixed factoring','立方公式与因式分解综合'),['MD91@3','MD94@3','MD93@3']]
  ]
};
const CONNECTION=new Set(['MD12','MD13','MD14','MD21','MD22','MD23','MD24','MD25','MD26','MD91','MD93','MD94']);
const WORD=new Set(['MD70','MD71','MD72','MD77']);
function validGrade(grade){return [1,2,3].includes(Number(grade))?Number(grade):null;}
function session(grade,index){
  const row=PLANS[grade][index],drills=row[1].map((tag,i)=>{
    const [t,lv]=tag.split('@');return {t,lv:Number(lv),n:i===0?12:6,count:i===0?12:6};
  });
  // Estimated independent-work time, plus eight minutes for the connections.
  // Time is an estimate, not a speed requirement or an extra core source.
  const estimatedMinutes=Math.round(8+drills.reduce((n,d)=>n+d.count*(WORD.has(d.t)?1.5:1),0));
  return {id:`M${grade}E-${String(index+1).padStart(2,'0')}`,title:{...row[0]},minutes:estimatedMinutes,estimatedMinutes,
    kind:'middle-extension',extensionGrade:grade,extensionIndex:index,test:false,magic:[],
    drills,school:drills.slice(0,2).map(d=>({...d})),creative:[],strategy:{practice:[]},
    application:[{...drills[2],kind:'practice',from:'extension'}],stretch:[],
    connection:row[1].some(tag=>CONNECTION.has(tag.split('@')[0])),
    contentNote:L('기존 고급 레벨을 선별한 종합·적용 연습이며, 새 유형 12개를 뜻하지 않습니다.',
      'Selected advanced existing levels for mixed application practice, not twelve newly authored problem types.',
      '精选现有进阶等级的综合应用练习，并非十二种新编题型。')};
}
function length(grade){return validGrade(grade)?12:0;}
function reference(grade,index){
  const g=validGrade(grade),i=Number(index);
  if(!g||!Number.isInteger(i)||i<0||i>=12)return null;
  const s=session(g,i);
  return {kind:'middle-extension',grade:g,extensionIndex:i,extensionId:s.id,lessonIndex:i,
    courseKey:ANCHOR[g],scheduleUnits:1,sourceIndices:[],estimatedMinutes:s.estimatedMinutes};
}
function course(grade){
  const g=validGrade(grade);if(!g)return null;
  return {id:`M${g}E`,order:Number(ANCHOR[g].slice(1)),tier:'middle'+g,extensionGrade:g,
    extensionVersion:VERSION,title:L(`중${g} 선택 심화 · 종합·적용`,
      `Grade ${g+6} optional extension · Mixed applications`,`初${g}选学进阶·综合应用`),
    sessions:PLANS[g].map((_,i)=>session(g,i))};
}
const api={version:VERSION,length,reference,course};
w.NM_MIDDLE_EXTENSION=api;
if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
