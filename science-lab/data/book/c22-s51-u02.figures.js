// 지필드 창작 모식도. 굵은 화살표는 빛의 진행 방향이며 각도·거리의 정량 법칙을 평가하지 않는다.
export const rayGeometry = d => {
 const m=d.replace(/\s+([LHV])/g,'$1').match(/^M([\d.]+) ([\d.]+)(?:L([\d.]+) ([\d.]+)|H([\d.]+)|V([\d.]+))$/);
 if(!m) throw Error('빛 경로는 검수 가능한 두 점으로 정의해야 합니다: '+d);
 const x1=Number(m[1]),y1=Number(m[2]),x2=m[3]?Number(m[3]):m[5]?Number(m[5]):x1,y2=m[4]?Number(m[4]):m[6]?Number(m[6]):y1;
 const size=Math.hypot(x2-x1,y2-y1),ux=(x2-x1)/size,uy=(y2-y1)/size;
 return {x1,y1,x2,y2,head:`${x2},${y2} ${x2-9*ux+4*uy},${y2-9*uy-4*ux} ${x2-9*ux-4*uy},${y2-9*uy+4*ux}`};
};
const svg=(label,body,h=170)=>{
 const drawn=body.replace(/<path class="ray" d="([^"]+)"\/>/g,(_,d)=>{const r=rayGeometry(d);return `<path class="ray" d="${d}"/><polygon fill="#2456c4" points="${r.head}"/>`;});
 return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 ${h}" role="img" aria-label="${label}"><style>text{font:16px sans-serif;fill:#182230}.ray{fill:none;stroke:#2456c4;stroke-width:3}.edge{fill:none;stroke:#52637c;stroke-width:3}</style>${drawn}</svg>`;
};
export const art={
 seeing:svg('광원에서물체를거쳐눈으로',`<rect x="15" y="25" width="84" height="58" rx="4" fill="#edf2fa" stroke="#52637c"/><text x="26" y="61">켜진 전등</text><path class="ray" d="M99 65L250 120"/><path d="M215 120 L280 120 L297 139 L232 139Z" fill="#fff" stroke="#52637c" stroke-width="2"/><text x="234" y="160">책</text><path class="ray" d="M250 120L399 51"/><path class="edge" d="M399 51 Q427 22 455 51 Q427 80 399 51Z"/><circle cx="427" cy="51" r="9" fill="#52637c"/><text x="417" y="94">눈</text>`),
 straight:svg('구멍이일직선인경우와어긋난경우',`<text x="8" y="22">가</text><text x="8" y="105">나</text>${[0,1].map((r)=>{let y=47+r*83;return `<rect x="32" y="${y-14}" width="51" height="28" fill="#edf2fa" stroke="#52637c"/><text x="38" y="${y+6}">전등</text>${[150,240,330].map((x,i)=>`<path class="edge" d="M${x} ${y-28}v${r&&i===1?30:20}m0 16v${r&&i===1?10:20}"/>`).join('')}<path class="ray" d="M86 ${y}H${r?236:403}"/><text x="412" y="${y+6}">관찰 구멍</text>`;}).join('')}`,172),
 reflection:svg('거울에서방향이달라진빛',`<text x="15" y="74">빛 출발</text><path class="ray" d="M95 70H285"/><path class="edge" d="M250 105L320 35"/><path class="ray" d="M285 70V16"/><text x="334" y="102">평면거울</text><text x="310" y="27">진행 방향</text><path stroke="#8a9bb5" d="M253 108l8 8m1-17l8 8m1-17l8 8m1-17l8 8m1-17l8 8m1-17l8 8m1-17l8 8"/>`,135),
 refraction:svg('공기와물의경계를지나는빛',`<rect x="30" y="75" width="440" height="88" fill="#edf5fb"/><path d="M30 75H470" stroke="#52637c" stroke-width="2"/><text x="382" y="51">공기</text><text x="398" y="142">물</text><path class="ray" d="M85 18L235 75"/><path class="ray" d="M235 75L285 153"/><text x="319" y="95">경계</text>`,175),
 periscope:svg('두거울을이용한빛의경로',`<path d="M65 15H235V200H395M65 60H175V245H395" fill="none" stroke="#8a9bb5" stroke-width="2"/><path class="edge" d="M166 22L218 74M166 195L218 247"/><path class="ray" d="M15 48H192"/><path class="ray" d="M192 48V221"/><path class="ray" d="M192 221H420"/><text x="10" y="92">물체 쪽</text><text x="340" y="205">눈 쪽</text><text x="250" y="85">위 거울</text><text x="250" y="258">아래 거울</text>`,270),
 lenses:svg('가운데두께가다른두렌즈',`<path d="M120 20Q170 85 120 150Q70 85 120 20Z" fill="#edf5fb" stroke="#52637c" stroke-width="2"/><path d="M300 20Q330 85 300 150H355Q325 85 355 20Z" fill="#edf5fb" stroke="#52637c" stroke-width="2"/><text x="87" y="178">볼록 렌즈</text><text x="292" y="178">오목 렌즈</text>`,190),
 mirrorTask:svg('경로를완성할거울과시작빛',`<text x="15" y="65">출발</text><path class="ray" d="M70 60H260"/><path class="edge" d="M220 100L300 20"/><text x="322" y="105">거울</text><text x="70" y="150">화살표 끝에서 이어지는 경로를 그려요.</text>`,170)
};
