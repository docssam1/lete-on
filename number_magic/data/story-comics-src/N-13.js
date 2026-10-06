/* N-13 — 수 퍼즐과 추론(2026-10-06 다시 그림 — 캡슐 모양 사람 대신 캐릭터).
   유닛 story 그대로: 빨강 3·파랑 2 스티커, 맨 뒤 친구의 "모르겠어"도 힌트 → 앞 두 친구가 둘 다 파랑은 아니다.
   마지막 컷은 유닛 rule "위+아래 = 왼쪽+오른쪽" 십자 퍼즐. 그림 속 글자는 숫자·? 뿐. */
'use strict';
module.exports=function(H){
  const {C,svg,meadow,boy,girl,gaussBoy,bubble,txt,arrow}=H;
  const dot=(x,y,col)=>'<circle cx="'+x+'" cy="'+y+'" r="7" fill="'+col+'" stroke="'+C.ink+'" stroke-width="2"/><ellipse cx="'+(x-2.4)+'" cy="'+(y-2.4)+'" rx="2.2" ry="1.3" fill="#fff" opacity=".7"/>';
  const back='#5b8dd9';
  /* 줄: 맨 뒤(왼쪽) 소년 → 가운데 소녀 → 맨 앞(오른쪽) 소년. 모두 오른쪽(앞)을 본다. */
  const row=(stk)=>boy(44,84,0.72)+girl(100,84,0.72)+gaussBoy(156,84,0.72)+(stk?dot(44,22,stk[0])+dot(100,22,stk[1])+dot(156,22,stk[2]):'');
  const pile='<rect x="2" y="104" width="196" height="30" rx="6" fill="'+C.cream+'" stroke="'+C.gold+'" stroke-width="2"/>';
  return { panels:[
    { art: svg(meadow(118)+row([C.red,C.red,C.red])
        +dot(120,126,C.red)+dot(138,126,C.red)+dot(156,126,C.red)+dot(176,126,back)+dot(192,126,back)),
      text:{ ko:'친구 셋이 한 줄로 섰어요. 빨강 3장, 파랑 2장 중 한 장씩 머리에 붙였어요. 자기 스티커는 못 보고 앞사람 것만 보여요.',
             en:'Three friends stand in a line. Each gets one sticker from 3 red and 2 blue. You cannot see your own, only the ones in front.',
             zh:'三个朋友排成一行，从3张红色、2张蓝色里各贴一张在头上。看不到自己的，只能看到前面的人。' } },
    { art: svg(meadow(118)+row([C.red,C.red,C.red])+bubble(18,52,14,12,32,64)+txt(18,58,16,C.red,'?')+arrow(62,52,136,52,C.gold,3)),
      text:{ ko:'맨 뒤 친구는 앞의 두 친구를 보고도 "모르겠어"라고 했어요. 이 말에도 힌트가 숨어 있어요.',
             en:'The friend at the back looks at the two in front and says, "I don\'t know." That answer is a clue too.',
             zh:'最后面的朋友看了前面两人，说“我不知道”。这句话里也藏着线索。' } },
    { art: svg(dot(70,54,back)+dot(100,54,back)+'<path d="M 54 38 L 116 70 M 116 38 L 54 70" stroke="'+C.red+'" stroke-width="4" stroke-linecap="round"/>'
        +arrow(126,54,150,54,C.gold,3)+dot(170,54,C.red)),
      text:{ ko:'앞의 두 친구가 둘 다 파랑이었다면, 파랑은 2장뿐이니 맨 뒤 친구는 자기가 빨강인 걸 바로 알았을 거예요.',
             en:'If both friends in front had blue, there would be no blue left — the back friend would have known at once they had red.',
             zh:'如果前面两人都是蓝色，蓝色只有2张，最后面的朋友马上就知道自己是红色了。' } },
    { art: svg([[100,26,'2'],[100,106,'3'],[60,66,'1'],[140,66,'4']].map(([x,y,n])=>'<rect x="'+(x-18)+'" y="'+(y-18)+'" width="36" height="36" rx="6" fill="#fff" stroke="'+C.blue+'" stroke-width="2.4"/>'+txt(x,y+7,20,C.ink,n)).join('')
        +'<rect x="82" y="48" width="36" height="36" rx="6" fill="'+C.goldbright+'" stroke="'+C.blue+'" stroke-width="2.4"/>'
        +txt(36,30,14,C.gold,'5')+txt(170,30,14,C.gold,'5')),
      text:{ ko:'모르는 것도 정보가 돼요. 십자 퍼즐도 추리로 풀어요. 위+아래(2+3)와 왼쪽+오른쪽(1+4)이 둘 다 5예요!',
             en:'Not knowing is information too. Cross puzzles are solved by reasoning: top + bottom (2+3) and left + right (1+4) are both 5!',
             zh:'不知道也是信息。十字谜题也靠推理：上+下（2+3）和左+右（1+4）都等于5！' } },
  ]};
};
