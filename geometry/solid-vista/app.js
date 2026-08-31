import { levels as netLevels } from "../games/net-observatory/levels.js?v=net-6";
import { levels as diceLevels } from "../games/dice-roll/levels.js?v=dice-roll-3";
import { levels as somaLevels } from "../games/soma-cube/levels.js?v=soma-1";
import { readProfile } from "../shared/profile-storage.js";

const lang = localStorage.getItem("gfield-language") || "ko";
const profile = readProfile();
const copy = {
  ko: { district:"공간·입체 지구",title:"전개도를 접고 조각을 맞춰 입체의 비밀을 찾아요",subtitle:"평면에서 시작해 주사위, 정다면체, 소마큐브까지 차례로 탐험해요.",net:"전개도 전망대",desc:"면이 접이는 순서와 서로 마주 보는 관계를 관찰해요.",dice:"주사위 굴리기",diceDesc:"격자 위에서 굴러갈 때 윗면·앞면·오른쪽 면의 변화를 따라가요.",session:"단계마다 10문제 · 한 번에 5문제",sheet:"학습지",start:"시작하기",soma:"소마큐브 공방",somaDesc:"일곱 조각을 여러 방향으로 돌려 목표 입체를 완성해요." },
  en: { district:"Spatial Solids District",title:"Fold nets and assemble pieces to uncover solid geometry",subtitle:"Travel from flat patterns to dice, regular solids, and Soma cubes.",net:"Net Observatory",desc:"Watch faces fold and discover how they meet.",dice:"Dice Rolling",diceDesc:"Track the top, front, and right faces as a die rolls across a grid.",session:"10 per stage · 5 each session",sheet:"Worksheet",start:"Start",soma:"Soma Cube Workshop",somaDesc:"Turn seven pieces in space to build target solids." },
  zh: { district:"空间立体区",title:"折叠展开图、组合拼块，发现立体的秘密",subtitle:"从平面图形逐步探索骰子、正多面体和索玛立方。",net:"展开图瞭望台",desc:"观察各面折叠的顺序和相对关系。",dice:"滚骰子",diceDesc:"沿方格滚动骰子，追踪上、前、右三个面的变化。",session:"每阶段10题 · 每次5题",sheet:"练习纸",start:"开始",soma:"索玛立方工坊",somaDesc:"旋转七个拼块，完成目标立体。" },
  ja: { district:"空間・立体エリア",title:"展開図を折り、ピースを組んで立体の秘密を探ろう",subtitle:"平面からサイコロ、正多面体、ソーマキューブへ進みます。",net:"展開図展望台",desc:"面が折れる順番と向かい合う関係を観察します。",dice:"サイコロを転がす",diceDesc:"マス目の上を転がし、上・前・右の面の変化を追います。",session:"各段階10問 · 1回5問",sheet:"プリント",start:"スタート",soma:"ソーマキューブ工房",somaDesc:"7つのピースを回して目標の立体を完成します。" }
};
const levelNames = {
  ko:[["그림 면 마주보기","접어 보며 반대 그림 찾기"],["정육면체 전개도","접히는 전개도 찾기"],["주사위 면 관계","마주 보는 면 찾기"],["기호와 방향","글자·화살표 방향 추론"],["정다면체 탐험","삼각형·오각형 면까지"]],
  en:[["Opposite Pictures","Fold and find the opposite picture"],["Cube Nets","Find a net that folds"],["Dice Faces","Find opposite faces"],["Symbols and Direction","Track arrows and letters"],["Regular Solids","Explore more face shapes"]],
  zh:[["图案的相对面","折起来寻找相对图案"],["正方体展开图","寻找能折叠的展开图"],["骰子的面","寻找相对的面"],["符号与方向","判断箭头和文字"],["正多面体探索","探索更多面的形状"]],
  ja:[["絵の向かい合う面","折って反対の絵を探す"],["立方体の展開図","折れる展開図探し"],["サイコロの面","向かい合う面探し"],["記号と向き","矢印と文字の向き"],["正多面体探検","いろいろな面の形"]]
};
const c = copy[lang] || copy.ko;
document.documentElement.lang = lang;
document.querySelector("#districtName").textContent = c.district;
document.querySelector("#title").textContent = c.title;
document.querySelector("#subtitle").textContent = c.subtitle;
document.querySelector("#netTitle").textContent = c.net;
document.querySelector("#netDescription").textContent = c.desc;
document.querySelector("#sessionLabel").textContent = c.session;
document.querySelector("#netWorksheetLink").textContent = c.sheet;
document.querySelector("#diceTitle").textContent = c.dice;
document.querySelector("#diceDescription").textContent = c.diceDesc;
document.querySelector("#diceSessionLabel").textContent = c.session;
document.querySelector("#diceWorksheetLink").textContent = c.sheet;
document.querySelector("#somaTitle").textContent = c.soma;
document.querySelector("#somaDescription").textContent = c.somaDesc;
document.querySelector("#somaSessionLabel").textContent = c.session;
document.querySelector("#playerName").textContent = profile.name || "GFIELD";
const names = levelNames[lang] || levelNames.ko;
const bandNames = {
  ko: ["입문", "초급", "초급", "중급", "중급"], en: ["Intro", "Beginner", "Beginner", "Intermediate", "Intermediate"],
  zh: ["入门", "初级", "初级", "中级", "中级"], ja: ["入門", "初級", "初級", "中級", "中級"]
}[lang] || ["입문", "초급", "초급", "중급", "중급"];
const grid = document.querySelector("#netLevelGrid");
netLevels.forEach((level, index) => {
  const link = document.createElement("a");
  link.className = "level-card";
  link.href = `../games/net-observatory/?level=${level.id}`;
  link.innerHTML = `<img src="./assets/net-level-${level.id}.webp?v=material-3" alt="" /><div><span>${bandNames[index]}</span><strong>${level.id}. ${names[index][0]}</strong><p>${names[index][1]}</p><b>${c.start} ›</b></div>`;
  grid.append(link);
});

const diceNames = {
  ko:[["한 칸 굴리기","한 번 굴린 뒤 윗면 찾기"],["이어 굴리기","두세 칸의 면 변화 따라가기"],["시계 방향 돌기","시계·반시계 경로의 눈 변화"],["격자 길 따라가기","긴 경로의 세 면 추적"],["거꾸로 경로 찾기","도착한 주사위로 이동 추리"]],
  en:[["One Roll","Find the new top face"],["Roll On","Track two or three moves"],["Around the Clock","Follow clockwise routes"],["Grid Route","Track three visible faces"],["Reverse Route","Infer the path from the result"]],
  zh:[["滚动一格","找出新的上面"],["连续滚动","追踪两三次移动"],["顺逆时针","沿环形路径追踪"],["方格路线","追踪三个可见面"],["逆向找路","根据结果推断路径"]],
  ja:[["1マス転がす","新しい上面を見つける"],["続けて転がす","2・3回の変化を追う"],["時計回り","円を回る経路を追う"],["マス目の道","見える3面を追う"],["逆向きの道","結果から経路を考える"]]
};
const diceGrid=document.querySelector("#diceLevelGrid");
const diceBands={ko:["초급","초급","초급","중급","중급"],en:["Beginner","Beginner","Beginner","Intermediate","Intermediate"],zh:["初级","初级","初级","中级","中级"],ja:["初級","初級","初級","中級","中級"]}[lang]||["초급","초급","초급","중급","중급"];
diceLevels.forEach((level,index)=>{
  const names=(diceNames[lang]||diceNames.ko)[index]; const link=document.createElement("a");
  link.className="level-card dice-card";link.href=`../games/dice-roll/?level=${level.id}`;
  link.innerHTML=`<div class="dice-card-art" aria-hidden="true"><i></i><i></i><i></i><em>${["→","↱","↺","⇢","?"][index]}</em></div><div><span>${diceBands[index]}</span><strong>${level.id}. ${names[0]}</strong><p>${names[1]}</p><b>${c.start} ›</b></div>`;
  diceGrid.append(link);
});

const somaNames = {
  ko:[["같은 조각 찾기","돌려도 같은 조각 판별"],["두 조각 맞추기","작은 입체 직접 조립"],["다른 조각, 같은 모양","세 조각으로 목표 완성"],["빈 큐브 채우기","3×3×3 나머지 완성"],["일곱 조각 도전","다른 조립법 탐색"]],
  en:[["Find the Same Piece","Recognize it after rotation"],["Fit Two Pieces","Build a small solid"],["Different Pieces, Same Solid","Build the target with three pieces"],["Fill the Cube","Complete the 3×3×3 solid"],["Seven-Piece Challenge","Explore another assembly"]],
  zh:[["寻找相同拼块","判断旋转后的相同拼块"],["两个拼块","搭成小立体"],["不同拼块，相同形状","用三个拼块完成目标"],["填满立方体","完成3×3×3立方体"],["七块挑战","探索不同拼法"]],
  ja:[["同じピース探し","回転後も同じ形を見分ける"],["2ピース組み立て","小さな立体を作る"],["違うピース、同じ形","3ピースで目標を作る"],["立方体を埋める","3×3×3を完成"],["7ピース挑戦","別の組み方を探す"]]
};
const somaBands = {ko:["키즈","Pre","입문","초급","중급"],en:["Kids","Pre","Starter","Elementary","Intermediate"],zh:["儿童","Pre","入门","初级","中级"],ja:["キッズ","Pre","入門","初級","中級"]}[lang] || ["키즈","Pre","입문","초급","중급"];
const somaGrid = document.querySelector("#somaLevelGrid");
somaLevels.forEach((level,index)=>{
  const names=(somaNames[lang]||somaNames.ko)[index];
  const link=document.createElement("a");link.className="level-card soma-card";link.href=`../games/soma-cube/?level=${level.id}`;
  link.innerHTML=`<img src="./assets/soma-level-${level.id}.webp?v=material-2" alt="" /><div><span>${somaBands[index]}</span><strong>${names[0]}</strong><p>${names[1]}</p><b>${c.start} ›</b></div>`;somaGrid.append(link);
});
