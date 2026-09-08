import { boundaryEdges, sharedEdges, perimeterOf } from "./core.js?v=perimeter-1";
import { translation } from "./i18n.js?v=perimeter-1";

const escape = value => String(value).replace(/[&<>"']/g, char => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[char]));
const STEP = 44, X = 30, Y = 38, WIDTH = 324, HEIGHT = 358;
const coords = cells => (cells || []).map(c => Array.isArray(c) ? { x:c[0], y:c[1] } : c);
const key = c => `${c.x},${c.y}`;
const line = (a,b,attrs="") => `<line x1="${X+a[0]*STEP}" y1="${Y+a[1]*STEP}" x2="${X+b[0]*STEP}" y2="${Y+b[1]*STEP}" ${attrs}/>`;
const edgeHit = edge => {
  const horizontal=edge.from[1]===edge.to[1];
  return `<rect x="${X+Math.min(edge.from[0],edge.to[0])*STEP-(horizontal?0:14)}" y="${Y+Math.min(edge.from[1],edge.to[1])*STEP-(horizontal?14:0)}" width="${horizontal?STEP:28}" height="${horizontal?28:STEP}" fill="transparent" pointer-events="all"/>`;
};
const text = (value,x,y,attrs="") => `<text x="${x}" y="${y}" fill="#253b48" font-size="14" ${attrs}>${escape(value)}</text>`;

function board(p, cells, name, options, active) {
  const t = translation(options.lang), list = coords(cells), filled = new Set(list.map(key));
  const secondGroup = new Set((p.groups?.[1] || []).map(key));
  let result = text(name, X, options.compact?30:22, 'font-weight="700"');
  for (let y=0;y<p.size;y++) for (let x=0;x<p.size;x++) {
    const id = `${x},${y}`, selected = filled.has(id);
    const fill = selected ? active ? "#c4e6dd" : secondGroup.has(id) ? "#ead5dc" : "#dbe8ee" : "#ffffff";
    const interactive = active && options.interactive;
    result += `<rect x="${X+x*STEP}" y="${Y+y*STEP}" width="${STEP}" height="${STEP}" fill="${fill}" stroke="#ccd8de" stroke-width="1" ${interactive ? `data-cell="${id}" role="button" tabindex="${x===0&&y===0?0:-1}" aria-label="${escape(t.cell(x,y))}" aria-pressed="${selected}"` : ""}/>`;
  }
  const edges = boundaryEdges(list), marked = new Set(options.markedEdges || []);
  const canMark = options.interactive && !active && ["boundary","joined"].includes(p.domain);
  const showEdges = options.reveal || active;
  edges.forEach((edge, index) => {
    const selected = marked.has(edge.id), color = showEdges ? "#177657" : selected ? "#c24c69" : "#24616c";
    result += `<g ${canMark ? `data-edge="${escape(edge.id)}" data-edge-kind="boundary" role="button" tabindex="${index===0?0:-1}" aria-label="${escape(t.segment(index+1))}" aria-pressed="${selected}"` : ""}>`;
    result += line(edge.from,edge.to,`stroke="${color}" stroke-width="${selected||showEdges?4:3}" pointer-events="none"`);
    if (canMark) result += edgeHit(edge);
    result += "</g>";
  });
  if (p.domain === "joined") sharedEdges(p.groups).forEach((edge,index) => {
    result += `<g ${canMark ? `data-edge="${escape(edge.id)}" data-edge-kind="shared" role="button" tabindex="-1" aria-label="${escape(t.segment(edges.length+index+1))}"` : ""}>`;
    result += line(edge.from,edge.to,'stroke="#9e7886" stroke-width="2" stroke-dasharray="4 4" pointer-events="none"');
    if(canMark) result += edgeHit(edge);
    result += "</g>";
  });
  if(!options.compact){
    result += text(t.unit, X, 337);
    result += `<path d="M234 329v8m0-4h44m0-4v8" stroke="#253b48" fill="none" stroke-width="1.5"/>` + text("1",288,338);
  }
  return result;
}

export function renderProblem(p, options = {}) {
  options = { lang:"ko", reveal:false, interactive:false, ...options };
  const t = translation(options.lang), paired = ["compare","build"].includes(p.domain);
  const horizontal=paired&&options.layout==="horizontal";
  const height = horizontal ? options.compact?322:HEIGHT : paired ? HEIGHT*2 : HEIGHT;
  const width=horizontal?WIDTH*2:WIDTH;
  const title = p.domain === "build" ? t.reference : paired ? "A" : "";
  let body = board(p,p.cells,title,options,false);
  if(paired) {
    const cells = p.domain === "compare" ? p.other : options.selectedCells !== undefined ? options.selectedCells : options.reveal ? p.example : [];
    body += `<g transform="translate(${horizontal?WIDTH:0} ${horizontal?0:HEIGHT})">${board(p,cells,p.domain==="build"?t.drawing:"B",options,p.domain==="build")}</g>`;
  }
  let extra = "";
  if(p.domain === "compare" && (options.aligned || options.reveal)) {
    [p.cells,p.other].forEach((cells,index) => {
      const count = perimeterOf(cells), y=height+26+index*29;
      extra += text(index?"B":"A",X,y+4,'font-weight="700"');
      for(let i=0;i<count;i++) extra += `<rect data-unit-segment="${index}-${i}" x="${X+22+i*7}" y="${y-8}" width="7" height="12" fill="${index?"#c890a2":"#76a8ac"}" stroke="#fff" stroke-width="1"/>`;
    });
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" class="perimeter-diagram${options.compact?' compact-diagram':''}" viewBox="0 0 ${width} ${height+(extra?82:0)}" role="${options.interactive?'group':'img'}" aria-label="${escape(t.title)}" style="font-family:Malgun Gothic,Arial,sans-serif;max-width:100%;height:auto;letter-spacing:0"><style>.perimeter-diagram [role=button]{cursor:pointer}.perimeter-diagram [role=button]:focus-visible{outline:3px solid #2456c4;outline-offset:1px}.compact-diagram text{font-size:24px}</style>${body}${extra}</svg>`;
}
