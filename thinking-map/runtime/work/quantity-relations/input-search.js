(function () {
  'use strict';
  const catalog = Object.fromEntries(DATA.curriculumCatalog.map(row => [row.id, row]));
  const corpus = DATA.lookupCorpus;
  const normalize = text => String(text || '').normalize('NFKC').toLowerCase().replace(/\s+/g, '').replace(/[^가-힣a-z0-9□×÷+−=]/g, '');
  const skeleton = text => normalize(text).replace(/\d+/g, '#');
  function grams(text) {
    const s = skeleton(text), result = new Set();
    for (let i = 0; i < s.length - 1; i++) result.add(s.slice(i, i + 2));
    return result;
  }
  function similarity(first, second) {
    const a = grams(first), b = grams(second);
    let overlap = 0;
    for (const value of a) if (b.has(value)) overlap++;
    return a.size && b.size ? 2 * overlap / (a.size + b.size) : 0;
  }
  function position(row) {
    const unit = row.unitNumber == null ? (row.unitTitle ? row.unitTitle+(row.printedIssue?'':' · 단원 번호 확인 중') : '단원 번호 확인 중') : `${row.unitNumber}단원${row.unitTitle ? ' ' + row.unitTitle : ''}`;
    const question = row.questionNumber == null ? '문제번호 확인 중' : /^\d+$/.test(String(row.questionNumber)) ? row.questionNumber + '번' : String(row.questionNumber);
    const section = row.bookGroup === '필즈 더클래식' ? ' · ' + String(row.section || '').replace('activity', '활동').replace('practice', '연습').replace('advanced', '심화').replace('check', '확인') : '';
    const pdfPage=/PDF/.test(row.pageKind||'')&&!/인쇄/.test(row.pageKind||'');
    return `${row.book}${row.printedIssue?' '+row.printedIssue:''} / ${unit}${section} / ${question}${row.page ? ' / ' + (pdfPage ? 'PDF ' : '') + row.page + '쪽' : ''}`;
  }
  function curriculumLinks(typeId) {
    return (DATA.typeCurriculumConnections[typeId] || []).map(edge => ({ ...catalog[edge.curriculumId], relationship: edge.relationship }));
  }
  function curriculumMarkup(typeId) {
    return curriculumLinks(typeId).map(c => `<li><a href="${escape(c.sourceUrl)}" target="_blank" rel="noreferrer">${escape(c.semester)} · ${escape(c.unit)}</a> <small>${c.relationship === 'later-use' ? '후속 활용' : '선택 풀이의 교과 연계'} · ${escape(c.edition)}</small></li>`).join('');
  }
  function rankText(text) {
    const n = normalize(text);
    if(DATA.familyResponseAlignment||DATA.remainingResponseAlignment){
      const hit=[...(DATA.runtimeGeneratedExamples||[]),...DATA.specimens,...(DATA.somaGeneratedVariants||[])].find(s=>(s.nativeParameterGenerated||s.familyAlignmentNewExample||s.remainingAlignmentNewExample||s.somaReuseNewExample||s.somaAuthoringNewExample||s.somaGeneratedVariant)&&normalize(s.problem.prompt)===n);
      if(hit){const ids=hit.thinkingTypeIds||[hit.proposedTypeId];return {ranked:ids.map(id=>({id,score:49,reasons:['확인한 응답 예시와 지문이 같습니다. 그림과 주어진 위치는 따로 확인합니다.']})),broadMatches:corpus.filter(r=>r.typeIds.some(id=>ids.includes(id))).slice(0,5).map(row=>({row,score:1})),method:'exact-family-response-contract',visualReviewRequired:hit.normalization.requiresVisualContext};}
    }
    if(DATA.somaSourceReuse){
      const exact=DATA.sourceRecords.filter(r=>r.somaReuseStage&&normalize(r.action)===n);
      let ids=[...new Set(exact.flatMap(r=>r.typeIds))];
      if(!ids.length){
        let id=null;
        if(/눈금/.test(n)&&/하나.*더|눈금.*추가|눈금.*그리/.test(n))id='UL42';
        else if(/눈금/.test(n)&&/잴수|측정할수/.test(n)&&/길이/.test(n))id='UL41';
        else if(/선분/.test(n)&&/두점.*끝점|끝점.*선분|한직선위.*점/.test(n)&&/몇개|개수|모두/.test(n))id='FC16';
        else if(/직선/.test(n)&&/두점|다섯점|여러점/.test(n)&&/서로다른|개수|몇개/.test(n))id='FC17';
        else if(/넓이.*같|같은넓이/.test(n)&&/나누|조각/.test(n)&&!/분수|색칠|같은모양|모양.*같|합동/.test(n))id='FP06';
        else if(/선.*그어|선을그려/.test(n)&&/삼각형/.test(n)&&/사각형/.test(n)&&/나누/.test(n))id='PT07';
        else if(/한붓그리기/.test(n))id='RT06';
        else if(/묶음/.test(n)&&/살수없는|만들수없는/.test(n)&&/가장큰|최댓값/.test(n))id='CT13';
        else if(/로마숫자/.test(n)&&/나타|쓰기|쓰세|표기/.test(n))id='NC12';
        else if(/각도기/.test(n)&&/눈금/.test(n))id='AG31';
        else if(/예각|둔각/.test(n)&&/구별|분류|이름/.test(n))id='AG32';
        else if(/정사면체/.test(n)&&/전개도/.test(n))id='SP02';
        else if(/마방진/.test(n)&&/5×5|홀수차|fill/.test(n)&&/방법.*따라|주어진.*방법|fill/.test(n))id='MG13';
        else if(/괄호/.test(n)&&/위치/.test(n)&&/비교|여러|바꾸|바꿔/.test(n))id='OP13';
        if(id)ids=[id];
      }
      if(ids.length)return {ranked:ids.map(id=>({id,score:46,reasons:['기존 소마 응답 구조의 연결 후보입니다. 그림·인쇄 발판·모두/한 가지의 조건을 확인합니다.']})),broadMatches:corpus.filter(r=>r.typeIds.some(id=>ids.includes(id))).slice(0,5).map(row=>({row,score:1})),method:'soma-preserved-source-response-candidate',visualReviewRequired:true};
    }
    if(DATA.remainingResponseAlignment&&/펼친|펼치니/.test(n)&&/접은선(?:을|두개|의위치|이어디).*?(?:찾|복원|고르)/.test(n))return {ranked:[{id:'FO12',score:47,reasons:['펼친 결과에서 접은 선을 거꾸로 찾는 후보입니다. 구멍의 위치와 접기 순서를 확인합니다.']}],broadMatches:corpus.filter(r=>r.typeIds.includes('FO12')).slice(0,5).map(row=>({row,score:1})),method:'inverse-fold-crease-candidate',visualReviewRequired:true};
    if(DATA.crossBookAlignment){
      const hits=DATA.specimens.filter(s=>s.crossbookNewExample&&normalize(s.problem.prompt)===n);
      const id=hits[0]?.proposedTypeId||(/카드|사탕|물건/.test(n)&&/같은개수|똑같|[0-9]+(?:개|장)씩/.test(n)&&/시작|처음|가지고있/.test(n)&&/잃|주었|주고|주면|옮/.test(n)&&/차|더많/.test(n)?'QR10':null);
      if(id)return {ranked:[{id,score:49,reasons:['처음의 양·이동 뒤 차·구할 것을 구별하는 후보입니다.']}],broadMatches:corpus.filter(r=>r.typeIds.includes(id)).slice(0,5).map(row=>({row,score:1})),method:'source-aligned-response-structure',visualReviewRequired:false};
    }
    if(DATA.defaultNormalization){
      const matches=(DATA.providerSpecimens||[]).filter(s=>s.normalization?.stage==='default'&&normalize(s.problem.prompt)===n);
      if(matches.length){const ids=[...new Set(matches.map(s=>s.proposedTypeId))];return {ranked:ids.map(id=>({id,score:48,reasons:['확인한 저장 예시와 지문이 같습니다. 그림 조건과 숫자 위치는 따로 확인합니다.']})),broadMatches:corpus.filter(r=>r.typeIds.some(id=>ids.includes(id))).slice(0,5).map(row=>({row,score:1})),method:'exact-reviewed-default-text-needs-visual-context',visualReviewRequired:matches.some(s=>s.normalization.requiresVisualContext)};}
    }
    if(DATA.book10Normalization){
      let id=null;
      if(/숫자야구/.test(n)||/비밀수/.test(n)&&/s/.test(n)&&/b/.test(n))id='LG07';
      else if(/1부터/.test(n)&&/홀수/.test(n)&&/짝수/.test(n)&&/합/.test(n)&&/차/.test(n))id='NS19';
      else if(/줄로세우|한줄로서|줄세우/.test(n)&&/방법|순서|몇가지/.test(n))id='CT09';
      else if(/전등|스위치/.test(n)&&/켜|끄|꺼/.test(n)&&/모습|경우/.test(n))id='CT10';
      else if(/카드/.test(n)&&/골라|고르/.test(n)&&/합/.test(n)&&/목표|되게/.test(n))id='CT11';
      else if(/구간/.test(n)&&/길/.test(n)&&/골라|고르/.test(n)&&/방법|몇가지/.test(n))id='RT05';
      else if(/약수/.test(n)&&/개수|몇개/.test(n))id='DV12';
      if(id)return {ranked:[{id,score:44,reasons:['수 범위·숫자/순서/상태·카드 중복·S/B 위치와 구할 것을 확인하는 후보입니다.']}],broadMatches:corpus.filter(r=>r.typeIds.includes(id)).map(row=>({row,score:similarity(text,row.action)})).sort((a,b)=>b.score-a.score).slice(0,5),method:'book10-visible-response-contract-candidates',visualReviewRequired:true};
    }
    if(DATA.book9Normalization){
      let id=null;
      if(/칠각진|칠각형/.test(n)&&/합/.test(n))id='MG12';
      else if(/참|거짓/.test(n)&&/조건|말|예상/.test(n)&&/답|하나/.test(n))id='LG05';
      else if(/표/.test(n)&&/합계|열의인원|행과열/.test(n)&&/표시|빈칸/.test(n))id='LG06';
      else if(/두수|두칸/.test(n)&&/바꾸|교환/.test(n)&&/줄의합|마방진/.test(n))id='MG11';
      else if(/조각/.test(n)&&/제외|뺀뒤/.test(n)&&/남은|몇조각/.test(n))id='FP05';
      if(id)return {ranked:[{id,score:44,reasons:['표의 뜻·참인 말의 수·카드 재고·조각 수와 실제 구할 것을 확인하는 후보입니다.']}],broadMatches:corpus.filter(r=>r.typeIds.includes(id)).map(row=>({row,score:similarity(text,row.action)})).sort((a,b)=>b.score-a.score).slice(0,5),method:'book9-visible-response-contract-candidates',visualReviewRequired:true};
    }
    if(DATA.book8Normalization){
      let id=null;
      if(/뺄셈|빼기/.test(n)&&/복면산/.test(n))id='CR04';
      else if(/덧셈/.test(n)&&/세로식|세로셈/.test(n)&&/빈칸/.test(n))id='OP10';
      else if(/숫자카드/.test(n)&&/한번씩|각각한번/.test(n)&&/계산식|덧셈식/.test(n))id='OP11';
      else if(/처음수/.test(n)&&/거꾸로계산|거꾸로생각/.test(n))id='OP04';
      if(id)return {ranked:[{id,score:44,reasons:['기호의 숫자 범위·서로 독립된 빈칸·카드 사용 횟수와 구할 것을 확인하는 후보입니다.']}],broadMatches:corpus.filter(r=>r.typeIds.includes(id)).map(row=>({row,score:similarity(text,row.action)})).sort((a,b)=>b.score-a.score).slice(0,5),method:'book8-visible-response-contract-candidates',visualReviewRequired:true};
    }
    if(DATA.book7Normalization){
      let id=null;
      if(/대칭수|팔린드롬/.test(n)&&!/디지털|막대/.test(n))id='NS18';
      else if(/앞뒤를바꾼수|앞뒤를바꾼수를|자리숫자를바꾸|숫자를큰수와작은수로배열/.test(n)&&!/디지털|거울/.test(n))id='NS17';
      else if(/자연수|정수/.test(n)&&/합은.*보다작|범위/.test(n)&&/가장큰|최댓값/.test(n)&&/가장작은|최솟값/.test(n))id='NC11';
      else if(/달팽이/.test(n)&&/올라|미끄러/.test(n)||/낮/.test(n)&&/밤/.test(n)&&/미끄러/.test(n))id='IC12';
      else if(/모둠/.test(n)&&/속하지않은/.test(n)&&/모두몇|전체/.test(n))id='VN07';
      else if(/닭/.test(n)&&/토끼보다\d+마리많/.test(n)&&/다리수보다/.test(n)||/개수차/.test(n)&&/양의차/.test(n))id='QR31';
      else if(/나눗셈/.test(n)&&/세로식|빈칸/.test(n))id='OP09';
      else if(/날마다두배|하루마다두배|두배씩늘/.test(n))id='SQ26';
      else if(/빈병/.test(n)&&/바꾸|교환/.test(n))id='QR32';
      else if(/바둑돌/.test(n)&&/옮겨|옮길|옮기/.test(n)&&/가장적|최소/.test(n))id='TR10';
      else if(/분/.test(n)&&/몇초/.test(n)||/시간의단위/.test(n)&&/바꾸/.test(n))id='TM12';
      if(id)return {ranked:[{id,score:44,reasons:['구할 것·끝 조건·수 범위·그림을 확인한 유형 후보입니다. 첫날·두 자리·모둠의 겹침·병 빌리기 조건을 구별합니다.']}],broadMatches:corpus.filter(r=>r.typeIds.includes(id)).map(row=>({row,score:similarity(text,row.action)})).sort((a,b)=>b.score-a.score).slice(0,5),method:'book7-visible-response-contract-candidates',visualReviewRequired:true};
    }
    if(DATA.book6Normalization){
      let id=null;
      if(/숫자/.test(n)&&/들어있지않은수|없는수의개수/.test(n))id='NS14';
      else if(/신문/.test(n)&&/쪽/.test(n)||/펼친책/.test(n)&&/쪽/.test(n))id='NS16';
      else if(/더하기하나를지워|더하기를지워/.test(n)||/계산결과/.test(n)&&/이어붙/.test(n))id='OP08';
      else if(/붙어있는숫자는한수|같은숫자를이어붙여/.test(n))id='NS15';
      else if(/네이피어/.test(n)&&/계산|곱/.test(n))id='CAL08';
      else if(/같은수를묶어/.test(n))id='CAL07';
      else if(/둥근수에가깝게|둥근수로바꾸어/.test(n)||/번더한값을빠르게/.test(n))id='CAL06';
      else if(/합이둥근수/.test(n)||/앞에서부터두수씩짝지어/.test(n))id='CAL05';
      else if(/두분수의크기가같/.test(n)&&/빈칸/.test(n))id='FR15';
      else if(/연속한\d+개의수의합/.test(n)&&/작은수부터/.test(n))id='QR30';
      else if(/한걸음길이의합/.test(n)&&/같은거리/.test(n))id='QR11';
      else if(/구멍/.test(n)&&/경계/.test(n))id='UL38';
      else if(/오른쪽과아래쪽으로만/.test(n)&&/길이/.test(n))id='UL39';
      else if(/접/.test(n)&&/직사각형/.test(n)&&/처음.*둘레/.test(n))id='UL36';
      else if(/직사각형을대각선/.test(n)&&/삼각형의둘레/.test(n)||/삼각형의세변/.test(n)&&/둘레/.test(n))id='UL35';
      else if(/정다각형|정3각형|정6각형/.test(n)&&/붙였|붙인|붙여/.test(n)&&/둘레/.test(n))id='UL32';
      else if(/직사각형/.test(n)&&/붙인|붙였/.test(n)&&/둘레/.test(n)&&/가로|맞닿은/.test(n))id='UL37';
      else if(/잘라/.test(n)&&/둘레/.test(n)&&/늘어|변화/.test(n))id='UL34';
      else if(/정사각형/.test(n)&&/둘레/.test(n)&&/붙여만든|붙인도형|만든색칠|회색칸/.test(n))id='UL33';
      else if(/마름모/.test(n)&&/둘레/.test(n)||/가로가\d+cm세로가\d+cm인직사각형의둘레/.test(n))id='UL31';
      else if(/막대/.test(n)&&/길이차이/.test(n)&&/몇번/.test(n))id='UL08';
      else if(/막대/.test(n)&&/겹치지않게이어/.test(n)&&/전체길이/.test(n)||/한칸이/.test(n)&&/가에서다까지/.test(n))id='UL30';
      if(id)return {ranked:[{id,score:44,reasons:['실제 수·그림·구할 것을 확인하는 유형 후보입니다. 계산 발판·음수·안쪽 경계와 닫힌 둘레 여부를 구별합니다.']}],broadMatches:corpus.filter(r=>r.typeIds.includes(id)).map(row=>({row,score:similarity(text,row.action)})).sort((a,b)=>b.score-a.score).slice(0,5),method:'book6-visible-response-contract-candidates',visualReviewRequired:true};
    }
    if(DATA.book5Normalization){
      let id=null,reason='조건과 구할 것을 확인한 유형 후보입니다. 원문·그림과 난도는 별도로 확인합니다.';
      if(/악수/.test(n)&&/서로한번|서로한번씩/.test(n)||/서로다른2개/.test(n)&&/고르는|고르/.test(n)&&/순서/.test(n)||/원위의점/.test(n)&&/서로한번/.test(n))id='CT08';
      else if(/각줄/.test(n)&&/양끝/.test(n)&&/바로위의두수/.test(n)||/파스칼삼각형/.test(n))id='SQ25';
      else if(/가장짧은길/.test(n)&&/별표|경유|정해진점/.test(n))id='RT04';
      else if(/곱셈매트릭스/.test(n)||/가로와세로의곱|각줄의수를모두곱한/.test(n))id='NC09';
      else if(/윗줄의수와왼쪽수/.test(n)&&/곱/.test(n)||/곱셈표/.test(n)&&/수|빈칸/.test(n))id='NC10';
      else if(/같은모양은같은수/.test(n)&&/모든모양의수/.test(n)&&/더하|더해/.test(n)||/여러식/.test(n)&&/도형/.test(n))id='NC08';
      else if(/두모양의수/.test(n)&&/곱하면/.test(n)&&/더하면/.test(n))id='QR29';
      else if(/손가락/.test(n)&&/돌아|돌아서/.test(n))id='SQ03';
      else if(/선을따라이어지는수배열|대각선방향으로이어지는규칙/.test(n))id='SQ01';
      else if(/번줄의/.test(n)&&/번째수/.test(n))id='SQ05';
      else if(/첫째줄부터1개3개5개|첫째줄에1개둘째줄에2개/.test(n))id='SQ20';
      else if(/1부터홀수를\d+개/.test(n))id='SQ14';
      else if(/작은정사각형색종이/.test(n)&&/번째모양/.test(n))id='SQ12';
      else if(/쌓기나무/.test(n)&&/일정한규칙/.test(n)&&/번째모양/.test(n))id='CB07';
      else if(/큰삼각형안에서/.test(n)&&/크고작은삼각형/.test(n))id='FC01';
      else if(/월\d+일에서\d+일뒤/.test(n)&&/요일/.test(n))id='CA05';
      else if(/같은.*요일인두날짜의합/.test(n))id='CA03';
      if(id)return {ranked:[{id,score:44,reasons:[reason]}],broadMatches:corpus.filter(r=>r.typeIds.includes(id)).map(row=>({row,score:similarity(text,row.action)})).sort((a,b)=>b.score-a.score).slice(0,5),method:'book5-visible-response-contract-candidates',visualReviewRequired:true};
    }
    if(DATA.book4Normalization){
      let id=null,reason='';
      if(/원탁|원형자리/.test(n)){id='LG03';reason='기준 자리·바로 사이·마주보기·시계 방향을 함께 확인';}
      else if(/쌓기나무/.test(n)&&/걷어|겉층.*제거|겉면.*제거/.test(n)){id='CB11';reason='바닥 포함 여부와 겉 한 층을 걷은 뒤 남은 칸을 구별';}
      else if(/쌓기나무/.test(n)&&/검은색/.test(n)&&/흰색/.test(n)&&/같은색.*맞닿|번갈|교대/.test(n)){id='CB09';reason='면을 맞댄 색의 교대·각 방향 홀짝과 시작 색을 확인';}
      else if(/쌓기나무/.test(n)&&/보이지않/.test(n)&&/벽이있|벽뒤|뒤와왼쪽에벽/.test(n)){id='CB02';reason='벽과 바닥이 막는 관찰 방향을 확인';}
      else if(/쌓기나무/.test(n)&&/보이지않/.test(n)&&/벽이없|어느방향/.test(n)){id='CB10';reason='그림 한 시점의 가림과 허용되는 모든 면의 노출을 구별';}
      else if(/접/.test(n)&&/맨위/.test(n)&&/색/.test(n)){id='FO11';reason='접는 묶음을 뒤집어 포개는 순서와 앞뒤 색 조건 확인';}
      else if(/수배열판|수배열표/.test(n)&&/칸/.test(n)&&/뒤집|위아래|좌우/.test(n)){id='TR09';reason='숫자 모양을 바꾸지 않고 칸의 자리만 옮기는 응답';}
      else if(/친구|숫자카드/.test(n)&&/자리|빈칸/.test(n)&&/왼쪽|오른쪽|위에|아래/.test(n)){id='LG04';reason='그림 기준 위아래좌우와 칸의 실제 모양을 함께 확인';}
      else if(/키/.test(n)&&/비교/.test(n)&&/친구|cm/.test(n)||/차이/.test(n)&&/이어/.test(n)&&/크기|두끝/.test(n)){id='QR28';reason='알려진 기준값의 크기와 두 끝의 차이 중 구할 것을 확인';}
      if(id)return {ranked:[{id,score:44,reasons:[reason]}],broadMatches:corpus.filter(r=>r.typeIds.includes(id)).map(row=>({row,score:similarity(text,row.action)})).sort((a,b)=>b.score-a.score).slice(0,5),method:'book4-visible-response-and-boundary-candidates',visualReviewRequired:true};
    }
    if(DATA.book1FoldGakuroNormalization&&/가쿠로/.test(n)&&!/스도쿠/.test(n)){
      const id='GK01';return {ranked:[{id,score:44,reasons:['가로·세로 합·주어진 수·수 재고를 함께 확인. 줄별 중복 금지와 전체 카드 각1회 사용을 구별']}],broadMatches:corpus.filter(r=>r.typeIds.includes(id)).map(row=>({row,score:similarity(text,row.action)})).sort((a,b)=>b.score-a.score).slice(0,5),method:'gakuro-sum-and-inventory-contract-candidate',visualReviewRequired:true};
    }
    if(DATA.book1Normalization){
      let id=null,reason='';
      if(/디지털|막대숫자/.test(n)&&/뒤집|돌리|돌렸/.test(n)&&((/결과|보이는수|보이는숫자|알맞은수|알맞은숫자/.test(n)&&!/더하|계산|합|가장|개수|몇개/.test(n))||/숫자판전체/.test(n)&&/모두더|수들의합/.test(n))){id=/숫자판전체/.test(n)&&/더하|더해|모두더|합/.test(n)?'TR06':'TR08';reason='실제로 보이는 막대 모양과 전체 자리 순서를 확인. 숫자의 원래 방향과 읽을 수 있는 숫자를 구별';}
      else if(/자리숫자/.test(n)&&/조건|합|차|크|작/.test(n)){id='CT07';reason='수 전체와 각 자리 숫자의 합·차·범위·홀짝 조건을 구별. 실제 답의 개수는 모든 조건 확인 후 판단';}
      else if(/사람/.test(n)&&/과일|동물|음식|취미/.test(n)&&/조건|서로다른|좋아/.test(n)){id='LG01';reason='서로 다른 짝의 일대일 대응과 제외 조건 연결. 목표 질문을 함께 확인';}
      else if(/사람/.test(n)&&/한줄|앞뒤|순서/.test(n)&&/조건|몇번째/.test(n)){id='LG02';reason='앞뒤·이웃·사이 인원 조건을 한 순서에 함께 기록';}
      else if(/다섯수카드|다섯장의수카드/.test(n)&&/가로|세로|십자|t자/.test(n)&&/합/.test(n)){id='MG10';reason='두 줄 공통 칸의 값에 따라 한 줄 합과 배치가 여러 개 가능. 한 답 예시로 제한하지 않음';}
      else if(/가운데|중심/.test(n)&&/네줄|마주보는/.test(n)&&/합/.test(n)){id='MG09';reason='원 둘레 전체 합과 마주 보는 양끝 두 수 합을 구별';}
      if(id)return {ranked:[{id,score:44,reasons:[reason]}],broadMatches:corpus.filter(r=>r.typeIds.includes(id)).map(row=>({row,score:similarity(text,row.action)})).sort((a,b)=>b.score-a.score).slice(0,5),method:'book1-visible-response-contract-candidates',visualReviewRequired:true};
    }
    if(DATA.book2Normalization){
      let id=null,reason='';
      if(/스도쿠/.test(n)||/가로/.test(n)&&/세로/.test(n)&&/한번씩|겹치지|중복없이/.test(n)){id='SD01';reason='같은 줄·영역에서 쓸 수 없는 수를 제외. 실제 주어진 칸과 구할 한 칸을 확인';}
      else if(/저울/.test(n)&&/무거운.*(순서|차례)|가벼운.*(순서|차례)|가장가벼|가장무거/.test(n)){id='BL04';reason='기울기의 무게 비교를 연결. 가장 가벼운 하나와 전체 순서 응답을 구별';}
      else if(/똑같|같은크기의몫/.test(n)&&/가르|갈라|나누|나눠/.test(n)&&/수로|수를|한몫|한부분|묶음/.test(n)&&!/도형|색칠|분수|조각|종이/.test(n)){id='QR27';reason='전체를 같은 수의 몫으로 나누는 관계. 그림의 도형 분할과 구별';}
      else if(/앞의?두수|이전두수/.test(n)&&/더해|더하/.test(n)&&/수열|다음수|다음항/.test(n)){id='SQ24';reason='앞의 두 항을 함께 기억해 다음 항을 만드는 규칙';}
      else if(/계산규칙|계산약속|약속을찾/.test(n)&&/찾|알아/.test(n)&&/표|줄|가운데|주변|바깥/.test(n)){id='OP07';reason='보기의 위치와 허용 계산을 비교해 같은 약속 찾기. 임의 함수 전체의 유일성은 주장하지 않음';}
      if(id)return {ranked:[{id,score:44,reasons:[reason]}],broadMatches:corpus.filter(r=>r.typeIds.includes(id)).map(row=>({row,score:similarity(text,row.action)})).sort((a,b)=>b.score-a.score).slice(0,5),method:'book2-response-and-visible-given-candidates',visualReviewRequired:true};
    }
    if (byType.PT01 && !/분수|넓이/.test(n) && (/테트로미노|펜토미노|트로미노/.test(n) || /모양|도형|조각|부분/.test(n)&&/나누|채우|채워|붙여|만드/.test(n)&&/표시|별|다람쥐|나무|구슬|하나씩|같은조각/.test(n))) {
      const id=/모두그|여러모양|서로다른모양|아닌것|만든모양/.test(n)?'PT01':/같은개수|똑같은수|3마리씩|2개씩|3개씩|표시가\d개씩/.test(n)?'PT04':/표시|별|나무|하나씩|1.*2.*3.*4.*들어/.test(n)?'PT03':/같은조각|붙여.*정사각형|정사각형을만|보기의조각|조각만/.test(n)?'PT02':/펜토미노/.test(n)&&!/같은모양|똑같은/.test(n)?'PT05':'FP02';
      return {ranked:[{id,score:48,reasons:['모두 그리기/선택·칸 수·합동·표시 재고·주어진 경계·뒤집기 허용을 함께 확인']}],broadMatches:corpus.filter(r=>r.typeIds.includes(id)).map(row=>({row,score:similarity(text,row.action)})).sort((a,b)=>b.score-a.score).slice(0,5),method:'partition-response-and-condition-candidates',visualReviewRequired:true};
    }
    if (byType.MG04 && (/마방진|삼각진|오각진/.test(n) || /삼각형/.test(n)&&/세변|각변|한변/.test(n)&&/수|숫자/.test(n)&&/놓|배치|채워|채우/.test(n) || /사각형둘레/.test(n)&&/수|숫자/.test(n))) {
      const tri=/삼각진|삼각형/.test(n),five=/오각진|오각형/.test(n),eight=/사각형둘레|1부터8까지|1~8/.test(n),four=/4[×x*]4|4곱하기4|열여섯|16까지/.test(n),complete=/완성|모두채|빈칸을채|빈칸들을|빈원을채|배치/.test(n),opt=/가장크|가장큰|가장작|최대|최소|최댓값|최솟값/.test(n);
      const id=tri?(opt?'MG08':'MG07'):five?'MG05':eight&&!four?'MG06':four?(complete?'MG04':'MG03'):complete?'MG01':'MG02';
      return {ranked:[{id,score:48,reasons:[opt?'같은 변 합을 만족하는 배치의 최적성과 예시 하나의 타당성을 구별':complete?'주어진 수 목록·한 번 사용·전체 배치의 여러 정답을 함께 확인':'목표 값이 정해지는 것과 전체 배치가 유일한 것은 다름']}],broadMatches:corpus.filter(r=>r.typeIds.includes(id)).map(row=>({row,score:similarity(text,row.action)})).sort((a,b)=>b.score-a.score).slice(0,5),method:'equal-line-response-card-pool-and-optimum-candidates',visualReviewRequired:true};
    }
    if (byType.NC01 && !/분수|등분|분할/.test(n) && /마법카드|무게추|주어진추|칸이나타내는수|보기의규칙.*(색칠|동그라미)|비밀수|도형묶음|도형수|색칠.*(수로나타|수를나타|칸이나타내는수)|보기의규칙.*나타내는수|수에맞게.*도형/.test(n)) {
      const id=/마법카드/.test(n)?'NC01':/무게추|주어진추/.test(n)?'NC02':/비밀수|도형묶음/.test(n)?'NC05':/색칠하|되도록.*(색칠|동그라미)|수에맞게.*도형|수로나타내|수를나타내/.test(n)?'NC04':'NC03';
      return {ranked:[{id,score:48,reasons:[id==='NC02'?'각 추의 재고·한쪽/양쪽 배치와 사용/미사용 응답을 구별':id==='NC05'?'기호 묶음을 값의 합으로 비교. 자릿수 숫자를 이어 쓰는 복면산과 구별':'보기의 위치 규칙·선택된 칸과 읽기/그리기 응답을 함께 확인']}],broadMatches:corpus.filter(r=>r.typeIds.includes(id)).map(row=>({row,score:similarity(text,row.action)})).sort((a,b)=>b.score-a.score).slice(0,5),method:'number-code-response-and-given-layout-candidates',visualReviewRequired:true};
    }
    if (byType.CR01 && (/복면산/.test(n) || /[○□◇✚△☆]/.test(text) && /[+=]/.test(text))) {
      const raw=String(text).replace(/\s+/g,''), expr=[...raw.matchAll(/([0-9○□◇✚△☆]+(?:\+[0-9○□◇✚△☆]+)+)=([0-9○□◇✚△☆]+)/g)];
      let id=null,reason='';
      if (/이어진식|연결된식|두식을함께|여러식을함께/.test(n) || expr.length>1) {id='CR03';reason='여러 식의 기호값 관계를 함께 확인. 기호를 이어 쓴 수와 기호값의 덧셈은 구별';}
      else if (expr.length===1) {const terms=expr[0][1].split('+');id=new Set(terms).size===1?'CR01':'CR02';reason='주어진 가수가 '+(id==='CR01'?'같은 수를 반복하는':'서로 다른 수로 놓인')+' 식. 세로 자리와 실제 기호를 원본에서 확인';}
      else if (/같은수를더|같은수를반복|같은수의합/.test(n)) {id='CR01';reason='같은 수 반복 조건을 가진 복면산';}
      else if (/다른수를더|서로다른수를더|받아올림.*복면산/.test(n)) {id='CR02';reason='서로 다른 수의 자리 조건과 받아올림을 연결';}
      const ranked=(id?[id]:['CR01','CR02','CR03']).map(t=>({id:t,score:id?48:10,reasons:[reason||'복면산의 식과 자리 배치를 확인해야 세부유형을 구분할 수 있습니다.']}));
      return {ranked,broadMatches:corpus.filter(r=>r.typeIds.some(t=>ranked.some(c=>c.id===t))).map(row=>({row,score:similarity(text,row.action)})).sort((a,b)=>b.score-a.score).slice(0,5),method:id?'cryptarithm-operand-and-linked-equation-candidates':'cryptarithm-structure-pending-visual-review',visualReviewRequired:true};
    }
    if(byType.UL01){
      let id=null,reason='';
      if(byType.UL08&&/재면|재는|재었/.test(n)&&/잘라|단위길이의차|두단위의차/.test(n)){id='UL08';reason='같은 전체를 재는 두 단위의 차를 새 단위로 구성';}
      else if(byType.UL07&&(/통나무/.test(n)&&/성냥|연필/.test(n)||/리코더/.test(n)&&/성냥/.test(n))){id='UL07';reason='물건의 같은 길이 두 관계를 연결하거나 한 단위 개수로 바꿈';}
      else if(byType.UL05&&(/같은간격|똑같은간격|등간격/.test(n)&&/한칸|길이|거리|왼쪽구간|오른쪽구간/.test(n))){id='UL05';reason='같은 간격의 전체·한 칸을 구별. 두 구간이면 각 간격을 따로 확인';}
      else if(byType.UL06&&(/한걸음/.test(n)&&/몇걸음|걸음수/.test(n)||/도서관/.test(n)&&/학교/.test(n)&&/몇배/.test(n))){id='UL06';reason='같은 거리를 걸음 또는 기준 거리 단위로 바꿔 재는 관계';}
      else if(byType.UL06&&(/막대/.test(n)&&/이은길이가같|이은길이와.*같|전체길이는같|전체길이도같|각행의전체길이/.test(n)||/성냥/.test(n)&&/지우개/.test(n)&&/길이/.test(n))){id='UL06';reason='같은 전체 길이에서 단위의 개수와 한 개 길이를 구별';}
      else if(byType.UL05&&(/속도|빠르기/.test(n)&&/만났|만나/.test(n)||/막대/.test(n)&&/길이의합|전체길이가|전체길이는/.test(n)&&!/같/.test(n))){id='QR11';reason='같은 이동 시간 또는 단위 묶음의 조건에서 배수와 합을 함께 사용';}
      else if(/접|펼/.test(n)&&/테이프|리본|띠/.test(n)&&/길이/.test(n)){id='UL01';reason='폭 있는 띠를 접어도 전체 길이가 보존되는 조건. 모눈·접힘과 겹침을 시각 확인';}
      else if(/중간수|두수의중간|두점의중간|수직선.*중점/.test(n)){id='UL02';reason='양끝 수에서 같은 거리인 중간 수를 요구';}
      else if((/겹친|겹치는|겹쳐/.test(n)&&/길이|거리|구간/.test(n))||(/수직선/.test(n)&&/거리|길이/.test(n)&&/네점|4개의점|ab|bc|cd/.test(n))){id='UL03';reason='주어진 구간의 합·차와 겹침을 보존해 거리 복원. 응답 수에 따른 부담은 별도';}
      else if(/자의|자로|눈금/.test(n)&&/길이|재어|재세요/.test(n)){id='UL04';reason='같은cm 단위 눈금과 물건 양끝의 위치로 길이 읽기';}
      else if(/수직선/.test(n)&&/빈칸|빈수/.test(n)&&!/움직|이동|시작/.test(n)){id='SQ01';reason='같은 간격의 수직선에서 이웃한 수를 이어 빈칸 찾기';}
      if(id)return {ranked:[{id,score:48,reasons:[reason]}],broadMatches:corpus.filter(r=>r.typeIds.includes(id)).map(row=>({row,score:similarity(text,row.action)})).sort((a,b)=>b.score-a.score).slice(0,5),method:'length-response-contract-and-existing-source-retrieval'};
    }
    const fractionContext=(/분수/.test(n)||/전체의\s*\d+\s*\/\s*\d+/.test(text))&&/색칠|조각|도형|삼각형|사각형|육각형/.test(n);
    const constructParts=/모양과크기가같|같은모양|같은크기|똑같이|합동/.test(n)&&/조각/.test(n)&&/나누세요|나누시오|나누어보|나누고|나누어.*색칠/.test(n)&&!/칠교/.test(n);
    if((fractionContext||constructParts)&&byType.FP01){
      const incomplete=/빠진선|선이빠|선을이어|완성한뒤|그어진선을유지|주어진선을유지|나누고.*색칠[한된]부분.*분수/.test(n),targetShade=/분수만큼|전체의.*색칠|나누고.*색칠하|나누어.*색칠하/.test(n);
      const id=incomplete?(byType.FP04?'FP04':null):constructParts?(targetShade?'FP03':'FP02'):targetShade?'FP03':fractionContext?'FP01':null;
      const ranked=id?[{id,score:48,reasons:[id==='FP01'?'같은 조각의 전체 수와 색칠 수를 분수로 표현':id==='FP02'?'색칠 요구 없이 같은 모양과 크기의 조각으로 직접 분할':id==='FP04'?'이미 있는 선과 색칠 영역을 유지하며 빠진 등분선을 완성':'등분선 구성과 주어진 분수만큼의 색칠을 함께 요구']}]:[];
      return {ranked,broadMatches:corpus.filter(r=>r.typeIds.includes(id)).map(row=>({row,score:similarity(text,row.action)})).sort((a,b)=>b.score-a.score).slice(0,5),method:'fraction-response-contract-rules-visual-context-required',supportedTypes:DATA.types.length};
    }
    // Area needs its own structure rules; do not treat it as an ordinary sum/ratio.
    if (/넓이/.test(n)) {
      const ranked=[],add=(id,reason)=>{if(byType[id])ranked.push({id,score:45,reasons:[reason]});};
      if (/정사각형/.test(n)&&/기울어진|기울어|비스듬/.test(n)) add('UA05','모눈의 같은 넓이를 이용해 기울어진 정사각형을 측정');
      else if (/칠교/.test(n)) add('UA02','칠교판의 단위넓이와 구성 조각의 넓이를 연결');
      else if (/정사각형/.test(n)&&/겹|바깥|중점/.test(n)) add('UA04','겹친 정사각형의 바깥 윤곽과 초기 넓이 단위·합/마지막 항을 구별');
      else if (/정사각형|정삼각형|도형/.test(n)&&/커지|번째|규칙/.test(n)&&/합|모두|더하/.test(n)) add('UA03','작은 조각 수가 늘어나는 규칙에서 단계별 넓이를 합함');
      else if (/모눈|격자|온칸|반칸|잘린칸/.test(n)){add('UA01','모눈의 같은 단위넓이와 잘린 칸으로 색칠 도형을 측정');if(/정사각형의넓이|각정사각형넓이/.test(n))add('UA05','기울어진 정사각형인지 그림의 윤곽을 추가 확인');}
      return {ranked,broadMatches:corpus.filter(r=>r.typeIds.some(t=>ranked.some(x=>x.id===t))).map(row=>({row,score:similarity(text,row.action)})).sort((a,b)=>b.score-a.score).slice(0,5),method:'area-structure-rules-visual-context-required',supportedTypes:DATA.types.length};
    }
    if (/둘레|각의크기|내각|외각|각도/.test(n)) return { ranked: [], broadMatches: [], method: 'outside-current-quantity-scope', supportedTypes: DATA.types.length };
    const scores = new Map();
    const give = (id, points, reason) => {
      const current = scores.get(id) || { id, score: 0, reasons: [] };
      current.score += points; if (!current.reasons.includes(reason)) current.reasons.push(reason); scores.set(id, current);
    };
    const sum = /합|전체|모두|총/.test(n);
    const gap = /차이|차는|차가|차를|더많|더적|더가|보다\d+개/.test(n);
    const ratio = /[0-9두세네다섯여섯]배/.test(n);
    const transfer = /옮|주었|주면|주어야|주고|받았|받고|주더니|주니|주었더니|건네/.test(n);
    const same = /같아|같게|같은수|똑같|같아졌|수가같/.test(n);
    const initial = /처음.{0,12}(몇|구|수)|원래.{0,12}(몇|구|수)/.test(n);
    const initiallySame = /처음.{0,12}(같|똑같)|원래.{0,10}같/.test(n);
    const targetMove = /몇.{0,12}(옮|주어|주면)|옮[길긴].{0,8}(수|양|개)|이동량/.test(n);
    const table = /표|빈칸|가나|자료/.test(n);
    const cube = /쌓기나무|정육면체블록|입체모양/.test(n);
    const views = /위.*앞.*옆|앞.*옆|세방향|세관점|층수표/.test(n);
    if (cube) {
      if (/채우|가득|상자를완성/.test(n)) give('CB06', 38, '완성할 공간의 개수와 현재 개수를 연결');
      else if (/최대|최소|가장많|가장적|최댓값|최솟값/.test(n) && views) give('CB05', 38, '관점 조건을 유지하며 가능한 개수의 범위를 비교');
      else if (/가려|보이지않|숨은/.test(n) && /벽/.test(n)) give('CB02', 38, '벽의 가림 조건과 보이는 블록을 구분');
      else if (views && /보고.*(개수|몇개)|모양으로.*(수|개수)|모양을보고쌓기나무/.test(n)) give('CB04', 38, '여러 관점의 조건으로 쌓기나무 개수 복원');
      else if (views && /그리|나타내|모양|층수표/.test(n)) give('CB03', 35, '입체·관점 그림·기둥 높이를 대응');
      else if (/전체|모두|총/.test(n) && /개수|몇개|센/.test(n) && !/보이는.*개수/.test(n)) give('CB01', 35, '원래 입체의 층과 기둥을 따라 전체 개수를 셈');
    }
    const fold = /색종이|종이를.*접|접은종이|접어.*(자르|잘|뚫|펼)/.test(n);
    const multiFold = /두번|세번|여러번|가로.*세로|대각선.*두/.test(n);
    const numberSum = /수의합|수들의합|번호의합|잘린수.*합|남은수.*합/.test(n);
    if (fold) {
      if (numberSum) {
        if (multiFold) give('FO05', 40, '두 번 접어 겹친 칸과 그 수의 합을 연결');
        else if (/한번/.test(n)) give('FO04', 40, '한 번 접은 대응과 잘린 수 또는 남은 수의 합을 연결');
        else { give('FO04', 25, '수의 합 문제이며 접기 횟수 확인 필요'); give('FO05', 25, '수의 합 문제이며 접기 횟수 확인 필요'); }
      } else if (/구멍/.test(n)) give(/위치|그리|표시/.test(n) ? 'FO03' : 'FO07', 38, /위치|그리|표시/.test(n) ? '구멍 위치를 접은 선에 따라 복원' : '경계와 겹침을 확인해 펼친 구멍 수를 셈');
      else if (/조각/.test(n) && /잘|자르|절단/.test(n)) give('FO06', 38, '절단선과 경계의 실제 연결로 조각을 구별');
      else if (/잘|자르|절단|펼/.test(n)) give(multiFold ? 'FO02' : 'FO01', 35, multiFold ? '여러 접기의 역순을 유지해 펼침' : '접은 선을 기준으로 잘린 모양을 대응');
    }
    const tilingContext=/패턴블록|칠교|조각/.test(n) && /채우|채워|덮|완성|빈틈/.test(n) && /모양|윤곽|목표|도형/.test(n);
    if(byType.TL02 && /만든정사각형|만든모양|조각묶음/.test(n) && /붙|더해/.test(n) && !cube && !fold)give('TL02',48,'만든 조각 묶음을 유지하며 추가 조각으로 새 윤곽 구성');
    if(byType.TL01 && tilingContext && !cube && !fold)give('TL01',40,'조각의 방향과 크기를 유지해 목표 윤곽을 겹침·빈틈 없이 구성');
    const calendarContext=/달력|요일|날짜/.test(n);
    if(byType.CA01 && calendarContext){
      if(/여러조건|여섯조건|예.*아니|아니.*예|모든조건|조건을모두/.test(n))give('CA03',42,'긍정·부정 조건이 겹치는 달력 날짜를 선택');
      else if(/몇째주|어느주|무슨요일|어떤요일/.test(n) && /\d+일/.test(n))give('CA02',35,'지정 날짜가 있는 행과 요일 열을 대응');
      else if(/매주|모든|모두/.test(n) && /요일/.test(n))give('CA01',35,'요일 열에 있는 해당 월의 날짜 전체를 찾음');
    }
    const clockContext = /시계|시곗바늘|시침|분침|긴바늘|짧은바늘|시각/.test(n);
    if (byType.TM01 && clockContext) {
      if (/걸린시간|보낸시간|몇시간|경과시간/.test(n) && /시작|끝|부터|까지|두시각/.test(n)) give('TM03',38,'두 시각을 읽고 그 사이의 시간량을 구함');
      else if (/바늘/.test(n) && /그리|그려|빠진|부족한/.test(n)) give('TM02',38,'주어진 시각을 빠진 바늘의 위치로 나타냄');
      else if (/읽|나타내는시각|몇시/.test(n)) give('TM01',35,'시침과 분침의 위치를 시각으로 읽음');
    }
    const sequence = /수열|반복|규칙|패턴(?!블록)|마디|뛰어센|뛰어서|씩늘|씩커|씩작|씩줄/.test(n);
    const nth = /\d+번째|몇번째|먼차례|먼번째|지정차례/.test(n);
    const repeat = /반복마디|반복단위|반복주기|반복되는|되풀이|반복|패턴(?!블록)|마디/.test(n);
    const constant = /같은수만큼|일정한(간격|차|증가)|\d+씩(늘|커|작|줄|뛰)|등차/.test(n);
    if (byType.SQ06 && sequence && /도형|모양|곰돌이|패턴스티커/.test(n) && /빈칸|다음|이어|붙/.test(n) && !nth && !cube && !fold) give('SQ06',38,'색·모양·방향·크기의 반복마디를 다음 빈칸으로 연장');
    if (sequence && repeat) give(nth ? 'SQ03' : 'SQ02', 24, nth ? '반복마디와 지정한 차례를 함께 사용' : '반복마디의 같은 자리를 대응');
    if (sequence && constant && !repeat) give(nth ? 'SQ05' : 'SQ01', 24, nth ? '첫 수와 증가 횟수로 먼 차례를 구함' : '일정한 차를 앞뒤 빈칸에 적용');
    if (sequence && /번갈아|홀수번째.*짝수번째|교차|징검다리/.test(n) && !repeat) give('SQ04', 30, '번갈아 나오는 부분 수열을 나누어 봄');
    const sentences = String(text).replace(/\n/g, ' ').split(/[.!?。]+/).map(normalize).filter(Boolean);
    const target = sentences.at(-1) || n;
    const setContext = /벤다이어그램|집합|둘다|두활동|첫활동|두조건|좋아하는|두과목|첫째활동/.test(n);
    const outside = /어느활동도하지않|둘다아닌|모두해당하지않|아무것도하지않|어느것도좋아하지않|모두비선호/.test(n);
    if (setContext) {
      if (/나누|분류|배치|놓으|넣으/.test(target) && /벤다이어그램|두가지기준|두기준/.test(n)) give('VN01', 30, '두 기준의 소속 여부를 영역으로 나눔');
      if (/한가지만|한가지활동만|정확히하나|한조건만|하나만맞|한가지만해당/.test(target)) give('VN04', 30, '공통 부분을 제외한 두 영역만 셈');
      else if (/어느활동도하지않|둘다아닌|모두해당하지않|어느것도좋아하지않|모두비선호/.test(target)) give('VN05', 30, '전체에서 두 조건 중 하나라도 해당하는 부분을 제외');
      else if (/둘다하는|모두하는|모두좋아|겹치는|공통인원|공통으로|교집합|모두해당/.test(target)) give(outside ? 'VN06' : 'VN02', 30, outside ? '바깥 영역을 제외하고 겹친 수를 역산' : '두 집합의 합에서 전체 수를 제외');
      else if (/적어도한|적어도하나|한활동이라도|합집합|또는.*몇/.test(target)) give('VN03', 30, '두 집합의 합에서 중복된 부분을 한 번 제외');
    }
    const magic = /마방진|가로.*세로.*대각선.*합/.test(n);
    const three = /3[×x*]3|3곱하기3|아홉수|아홉개의수|아홉칸|대각선에놓인세수/.test(n);
    const four = /4[×x*]4|4곱하기4|16까지|열여섯/.test(n);
    if (magic && three) give(/완성|모두채|빈칸들을/.test(target) ? 'MG01' : 'MG02', 30, /완성|모두채|빈칸들을/.test(target) ? '3×3의 모든 칸을 같은 줄 합으로 배치' : '3×3의 같은 줄 합으로 지정한 칸 복원');
    if (magic && four && !/완성|모두채/.test(target)) give('MG03', 30, '4×4의 같은 줄 합으로 지정한 칸 복원');
    if (sum && gap && !ratio) give(table ? 'QR04' : 'QR03', 7, table ? '합·차와 표의 빠진 값이 함께 주어짐' : '두 양의 합과 차 관계가 주어짐');
    if (sum && ratio) give('QR11', 8, '전체 합과 몇 배 관계를 함께 사용');
    if (gap && ratio && !sum) give('QR12', 10, '차와 몇 배 관계를 함께 사용');
    if (sum && ratio && /배보다.{0,12}(적|작|부족)/.test(n)) give('QR13', 14, '배수보다 부족한 양을 보완해야 함');
    if (ratio && /같은.{0,10}(팔|줄|덜|빼|판매)|똑같이.{0,8}(팔|줄|빼)/.test(n)) give('QR16', 16, '같은 양 감소 전후의 배수 관계');
    if (/나이|살/.test(n) && /년뒤|년후|몇년|지금|현재|미래/.test(n) && sum) give('QR14', 15, '나이의 합과 같은 시간 경과를 연결');
    if (transfer && same && !initial) give('QR01', 10, '양쪽 수를 같게 만드는 내부 이동');
    if (transfer && same && initial) give('QR02', 13, '주고받은 뒤 같음에서 처음 수를 역산');
    if (transfer && gap && targetMove && !initiallySame) give('QR05', 13, '지정한 차가 남도록 옮길 양을 구함');
    if (transfer && gap && initiallySame) give('QR10', 17, '처음 같은 수에서 이동 뒤 생긴 차를 이용');
    if (same && /더하|더했|더해/.test(n) && /빼|뺐/.test(n) && !transfer) give('QR06', 14, '외부의 추가·제거를 되돌려 원래 수를 복원');
    if (/세사람|세명이|가가나에게.*나가다에게/.test(n) && transfer) give('QR07', 16, '세 사람의 이동 순서·전후 관계');
    if (/세모둠|세집단|세그룹/.test(n) && same) give('QR08', 17, '세 묶음을 같은 양으로 재분배');
    if (/연속|쪽수|펼친책/.test(n) && sum) give('QR09', 18, '합과 연속한 두 수의 차 1을 함께 사용');
    if (sum && ratio && /세수|세사람|세종류|사과.*배.*귤|빨강.*파랑.*노랑/.test(n)) give('QR15', 17, '여러 양을 공통 기준량으로 통일');
    for (const specimen of DATA.specimens) {
      if (skeleton(specimen.problem.prompt) === skeleton(text)) give(specimen.proposedTypeId, 25, '기존 검산 문항과 문장 구조가 일치');
    }
    const rankedSources = corpus.map(row => ({ row, score: similarity(text, row.action) })).sort((a, b) => b.score - a.score);
    const best = rankedSources[0];
    if (best && !best.row.giftedSourceBridge && best.score > 0.56) for (const id of best.row.typeIds || []) if (!byType[id]?.requiresWall || /벽/.test(n)) give(id, 9, '기존 분석 문구와 높은 구조 유사성이 있음');
    const ranked = [...scores.values()].sort((a, b) => b.score - a.score);
    return { ranked: ranked.slice(0, 3), broadMatches: rankedSources.filter(r => r.score > 0.22).slice(0, 5), method: 'structure-rules-and-existing-evidence', supportedTypes: DATA.types.length };
  }
  function difficulty(text, typeId) {
    const generated=[...(DATA.somaGeneratedVariants||[]),...(DATA.runtimeGeneratedExamples||[])].filter(s=>s.proposedTypeId===typeId&&normalize(s.problem.prompt)===normalize(text));
    if(generated.length){const held=generated.some(s=>s.normalization.requiresVisualContext||s.commonBandCandidate==null);return {bands:held?[]:[...new Set(generated.map(s=>s.commonBandCandidate))],reason:held?'변형 문항의 실제 그림·조건과 응답을 함께 확인해야 합니다. 텍스트만으로 난도를 정하지 않습니다.':generated[0].normalization.difficultyReason};}
    if(DATA.somaSourceReuse&&corpus.some(r=>r.somaReuseStage&&r.typeIds.includes(typeId)&&normalize(r.action)===normalize(text)))return {bands:[],reason:'기존 소마 분석의 행동 문구입니다. 출처별 난도 후보와 인쇄 발판·응답·보류를 보존했으며, 이 입력의 공통 난도나 원문 답을 새로 승인하지 않았습니다.'};
    const held=DATA.specimens.find(s=>s.proposedTypeId===typeId&&s.studentPresentation?.supportDiagramRemoved&&normalize(s.problem.prompt)===normalize(text));
    if(held)return {bands:[],reason:held.studentPresentation.reason};
    const matches=globalThis.GFieldA1?.matchExamples(DATA,text)||[];
    const contract=matches.find(c=>c.typeId===typeId&&c.exact)||matches.find(c=>c.typeId===typeId);
    if(contract)return {bands:contract.exact&&!contract.normalization.requiresVisualContext?[contract.normalization.candidateBand]:[],reason:(contract.normalization.requiresVisualContext?'그림에 주어진 모양·점·선·수와 지문 조건을 함께 확인해야 합니다. 글자만으로 난도를 정하지 않습니다. ':contract.exact?'확인한 기존 예시의 연구 난도입니다. ':'수치가 달라진 문장 구조 후보입니다. 수 범위·끝 조건 확인 후 난도를 정합니다. ')+'필요한 능력: '+contract.normalization.minimumCapabilities.join(' · ')};
    if(DATA.crossBookAlignment&&['QR05','QR06','QR08','QR09','QR10','QR15'].includes(typeId))return {bands:[],reason:'현재 확인한 예시와 수치·조건·구할 것이 다른 입력입니다. 초기 상태·변화·인쇄 발판을 확인한 뒤 연구 난도를 정합니다.'};
    if(byType[typeId]?.normalizationOnly)return {bands:[],reason:'구할 것·실제 수·그림·끝 조건에 맞는 응답 기준을 확인해야 합니다. 교재 과정이나 생성기 설정으로 난도를 정하지 않습니다.'};
    if(/^PT0[1-5]$/.test(typeId))return {bands:[],reason:'실제 칸·시작선·제외 칸·표시 위치·회전/뒤집기 규약과 선택/전체 그리기 응답을 확인해야 합니다. 칸 수나 생성기 설정만으로 난도를 정하지 않습니다.'};
    if(/^MG0[1-8]$/.test(typeId))return {bands:[],reason:'주어진 수의 실제 위치·목표 한 칸/전체·합의 제시 여부·카드 재고·대각선·최댓값/최솟값을 확인해야 합니다. 칸 수만으로 난도를 올리거나1~9·중복 금지를 자동 가정하지 않습니다. 복수 정답 배치와 목표 값의 유일성도 구별합니다.'};
    if(/^NC0[1-5]$/.test(typeId))return {bands:[],reason:'보기의 수·칸 배치·색칠/동그라미·추의 재고와 놓는 쪽·읽기/그리기 응답을 확인한 뒤 난도를 정합니다. 도형값은0~9로 제한되지 않습니다. 같은 값을 가진 칸은 정답 배치가 여럿일 수 있으며, 보기만으로 정한 값과 추가로 추론한 규칙을 구별합니다.'};
    if(/^CR0[1-3]$/.test(typeId))return {bands:[],reason:'기호의 자리·인쇄 숫자·가수의 수·받아올림·연결된 식·요구 응답을 확인하기 전에는 입력 난도를 정하지 않습니다. 각 기호는0~9이며 서로 다른 기호끼리만 다른 값입니다. 기호와 인쇄 숫자는 같아도 되고, 여러 자리 수의 맨 앞0은 제외합니다. 이미지 OCR은 기호와 자리 배치를 놓칠 수 있어 원본 대조가 필요합니다.'};
    if(typeId==='QR11'&&/속도|빠르기/.test(text)&&/만났|만나/.test(text)&&!/동시|같은\s*시각|이동\s*시간.*같/.test(text))return {bands:[],reason:'속도비를 거리비로 쓰려면 이동 시간이 같아야 합니다. 같은 시각 출발·일정한 빠르기 조건을 확인하기 전에는 입력의 답과 난도를 확정하지 않습니다.'};
    if(/^UL0[1-8]$/.test(typeId))return {bands:byType[typeId].candidateBandRange,reason:'관련 원문의 단위·주어진 눈금/구간·접힘·수 범위·응답 수를 확인한 조건부 연구 범위입니다. 실제 자로 재는 입력은 인쇄 배율도 확인해야 하며 교과 학년을 최소 수준으로 바꾸지 않습니다.'};
    if(/^FP0[1-4]$/.test(typeId))return {bands:byType[typeId].candidateBandRange,reason:'같은 조각이라는 조건·그려진 등분선·안내점·색칠/분수 응답을 함께 확인한 조건부 범위입니다. 조각 수나 분모가 크다는 이유만으로 난도를 올리지 않습니다.'};
    if(/^UA0[1-5]$/.test(typeId))return {bands:byType[typeId].candidateBandRange,reason:'관련 검산 문항의 조건부 연구 범위입니다. 입력 그림의 모눈·분할·초기 넓이 단위·합/마지막 항·안내 발판을 확인하기 전에는 이 입력의 난도를 확정하지 않습니다.'};
    if(byType[typeId]?.requiresInventoryForDifficulty)return {bands:[],reason:'조각의 모양·크기·재고와 목표 윤곽을 함께 확인해야 합니다. 새 검산 문항의 중(3)은 명시된 조각·재고·고정 조건의 연구값이며, 문장만 같은 입력에 자동 적용하지 않습니다.'};
    const exact = DATA.specimens.find(s => s.commonBandCandidate != null && normalize(s.problem.prompt) === normalize(text));
    if (exact?.studentPresentation?.supportDiagramRemoved) return {bands:[],reason:exact.studentPresentation.reason};
    if (exact && exact.commonBandCandidate!=null) return { bands: [exact.commonBandCandidate], reason: exact.difficultyBasis + ' · 기존 검산 문항의 동일 문장' };
    if (byType[typeId]?.candidateBandRange) return { bands: byType[typeId].candidateBandRange, reason: byType[typeId].candidateBandRange.length ? '기존 관련 문항의 조건부 비교 범위입니다. 입력의 그림·발판·요구 응답을 확인하기 전에는 이 입력의 난도를 확정하지 않습니다.' : '이 세부유형에 재사용할 공통 난도 근거가 없어 판정을 보류합니다. 교재의 학습 단계를 공통 난도로 바꾸지 않습니다.' };
    if (['QR11', 'QR12'].includes(typeId)) return /식|□|방정식/.test(text) ? { bands: [3], reason: '수 계산에 더해 미지수 식을 구성하는 조건부 연구 후보' } : { bands: [2, 3], reason: '인쇄된 묶음 그림·단계 안내가 있으면 하(2), 관계식을 스스로 구성하면 중(3) 후보. 입력의 발판을 확인해 주세요.' };
    const fixed = { QR04: 3, QR05: 3, QR06: 3, QR07: 3, QR08: 4, QR10: 3, QR13: 3, QR15: 3, QR16: 3 };
    return { bands: fixed[typeId] ? [fixed[typeId]] : [2, 3], reason: '기존 같은 풀이 구조의 조건부 난도 근거를 적용한 후보입니다. 수 범위·그림·발판·요구 응답이 달라지면 조정합니다.' };
  }
  const inputSection = document.createElement('section');
  inputSection.className = 'input-panel no-print';
  inputSection.innerHTML = `<h2>문제로 유형 찾기</h2><p class="meta">${DATA.inputScope.families.join('·')} ${DATA.types.length}유형에서 후보와 유사 교재 위치를 찾습니다.</p><div class="input-grid"><div><label for="problem-text">문제 텍스트</label><textarea id="problem-text" rows="5" placeholder="문제를 붙여 넣거나 오른쪽에서 이미지를 선택하세요."></textarea><div class="input-actions"><button id="analyze" class="primary">유형·유사문제 찾기</button><button id="example">예시 넣기</button></div></div><div><label for="problem-image">문제 이미지</label><input id="problem-image" type="file" accept="image/*"><img id="image-preview" alt="입력한 문제 미리보기" hidden><p id="ocr-status" role="status" class="meta">한 문제씩 잘라 넣으면 인식과 판별을 확인하기 쉽습니다.</p></div></div><div id="identification" aria-live="polite"></div>`;
  document.querySelector('.mast').after(inputSection);
  const lookup = document.createElement('details'); lookup.className = 'lookup-panel no-print';
  lookup.innerHTML = `<summary>책·단원·문제번호로 찾기 <span class="meta">기존 위치 색인 ${corpus.length}건</span></summary><div class="lookup-controls"><label>책 <select id="lookup-book"><option value="">전체 책</option></select></label><label>단원 <select id="lookup-unit"><option value="">전체 단원</option></select></label><label>문제·쪽수·검색어 <input id="lookup-query" placeholder="유제 02, 27쪽, 합과 차"></label></div><p id="lookup-count" class="meta"></p><div id="lookup-results"></div>`;
  inputSection.after(lookup);
  const books = [...new Set(corpus.map(r => r.book))].sort((a, b) => a.localeCompare(b, 'ko'));
  el('lookup-book').innerHTML += books.map(book => `<option>${escape(book)}</option>`).join('');
  function chapterOptions() {
    const book = el('lookup-book').value;
    const rows = corpus.filter(r => !book || r.book === book);
    const units = new Map();
    for (const row of rows) { if(row.printedIssue&&row.unitNumber==null)units.set('issue:'+row.printedIssue,row.printedIssue+(row.unitTitle?' · '+row.unitTitle:'')); else if (row.unitNumber != null) units.set(String(row.unitNumber), `${row.unitNumber}단원${book && row.unitTitle ? ' · ' + row.unitTitle : ''}`); else if(row.unitTitle) units.set('title:'+row.unitTitle, row.unitTitle+' · 단원 번호 확인 중'); }
    el('lookup-unit').innerHTML = '<option value="">전체 단원</option>' + [...units].sort((a, b) => Number(a[0]) - Number(b[0])).map(([value, label]) => `<option value="${escape(value)}">${escape(label)}</option>`).join('');
    browse();
  }
  function rowMarkup(row, index) {
    const candidates = row.commonTypeMapping?.status === 'native-id-candidate-needs-item-conditions';
    const native = row.giftedSourceBridge ? `<p class="meta">기존 은행 유형 · ${(row.originalTypes || []).map(t => escape(t.label || t.id)).join(' · ')}<br>학습 단계 · ${escape(row.historicalScale?.value || '')} · 통합 난도는 개별 문항 조건 확인 후 판정</p>` : '';
    const buttons = (row.typeIds || []).map(id => `<button class="locate-type" data-row="${index}" data-type="${escape(id)}">${candidates ? '연결 후보 · '+escape(byType[id]?.name || id) : '이 유형의 지도·문항 보기'}</button>`).join(' ');
    return `<article class="source-card" data-source-id="${escape(row.id)}" tabindex="0"><div class="book">${escape(position(row))}</div><p class="meta">${escape(row.edition || '판본 정보 확인 중')}${row.evidenceLevel === 'chapter-mapping' ? ' · 단원 범위의 관련 후보' : ''}</p><h4>${escape(row.action)}</h4>${native}<p class="meta">${(row.typeIds || []).map(id => escape(byType[id]?.name || id)).join(' · ') || (!row.giftedSourceBridge ? (row.originalTypes || []).map(t => escape(t.label || t.id)).join(' · ') : '')}</p>${buttons || `<p class="meta">${row.giftedSourceBridge ? '기존 은행에 등록된 유형입니다. 통합 유형·난도 대응은 확인 중입니다.' : '기존 분석 색인입니다. 현재 연결한 유형군과의 대응은 추가 확인 대상입니다.'}</p>`}${candidates ? '<p class="meta">기존 유형 ID가 같은 연결 후보입니다. 문제 조건·응답과 난도가 같다는 뜻은 아닙니다.</p>' : ''}</article>`;
  }
  function rankWithProvider(text) {
    const result=rankText(text);
    const reviewedIds=new Set([...(DATA.reviewedNativeReuse?.specimenProofs||[]),...(DATA.sourceBoundReview?.specimenProofs||[])].map(p=>p.instanceId));
    const reviewedMatches=DATA.specimens.filter(s=>reviewedIds.has(s.instanceId)&&skeleton(s.problem.prompt)===skeleton(text));
    const nativeMatches=String(text).length<15?[]:[...(DATA.providerSpecimens||[]),...(DATA.normalizationExamples||[])].map(s=>({instanceId:s.instanceId,typeId:s.typeId,label:s.normalizedDisplayName||s.name,score:similarity(text,s.problem.prompt),sourcePositionIds:s.sourcePositionIds,method:'saved-native-example-sentence-structure',commonDifficultyApproved:false})).filter(r=>r.score>=0.64).sort((a,b)=>b.score-a.score).slice(0,3);
    if(result.method.startsWith('exact-'))return {...result,nativeMatches,reviewedMatches,contractMatches:globalThis.GFieldA1?.matchExamples(DATA,text)||[]};
    const contracts=globalThis.GFieldA1?.matchExamples(DATA,text)||[];
    const responseId=s=>globalThis.NativeRuntime?.responseCommonType(s.typeId)||s.proposedTypeId;
    const ids=new Set([...reviewedMatches.map(responseId),...contracts.map(c=>c.typeId)]);
    const ranked=[...new Map(reviewedMatches.map(s=>[responseId(s),{id:responseId(s),score:25,reasons:['기존 검산 예시의 문장 구조와 응답 기준 연결 · 그림과 구할 것을 함께 확인']}])).values(),...new Map(contracts.filter(c=>!reviewedMatches.some(s=>responseId(s)===c.typeId)).map(c=>[c.typeId,{id:c.typeId,score:20,reasons:['구할 것과 응답 형태를 나눈 기존 예시와 문장 구조가 같음']}])).values(),...result.ranked.filter(r=>!ids.has(r.id))].slice(0,3);
    return {...result,ranked,nativeMatches,contractMatches:contracts,reviewedMatches};
  }
  function reviewedMatchesMarkup(result){
    if(!result.reviewedMatches?.length)return '';
    const seen=new Set(),samples=result.reviewedMatches.filter(s=>{const binding=DATA.sourceBoundReview?.bindings.find(b=>b.reviewedSpecimenIds.includes(s.instanceId));const k=s.typeId+':'+s.proposedTypeId+':'+(binding?.kind||'');if(seen.has(k))return false;seen.add(k);return true;});
    return `<section class="native-input-matches"><h3>기존에 검산한 유사 예시</h3><p class="meta">문장 구조로 찾은 기존 예시입니다. 입력한 문제의 그림·수·응답과 난도가 같은지는 별도 확인합니다.</p>${samples.map(s=>{const row=corpus.find(r=>r.reviewedSpecimenIds?.includes(s.instanceId));return `<article><h4>${escape(s.name)}</h4><p>${escape(position(row))}</p><button data-preview-source="${escape(row.id)}" data-reviewed-instance="${escape(s.instanceId)}">검산한 예시·풀이 보기</button></article>`;}).join('')}</section>`;
  }
  function providerMatchesMarkup(result) {
    if(!result.nativeMatches?.length)return '';
    return `<section class="native-input-matches"><h3>문장 구조가 비슷한 필즈 은행 유형</h3><p class="meta">기존 생성 예시와 비교한 후보입니다. 그림 조건·응답을 확인해야 하며, 통합 난도와 원문 일치를 확정한 결과는 아닙니다.</p>${result.nativeMatches.map(m=>{
      const positions=(m.sourcePositionIds||[]).map(id=>corpus.find(r=>r.id===id)).filter(Boolean);
      return `<article><h4>${escape(m.label)}</h4><ul>${positions.slice(0,4).map(r=>`<li>${escape(position(r))}</li>`).join('')}</ul>${positions[0]?`<button data-preview-source="${escape(positions[0].id)}" data-provider-instance="${escape(m.instanceId)}">은행 유사문제·정답 보기</button>`:''}<p class="meta">${positions.length}개 교재 위치에 등록된 은행 유형 · 원문 조건별 동등성은 확인 전</p></article>`;
    }).join('')}</section>`;
  }
  let browsed = [];
  function browse() {
    const book = el('lookup-book').value, unit = el('lookup-unit').value;
    const query = normalize(el('lookup-query').value);
    const exactKey=corpus.some(row=>row.id===el('lookup-query').value.trim())?el('lookup-query').value.trim():null;
    browsed = corpus.filter(row => (!book || row.book === book) && (!unit || (unit.startsWith('issue:') ? row.printedIssue===unit.slice(6) : unit.startsWith('title:') ? row.unitTitle===unit.slice(6) : String(row.unitNumber) === unit)) && (exactKey ? row.id===exactKey : !query || normalize([position(row), row.action, row.locator, row.id, ...(row.originalPreviews||[]).flatMap(p=>[p.questionNumber,'인쇄 '+p.printedPage+'쪽','PDF '+p.pdfPage+'쪽']), ...(row.typeAliases||[]), ...(row.typeIds||[]).flatMap(id=>[byType[id]?.name,...(byType[id]?.aliases||[])]), ...(row.originalTypes || []).flatMap(t=>[t.id,t.label])].join(' ')).includes(query)));
    el('lookup-count').textContent = `${browsed.length}건 · 앞 ${Math.min(60, browsed.length)}건 표시. 판본이 다른 위치는 각각 확인하세요.`;
    let progress=el('lookup-bank-coverage');if(!progress){progress=document.createElement('p');progress.id='lookup-bank-coverage';progress.className='meta';el('lookup-count').after(progress);}
    const bookCoverage=DATA.giftedCommonTypeCoverage?.books.find(r=>r.book===el('lookup-book').value);progress.hidden=!bookCoverage;progress.textContent=bookCoverage?`이 책의 기존 은행 분류 ${bookCoverage.nativeTypes}개 중 ${bookCoverage.nativeTypesWithAnyReviewedRepresentative??bookCoverage.nativeTypesWithReviewedExample??bookCoverage.nativeTypesWithNormalizedExample}개에 대표 유형 후보를 연결했습니다. 본문 ${bookCoverage.bodyPositions}개 위치의 개별 조건·난도 동등성은 별도 확인합니다.${bookCoverage.sourceBoundReviewedPositions?' 이 중 '+bookCoverage.sourceBoundReviewedPositions+'곳은 원문 조건에 맞춘 검산 예시를 따로 연결했습니다.':''}`:'';
    el('lookup-results').innerHTML = browsed.slice(0, 60).map(rowMarkup).join('') || '<p class="empty">조건에 맞는 기존 색인이 없습니다.</p>';
    for (const button of el('lookup-results').querySelectorAll('.locate-type')) button.onclick = () => showType(button.dataset.type || browsed[Number(button.dataset.row)].typeIds[0]);
  }
  function showType(id) {
    el('lookup-results').closest('main').classList.remove('bank-position-only');
    if (mode === 'curriculum') { mode = 'both'; for (const button of document.querySelectorAll('[data-mode]')) button.setAttribute('aria-pressed', String(button.dataset.mode === mode)); }
    type = id; el('type').value = id; el('book').value = ''; el('band').value = ''; render();
    el('type-position').scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  el('lookup-book').onchange = chapterOptions; el('lookup-unit').onchange = browse; el('lookup-query').oninput = browse;
  function analyze() {
    const text = el('problem-text').value.trim();
    if (text.length < 5) { el('identification').textContent = '문제의 조건과 구할 것을 넣어 주세요.'; return; }
    const result = rankWithProvider(text);
    if (!result.ranked.length) {
      el('identification').innerHTML = (result.nativeMatches.length?providerMatchesMarkup(result):'<p class="empty">현재 연결된 유형에서 근거 있는 후보를 찾지 못했습니다. 문제의 규칙과 구할 것, 그림의 수·표식을 확인해 주세요.</p>') + result.broadMatches.map((match, i) => rowMarkup(match.row, i)).join('');
      for (const button of el('identification').querySelectorAll('.locate-type')) button.onclick = () => showType(button.dataset.type || result.broadMatches[Number(button.dataset.row)].row.typeIds[0]);
      return result;
    }
    const top = result.ranked[0], assessment = difficulty(text, top.id);
    if(byType[top.id].requiresVisualContext)assessment.reason+=' '+(byType[top.id].visualContextNotice||'그림의 가림·접기 순서·경계를 확인해야 합니다. OCR만으로 도형이나 정답을 확정하지 않습니다.');
    const matches = DATA.sourceRecords.filter(r => r.typeIds.includes(top.id) && !r.instructionalExample).map(row => ({ row, score: similarity(text, row.action) })).sort((a, b) => b.score - a.score);
    const seen = new Set(), nearby = [];
    for (const entry of matches) if (!seen.has(entry.row.book)) { nearby.push(entry); seen.add(entry.row.book); }
    for (const entry of matches) if (!nearby.includes(entry)) nearby.push(entry);
    nearby.splice(8);
    el('identification').innerHTML = `<div class="identification-grid"><div><h3>유형 후보 · ${escape(byType[top.id].name)}</h3><p>${top.reasons.map(escape).join(' · ')}</p><p class="difficulty">난도 후보 ${assessment.bands.length ? assessment.bands.join('~') : '확인 중'}</p><p class="meta">${escape(assessment.reason)}</p><button id="locate-analysis" class="primary">계통도 위치와 유사문항 보기</button><h4>교과 연계 학기·단원</h4><ul class="curriculum-results">${curriculumMarkup(top.id)}</ul><p class="meta">교과 연계는 선택 풀이·후속 활용의 위치입니다. 필요한 능력은 지도 아래에서 확인할 수 있습니다.</p><details><summary>다른 유형 후보</summary>${result.ranked.slice(1).map(candidate => `<p>${escape(byType[candidate.id].name)} · ${candidate.reasons.map(escape).join(' · ')}</p>`).join('') || '추가 후보 없음'}</details></div><div><h3>유사한 책·단원·문제번호</h3>${nearby.map((entry, index) => rowMarkup(entry.row, index)).join('')}</div></div>`;
    el('identification').insertAdjacentHTML('afterbegin',reviewedMatchesMarkup(result)+providerMatchesMarkup(result));
    el('locate-analysis').onclick = () => showType(top.id);
    for (const button of el('identification').querySelectorAll('.locate-type')) button.onclick = () => showType(button.dataset.type || nearby[Number(button.dataset.row)].row.typeIds[0]);
    return result;
  }
  el('analyze').onclick = analyze;
  el('example').onclick = () => { el('problem-text').value = '두 수의 합은 36이고 큰 수는 작은 수의 2배입니다. 큰 수를 구하세요. 작은 수를 □로 놓아 조건에 맞는 식도 쓰세요.'; analyze(); };
  el('problem-image').onchange = async () => {
    const file = el('problem-image').files[0]; if (!file) return;
    el('ocr-status').textContent = '이미지에서 문제 글자를 읽고 있습니다.';
    try {
      if (file.size > 16 * 1024 * 1024) throw Error('16MB 이하의 이미지로 넣어 주세요.');
      const bitmap = await createImageBitmap(file);
      const scale = Math.min(1, 3200 / Math.max(bitmap.width, bitmap.height));
      const canvas = document.createElement('canvas'); canvas.width = Math.round(bitmap.width * scale); canvas.height = Math.round(bitmap.height * scale);
      canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height); bitmap.close();
      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
      const preview = el('image-preview'); if (preview.dataset.url) URL.revokeObjectURL(preview.dataset.url);
      preview.dataset.url = URL.createObjectURL(blob); preview.src = preview.dataset.url; preview.hidden = false;
      if (location.protocol === 'file:') throw Error('이미지 인식은 Mac 로컬 실행 주소 http://127.0.0.1:18768/thinking-map/ 에서 사용할 수 있습니다. 텍스트 검색은 이 파일에서도 동작합니다.');
      const response = await fetch('/api/ocr', { method: 'POST', headers: { 'Content-Type': 'image/png' }, body: blob });
      const data = await response.json(); if (!response.ok) throw Error(data.error || '이미지 인식에 실패했습니다.');
      el('problem-text').value = data.text;
      el('ocr-status').textContent = `Apple Vision · ${data.cacheHit ? '기존 인식 재사용' : '로컬 인식 완료'}. 그림 속 수량·기호와 읽힌 글자를 확인한 뒤 판별 결과를 살펴보세요.`;
      analyze();
    } catch (error) { el('ocr-status').textContent = error.message; }
  };
  const previousGraph = graph;
  Object.assign(related, { SQ03: ['SQ02'], VN01: ['VN02'] });
  const families = [...new Set(DATA.types.map(t => t.family || '수량 관계'))];
  const familyControl = document.createElement('label');
  familyControl.innerHTML = '유형군 <select id="family">' + families.map(f => `<option>${escape(f)}</option>`).join('') + '</select>';
  document.querySelector('.controls').prepend(familyControl);
  for (const [value, label] of [['1', '기초 · 1'], ['5', '심화 탐구 · 5']]) { const option = document.createElement('option'); option.value = value; option.textContent = label; el('band').append(option); }
  el('type').innerHTML = families.map(f => `<optgroup label="${escape(f)}">${DATA.types.filter(t => (t.family || '수량 관계') === f).map(t => `<option value="${t.id}">${escape(t.name)}</option>`).join('')}</optgroup>`).join('');
  el('type').value = type;
  el('family').onchange = () => showType(DATA.types.find(t => t.family === el('family').value).id);
  const familyExamples = {
    '도형 구성': '조각을 돌려 목표 모양을 빈틈없이 채우세요.',
    '달력': '달력에서 매주 토요일의 날짜를 모두 찾으세요.',
    '시각·시간': '두 시계는 시작 시각과 끝 시각을 나타냅니다. 걸린 시간은 몇 시간인지 구하세요.',
    '수열·규칙': '3부터 5씩 뛰어 센 수열의 20번째 수를 구하세요.',
    '벤다이어그램': '첫 활동은 18명, 둘째 활동은 20명이고 둘 다 하는 학생은 8명입니다. 적어도 한 활동을 하는 학생은 몇 명인가요?',
    '쌓기나무': '쌓기나무를 위, 앞, 옆에서 본 모양을 보고 가능한 최대 개수와 최소 개수를 구하세요.',
    '종이접기': '색종이를 두 번 접고 잘라 펼쳤을 때 생기는 조각 수를 구하세요.',
    '마방진': '3×3 마방진의 가로, 세로, 대각선의 합이 같습니다. 첫째 줄은 8, 1, 6이고 둘째 줄은 3, 5, 7이고 셋째 줄은 4, 9, □입니다. 빈 한 칸의 수를 구하세요.'
  };
  const quantityExample = el('example').onclick;
  el('example').onclick = () => { const text = familyExamples[el('family').value]; if (text) { el('problem-text').value = text; analyze(); } else quantityExample(); };
  graph = function () {
    el('type-position')?.remove();
    previousGraph();
    const family = byType[type].family || '수량 관계';
    el('family').value = family;
    if (family !== '수량 관계' || DATA.a1Normalization) {
      const nodes = DATA.types.filter(t => t.family === family), positions = Object.fromEntries(nodes.map((t, i) => [t.id, [30 + (i % 3) * 350, 35 + Math.floor(i / 3) * 190]]));
      const edges = DATA.edges.filter(e => positions[e.from] && positions[e.to]);
      let svg = `<svg class="thinking-svg" viewBox="0 0 1080 ${Math.ceil(nodes.length / 3) * 190 + 20}" role="img" aria-label="${escape(family)} 연결 지도"><defs><marker id="family-arrow" markerWidth="10" markerHeight="8" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#bc7244"/></marker></defs>`;
      for (const edge of edges) {
        const [ax, ay] = positions[edge.from], [bx, by] = positions[edge.to];
        const vertical = ay !== by;
        const sx = vertical ? ax + 125 : ax + (bx > ax ? 250 : 0), sy = vertical ? ay + (by > ay ? 95 : 0) : ay + 47;
        const tx = vertical ? bx + 125 : bx + (bx > ax ? 0 : 250), ty = vertical ? by + (by > ay ? 0 : 95) : by + 47;
        svg += `<path d="M${sx} ${sy} C${sx} ${sy + (vertical ? 50 : 0)},${tx} ${ty - (vertical ? 50 : 0)},${tx} ${ty}" fill="none" stroke="#bc7244" stroke-width="5" marker-end="url(#family-arrow)"><title>${escape(edge.label)}</title></path>`;
      }
      for (const node of nodes) {
        const [x, y] = positions[node.id], selected = node.id === type;
        const words = node.name.split(' '), lines = [''];
        for (const word of words) { const last = lines.length - 1; if ((lines[last] + ' ' + word).length > 17 && lines[last]) lines.push(word); else lines[last] += (lines[last] ? ' ' : '') + word; }
        svg += `<g data-family-node="${node.id}" tabindex="0" role="button" aria-label="${escape(node.name)}"><rect x="${x}" y="${y}" width="250" height="95" rx="12" fill="${selected ? '#226b5b' : '#f4f7ee'}" stroke="#8fa995" stroke-width="2"/>${lines.map((line, i) => `<text x="${x + 125}" y="${y + 32 + i * 23}" text-anchor="middle" fill="${selected ? 'white' : '#193d3b'}" font-size="16">${escape(line)}</text>`).join('')}</g>`;
      }
      el('graph').innerHTML = svg + '</svg>';
      for (const node of el('graph').querySelectorAll('[data-family-node]')) { node.onclick = () => showType(node.dataset.familyNode); node.onkeydown = event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); node.click(); } }; }
    }
    el('curriculum').innerHTML = curriculumLinks(type).map(c => `<a class="concept" href="${escape(c.sourceUrl)}" target="_blank" rel="noreferrer">${escape(c.semester)}<small>${escape(c.unit)} · ${c.relationship === 'later-use' ? '후속 활용' : '선택 풀이의 교과 연계'}</small></a>`).join('');
    const neighbors = DATA.edges.filter(edge => edge.from === type || edge.to === type).map(edge => ({ id: edge.from === type ? edge.to : edge.from, label: edge.label }));
    for (const id of related[type] || []) if (!neighbors.some(row => row.id === id)) neighbors.push({ id, label: '선행·관련 유형 후보' });
    for (const [id, parents] of Object.entries(related)) if (parents.includes(type) && !neighbors.some(row => row.id === id)) neighbors.push({ id, label: '조건을 바꾼 관련 유형 후보' });
    const focus = document.createElement('section'); focus.id = 'type-position'; focus.className = 'type-position'; focus.hidden = mode === 'curriculum';
    focus.innerHTML = `<h3>선택한 유형의 위치</h3><div class="focus-layout"><div class="focus-current"><small>선택한 유형 · ${escape(type)}</small><strong>${escape(byType[type].name)}</strong></div><div class="focus-neighbors">${neighbors.length ? neighbors.map(row => `<div class="focus-branch"><span class="focus-line" aria-hidden="true"></span><div><small>${escape(row.label)}</small><button data-focus-type="${escape(row.id)}">${escape(byType[row.id].name)}</button></div></div>`).join('') : '<p class="meta">이 유형의 연결 관계는 추가 확인 중입니다.</p>'}</div></div><p class="meta">선은 풀이·조건의 연결 후보입니다. 학습 순서나 난도의 오름차순을 뜻하지 않습니다.</p>`;
    el('graph').after(focus);
    const continuations=(DATA.capabilityConnections||[]).filter(r=>r.typeIds.includes(type));
    if(continuations.length)focus.insertAdjacentHTML('beforeend',`<div class="capability-continuation"><h4>이어지는 활용 문제</h4><p class="meta">기존 분석에서 가져온 관련 능력·후속 활용입니다. 현재 유형이나 난도가 같다는 뜻은 아닙니다.</p>${continuations.map(c=>{const r=corpus.find(row=>row.id===c.sourceId);return r?`<p><strong>${escape(position(r))}</strong><br>${escape(c.reason)} <button data-preview-source="${escape(r.id)}">기존 기록 보기</button></p>`:'';}).join('')}</div>`);
    for (const button of focus.querySelectorAll('[data-focus-type]')) button.onclick = () => showType(button.dataset.focusType);
  };
  const previousSourceCard = sourceCard;
  sourceCard = row => previousSourceCard(row).replace('<div class="book">' + escape(row.book) + ' · ' + escape(row.locator) + '</div>', `<div class="book">${escape(position(row))}</div><p class="meta">${escape(row.edition || '기존 분석 기준')}</p>`) + `<details class="source-curriculum"><summary>교과 연계 학기·단원</summary><ul class="curriculum-results">${curriculumMarkup(row.typeIds[0])}</ul></details>`;
  relationshipNames['source-specific-conditions-verified']='학생용·교사용의 문항별 조건 대조';
  relationshipNames['related-shape-assembly-different-pieces']='같은 구성 행동 · 조각과 응답 비교';
  relationshipNames['existing-bank-type-reference'] = '기프티드 매쓰 본문 위치 색인';
  const option = document.createElement('option'); option.textContent = '필즈 더클래식'; el('book').append(option);
  el('stats').innerHTML = `${families.length}유형군 · ${DATA.types.length}세부유형 · 연결 근거 ${DATA.summary.sourceRecords}건<br>책·단원 검색 색인 ${corpus.length}건 · 검산 대표 ${DATA.specimens.length}개`+(DATA.a1Normalization?`<br>응답별 통합 예시 ${DATA.summary.normalizedResponseProfiles}개(저장 은행 ${DATA.providerSpecimens.length}·기존 응답 분기 ${DATA.normalizationExamples.length}·새 연계 ${DATA.summary.sourceAlignedNewExamples||0}) · 필즈 은행 예시 ${DATA.providerSpecimens.length}개`:DATA.providerSpecimens?`<br>필즈 은행 예시 ${DATA.providerSpecimens.length}개`:'');
  document.querySelector('.mast h1').textContent = '사고력 유형·교재 연결 지도';
  document.title = '사고력 유형 · 입력 검색과 연결 지도';
  chapterOptions(); render();
  window.QuantitySearch = { rankText:rankWithProvider, difficulty, position, analyze, browse, curriculumLinks };
}());
