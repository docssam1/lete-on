(function () {
 "use strict";
 const locale = document.documentElement.lang === "zh-Hans" ? "zh-Hans" : document.documentElement.lang === "en" ? "en" : "ko";
 const copy = {
  ko: { title: "무엇을 공부할까요?", intro: "교과와 경시를 공부하고, 보딩 로드맵에서 순서를 정하세요.", nav: "학습 과정 선택", boarding: "보딩 로드맵", descriptions: ["학년별 개념과 단원 학습", "AMC 8 · 10 · 12 기출과 연습", "정수형 기출과 풀이 연습", "학년별 기출과 준비 학습", "논리·도형·유형 연습", "지나온 공부와 앞으로의 과정"] },
  en: { title: "What would you like to study?", intro: "Study school maths and competitions. Plan your next steps with the boarding roadmap.", nav: "Choose a programme", boarding: "Boarding roadmap", descriptions: ["Concepts and units by grade", "AMC 8 · 10 · 12 past papers and practice", "Integer-answer papers and problem solving", "Past papers and preparation by grade", "Logic, geometry and problem-solving practice", "Past learning and next steps"] },
  "zh-Hans": { title: "想学习什么？", intro: "学习校内数学和竞赛内容，用寄宿学校学习路线安排学习顺序。", nav: "选择学习项目", boarding: "寄宿学校学习路线", descriptions: ["按年级学习概念与单元", "AMC 8 · 10 · 12 历年试题与练习", "整数答案试题与解题练习", "各年级历年试题与备考", "逻辑、几何与题型练习", "已学内容与下一步安排"] }
 }[locale];
 const section=document.querySelector('.program-entry');if(!section)return;
 section.querySelector('h1').textContent=copy.title;section.querySelector('.program-entry-intro').textContent=copy.intro;section.querySelector('nav').setAttribute('aria-label',copy.nav);
 section.querySelectorAll('[data-program-entry]').forEach(function(link,index){
  link.querySelector('p').textContent=copy.descriptions[index];
  if(link.dataset.programEntry==='boarding')link.querySelector('h2').textContent=copy.boarding;
  const url=new URL(link.getAttribute('href'),location.href);url.searchParams.set('locale',locale);link.setAttribute('href','./'+url.pathname.split('/').pop()+url.search+url.hash);
 });
})();
