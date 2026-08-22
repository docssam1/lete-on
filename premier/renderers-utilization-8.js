(function (global) {
  "use strict";
  const figures = global.PremierFigures;
  if (!figures) throw new Error("PremierFigures가 먼저 로드되어야 합니다.");
  const INK = "#27313c", LINE = "#8d99a6", PALE = "#f2f5f7", GOLD = "#d2ad50";
  const svg = (viewBox, body) => figures.svg(viewBox, `<g stroke-linecap="round" stroke-linejoin="round">${body}</g>`, "wide-svg");
  const text = (x, y, value, extra) => `<text x="${x}" y="${y}" font-family="Pretendard, Noto Sans KR, sans-serif" ${extra || ""}>${value}</text>`;
  const rect = (x, y, w, h, value, fill) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill || "#fff"}" stroke="${LINE}" stroke-width="1.2"/>${value === undefined || value === "" ? "" : text(x + w / 2, y + h * .67, value, `text-anchor="middle" font-size="15" font-weight="800" fill="${INK}"`)}`;
  const circle = (x, y, r, value, fill) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill || "#fff"}" stroke="${LINE}" stroke-width="1.2"/>${value === undefined || value === "" ? "" : text(x, y + 5, value, `text-anchor="middle" font-size="14" font-weight="800" fill="${INK}"`)}`;

  figures.register("u8-q2", () => svg("0 0 320 82", `<rect x="28" y="8" width="264" height="66" fill="#fff" stroke="${LINE}"/>${text(160,35,"9 + □ + □",`text-anchor="middle" font-size="19" font-weight="850" fill="${INK}"`)}${text(160,63,"18 − □",`text-anchor="middle" font-size="19" font-weight="850" fill="${INK}"`)}`));
  figures.register("u8-q3", () => svg("0 0 320 72", `<rect x="30" y="8" width="260" height="56" fill="#fff" stroke="${LINE}"/>${text(160,44,"6□  <  67,      □5  >  27",`text-anchor="middle" font-size="22" font-weight="850" fill="${INK}"`)}`));
  figures.register("u8-q5", () => svg("0 0 360 155", `<rect x="25" y="15" width="310" height="118" fill="#fff" stroke="${LINE}"/><line x1="180" y1="5" x2="180" y2="143" stroke="${INK}" stroke-width="1.5" stroke-dasharray="5 4"/>${[[62,37],[96,101],[180,52],[180,109],[222,36],[264,67],[232,112],[312,102]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="6" fill="#66717d"/>`).join("")}${text(180,153,"거울",`text-anchor="middle" font-size="11" fill="${INK}"`)}`));

  figures.register("u8-q7", () => svg("0 0 390 112", `${[[10,20,92,72,"①","→"],[128,28,62,64,"②","↑"],[220,35,48,48,"③","↗"],[302,39,55,43,"구멍",""]].map(([x,y,w,h,label,arrow])=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#eee8d9" stroke="${LINE}"/>${text(x+w/2,y-4,label,`text-anchor="middle" font-size="10" font-weight="800" fill="${INK}"`)}${arrow?text(x+w/2,y+h/2+6,arrow,`text-anchor="middle" font-size="22" font-weight="900" fill="${INK}"`):`<circle cx="${x+w-10}" cy="${y+10}" r="4" fill="#fff" stroke="${INK}"/>`}`).join("")}<path d="M56 20V92M128 60H190M220 35L268 83" stroke="${LINE}" stroke-dasharray="4 3"/>`));

  figures.register("u8-q8", () => svg("0 0 250 190", `${Array.from({length:7},(_,index)=>{const angle=-Math.PI/2+index*2*Math.PI/7;const x=125+72*Math.cos(angle),y=92+72*Math.sin(angle);return circle(x,y,13,"",index===0?"#fff4cf":"#fff");}).join("")}${text(125,181,"바로 양옆 두 사람은 제외",`text-anchor="middle" font-size="11" fill="${INK}"`)}`));

  figures.register("u8-q9", () => svg("0 0 310 155", `<path d="M25 125H285V25H25V125 M25 75H198 M112 75V125 M198 25V125" fill="none" stroke="${INK}" stroke-width="1.6"/>${circle(25,125,4,"",INK)}${circle(285,25,4,"",INK)}${text(15,146,"집",`font-size="12" font-weight="800" fill="${INK}"`)}${text(270,18,"학교",`font-size="12" font-weight="800" fill="${INK}"`)}`));

  figures.register("u8-q10", () => svg("0 0 260 195", `<path d="M45 65H205V25H95V65H45V145H95V175H175V145H205V65 M95 65V145M135 65V145M95 105H205M135 105V145M175 25V65M45 145H175" fill="none" stroke="${INK}" stroke-width="1.5"/>`));

  figures.register("u8-q11", () => {
    let body = "";
    for (let row = 1; row <= 4; row += 1) for (let column = 0; column <= row; column += 1) {
      body += `<circle cx="${190 + (column - row / 2) * 45}" cy="${20 + row * 31}" r="3.4" fill="${INK}"/>`;
    }
    return svg("0 0 380 175", body + text(190,166,"점 사이의 간격은 모두 같습니다.",`text-anchor="middle" font-size="11" fill="${INK}"`));
  });

  figures.register("u8-q13", () => svg("0 0 250 155", `<circle cx="125" cy="78" r="65" fill="#fff" stroke="${LINE}"/><circle cx="125" cy="78" r="44" fill="#fff" stroke="${LINE}"/><circle cx="125" cy="78" r="23" fill="#d9dde1" stroke="${LINE}"/>${text(125,85,"10",`text-anchor="middle" font-size="17" font-weight="900" fill="${INK}"`)}${text(125,116,"5",`text-anchor="middle" font-size="15" font-weight="900" fill="${INK}"`)}${text(125,139,"1",`text-anchor="middle" font-size="15" font-weight="900" fill="${INK}"`)}`));

  figures.register("u8-q15", () => svg("0 0 390 105", `${[[4,5,2],[3,6,9],[7,5,8],[8,6,""]].map(([a,b,c],index)=>{const x=10+index*96;return `${circle(x+22,18,14,a,PALE)}${circle(x+68,18,14,b,PALE)}<path d="M${x+22} 34L${x+45} 54L${x+68} 34" fill="none" stroke="${LINE}"/><rect x="${x+27}" y="55" width="36" height="28" rx="5" fill="#fff" stroke="${LINE}"/>${text(x+45,74,c,`text-anchor="middle" font-size="15" font-weight="850" fill="${INK}"`)}`;}).join("")}`));

  function cube(x, y, size) {
    const h = size * .52;
    return `<polygon points="${x},${y} ${x+size},${y-h} ${x+2*size},${y} ${x+size},${y+h}" fill="#f0dfbd" stroke="${LINE}"/><polygon points="${x},${y} ${x+size},${y+h} ${x+size},${y+h+size} ${x},${y+size}" fill="#e3c894" stroke="${LINE}"/><polygon points="${x+size},${y+h} ${x+2*size},${y} ${x+2*size},${y+size} ${x+size},${y+h+size}" fill="#d4b476" stroke="${LINE}"/>`;
  }
  function isoMap(map, offsetX, offsetY, size) {
    let body = "";
    for (let y=map.length-1;y>=0;y-=1) for(let x=0;x<map[y].length;x+=1) for(let z=0;z<map[y][x];z+=1) body += cube(offsetX+(x-y)*size,offsetY+(x+y)*size*.52-z*size,size);
    return body;
  }
  function heightGrid(map, offsetX, offsetY, cell) {
    return map.map((row,y)=>row.map((value,x)=>rect(offsetX+x*cell,offsetY+y*cell,cell,cell,value||"",value?"#fff":"#f3f5f7")).join("")).join("");
  }
  figures.register("u8-q16", () => { const map=[[1,1,1,1],[2,2,2,2],[3,2,1,1]]; return svg("0 0 420 190", `${isoMap(map,90,82,20)}${heightGrid(map,285,45,29)}${text(328,145,"위에서 본 높이",`text-anchor="middle" font-size="11" fill="${INK}"`)}${text(328,166,"밑면도 칠합니다.",`text-anchor="middle" font-size="11" font-weight="800" fill="${INK}"`)}`); });

  figures.register("u8-q17", () => { const map=[[0,3,0],[0,2,0],[1,1,1]]; return svg("0 0 410 175", `${heightGrid(map,10,38,34)}${text(61,155,"위·높이",`text-anchor="middle" font-size="11" fill="${INK}"`)}${heightGrid([[1,3,1]],150,72,34)}${text(201,125,"앞",`text-anchor="middle" font-size="11" fill="${INK}"`)}${heightGrid([[3,2,1]],285,72,34)}${text(336,125,"오른쪽 옆",`text-anchor="middle" font-size="11" fill="${INK}"`)}`); });

  figures.register("u8-q18", () => svg("0 0 390 118", `${[0,1,2,3].map(index=>{const x=12+index*96;const label=text(x+36,14,["①","②","③","④"][index],`text-anchor="middle" font-size="11" font-weight="900" fill="${INK}"`);const frame=`<rect x="${x}" y="24" width="72" height="72" fill="#fff" stroke="${INK}"/>`;const cuts=index===1?`<path d="M${x} 24L${x+72} 96M${x+72} 24L${x} 96" stroke="${INK}"/>`:index===0?`<path d="M${x+25} 24V96M${x+49} 24V96" stroke="${INK}"/>`:index===2?`<path d="M${x} 60H${x+72}M${x+18} 24L${x+54} 96" stroke="${INK}"/>`:`<path d="M${x+36} 24V96M${x} 52H${x+36}M${x+36} 72H${x+72}" stroke="${INK}"/>`;return label+frame+cuts;}).join("")}`));

  figures.register("u8-q19", () => {
    const board=[[2,1,3,2,1],[4,3,1,2,4],[2,2,3,4,5],[1,5,3,4,2],[4,4,2,3,1]];
    const paperX=240, paperY=40, cell=30;
    const holes=[[0,0],[2,1],[1,2]].map(([x,y])=>circle(paperX+(x+.5)*cell,paperY+(y+.5)*cell,9,"","#fff")).join("");
    return svg("0 0 390 185", `${heightGrid(board,12,20,30)}<rect x="${paperX}" y="${paperY}" width="90" height="90" fill="#f4f1e8" stroke="${INK}"/>${holes}${text(87,180,"숫자판",`text-anchor="middle" font-size="11" fill="${INK}"`)}${text(285,150,"돌리거나 뒤집지 않습니다.",`text-anchor="middle" font-size="10.5" fill="${INK}"`)}${text(285,180,"구멍 종이",`text-anchor="middle" font-size="11" fill="${INK}"`)}`);
  });

  function trianglePuzzle(offsetX, center) {
    const pts=[[offsetX+80,18,5],[offsetX+24,126,6],[offsetX+136,126,7],[offsetX+50,72,""],[offsetX+110,72,""],[offsetX+80,79,center],[offsetX+80,126,""]];
    const lines=[[0,1],[0,2],[1,2],[0,5],[3,5],[4,5],[1,5],[2,5],[1,6],[2,6]];
    return `${lines.map(([a,b])=>`<line x1="${pts[a][0]}" y1="${pts[a][1]}" x2="${pts[b][0]}" y2="${pts[b][1]}" stroke="${LINE}"/>`).join("")}${pts.map(([x,y,v])=>circle(x,y,16,v,v===""?"#fff6d8":"#fff")).join("")}`;
  }
  figures.register("u8-q20", () => svg("0 0 390 175", `${trianglePuzzle(0,4)}${trianglePuzzle(190,1)}${text(80,169,"첫째",`text-anchor="middle" font-size="11" font-weight="800" fill="${INK}"`)}${text(270,169,"둘째",`text-anchor="middle" font-size="11" font-weight="800" fill="${INK}"`)}`));
})(window);
