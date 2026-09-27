/* T-AD1 — 네 자리 수 덧뺄셈 · 자리마다 열쇠 수를 더해 적는 암호 */
'use strict';
module.exports=function(H){
  const {C,svg,paper,arrow,txt,numi}=H;
  const digits=(y,str,col,size)=>str.split('').map((ch,i)=>
    txt(62+i*26,y,size||20,col,ch)).join('');
  return { panels:[
    { art: svg(
        paper(44,26,116,58)
        +digits(64,'2001',C.ink)
        +numi(24,110,0.95)
        +txt(176,58,26,C.red,'!')),
      text:{ ko:'비밀번호를 수첩에 그대로 적어 두면, 수첩을 잃어버리는 날 큰일이 나요.',
             en:'Write your PIN straight into a notebook, and the day you lose the notebook is a very bad day.',
             zh:'把密码原样写在本子上，哪天本子丢了就糟糕了。' } },
    { art: svg(
        digits(40,'2001',C.ink)
        +digits(70,'2345',C.blue)
        +'<line x1="46" y1="82" x2="156" y2="82" stroke="'+C.gold+'" stroke-width="3"/>'
        +digits(108,'4346',C.red)
        +txt(30,70,22,C.blue,'+')),
      text:{ ko:'대신 열쇠 수를 하나 정해 자리마다 더해요. 2001에 2345를 자리끼리 더하면 4346이에요.',
             en:'Instead, pick one key number and add it place by place. 2001 plus 2345, column by column, gives 4346.',
             zh:'换个办法：定一个钥匙数，按数位相加。2001加2345，逐位相加得到4346。' } },
    { art: svg(
        paper(44,30,116,58)
        +digits(68,'4346',C.ink)
        +numi(176,112,0.95)
        +txt(24,66,30,C.grey,'?')),
      text:{ ko:'수첩에는 4346이라고만 적어 둡니다. 남이 펼쳐 봐도 무슨 수인지 알 수가 없어요.',
             en:'The notebook holds only 4346. Anyone who opens it has no idea what the number means.',
             zh:'本子上只写4346。别人翻开也看不出这是什么数。' } },
    { art: svg(
        digits(40,'4346',C.ink)
        +digits(70,'2345',C.blue)
        +'<line x1="46" y1="82" x2="156" y2="82" stroke="'+C.gold+'" stroke-width="3"/>'
        +digits(108,'2001',C.ok)
        +txt(30,70,24,C.blue,'−')),
      text:{ ko:'열쇠만 머릿속에 있으면 자리끼리 빼서 2001을 되찾아요. 네 자리 덧뺄셈이 그대로 암호가 된 거예요!',
             en:'Keep the key in your head, subtract column by column, and 2001 comes back. Four-digit adding and subtracting has become a code!',
             zh:'钥匙记在脑子里，按数位减回去就得到2001。四位数加减法就这样变成了密码！' } },
  ]};
};
