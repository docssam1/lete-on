/* Numbers of Magic — 유닛 H-03: 진법·진법 곱셈법 (고급 C-3 · 경시의 탑 27 수의 비밀) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['H-03'] = {
  id:'H-03', tier:'advanced', level:'27', order:1,
  lineage:['halves-doubles'],
  generator:'adv_baseSystem',
  title:{ ko:'진법·진법 곱셈법', en:'Number Bases & Binary Multiplication', zh:'进制与二进制乘法' },
  subtitle:{ ko:'숫자가 2개뿐인 나라도 있대요! 1,2,4,8…로 어려운 곱셈도 풀어요.', en:'Some lands use only 2 digits! Solve tough multiplications with 1,2,4,8…', zh:'有的国度只有2个数字！用1,2,4,8…也能解难题。' },
  icon:'🧮',

  practice:{
    generator:'adv_baseSystem', level:'practice', count:5,
    params:{op:'convert',base:5,dir:'fromBase'},
    intro:{
      ko:'우리는 숫자 10개를 쓰지만, 5개만 쓰는 나라도 있어. 자릿값의 비밀을 파헤쳐 보자!',
      en:'We use 10 digits, but some lands use just 5. Let\'s uncover the secret of place value!',
      zh:'我们用10个数字，但有的地方只用5个。来揭开位值的秘密吧！'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ko:'① 숫자가 다섯 개뿐인 나라',en:'1) A land with only 5 digits',zh:'① 只有5个数字的国度'},
        head:{ko:'5진법: 0,1,2,3,4 다음은? → 10',en:'Base 5: after 0,1,2,3,4 comes… 10',zh:'5进制：0,1,2,3,4之后是？→ 10'},
        desc:{ko:'이상한 나라에는 숫자가 0,1,2,3,4 다섯 개뿐이에요. 4 다음 수는 어떻게 쓸까요? 우리가 9 다음에 자리를 올려 10을 쓰듯, 이 나라는 4 다음에 자리를 올려 <b>10</b>(다섯)이라고 써요! (23)₅는 2×5+3=<b>13</b>(십진수). 자릿값이 1,5,25,125…로 5배씩 커지는 거예요.',
              en:'A strange land has only 5 digits: 0,1,2,3,4. What comes after 4? Just like we roll over to 10 after 9, this land rolls over after 4 to write <b>10</b> (meaning five)! (23)₅ = 2×5+3 = <b>13</b> in decimal. Place values grow ×5 each step: 1, 5, 25, 125…',
              zh:'一个奇妙的国度只有5个数字：0,1,2,3,4。4之后怎么写呢？就像我们9之后进位写10一样，这个国度4之后进位写<b>10</b>（代表5）！(23)₅ = 2×5+3 = 十进制的<b>13</b>。位值每一位都乘5：1、5、25、125……'},
        mathSteps:['(23)₅ = 2×5 + 3','2×5=10','10+3=13'],
        result:{ko:'(23)₅ = 13! 자릿값이 5배씩 커져요.',en:'(23)₅ = 13! Place values scale by 5 each step.',zh:'(23)₅ = 13！每位值都乘5。'},
        book:{ko:'컴퓨터는 숫자가 2개뿐인 2진법을 써요. 신호가 켜짐(1)/꺼짐(0)만 있으면 되니까요! 바코드·QR·색상 코드(16진법)도 이 원리로 만들어져요.',
              en:'Computers use base 2, with only two digits — signal on (1) or off (0)! Barcodes, QR codes, and color codes (base 16) are all built on this idea.',
              zh:'电脑用只有两个数字的二进制——信号开(1)或关(0)！条形码、二维码和颜色代码（16进制）都是基于这个原理。'} },

      { tag:{ko:'② 두 배씩 커지는 수로 곱하기',en:'2) Multiply with doubling numbers',zh:'② 用翻倍的数做乘法'},
        head:{ko:'23×13: 13=8+4+1로 쪼개요',en:'23×13: split 13 = 8+4+1',zh:'23×13：把13拆成8+4+1'},
        desc:{ko:'모든 수는 1,2,4,8,16,32…의 합으로 나타낼 수 있어요! 13=8+4+1이니까, 23×8=184, 23×4=92, 23×1=23을 미리 구해서 더하면 돼요: 184+92+23=<b>299</b>. 이게 바로 컴퓨터가 곱셈을 하는 이진법의 원리예요.',
              en:'Every number can be written as a sum of 1, 2, 4, 8, 16, 32… Since 13=8+4+1, pre-compute 23×8=184, 23×4=92, 23×1=23, then add: 184+92+23=<b>299</b>. This is exactly how computers multiply in binary!',
              zh:'每个数都能写成1、2、4、8、16、32……的和！因为13=8+4+1，先算出23×8=184，23×4=92，23×1=23，再加起来：184+92+23=<b>299</b>。这正是电脑用二进制做乘法的原理！'},
        mathSteps:['13 = 8+4+1','23×8=184, 23×4=92, 23×1=23','184+92+23 = 299'],
        result:{ko:'23×13=299! 두 배씩 커지는 조각들을 골라 더했어요.',en:'23×13=299! Picked and added the doubling pieces.',zh:'23×13=299！挑出翻倍的部分再相加。'},
        book:{ko:'2진법으로 13은 (1101)₂예요 — 왼쪽부터 8,4,2,1 자리에 1101이니 8+4+0+1=13. 딱 우리가 골랐던 조각과 같아요!',
              en:'In binary, 13 is (1101)₂ — reading 8,4,2,1 places as 1,1,0,1 gives 8+4+0+1=13, exactly the pieces we picked!',
              zh:'13的二进制是(1101)₂——从8,4,2,1这几位读作1,1,0,1，即8+4+0+1=13，正是我们挑出的那些部分！'} }
    ],
    rule:{ ko:'① 진법은 자릿값이 그 수만큼씩 커지는 표기법  ② 곱셈은 곱하는 수를 1,2,4,8…의 합으로 쪼개기  ③ 필요한 배수만 골라 더하기',
      en:'① A number base is a place-value system that scales by that base  ② For multiplication, split the multiplier into a sum of 1,2,4,8…  ③ Add only the matching multiples',
      zh:'① 进制是位值按该基数扩大的记数法  ② 乘法时把乘数拆成1,2,4,8…之和  ③ 只加需要的倍数' }
  },

  check:{
    fills:[
      { tex:'(101)_{2} = \\square_{10}', answer:5,
        hint:{ ko:'4+0+1=?', en:'4+0+1=?', zh:'4+0+1=？' } },
      { tex:'18 \\times 11 = \\square \\;(11=8+2+1)', answer:198,
        hint:{ ko:'18×8=144, 18×2=36, 18×1=18 → 다 더하면?', en:'18×8=144, 18×2=36, 18×1=18 → sum?', zh:'18×8=144，18×2=36，18×1=18 → 相加？' } }
    ],
    open:{ ko:'십진수 20을 2진법으로 바꾸고, 그 자리 숫자들이 20을 어떻게 더해서 만드는지 설명해 봐요.',
      en:'Convert decimal 20 to binary, and explain how its digits add up to make 20.',
      zh:'把十进制的20换成二进制，说说它的每一位是怎么加起来变成20的。' },
    openHint:{ ko:'예) 20=(10100)₂ = 16+4. 16+0+4+0+0=20.',
      en:'e.g. 20=(10100)₂ = 16+4. 16+0+4+0+0=20.',
      zh:'例）20=(10100)₂ = 16+4。16+0+4+0+0=20。' }
  },

  lab:{
    generator:'adv_baseSystem', level:'main', count:4,
    params:{op:'convert',base:5,dir:'toBase'},
    intro:{
      ko:'이번엔 반대로, 십진수를 진법으로 바꿔보자!',
      en:'Now go the other way — convert decimal into another base!',
      zh:'这次反过来，把十进制换成别的进制！'
    }
  },

  arena:{
    generator:'adv_baseSystem', level:'main', count:8, timeLimit:300,
    params:{op:'binaryMul',level:'main'},
    rule:{ ko:'5분 안에 이진법 곱셈 문제를 모두 풀어요!', en:'Solve all binary-multiplication problems in 5 minutes!', zh:'5分钟内解答所有二进制乘法题！' }
  },

  stamp:{ label:{ ko:'진법 탐험가', en:'Number-Base Explorer', zh:'进制探险家' }, coins:36 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'진법 마스터! 🧮',en:'Base master!',zh:'进制大师！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'자릿값이 몇 배씩 커지는지 확인해봐!',en:'Check what the place values scale by!',zh:'看看位值是按几倍扩大的！'}, {ko:'1,2,4,8처럼 두 배씩 커지는 수로 쪼개봐!',en:'Split it into doubling numbers like 1,2,4,8!',zh:'拆成1,2,4,8这样翻倍的数！'} ],
    finish:{ ko:'완벽해! 진법 탐험가! 🧮✨', en:'Perfect! Number-Base Explorer!', zh:'完美！进制探险家！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
