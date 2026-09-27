/* T-DV3 — 약수 찾기 · 에라토스테네스의 체 */
'use strict';
module.exports=function(H){
  const {C,svg,txt,greek,numi}=H;
  /* 1~10 을 한 줄로 늘어놓는다. 지운 수는 회색 + 빗금, 남긴 수는 파랑 */
  const strip=(y,gone,keep)=>{
    let s='';
    for(let n=1;n<=10;n++){
      const x=19+(n-1)*18, off=gone.indexOf(n)>=0, on=keep.indexOf(n)>=0;
      s+=txt(x,y,15,off?C.grey:(on?C.blue:C.ink),String(n));
      if(off) s+='<line x1="'+(x-7)+'" y1="'+(y-12)+'" x2="'+(x+7)+'" y2="'+(y+4)
        +'" stroke="'+C.red+'" stroke-width="2.2" stroke-linecap="round"/>';
    }
    return s;
  };
  return { panels:[
    { art: svg(
        strip(56,[],[])
        +numi(100,112,0.85)),
      text:{ ko:'1부터 차례로 수를 죽 써 놓아요. 여기서 특별한 수만 걸러 낼 방법이 있을까요?',
             en:'Write the numbers out in order, starting at one. Is there a way to strain the special ones out?',
             zh:'从1开始把数按顺序写下来。有没有办法把特别的数筛出来？' } },
    { art: svg(
        strip(48,[1,4,6,8,10],[2])
        +txt(100,88,17,C.red,'2')
        +txt(58,116,15,C.sub,'4')+txt(86,116,15,C.sub,'6')
        +txt(114,116,15,C.sub,'8')+txt(144,116,15,C.sub,'10')),
      text:{ ko:'1은 지우고, 2는 남겨요. 그리고 2의 배수인 4·6·8·10을 전부 지웁니다.',
             en:'Cross out 1, keep 2 — then cross out every multiple of 2: four, six, eight, ten.',
             zh:'划掉1，留下2——再把2的倍数4、6、8、10全部划掉。' } },
    { art: svg(
        strip(48,[1,4,6,8,9,10],[2,3,5,7])
        +txt(100,88,17,C.red,'3')
        +txt(100,116,15,C.sub,'9')),
      text:{ ko:'살아남은 3을 남기고 3의 배수 9를 지워요. 다음은 5, 그다음은 7 — 같은 일을 되풀이합니다.',
             en:'Keep the next survivor, 3, and cross out its multiple 9. Then 5, then 7 — the same move over and over.',
             zh:'留下幸存的3，划掉它的倍数9。接着是5，然后是7——同样的动作一遍遍重复。' } },
    { art: svg(
        txt(30,50,20,C.blue,'2')+txt(60,50,20,C.blue,'3')+txt(90,50,20,C.blue,'5')
        +txt(120,50,20,C.blue,'7')+txt(155,50,20,C.blue,'11')+txt(182,50,20,C.grey,'···')
        +'<line x1="20" y1="66" x2="180" y2="66" stroke="'+C.gold+'" stroke-width="3"/>'
        +greek(46,106,0.95)
        +txt(140,104,17,C.ok,'7 = 1×7')),
      text:{ ko:'남은 수는 약수가 1과 자기 자신뿐인 수, 소수예요. 옛 그리스 사람은 이 수가 끝없이 이어진다는 것도 밝혀냈답니다.',
             en:'What is left are the numbers whose only divisors are one and themselves — the primes. The ancient Greeks even proved the list never ends.',
             zh:'剩下的就是约数只有1和自己的数——质数。古希腊人还证明了这串数永远没有尽头。' } },
  ]};
};
