import { levels as foldLevels } from "../games/paper-fold/levels.js?v=paper-fold-14";
import { levels as turnLevels } from "../games/paper-turn/levels.js?v=paper-turn-1";
import { readProfile } from "../shared/profile-storage.js";

const $ = (selector) => document.querySelector(selector);
const requestedLang = new URLSearchParams(location.search).get("lang");
const lang = ["ko","en","zh","ja"].includes(requestedLang) ? requestedLang : localStorage.getItem("gfield-language") || "ko";
const profile = readProfile();
const points = Number(localStorage.getItem("gfield-points") || 120);

const text = {
  ko:{worksheet:"학습지",title:"색종이 생각 놀이터",subtitle:"색종이를 접고 펼치며 자르기, 구멍, 계산과 순서를 알아봐요.",courseOne:"COURSE 1 · 접고 펼치기",foldCourseTitle:"자르고, 뚫고, 거꾸로 찾아봐요",foldCourseDesc:"접어 자르기, 구멍 뚫기, 접는 방법 거꾸로 찾기를 섞지 않고 따로 연습해요.",courseTwo:"COURSE 2 · 계산과 순서",applicationTitle:"접은 결과로 계산하고 순서를 찾아요",applicationDesc:"잘린 수의 합과 남은 수의 합, 겹친 색종이의 위아래 순서를 따로 연습해요.",applicationCount:"기존 문제은행 연계 학습지",courseThree:"COURSE 3 · 방향 추적",turnCourseTitle:"돌리고 뒤집은 결과를 찾아요",turnCourseDesc:"회전, 뒤집기와 여러 동작의 순서를 추적해요.",fiveEach:"기본 10문제 · 이어서 최대 20문제",fiveTurn:"레벨마다 10문제 · 한 번에 5문제",worksheetTitle:"색종이 접기 학습지",worksheetDesc:"접기 방향과 활동 유형을 골라 인쇄하고 풀이도 확인해요.",openWorksheet:"학습지 만들기",start:"시작하기",difficulty:"난이도"},
  zh:{worksheet:"练习纸",title:"折纸思维乐园",subtitle:"通过折叠和展开学习剪纸、打孔、计算与顺序。",courseOne:"课程 1 · 折叠与展开",foldCourseTitle:"剪开、打孔、反推折法",foldCourseDesc:"分别练习折叠剪纸、折叠打孔和逆向找折法。",courseTwo:"课程 2 · 计算与顺序",applicationTitle:"根据折叠结果计算并判断顺序",applicationDesc:"分别练习剪掉与剩下数字的和，以及彩纸的上下顺序。",applicationCount:"连接现有题库练习纸",courseThree:"课程 3 · 方向追踪",turnCourseTitle:"找出旋转和翻转后的结果",turnCourseDesc:"追踪旋转、翻转和连续操作。",fiveEach:"默认10题 · 最多继续到20题",fiveTurn:"每级10题 · 每次5题",worksheetTitle:"折纸练习纸",worksheetDesc:"选择折叠方向和活动类型，并查看解题过程。",openWorksheet:"制作练习纸",start:"开始",difficulty:"难度"},
  ja:{worksheet:"プリント",title:"おりがみ思考ひろば",subtitle:"色紙を折って開き、切り方、穴、計算、順序を考えます。",courseOne:"コース 1 · 折って開く",foldCourseTitle:"切って、穴をあけて、折り方をたどろう",foldCourseDesc:"折って切る、穴をあける、折り方を逆にたどる活動を分けて練習します。",courseTwo:"コース 2 · 計算と順序",applicationTitle:"折った結果から計算と順序を考えよう",applicationDesc:"切った数・残った数の和と、重なった色紙の順序を練習します。",applicationCount:"既存問題バンクのプリント",courseThree:"コース 3 · 向きの追跡",turnCourseTitle:"回転・反転した結果を探そう",turnCourseDesc:"回転、反転、連続する動きを追います。",fiveEach:"基本10問 · 続けて最大20問",fiveTurn:"各レベル10問 · 1回5問",worksheetTitle:"おりがみプリント",worksheetDesc:"折る向きと活動を選び、解き方も確認できます。",openWorksheet:"プリントを作る",start:"スタート",difficulty:"難易度"},
  en:{worksheet:"Worksheet",title:"Paper Thinking Studio",subtitle:"Fold and open paper to explore cutting, holes, calculation, and order.",courseOne:"COURSE 1 · Fold and Open",foldCourseTitle:"Cut, punch, and find the fold",foldCourseDesc:"Practice fold-and-cut, fold-and-punch and finding the fold backwards, each on its own.",courseTwo:"COURSE 2 · Calculation and Order",applicationTitle:"Calculate and find order from folded results",applicationDesc:"Practice cut and remaining sums separately from overlapping paper order.",applicationCount:"Linked question-bank worksheets",courseThree:"COURSE 3 · Direction Tracking",turnCourseTitle:"Find the result after turns and flips",turnCourseDesc:"Track rotations, flips, and sequences of moves.",fiveEach:"10 by default · continue up to 20",fiveTurn:"10 per level · 5 each session",worksheetTitle:"Paper Folding Worksheet",worksheetDesc:"Choose a fold direction and activity, with worked solutions.",openWorksheet:"Make Worksheet",start:"Start",difficulty:"Difficulty"}
};
Object.assign(text.ko,{subtitle:"접고 펼치기, 세고 계산하기, 겹친 순서와 방향 추적을 차례로 익혀요.",courseTwo:"COURSE 2 · 세고 계산하기",applicationTitle:"종이를 만지며 수를 발견해요",applicationDesc:"직접 접고 잘라 조각을 모으거나, 학습지에서 수를 계산해요.",courseThree:"COURSE 3 · 겹친 순서",overlapTitle:"보이는 경계로 위아래 순서를 찾아요",overlapDesc:"가장 위·아래의 색종이와 전체 순서를 따로 추론해요.",courseFour:"COURSE 4 · 방향 추적"});
Object.assign(text.zh,{subtitle:"依次学习折叠展开、计数计算、重叠顺序和方向追踪。",courseTwo:"课程 2 · 计数与计算",applicationTitle:"动手折纸，发现数字",applicationDesc:"折纸、剪纸、收集纸片，或用练习纸计算。",courseThree:"课程 3 · 重叠顺序",overlapTitle:"根据可见边界判断上下顺序",overlapDesc:"分别推断最上、最下和完整顺序。",courseFour:"课程 4 · 方向追踪"});
Object.assign(text.ja,{subtitle:"折って開く、数えて計算する、重なり順と向きの追跡を順に学びます。",courseTwo:"コース 2 · 数えて計算",applicationTitle:"紙を動かして数を見つけよう",applicationDesc:"折って切って紙を集めたり、プリントで計算したりしよう。",courseThree:"コース 3 · 重なり順",overlapTitle:"見える境界から上下の順を探そう",overlapDesc:"一番上・下と全体の順を分けて考えます。",courseFour:"コース 4 · 向きの追跡"});
Object.assign(text.en,{subtitle:"Learn fold-and-open, counting and calculation, overlap order, and direction tracking in sequence.",courseTwo:"COURSE 2 · Count and Calculate",applicationTitle:"Make paper, discover numbers",applicationDesc:"Fold, snip, and collect pieces, or explore sums on a worksheet.",courseThree:"COURSE 3 · Overlap Order",overlapTitle:"Use visible edges to find the stack order",overlapDesc:"Reason separately about the top, bottom, and full order.",courseFour:"COURSE 4 · Direction Tracking"});
Object.assign(text.ko,{craftEyebrow:'PAPER MAGIC · 손으로 만드는 놀이',craftTitle:'접고, 자르고, 쌓으며 발견해요',craftDesc:'무늬를 만들고, 조각을 모으고, 겹친 종이를 한 장씩 찾아봐요.'});
Object.assign(text.en,{craftEyebrow:'PAPER MAGIC · Hands-on play',craftTitle:'Fold, snip, stack, and discover',craftDesc:'Create patterns, collect pieces, and uncover paper one layer at a time.'});
Object.assign(text.zh,{craftEyebrow:'彩纸魔法 · 动手玩',craftTitle:'折一折、剪一剪、叠一叠',craftDesc:'创作图案、收集纸片，一层层发现彩纸的秘密。'});
Object.assign(text.ja,{craftEyebrow:'紙マジック · 手を動かそう',craftTitle:'折って、切って、重ねて発見',craftDesc:'模様を作り、かけらを集め、色紙を一枚ずつ見つけよう。'});
const t = (key) => text[lang]?.[key] || text.ko[key];
text.ko.calculationCount="숫자 색종이 게임 2활동 · 기존 학습지";
text.zh.calculationCount="数字彩纸游戏2项活动 · 现有练习纸";
text.ja.calculationCount="数の色紙ゲーム2活動 · 既存プリント";
text.en.calculationCount="2 number-paper activities · existing worksheets";
const difficultyText = {
  기초: { ko:"기초", zh:"基础", ja:"基礎", en:"Basic" },
  응용: { ko:"응용", zh:"应用", ja:"応用", en:"Applied" },
  심화: { ko:"심화", zh:"进阶", ja:"発展", en:"Advanced" },
  입문: { ko:"입문", zh:"入门", ja:"入門", en:"Intro" },
  초급: { ko:"초급", zh:"初级", ja:"初級", en:"Beginner" },
  중급: { ko:"중급", zh:"中级", ja:"中級", en:"Intermediate" }
};
const difficulty = (value) => difficultyText[value]?.[lang] || value;

document.documentElement.lang = lang;
document.querySelectorAll("[data-i18n]").forEach((node) => { node.textContent = t(node.dataset.i18n); });
$("#playerName").textContent = profile.name || "GFIELD";
$("#playerPoints").textContent = `${Number.isFinite(points) ? points : 120} P`;

function renderLevels(levels, selector, game, accents) {
  const grid = $(selector);
  levels.forEach((level, index) => {
    const card = document.createElement("a");
    card.className = "level-card";
    card.href = `../games/${game}/?level=${level.id}`;
    card.style.setProperty("--accent", accents[index]);
    card.innerHTML = `<div class="level-visual"><span class="level-number">${level.id}</span><span class="paper-stack" aria-hidden="true"><i></i><i></i><i></i></span></div><div class="level-copy"><small class="level-stage">${level.difficulty ? `${t("difficulty")} · ${difficulty(level.difficulty)}` : ""}</small><strong>${level.title[lang] || level.title.ko}</strong><p>${level.description[lang] || level.description.ko}</p><span>${t("start")}</span></div>`;
    grid.append(card);
  });
}

renderLevels(foldLevels, "#foldLevelGrid", "paper-fold", ["#eb7f6a", "#57a7d7", "#8d75c9"]);

const foldWorksheetActivities = [
  {
    title:{ko:"색칠 부분 잘라 펼치기",zh:"剪开彩色部分并展开",ja:"色の部分を切って開く",en:"Cut Colored Regions and Unfold"},
    description:{ko:"두 번 접어 색칠한 부분을 자른 뒤, 펼친 모양을 학습지에서 비교해요.",zh:"折叠两次并剪下彩色部分，再比较展开后的图形。",ja:"二回折って色の部分を切り、開いた形を比べます。",en:"Fold twice, cut a colored region, and compare the unfolded result."},
    href:"../worksheet/paper-fold/?modes=unfoldshape&count=10",stage:{ko:"영역 펼치기 · 학습지",zh:"区域展开 · 学习单",ja:"領域を開く · プリント",en:"Region Unfold · Worksheet"}
  }
];

const calculationActivities = [
  {
    title:{ko:"숫자 색종이 공방",zh:"数字折纸工坊",ja:"数字おりがみ工房",en:"Number Paper Studio"},
    description:{ko:"종이를 직접 접고, 가위로 자르고, 펼쳐서 숫자 조각을 모아요.",zh:"亲手折纸、剪开、展开，再收集数字纸片。",ja:"自分で折って、切って、開いて、数字の紙を集めよう。",en:"Fold, snip, unfold, and bring your number pieces to the basket."},
    href:"../games/number-paper/",action:"start",stage:{ko:"접고 자르고 모으기 · 놀이",zh:"折、剪、收集 · 游戏",ja:"折る・切る・集める · あそび",en:"Fold, Snip, Collect · Play"}
  },
  {
    title:{ko:"조각과 구멍 세기",zh:"数纸片和孔",ja:"紙片と穴を数える",en:"Count Pieces and Holes"},
    description:{ko:"펼친 절단선의 조각 수와 원·반원·구멍 수를 세어요.",zh:"数展开后剪线形成的纸片、圆、半圆和孔。",ja:"開いた切り線の紙片と円・半円・穴を数えます。",en:"Count pieces, circles, semicircles, and holes after unfolding."},
    href:"../worksheet/paper-fold/?modes=pieces,punch,hole2,hole3d&count=10",stage:{ko:"도형 세기",zh:"图形计数",ja:"図形を数える",en:"Shape Count"}
  },
  {
    title:{ko:"수가 쓰인 색종이 계산",zh:"数字彩纸计算",ja:"数の色紙を計算",en:"Calculate Numbered Paper"},
    description:{ko:"잘린 수·남은 수의 합과 목표 합, 맨 위의 수를 구해요.",zh:"求剪掉与剩下数字的和、目标和及最上面的数字。",ja:"切った数・残った数の和、目標の和、一番上の数を求めます。",en:"Find cut and remaining sums, target sums, and the top number."},
    href:"../worksheet/paper-fold/?modes=numcut,numsum,numdiag,numinv,foldtop&count=10",stage:{ko:"수와 연산",zh:"数与运算",ja:"数と計算",en:"Number"}
  }
];

const overlapActivities = [
  {
    title:{ko:"겹친 색종이 순서",zh:"叠放彩纸顺序",ja:"重なった色紙の順序",en:"Overlapping Paper Order"},
    description:{ko:"보이는 부분을 비교해 가장 위·아래와 전체 순서를 찾아요.",zh:"比较可见部分，找出最上、最下和完整顺序。",ja:"見える部分を比べ、上下と全体の順序を考えます。",en:"Compare visible regions to find the top, bottom, and full order."},
    href:"../worksheet/paper-fold/?modes=stackfind,stackorder&count=10",stage:{ko:"순서 추론",zh:"顺序推理",ja:"順序推理",en:"Order"}
  }
];

function renderActivities(activities,selector,accents,startIndex=0){
  const grid=$(selector);
  activities.forEach((activity,index)=>{
    const card=document.createElement("a");
    card.className="level-card";
    card.href=activity.href;
    card.style.setProperty("--accent",accents[index]);
    card.innerHTML=`<div class="level-visual"><span class="level-number">${startIndex+index+1}</span><span class="paper-stack" aria-hidden="true"><i></i><i></i><i></i></span></div><div class="level-copy"><small class="level-stage">${activity.stage[lang]||activity.stage.ko}</small><strong>${activity.title[lang]||activity.title.ko}</strong><p>${activity.description[lang]||activity.description.ko}</p><span>${t(activity.action||"openWorksheet")}</span></div>`;
    grid.append(card);
  });
}

renderActivities([
  {title:{ko:'색종이 마술 공방',en:'Paper Magic Studio',zh:'彩纸魔法工坊',ja:'色紙マジック工房'},description:{ko:'가위 마술, 나만의 무늬, 숫자 바구니와 반짝이는 색종이 쌓기를 직접 즐겨요.',en:'Try scissor magic, your own patterns, number baskets, and glossy paper layers.',zh:'亲手体验剪纸魔法、自创图案、数字篮和彩纸叠层。',ja:'はさみマジック、自分の模様、数のかご、色紙の重なりで遊ぼう。'},href:'../games/paper-craft/?lang='+encodeURIComponent(lang),action:'start',stage:{ko:'직접 만들고 발견하기',en:'Make and discover',zh:'动手创造与发现',ja:'作って発見'}},
  {title:{ko:'색종이 마술 활동지',en:'Paper Magic Activity Sheets',zh:'彩纸魔法活动纸',ja:'色紙マジックのプリント'},description:{ko:'종이를 접고 자르고 오려 붙이며 놀아요. 게임에서 만든 내 무늬도 학습지로 이어져요.',en:'Fold, cut, and build with real paper. Bring your own game pattern to a worksheet.',zh:'用真正的纸折、剪、拼。游戏里自创的图案也能打印。',ja:'本物の紙を折って切って並べよう。ゲームで作った模様もプリントにできるよ。'},href:'../worksheet/paper-craft/?family=all&count=33&lang='+encodeURIComponent(lang),stage:{ko:'문제 · 놀이 풀이 · 빠른 정답',en:'Activities · Solutions · Quick answers',zh:'活动 · 解法 · 快速答案',ja:'活動・解き方・答え'}}
],"#craftPlayGrid",['#255f9e','#146b55']);
renderActivities(foldWorksheetActivities,"#foldLevelGrid",["#e5b548"],foldLevels.length);
renderActivities(calculationActivities,"#applicationGrid",["#2456c4","#e5b548","#df7562"]);
renderActivities(overlapActivities,"#overlapGrid",["#57bba6"]);
renderLevels(turnLevels, "#turnLevelGrid", "paper-turn", ["#57bba6", "#ec8c72", "#59a8da", "#8d75c9", "#e5b548"]);
