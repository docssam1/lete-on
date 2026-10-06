#!/usr/bin/env node
/* assets/images/story/N-01.svg — 개념 노트 맨 위 '양 ↔ 조약돌 1:1' 도식을 comic-helpers 의 셀셰이딩 소품으로 생성.
   (예전 도식은 윤곽선 원 5개 양 + 글자 "1 : 1" 이었다 — 글꼴 대신 그린 짝 끈과 화살표로.) */
'use strict';
const fs=require('fs'),path=require('path');
const H=require('./comic-helpers.js');
const {C,sheep2,pebble,rope}=H;
let s='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 280" width="640" height="280" role="img" aria-hidden="true">'
 +'<rect width="640" height="280" rx="18" fill="#F7F5F0"/>'
 +'<path d="M 0 262 Q 160 246 320 258 T 640 254 L 640 280 L 0 280 Z" fill="'+C.grass+'" opacity=".55"/>';
[56,138,220].forEach(y=>{
  s+='<ellipse cx="146" cy="'+(y+38)+'" rx="58" ry="8" fill="'+C.grass+'" opacity=".6"/>';
  s+='<g transform="translate(140 '+y+') scale(1.22)">'+sheep2(0,0,1,false)+'</g>';
  s+='<g transform="translate(318 '+(y+4)+') scale(3.1)">'+rope(-30,0,30,0,C.gold,-2)+'</g>';
  s+='<g transform="translate(520 '+(y+10)+') scale(3.2)">'+pebble(0,0,6)+'</g>';
});
s+='</svg>\n';
fs.writeFileSync(path.join(__dirname,'../assets/images/story/N-01.svg'),s);
console.log('assets/images/story/N-01.svg',s.length,'bytes');
