// 기존 풀밭 모형과 제공된 먹이 관계를 구분해서 읽는 수업·교재 공용 자료.
import{CHANGES,meadowRow}from'../scenes/meadow-model.js';
export const ECOLOGY_MODEL_NOTICE='3년 뒤 수는 경향 비교를 위해 미리 정한 연습 값이에요. 실제 생물 수나 생존 기간을 계산한 예측이 아니에요. 실제 생태계에는 다른 먹이 관계와 물·빛·온도 등 여러 조건이 있어요.';
export const ECOLOGY_MEADOW_ROWS=CHANGES.map(meadowRow);
export const ECOLOGY_FOOD_EDGES=[['풀','메뚜기'],['풀','애벌레'],['메뚜기','개구리'],['애벌레','작은 새'],['개구리','뱀'],['작은 새','뱀']];
export const ECOLOGY_FOOD_CHAINS=[['풀','메뚜기','개구리','뱀'],['풀','애벌레','작은 새','뱀']];
export const ECOLOGY_FOOD_NOTICE='제공한 여섯 생물의 연습 관계예요. 화살표는 먹히는 쪽 → 먹는 쪽이에요. 이름표 하나가 한 마리나 실제 개체 수를 뜻하지 않아요.';
export const ECOLOGY_SOURCES={web:'https://www.noaa.gov/education/resource-collections/marine-life/aquatic-food-webs',ecosystem:'https://www.nps.gov/yell/learn/nature/cyclesprocesses.htm'};
export function ecologyMeadowComparison(rows){
 const valid=(rows||[]).filter(r=>CHANGES.includes(r.change)&&['grass','rabbit','fox'].every(k=>Number.isFinite(r[k])&&r[k]>=0));
 if(!valid.length)return '아직 풀밭 모형 기록이 없어요. 「그대로」와 「여우가 사라짐」을 각각 살핀 뒤 비교해요.';
 const latest=[...new Map(valid.map(r=>[r.change,r])).values()],base=latest.find(r=>r.change==='그대로');
 const describe=latest.map(r=>`${r.change}: 풀 ${r.grass}·토끼 ${r.rabbit}·여우 ${r.fox}`).join(', ');
 const compared=base?latest.filter(r=>r!==base).map(r=>`${r.change}은 그대로와 비교해 `+[['grass','풀'],['rabbit','토끼'],['fox','여우']].map(([k,n])=>`${n} ${r[k]>base[k]?'늘어남':r[k]<base[k]?'줄어듦':'같음'}`).join('·')).join('; '):'';
 return `내 모형 기록: ${describe}. ${base?(compared||'다른 조건도 기록해 그대로와 비교해요.'):'비교 기준인 「그대로」 기록도 더 살펴요.'} 같은 조건은 마지막 기록을 읽어요. ${ECOLOGY_MODEL_NOTICE}`;
}
// 생물 그림을 흉내 내지 않고 이름 카드와 관계만 표현한다.
export function ecologyFoodWeb(portrait=false){
 const nodes=portrait?[['풀',180,40],['메뚜기',80,145],['애벌레',280,145],['개구리',80,250],['작은 새',280,250],['뱀',180,355]]:[['풀',80,140],['메뚜기',285,65],['애벌레',285,215],['개구리',490,65],['작은 새',490,215],['뱀',700,140]],pos=Object.fromEntries(nodes.map(([n,x,y])=>[n,[x,y]]));
 return `<svg xmlns="http://www.w3.org/2000/svg" class="ecology-food-${portrait?'portrait':'desktop'}" viewBox="${portrait?'0 0 360 400':'0 0 780 280'}" role="img" aria-label="연습 먹이그물. 풀에서 메뚜기와 애벌레로, 메뚜기에서 개구리로, 애벌레에서 작은 새로, 개구리와 작은 새에서 뱀으로 화살표가 이어집니다."><defs><marker id="ecology-food-arrow-${portrait?'p':'h'}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 10 5 0 10Z" fill="#2456c4"/></marker></defs>${ECOLOGY_FOOD_EDGES.map(([a,b])=>{const[x,y]=pos[a],[u,v]=pos[b];return `<path data-food-edge="${a}→${b}" d="${portrait?`M${x} ${y+29} L${u} ${v-33}`:`M${x+58} ${y} L${u-64} ${v}`}" fill="none" stroke="#2456c4" stroke-width="3" marker-end="url(#ecology-food-arrow-${portrait?'p':'h'})"/>`;}).join('')}${nodes.map(([n,x,y])=>`<g data-food-node="${n}"><rect x="${x-57}" y="${y-27}" width="114" height="54" rx="8" fill="${n==='풀'?'#edf6ef':'#fff'}" stroke="#566274" stroke-width="2"/><text x="${x}" y="${y+8}" text-anchor="middle" font-family="Pretendard,sans-serif" font-size="23" font-weight="700" fill="#182230">${n}</text></g>`).join('')}</svg>`;
}
