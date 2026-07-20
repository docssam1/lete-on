export const COUNTRY_TOTAL = 195;

export const countries = [
  {id:'KR',name:'대한민국',continent:'asia',flag:'🇰🇷',capital:'서울',language:'한국어',currency:'원',location:'동아시아의 한반도 남쪽',geography:'산지가 많고 삼면이 바다와 맞닿아 있어요.',human:'빠른 산업 성장과 K-pop·영화 등 현대 문화로 널리 알려져 있어요.',history:'한글은 15세기 세종대왕 때 창제되었어요.',clue:'한글과 K-pop, 한반도 남쪽으로 알려진 나라예요.',map:{x:82,y:35},reward:'한복 모자',building:'경복궁'},
  {id:'JP',name:'일본',continent:'asia',flag:'🇯🇵',capital:'도쿄',language:'일본어',currency:'엔',location:'동아시아의 태평양 섬나라',geography:'네 개의 큰 섬과 많은 작은 섬으로 이루어졌어요.',human:'애니메이션과 전통 공예, 첨단 제조업이 유명해요.',history:'에도 시대 이후 메이지 유신을 거치며 근대화했어요.',clue:'후지산과 벚꽃, 네 개의 큰 섬으로 유명한 나라예요.',map:{x:86,y:32},reward:'벚꽃 장식',building:'도리이'},
  {id:'CN',name:'중국',continent:'asia',flag:'🇨🇳',capital:'베이징',language:'중국어',currency:'위안',location:'동아시아',geography:'세계에서 면적이 매우 큰 나라 중 하나이며 다양한 기후가 나타나요.',human:'긴 역사와 다양한 민족·음식 문화가 있어요.',history:'진시황 때 중국 최초의 통일 제국이 세워졌어요.',clue:'만리장성과 자금성으로 유명한 동아시아의 큰 나라예요.',map:{x:76,y:33},reward:'붉은 등',building:'만리장성'},
  {id:'IN',name:'인도',continent:'asia',flag:'🇮🇳',capital:'뉴델리',language:'힌디어·영어 등',currency:'루피',location:'남아시아',geography:'북쪽에는 히말라야산맥, 남쪽에는 인도양이 있어요.',human:'언어와 종교, 음식 문화가 매우 다양해요.',history:'인더스 문명이 발달했고 비폭력 독립운동으로 알려져 있어요.',clue:'타지마할과 갠지스강으로 유명한 남아시아 나라예요.',map:{x:70,y:45},reward:'공작 깃털',building:'타지마할'},
  {id:'TH',name:'태국',continent:'asia',flag:'🇹🇭',capital:'방콕',language:'태국어',currency:'밧',location:'동남아시아',geography:'열대 기후와 차오프라야강 평야가 발달했어요.',human:'불교 사원과 음식 문화로 잘 알려져 있어요.',history:'동남아시아에서 식민 지배를 피한 나라로 알려져 있어요.',clue:'방콕과 코끼리, 화려한 불교 사원으로 유명해요.',map:{x:76,y:49},reward:'연꽃 장식',building:'황금 사원'},
  {id:'ID',name:'인도네시아',continent:'asia',flag:'🇮🇩',capital:'자카르타',language:'인도네시아어',currency:'루피아',location:'동남아시아와 오세아니아 사이',geography:'수천 개의 섬과 많은 화산으로 이루어진 나라예요.',human:'세계에서 무슬림 인구가 가장 많은 나라예요.',history:'해상 교역과 향신료 무역의 중심지였어요.',clue:'수천 개의 섬과 많은 화산으로 이루어진 나라예요.',map:{x:79,y:60},reward:'바틱 가방',building:'보로부두르'},
  {id:'GB',name:'영국',continent:'europe',flag:'🇬🇧',capital:'런던',language:'영어',currency:'파운드',location:'유럽 북서쪽의 섬나라',geography:'그레이트브리튼섬과 북아일랜드 등으로 구성돼요.',human:'영어와 의회 정치, 대중문화에 큰 영향을 주었어요.',history:'18세기 산업혁명이 가장 먼저 시작된 나라예요.',clue:'빅벤과 산업혁명, 셰익스피어로 알려진 나라예요.',map:{x:48,y:26},reward:'왕관',building:'빅벤'},
  {id:'FR',name:'프랑스',continent:'europe',flag:'🇫🇷',capital:'파리',language:'프랑스어',currency:'유로',location:'서유럽',geography:'대서양과 지중해에 모두 접해 있어요.',human:'미술·패션·요리 문화가 세계적으로 유명해요.',history:'1789년 프랑스혁명은 근대 시민사회에 큰 영향을 주었어요.',clue:'에펠탑과 루브르박물관이 있는 서유럽 나라예요.',map:{x:50,y:31},reward:'베레모',building:'에펠탑'},
  {id:'DE',name:'독일',continent:'europe',flag:'🇩🇪',capital:'베를린',language:'독일어',currency:'유로',location:'중부 유럽',geography:'유럽의 중앙에 있어 여러 나라와 국경을 맞대고 있어요.',human:'공학·음악·철학 전통이 발달했어요.',history:'1990년에 동독과 서독이 통일되었어요.',clue:'베를린과 자동차 산업, 통일의 역사로 유명해요.',map:{x:54,y:29},reward:'음표 모자',building:'브란덴부르크문'},
  {id:'IT',name:'이탈리아',continent:'europe',flag:'🇮🇹',capital:'로마',language:'이탈리아어',currency:'유로',location:'남유럽',geography:'지중해로 뻗은 장화 모양의 반도가 특징이에요.',human:'미술·건축·음식 문화에 큰 영향을 주었어요.',history:'고대 로마 제국과 르네상스의 중심지였어요.',clue:'장화 모양 반도와 로마, 르네상스로 유명해요.',map:{x:55,y:36},reward:'화가 모자',building:'콜로세움'},
  {id:'ES',name:'스페인',continent:'europe',flag:'🇪🇸',capital:'마드리드',language:'스페인어',currency:'유로',location:'유럽 남서부 이베리아반도',geography:'대서양과 지중해에 접해 있어요.',human:'스페인어는 세계 여러 지역에서 사용돼요.',history:'대항해시대에 세계 여러 지역과 교류했어요.',clue:'마드리드와 플라멩코, 이베리아반도에 있는 나라예요.',map:{x:47,y:37},reward:'부채',building:'사그라다 파밀리아'},
  {id:'GR',name:'그리스',continent:'europe',flag:'🇬🇷',capital:'아테네',language:'그리스어',currency:'유로',location:'유럽 남동부',geography:'에게해의 많은 섬과 산지가 특징이에요.',human:'철학·연극·올림픽의 전통으로 알려져 있어요.',history:'고대 아테네에서 민주 정치가 발전했어요.',clue:'고대 올림픽과 아테네, 많은 섬으로 유명해요.',map:{x:59,y:38},reward:'월계관',building:'파르테논'},
  {id:'EG',name:'이집트',continent:'africa',flag:'🇪🇬',capital:'카이로',language:'아랍어',currency:'이집트 파운드',location:'아프리카 북동부',geography:'나일강 주변에 인구와 농경지가 모여 있어요.',human:'아랍 문화와 고대 유산이 함께 나타나요.',history:'고대 이집트 문명은 피라미드와 상형문자를 남겼어요.',clue:'나일강과 피라미드로 유명한 아프리카 나라예요.',map:{x:58,y:44},reward:'파라오 장식',building:'피라미드'},
  {id:'ZA',name:'남아프리카 공화국',continent:'africa',flag:'🇿🇦',capital:'프리토리아 등',language:'줄루어·영어 등',currency:'랜드',location:'아프리카 대륙 남단',geography:'대서양과 인도양이 만나는 지역에 있어요.',human:'여러 언어와 문화가 공존해요.',history:'아파르트헤이트가 폐지되고 넬슨 만델라가 대통령이 되었어요.',clue:'아프리카 남단에 있으며 넬슨 만델라로 알려진 나라예요.',map:{x:55,y:77},reward:'프로테아 꽃',building:'케이프타운 탑'},
  {id:'KE',name:'케냐',continent:'africa',flag:'🇰🇪',capital:'나이로비',language:'스와힐리어·영어',currency:'케냐 실링',location:'아프리카 동부',geography:'대지구대와 사바나가 나타나요.',human:'마사이 문화와 장거리 달리기로 잘 알려져 있어요.',history:'1963년 영국에서 독립했어요.',clue:'사바나와 야생동물, 나이로비로 유명한 동아프리카 나라예요.',map:{x:62,y:59},reward:'사파리 모자',building:'사바나 전망대'},
  {id:'NG',name:'나이지리아',continent:'africa',flag:'🇳🇬',capital:'아부자',language:'영어 등',currency:'나이라',location:'서아프리카',geography:'기니만에 접하고 나이저강이 흘러요.',human:'아프리카에서 인구가 가장 많은 나라예요.',history:'다양한 왕국과 도시 국가의 역사가 있어요.',clue:'아프리카에서 인구가 가장 많고 놀리우드로 유명해요.',map:{x:49,y:55},reward:'영화 슬레이트',building:'아부자 게이트'},
  {id:'US',name:'미국',continent:'north-america',flag:'🇺🇸',capital:'워싱턴 D.C.',language:'영어',currency:'달러',location:'북아메리카',geography:'대서양과 태평양 사이에 넓게 펼쳐져 있어요.',human:'다양한 이민 문화와 과학·대중문화 산업이 발달했어요.',history:'1776년 독립선언을 발표했어요.',clue:'자유의 여신상과 50개 주로 알려진 나라예요.',map:{x:19,y:35},reward:'별 모자',building:'자유의 여신상'},
  {id:'CA',name:'캐나다',continent:'north-america',flag:'🇨🇦',capital:'오타와',language:'영어·프랑스어',currency:'캐나다 달러',location:'북아메리카 북부',geography:'면적이 매우 넓고 호수와 숲이 많아요.',human:'다문화 사회와 아이스하키로 알려져 있어요.',history:'영국과 프랑스 문화의 영향을 함께 받았어요.',clue:'단풍잎 국기와 넓은 숲, 많은 호수로 유명해요.',map:{x:18,y:24},reward:'단풍잎 모자',building:'CN 타워'},
  {id:'MX',name:'멕시코',continent:'north-america',flag:'🇲🇽',capital:'멕시코시티',language:'스페인어',currency:'멕시코 페소',location:'북아메리카 남부',geography:'고원과 산맥, 긴 해안선이 있어요.',human:'다양한 음식과 음악, 축제 문화가 발달했어요.',history:'마야와 아스테카 문명의 유산이 남아 있어요.',clue:'마야 유적과 타코, 선인장으로 잘 알려져 있어요.',map:{x:20,y:45},reward:'솜브레로',building:'치첸이트사'},
  {id:'BR',name:'브라질',continent:'south-america',flag:'🇧🇷',capital:'브라질리아',language:'포르투갈어',currency:'헤알',location:'남아메리카 동부',geography:'아마존강과 세계 최대 규모의 열대우림이 있어요.',human:'축구와 삼바, 다양한 문화로 유명해요.',history:'남아메리카에서 포르투갈의 지배를 받았던 가장 큰 나라예요.',clue:'아마존 열대우림과 축구, 삼바로 유명해요.',map:{x:32,y:66},reward:'축구공',building:'구세주 그리스도상'},
  {id:'AR',name:'아르헨티나',continent:'south-america',flag:'🇦🇷',capital:'부에노스아이레스',language:'스페인어',currency:'아르헨티나 페소',location:'남아메리카 남부',geography:'안데스산맥과 팜파스 평원이 있어요.',human:'탱고와 축구 문화가 유명해요.',history:'19세기 초 스페인에서 독립했어요.',clue:'탱고와 팜파스 평원, 남아메리카 남부의 나라예요.',map:{x:30,y:79},reward:'탱고 모자',building:'오벨리스크'},
  {id:'PE',name:'페루',continent:'south-america',flag:'🇵🇪',capital:'리마',language:'스페인어·케추아어 등',currency:'솔',location:'남아메리카 서부',geography:'안데스산맥과 태평양 해안, 아마존 지역이 있어요.',human:'고산 지역의 전통 문화와 음식이 발달했어요.',history:'잉카 제국의 중심지였어요.',clue:'마추픽추와 잉카 문명으로 유명한 나라예요.',map:{x:27,y:63},reward:'알파카 모자',building:'마추픽추'},
  {id:'AU',name:'오스트레일리아',continent:'oceania',flag:'🇦🇺',capital:'캔버라',language:'영어',currency:'호주 달러',location:'오세아니아',geography:'대륙 대부분이 건조하며 독특한 생물이 많아요.',human:'원주민 문화와 현대 이민 문화가 공존해요.',history:'애버리지널 문화는 세계에서 가장 오래 이어진 문화 전통 중 하나예요.',clue:'캥거루와 오페라하우스로 유명한 대륙 국가예요.',map:{x:85,y:72},reward:'탐험가 모자',building:'시드니 오페라하우스'},
  {id:'NZ',name:'뉴질랜드',continent:'oceania',flag:'🇳🇿',capital:'웰링턴',language:'영어·마오리어',currency:'뉴질랜드 달러',location:'남태평양',geography:'두 개의 큰 섬을 중심으로 산과 빙하가 발달했어요.',human:'마오리 문화와 자연 보호로 알려져 있어요.',history:'1840년 와이탕이 조약이 체결되었어요.',clue:'키위새와 마오리 문화로 유명한 남태평양 나라예요.',map:{x:93,y:79},reward:'키위새 가방',building:'스카이 타워'}
];

export const continentNames={all:'전 세계',asia:'아시아',europe:'유럽',africa:'아프리카','north-america':'북아메리카','south-america':'남아메리카',oceania:'오세아니아'};

export const rewards=[
  {id:'explorer-hat',name:'세계 탐험 모자',cost:40,icon:'🧢'},
  {id:'passport-bag',name:'여권 가방',cost:80,icon:'🎒'},
  {id:'gold-compass',name:'황금 나침반',cost:130,icon:'🧭'}
];

export const buildings=[
  {id:'museum',name:'세계 박물관',cost:100,icon:'🏛️'},
  {id:'station',name:'탐험 기차역',cost:160,icon:'🚉'},
  {id:'library',name:'지구 도서관',cost:220,icon:'📚'}
];