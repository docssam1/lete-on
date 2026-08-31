/* B-09 — 바코드 검산 숫자와 3의 배수 마법 */
'use strict';
module.exports=function(H){
  const {C,svg,stick,sheep,pouch,arrow,paper,bubble,txt,ground}=H;
  return { panels:[
    { art: svg(
        stick(36,92,1.15)
        +'<rect x="106" y="16" width="54" height="88" rx="4" fill="#fff" stroke="'+C.ink+'" stroke-width="2"/>'
        +'<path d="M 116 76 L 116 98 M 119 76 L 119 98 M 123 76 L 123 98 M 127 76 L 127 98 M 130 76 L 130 98 M 134 76 L 134 98 M 138 76 L 138 98 M 142 76 L 142 98 M 146 76 L 146 98 M 150 76 L 150 98" stroke="'+C.ink+'" stroke-width="2" fill="none"/>'
        +txt(153,60,20,C.red,'?')),
      text: { ko:'우유갑 바코드 아래엔 숫자가 13개예요. 그런데 맨 끝 한 자리, 왜 따로 붙어 있을까요?',
              en:'Under a milk-carton barcode sit 13 digits. Why is that very last one tacked on?',
              zh:'牛奶盒条形码下面有13位数字。可最后一位，为什么单独加在那儿呢？' } },
    { art: svg(
        '<path d="M 30 70 L 30 92 M 34 70 L 34 92 M 38 70 L 38 92 M 42 70 L 42 92 M 46 70 L 46 92 M 50 70 L 50 92 M 54 70 L 54 92 M 58 70 L 58 92 M 62 70 L 62 92 M 66 70 L 66 92 M 70 70 L 70 92 M 74 70 L 74 92" stroke="'+C.ink+'" stroke-width="2" fill="none"/>'
        +arrow(90,80,122,80,C.gold,3)
        +paper(128,52,52,54)
        +txt(154,76,16,C.blue,'×3')
        +txt(154,96,16,C.ink,'+')
        +txt(154,114,10,C.sub,'10−□')),
      text: { ko:'앞 12자리 중 짝수 번째 숫자만 3배로 해서 다 더한 다음, 10에서 일의 자리를 빼요.',
              en:'Take every even-position digit of the first 12, triple and add them, then subtract from 10.',
              zh:'把前12位里偶数位的数字乘以3再全部相加，最后用10减去个位数。' } },
    { art: svg(
        '<rect x="28" y="58" width="48" height="36" rx="4" fill="#fff" stroke="'+C.ink+'" stroke-width="2"/>'
        +txt(52,82,16,C.red,'✕')
        +'<path d="M 102 38 L 92 70 L 106 70 L 94 102" stroke="'+C.gold+'" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'
        +txt(140,52,26,C.red,'!')
        +stick(150,92,1.1,C.sub)),
      text: { ko:'스캐너가 바코드를 잘못 읽으면 이 숫자가 딱 안 맞아요. 그래서 삑! 소리가 나는 거예요.',
              en:'If the scanner misreads a bar, this number no longer matches — and it beeps!',
              zh:'扫描仪一旦读错，这个数字就对不上，于是"哔！"地报警。' } },
    { art: svg(
        txt(58,46,18,C.blue,'3+6+9')
        +arrow(58,56,58,76,C.gold,3)
        +txt(58,96,20,C.ink,'18')
        +'<path d="M 92,90 L 100,98 L 116,76" stroke="'+C.ok+'" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'
        +'<path d="M 148 44 L 148 62 M 151 44 L 151 62 M 155 44 L 155 62 M 158 44 L 158 62 M 162 44 L 162 62 M 165 44 L 165 62" stroke="'+C.ink+'" stroke-width="1.6" fill="none"/>'
        +txt(157,76,10,C.sub,'13')),
      text: { ko:'자릿수를 더해서 3의 배수인지 알아보는 마법과 뿌리가 같은 방법이랍니다!',
              en:'Same root as the trick of adding digits to check for a multiple of 3!',
              zh:'和把数位相加来判断是不是3的倍数，是同一个根呢！' } },
  ]};
};
