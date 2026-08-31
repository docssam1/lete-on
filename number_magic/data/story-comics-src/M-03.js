/* M-03 — 산을 오르내린 속력, 분모부터 맞추는 조심성 */
'use strict';
module.exports=function(H){
  const {C,svg,stick,sheep,pouch,arrow,paper,bubble,txt,ground}=H;
  const HILL='<polygon points="20,120 100,30 180,120" fill="'+C.mist+'" stroke="'+C.gold+'" stroke-width="2.5"/>';
  return { panels:[
    { art: svg(
        ground(120)+HILL
        + stick(55,95,0.9,C.blue)
        + arrow(55,110,90,45,C.ok,3)
        + txt(75,60,16,C.ok,'10')),
      text: { ko:'산 정상까지 시속 10km로 천천히 걸어 올라갔어요. 내려올 땐 얼마나 빠를까요?',
              en:'Climbing the hill at 10 km/h, slow and steady. How fast would the way down be?',
              zh:'以每小时10公里的速度慢慢爬上山顶。下山又会有多快呢？' } },
    { art: svg(
        ground(120)+HILL
        + stick(140,50,0.9,C.blue)
        + arrow(120,45,165,110,C.red,3)
        + txt(150,80,16,C.red,'30')),
      text: { ko:'내려올 땐 시속 30km로 훨씬 빠르게 뛰어 내려왔어요.',
              en:'Coming back down, at 30 km/h — much, much faster.',
              zh:'下山时以每小时30公里的速度快得多地跑了下来。' } },
    { art: svg(
        stick(45,95,0.9,C.blue)
        + bubble(130,55,42,28,95,85)
        + txt(130,60,26,C.sub,'20')
        + '<line x1="112" y1="42" x2="150" y2="72" stroke="'+C.red+'" stroke-width="3.5" stroke-linecap="round"/>'
        + '<line x1="150" y1="42" x2="112" y2="72" stroke="'+C.red+'" stroke-width="3.5" stroke-linecap="round"/>'),
      text: { ko:'평균 속력은 그냥 (10+30)÷2=20일까요? 잠깐, 정말 그렇게 쉽게 계산해도 될까요?',
              en:'Is the average simply (10+30)÷2=20? Wait — can it really be that easy?',
              zh:'平均速度是不是直接(10+30)÷2=20呢？等等，真的能这么简单算吗？' } },
    { art: svg(
        ground(110)
        + stick(100,85,1,C.blue)
        + txt(100,45,30,C.ok,'15')
        + txt(100,105,13,C.sub,'km/h')),
      text: { ko:'정답은 15km/h예요. 느린 쪽에 시간을 더 썼으니 그냥 더해 반으로 나눌 수 없죠 — 분수도 분모부터 맞추는 조심이 필요해요.',
              en:'The real answer is 15 km/h. More time was spent going slow, so you can\'t just add and halve — fractions need that same care, lining up denominators first.',
              zh:'真正的答案是15公里/小时。慢的那段花的时间更长，不能直接相加除以2——加分数前也需要同样的谨慎，先对齐分母。' } },
  ]};
};
