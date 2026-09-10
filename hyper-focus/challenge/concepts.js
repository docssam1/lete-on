(function(){
 'use strict';const lessons=window.HFConceptCatalog.build(),book=document.getElementById('conceptBook');
 const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const art=(l,phase)=>l[phase].problemHtml?`<img class="concept-art" src="assets/concepts/unit-${String(l.number).padStart(2,'0')}-${phase}.png" alt="${esc(l.title)} ${phase==='example'?'예제':'연습'} 그림">`:'';
 const solutionArt=(l,phase)=>l[phase].solutionDiagram?`<img class="key-art" src="assets/concepts/unit-${String(l.number).padStart(2,'0')}-${phase}-answer.png" alt="${esc(l.title)} 풀이 그림">`:'';
 const footer=n=>`<footer class="foot"><span>GFIELD · LETE-ON</span><span>${n}</span></footer>`;
 const header=s=>`<header class="page-head"><b>챌린지 개념 교재</b><span>${esc(s)}</span></header>`;
 const chunks=(a,n)=>Array.from({length:Math.ceil(a.length/n)},(_,i)=>a.slice(i*n,(i+1)*n));
 const toc=chunks(lessons,28);let page=1;
 let html=`<section class="concept-page book-cover"><div class="brand">LETE-ON</div><h1>챌린지<br>전 유형 개념 교재</h1><p>수 · 지문이해 · 도형 · 논리추리</p><p class="sub">${lessons.length}개 단원<br>개념 설명 · 풀이 예제 · 연습 또는 개념 확인<br>뒤쪽 정답과 풀이 포함</p>${footer(page++)}</section>`;
 toc.forEach((group,i)=>{html+=`<section class="concept-page contents">${header('단원 찾아보기 '+(i+1))}<h2 class="unit-title">배울 내용</h2><ol class="toc">${group.map(l=>`<li><b>${l.number}</b><a href="#unit-${l.number}">${esc(l.title)}</a></li>`).join('')}</ol>${footer(page++)}</section>`;});
 lessons.forEach(l=>{html+=`<section class="concept-page lesson" id="unit-${l.number}" data-unit="${l.number}">${header('개념 '+l.number)}<h2 class="unit-title">${esc(l.title)}</h2><p class="rule">${esc(l.rule)}</p><article class="lesson-block example"><h3>예제</h3><p class="prompt">${esc(l.example.prompt)}</p>${art(l,'example')}<div class="worked"><strong>정답 ${esc(l.example.answerHtml)}</strong><p>${esc(l.example.solution)}</p>${solutionArt(l,'example')}</div></article><article class="lesson-block practice"><h3>${l.practiceMode==='application'?'직접 풀어 보기':'개념 확인'}</h3><p class="prompt">${esc(l.practice.prompt)}</p>${art(l,'practice')}<div class="response">답: <span></span></div><div class="worked practice-key"><strong>${esc(l.practice.answerHtml)}</strong><p>${esc(l.practice.solution)}</p></div></article>${footer(page++)}</section>`;});
 if(page%2===0){html+='<section class="concept-page answer-pages book-blank" aria-label="답안 표지 앞 빈 페이지"></section>';page++;}
 html+=`<section class="concept-page answer-pages book-cover answer-cover"><div class="brand">LETE-ON</div><h1>연습 정답과 풀이</h1><p>${lessons.length}개 단원</p><p class="sub">예제의 풀이와 구분하여<br>직접 푼 뒤 확인하세요.</p>${footer(page++)}</section>`;
 chunks(lessons,3).forEach(group=>{html+=`<section class="concept-page answer-pages">${header('연습 정답과 풀이')}${group.map(l=>`<article class="key-row"><h3>${l.number}. ${esc(l.title)}</h3>${solutionArt(l,'practice')}<strong>${esc(l.practice.answerHtml)}</strong><p>${esc(l.practice.solution)}</p></article>`).join('')}${footer(page++)}</section>`;});
 book.innerHTML=html;window.HFConceptBook={lessons,pageCount:page-1};
 const unit=document.getElementById('unit');lessons.forEach(l=>unit.add(new Option(l.number+'. '+l.title,String(l.number))));
 unit.addEventListener('change',()=>{document.body.classList.toggle('isolated',unit.value!=='all');document.querySelectorAll('.lesson').forEach(e=>e.classList.toggle('hidden-unit',unit.value!=='all'&&e.dataset.unit!==unit.value));});
 document.getElementById('answers').addEventListener('change',e=>document.body.classList.toggle('show-answers',e.target.checked));document.getElementById('print').addEventListener('click',()=>window.print());
})();
