const image=kind=>`../assets/book/c22-s42-u04-photo-model-${kind}-v2.webp`;
const alt=wall=>`투명한 통의 점토 지형과 모형 집 다섯 채${wall?' 앞에 이어 세운 벽':''}`;
const scene=wall=>`<div class="ed-photo"><img src="${image(wall?'wall':'no-wall')}" alt="${alt(wall)}" loading="eager"><p class="ed-photo-note">모형의 준비 모습을 설명하는 장면이에요. 물높이·집 이름·땅 높이${wall?'·벽 높이':''}는 본문의 표와 조건으로 읽어요. 사진에서 길이나 관찰 결과를 재지 않아요.</p><small class="ed-photo-credit">실제 사진 아님</small></div>`;
export function withClimateVisuals(wb){
 const pages=rows=>rows?.map(p=>({...p,blocks:p.blocks.map(b=>{
  if(b.type!=='gallery'||!b.items.some(x=>x.src.includes('c22-s42-u04-sea-')))return b;
  return{...b,numbered:false,cols:2,credit:'설명 장면 · 실제 사진 아님. 수치와 비교 결과는 본문 표에서 읽어요.',items:p.title==='해안 마을 모형으로 실험해요'?[{src:image('no-wall'),alt:alt(false),cap:'벽이 없는 모형 준비 모습. 집의 이름과 높이는 표에서 확인해요.'},{src:image('wall'),alt:alt(true),cap:'벽을 이어 세운 모형 준비 모습. 실제 길이·눈금 측정 장면은 아니에요.'}]:[{src:image('wall'),alt:alt(true),cap:'모형의 벽을 설명하는 장면. 문제에서 정한 벽 높이는3.5 cm예요.'},{src:'../assets/book/c22-s42-u04-photo-seawall.webp',alt:'해안의 콘크리트 방파제와 파도를 설명하는 장면',cap:'해안 방파제의 설명 장면. 특정 장소의 실제 관측 사진은 아니에요.'}]};
 })}));
 return{...wb,figures:{...wb.figures,hero:scene(false),start:scene(false)},pages:pages(wb.pages),teacherStudentPages:pages(wb.teacherStudentPages)};
}
export const climateTemperatureFigure=`<div class="climate-temperature-chart"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 760 360" role="img" aria-label="전국 연평균 기온. 0도부터 같은 눈금. 1991~2020년 평년12.5도, 2024년14.5도. 차이는2.0도." font-family="Pretendard, sans-serif">
<rect width="760" height="360" fill="#fff"/>
<text x="32" y="31" font-size="26" font-weight="700" fill="#2a241c">전국 연평균 기온</text>
<text x="47" y="54" font-size="18" fill="#7a6f5c">℃</text>
<line x1="90" y1="60" x2="90" y2="270" stroke="#c9bda2"/>
<line x1="90" y1="270" x2="690" y2="270" stroke="#7a6f5c"/>
<line x1="90" y1="217.5" x2="690" y2="217.5" stroke="#e2d9c6"/><line x1="90" y1="165" x2="690" y2="165" stroke="#e2d9c6"/><line x1="90" y1="112.5" x2="690" y2="112.5" stroke="#e2d9c6"/><line x1="90" y1="60" x2="690" y2="60" stroke="#e2d9c6"/>
<text x="72" y="276" text-anchor="end" font-size="18" fill="#7a6f5c">0</text><text x="72" y="223.5" text-anchor="end" font-size="18" fill="#7a6f5c">4</text><text x="72" y="171" text-anchor="end" font-size="18" fill="#7a6f5c">8</text><text x="72" y="118.5" text-anchor="end" font-size="18" fill="#7a6f5c">12</text><text x="72" y="66" text-anchor="end" font-size="18" fill="#7a6f5c">16</text>
<rect x="170" y="105.9375" width="130" height="164.0625" fill="#b7cbb7"/><rect x="410" y="79.6875" width="130" height="190.3125" fill="#2f6b4a"/>
<text x="235" y="96" text-anchor="middle" font-size="26" font-weight="700" fill="#2a241c">12.5 ℃</text><text x="475" y="70" text-anchor="middle" font-size="26" font-weight="700" fill="#2a241c">14.5 ℃</text>
<text x="235" y="303" text-anchor="middle" font-size="21" fill="#2a241c">평년(1991~2020)</text><text x="475" y="303" text-anchor="middle" font-size="21" fill="#2a241c">2024년</text>
<text x="590" y="135" font-size="23" font-weight="700" fill="#2f6b4a">+2.0 ℃</text>
<text x="94" y="341" font-size="18" fill="#7a6f5c">0 ℃부터 같은 눈금으로 표시했어요.</text></svg><p class="ed-photo-note">자료: 기상청 「2024년 연 기후특성」(2025-01-09). 평년은30년 평균,2024년은 한 해 평균이에요.</p></div>`;
