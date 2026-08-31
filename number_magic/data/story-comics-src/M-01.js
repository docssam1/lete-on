/* M-01 — 붉은 산가지, 검은 산가지(기존 손그림을 소스 파트로 이관) */
'use strict';
module.exports=function(H){
  const {C,svg,stick,sheep,pouch,arrow,paper,bubble,txt,ground}=H;
  return { panels:[
    { art: svg(
        '<rect x="30" y="30" width="140" height="80" rx="6" fill="#fdf6e3" stroke="#C9A063" stroke-width="2.5"/>'
        +'<line x1="56" y1="46" x2="56" y2="94" stroke="#D9534F" stroke-width="5" stroke-linecap="round"/>'
        +'<line x1="76" y1="46" x2="76" y2="94" stroke="#D9534F" stroke-width="5" stroke-linecap="round"/>'
        +'<line x1="96" y1="46" x2="96" y2="94" stroke="#D9534F" stroke-width="5" stroke-linecap="round"/>'
        +'<text x="138" y="80" text-anchor="middle" font-size="26" font-weight="800" fill="#D9534F">+</text>'),
      text: { ko:'2,000년 전 중국 『구장산술』은 산가지 막대로 계산했어요. 붉은 가지는 더하는 수(+)!',
              en:'Two thousand years ago, Chinese mathematicians computed with counting rods. Red rods meant positive numbers (+)!',
              zh:'两千年前，《九章算术》用算筹来计算。红色的筹表示正数(+)！' } },
    { art: svg(
        '<rect x="30" y="30" width="140" height="80" rx="6" fill="#fdf6e3" stroke="#C9A063" stroke-width="2.5"/>'
        +'<line x1="56" y1="46" x2="56" y2="94" stroke="#1A2233" stroke-width="5" stroke-linecap="round"/>'
        +'<line x1="76" y1="46" x2="76" y2="94" stroke="#1A2233" stroke-width="5" stroke-linecap="round"/>'
        +'<text x="130" y="80" text-anchor="middle" font-size="26" font-weight="800" fill="#1A2233">−</text>'),
      text: { ko:'검은 가지는 빼는 수(−). 색만 봐도 부호가 한눈에 보였죠!',
              en:'Black rods meant negative numbers (−). One glance at the colour told you the sign!',
              zh:'黑色的筹表示负数(−)。一看颜色就知道正负！' } },
    { art: svg(
        stick(52,78,1.3,'#4a5468')
        +'<ellipse cx="134" cy="52" rx="44" ry="26" fill="#fff" stroke="#1A2233" stroke-width="2"/>'
        +'<path d="M 104 70 L 92 84 L 112 74 Z" fill="#fff" stroke="#1A2233" stroke-width="2"/>'
        +'<text x="126" y="60" text-anchor="middle" font-size="20" font-weight="800" fill="#D9534F">−5</text>'
        +'<text x="152" y="60" text-anchor="middle" font-size="20" font-weight="800" fill="#4a5468">?</text>'),
      text: { ko:'한편 유럽은 오랫동안 음수를 "거짓 수"라 부르며 의심했어요.',
              en:'Europe, meanwhile, long distrusted negatives, calling them "false numbers."',
              zh:'而欧洲长期怀疑负数，把它叫作"假数"。' } },
    { art: svg(
        '<line x1="16" y1="82" x2="184" y2="82" stroke="#1A2233" stroke-width="2.5"/>'
        +'<polygon points="184,82 176,78 176,86" fill="#1A2233"/>'
        +[-3,-2,-1,0,1,2,3].map(function(n,i){var x=34+i*22;
          return '<line x1="'+x+'" y1="77" x2="'+x+'" y2="87" stroke="#1A2233" stroke-width="2"/>'
            +'<text x="'+x+'" y="104" text-anchor="middle" font-size="11" font-weight="700" fill="'+(n<0?'#D9534F':'#16417C')+'">'+n+'</text>';}).join('')
        +'<rect x="88" y="22" width="10" height="34" rx="5" fill="#fff" stroke="#4a5468" stroke-width="2"/>'
        +'<circle cx="93" cy="56" r="7" fill="#D9534F"/>'
        +'<rect x="90.5" y="34" width="5" height="20" fill="#D9534F"/>'),
      text: { ko:'지금은요? 영하 온도, 지하층, 통장의 빚 — 음수는 우리 곁 어디에나 있답니다!',
              en:'And today? Sub-zero temperatures, basement floors, money owed — negatives are everywhere around us!',
              zh:'现在呢？零下的气温、地下楼层、欠的钱——负数无处不在！' } },
  ]};
};
