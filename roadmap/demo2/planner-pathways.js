/* 선택형 경로 탐색. 실제 답변·진도·기간·학원 지원 상태와 분리한다. */
(function(global){
'use strict';
const roots=['academic','gifted','contest','center','science','study','boarding','international','academy'];
const paths={
 academic:{title:'교과·심화에서 내신·수능으로',short:'교과·심화 · 내신·수능',summary:'교과와 심화를 함께 쌓고, 학교 공부와 고등 과정으로 이어가요.',
  what:['개념을 익히는 공부와 낯선 문제를 깊이 푸는 공부를 따로 살펴봐요.','중등 심화를 마친 뒤에도 고1 3월 학력평가 기출로 중등 내용을 꾸준히 확인해요.'],
  why:'모든 아이가 같은 깊이와 속도를 선택할 필요는 없어요. 지금 공부와 앞으로의 목표를 함께 보고 길을 골라요.',
  parallel:['학기 중에는 진도를 조금씩 이어가며 심화·복습을 챙겨요.','중학교에서는 내신 대비 한 달을 확보하고, 방학에 학습량을 늘리는 흐름을 살펴봐요.'],
  advice:'빠른 진도와 깊이 있는 풀이는 함께 살필 수 있어요. 한쪽을 골랐다고 다른 공부를 버릴 필요는 없어요.',guides:['current'],next:['balance','middle','high','season'],sources:['B47','B51','B52','B56']},
 balance:{title:'교과와 심화를 함께',short:'교과·심화 병행',summary:'새 내용을 배우면서 이미 배운 범위를 더 깊이 공부해요.',
  what:['교과에서는 개념과 대표 유형을 익히고, 심화에서는 조건을 연결하고 풀이를 설명해요.','교과와 심화가 서로 다른 학기·과정이어도 각각 이어갈 수 있어요.'],
  why:'새 진도를 나가는 범위와 더 오래 생각해 볼 범위가 같을 필요는 없어요.',
  parallel:['새 교과 + 이전 범위 심화, 같은 범위의 교과 + 심화 중에서 골라 살펴봐요.','연산·사고력은 각각 필요한 공부를 이어가요.'],advice:'심화 교재를 모두 끝내야 다음 개념을 볼 수 있는 것은 아니에요. 혼자 해결하는 모습도 함께 살펴봐요.',guides:['current'],next:['repair','season','independent','middle'],sources:['B05','B09','B47']},
 repair:{title:'필요한 부분을 보완하고 합류',short:'부분 보완 후 합류',summary:'막힌 부분을 다시 살펴보고 다음 공부로 이어가요.',
  what:['개념을 몰랐는지, 조건을 놓쳤는지, 계산에서 막혔는지 구분해 봐요.','풀이를 본 뒤 이해한 문제와 도움 없이 푼 문제는 따로 생각해요.'],why:'한 단원이 어려웠다고 모든 공부를 처음부터 다시 할 필요는 없어요.',
  parallel:['새 진도를 유지하며 필요한 범위를 복습할 수 있어요.','잠시 해당 범위에 집중하고 다시 합류하는 길도 있어요.'],advice:'이전에 끝낸 기록은 그대로예요. 지금 필요한 부분을 다시 확인하는 공부를 더해요.',guides:['current'],next:['balance','middle','study','resume'],sources:['B06','B55','B98']},
 middle:{title:'중등 기본과 심화',short:'중등 기본·심화',summary:'중등 개념·유형을 익히며 심화를 함께 이어가요.',
  what:['학기별 기본·응용과 심화의 범위를 구분해요.','중등 심화 이후에는 고1 3월 수학 학력평가 기출로 배운 내용을 꾸준히 확인해요.'],why:'중등 기본을 끝내는 것과 낯선 문제를 혼자 해결하는 것은 달라요.',
  parallel:['중등 심화와 공통수학의 새 진도를 병행하는 길을 비교해요.','학교 내신·수행 준비는 외부 선행과 따로 챙겨요.'],advice:'학년만으로 중등 공부를 막거나, 책 진도만으로 공통수학 준비가 끝났다고 보지 않아요.',guides:['middle'],next:['high','repair','season','contest'],sources:['B47','B51','B52']},
 high:{title:'공통수학 이후의 고등 공부',short:'고등 교과·심화',summary:'고등 개념과 유형·심화를 공부하고 배운 범위를 확인해요.',
  what:['공통수학1·2, 대수·미적분·기하 등 실제 배우는 과정에 맞춰 이어가요.','고등 학력평가 기출은 공부한 범위에서 풀고 풀이를 점검해요.'],why:'교재 진도를 나가는 동안 배운 내용을 다시 꺼내 쓰는 연습도 필요해요.',
  parallel:['새 과목과 앞서 배운 과목의 심화·복습을 함께 살펴봐요.','경시에서 고등 교과로 돌아오는 경우에도 이미 공부한 범위부터 이어가요.'],advice:'경시를 준비한 기간도 공부의 일부예요. 다른 길과 비교해 늦었다고 단정하지 않아요.',guides:['high'],next:['mock','season','balance','study'],sources:['B53','B54','B55','B71']},
 mock:{title:'학력평가 기출로 꾸준히 확인',short:'학평 기출 점검',summary:'배운 내용을 낯선 문제에서도 사용할 수 있는지 확인해요.',
  what:['중등 심화를 마친 뒤 고1 3월 수학 기출로 중등 내용을 확인해요.','고등 과정에서는 배운 과목·단원에 맞는 학력평가 기출을 활용해요.','맞고 틀린 결과에 더해 조건 읽기, 풀이 선택, 계산·검토를 살펴봐요.'],why:'시간 제한 없이 푼 모습과 시험 상황의 모습이 다를 수 있어요. 점수 하나로 원인을 정하지 않아요.',
  parallel:['현재 교재를 이어가면서 필요한 범위만 복습해요.','새 문제의 첫 풀이와 해설을 본 뒤의 재풀이는 구분해요.'],advice:'기출을 여러 번 푸는 양보다 틀린 이유를 설명하고 다시 해결하는 과정이 중요해요.',guides:[],books:'고1 3월 수학 학력평가 기출 · 현재 배우는 고등 과목의 학력평가 기출',next:['repair','balance','high'],sources:['B85','B88','B98','user-mock-review']},
 season:{title:'학기·방학·내신에 맞춰 병행',short:'학기·방학 학습',summary:'학기에는 심화와 복습을 챙기고, 방학에는 분량을 늘리는 길을 살펴봐요.',
  what:['평소에는 새 진도를 조금씩 이어가며 심화를 함께 공부해요.','중학교에서는 내신 대비에 약 한 달을 두고 학교 시험을 준비해요.','방학에는 학교 일정이 줄어든 만큼 학습량을 늘릴 수 있어요.'],why:'같은 진도라도 학기 중과 방학의 생활은 달라요.',
  parallel:['과목별로 유지할 공부와 집중할 공부를 구분해요.','추가 특강을 선택할 때는 복습과 휴식도 함께 생각해요.'],advice:'방학에 늘린 분량을 학기 중에도 그대로 유지해야 하는 것은 아니에요.',guides:['current'],next:['balance','mock','rest','study'],sources:['B07','B52','B56','B88','user-season']},
 independent:{title:'학원 목표 없이 공부 이어가기',short:'우리 흐름으로 공부',summary:'학원 선택과 관계없이 교과·심화·사고력의 다음 공부를 볼 수 있어요.',
  what:['지금 공부하는 범위를 기준으로 다음 교재와 공부 방법을 살펴봐요.','학원을 나중에 선택하거나 선택하지 않는 길도 열어 둬요.'],why:'특정 학원에 들어가는 것이 모든 공부의 목적은 아니에요.',
  parallel:['교과·심화·사고력·연산 중 필요한 공부를 이어가요.','학원 합류를 생각하게 되면 그때의 모집 조건을 따로 확인해요.'],advice:'학원을 선택하지 않아도 지도는 계속 이어져요.',guides:['current'],next:['balance','academy','center','study'],sources:['B28','B34','B35']},
 academy:{title:'학원 경로와 우리 공부 비교',short:'학원 선택 살펴보기',summary:'기관별 공부 방식과 지금의 흐름을 비교해 봐요.',
  what:['소마·필즈·CMS·황소 등은 기관과 반·시기에 따라 과정이 달라요.','선발, 합격, 등록, 실제 수강은 서로 다른 단계예요.'],why:'다른 학원의 과정 기간을 합쳐 하나의 표준 속도로 만들지 않아요.',
  parallel:['학원 수업과 별도로 하는 교과·심화가 겹치는지 살펴봐요.','늦게 고려하거나 미선발·미등록 뒤에도 필요한 공부를 이어가요.'],advice:'학원 이름보다 실제 공부하는 범위와 아이의 생활을 먼저 살펴봐요.',guides:['current'],next:['independent','balance','repair','study'],sources:['B23','B27','B28','B34','B48']},
 gifted:{title:'영재학교 입시 방향 살펴보기',short:'영재학교 입시 준비',summary:'수학·과학의 깊이와 탐구를 이어가며 목표 학교를 살펴봐요.',
  what:['교재 진도 외에 문제를 풀고 설명하는 모습과 실제 탐구를 살펴봐요.','목표 학교의 해당 연도 지원 자격과 전형을 따로 확인해요.'],why:'빠른 선행이나 경시 결과만으로 지원 준비가 모두 끝났다고 볼 수는 없어요.',
  parallel:['중등·고등 심화, 경시, 과학 탐구를 목표와 여건에 맞춰 병행해요.','중학교 내신과 학교 생활도 함께 챙겨요.'],advice:'준비하다 목표가 달라져도 배운 공부를 바탕으로 다른 길을 선택할 수 있어요.',guides:[],books:'현재 공부하는 중등·고등 심화와 경시의 영역별 교재를 상세 과정에서 비교해요.',next:['contest','science','center','academic'],sources:['B71','B72','B75','B78']},
 contest:{title:'경시·KMO의 다음 단계 고르기',short:'경시 · KMO',summary:'공통수학과 중등 심화를 바탕으로 정수·조합·기하·대수를 공부해요.',
  what:['기초반 6개월에는 공통수학1·2와 중등 대수·기하 심화를 함께 살펴봐요.','입문은 공통수학1·2 완료 후의 길이에요. 기본반은 1차 입상과 2차 준비를 연결해요.'],why:'경시 과정과 고등 교과의 진도는 서로 다른 길이며 함께 공부할 수도 있어요.',
  parallel:['현재 배우는 교과·심화와 경시 영역 공부를 함께 비교해요.','목표 연도의 공식 시험 시기에 맞추되 이 지도에서 개인 시험일을 정하지는 않아요.'],advice:'지금 살펴보고 싶은 단계부터 고르세요. 선택은 실제 이수나 준비도 판정이 아니에요.',guides:[],books:'아래에서 기초·입문·기본·1차 이후 중 관심 있는 단계를 고르면 관련 교재를 볼 수 있어요.',next:['kmoBase','intro','kmoBasic','afterKmo'],sources:['B65','B66','B68','B69','user-kmo']},
 kmoBase:{title:'기초반 · 6개월 참고 과정',short:'기초반 · 공통수학1·2',summary:'공통수학1·2와 중등 대수·기하 심화를 함께 공부하는 과정이에요.',
  what:['공통수학1·2의 개념·유형을 익히고 심화 풀이를 살펴봐요.','중등 대수·기하에서 조건과 논리를 연결하는 힘을 쌓아요.'],why:'입문 전에 공통수학을 마치는 원장님의 과정 구성을 반영했어요.',
  parallel:['교과 새 진도와 중등 심화를 함께 이어가요.','6개월은 참고 과정 길이이며 개인의 완료 기간을 보장하지 않아요.'],advice:'이미 공부한 내용은 살펴보고 필요한 부분부터 이어가요.',guides:['high','middle'],next:['intro','repair','balance'],sources:['user-kmo-base-six-months','B47','B53']},
 intro:{title:'KMO 입문',short:'KMO 입문',summary:'정수·조합·기하·대수의 문제 해결 방법을 익혀요.',
  what:['익숙한 계산을 넘어 문제의 구조를 찾고 여러 방법으로 접근해요.','공통수학1·2를 마친 뒤 이어지는 입문 경로예요.'],why:'어려운 문제에 오래 머물며 생각을 전개하는 공부를 시작해요.',
  parallel:['중등 대수·기하 심화와 고등 교과도 목표에 맞춰 함께 이어가요.','교재마다 영역이 다르므로 필요한 영역을 골라요.'],advice:'풀이를 읽고 아는 것과 처음 보는 문제에서 방법을 찾는 것은 구분해 봐요.',guides:['intro'],next:['kmoBasic','repair','balance'],sources:['B66','B68','user-kmo-intro']},
 kmoBasic:{title:'KMO 기본 · 1차와 2차 준비',short:'KMO 기본 · 1차·2차',summary:'1차 입상을 목표로 공부하며 증명·서술 풀이를 함께 준비해요.',
  what:['영역별 아이디어를 익히고 여러 영역이 섞인 문제에 적용해요.','답을 구하는 과정과 풀이가 성립하는 이유를 식과 글로 설명해요.'],why:'1차와 2차의 준비를 분리해서 바라보되 목표에 따라 연결해요.',
  parallel:['공통수학·대수·기하의 심화와 경시를 함께 살펴봐요.','시험 이후에는 2차, 고등 과정, 영재고 준비 중 방향을 다시 고를 수 있어요.'],advice:'이번 시험의 결과만으로 이후 공부를 한 길로 고정하지 않아요.',guides:['basic'],next:['afterKmo','second','science'],sources:['B68','B69','B71','user-kmo-basic']},
 afterKmo:{title:'KMO 1차 이후의 갈림길',short:'KMO 1차 이후',summary:'2차 준비, 고등 교과, 영재학교 준비 중 다음 방향을 살펴봐요.',
  what:['2차를 준비하며 증명 풀이를 깊게 공부하는 길이 있어요.','고등 교과와 미적분 등 남은 과정으로 돌아가는 길도 있어요.','초6 이후 영재학교 입시에 집중하는 방향도 함께 비교해요.'],why:'경시에 집중한 동안 다른 학생은 고등 과정을 공부했을 수 있어요. 서로 다른 길이므로 속도만으로 늦었다고 판단하지 않아요.',
  parallel:['1차 이후 2차로 이어지지 않더라도 학교 공부와 고등 과정으로 연결할 수 있어요.','방학에 고등 과정을 보완하는 방향도 살펴봐요.'],advice:'의대·이과 최상위권을 생각한다면 경시를 어디까지 할지도 하나의 선택이에요.',guides:[],books:'2차 증명 풀이의 영역별 교재와 고등 개념·유형·심화 교재를 각각의 다음 로드맵에서 비교해요.',next:['second','high','gifted','season'],sources:['B71','B78','user-after-kmo']},
 second:{title:'KMO 2차 · 증명 풀이',short:'KMO 2차 준비',summary:'정수·조합·기하·대수의 심화 문제를 논리적으로 설명해요.',
  what:['조건을 빠짐없이 다루고 풀이의 근거를 연결해요.','다른 풀이와 비교하며 불필요하게 길어진 과정을 돌아봐요.'],why:'답뿐 아니라 논리와 설명을 깊게 다루는 공부예요.',
  parallel:['고등 KMO로 더 이어갈지, 학교·수능·영재고에 집중할지 비교해요.','공식 시험 조건과 일정은 해당 연도의 공고를 확인해요.'],advice:'더 높은 경시 단계가 모든 학생의 필수 종착지는 아니에요.',guides:['second'],next:['afterKmo','high','gifted'],sources:['B65','B69','B71','user-kmo-second']},
 center:{title:'영재원 대비',short:'영재원 대비',summary:'지역과 기관에 따라 다른 선발 방식과 탐구 공부를 살펴봐요.',
  what:['교육청과 대학부설을 구분하고 지원 과정의 특징을 살펴봐요.','같은 시·도 안에서도 교육지원청과 과정에 따라 자격·평가 방식이 달라요.'],why:'자료의 예전 날짜나 선행 수준을 모든 기관의 현재 조건으로 적용하면 안 돼요.',
  parallel:['영재원 대비는 기존 공부에 추가합니다. 교과·사고력·심화·연산의 진도와 진행 속도는 유지합니다.','별도 시간에 필요한 선발 문제·탐구·설명 준비를 이어갑니다.','현재 학년과 입학 후 과정 학년, 지원 연도와 모집 학년도는 구분해요.'],advice:'지원할 때는 해당 기관의 해당 연도 모집요강과 변경 공고를 확인해 주세요.',guides:[],books:'준비 목적에 따라 개념·유형·모의고사 역할을 구분해요. 지원 기관과 과정에 맞는 교재인지 확인해요.',next:['centerEdu','centerUni','inquiry','science'],sources:['B36','B40','B41','B42','user-gifted-photos-20261022']},
 centerEdu:{title:'교육청 영재교육원 살펴보기',short:'교육청 영재원',summary:'관할 교육지원청의 과정과 단계별 평가를 살펴봐요.',
  what:['지필·서술 평가, 온라인 선교육·과제, 수행관찰·면접 등 구성을 확인해요.','수학·과학 공통 평가인지 지원 분야별인지도 기관 안내를 따라요.'],why:'지필시험이 없다고 준비할 공부가 없는 것은 아니에요.',
  parallel:['기존 교과·사고력·심화·연산의 진행 속도를 유지하고 교육청 영재원 대비를 추가합니다.','현재 교과 이해와 사고력 문제의 풀이 설명을 함께 살펴봐요.','지원·추천·서류·평가 마감은 서로 다를 수 있어요.'],advice:'서울·경기·부산 사례를 다른 지역에 그대로 적용하지 않아요.',guides:[],books:'맛있는 영재 수학·과학·모의고사, 영재성검사·창의적 문제해결력 관련 교재가 참고 자료에 등장해요. 교재별 판본·대상·평가 유형을 확인해 골라요.',next:['inquiry','science','centerUni'],sources:['B36','B38','B40','user-gifted-photos-20261022']},
 centerUni:{title:'대학부설 영재교육원 살펴보기',short:'대학부설 영재원',summary:'기관별 서류·탐구 산출물·지필·면접의 차이를 살펴봐요.',
  what:['자기소개서, 탐구 보고서, 영상, 현장 작성 등 요구 형식이 다를 수 있어요.','직접 한 탐구와 문제 해결 과정을 학생 자신의 말로 설명해요.'],why:'교육청을 먼저 수료해야만 지원할 수 있다고 모든 대학에 일반화하지 않아요.',
  parallel:['기존 교과·사고력·심화·연산의 진행 속도를 유지하고 대학부설 영재원 대비를 추가합니다.','개념·사고력 공부와 실제 탐구를 함께 이어가요.','상장·수료증 등 허용 증빙과 분량은 기관·문항별로 확인해요.'],advice:'기록을 꾸미기보다 실제로 궁금해하고 시도한 과정을 돌아봐요.',guides:[],books:'영역별 사고력·탐구 교재를 목적에 맞춰 비교해요. 자료에 나온 책을 모두 학습해야 하는 것은 아니에요.',next:['inquiry','science','centerEdu'],sources:['B38','B40','B42','user-gifted-photos-20261022']},
 science:{title:'과학 개념과 탐구 이어가기',short:'과학 · 탐구',summary:'교과 개념과 관찰·실험·설명을 함께 살펴봐요.',
  what:['과학 용어를 이해하는 것, 수식·도형을 다루는 것, 결과를 설명하는 것을 나누어 봐요.','수학 진도가 빠르다고 과학의 모든 분야를 이미 익힌 것은 아니에요.'],why:'개념 공부와 직접 해보는 탐구는 서로 다른 경험이에요.',
  parallel:['수학·학교 과학과 함께 필요한 개념과 탐구를 이어가요.','영재원·경시 목적은 각각의 과정에서 따로 살펴봐요.'],advice:'안전하게 할 수 있는 작은 관찰과 실험부터 연결해도 좋아요.',guides:[],books:'참고 자료의 최상위 줄기과학은 개념, 안쌤 과학100제는 문제 유형, 맛있는 영재 과학·모의고사는 실전 연습 등 역할을 구분해 살펴봐요. 정확한 판본과 범위는 확인이 필요해요.',next:['scienceBasics','inquiry','center','balance'],sources:['B57','B63','B64']},
 scienceBasics:{title:'과학에서 필요한 개념 보완',short:'과학 개념 보완',summary:'어휘·그림·수식·설명 중 필요한 부분을 함께 공부해요.',
  what:['생명·지구과학·물리·화학에서 각각 어떤 표현과 개념을 사용하는지 살펴봐요.','직접 관찰한 것을 표·그림·말로 설명해 봐요.'],why:'분야별로 익숙한 부분이 다를 수 있어요.',
  parallel:['다른 과학 분야와 실험을 모두 멈추기보다 필요한 내용을 연결해요.','수학이 필요한 내용은 관련 개념을 함께 살펴봐요.'],advice:'단어를 외운 것과 현상을 설명할 수 있는 것은 따로 생각해 봐요.',guides:[],books:'현재 다루는 분야·단원에 맞는 개념 교재와 탐구 활동을 연결해요. 다른 분기의 교재·개월 수를 한 과정으로 합치지 않아요.',next:['inquiry','science','repair'],sources:['B58','B63','B64']},
 inquiry:{title:'작은 탐구에서 보고서로',short:'실험·탐구·설명',summary:'질문을 만들고 직접 해본 과정과 근거를 설명해요.',
  what:['궁금한 점 → 비교할 조건 → 관찰·실험 → 결과 → 바꿔볼 점을 생각해요.','짧은 실험, 보고서 작성, 장기 탐구는 목적과 분량이 다른 활동이에요.'],why:'대회 이름이나 결과보다 아이가 무엇을 시도하고 바꿨는지 살펴봐요.',
  parallel:['교과 개념과 연결하며 관심 분야를 더 깊게 살펴봐요.','대회·제출을 고려한다면 지역과 해당 연도의 요구를 따로 확인해요.'],advice:'‘여름방학 활동 몇 개’ 같은 자료의 예시를 모든 아이의 필수 활동량으로 만들지 않아요.',guides:[],books:'관심 있는 주제의 개념과 탐구 방법을 참고해요. 별도 책 구매가 필요한 활동만 있는 것은 아니에요.',next:['center','scienceBasics','studyTalk'],sources:['B42','B64','user-gifted-photos-20261022']},
 study:{title:'우리 아이에게 맞는 공부 방법',short:'공부 방법 · 부담',summary:'아이의 관심과 혼자 생각하는 모습에 맞춰 공부 방법을 골라봐요.',
  what:['혼자 생각할 시간, 설명을 듣는 시간, 함께 이야기하는 공부를 비교해요.','부모의 희망과 아이의 관심이 다를 수도 있어요.'],why:'성향만으로 실력이나 진로를 결정하지 않고 실제 공부 모습을 함께 살펴봐요.',
  parallel:['기존 교과·심화는 이어가며 설명 방법과 분량을 달리할 수 있어요.','긴 수업과 나눠 하는 수업, 이동·과제·휴식의 부담도 생각해요.'],advice:'검사를 먼저 끝내야 길을 선택할 수 있는 것은 아니에요. 지금 해보고 싶은 방법부터 고르세요.',guides:['current'],next:['studySolo','studyTalk','academy','rest'],sources:['B02','B81','B82','B87','B101']},
 studySolo:{title:'혼자 생각할 시간을 갖고',short:'스스로 생각하며',summary:'먼저 자기 방법을 찾아보고 필요한 도움을 받아요.',
  what:['처음 풀이를 시도하고, 막힌 지점에서 조건과 방법을 돌아봐요.','해설을 본 뒤에는 무엇이 달라졌는지 설명해 봐요.'],why:'혼자 풀었다는 말도 문제와 도움의 정도에 따라 다를 수 있어요.',
  parallel:['새 유형은 설명을 들으며 시작하고 이후 독립 풀이로 확인할 수 있어요.','어려운 문제 한 개에 쓰는 시간과 다른 공부도 함께 생각해요.'],advice:'도움을 받는 것이 실패는 아니에요. 스스로 생각한 부분과 배운 부분을 구분해 봐요.',guides:['current'],next:['balance','repair','studyTalk'],sources:['B05','B85','B86','B101']},
 studyTalk:{title:'설명하고 함께 이야기하며',short:'설명·토론하며',summary:'말·글·그림으로 풀이를 설명하고 다른 방법을 비교해요.',
  what:['정답만 말하기보다 어떤 조건을 썼는지 이야기해 봐요.','다른 풀이를 듣고 내 방법과 같은 점·다른 점을 찾아요.'],why:'말로 설명하기가 어려우면 그림이나 짧은 식으로 시작해도 좋아요.',
  parallel:['교과·심화 풀이와 과학 탐구의 설명에 함께 활용해요.','부모·교사의 관찰이 다르면 같은 문제와 도움 조건에서 살펴봐요.'],advice:'잘 말하는 것만으로 모두 이해했다고 판단하지 않고 직접 푸는 모습도 함께 봐요.',guides:['current'],next:['balance','inquiry','studySolo'],sources:['B05','B87','B101']},
 rest:{title:'부담을 조정하고 쉬어가기',short:'부담 조정 · 휴식',summary:'일부 공부를 줄이거나 쉬면서 다음 방향을 살펴봐요.',
  what:['모든 과정을 한꺼번에 멈출 필요 없이 필요한 공부만 조정할 수 있어요.','쉬기, 목표 바꾸기, 현재 흐름 유지를 비교해요.'],why:'휴식이나 방향 변경은 실패나 능력 저하를 뜻하지 않아요.',
  parallel:['유지하는 공부와 쉬는 공부를 다르게 생각해요.','다시 시작할 때는 그때 가능한 공부부터 이어가요.'],advice:'쉬었던 기간을 밀린 숙제로 쌓거나, 따라잡으려고 기간을 자동으로 압축하지 않아요.',guides:[],books:'새 교재를 더하기보다 현재 공부에서 이어갈 부분을 살펴봐요.',next:['resume','academic','study'],sources:['B95','B96']},
 resume:{title:'지금 가능한 공부부터 재개',short:'쉬었다 이어가기',summary:'이전에 배운 내용을 바탕으로 현재의 흐름을 다시 골라요.',
  what:['예전에 마친 범위와 지금 다시 확인할 부분을 구분해요.','전체 재시작, 일부 복습, 다른 목표로 전환하는 길을 비교해요.'],why:'지난 계획을 그대로 따라잡기보다 현재의 공부와 생활에서 시작해요.',
  parallel:['이미 이어가고 있는 다른 공부를 함께 고려해요.','필요한 범위를 복습하면서 다음 과정에 합류할 수 있어요.'],advice:'이전 목표를 바꾸어도 배운 내용과 경험은 남아 있어요.',guides:['current'],next:['balance','repair','study'],sources:['B78','B96','B97','B98']}
};
// 초4~6의 탐색 예시. 기존 학교 학년·진도·개인 일정과는 연결하지 않는다.
Object.assign(paths,{
 boarding:{title:'초4~6부터 보딩 준비',short:'보딩 준비',summary:'수학의 기본기와 설명하는 힘을 쌓으며 앞으로의 학교 생활을 준비해요.',
  what:['초4 무렵에는 분수·소수와 문장제, 그림과 말로 설명하는 공부를 살펴봐요.','초5 무렵에는 비·비율, 식과 도형의 관계를 중등 개념으로 연결해요.','초6 무렵에는 현재 학교 공부와 전환할 학교의 수업·과목 배치를 따로 살펴봐요.'],why:'보딩을 생각한다고 모든 학생이 최상위 경시나 빠른 고등 선행을 선택할 필요는 없어요.',
  parallel:['학교 수학, 영어로 읽고 설명하기, 생활과 휴식의 균형을 함께 봐요.','학년 표시는 시작점을 찾기 위한 예시예요. 이미 익힌 내용과 필요한 보완에 따라 다른 단계부터 볼 수 있어요.'],advice:'아직 학교나 출국 시기를 정하지 않았어도 괜찮아요. 지금 필요한 공부부터 골라보세요.',guides:[],books:'현재 학교의 단원과 가지고 있는 교재부터 살펴봐요. 보딩 준비를 이유로 모든 교재를 새로 살 필요는 없어요.',next:['globalFoundation','globalBridge','globalTransition','boardingLife'],sources:['user-boarding-g4-g6','exeter-math-example']},
 international:{title:'초4~6 국제학교에서 이어갈 공부',short:'국제학교 재학·전환',summary:'학교에서 배우는 수학과 더 깊이 공부할 내용을 나누어 살펴봐요.',
  what:['현재 학교의 단원·수업 언어·설명 방식부터 살펴봐요.','미국식·영국식·IB 등 이름만으로 아이의 실제 진도와 과목 배치를 정하지 않아요.','국제학교에서 공부하며 보딩을 알아보는 길도 함께 볼 수 있어요.'],why:'같은 학년 이름이어도 학교와 교육과정에 따라 배우는 순서와 범위가 다를 수 있어요.',
  parallel:['학교 과제와 평가를 챙기며 필요한 개념·심화·수학 영어를 더해요.','한국 교재로 공부한 범위도 남겨두되 Grade·Year와 일대일로 바꾸지 않아요.'],advice:'국제학교 재학과 보딩 준비는 함께 생각할 수 있어요. 지금 더 궁금한 공부부터 고르세요.',guides:[],books:'학교 단원에 맞는 개념·문장제 자료를 먼저 살펴보고 필요한 심화만 더해요. 한국 고등 교재를 모두 끝내는 공통 규칙은 없어요.',next:['schoolFocus','globalFoundation','globalBridge','globalTransition','boarding'],sources:['user-international-g4-g6','B51','B52']},
 globalFoundation:{title:'초4 무렵 · 기본기와 설명',short:'초4 무렵 · 기본기·설명',summary:'분수·소수, 단위와 도형을 이해하고 풀이를 그림과 말로 설명해요.',
  what:['계산만 맞히기보다 분수·소수의 크기와 연산의 뜻을 그림·수직선으로 설명해요.','문장제에서 아는 것과 구할 것, 단위를 찾아 식과 연결해요.','한 문제를 표·그림·식 중 다른 방법으로도 나타내 봐요.'],why:'학년보다 혼자 이해하고 설명할 수 있는 범위를 바탕으로 다음 공부를 살펴봐요.',
  parallel:['지금 학교의 단원을 유지하면서 필요한 부분을 보완할 수 있어요.','익숙한 수학을 영어로 짧게 읽고 설명하는 공부를 조금씩 더해요.'],advice:'초4라는 이유로 이미 아는 내용까지 다시 시작하거나, 중등 선행을 의무로 정하지 않아요.',guides:['current'],next:['globalBridge','mathLanguage','globalEnrich','repair'],sources:['user-boarding-g4-g6','B05','B09']},
 globalBridge:{title:'초5 무렵 · 중등 개념으로 연결',short:'초5 무렵 · 중등 연결',summary:'분수·소수의 연산에서 비와 비율, 식·그래프의 의미로 이어가요.',
  what:['비·비율을 표·그림·식으로 나타내고 단위가 어떻게 바뀌는지 살펴봐요.','수와 계산을 문자식·간단한 방정식에 연결하고 풀이 이유를 설명해요.','도형의 성질, 넓이·부피와 자료 해석도 함께 다뤄요.'],why:'새 기호를 빨리 배우는 것보다 익숙한 개념이 다른 표현에서도 어떻게 이어지는지 이해해요.',
  parallel:['학교 단원과 새 개념의 범위가 달라도 각각 유지할 수 있어요.','필요한 선수 개념을 보완한 뒤 대수 연결이나 전환 준비로 갈 수 있어요.'],advice:'초5에 Algebra 1을 끝내야 한다는 뜻은 아니에요. 이해와 설명을 확인하며 다음 로드맵을 골라요.',guides:[],books:'학교 교재의 비·비율·식·도형 단원을 먼저 연결해요. 중등 교재는 해당 범위가 필요할 때 골라 사용해요.',next:['globalAlgebra','mathLanguage','globalTransition','schoolFocus'],sources:['user-boarding-g4-g6','ccss-6-rp','B47']},
 globalTransition:{title:'초6 무렵 · 학교 전환 준비',short:'초6 무렵 · 전환 준비',summary:'익힌 수학을 정리하고 새 학교에서 읽고 설명하는 공부로 연결해요.',
  what:['분수·비율·부호 있는 수·식과 도형 중 필요한 범위를 다시 살펴봐요.','새 학교의 단원 순서·과목 안내·배치 절차를 현재 학습과 비교해요.','수업에서 질문하기, 풀이를 글과 그림으로 설명하기도 연습해요.'],why:'한국 중등·고등의 완료 학기만으로 새 학교의 과목 배치가 정해지는 것은 아니에요.',
  parallel:['현재 학교 평가와 과제를 챙기며 필요한 개념을 보완해요.','학기 중에는 심화와 꾸준한 공부, 방학에는 가능한 범위에서 분량을 늘리는 흐름을 비교해요.'],advice:'전학 시기가 미정이어도 필요한 공부는 이어갈 수 있어요. 실제 배치와 지원 조건은 대상 학교 안내를 따라요.',guides:[],books:'현재 학교의 교재와 직접 푼 문제를 중심으로 정리해요. 특정 학교의 배치시험을 복제하거나 필수 교재 목록을 만들지 않아요.',next:['schoolFocus','globalAlgebra','mathLanguage','boardingLife'],sources:['user-boarding-g4-g6','exeter-placement-example','B51']},
 schoolFocus:{title:'지금 학교 공부부터 탄탄하게',short:'학교 수업부터 탄탄하게',summary:'학교 수업·과제·설명에서 필요한 부분을 먼저 챙겨요.',
  what:['학교에서 쓰는 식·단위·용어와 답을 설명하는 방식을 살펴봐요.','계산, 개념, 문장 읽기, 설명 중 어디에서 막히는지 나누어 봐요.'],why:'학교 점수와 외부 교재 진도는 서로 다른 정보예요. 어느 한쪽만으로 모두 잘한다고 판단하지 않아요.',
  parallel:['학교에서 잘 이해하는 범위는 유지하고 필요한 보완만 더해요.','학교 공부가 안정되면 원하는 심화나 경시를 선택해요.'],advice:'학교 공부를 우선하는 것도 충분한 방향이에요. 모든 아이에게 같은 심화 목표가 필요하지는 않아요.',guides:['current'],next:['mathLanguage','globalBridge','globalEnrich','schoolTransfer'],sources:['user-international-g4-g6','B51','B52']},
 mathLanguage:{title:'수학 이해와 영어 표현을 함께',short:'수학 영어·풀이 설명',summary:'알고 있는 수학을 영어로 읽고, 식·그림·짧은 문장으로 설명해요.',
  what:['같은 개념을 편한 언어와 영어로 각각 읽어 보고 뜻을 연결해요.','문장제의 조건·단위·비교 표현을 식이나 그림으로 바꿔 봐요.','주장 → 쓴 조건 → 풀이 → 확인의 순서로 짧게 설명해요.'],why:'영어로 읽기가 어려운 것과 수학 개념이 어려운 것은 따로 살펴볼 필요가 있어요.',
  parallel:['수학 개념은 편한 언어로 이해하고 영어 표현을 덧붙일 수 있어요.','학교 수업에서 도움을 요청하거나 다른 풀이를 질문하는 연습도 해요.'],advice:'영어가 유창하다고 수학을 모두 이해한 것은 아니고, 영어가 느리다고 수학 수준이 낮은 것도 아니에요.',guides:[],books:'현재 학교 문제와 수학 용어를 활용해요. 새 영어 교재 구매보다 같은 개념의 표현을 연결하는 것부터 시작해도 좋아요.',next:['schoolFocus','globalAlgebra','studyTalk','globalTransition'],sources:['user-international-g4-g6','B05','B87']},
 globalAlgebra:{title:'준비된 개념에서 Algebra로',short:'대수·Algebra 연결',summary:'유리수·비율·식·방정식의 의미를 연결하고 다음 대수를 살펴봐요.',
  what:['부호 있는 수의 연산과 문자식의 계산을 이유와 함께 설명해요.','비례 관계와 그래프, 방정식을 같은 상황의 다른 표현으로 연결해요.','Algebra 1·Geometry 같은 과목 이름은 실제 학교의 범위와 선수 조건을 확인해요.'],why:'한국 중등 완료나 전체 점수 하나를 Algebra 1 준비도와 같다고 보지 않아요.',
  parallel:['현재 학교 공부와 필요한 선수 개념 보완을 함께 이어가요.','도형·자료 해석도 남겨두고 대수만으로 수학 전체를 대신하지 않아요.'],advice:'이 지도의 선택은 과목 배치가 아니에요. 실제 풀이와 교사 확인을 바탕으로 다음 과정을 정해요.',guides:[],books:'현재 학교의 단원과 맞는 개념·문장제 자료를 비교해요. 한국 공통수학과 Algebra 1을 같은 한 과정으로 처리하지 않아요.',next:['globalEnrich','schoolFocus','globalTransition','repair'],sources:['user-boarding-g4-g6','ccss-6-rp','exeter-placement-example']},
 globalEnrich:{title:'관심에 맞춰 더 깊이 공부',short:'심화·경시 선택',summary:'학교 수학을 더 깊게 탐구하거나 경시 문제 해결을 선택해요.',
  what:['익숙한 문제의 조건을 바꾸고 다른 풀이를 비교해요.','학교 과정 심화와 AMC 등 대회 준비는 목적을 나누어 살펴봐요.'],why:'보딩이나 국제학교를 생각한다고 경시 성적이 모든 학생의 공통 목표가 되는 것은 아니에요.',
  parallel:['학교 수업·과제와 관심 활동, 휴식을 함께 고려해요.','경시를 하지 않아도 설명·모델링·탐구로 수학을 깊게 공부할 수 있어요.'],advice:'어려운 문제를 즐기는지, 부담은 어떤지 살펴보며 선택하세요.',guides:[],books:'현재 교재에서 한 문제를 다른 방법으로 풀거나 조건을 바꾸는 활동부터 시작할 수 있어요.',next:['amcExplore','studyTalk','inquiry','schoolFocus'],sources:['user-international-g4-g6','user-amc-roadmap','B65','B78']},
 amcExplore:{title:'AMC 문제 해결을 선택한다면',short:'AMC 탐색',summary:'대회 문제 해결을 하나의 관심 활동으로 살펴봐요.',
  what:['문제를 보고 필요한 개념을 고르고, 여러 접근을 비교해요.','정답 수뿐 아니라 막힌 개념·계산 실수·오래 걸린 풀이를 돌아봐요.'],why:'AMC 8·AMC 10과 SAT 노출, 학교 과목 배치는 각각 다른 목표예요.',
  parallel:['학교 공부를 유지하며 가능한 만큼 문제 해결에 시간을 써요.','출전 조건·일정은 대회와 해당 연도에 따로 확인해요.'],advice:'학년이나 보딩 희망만으로 대회 단계·목표 점수를 정하지 않아요. 아직 출전을 정하지 않아도 괜찮아요.',guides:[],books:'권리가 확인된 자료로 관심 분야와 설명 방법을 살펴봐요. 이 선택만으로 외부 기출이나 책 내용을 제공하지 않아요.',next:['globalEnrich','schoolFocus','study','boarding'],sources:['user-amc-roadmap','B65','B78']},
 boardingLife:{title:'스스로 공부하는 생활도 함께',short:'생활·자기주도 준비',summary:'질문하기, 과제 챙기기와 휴식을 수학 공부에 함께 연결해요.',
  what:['모르는 부분을 구체적으로 묻고 필요한 도움을 요청하는 연습을 해요.','스스로 시작하고 마무리하는 공부를 작게 시도해 봐요.'],why:'수학 진도가 빠른 것과 새로운 생활에서 스스로 공부를 이어가는 것은 다른 경험이에요.',
  parallel:['읽기·학교 활동·수면을 고려해 공부를 배분해요.','부모가 정한 목표와 아이가 바라는 학교 생활을 함께 이야기해 봐요.'],advice:'성향 하나로 보딩에 맞는 아이인지 판정하지 않아요. 관심·실제 경험·도움이 필요한 부분을 함께 살펴봐요.',guides:[],books:'새 교재보다 현재 과제에서 작은 계획을 지키고 돌아보는 경험을 먼저 더할 수 있어요.',next:['studySolo','studyTalk','schoolFocus','rest'],sources:['user-boarding-g4-g6','B02','B07','B101']},
 schoolTransfer:{title:'전학·귀국을 생각한다면',short:'전학·귀국 시 연결',summary:'이전 학교에서 배운 내용과 새 학교의 단원 차이를 살펴봐요.',
  what:['학교 이름이나 학년 이름보다 실제로 배운 단원을 비교해요.','빠진 단원, 다른 용어·표기, 평가 방식에서 필요한 부분을 살펴봐요.'],why:'교육과정이 달라 생긴 빈 부분을 실력 전체의 문제로 해석하지 않아요.',
  parallel:['이미 익힌 개념은 유지하고 필요한 부분을 보완해요.','새 학교 수업과 기존 심화의 분량을 따로 조정할 수 있어요.'],advice:'선택만으로 전학 자격·학년·반을 정하지 않아요. 대상 학교의 실제 안내와 교사 확인을 따라요.',guides:[],books:'두 학교의 실제 단원 안내와 현재 교재를 비교하고 필요한 부분만 더해요.',next:['schoolFocus','repair','academic','academy'],sources:['user-international-g4-g6','B06','B51','B78']},
 nute:{title:'누테 과정으로 이어가려면',short:'누테 과정 살펴보기',summary:'현재 공부와 해당 지점·과정·회차의 범위를 나누어 살펴봐요.',
  what:['현재의 중등 기본·응용·심화와 새 과정의 범위를 비교해요.','진입에 필요한 부분이 비어 있다면 보완 후 같은 또는 다음 회차를 검토해요.'],why:'예전 회차·기간·정답률 사례를 모든 누테 과정의 현재 조건으로 쓰지 않아요.',
  parallel:['학교 공부와 현재 이어가는 심화를 따로 보존해요.','수업·숙제·이동이 겹치면 한 과정을 우선하거나 나중에 전환하는 길도 봐요.'],advice:'이 화면에서는 지원·합격·등록을 결정하지 않아요. 해당 지점의 최신 안내로 실제 조건을 확인해요.',guides:['middle','high'],next:['repair','middle','high','independent'],sources:['B44','B45','B46','B47','B48']},
 hwangsoHigh:{title:'황소에서 중등·고등으로',short:'황소 중등·고등 연결',summary:'현재 황소 과정과 다음 중등·고등 공부를 따로 살펴봐요.',
  what:['현재 과정에서 배운 범위와 혼자 해결하는 심화를 구분해요.','황소 유지, 다른 과정 전환, 독립 학습 중 원하는 길을 비교해요.'],why:'학원 과정명과 학교 학년, 고등 과목의 완료는 같은 뜻이 아니에요.',
  parallel:['중등 심화를 유지하며 필요한 고등 개념을 살펴볼 수 있어요.','다른 학원의 기간을 합치거나 평균내어 개인 완료월로 정하지 않아요.'],advice:'황소를 계속 다니는 길과 다른 공부로 바꾸는 길 모두 열려 있어요. 실제 과정과 조건은 해당 지점 안내로 확인해요.',guides:['middle','high'],next:['middle','high','nute','independent'],sources:['B44','B46','B47','B48']}
});
paths.academy.next=[...new Set(['nute','hwangsoHigh',...paths.academy.next])];
paths.middle.next=[...new Set([...paths.middle.next,'academy'])];
paths.high.next=[...new Set([...paths.high.next,'international'])];
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function freeze(o){Object.values(o).forEach(v=>{if(v&&typeof v==='object')freeze(v);});return Object.freeze(o);}
freeze(paths);Object.freeze(roots);
function normalize(value){
 if(!Array.isArray(value)||!roots.includes(value[0]))return [];
 const out=[];
 for(const id of value.slice(0,32)){
  if(typeof id!=='string'||!Object.hasOwn(paths,id)||out.includes(id)||out.length&&!paths[out.at(-1)].next.includes(id))break;
  out.push(id);
 }
 return out;
}
function select(value,from,to){
 const trail=normalize(value);
 if(from===null)return roots.includes(to)?[to]:trail;
 const at=trail.indexOf(from);
 if(at<0||!Object.hasOwn(paths,from)||!paths[from].next.includes(to))return trail;
 const prefix=trail.slice(0,at+1),previous=prefix.indexOf(to);
 return previous>=0?prefix.slice(0,previous+1):[...prefix,to];
}
function entry(key){return ({elem:['academic','balance'],elemDeep:['academic','balance'],middle:['academic','middle'],high:['academic','high'],mock:['academic','high','mock'],intro:['contest','intro'],basic:['contest','kmoBasic'],second:['contest','afterKmo','second'],science:['science'],thinking:['study'],calc:['study']})[key]?.slice()||['study'];}
function detail(id,context={}){
 if(!Object.hasOwn(paths,id))return null;
 const p=paths[id],young=['preschool','lower'].includes(context.audience);
 const keys=p.guides.includes('current')?[...new Set([context.schoolGuide,context.deepGuide].filter(Boolean))]:p.guides;
 const sections=keys.map(key=>global.PlannerCourseGuide.detail({title:p.title,guideKey:key},{audience:context.audience}).sections[0]);
 let title=p.title,summary=p.summary;
 if(young&&id==='academic'){title='앞으로의 학교 수학';summary='기본기를 쌓아 앞으로의 중·고등학교 공부를 준비해요.';}
 if(young&&id==='high')title='앞으로의 고등학교 수학';
 return {id,title,summary,what:p.what,why:p.why,parallel:p.parallel,advice:p.advice,books:p.books,sections,next:p.next.map(id=>({id,title:paths[id].short,summary:paths[id].summary}))};
}
function renderTrail(value,active){
 const trail=normalize(value);
 if(!trail.length)return '';
 const selected=trail.includes(active)?active:trail.at(-1);
 return `<section class="pathway-trail" aria-labelledby="pathwayTrailTitle"><div class="pathway-heading"><h3 id="pathwayTrailTitle" tabindex="-1">선택하며 만드는 로드맵</h3><p>지난 갈림길도 눌러 다시 살펴볼 수 있어요.</p></div><ol>${trail.map(id=>`<li><button type="button" data-pathway-open="${id}" aria-controls="pathwayCoach" ${id===selected?'aria-current="step"':''}><span class="pathway-point" aria-hidden="true"></span><small>${id===selected?'살펴보는 과정':'선택한 과정'}</small><strong>${esc(paths[id].short)}</strong><span class="pathway-point-summary">${esc(paths[id].summary)}</span></button></li>`).join('')}</ol></section>`;
}
function renderNext(value,active){const trail=normalize(value),id=trail.includes(active)?active:trail.at(-1);if(!id)return '';return `<section class="pathway-map-fork" aria-label="다음 갈림길"><p>여기서 다음 로드맵을 골라보세요</p><div>${paths[id].next.map(to=>`<button type="button" data-pathway-from="${id}" data-pathway-to="${to}" aria-controls="pathwayCoach"><span class="pathway-option-dot" aria-hidden="true"></span><strong>${esc(paths[to].short)}</strong></button>`).join('')}</div></section>`;}
function renderSchoolRoutes(value){const root=normalize(value)[0];return `<section class="pathway-school-routes" aria-labelledby="schoolRoutesTitle"><h3 id="schoolRoutesTitle">보딩과 국제학교 공부</h3><p>보딩을 생각하거나 국제학교에서 공부한다면, 지금 필요한 길부터 살펴보세요.</p><div>${['boarding','international'].map(id=>`<button type="button" data-pathway-root="${id}" aria-controls="pathwayCoach" aria-pressed="${root===id}"><span class="pathway-option-dot" aria-hidden="true"></span><span><strong>${esc(paths[id].short)}</strong><small>${esc(id==='boarding'?'기본기에서 학교 전환과 생활 준비까지':'학교 수업과 심화·수학 영어를 함께')}</small></span></button>`).join('')}</div></section>`;}
function renderExtras(){return `<details class="pathway-extras"><summary>함께 살펴볼 길 · 영재원·과학·공부 방법·학원</summary><div>${['center','science','study','academy'].map(id=>`<button type="button" data-pathway-root="${id}" aria-controls="pathwayCoach"><strong>${esc(paths[id].short)}</strong><span>${esc(paths[id].summary)}</span></button>`).join('')}</div></details>`;}
// 답변은 안내용 원문이다. 사용자의 실제 숙달·지원 자격·성향 결과를 생성하지 않는다.
const parentQuestions={
 pace:{q:'보딩을 생각하면 2년 선행은 꼭 해야 하나요?',a:'모든 아이에게 같은 선행 폭을 정하지 않아요. 지금 배우는 개념을 혼자 풀고 설명하는지, 학교 공부와 생활을 함께 이어갈 수 있는지를 먼저 살펴봐요. 필요하다면 다음 개념을 배우되 심화·설명과 분량을 따로 조정해요.'},
 notDecided:{q:'학교나 출국 시기를 아직 정하지 않았는데 시작해도 될까요?',a:'지금의 기본기·문장제·풀이 설명부터 이어갈 수 있어요. 학교를 정하면 그 학교의 과목 범위와 안내를 따로 비교하면 됩니다. 이 로드맵을 골라도 지원이나 출국이 확정되는 것은 아니에요.'},
 dual:{q:'국제학교에 다니면서 보딩 준비도 할 수 있나요?',a:'학교 수업·과제와 수학 설명을 기본으로 두고, 보딩 준비에서 더 필요한 부분을 더해요. 학교 전환과 입시 준비, 현재 과목의 학습은 따로 살펴보고 겹치는 공부를 두 번 늘리지 않아요.'},
 stage:{q:'초4·초5·초6 길을 순서대로 모두 거쳐야 하나요?',a:'학년 표시는 어떤 공부를 살펴볼지 돕는 예시예요. 이미 아는 범위를 되풀이할 의무도, 그 학년에 끝내야 할 의무도 없어요. 필요한 단계부터 골라보고 이전 갈림길로 돌아가 다른 길을 볼 수 있어요.'},
 language:{q:'한국어로는 풀지만 영어 문장제에서는 막혀요.',a:'같은 개념을 편한 언어와 영어로 각각 살펴봐요. 조건과 단위를 그림·식으로 바꾸어 보면서 개념이 어려운지 표현이 낯선지 나누어 확인해요. 언어의 어려움을 곧바로 수학 실력 부족으로 판단하지 않아요.'},
 fluent:{q:'영어가 편하면 수학 영어 공부는 따로 안 해도 되나요?',a:'일상 영어와 수학 조건을 정확히 읽고 근거를 설명하는 일은 따로 살펴봐요. 익숙한 단원에서 왜 그 식을 썼는지 짧은 글·그림·말로 설명할 수 있는지 확인해 보세요.'},
 curriculum:{q:'한국 초6과 Grade 6, Year 6는 같은 진도인가요?',a:'이름만으로 같은 과정이라고 바꾸지 않아요. 학교가 쓰는 교육과정과 실제 단원, 평가 방식부터 비교해요. 한국 교재의 완료 학기를 그대로 국제학교의 과목 이수나 반배치로 해석하지 않아요.'},
 korea:{q:'국제학교 아이도 한국 교재로 공부해도 되나요?',a:'필요한 개념과 문제 유형이 맞는다면 참고할 수 있어요. 학교의 단원·용어·표기·설명 방식과 연결하고, 다른 교육과정의 빠진 부분은 따로 살펴봐요. 한국 교재 진도만으로 학교 공부가 모두 해결됐다고 보지는 않아요.'},
 algebra:{q:'초등 때 Algebra 1까지 끝내야 하나요?',a:'학년만으로 완료 목표를 정하지 않아요. 유리수·비율·식·방정식과 그래프를 이해하고 새로운 문제에서 설명하는 모습을 살펴봐요. 준비된 부분은 넓히고 필요한 선수 개념은 보완하며 실제 교사와 다음 과정을 정해요.'},
 placement:{q:'한국 중등·고등을 마치면 높은 반에 바로 들어가나요?',a:'교재 완료만으로 반을 정하지 않아요. 대상 학교의 실제 과목 범위와 배치 절차를 확인해야 해요. 예를 들어 Exeter는 별도 수학 배치시험을 안내하지만, 이는 그 학교의 사례예요. 모든 학교에 같은 규칙을 적용하지 않아요.',url:'https://exeter.edu/academic-information/',label:'학교별 사례 · Exeter 학업 안내'},
 geometry:{q:'대수 진도가 빠르면 도형이나 자료 공부는 줄여도 되나요?',a:'대수·도형·자료 해석에서 익숙한 부분은 다를 수 있어요. 식 계산이 빠르다는 이유로 도형의 조건 설명이나 표·그래프 읽기를 모두 배웠다고 처리하지 않아요. 학교의 실제 범위와 필요한 보완을 함께 살펴봐요.'},
 competition:{q:'AMC나 KMO 성적이 보딩 준비에 꼭 필요한가요?',a:'이 지도에서는 경시를 모든 학생의 필수 조건으로 두지 않아요. 학교 공부, 대회 문제 해결, 입시에서 요구하는 자료는 각각 따로 살펴봐요. 지원 학교의 실제 조건을 확인하고 아이의 관심·부담에 맞춰 대회 공부를 선택해요.'},
 sat:{q:'AMC를 하면 SAT 수학 준비도 끝나는 건가요?',a:'학교 수학·경시·SAT는 서로 다른 목표로 살펴봐요. 경시에서 어려운 문제를 풀어도 다른 시험의 형식과 자료 해석을 모두 익혔다고 처리하지 않아요. 초4~6 경로 선택만으로 SAT 점수 목표나 응시 시기를 정하지 않아요.'},
 workload:{q:'학기 중과 방학 공부량은 어떻게 다르게 보나요?',a:'학기 중에는 학교 과제와 심화·복습을 꾸준히 이어가고, 방학에는 가능한 범위에서 진도나 연습 분량을 늘리는 길을 볼 수 있어요. 학교별 방학·평가 일정과 아이의 휴식도 달라요. 이 선택으로 개인 완료월이나 고정 공부시간을 계산하지 않아요.'},
 transfer:{q:'전학이나 귀국하면 처음부터 다시 공부해야 하나요?',a:'이미 이해한 내용은 유지하고 새 학교와 다른 단원·표기·설명 방식을 비교해요. 비어 있는 부분만 보완하거나 학교 공부와 심화를 나누어 이어갈 수 있어요. 교육과정 차이를 이유로 모든 과정을 다시 시작할 필요는 없어요.'},
 parentChild:{q:'부모는 보딩을 바라는데 아이는 아직 잘 모르겠대요.',a:'관심을 탐색하는 단계로 두어도 괜찮아요. 어떤 수업과 생활을 좋아하는지 이야기하면서 지금의 학교 공부를 이어가요. 이 경로를 고르는 것이 아이의 진로나 지원을 확정하지는 않아요.'},
 independence:{q:'혼자 공부를 잘해야만 보딩을 생각할 수 있나요?',a:'지금의 모습만으로 적합·부적합을 판정하지 않아요. 과제 시작하기, 막힌 부분 질문하기, 도움을 받고 다시 풀기처럼 작은 경험을 더해 볼 수 있어요. 성향 결과나 선행 진도만으로 새로운 학교 생활을 예측하지 않아요.'},
 nute:{q:'누테는 언제, 어느 과정으로 들어가야 하나요?',a:'해당 지점·과정·회차의 최신 안내와 현재 공부 범위를 비교해요. 예전 자료의 모집월·정답률·기간은 특정 사례예요. 빈 부분을 보완해 합류하거나 다음 회차, 독립 학습을 고를 수 있고 이 지도에서 지원 가능 여부를 자동 판정하지 않아요.'},
 hwangso:{q:'황소를 다니면 누테나 고등 과정으로 꼭 옮겨야 하나요?',a:'현재 황소 과정을 유지하거나 다른 과정으로 옮기거나 독립적으로 공부하는 길을 각각 볼 수 있어요. 학교 학년과 학원 과정명, 실제로 익힌 범위는 구분해요. 목표가 달라지면 이전 갈림길에서 다시 선택할 수 있어요.'},
 bothAcademy:{q:'황소와 누테를 함께 다녀도 괜찮을까요?',a:'학원 이름만으로 병행 가능 여부를 정하지 않아요. 실제 수업·숙제·이동과 학교 과제·휴식이 겹치는지 살펴봐요. 한 과정을 우선하거나 필요한 심화만 따로 공부하고 나중에 전환하는 길도 있어요.'},
 timing:{q:'학원 자료의 기간을 합치면 완료 시기를 알 수 있나요?',a:'기관과 과정의 범위·수업량이 다른 기간을 더하거나 평균내어 개인 완료월로 쓰지 않아요. 원자료의 기간은 그 과정의 참고 정보로 남기고, 아이의 실제 이해와 가능한 공부량을 따로 살펴봐요.'},
 repair:{q:'한 단원에서 막히면 지금 진도를 모두 멈춰야 하나요?',a:'모르는 개념, 조건 읽기, 계산 실수 중 무엇이 어려운지 살펴봐요. 다른 공부는 유지하며 필요한 부분만 보완하거나 잠시 집중한 뒤 합류하는 길을 고를 수 있어요.'},
 rest:{q:'잠깐 쉬면 나중에 따라가기 어려울까요?',a:'쉬었던 시간을 밀린 숙제로 쌓지 않아요. 재개할 때 현재 이해와 생활을 보고 전체 재시작·부분 복습·목표 변경 중 필요한 길을 골라요. 쉬었다는 사실만으로 수준을 낮추거나 기간을 압축하지 않아요.'},
 giftedAdd:{q:'영재원 대비를 추가하면 기존 공부 속도가 줄어드나요?',a:'영재원 대비는 기존 공부에 추가하는 별도 과정입니다. 교과·사고력·심화·연산의 진도와 진행 속도는 유지합니다. 대비 교재·탐구·서술·면접 준비를 별도 시간에 더하며, 선택만으로 기존 교재의 기간이나 다음 과정 시작일을 늦추지 않습니다.'},
 center:{q:'영재원 준비는 지역이 달라도 똑같이 하면 되나요?',a:'지역·교육지원청·기관·과정·모집 학년도에 따라 자격과 평가 방식이 달라요. 사진과 예전 요강의 날짜·선행 수준을 공통 기준으로 삼지 않고, 지원 기관의 해당 연도 안내를 따로 확인해요.'},
 everyday:{q:'모든 아이가 최상위 심화까지 해야 하나요?',a:'학교 공부를 이해하고 활용하는 길, 더 깊은 문제를 즐기는 길, 대회를 준비하는 길을 각각 선택할 수 있어요. 목표·아이의 관심·부담에 맞춰 공부의 깊이와 속도를 따로 살펴봐요.'}
};
const questionSets={
 boarding:['pace','notDecided','dual','parentChild'],international:['curriculum','korea','dual','language'],
 globalFoundation:['stage','language','everyday'],globalBridge:['algebra','geometry','stage'],globalTransition:['placement','transfer','workload'],
 schoolFocus:['korea','language','everyday'],mathLanguage:['language','fluent'],globalAlgebra:['algebra','placement','geometry'],
 globalEnrich:['competition','everyday','workload'],amcExplore:['competition','sat','workload'],boardingLife:['independence','parentChild','workload'],schoolTransfer:['transfer','curriculum'],
 academy:['nute','hwangso','bothAcademy','timing'],nute:['nute','bothAcademy','timing'],hwangsoHigh:['hwangso','bothAcademy','timing'],
 center:['giftedAdd','center','everyday'],centerEdu:['giftedAdd','center'],centerUni:['giftedAdd','center'],repair:['repair'],rest:['rest'],resume:['rest','repair'],season:['workload'],
 contest:['competition','everyday'],afterKmo:['competition','workload'],study:['parentChild','independence'],studySolo:['independence'],studyTalk:['language','independence']
};
freeze(parentQuestions);freeze(questionSets);
function questions(value,active,context={}){
 const trail=normalize(value),at=trail.indexOf(active),prefix=at>=0?trail.slice(0,at+1):trail;
 const id=prefix.at(-1),root=prefix[0];
 if(root==='center'&&Number(context.grade)>=7&&!['giftedSchool','scienceHigh'].includes(context.schoolGoal))return [{id:'centerStage',q:'중등 영재원은 어떤 목표에서 연결하나요?',a:'중등 영재원은 영재학교·과학고 대비 경로에서만 연결합니다. 자사고·일반고 상위권 경로에서는 기존 공부와 필요한 준비를 이어갑니다.'}];
 const ids=[...(questionSets[id]||['everyday','repair','workload']),...(questionSets[root]||[])];
 return [...new Set(ids)].slice(0,5).map(key=>({id:key,...parentQuestions[key]}));
}
function renderQuestions(value,active,context={}){
 const trail=normalize(value),id=trail.includes(active)?active:trail.at(-1);
 return `<section class="pathway-parent-questions" aria-labelledby="parentQuestionsTitle"><h3 id="parentQuestionsTitle">이 로드맵에서 많이 묻는 질문</h3><p>${esc(id?'‘'+paths[id].short+'’ 관련 궁금한 내용을 눌러보세요.':'관심 있는 길을 고르면 상황에 맞는 질문이 여기에 모여요.')}</p><div>${questions(trail,active,context).map(q=>`<details data-parent-question="${esc(q.id)}"><summary>${esc(q.q)}<span aria-hidden="true">+</span></summary><div class="parent-answer"><p>${esc(q.a)}</p>${q.url?`<a href="${esc(q.url)}" target="_blank" rel="noopener noreferrer">${esc(q.label)}</a>`:''}</div></details>`).join('')}</div></section>`;
}
global.PlannerPathways=Object.freeze({roots,paths,normalize,select,entry,detail,renderTrail,renderNext,renderSchoolRoutes,renderExtras,questions,renderQuestions});
})(window);
