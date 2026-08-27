import { levels } from "../games/net-observatory/levels.js?v=net-2";
import { readProfile } from "../shared/profile-storage.js";

const lang = localStorage.getItem("gfield-language") || "ko";
const profile = readProfile();
const copy = {
  ko: { district:"공간·입체 지구",title:"전개도를 접어 입체의 비밀을 찾아요",subtitle:"평면에서 시작해 주사위와 정다면체까지 차례로 탐험해요.",net:"전개도 전망대",desc:"면이 접이는 순서와 서로 마주 보는 관계를 관찰해요.",session:"단계마다 10문제 · 한 번에 5문제",start:"시작하기",next:"다음에 열릴 공방",soma:"소마큐브 공방",somaDesc:"여러 조각을 돌려 목표 입체를 완성해요." },
  en: { district:"Spatial Solids District",title:"Fold nets and uncover the secrets of solids",subtitle:"Travel from flat patterns to dice and regular solids.",net:"Net Observatory",desc:"Watch faces fold and discover how they meet.",session:"10 per level · 5 each session",start:"Start",next:"Opening next",soma:"Soma Cube Workshop",somaDesc:"Turn several pieces to build a target solid." },
  zh: { district:"空间立体区",title:"折叠展开图，发现立体的秘密",subtitle:"从平面图形逐步探索骰子和正多面体。",net:"展开图瞭望台",desc:"观察各面折叠的顺序和相对关系。",session:"每级10题 · 每次5题",start:"开始",next:"即将开放",soma:"索玛立方工坊",somaDesc:"旋转多个拼块，完成目标立体。" },
  ja: { district:"空間・立体エリア",title:"展開図を折って立体の秘密を見つけよう",subtitle:"平面からサイコロ、正多面体へ進みます。",net:"展開図展望台",desc:"面が折れる順番と向かい合う関係を観察します。",session:"各レベル10問 · 1回5問",start:"スタート",next:"次にオープン",soma:"ソーマキューブ工房",somaDesc:"いくつかのピースを回して立体を完成します。" }
};
const levelNames = {
  ko:[["정육면체 전개도","접히는 전개도 찾기"],["접어서 완성하기","면을 차례로 접어 보기"],["주사위 면 관계","마주 보는 면 찾기"],["기호와 방향","글자·화살표 방향 추론"],["정다면체 탐험","삼각형·오각형 면까지"]],
  en:[["Cube Nets","Find a net that folds"],["Fold and Finish","Watch faces fold"],["Dice Faces","Find opposite faces"],["Symbols and Direction","Track arrows and letters"],["Regular Solids","Explore more face shapes"]],
  zh:[["正方体展开图","寻找能折叠的展开图"],["折叠并完成","依次观察各面"],["骰子的面","寻找相对的面"],["符号与方向","判断箭头和文字"],["正多面体探索","探索更多面的形状"]],
  ja:[["立方体の展開図","折れる展開図探し"],["折って完成","面を順番に観察"],["サイコロの面","向かい合う面探し"],["記号と向き","矢印と文字の向き"],["正多面体探検","いろいろな面の形"]]
};
const c = copy[lang] || copy.ko;
document.documentElement.lang = lang;
document.querySelector("#districtName").textContent = c.district;
document.querySelector("#title").textContent = c.title;
document.querySelector("#subtitle").textContent = c.subtitle;
document.querySelector("#netTitle").textContent = c.net;
document.querySelector("#netDescription").textContent = c.desc;
document.querySelector("#sessionLabel").textContent = c.session;
document.querySelector("#nextLabel").textContent = c.next;
document.querySelector("#somaTitle").textContent = c.soma;
document.querySelector("#somaDescription").textContent = c.somaDesc;
document.querySelector("#playerName").textContent = profile.name || "GFIELD";
const names = levelNames[lang] || levelNames.ko;
const bandNames = {
  ko: ["입문", "입문", "초급", "초급", "중급"], en: ["Intro", "Intro", "Beginner", "Beginner", "Intermediate"],
  zh: ["入门", "入门", "初级", "初级", "中级"], ja: ["入門", "入門", "初級", "初級", "中級"]
}[lang] || ["입문", "입문", "초급", "초급", "중급"];
const grid = document.querySelector("#levelGrid");
levels.forEach((level, index) => {
  const link = document.createElement("a");
  link.className = "level-card";
  link.href = `../games/net-observatory/?level=${level.id}`;
  link.innerHTML = `<img src="./assets/net-level-${level.id}.webp" alt="" /><div><span>${bandNames[index]}</span><strong>${level.id}. ${names[index][0]}</strong><p>${names[index][1]}</p><b>${c.start} ›</b></div>`;
  grid.append(link);
});
