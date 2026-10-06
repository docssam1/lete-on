/* M-01 — 붉은 산가지, 검은 산가지(기존 손그림을 소스 파트로 이관) */
'use strict';
module.exports=function(H){
  const {C,svg,sheep,pouch,arrow,paper,bubble,txt,ground,wig}=H;
  const {liuhui}=H;
  const rods=(n,dark)=> (dark?'<defs><filter id="nm-dark-counting-rod" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values=".05 .05 .05 0 0 .05 .05 .05 0 0 .05 .05 .05 0 0 0 0 0 1 0"/></filter></defs>':'')+
    Array.from({length:n},(_,i)=>'<image href="assets/images/concepts/counting-rod.png" x="'+(32+i*20)+'" y="33" width="43" height="74"'+(dark?' filter="url(#nm-dark-counting-rod)"':'')+'/>').join('');
  return { panels:[
    { art: svg(
        '<rect x="30" y="30" width="140" height="80" rx="6" fill="#fdf6e3" stroke="#C9A063" stroke-width="2.5"/>'
        +rods(3,false)
        +'<text x="138" y="80" text-anchor="middle" font-size="26" font-weight="800" fill="#D9534F">+3</text>'),
      text: { ko:'『구장산술』의 유휘 주석은 붉은 산가지로 양수를 나타냈다고 설명합니다. 여기서 붉은 가지 셋은 +3입니다.',
              en:'Liu Hui\'s commentary on The Nine Chapters describes red rods for positive numbers. These three red rods represent +3.',
              zh:'刘徽的《九章算术》注释介绍了用红色算筹表示正数。这里三根红筹表示+3。' } },
    { art: svg(
        '<rect x="30" y="30" width="140" height="80" rx="6" fill="#fdf6e3" stroke="#C9A063" stroke-width="2.5"/>'
        +rods(2,true)
        +'<text x="138" y="80" text-anchor="middle" font-size="26" font-weight="800" fill="#1A2233">−2</text>'),
      text: { ko:'검은 산가지는 음수를 나타냅니다. 여기서 검은 가지 둘은 −2입니다. 색과 부호로 양수와 음수를 구별합니다.',
              en:'Black rods represent negative numbers. These two black rods represent −2. Both colour and sign distinguish positive from negative.',
              zh:'黑色算筹表示负数。这里两根黑筹表示−2。颜色和正负号都能帮助我们区分正数与负数。' } },
    { art: svg(
        liuhui(52,78,1.3)
        +'<ellipse cx="134" cy="52" rx="44" ry="26" fill="#fff" stroke="#1A2233" stroke-width="2"/>'
        +'<path d="M 104 70 L 92 84 L 112 74 Z" fill="#fff" stroke="#1A2233" stroke-width="2"/>'
        +'<text x="126" y="60" text-anchor="middle" font-size="20" font-weight="800" fill="#D9534F">−5</text>'
        +'<text x="152" y="60" text-anchor="middle" font-size="20" font-weight="800" fill="#4a5468">?</text>'),
      text: { ko:'−5는 0보다 5만큼 작은 수입니다. 이때 −는 음의 부호이며, 두 수 사이에 쓰는 뺄셈 기호와 구별합니다.',
              en:'−5 is 5 less than 0. Here − is a negative sign, not a subtraction operation between two numbers.',
              zh:'−5是比0小5的数。这里的−是负号，要与两个数之间的减号区分。' } },
    { art: svg(
        '<line x1="16" y1="82" x2="184" y2="82" stroke="#1A2233" stroke-width="2.5"/>'
        +'<polygon points="184,82 176,78 176,86" fill="#1A2233"/>'
        +[-3,-2,-1,0,1,2,3].map(function(n,i){var x=34+i*22;
          return '<line x1="'+x+'" y1="77" x2="'+x+'" y2="87" stroke="#1A2233" stroke-width="2"/>'
            +'<text x="'+x+'" y="104" text-anchor="middle" font-size="11" font-weight="700" fill="'+(n<0?'#D9534F':'#16417C')+'">'+n+'</text>';}).join('')
        +'<rect x="88" y="22" width="10" height="34" rx="5" fill="#fff" stroke="#4a5468" stroke-width="2"/>'
        +'<circle cx="93" cy="56" r="7" fill="#D9534F"/>'
        +'<rect x="90.5" y="34" width="5" height="20" fill="#D9534F"/>'),
      text: { ko:'영하 온도, 지하층, 통장의 빚처럼 0을 기준으로 반대인 상태를 음수로 나타낼 수 있습니다.',
              en:'And today? Sub-zero temperatures, basement floors, money owed — negatives are everywhere around us!',
              zh:'现在呢？零下的气温、地下楼层、欠的钱——负数无处不在！' } },
  ]};
};
