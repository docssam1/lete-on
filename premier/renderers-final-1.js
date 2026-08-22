(function (global) {
  "use strict";
  const figures = global.PremierFigures;
  if (!figures) throw new Error("PremierFigures가 먼저 로드되어야 합니다.");
  const INK = "#27313c", LINE = "#8d99a6", PALE = "#f2f5f7", GOLD = "#d2ad50";
  const svg = (viewBox, body) => figures.svg(viewBox, `<g stroke-linecap="round" stroke-linejoin="round">${body}</g>`, "wide-svg");
  const text = (x, y, value, extra) => `<text x="${x}" y="${y}" font-family="Pretendard, Noto Sans KR, sans-serif" ${extra || ""}>${value}</text>`;
  const circle = (x, y, r, value, fill) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill || "#fff"}" stroke="${LINE}" stroke-width="1.2"/>${value === undefined || value === "" ? "" : text(x, y + 5, value, `text-anchor="middle" font-size="14" font-weight="850" fill="${INK}"`)}`;
  const rect = (x, y, w, h, value, fill) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill || "#fff"}" stroke="${LINE}" stroke-width="1.2"/>${value === undefined || value === "" ? "" : text(x + w / 2, y + h * .67, value, `text-anchor="middle" font-size="14" font-weight="850" fill="${INK}"`)}`;

  figures.register("f1-q1", () => svg("0 0 340 80", `<rect x="28" y="10" width="284" height="58" fill="#fff" stroke="${LINE}"/>${text(170,48,"□ − 3 + 8 + □ = 9 + 8 + 2",`text-anchor="middle" font-size="20" font-weight="850" fill="${INK}"`)}`));

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
  figures.register("f1-q2", () => {
    const maps=[[[3,3,2],[2,0,0],[1,0,0]],[[3,2,0],[2,1,0],[1,0,0]]];
    return svg("0 0 440 200", maps.map((map,index)=>{const x=index*220;return `${isoMap(map,x+66,78,18)}${heightGrid(map,x+116,104,25)}${text(x+110,193,index?"둘째 상자":"첫째 상자",`text-anchor="middle" font-size="11" font-weight="850" fill="${INK}"`)}`;}).join(""));
  });

  figures.register("f1-q3", () => svg("0 0 360 95", `${[2,5,4,8].map((value,index)=>rect(30+index*42,8,32,32,value,PALE)).join("")}${text(180,78,"□□ − □ + □ = 39",`text-anchor="middle" font-size="22" font-weight="850" fill="${INK}"`)}`));

  const iconCells = [[0,0],[4,1],[2,2],[0,3],[4,4]];
  const regionBoards = [
    [[0,1,2,3,4],[0,1,2,3,4],[0,1,2,3,4],[0,1,2,3,4],[0,1,2,3,4]],
    [[0,0,0,0,0],[1,1,1,1,1],[2,2,2,2,2],[3,3,3,3,3],[4,4,4,4,4]],
    [[0,0,1,1,1],[0,0,1,2,2],[0,3,3,2,2],[4,3,3,3,2],[4,4,4,4,2]],
    [[0,0,0,1,1],[2,0,1,1,1],[2,2,2,3,3],[2,4,3,3,3],[4,4,4,4,3]]
  ];
  function regionBoard(groups, ox, oy, cell) {
    let body = "";
    for (let y=0;y<5;y+=1) for(let x=0;x<5;x+=1) {
      const g=groups[y][x], px=ox+x*cell, py=oy+y*cell;
      body += `<rect x="${px}" y="${py}" width="${cell}" height="${cell}" fill="#fff" stroke="#c4cbd2" stroke-width=".7"/>`;
      if (x===0 || groups[y][x-1]!==g) body += `<line x1="${px}" y1="${py}" x2="${px}" y2="${py+cell}" stroke="${INK}" stroke-width="1.8"/>`;
      if (y===0 || groups[y-1][x]!==g) body += `<line x1="${px}" y1="${py}" x2="${px+cell}" y2="${py}" stroke="${INK}" stroke-width="1.8"/>`;
      if (x===4) body += `<line x1="${px+cell}" y1="${py}" x2="${px+cell}" y2="${py+cell}" stroke="${INK}" stroke-width="1.8"/>`;
      if (y===4) body += `<line x1="${px}" y1="${py+cell}" x2="${px+cell}" y2="${py+cell}" stroke="${INK}" stroke-width="1.8"/>`;
    }
    iconCells.forEach(([x,y])=>{body += `<circle cx="${ox+(x+.5)*cell}" cy="${oy+(y+.5)*cell}" r="${cell*.18}" fill="${GOLD}" stroke="${INK}"/>`;});
    return body;
  }
  figures.register("f1-q5", () => svg("0 0 420 145", regionBoards.map((groups,index)=>{const ox=7+index*104;return `${text(ox+45,13,["①","②","③","④"][index],`text-anchor="middle" font-size="11" font-weight="900" fill="${INK}"`)}${regionBoard(groups,ox,22,18)}`;}).join("")));

  figures.register("f1-q6", () => {
    const pts={L:[25,90],A:[105,28],B:[105,90],C:[105,152],D:[245,28],E:[245,90],F:[245,152],R:[325,90]};
    const edges=[["L","A"],["L","B"],["L","C"],["A","B"],["B","C"],["D","E"],["E","F"],["D","R"],["E","R"],["F","R"],["A","D"],["B","E"],["C","F"],["A","E"],["B","D"],["B","F"],["C","E"]];
    return svg("0 0 350 180", `${edges.map(([a,b])=>`<line x1="${pts[a][0]}" y1="${pts[a][1]}" x2="${pts[b][0]}" y2="${pts[b][1]}" stroke="${LINE}"/>`).join("")}${Object.entries(pts).map(([name,[x,y]])=>circle(x,y,18,name==="B"?1:"",name==="B"?"#fff4cf":"#fff")).join("")}`);
  });

  figures.register("f1-q7", () => svg("0 0 310 140", `${text(155,30,"☆ × □ = 20",`text-anchor="middle" font-size="20" font-weight="850" fill="${INK}"`)}${text(155,66,"□ × △ = 40",`text-anchor="middle" font-size="20" font-weight="850" fill="${INK}"`)}${text(155,102,"△ × ☆ = 32",`text-anchor="middle" font-size="20" font-weight="850" fill="${INK}"`)}${text(155,132,"☆ = ____   □ = ____   △ = ____",`text-anchor="middle" font-size="13" fill="${INK}"`)}`));

  figures.register("f1-q8", () => svg("0 0 390 132", `${text(15,58,"A  B  D  E",`font-size="52" font-weight="950" fill="${INK}"`)}${text(15,118,"R  S  G",`font-size="52" font-weight="950" fill="#fff" stroke="${LINE}" stroke-width="1"`)}${text(318,84,"T",`font-size="60" font-weight="950" fill="#fff" stroke="${INK}" stroke-width="1.4"`)}${text(346,125,"색은?",`text-anchor="middle" font-size="11" font-weight="850" fill="${INK}"`)}`));

  function uShape(ox, oy, scale) {
    return `<path d="M${ox} ${oy}V${oy+68*scale}A${42*scale} ${42*scale} 0 0 0 ${ox+84*scale} ${oy+68*scale}V${oy}H${ox+62*scale}V${oy+66*scale}A${20*scale} ${20*scale} 0 0 1 ${ox+22*scale} ${oy+66*scale}V${oy}Z" fill="#fff" stroke="${INK}" stroke-width="1.4"/>`;
  }
  figures.register("f1-q9", () => svg("0 0 420 125", [0,1,2,3].map(index=>{const ox=8+index*104,oy=25,s=.78;let cuts="";if(index===0)cuts=`<path d="M${ox+10} ${oy+30}H${ox+55}" stroke="${INK}"/><path d="M${ox+25} ${oy+8}V${oy+78}" stroke="${INK}"/>`;if(index===1)cuts=`<path d="M${ox-4} ${oy+25}H${ox+75}" stroke="${INK}"/><path d="M${ox-4} ${oy+48}H${ox+75}" stroke="${INK}"/>`;if(index===2)cuts=`<path d="M${ox-4} ${oy+28}H${ox+75}" stroke="${INK}"/><path d="M${ox+4} ${oy+5}L${ox+72} ${oy+82}" stroke="${INK}"/>`;if(index===3)cuts=`<path d="M${ox+2} ${oy+8}L${ox+70} ${oy+76}" stroke="${INK}"/><path d="M${ox+70} ${oy+8}L${ox+2} ${oy+76}" stroke="${INK}"/>`;return `${text(ox+33,13,["①","②","③","④"][index],`text-anchor="middle" font-size="11" font-weight="900" fill="${INK}"`)}${uShape(ox,oy,s)}${cuts}`;}).join("")));

  figures.register("f1-q10", () => svg("0 0 360 85", `${text(180,35,"( □ + □ ) − ( □ + □ )",`text-anchor="middle" font-size="23" font-weight="850" fill="${INK}"`)}${text(180,70,"사용할 수:  37, 26, 20, 19",`text-anchor="middle" font-size="13" fill="${INK}"`)}`));

  figures.register("f1-q11", () => {
    const center=[180,100], seats=Array.from({length:5},(_,i)=>{const a=-Math.PI/2+i*2*Math.PI/5;return [180+78*Math.cos(a),100+78*Math.sin(a)];});
    return svg("0 0 360 205", `<circle cx="180" cy="100" r="52" fill="${PALE}" stroke="${LINE}"/>${seats.map(([x,y],i)=>rect(x-31,y-14,62,28,i===0?"재하":"",i===0?"#fff4cf":"#fff")).join("")}${text(180,200,"모두 가운데를 바라봅니다.",`text-anchor="middle" font-size="11" fill="${INK}"`)}`);
  });

  figures.register("f1-q12", () => svg("0 0 330 235", `<rect x="20" y="70" width="150" height="100" fill="none" stroke="${INK}" stroke-width="2"/><rect x="85" y="25" width="145" height="115" fill="none" stroke="${INK}" stroke-width="2"/><rect x="130" y="45" width="160" height="145" fill="none" stroke="${INK}" stroke-width="2"/><rect x="100" y="105" width="160" height="110" fill="none" stroke="${INK}" stroke-width="2"/>${[[275,70,"1"],[240,205,"1"],[100,90,"2"],[200,60,"2"],[145,80,"3"],[120,125,"3"],[145,120,"*"]].map(([x,y,v])=>text(x,y,v,`text-anchor="middle" font-size="15" font-weight="900" fill="${INK}"`)).join("")}`));

  figures.register("f1-q13", () => {
    const pts=[[180,20],[240,20],[285,65],[310,115],[285,165],[240,210],[180,210],[120,210],[75,165],[50,115],[75,65],[120,20]], center=[180,115];
    const given={0:2,4:9,6:12,8:10,10:5};
    const perimeter=pts.map((p,i)=>{const q=pts[(i+1)%12];return `<line x1="${p[0]}" y1="${p[1]}" x2="${q[0]}" y2="${q[1]}" stroke="${LINE}"/>`;}).join("");
    const diameters=Array.from({length:6},(_,i)=>`<line x1="${pts[i][0]}" y1="${pts[i][1]}" x2="${pts[i+6][0]}" y2="${pts[i+6][1]}" stroke="${LINE}"/>`).join("");
    return svg("0 0 360 235", `${perimeter}${diameters}${pts.map(([x,y],i)=>circle(x,y,16,given[i]||"",given[i]?"#fff4cf":"#fff")).join("")}${circle(center[0],center[1],17,"",PALE)}`);
  });

  figures.register("f1-q18", () => svg("0 0 420 120", `${[[10,20,82,82,"①","↘"],[125,28,66,66,"②","↗"],[225,34,54,54,"③","←"],[320,40,43,43,"④",""]].map(([x,y,w,h,label,arrow],index)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#eee8d9" stroke="${LINE}"/>${text(x+w/2,14,label,`text-anchor="middle" font-size="11" font-weight="900" fill="${INK}"`)}${index>0?text(x+w/2,y+h+17,`${index+1}번 접은 모습`, `text-anchor="middle" font-size="9.5" fill="${INK}"`):""}${arrow?text(x+w/2,y+h/2+7,arrow,`text-anchor="middle" font-size="22" font-weight="900" fill="${INK}"`):""}`).join("")}${text(158,25,"구멍 2개",`text-anchor="middle" font-size="9.5" fill="${INK}"`)}${text(252,31,"새 구멍 3개",`text-anchor="middle" font-size="9.5" fill="${INK}"`)}${text(342,37,"새 구멍 4개",`text-anchor="middle" font-size="9.5" fill="${INK}"`)}`));

  figures.register("f1-q19", () => svg("0 0 390 105", `${[[4,5,2],[3,6,9],[7,5,8],[8,6,""]].map(([a,b,c],index)=>{const x=10+index*96;return `${circle(x+22,18,14,a,PALE)}${circle(x+68,18,14,b,PALE)}<path d="M${x+22} 34L${x+45} 54L${x+68} 34" fill="none" stroke="${LINE}"/><rect x="${x+27}" y="55" width="36" height="28" rx="5" fill="#fff" stroke="${LINE}"/>${text(x+45,74,c,`text-anchor="middle" font-size="15" font-weight="850" fill="${INK}"`)}`;}).join("")}`));

  figures.register("f1-q20", () => svg("0 0 350 78", `<rect x="34" y="10" width="282" height="56" fill="#fff" stroke="${LINE}"/>${text(175,46,"( □ + 15 + 9 ) ÷ 2 ÷ 2 = 10",`text-anchor="middle" font-size="20" font-weight="850" fill="${INK}"`)}`));
})(window);
