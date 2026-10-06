import { photo } from './workbook-photos.js?v=1';
// Separate teacher material. This renderer never reads or receives learner records.
const link = (url, label) =>
  `<a href="${url}" target="_blank" rel="noopener noreferrer">${label}</a>`;

const page = (number, title, deck, body) => `
  <section class="workbook-page workbook-teacher-page" data-page="${number}" aria-labelledby="wb-${number}-title">
    <header class="wb-page-head">
      <p class="wb-kicker">교사용 지도자료</p>
      <h2 id="wb-${number}-title">${title}</h2>
      <p class="wb-deck">${deck}</p>
    </header>
    <div class="wb-page-body">${body}</div>
    <footer class="wb-page-foot"><span>GFIELD SCIENCE LAB · 전류</span><span>${number}</span></footer>
  </section>`;

/** Render the three teacher pages independently of the student workbook. */
export function renderTeacherPages() {
  return [
    page('T1', '관찰을 설명으로 잇는 수업', '예상 → 연결과 관찰 → 기록 → 나의 설명', `
      <div class="wb-teacher-photo-strip">${photo('stand-off', '완성품으로 질문을 열어요.')}${photo('empty-kit', '조립 중 전지를 빼 둡니다.')}</div>
      <section class="wb-section">
        <h3>이번 수업의 두 목표</h3>
        <ol class="wb-check-list">
          <li>전지의 직렬·병렬 연결을 구별하고, 밝기와 전지 제거 관찰로 차이를 설명한다.</li>
          <li>스위치가 고르는 전류의 길과 전지 개수를 연결해 스탠드의 밝기 조절을 설명한다.</li>
        </ol>
      </section>
      <section class="wb-section">
        <h3>20단계와 학생 교재</h3>
        <table class="wb-table wb-teacher-table">
          <thead><tr><th scope="col">화면 단계</th><th scope="col">함께 하는 활동</th><th scope="col">학생 쪽</th></tr></thead>
          <tbody>
            <tr><td>1–3</td><td>목표 · 안전 · 예상</td><td>1</td></tr>
            <tr><td>4</td><td>한 개 · 직렬 · 병렬 밝기 비교</td><td>2</td></tr>
            <tr><td>4</td><td>직렬·병렬에서 전지 하나 제거</td><td>3</td></tr>
            <tr><td>5–8</td><td>부품 · 종이 · 소켓 · 스위치</td><td>4</td></tr>
            <tr><td>9–14</td><td>다섯 연결 확인 · 판 조립</td><td>5</td></tr>
            <tr><td>15–16</td><td>세 스위치 위치 실험 · 기록</td><td>6</td></tr>
            <tr><td>17–19</td><td>개념 · 생각 확인 · 스탠드 설명</td><td>7</td></tr>
            <tr><td>20 · 읽을거리</td><td>돌아보기 · 생활과 역사 읽기</td><td>8</td></tr>
          </tbody>
        </table>
      </section>
      <section class="wb-section">
        <h3>준비와 안전</h3>
        <p>같은 종류·상태의 전지와 같은 전구를 비교한다. 실물은 보호자가 전지·전구 규격과 연결을 확인한다. 조립 중에는 전지를 빼 둔다. 병렬 비교는 화면으로 진행한다.</p>
        <p class="wb-note">전지나 전선이 뜨거우면 멈추고 만지지 않은 채 어른에게 알린다. 전지 제거는 보호자가 확인한다.</p><p class="wb-small">전지의 두 극을 전구 없이 직접 잇지 않는다. 콘센트·충전용 배터리는 사용하지 않는다.</p>
      </section>
      <section class="wb-section">
        <h3>관찰을 여는 두 발문</h3>
        <p>“전지 수가 같아도 밝기가 달라질까요? 어떤 조건을 같게 해야 할까요?”</p>
        <p>“전지 하나를 빼면, 전구를 지나 돌아오는 길이 남아 있을까요?”</p>
      </section>
      <nav class="wb-page-links" aria-label="수업 화면 연결">
        <button type="button" data-workbook-step="1">안전 확인하기</button>
        <button type="button" data-workbook-step="3">전지 연결 비교하기</button>
      </nav>
    `),
    page('T2', '기대 관찰과 설명의 예', '학생의 기록을 먼저 읽고, 실제로 본 결과와 그 이유를 함께 확인합니다.', `
      <div class="wb-three-col wb-teacher-reference">${photo('single-cell', '한 개')}${photo('series-cells', '직렬')}${photo('parallel-cells', '병렬')}</div>
      <p class="wb-small">원본 실사 사진 · 노란 빛은 촬영 자료의 시각 효과이며 측정값이 아닙니다. 학생에게는 비교 관찰을 마친 뒤 제시합니다.</p>
      <section class="wb-section">
        <h3>다섯 가지 전지 비교 · 학생 2–3쪽</h3>
        <p class="wb-small">같은 종류·상태의 전지, 같은 전구를 사용하고 전구의 사용 전압이 맞는 조건이다. 화면 밝기는 비교를 위한 모형이다.</p>
        <table class="wb-table wb-teacher-table">
          <thead><tr><th scope="col">연결</th><th scope="col">기대 관찰과 이유</th></tr></thead>
          <tbody>
            <tr><td>전지 한 개</td><td>닫힌 길에서 켜진다. 다른 연결의 비교 기준이다.</td></tr>
            <tr><td>두 개 직렬</td><td>한 개보다 밝다. 서로 다른 극을 이어 전압이 더해진다.</td></tr>
            <tr><td>두 개 병렬</td><td>한 개와 밝기가 비슷하다. 전압은 한 개일 때와 비슷하다.</td></tr>
            <tr><td>직렬에서 하나 제거</td><td>제거한 자리가 끊겨 불이 꺼진다.</td></tr>
            <tr><td>병렬에서 하나 제거</td><td>남은 전지와 전구의 닫힌 길이 있어 계속 켜진다.</td></tr>
          </tbody>
        </table>
      </section>
      <section class="wb-section">
        <h3>스위치 세 위치 · 학생 6쪽</h3>
        <table class="wb-table wb-teacher-table">
          <thead><tr><th scope="col">위치</th><th scope="col">전구를 지나는 길</th><th scope="col">기대 밝기</th></tr></thead>
          <tbody>
            <tr><td>가운데</td><td>스위치에서 끊김</td><td>꺼짐</td></tr>
            <tr><td>1단</td><td>전지 한 개로 닫힌 길</td><td>2단보다 어두움</td></tr>
            <tr><td>2단</td><td>전지 두 개 직렬로 닫힌 길</td><td>1단보다 밝음</td></tr>
          </tbody>
        </table>
      </section>
      <section class="wb-section">
        <h3>생각 확인 해설 · 학생 7쪽 자체 문항</h3>
        <ol>
          <li><strong>직렬에서 전지 하나 제거:</strong> 전구가 꺼진다. 빈자리를 다른 선으로 잇지 않으면 회로가 열려 전류가 흐르지 않는다.</li>
          <li><strong>같은 새 전지 두 개 병렬:</strong> 같은 전구는 한 개일 때와 밝기가 비슷하다. 같은 극끼리 연결해 전압이 더해지지 않기 때문이다.</li>
          <li><strong>스위치 가운데:</strong> 스위치가 길을 끊으므로 전구를 지나는 닫힌 회로가 없어 불이 꺼진다.</li>
        </ol>
      </section>
      <p class="wb-note">실물 결과가 다르면 관찰을 그대로 남긴다. 전지를 뺀 뒤 보호자와 극·접점·느슨한 선·전지 상태·전구 규격을 확인하고, 바꾼 조건과 다시 본 결과를 기록한다. 뜨거우면 T1의 안내를 따른다.</p>
      <nav class="wb-page-links" aria-label="관찰 화면 연결">
        <button type="button" data-workbook-step="14">스위치 실험 보기</button>
        <button type="button" data-workbook-step="16">개념 다시 보기</button>
      </nav>
    `),
    page('T3', '설명을 듣고 다음 질문 고르기', '결과를 맞혔는지와 함께, 어떤 관찰을 근거로 설명하는지 살펴봅니다.', `
      <section class="wb-section">
        <h3>두 목표의 관찰 증거</h3>
        <table class="wb-table wb-teacher-table">
          <thead><tr><th scope="col">목표</th><th scope="col">충분한 설명에서 찾을 증거</th><th scope="col">더 살펴볼 때</th></tr></thead>
          <tbody>
            <tr><td>직렬·병렬 차이<br>학생 2–3·7쪽</td><td>극과 연결을 구별하고, 밝기 비교와 하나 제거 후 남은 길을 근거로 설명한다.</td><td>“두 개라 더 밝다”만 말하면 같은 전지 수의 두 연결을 비교한다.</td></tr>
            <tr><td>밝기 조절 원리<br>학생 5–7쪽</td><td>가운데는 열린 길, 1단은 한 개, 2단은 두 개 직렬임을 선을 짚어 설명한다.</td><td>밝기만 외우면 각 위치에서 전구를 지나 돌아오는 길을 찾는다.</td></tr>
          </tbody>
        </table>
        <p class="wb-small">관찰 출처가 화면인지 실물인지 확인한다. 예상이 틀렸어도 직접 본 결과를 근거로 생각을 바꾼 설명을 인정한다.</p>
      </section>
      <section class="wb-section">
        <h3>다시 설명해 볼 질문</h3>
        <p>“어떤 관찰 때문에 처음 생각이 바뀌었나요? 남은 길을 그리며 설명해 주세요.”</p>
        <p>“1단과 2단에서 전구로 이어지는 전지를 각각 짚어 볼까요?”</p>
      </section>
      <section class="wb-section wb-sources">
        <h3>역사 읽기 · 학생 8쪽과 연결</h3>
        <p>${link('https://edison.rutgers.edu/component/content/article/electric-lamp?Itemid=101&amp;catid=91', '럿거스대 에디슨 기록')}: 전등을 개별로 켜고 끄는 병렬 연결. 전지의 병렬 연결과 구별한다.</p>
        <p>${link('https://www.energy.gov/articles/war-currents-ac-vs-dc-power', '미국 에너지부 · 직류와 교류')}: 에디슨의 직류 공급과 테슬라의 교류 기술 기여. 직렬·병렬은 연결 방법, 직류·교류는 전류 방향의 구분이다.</p>
        <p>${link('https://contents.history.go.kr/mobile/kc/view.do?code=kc_age_40&amp;levelId=kc_o403950', '국사편찬위원회 · 건청궁 전등')}: 1887년 건청궁에 에디슨전등회사 설비로 전등을 밝혔다. 발전기·전선·전등의 역할을 찾아본다.</p>
      </section>
      <section class="wb-section wb-sources">
        <h3>영상 출처와 활용</h3>
        <p>${link('https://m.site.naver.com/1e5DZ', '전지 연결 실험')} · ${link('https://m.site.naver.com/1e5E2', '전지 연결 방법')}: 비교·극 확인<br>${link('https://m.site.naver.com/1e5E0', '2단 밝기 스탠드')} · ${link('https://m.site.naver.com/1e5E3', '전지 연결 예')}: 조립·생활 연결</p>
        <p>${link('https://www.energy.gov/articles/video-who-was-better-inventor-tesla-or-edison', '에디슨과 테슬라 · 미국 에너지부')}: 영어 영상<br>${link('https://royal.khs.go.kr/ROYAL/contents/R303000000.do?schGroupCode=gbg&amp;schM=view&amp;id=20240108151343717711', '건청궁 전기 · 궁능유적본부 안내')}: 수어 해설</p>
        <p class="wb-small">역사 영상의 한국어 자막, 수어 영상의 한국어 음성은 확인 필요. 수업 전 필요한 장면을 확인하고 선택해 활용한다. 링크는 새 창에서 열린다.</p>
      </section>
      <nav class="wb-page-links" aria-label="설명 화면 연결">
        <button type="button" data-workbook-step="18">나의 설명으로 돌아가기</button>
      </nav>
    `)
  ].join('');
}
