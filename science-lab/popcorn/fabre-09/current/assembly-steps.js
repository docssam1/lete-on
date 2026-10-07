// A separate build-only slideshow. No quiz, concept lesson, prediction or learner record.
export const assemblySlides = [
 {id:'unpack',title:'봉지를 열고 준비물을 꺼내요',body:'봉지 윗부분을 천천히 열고, 부품을 책상 위에 꺼내 놓아요.',care:'작은 전구와 소켓이 떨어지지 않게 해요. 가위가 필요하면 보호자에게 부탁해요.',photo:'package',kind:'bag'},
 {id:'parts',title:'판에서 부품을 하나씩 떼어요',body:'판에 붙어 있는 부품은 홈을 따라 천천히 떼어요. 이미 분리된 부품은 책상에 나란히 놓아요. A 바닥판, B 전구판, C 윗판, D 앞판, E 뒷판, F 옆판 두 장을 찾아요. 종이·소켓·전구·스위치·전지끼우개 두 개와 전선도 놓아요.',care:'한 손으로 판을 받치고, 작은 연결 부분부터 천천히 떼어요. 뻑뻑하면 보호자에게 부탁해요. 건전지는 계속 따로 두어요.',photo:'parts',model:'parts',voice:'parts'},
 {id:'paper',title:'창 뒤에 종이를 붙여요',body:'C·D·E와 F 두 장의 창 뒤에 기름종이를 붙여요. 판의 안쪽에서 붙이고, 바깥으로 삐져나온 종이는 정리해요.',care:'판을 끼우는 홈과 D판의 스위치 구멍을 덮지 않아요. 가위질은 보호자와 해요.',photo:'parts',model:'paper',voice:'paper'},
 {id:'socket',title:'B판에 소켓과 전구를 고정해요',body:'소켓의 서로 다른 두 접점에 전선을 연결해요. B 전구판에 소켓을 고정하고 전구를 천천히 끼워요.',care:'전지는 빼 둔 상태예요. 유리 전구를 세게 누르거나 너무 꽉 조이지 않아요.',photo:'empty-kit',model:'socket',voice:'socket'},
 {id:'switch',title:'D판에 스위치를 끼워요',body:'D 앞판의 작은 구멍에 스위치를 끼워요. 스위치는 가운데 ○ 위치에 두고, 공통·1단·2단 단자를 교구 표시에서 찾아요.',care:'단자의 배열은 제품마다 달라요. 가운데 공통과 양쪽 단자는 보호자와 확인해요.',photo:'empty-kit',model:'switch',voice:'switch'},
 {id:'wire1',title:'첫 빨간 선을 전구에 연결해요',body:'첫 번째 전지끼우개의 빨간 선을 전구 소켓의 한 접점에 연결해요.',care:'전지는 넣지 않아요. 연결 금속이 옆 접점과 닿지 않게 해요.',photo:'wiring',model:'wire1',voice:'wire1',focus:1},
 {id:'wire2',title:'전구의 다른 선을 공통 단자에 이어요',body:'전구 소켓의 남은 접점에서 나온 선을 스위치 공통 단자에 연결해요.',care:'전구의 두 접점을 한 선으로 바로 잇지 않아요. 연결 부분을 가볍게 확인해요.',photo:'wiring',model:'wire2',voice:'wire2',focus:2},
 {id:'junction',title:'두 전지끼우개 사이를 이어요',body:'첫 끼우개의 검은 선과 둘째 끼우개의 빨간 선을 연결해요. 이 연결점에서 스위치 1단으로 갈 선도 함께 준비해요.',care:'두 끼우개는 비워 두어요. 연결이 풀리지 않고 금속이 다른 선에 닿지 않도록 해요.',photo:'wiring',model:'junction',voice:'junction',focus:3},
 {id:'wirelow',title:'연결점의 선을 1단에 이어요',body:'두 전지끼우개 사이의 연결점에서 나온 선을 스위치 1단 단자에 연결해요.',care:'스위치 공통 단자와 1단 단자를 바꾸지 않아요. 실제 단자 표시를 확인해요.',photo:'wiring',model:'wirelow',voice:'wirelow',focus:4},
 {id:'wirehigh',title:'남은 검은 선을 2단에 이어요',body:'둘째 전지끼우개의 남은 검은 선을 스위치 2단 단자에 연결해요.',care:'서로 다른 단자의 금속이 맞닿지 않게 해요. 전지는 아직 넣지 않아요.',photo:'wiring',model:'wirehigh',voice:'wirehigh',focus:5},
 {id:'holders',title:'빈 전지끼우개를 A판에 붙여요',body:'전지끼우개 두 개의 바닥에 양면테이프를 붙이고, A 바닥판의 양쪽 가장자리에 나란히 고정해요.',care:'전지칸은 비워 두어요. 전선은 판 가운데 쪽으로 모으고 조립 홈을 가리지 않아요.',photo:'empty-kit',model:'holders',modelNote:'A판에 빈 끼우개를 붙이는 단계예요. 옆판은 아직 없어요.'},
 {id:'frame',title:'옆판 사이에 A·B·C를 끼워요',body:'F 옆판 두 장 사이의 위쪽에 C 윗판, 가운데에 B 전구판, 아래쪽에 A 바닥판을 끼워요.',care:'전선과 종이가 홈에 끼면 멈추고 정리해요. 억지로 누르지 않아요.',photo:'parts',model:'frame',modelNote:'A·B·C와 F 두 장을 끼운 모습이에요. 앞·뒷판은 다음에 닫아요.',defaultModel:true,voice:'assembly'},
 {id:'assembly',title:'앞판과 뒷판을 닫아요',body:'앞쪽에 D, 뒤쪽에 E를 끼워요. 전선은 A판 가운데에 넣고, 판 사이에 눌린 선이 없는지 살펴요.',care:'전지는 계속 빼 두어요. 홈이 잘 맞지 않으면 힘으로 밀지 말고 도움을 요청해요.',photo:'empty-kit',model:'assembly',modelNote:'D 앞판과 E 뒷판을 닫아요. 전지칸은 계속 비어 있어요.',defaultModel:true},
 {id:'inspect',title:'보호자와 마지막 연결을 확인해요',body:'다섯 선의 시작과 끝, 전구·전지의 규격, 금속이 맞닿은 곳을 보호자와 함께 확인해요. 스위치는 가운데 ○에 두어요.',care:'보호자가 확인한 뒤에만 전지를 넣어요. 같은 종류와 상태의 1.5V 전지 두 개와 3V 전구를 사용해요.',photo:'wiring',model:'assembly',kind:'inspect'},
 {id:'test',title:'전지를 넣고 스위치를 눌러요',body:'보호자가 연결을 확인한 뒤 +·− 방향에 맞춰 전지를 넣어요. Ⅰ 1단과 Ⅱ 2단을 눌러 작동을 확인해요.',care:'전지·전선이 뜨거워지면 멈추고 만지지 않은 채 어른에게 알려요. 전지 제거는 보호자가 확인해요.',photo:'stand-open',model:'test',defaultModel:true,kind:'test',voice:'test'},
 {id:'finish',title:'스탠드 완성! 정리도 함께 해요',body:'완성한 스탠드의 판이 잘 끼워졌는지 살펴요. 사용을 마치면 가운데 ○로 끄고, 보호자와 전지를 빼서 따로 보관해요.',care:'부품과 전선을 정리해요. 문제가 남았다면 아래 도움 요청 화면을 선생님이나 보호자에게 보여주세요.',photo:'stand-off',model:'finish',voice:'finish'}
];
export const assemblyPhotos = {
 package:{src:'./assets/learning-visuals/assembly-package.png',alt:'전지가 없는 스탠드 부품이 담긴 투명 봉지',caption:'AI 실사형 봉지 설명 이미지 · 실제 포장은 다를 수 있어요.'},
 parts:{src:'./assets/learning-visuals/parts-flat-photo.png',alt:'A부터 F까지 스탠드 판 부품',caption:'AI 실사형 부품 설명 · 실제 홈은 교구에서 확인해요.'},
 wiring:{src:'./assets/learning-visuals/wiring-five-photo.png',alt:'빈 전지끼우개 두 개, 전구, 스위치의 다섯 선',caption:'AI 실사형 배선 설명 · ③은 두 끼우개 사이 연결점이에요. 실제 단자 표시는 교구에서 확인해요.'},
 'empty-kit':{src:'./assets/experiment-photos/empty-kit.jpg',alt:'전지를 빼 둔 실제 스탠드 교구',caption:'원본 교구 사진 · 조립 중에는 전지칸을 비워 두어요.'},
 'stand-open':{src:'./assets/experiment-photos/stand-open.jpg',alt:'확인을 마치고 전지를 넣은 스탠드 내부',caption:'시험 단계의 원본 교구 사진 · 전지는 보호자 확인 뒤 넣어요.'},
 'stand-off':{src:'./assets/experiment-photos/stand-off.jpg',alt:'완성한 2단 밝기 스탠드',caption:'원본 완성품 사진 · 사용 뒤에는 전지를 빼서 보관해요.'}
};
