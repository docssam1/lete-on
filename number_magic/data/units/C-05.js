/* Numbers of Magic — 유닛 C-05: 가우스 덧셈 마법 (중급 B 챕터1) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['C-05'] = {
  id:'C-05', tier:'intermediate', level:'C', order:5,
  generator:'ml_gauss',
  title:{ ko:'가우스 덧셈 마법', en:'Gauss Addition Magic', zh:'高斯加法魔法' },
  subtitle:{ ko:'1+2+…+100=5050: 쌍을 지어 더해요!', en:'1+2+…+100=5050: pair them up to add!', zh:'1+2+…+100=5050：配对相加！' },
  icon:'🔢',

  practice:{
    generator:'ml_gauss', level:'practice', count:5,
    params:{},
    intro:{
      ko:'1부터 n까지의 합을 가우스 방법으로 구할 거야. 처음과 끝을 짝 짓는 방법이야. 준비됐지?',
      en:"We'll find the sum from 1 to n using Gauss's method — pairing first and last. Ready?",
      zh:'我们用高斯方法求1到n的和——把第一个和最后一个配对。准备好了吗？'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ko:'① 가우스의 발견',en:'1) Gauss\'s discovery',zh:'① 高斯的发现'},
        head:{ko:'1+2+…+100=5050: 선생님을 놀라게 한 어린 천재!',en:'1+2+…+100=5050: the child genius who amazed his teacher!',zh:'1+2+…+100=5050：让老师惊叹的天才少年！'},
        desc:{ko:'어린 가우스는 1부터 100까지 더하는 숙제를 받았어요. 선생님은 오래 걸릴 줄 알았는데, 가우스는 순식간에 <b>5050</b>이라고 대답했어요! 비결은? <b>처음과 끝을 짝 짓기</b>: (1+100)+(2+99)+…=(101)×50=5050.',
              en:'Young Gauss was given the homework of adding 1 to 100. The teacher expected it to take ages, but Gauss answered <b>5050</b> instantly! His secret? <b>Pair first and last</b>: (1+100)+(2+99)+…=(101)×50=5050.',
              zh:'年幼的高斯被布置了1加到100的作业。老师以为要很久，但高斯瞬间答出<b>5050</b>！他的秘诀？<b>首尾配对</b>：(1+100)+(2+99)+…=(101)×50=5050。'},
        mathSteps:['1+100=101','2+99=101','... 50쌍 ...','101 × 50 = 5050'],
        result:{ko:'1+2+…+100=5050! 처음+끝=101이 50쌍이에요.',en:'1+2+…+100=5050! First+last=101, and there are 50 pairs.',zh:'1+2+…+100=5050！首+尾=101，共50对。'},
        book:{ko:'1부터 n까지의 합 공식: n×(n+1)÷2. 예: 1부터 10까지 = 10×11÷2 = 55. 이 공식은 등차수열의 합 공식이에요.',
              en:'Sum from 1 to n: n×(n+1)÷2. E.g. 1 to 10 = 10×11÷2 = 55. This is the formula for the sum of an arithmetic sequence.',
              zh:'1到n的和公式：n×(n+1)÷2。例：1到10 = 10×11÷2 = 55。这是等差数列求和公式。'} },

      { tag:{ko:'② 가우스 방법 직접 해보기',en:'2) Trying the Gauss method',zh:'② 亲试高斯方法'},
        head:{ko:'1부터 10까지: (1+10)×5=55',en:'1 to 10: (1+10)×5=55',zh:'1到10：(1+10)×5=55'},
        desc:{ko:'1+2+3+4+5+6+7+8+9+10을 가우스 방법으로! <b>처음과 끝 짝짓기</b>: (1+10)=11, (2+9)=11, (3+8)=11, (4+7)=11, (5+6)=11. 11이 5쌍 → <b>11×5=55</b>. 맞아요!',
              en:'1+2+…+10 by Gauss\'s method! <b>Pair first and last</b>: (1+10)=11, (2+9)=11, (3+8)=11, (4+7)=11, (5+6)=11. 11 appears 5 times → <b>11×5=55</b>.',
              zh:'1+2+…+10用高斯方法！<b>首尾配对</b>：(1+10)=11，(2+9)=11，(3+8)=11，(4+7)=11，(5+6)=11。11出现5次→<b>11×5=55</b>。'},
        mathSteps:['쌍의 합 = 1+10 = 11','쌍의 수 = 10÷2 = 5','합계 = 11 × 5 = 55'],
        result:{ko:'1+2+…+10=55! 공식: (처음+끝) × 쌍의 수.',en:'1+2+…+10=55! Formula: (first+last) × number of pairs.',zh:'1+2+…+10=55！公式：(首+尾)×对数。'},
        book:{ko:'가우스 공식 도출: (1+n) + (2+(n-1)) + … 각 쌍의 합은 (n+1). 쌍의 수는 n÷2. 따라서 합 = (n+1)×(n÷2) = n(n+1)÷2.',
              en:'Deriving Gauss: each pair sums to (n+1); there are n÷2 pairs; total = (n+1)×(n÷2) = n(n+1)÷2.',
              zh:'高斯公式推导：每对之和为(n+1)，共n÷2对，总和=(n+1)×(n÷2)=n(n+1)÷2。'} },

      { tag:{ko:'③ 공식 적용하기',en:'3) Applying the formula',zh:'③ 应用公式'},
        head:{ko:'n(n+1)÷2 공식을 외워요!',en:'Memorise n(n+1)÷2!',zh:'记住n(n+1)÷2！'},
        desc:{ko:'1부터 n까지의 합 = <b>n×(n+1)÷2</b>. 빠른 계산: 1~20 = 20×21÷2 = 420÷2 = 210. 1~50 = 50×51÷2 = 2550÷2 = 1275. 이 공식으로 어떤 크기의 합도 순식간에!',
              en:'Sum 1 to n = <b>n×(n+1)÷2</b>. Quick examples: 1~20=20×21÷2=210. 1~50=50×51÷2=1275. This formula handles any size instantly!',
              zh:'1到n的和=<b>n×(n+1)÷2</b>。快速示例：1到20=20×21÷2=210。1到50=50×51÷2=1275。这个公式可以瞬间计算任意大小的和！'},
        mathSteps:['1+2+…+20','= 20×(20+1)÷2','= 20×21÷2','= 420÷2 = 210'],
        result:{ko:'1+2+…+20=210! 공식 n(n+1)÷2를 써봐요.',en:'1+2+…+20=210! Use the formula n(n+1)÷2.',zh:'1+2+…+20=210！使用公式n(n+1)÷2。'},
        book:null }
    ],
    rule:{ ko:'① 처음과 끝을 짝지으면 모두 같은 합  ② 쌍의 합 × 쌍의 수 = 전체 합  ③ 공식: n(n+1)÷2',
      en:'① Pairing first and last gives equal sums  ② Pair sum × number of pairs = total  ③ Formula: n(n+1)÷2',
      zh:'① 首尾配对，每对和相等  ② 对之和×对数=总和  ③ 公式：n(n+1)÷2' }
  },

  check:{
    fills:[
      { tex:'1+2+3+\\cdots+10 = \\square', answer:55,
        hint:{ ko:'(1+10)×5=11×5=?', en:'(1+10)×5=11×5=?', zh:'(1+10)×5=11×5=？' } },
      { tex:'1+2+3+\\cdots+12 = \\square', answer:78,
        hint:{ ko:'12×13÷2=?', en:'12×13÷2=?', zh:'12×13÷2=？' } }
    ],
    open:{ ko:'1+2+…+100=5050인 이유를 가우스 방법으로 설명해 봐요. 처음+끝이 왜 도움이 될까요?',
      en:'Explain why 1+2+…+100=5050 using Gauss\'s method. Why does pairing first+last help?',
      zh:'用高斯方法解释为什么1+2+…+100=5050。首尾配对为什么有帮助？' },
    openHint:{ ko:'예) 1+100=101, 2+99=101,... 50쌍 모두 101. 101×50=5050. 처음과 끝의 합이 항상 같아서 쌍의 수만 세면 돼요.',
      en:'e.g. 1+100=101, 2+99=101,…50 pairs all equal 101. 101×50=5050. First+last always equals the same sum, so just count the pairs.',
      zh:'例）1+100=101，2+99=101，……共50对都是101。101×50=5050。首尾之和始终相等，只需数对数就行。' }
  },

  lab:{
    generator:'ml_gauss', level:'main', count:4,
    params:{},
    intro:{
      ko:'가우스 방법으로 1부터 n까지의 합을 구해봐!',
      en:"Find the sum from 1 to n using Gauss's method!",
      zh:'用高斯方法求1到n的和！'
    }
  },

  arena:{
    generator:'ml_gauss', level:'main', count:8, timeLimit:300,
    params:{},
    rule:{ ko:'5분 안에 가우스 덧셈 문제를 모두 풀어요!', en:'Solve all Gauss addition problems in 5 minutes!', zh:'5分钟内解答所有高斯加法题！' }
  },

  stamp:{ label:{ ko:'가우스 달인', en:'Gauss Master', zh:'高斯达人' }, coins:30 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'가우스처럼! 🔢',en:'Just like Gauss!',zh:'像高斯一样！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'처음과 끝을 더해봐!',en:'Add first and last!',zh:'加首和尾！'}, {ko:'공식 n(n+1)÷2 생각해봐!',en:'Remember n(n+1)÷2!',zh:'想想公式n(n+1)÷2！'} ],
    finish:{ ko:'완벽해! 가우스 달인! 🔢✨', en:'Perfect! Gauss Master!', zh:'完美！高斯达人！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
