/* M-37 — 로그의 정의: 네이피어가 1614년에 지은 새 이름표 */
'use strict';
module.exports=function(H){
  const {C,svg,astronomer,wig,arrow,paper,bubble,txt,ground}=H;
  return { panels:[
    { art: svg(
        '<circle cx="30" cy="22" r="2.5" fill="'+C.gold+'"/><circle cx="55" cy="15" r="2" fill="'+C.gold+'"/><circle cx="80" cy="25" r="2.5" fill="'+C.gold+'"/>'
        +astronomer(45,80,1.2)
        +paper(95,45,85,55)
        +txt(137,68,12,C.ink,'48293')
        +txt(137,86,12,C.ink,'×57061')
        +txt(30,55,16,C.red,'😓')),
      text:{ ko:'계산기가 없던 시절, 천문학자들은 자릿수가 엄청난 수의 곱셈으로 골치를 앓았어요.',
             en:'Before calculators, astronomers were plagued by the multiplication of huge, many-digit numbers.',
             zh:'在没有计算器的年代，天文学家为位数极多的数字乘法而头疼。' } },
    { art: svg(
        paper(20,45,70,50)
        +txt(55,75,20,C.red,'×')
        +arrow(95,70,120,70,C.gold,3)
        +paper(125,45,55,50)
        +txt(152,75,20,C.ok,'+')),
      text:{ ko:'로그는 그 골치 아픈 곱셈을 훨씬 쉬운 덧셈으로 바꿔주는, 아주 영리한 발명품이었어요.',
             en:'Logarithms were a clever invention that turned that painful multiplication into much easier addition.',
             zh:'对数是个聪明的发明，把那令人头疼的乘法变成了更容易的加法。' } },
    { art: svg(
        wig(55,85,1.2)
        +paper(95,35,80,65)
        +txt(135,58,13,C.sub,'logos')
        +txt(135,76,13,C.sub,'arithmos')
        +arrow(115,90,115,110,C.gold,2)
        +txt(135,105,17,C.ink,'log')
        +txt(135,20,13,C.gold,'1614')),
      text:{ ko:'네이피어가 1614년에 처음 만들었고, 그리스어 logos(비율)와 arithmos(수)를 합쳐 이름 붙였어요.',
             en:'Napier first created it in 1614, naming it from the Greek logos (ratio) and arithmos (number).',
             zh:'纳皮尔在1614年首创，名字取自希腊语logos(比率)和arithmos(数)。' } },
    { art: svg(
        [0,1,2,3].map(i=>'<line x1="60" y1="'+(115-i*25)+'" x2="140" y2="'+(115-i*25)+'" stroke="'+C.gold+'" stroke-width="3"/>').join('')
        +'<line x1="60" y1="20" x2="60" y2="115" stroke="'+C.gold+'" stroke-width="3"/>'
        +'<line x1="140" y1="20" x2="140" y2="115" stroke="'+C.gold+'" stroke-width="3"/>'
        +arrow(150,40,150,95,C.red,2.5)
        +txt(100,50,15,C.ink,'2³=8')
        +txt(100,105,15,C.blue,'log₂8=3')),
      text:{ ko:'2×2×2=8을 거꾸로 읽으면 log₂8=3 — 지수 사다리를 반대 방향으로 오르는 게 바로 로그예요!',
             en:'Reading 2×2×2=8 backward gives log₂8=3 — a logarithm is just climbing the exponent ladder in reverse!',
             zh:'把2×2×2=8反过来读就是log₂8=3——对数正是反向攀爬指数梯子！' } },
  ]};
};
