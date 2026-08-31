/* A-35 — 손버릇이 굳어진 기호들(로마 수의 뿌리) */
'use strict';
module.exports=function(H){
  const {C,svg,stick,sheep,pouch,arrow,paper,bubble,txt,ground}=H;
  return { panels:[
    { art: svg(
        txt(55,70,26,C.blue,'Ⅷ','font-family="Georgia,serif"')
        +txt(120,70,20,C.grey,'=')
        +txt(160,70,26,C.ink,'8')),
      text: { ko:'Ⅷ도 8, 8도 8. 같은 수인데 왜 모양이 다를까요?',
              en:'Ⅷ is 8, and 8 is 8 — the very same number, so why do they look different?',
              zh:'Ⅷ是8，8也是8。同一个数，为什么长得不一样？' } },
    { art: svg(
        txt(45,64,20,C.grey,'et','font-family="Georgia,serif" font-style="italic"')
        +arrow(72,58,116,58,C.gold,3)
        +txt(150,66,34,C.blue,'+')),
      text: { ko:'수학 기호는 발명됐다기보다 손버릇이 굳어진 거예요. +는 라틴어 et(그리고)를 빨리 흘려 쓰다 만들어졌어요.',
              en:'Math symbols were less invented than settled into habit. + grew from scribbling the Latin "et" (and) in a hurry.',
              zh:'数学符号与其说是发明的，不如说是习惯固定下来的。+源自快写拉丁语et(和)。' } },
    { art: svg(
        paper(50,20,100,90)
        +'<line x1="62" y1="40" x2="138" y2="40" stroke="'+C.grey+'" stroke-width="2"/>'
        +'<line x1="62" y1="52" x2="138" y2="52" stroke="'+C.grey+'" stroke-width="2"/>'
        +'<line x1="62" y1="64" x2="138" y2="64" stroke="'+C.grey+'" stroke-width="2"/>'
        +txt(100,90,26,C.blue,'+')),
      text: { ko:'15세기 중엽 독일에서 인쇄술이 퍼지면서 책에 실려 모두에게 굳어졌어요.',
              en:'Once printing spread through Germany in the mid-1400s, printed books fixed these shapes for everyone.',
              zh:'15世纪中叶印刷术在德国普及后，印刷书籍把这些形状固定了下来。' } },
    { art: svg(
        txt(30,40,16,C.ink,'I')+txt(65,40,16,C.ink,'V')+txt(100,40,16,C.ink,'X')+txt(135,40,16,C.ink,'L')+txt(170,40,16,C.ink,'C')
        +txt(70,90,16,C.blue,'VIII=8')
        +txt(150,90,16,C.red,'IV=4')),
      text: { ko:'로마 숫자 I V X L C도 마찬가지예요. 정해진 규칙 덕분에 오늘 우리는 VIII=8, IV=4를 읽어요!',
              en:'Roman numerals I V X L C are the same story — fixed rules let us read VIII=8 and IV=4 today!',
              zh:'罗马数字I V X L C也是如此。靠着固定的规则，今天我们能读出VIII=8、IV=4！' } },
  ]};
};
