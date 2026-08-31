/* M-30 — 행렬: 같은 자리는 그냥 더하고, 곱셈은 행과 열을 짝지어요 */
'use strict';
module.exports=function(H){
  const {C,svg,stick,arrow,paper,bubble,txt,ground}=H;
  function grid(x,y,vals,col){
    let s='<rect x="'+x+'" y="'+y+'" width="60" height="60" fill="#fff" stroke="'+(col||C.ink)+'" stroke-width="2.5"/>'
      +'<line x1="'+(x+30)+'" y1="'+y+'" x2="'+(x+30)+'" y2="'+(y+60)+'" stroke="'+(col||C.ink)+'" stroke-width="1.5"/>'
      +'<line x1="'+x+'" y1="'+(y+30)+'" x2="'+(x+60)+'" y2="'+(y+30)+'" stroke="'+(col||C.ink)+'" stroke-width="1.5"/>';
    const pos=[[x+15,y+22],[x+45,y+22],[x+15,y+52],[x+45,y+52]];
    vals.forEach((v,i)=>{ s+=txt(pos[i][0],pos[i][1],14,C.sub,String(v)); });
    return s;
  }
  return { panels:[
    { art: svg(
        grid(15,35,[1,2,3,4])
        +txt(102,72,20,C.gold,'?')
        +grid(125,35,[5,0,1,2],C.blue)),
      text:{ ko:'숫자를 네모 칸에 담은 표 두 개를 한꺼번에 더하거나 곱하고 싶을 때가 있어요.',
             en:'Sometimes you want to add or multiply two tables of numbers, arranged in a grid, all at once.',
             zh:'有时想把两张排成方格的数字表一起相加或相乘。' } },
    { art: svg(
        grid(15,35,[1,2,3,4])
        +grid(125,35,[5,0,1,2],C.blue)
        +arrow(48,50,155,50,C.ok,2)
        +arrow(78,80,185,80,C.ok,2)
        +txt(100,20,16,C.ok,'+')),
      text:{ ko:'덧셈·뺄셈은 아주 단순해요 — 왼쪽 위는 왼쪽 위끼리, 오른쪽 아래는 오른쪽 아래끼리, 같은 자리끼리만 계산해요.',
             en:'Addition and subtraction are simple — top-left with top-left, bottom-right with bottom-right, only matching positions.',
             zh:'加减法很简单——左上对左上，右下对右下，只有相同位置才运算。' } },
    { art: svg(
        grid(15,35,[1,2,3,4])
        +'<rect x="15" y="35" width="60" height="30" fill="'+C.gold+'" opacity="0.35"/>'
        +grid(125,35,[5,6,7,8],C.blue)
        +'<rect x="125" y="35" width="30" height="60" fill="'+C.blue+'" opacity="0.25"/>'
        +arrow(78,50,122,55,C.red,2.5)
        +txt(100,18,16,C.red,'×')),
      text:{ ko:'곱셈은 달라요 — 앞 행렬의 한 "행"과 뒤 행렬의 한 "열"을 짝지어 곱하고 더하는 특별한 규칙을 따라요.',
             en:'Multiplication is different — it follows a special rule of pairing a "row" from the first matrix with a "column" from the second.',
             zh:'乘法不同——遵循把前一个矩阵的"行"和后一个矩阵的"列"配对的特殊规则。' } },
    { art: svg(
        grid(70,35,[19,22,43,50],C.ok)
        +'<circle cx="145" cy="45" r="10" fill="'+C.goldbright+'"/>'
        +txt(145,50,13,C.ink,'✓')),
      text:{ ko:'처음엔 낯설어도 이 규칙만 외우면 어떤 행렬 곱셈도 기계처럼 척척 계산할 수 있어요.',
             en:'It feels strange at first, but once you know this rule, you can compute any matrix multiplication like a machine.',
             zh:'刚开始会觉得陌生，但记住这个规则后，任何矩阵乘法都能像机器一样算出来。' } },
  ]};
};
