/* 중등 핵심 연산 선행 — 기존 C29~37과 기록을 대체하지 않는 권장 편성.
 * 7주·주 2회 권장. 쉬운 갈래12·핵심24·집중 반복36, 시간은 개인차.
 * 디딤돌 개념연산의 개념 순서를 참고한 자체 편성이지 출판사의 공식 진도표가 아니다.
 * 기본 14회는 1학기 연산을 빠르게 훑고, 확인된 2학기 비도형 유형은 supplementary와
 * 정규 과정에서 이어 간다. 도형과 근거 원문이 없는 단원은 포함하지 않는다.
 */
(function (w) {
  'use strict';
  const drill = (t, lv, n, role) => ({ t, lv, n, role: role || 'practice' });
  const drawing = (mode, title) => ({ kind:'drawing', mode, n:6, role:'graph-drawing', title });
  const lesson = (grade, index, title, blocks, extra) => Object.assign({
    id:`M${grade}-S${String(index).padStart(2,'0')}`, title,
    week:Math.ceil(index / 2), day:(index - 1) % 2 + 1,
    minutes:null, timeNote:"개인차 · 충분히 풀고 마무리", checkpoint:false, blocks
  }, extra || {});
  const grades = {
    1: {
      grade:1, semester:1, title:'중1-1 핵심 연산 선행', courseKeys:['C29','C30','C31'],
      scope:'소인수분해부터 정수·유리수, 문자와 식, 일차방정식, 정비례·반비례까지',
      notes:['유한소수·순환소수는 중2-1에서 다룹니다.', '중1-2 비기하 통계는 아래 대표값 보충에서 이어갑니다. 확인되지 않은 도수표 이후 내용은 넣지 않았습니다.', '빠진 세부 갈래와 부족한 유형은 기존 과정에서 더 연습합니다.'],
      supplementary:[
        {t:'MD84',lv:1,n:12,reason:'홀수 개 자료의 중앙값 — 정렬 뒤 한가운데 찾기'},
        {t:'MD84',lv:2,n:12,reason:'짝수 개 자료의 중앙값 — 가운데 두 값의 평균'},
        {t:'MD84',lv:3,n:12,reason:'단일 최빈값 기본 연습'},
        {t:'MD84',lv:4,n:24,reason:'복수 최빈값을 빠짐없이 쓰는 집중 연습'},
        {t:'MD84',lv:5,n:24,reason:'범주 자료의 최빈 항목 집중 연습'},
        {t:'MD84',lv:6,n:24,reason:'평균·중앙값·최빈값 종합 집중 연습'}
      ],
      sessions:[
        lesson(1,1,'소수와 소인수분해',[drill('DV8',1,12),drill('DV8',2,24),drill('DV8',3,12)]),
        lesson(1,2,'최대공약수와 최소공배수',[drill('DV7',2,24),drill('DV7',3,24)]),
        lesson(1,3,'정수·유리수의 위치와 절댓값',[drill('MD82',1,12),drill('MD82',2,12),drill('MD1',1,12)]),
        lesson(1,4,'대소 관계와 수직선 위 거리',[drill('MD1',3,12),drill('MD1',4,24),drill('MD82',3,12)]),
        lesson(1,5,'부호 있는 수의 덧셈과 뺄셈',[drill('MD2',2,24),drill('MD3',2,24)]),
        lesson(1,6,'곱셈·나눗셈과 계산 순서',[drill('MD4',4,24),drill('MD5',3,12),drill('MD6',3,24)]),
        lesson(1,7,'문자식의 뜻과 식의 값',[drill('MD47',2,12),drill('MD48',2,12),drill('MD49',1,24)]),
        lesson(1,8,'일차식과 유리수의 나눗셈',[drill('MD49',3,24),drill('MD7',2,12),drill('MD7',3,24)]),
        lesson(1,9,'등식의 성질로 방정식 풀기',[drill('MD50',1,12),drill('MD50',2,24)]),
        lesson(1,10,'양변에 미지수가 있는 방정식',[drill('MD50',3,36),drill('MD70',1,12)]),
        lesson(1,11,'거리·속력·시간과 가격',[drill('MD70',2,24),drill('MD70',3,24)]),
        lesson(1,12,'좌표와 정비례 그래프',[drill('MD68',1,12),drill('MD51',1,12),drawing('direct','표를 채우고 정비례 그래프 그리기')]),
        lesson(1,13,'반비례의 곱과 두 갈래 곡선',[drill('MD51',2,12),drill('MD69',2,12),drawing('inverse','표를 채우고 반비례 그래프 그리기')]),
        lesson(1,14,'핵심 연산 확인과 보충 선택',[drill('MD7',3,12,'check'),drill('MD49',3,12,'check'),drill('MD50',3,12,'check')],{checkpoint:true})
      ]
    },
    2: {
      grade:2, semester:1, title:'중2-1 핵심 연산 선행', courseKeys:['C32','C33','C34'],
      scope:'유리수와 순환소수, 식의 계산, 부등식·연립방정식, 일차함수',
      notes:['단항식 빈칸 역산은 기본 12문항, 넓이·부피 공식 대입은 24문항 집중 보충으로 편성합니다.', '다항식÷단항식은 기본 12문항 뒤 분수 계수·세 항 집중을 각각 24문항 보충합니다.', '중2-2 비기하 연산의 경우의 수는 실제 확인한 p.216~230만 별도 보충하며 p.232 이후·확률은 넣지 않습니다.', '마지막 회차도 새로운 활용을 배우는 수업이며, 전 단원 성취 판정은 아닙니다.'],
      supplementary:[
        {t:'MD11',lv:4,n:12,reason:'□ 안의 단항식 — 곱셈·나눗셈을 역연산으로 바꾸는 기본'},
        {t:'MD11',lv:5,n:24,reason:'넓이·부피 공식에 단항식을 대입해 계수와 지수를 정리하는 집중 연습'},
        {t:'MD13',lv:4,reason:'기본 나눗셈 12문항 — 모든 항을 같은 단항식으로 나누기'},
        {t:'MD13',lv:5,reason:'분수 계수 나눗셈 24문항 집중 연습'},
        {t:'MD13',lv:6,reason:'세 항·두 문자 나눗셈 24문항 집중 연습'},
        {t:'MD71',lv:3,reason:'활용 한 회차가 과밀해지지 않도록 별도 보충'},
        {t:'MD73',lv:2,reason:'함숫값으로 입력값을 거꾸로 구하기'},
        {t:'MD88',lv:1,n:12,reason:'중2-2 보충 — 한 사건에서 가능한 결과를 빠짐없이 세기'},
        {t:'MD88',lv:2,n:24,reason:'중2-2 보충 — 겹치지 않는 A 또는 B의 덧셈법칙'},
        {t:'MD88',lv:3,n:24,reason:'중2-2 보충 — A 다음 B의 곱셈법칙과 경로'},
        {t:'MD88',lv:4,n:24,reason:'중2-2 보충 — 서로 다른 대상을 한 줄로 세우기'},
        {t:'MD88',lv:5,n:24,reason:'중2-2 보충 — 특정 자리를 고정하고 남은 자리 세기'}
      ],
      sessions:[
        lesson(2,1,'유한소수와 순환소수의 자리 규칙',[drill('MD8',2,12),drill('MD9',1,24),drill('MD9',5,24)]),
        lesson(2,2,'순환 부분을 맞춰 분수로',[drill('MD9',3,24),drill('MD9',4,24)]),
        lesson(2,3,'지수법칙의 세 가지 구조',[drill('MD10',1,12),drill('MD10',2,24),drill('MD10',3,12)]),
        lesson(2,4,'거듭제곱의 분배와 단항식',[drill('MD10',5,24),drill('MD11',3,24)]),
        lesson(2,5,'분수 계수와 여러 괄호',[drill('MD12',4,12),drill('MD12',5,24),drill('MD13',3,24)]),
        lesson(2,6,'부등호 방향을 고르고 해 구하기',[drill('MD64',4,12),drill('MD64',2,24),drill('MD64',3,24)]),
        lesson(2,7,'조건을 부등식으로 나타내기',[drill('MD71',1,24),drill('MD71',2,24)]),
        lesson(2,8,'연립방정식의 가감법과 대입법',[drill('MD63',2,24),drill('MD63',1,24)]),
        lesson(2,9,'두 조건으로 두 미지수 구하기',[drill('MD63',3,24),drill('MD72',1,12)]),
        lesson(2,10,'거리·속력과 농도',[drill('MD72',2,24),drill('MD72',3,24)]),
        lesson(2,11,'함숫값과 직선의 기울기',[drill('MD73',1,12),drill('MD65',1,12),drill('MD74',1,12)]),
        lesson(2,12,'절편으로 일차함수 그리기',[drill('MD74',2,12),drill('MD74',3,12),drawing('linear','표와 절편으로 직선 그리기')]),
        lesson(2,13,'직선의 식과 평행이동',[drill('MD65',3,24),drill('MD74',5,12),drill('MD76',1,12)]),
        lesson(2,14,'일차함수의 활용과 교점',[drill('MD75',2,24),drill('MD75',3,12),drill('MD76',3,24)])
      ]
    },
    3: {
      grade:3, semester:1, title:'중3-1 핵심 연산 선행', courseKeys:['C35','C36','C37'],
      scope:'제곱근과 실수, 다항식의 곱셈·인수분해, 이차방정식, 이차함수',
      notes:['제곱근 대소 관계는 양수·음수·유리수 혼합의 세 단계로 연습합니다.', '켤레 유리화·치환 전개·정수와 소수 부분·이차방정식 구하기 등은 별도 보충 대상으로 남습니다.', '포물선 회차는 대응표→지나는 점→직접 그리기의 세 갈래로 구성하고, 그래프에서 a와 꼭짓점을 읽는 문제는 별도 보충으로 돌립니다.'],
      supplementary:[
        {t:'MD77',lv:3,n:12,reason:'활용 한 회차가 과밀해지지 않도록 별도 보충'},
        {t:'MD78',lv:3,n:12,reason:'대응표로 대칭을 확인한 뒤 그래프에서 a를 읽는 보충'},
        {t:'MD79',lv:3,n:12,reason:'함숫값을 대입한 뒤 두 방향 평행이동과 꼭짓점을 정리하는 보충'},
        {t:'MD86',lv:1,n:12,reason:'중3-2 보충 — 홀수 개 자료의 사분위수'},
        {t:'MD86',lv:2,n:12,reason:'중3-2 보충 — 짝수 개 자료의 사분위수'},
        {t:'MD86',lv:3,n:24,reason:'중3-2 보충 — 범위와 사분위수 범위'},
        {t:'MD86',lv:4,n:24,reason:'중3-2 보충 — 다섯 수 요약'},
        {t:'MD86',lv:5,n:24,reason:'중3-2 보충 — 완성 상자그림 읽기'},
        {t:'MD86',lv:6,n:24,reason:'중3-2 보충 — 빈 눈금에 상자그림 직접 그리기'},
        {t:'MD87',lv:1,n:12,reason:'중3-2 보충 — 표의 순서쌍을 산점도에 직접 찍기'},
        {t:'MD87',lv:2,n:24,reason:'중3-2 보충 — 조건에 맞는 점 세기'},
        {t:'MD87',lv:3,n:12,reason:'중3-2 보충 — 양·음·무상관 판단'},
        {t:'MD87',lv:4,n:24,reason:'중3-2 보충 — 상관관계의 방향과 강도 판단'}
      ],
      sessions:[
        lesson(3,1,'제곱근의 뜻·절댓값과 양수 비교',[drill('MD15',1,12),drill('MD15',3,12),drill('MD15',4,12)]),
        lesson(3,2,'음수·유리수 혼합 대소 비교',[drill('MD15',5,12),drill('MD15',6,24),drill('MD16',3,24)]),
        lesson(3,3,'근호의 곱셈·유리화와 덧뺄셈',[drill('MD17',3,12),drill('MD18',3,24),drill('MD83',2,24)]),
        lesson(3,4,'괄호와 분모가 있는 근호 계산',[drill('MD83',4,24),drill('MD83',5,24)]),
        lesson(3,5,'곱셈공식의 기본 구조',[drill('MD19',2,12),drill('MD19',3,12),drill('MD19',1,24)]),
        lesson(3,6,'공식으로 값과 식 정리하기',[drill('MD19',4,24),drill('MD19',5,24),drill('MD19',7,12)]),
        lesson(3,7,'공통인수와 완전제곱·합차',[drill('MD20',5,24),drill('MD20',3,12),drill('MD20',4,12)]),
        lesson(3,8,'이차식의 인수분해',[drill('MD20',2,24),drill('MD20',6,36)]),
        lesson(3,9,'인수분해와 완전제곱으로 방정식 풀기',[drill('MD66',1,12),drill('MD66',2,24),drill('MD66',5,12)]),
        lesson(3,10,'근의 공식과 실근의 개수',[drill('MD66',3,24),drill('MD66',4,24),drill('MD66',6,12)]),
        lesson(3,11,'실제 조건에 맞는 근 고르기',[drill('MD77',1,24),drill('MD77',2,24)]),
        lesson(3,12,'포물선의 대응표와 지나는 점',[drill('MD78',4,12),drill('MD79',4,12),drawing('quadratic','표·꼭짓점·대칭축으로 포물선 그리기')]),
        lesson(3,13,'조건에 맞는 이차함수의 식',[drill('MD67',2,24),drill('MD67',3,24),drill('MD81',1,12)]),
        lesson(3,14,'이차함수의 활용과 최대·최소',[drill('MD80',1,24),drill('MD80',2,24),drill('MD81',2,12)])
      ]
    }
  };
  w.NM_MIDDLE_PACING = {
    version:'2026-09-24', weeks:7, sessionsPerWeek:2, grades,
    getSession(grade, id) {
      const plan = grades[grade];
      return plan ? plan.sessions.find(s => s.id === id) || null : null;
    }
  };
})(window);
