export const languages=['ko','en','zh','ja'];
const strings={
ko:{title:'숫자 색종이 공방',back:'놀이터로',language:'언어',activity:'모을 조각',cut:'잘린 조각 모으기',remain:'남은 종이 모으기',
'fold-h':'종이 끝을 잡고 반으로 접어 봐!','fold-v':'한 번 더, 옆으로 접어 볼까?',cutAction:'가위로 빗금 부분을 잘라 봐!',
'unfold-v':'어떻게 잘렸을까? 옆으로 펼쳐 봐!','unfold-h':'한 번 더 펼치면… 짜잔!',collectCut:'잘린 조각을 바구니에 담아 봐!',collectRemain:'남은 종이를 바구니에 담아 봐!',done:'네가 만든 숫자 조각, 멋지다!',
fold:'잡아서 접기',unfold:'잡아서 펼치기',cutCell:'가위로 자르기',piece:'종이 조각',collect:'바구니에 담기',tray:'조각 바구니',sum:'모은 수',tap:'끌어도, 톡 눌러도 돼!',retry:'새 종이로 다시',next:'다음 종이',finish:'공방 완성!',practice:'다른 종이도 만들기',collection:'내가 만든 종이',complete:'다섯 장을 모두 만들었어!',storage:'이 기기에서 진행을 저장하지 못했어요.',step:['접기','자르기','펼치기','모으기'],sheet:'번째 종이',ready:'조각을 여기로',cuts:'자른 곳',pieces:'조각',saved:'이어서 만들기'},
en:{title:'Number Paper Studio',back:'Playground',language:'Language',activity:'Pieces to collect',cut:'Collect cut pieces',remain:'Collect the paper left',
'fold-h':'Grab the edge and fold in half!','fold-v':'Now fold it sideways!',cutAction:'Snip the striped patch!',
'unfold-v':'What happened? Open it sideways!','unfold-h':'Open it again… ta-da!',collectCut:'Bring the cut pieces to your basket!',collectRemain:'Bring the paper left to your basket!',done:'Look what you made!',
fold:'Grab to fold',unfold:'Grab to open',cutCell:'Snip with scissors',piece:'Paper piece',collect:'Put in basket',tray:'Piece basket',sum:'Numbers collected',tap:'Drag it, or give it a tap!',retry:'Try a fresh sheet',next:'Next sheet',finish:'Studio complete!',practice:'Make more paper',collection:'My paper creations',complete:'You made all five sheets!',storage:'Progress could not be saved on this device.',step:['Fold','Snip','Open','Collect'],sheet:'sheet',ready:'Pieces go here',cuts:'snipped',pieces:'pieces',saved:'Keep making'},
zh:{title:'数字折纸工坊',back:'游乐场',language:'语言',activity:'收集纸片',cut:'收集剪下的纸片',remain:'收集剩下的纸',
'fold-h':'抓住纸边，对折一下！','fold-v':'再从侧面对折！',cutAction:'用剪刀剪下斜线部分！',
'unfold-v':'剪成什么样了？从侧面打开！','unfold-h':'再展开一次……看！',collectCut:'把剪下的纸片放进篮子！',collectRemain:'把剩下的纸放进篮子！',done:'看看你做的数字纸片！',
fold:'抓住并对折',unfold:'抓住并展开',cutCell:'用剪刀剪开',piece:'纸片',collect:'放入篮子',tray:'纸片篮子',sum:'收集的数字',tap:'可以拖动，也可以轻点！',retry:'重新折一张',next:'下一张纸',finish:'工坊完成！',practice:'再做几张',collection:'我的折纸',complete:'五张都做好了！',storage:'此设备无法保存进度。',step:['折叠','剪开','展开','收集'],sheet:'张纸',ready:'把纸片放这里',cuts:'已剪',pieces:'纸片',saved:'继续制作'},
ja:{title:'数字おりがみ工房',back:'あそび場へ',language:'言語',activity:'集める紙',cut:'切った紙を集める',remain:'残った紙を集める',
'fold-h':'紙のはしをつかんで半分に！','fold-v':'横にも、もう一回！',cutAction:'しましまをハサミで切ろう！',
'unfold-v':'どう切れたかな？横に開こう！','unfold-h':'もう一回開くと…じゃーん！',collectCut:'切った紙をかごに入れよう！',collectRemain:'残った紙をかごに入れよう！',done:'数字の紙、できあがり！',
fold:'つかんで折る',unfold:'つかんで開く',cutCell:'ハサミで切る',piece:'紙のかけら',collect:'かごに入れる',tray:'紙のかご',sum:'集めた数',tap:'ドラッグでも、タップでも！',retry:'新しい紙でもう一度',next:'次の紙',finish:'工房完成！',practice:'もっと作る',collection:'作った紙',complete:'五枚ぜんぶできたね！',storage:'この端末では進み具合を保存できません。',step:['折る','切る','開く','集める'],sheet:'枚目',ready:'ここに入れてね',cuts:'切った所',pieces:'かけら',saved:'つづきから'}
};
const challengeText={
ko:{difficulty:'난이도',playMode:'기본 · 모으기',challengeMode:'도전 · 계산',calculate:'바구니 속 수를 모두 더해 봐!',calculateHelp:'조각을 다 담았어. 이제 네가 계산할 차례!',calculateStep:'계산하기',answerLabel:'바구니 속 수의 합',checkSum:'확인',tryAgain:'조각은 그대로야. 다시 더해 볼까?'},
en:{difficulty:'Difficulty',playMode:'Play',challengeMode:'Challenge',calculate:'Add the numbers in your basket!',calculateHelp:'All pieces are in. Your turn to work out the sum!',calculateStep:'Add',answerLabel:'Basket sum',checkSum:'Check',tryAgain:'Your pieces are safe. Try adding again.'},
zh:{difficulty:'难度',playMode:'基础 · 收集',challengeMode:'挑战 · 计算',calculate:'把篮子里的数字加起来！',calculateHelp:'纸片都收好了，现在自己算一算！',calculateStep:'计算',answerLabel:'篮中数字的和',checkSum:'确认',tryAgain:'纸片都在，再加一次吧！'},
ja:{difficulty:'難しさ',playMode:'基本 · 集める',challengeMode:'挑戦 · 計算',calculate:'かごの中の数を足してみよう！',calculateHelp:'紙は全部入ったよ。次は自分で計算！',calculateStep:'計算',answerLabel:'かごの数の合計',checkSum:'確認',tryAgain:'紙はそのまま。もう一度足してみよう。'}
};
const helpText={
ko:{helpCalculate:'도와줘요',helpTitle:'하나씩 같이 더해 보자!',helpClose:'계산 도움 닫기',helpNext:'다음 수 더하기',writeAnswer:'답 쓰기',assistedDone:'함께 계산했어!'},
en:{helpCalculate:'Help me',helpTitle:'Let’s add one number at a time!',helpClose:'Close calculation help',helpNext:'Add the next number',writeAnswer:'Write my answer',assistedDone:'Calculated with help!'},
zh:{helpCalculate:'帮帮我',helpTitle:'一起一个一个加！',helpClose:'关闭计算帮助',helpNext:'加下一个数字',writeAnswer:'填写答案',assistedDone:'一起算出来了！'},
ja:{helpCalculate:'手伝って',helpTitle:'一つずつ一緒に足そう！',helpClose:'計算の手助けを閉じる',helpNext:'次の数を足す',writeAnswer:'答えを書く',assistedDone:'一緒に計算できたね！'}
};
const tenText={
ko:{tenPair:(a,b)=>`${a}${[1,3,6,7,8].includes(a)?'이랑':'랑'} ${b}, 10 짝꿍 발견!`,tenGroup:'작은 수들, 뭉치면 딱 10!',tenSplit:'10까지 살짝 이사해 볼까?',tenPacked:'10 한 묶음, 쏙!',tenFinal:'10씩 세면 금방이지!',tenLeft:'남은 수',tenGoal:'10칸 채우기',tenBags:'만든 10',tenPairNote:'짝꿍끼리 딱 붙여 보자!',packTen:'10으로 묶기',findTen:'다음 10 찾기',addTens:'묶음과 나머지 더하기',noLeft:'남은 수는 0',splitNumber:(v,a,b)=>`${v} = ${a} + ${b}, 나눠서 옮기자!`},
en:{tenPair:(a,b)=>`${a} and ${b}: partners for 10!`,tenGroup:'Small numbers can team up to make 10!',tenSplit:'Move just enough to make 10!',tenPacked:'One bundle of 10!',tenFinal:'Count tens, then what is left!',tenLeft:'Left over',tenGoal:'Fill ten',tenBags:'Tens made',tenPairNote:'Bring these partners together.',packTen:'Bundle 10',findTen:'Find the next 10',addTens:'Add tens and leftovers',noLeft:'Nothing left: 0',splitNumber:(v,a,b)=>`Split ${v} into ${a} and ${b}.`},
zh:{tenPair:(a,b)=>`${a}和${b}，凑10的好伙伴！`,tenGroup:'小数字一起凑成10！',tenSplit:'搬一点，刚好凑10！',tenPacked:'一组10，完成！',tenFinal:'先数整十，再加剩下的！',tenLeft:'剩余数量',tenGoal:'填满十格',tenBags:'已凑整十',tenPairNote:'把这对伙伴合起来！',packTen:'凑成一组10',findTen:'找下一组10',addTens:'整十加剩余',noLeft:'剩余为0',splitNumber:(v,a,b)=>`把${v}分成${a}和${b}。`},
ja:{tenPair:(a,b)=>`${a}と${b}、10のなかま！`,tenGroup:'小さな数も集まると10！',tenSplit:'少しお引っ越しして10に！',tenPacked:'10のまとまり、できた！',tenFinal:'10ずつ数えて、残りを足そう！',tenLeft:'残りの数',tenGoal:'10マスにする',tenBags:'できた10',tenPairNote:'なかまを合わせてみよう！',packTen:'10にまとめる',findTen:'次の10を探す',addTens:'まとまりと残りを足す',noLeft:'残りは0',splitNumber:(v,a,b)=>`${v}を${a}と${b}に分けよう。`}
};
const directionText={
ko:{foldDirections:'접는 방향',openDirections:'거꾸로 펼치기',predictShape:'펼치면 어떤 모양일까? 접은 선을 기준으로 예상해 봐!',directions:{up:'아래 → 위',down:'위 → 아래',left:'오른쪽 → 왼쪽',right:'왼쪽 → 오른쪽'}},
en:{foldDirections:'Fold order',openDirections:'Open in reverse',predictShape:'Imagine the open shape. Reflect across each fold!',directions:{up:'Bottom → top',down:'Top → bottom',left:'Right → left',right:'Left → right'}},
zh:{foldDirections:'折叠方向',openDirections:'倒序展开',predictShape:'展开后是什么形状？沿折线对称想一想！',directions:{up:'下 → 上',down:'上 → 下',left:'右 → 左',right:'左 → 右'}},
ja:{foldDirections:'折る向き',openDirections:'逆の順に開く',predictShape:'開くとどんな形？折り目で対称に考えよう！',directions:{up:'下 → 上',down:'上 → 下',left:'右 → 左',right:'左 → 右'}}
};
for(const lang of languages)Object.assign(strings[lang],helpText[lang],tenText[lang],directionText[lang]);
for(const lang of languages)Object.assign(strings[lang],challengeText[lang]);
export const translation=lang=>strings[lang]||strings.ko;
for(const [lang,label] of Object.entries({ko:'내 종이 학습지',en:'My paper worksheet',zh:'我的折纸练习',ja:'同じ紙のプリント'}))strings[lang].worksheet=label;
