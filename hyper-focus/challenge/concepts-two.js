(function(){
  'use strict';

  const book=document.getElementById('conceptBook');
  if(!book||!window.HFConceptBookPlan)return;

  const plan=window.HFConceptBookPlan.build();
  const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  })[char]);
  const pad=value=>String(value).padStart(2,'0');
  const chunks=(items,size)=>Array.from(
    {length:Math.ceil(items.length/size)},
    (_,index)=>items.slice(index*size,(index+1)*size)
  );
  const footer=page=>`<footer class="foot"><span>GFIELD · LETE-ON</span><span>${page}</span></footer>`;
  const logo=()=>'<div class="book-logo"><img src="assets/gfield-logo.png" alt="지필드"><b>LETE-ON</b></div>';
  const header=(round,section)=>`<header class="page-head">${logo()}<b>2026년 9월 챌린지 대비 · 개념 ${round}</b><span>${esc(section)}</span></header>`;

  const point=(x,y)=>`${Number(x).toFixed(2)},${Number(y).toFixed(2)}`;
  const polygon=points=>points.map(([x,y])=>point(x,y)).join(' ');
  const inlineSvg=(body,width,height,label)=>`<svg class="concept-inline-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="${esc(label)}" xmlns="http://www.w3.org/2000/svg"><title>${esc(label)}</title>${body}</svg>`;

  function partitionVisual(question,solution){
    const cells=Array.isArray(question.payload?.cells)?question.payload.cells:[];
    if(!cells.length)return '';
    const groups=solution&&Array.isArray(question.visual?.answer)?question.visual.answer:[];
    const colors=['#d9eeea','#f5dfb5','#e4d8ef'];
    const xs=cells.map(cell=>cell[0]),ys=cells.map(cell=>cell[1]);
    const minX=Math.min(...xs),maxX=Math.max(...xs),minY=Math.min(...ys),maxY=Math.max(...ys);
    const unit=42,margin=20,width=(maxX-minX+1)*unit+margin*2,height=(maxY-minY+1)*unit+margin*2;
    const groupOf=cell=>groups.findIndex(group=>group.some(candidate=>candidate[0]===cell[0]&&candidate[1]===cell[1]));
    const body=cells.map(cell=>{
      const group=groupOf(cell),x=margin+(cell[0]-minX)*unit,y=margin+(cell[1]-minY)*unit;
      return `<rect x="${x}" y="${y}" width="${unit}" height="${unit}" rx="1" fill="${group>=0?colors[group%colors.length]:'#ffffff'}" stroke="${group>=0?'#315f66':'#6f8291'}" stroke-width="${group>=0?2.2:1.4}"/>`;
    }).join('');
    return inlineSvg(body,width,height,solution?'같은 모양 세 부분으로 나눈 풀이':'같은 모양 세 부분으로 나눌 칸 모양');
  }

  function splitThreeVisual(question,solution){
    const total=Number(question.payload?.total);
    if(!Number.isFinite(total))return '';

    const tree=(centerX,topY,values,{large=false}={})=>{
      const topRadius=large?42:23;
      const lowerRadius=large?30:19;
      const lowerY=topY+(large?112:67);
      const gap=large?126:54;
      const lowerXs=[centerX-gap,centerX,centerX+gap];
      const lines=lowerXs.map(x=>`<line x1="${centerX}" y1="${topY}" x2="${x}" y2="${lowerY}" stroke="#6f8798" stroke-width="${large?2.4:1.8}"/>`).join('');
      const top=`<circle cx="${centerX}" cy="${topY}" r="${topRadius}" fill="#edf6f4" stroke="#23756f" stroke-width="${large?2.8:2}"/><text x="${centerX}" y="${topY+(large?8:6)}" text-anchor="middle" fill="#173f60" font-size="${large?25:17}" font-weight="800">${esc(total)}</text>`;
      const lowers=lowerXs.map((x,index)=>{
        const value=Array.isArray(values)?values[index]:'';
        const text=value==null||value===''?'':`<text x="${x}" y="${lowerY+(large?7:6)}" text-anchor="middle" fill="#173f60" font-size="${large?22:16}" font-weight="800">${esc(value)}</text>`;
        return `<circle cx="${x}" cy="${lowerY}" r="${lowerRadius}" fill="#fff" stroke="#6f8798" stroke-width="${large?2.2:1.6}"/>${text}`;
      }).join('');
      return `${lines}${top}${lowers}`;
    };

    if(!solution){
      return inlineSvg(tree(330,52,null,{large:true}),660,214,'큰 원의 수를 서로 다른 세 수로 가르는 빈 수 모형');
    }

    const answers=Array.isArray(question.answer)
      ?question.answer.filter(values=>Array.isArray(values)&&values.length===3)
      :[];
    if(!answers.length)return '';
    const positions=answers.length<=3
      ?[[150,42],[330,42],[510,42]]
      :[[185,36],[475,36],[185,151],[475,151]];
    const body=answers.map((values,index)=>{
      const [x,y]=positions[index]||[330,36+index*115];
      return tree(x,y,values);
    }).join('');
    const height=answers.length<=3?142:257;
    return inlineSvg(body,660,height,'큰 원의 수를 서로 다른 세 수로 가르는 모든 방법의 풀이');
  }

  function triangleCountVisual(question,solution){
    const rays=Number(question.payload?.rays),levels=Array.isArray(question.payload?.baseLevels)?question.payload.baseLevels:[];
    if(!Number.isInteger(rays)||rays<3||!levels.length)return '';
    const apex=[330,25],bottomY=194,left=176,right=484,endpoints=Array.from({length:rays},(_,index)=>left+(right-left)*index/(rays-1));
    let body=`<text x="76" y="27" fill="#173f60" font-size="16" font-weight="800">${solution?'풀이':'그림'}</text>`;
    body+=endpoints.map(x=>`<line x1="${apex[0]}" y1="${apex[1]}" x2="${x}" y2="${bottomY}" stroke="#2e85b7" stroke-width="2.1"/>`).join('');
    body+=levels.map((y,index)=>{
      const ratio=(y-apex[1])/(bottomY-apex[1]),x1=apex[0]+(left-apex[0])*ratio,x2=apex[0]+(right-apex[0])*ratio;
      return `<line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="${solution?['#d18b31','#23756f'][index%2]:'#2e85b7'}" stroke-width="${solution?3:2.1}"/>`;
    }).join('');
    if(solution){
      const pairs=rays*(rays-1)/2;
      body+=`<text x="330" y="228" text-anchor="middle" fill="#173f60" font-size="17" font-weight="800">두 선 고르기 ${pairs}가지 × 밑변 ${levels.length}줄 = ${pairs*levels.length}개</text>`;
    }
    return inlineSvg(body,660,solution?246:218,solution?'두 선과 밑변을 짝지어 센 삼각형 풀이':'한 꼭짓점에서 내려오는 선과 두 가로선');
  }

  function netPerspectiveVisual(question,solution){
    const faces=Array.isArray(question.payload?.faces)?question.payload.faces:[],choices=Array.isArray(question.payload?.choices)?question.payload.choices:[];
    if(faces.length!==6||!choices.length)return '';
    const marks={grid:'▦',cross:'×',dot:'●',plus:'＋',star:'✦',ring:'◎'},unit=44,minX=Math.min(...faces.map(face=>face.x)),maxY=Math.max(...faces.map(face=>face.y));
    const netLeft=44-minX*unit,netTop=28;
    let body='<text x="118" y="18" text-anchor="middle" fill="#173f60" font-size="16" font-weight="800">전개도</text>';
    body+=faces.map(face=>{
      const x=netLeft+face.x*unit,y=netTop+(maxY-face.y)*unit;
      return `<rect x="${x}" y="${y}" width="${unit}" height="${unit}" fill="#fff" stroke="#6f8da2" stroke-width="1.5"/><text x="${x+unit/2}" y="${y+unit/2+7}" text-anchor="middle" fill="#245a75" font-size="22" font-weight="800">${marks[face.mark]||'?'}</text>`;
    }).join('');
    const cube=(choice,index)=>{
      const threeAcross=choices.length===3,col=threeAcross?index:index%2,row=threeAcross?0:Math.floor(index/2),x=threeAcross?278+col*118:322+col*158,y=threeAcross?48:42+row*134,correct=solution&&Number(question.answer)===choice.choiceId;
      const top=[[x,y],[x+38,y-22],[x+76,y],[x+38,y+22]],leftFace=[[x,y],[x+38,y+22],[x+38,y+69],[x,y+47]],rightFace=[[x+38,y+22],[x+76,y],[x+76,y+47],[x+38,y+69]];
      const centers=[[x+38,y],[x+19,y+35],[x+57,y+35]],faces=[top,leftFace,rightFace];
      let art=correct?`<rect x="${x-15}" y="${y-37}" width="106" height="125" rx="10" fill="#edf7f2" stroke="#23756f" stroke-width="2.4"/>`:'';
      art+=faces.map((points,faceIndex)=>`<polygon points="${polygon(points)}" fill="${['#f5fafb','#e6f0f3','#d4e4e9'][faceIndex]}" stroke="#55798e" stroke-width="1.6"/><text x="${centers[faceIndex][0]}" y="${centers[faceIndex][1]+7}" text-anchor="middle" fill="#245a75" font-size="20" font-weight="800">${marks[choice.visibleMarks[faceIndex]]||'?'}</text>`).join('');
      art+=`<text x="${x+38}" y="${y+96}" text-anchor="middle" fill="${correct?'#23756f':'#173f60'}" font-size="16" font-weight="800">${choice.choiceId}${correct?'번 · 정답':'번'}</text>`;
      return art;
    };
    body+='<text x="478" y="18" text-anchor="middle" fill="#173f60" font-size="16" font-weight="800">겨냥도 보기</text>'+choices.map(cube).join('');
    return inlineSvg(body,660,choices.length>3?296:232,solution?'전개도를 접었을 때의 정답 겨냥도':'전개도와 위 왼쪽 오른쪽 면이 보이는 겨냥도 보기');
  }

  function assemblyVisual(question,solution){
    const units=Array.isArray(question.payload?.units)?question.payload.units:[];
    const groups=solution&&Array.isArray(question.visual?.answer)?question.visual.answer:[];
    const fills=['#5fae78','#4d91c3','#dd6a60','#d5a84d'];
    const center=[330,176],radius=76;
    const vertices=Array.from({length:6},(_,index)=>{
      const angle=(-90+index*60)*Math.PI/180;
      return [center[0]+radius*Math.cos(angle),center[1]+radius*Math.sin(angle)];
    });
    const groupOf=index=>groups.findIndex(group=>group.includes(index));
    const target=vertices.map((vertex,index)=>{
      const next=vertices[(index+1)%6],group=groupOf(index);
      return `<polygon points="${polygon([center,vertex,next])}" fill="${group>=0?fills[group%fills.length]:'#fff'}" stroke="#486578" stroke-width="1.6"/>`;
    }).join('');
    if(solution){
      return inlineSvg(`<text x="330" y="34" text-anchor="middle" fill="#173f60" font-size="18" font-weight="800">빈틈없이 채운 모양</text>${target}`,660,275,'선택한 조각으로 큰 모양을 채운 풀이');
    }

    const one='<polygon points="42,66 62,31 82,66" fill="#5fae78" stroke="#315f66" stroke-width="1.5"/>';
    const two='<polygon points="151,31 191,31 211,66 171,66" fill="#4d91c3" stroke="#315f66" stroke-width="1.5"/><line x1="191" y1="31" x2="171" y2="66" stroke="#fff" stroke-width="1.2"/>';
    const three='<polygon points="270,31 330,31 350,66 250,66" fill="#dd6a60" stroke="#315f66" stroke-width="1.5"/><line x1="290" y1="31" x2="270" y2="66" stroke="#fff" stroke-width="1.2"/><line x1="310" y1="31" x2="330" y2="66" stroke="#fff" stroke-width="1.2"/>';
    const pieces=[{unit:1,art:one,x:62},{unit:2,art:two,x:181},{unit:3,art:three,x:300}]
      .filter(piece=>units.includes(piece.unit));
    const legend=`<text x="20" y="20" fill="#173f60" font-size="16" font-weight="800">보기</text>${pieces.map(piece=>`${piece.art}<text x="${piece.x}" y="88" text-anchor="middle" fill="#486178" font-size="13">${piece.unit}칸 조각</text>`).join('')}`;
    return inlineSvg(`${legend}<text x="330" y="112" text-anchor="middle" fill="#173f60" font-size="16" font-weight="800">큰 모양</text>${target}`,660,275,'사용할 수 있는 조각과 여섯 칸으로 나눈 큰 모양');
  }

  function circleVisual(question,solution){
    const names=Array.isArray(question.payload?.names)?question.payload.names:[];
    if(names.length!==4)return '';
    let order=[];
    if(solution){
      order=Array.isArray(question.answer)?question.answer:String(question.answer??'').split(',').map(name=>name.trim()).filter(Boolean);
      if(order.length!==4)order=names;
    }
    const anchor=Number(question.payload?.anchor??0);
    const anchorLabel=question.visual?.label||names[anchor]||'';
    const seats=[[330,38],[502,142],[330,246],[158,142]];
    const arrows='<path d="M430 69 A132 95 0 0 1 463 113" fill="none" stroke="#b98732" stroke-width="3"/><polygon points="463,113 452,105 465,100" fill="#b98732"/><text x="468" y="72" fill="#8a672c" font-size="14">시계 방향</text>';
    const table='<ellipse cx="330" cy="142" rx="112" ry="73" fill="#edf3f5" stroke="#6b8494" stroke-width="2"/><text x="330" y="148" text-anchor="middle" fill="#486178" font-size="17" font-weight="800">둥근 탁자</text>';
    const labels=seats.map(([x,y],index)=>{
      const label=solution?order[index]:(index===anchor?anchorLabel:'');
      return `<circle cx="${x}" cy="${y}" r="34" fill="#fff" stroke="${label?'#23756f':'#9aabb7'}" stroke-width="${label?2.5:1.5}"/><text x="${x}" y="${y+5}" text-anchor="middle" fill="#173f60" font-size="15" font-weight="800">${esc(label)}</text>`;
    }).join('');
    return inlineSvg(`${arrows}${table}${labels}`,660,284,solution?'시계 방향 자리 풀이':'기준 이름이 표시된 둥근 탁자 자리');
  }

  function specialVisual(question,mode){
    const solution=mode==='solution';
    switch(question.payload?.kind){
      case 'partition-three':return partitionVisual(question,solution);
      case 'split-three-all':return splitThreeVisual(question,solution);
      case 'triangle-enumeration':return triangleCountVisual(question,solution);
      case 'net-perspective':return netPerspectiveVisual(question,solution);
      case 'piece-count':return assemblyVisual(question,solution);
      case 'circle-not-adjacent':return circleVisual(question,solution);
      default:return '';
    }
  }

  function questionFrom(source){
    if(!source)return {};
    return source.question&&typeof source.question==='object'?source.question:source;
  }

  function answerText(question){
    const value=question.answerHtml??question.answer??'';
    if(Array.isArray(value)){
      return value.map((part,index)=>`(${index+1}) ${Array.isArray(part)?part.join(', '):part}`).join('  ');
    }
    return String(value);
  }

  function promptHtml(value){
    return esc(value).replace(/(\d+(?:[×xX]\d+)*(?:번째|번|개|칸|층|년|살|cm)?)/g,'<span class="prompt-number">$1</span>');
  }

  function emphasizeVisualNumbers(markup){
    return String(markup||'').replace(/<text\b([^>]*)>(\s*(?:\d+|[①-⑳]|[㉠-㉣])\s*)<\/text>/g,'<text data-concept-number="true"$1>$2</text>');
  }

  function visual(entry,mode='problem'){
    const question=entry.question;
    const directSpecial=specialVisual(question,mode);
    const className=mode==='solution'?'answer-visual':'question-art';
    if(directSpecial)return `<div class="${className} inline-special">${emphasizeVisualNumbers(directSpecial)}</div>`;
    const markup=mode==='solution'?question.solutionDiagram:question.problemHtml;
    if(markup)return `<div class="${className}">${emphasizeVisualNumbers(markup)}</div>`;

    const asset=entry.source?.asset||entry.fallback?.asset;
    const legacyAsset=asset&&!entry.source?.phase&&!entry.source?.basic&&!entry.source?.guided;
    if(!legacyAsset)return '';
    const suffix=mode==='solution'?'-answer':'';
    return `<div class="${className} legacy-art"><img src="${esc(asset+suffix+'.png')}" alt="${esc(entry.title)} ${mode==='solution'?'풀이':'문제'} 그림"></div>`;
  }

  function makeEntry(source,fallback,phase,title){
    const chosen=source||fallback||{};
    return {
      phase,
      title,
      source:chosen,
      fallback,
      key:chosen.key||fallback?.key||`${fallback?.slotKey||'behavior'}-${phase}`,
      question:questionFrom(chosen)
    };
  }

  function normalizeVolume(volume){
    const reviewByNumber=new Map();
    (Array.isArray(volume.review)?volume.review:[]).forEach((item,index)=>{
      const number=Number(item.behaviorNumber??item.typeNumber??item.number??index+1);
      reviewByNumber.set(number,item);
    });

    let sequentialNumber=0;
    const actions=[];
    volume.chapters.forEach(chapter=>{
      (chapter.items||[]).forEach(raw=>{
        sequentialNumber+=1;
        const behaviorNumber=Number(raw.behaviorNumber??raw.typeNumber??raw.number??sequentialNumber);
        const basicSource=raw.basic||raw.easy||raw.example||raw;
        const guidedSource=raw.guided||raw.same||raw.practice||basicSource;
        const reviewSource=reviewByNumber.get(behaviorNumber)||raw.reviewQuestion||raw.review||guidedSource;
        const title=raw.title||basicSource.title||`행동유형 ${behaviorNumber}`;
        actions.push({
          round:volume.round,
          chapter:chapter.number,
          area:chapter.area,
          chapterTitle:chapter.title,
          behaviorNumber,
          title,
          basic:makeEntry(basicSource,raw,'basic',title),
          guided:makeEntry(guidedSource,raw,'guided',title),
          review:makeEntry(reviewSource,raw,'review',title)
        });
      });
    });
    return actions;
  }

  function studentProblem(action,phase,label,{review=false}={}){
    const entry=action[phase];
    const question=entry.question;
    const promptLength=String(question.prompt??'').length;
    const promptClass=promptLength>260?' is-very-long-prompt':promptLength>165?' is-long-prompt':'';
    const link=review
      ?`<span class="behavior-link">행동유형 ${pad(action.behaviorNumber)} · ${esc(action.title)}</span>`
      :'';
    return `<article class="problem ${review?'review-problem':''}${promptClass}" data-key="${esc(entry.key)}" data-unit="${esc(question.unit||'')}">
      <div class="problem-heading"><b class="problem-label">${esc(label)}</b>${link}</div>
      <p class="prompt">${promptHtml(question.prompt)}</p>
      <div class="workspace">${visual(entry)}<div class="response">답 <span></span></div></div>
    </article>`;
  }

  function solutionRow(action,phase,label){
    const entry=action[phase];
    const question=entry.question;
    const hasLegacyDiagram=Boolean((entry.source?.asset||entry.fallback?.asset)&&!entry.source?.phase&&!entry.source?.basic&&!entry.source?.guided);
    const hasDiagram=Boolean(specialVisual(question,'solution')||question.solutionDiagram||hasLegacyDiagram);
    const solution=String(question.solution??'');
    const compact=solution.length>220?' is-dense':'';
    return `<article class="solution-row${hasDiagram?' has-diagram':''}${compact}" data-answer-key="${esc(entry.key)}">
      <div class="solution-heading"><b>${esc(label)}</b></div>
      <div class="solution-body">
        ${visual(entry,'solution')}
        <div class="solution-copy"><strong><span>정답</span> ${esc(answerText(question))}</strong><p>${esc(solution)}</p></div>
      </div>
    </article>`;
  }

  const counts=[];
  let html='';

  for(const volume of plan.volumes){
    if(!window.HFChallengeAccess?.allow(`challenge-concept-${volume.round}`))continue;

    const actions=normalizeVolume(volume);
    let page=1;
    const section=(className,content,attributes='')=>{
      const output=`<section class="concept-page ${className}" data-round="${volume.round}" ${attributes}>${content}${footer(page)}</section>`;
      page+=1;
      return output;
    };

    html+=section('book-cover',`<div class="cover-frame">
      ${logo()}
      <p class="cover-kicker">${esc(volume.area)}</p>
      <p class="cover-date">2026년 9월</p>
      <h1>챌린지 대비</h1>
      <p class="cover-title">개념 교재</p>
      <div class="round-number">${volume.round}</div>
      <p class="cover-details">${actions.length}개 행동유형 · 기본 · 한 단계 · REVIEW</p>
      <div class="name-line">이름 <span></span></div>
    </div>`,'data-chapter="all"');

    html+=section('contents',`${header(volume.round,'차례')}
      <div class="contents-heading"><p>${esc(volume.area)}</p><h1>행동유형 차례</h1></div>
      <ol class="toc">${volume.chapters.map(chapter=>{
        const chapterActions=actions.filter(action=>action.chapter===chapter.number);
        const first=chapterActions[0]?.behaviorNumber;
        const last=chapterActions.at(-1)?.behaviorNumber;
        return `<li><b>${pad(chapter.number)}</b><a href="#r${volume.round}-chapter-${chapter.number}"><span>${esc(chapter.title)}</span><small>행동유형 ${pad(first)}–${pad(last)}</small></a></li>`;
      }).join('')}<li class="review-toc"><b>R</b><a href="#r${volume.round}-review"><span>REVIEW</span><small>같은 난이도 ${actions.length}문제</small></a></li></ol>`,'data-chapter="all"');

    actions.forEach(action=>{
      const firstBehaviorInChapter=actions.find(candidate=>candidate.chapter===action.chapter)?.behaviorNumber;
      const actionId=action.behaviorNumber===firstBehaviorInChapter
        ?`r${volume.round}-chapter-${action.chapter}`
        :`r${volume.round}-behavior-${action.behaviorNumber}`;
      html+=section('lesson behavior-page',`${header(volume.round,`${action.area} · ${action.chapter}단원`)}
        <div class="behavior-title"><span>행동유형 ${pad(action.behaviorNumber)}</span><h1>${esc(action.title)}</h1></div>
        <div class="problem-wrapper teaching-pair">
          ${studentProblem(action,'basic','대표유형 · 기본')}
          ${studentProblem(action,'guided','유제 · 한 단계')}
        </div>`,`id="${actionId}" data-chapter="${action.chapter}" data-behavior="${action.behaviorNumber}"`);
    });

    chunks(actions,2).forEach((pair,index)=>{
      const range=pair.length===2
        ?`${pad(pair[0].behaviorNumber)}–${pad(pair[1].behaviorNumber)}`
        :pad(pair[0].behaviorNumber);
      html+=section('lesson review-page',`${header(volume.round,'REVIEW · 같은 유형 다시 풀기')}
        <div class="review-title"><h1>REVIEW</h1><span>${range} / ${actions.length}</span></div>
        <div class="problem-wrapper review-pair">${pair.map(action=>studentProblem(action,'review',String(action.behaviorNumber),{review:true})).join('')}</div>`,`${index===0?`id="r${volume.round}-review" `:''}data-chapter="review"`);
    });

    if(page%2===0){
      html+=`<section class="concept-page answer-pages book-blank" data-round="${volume.round}" data-chapter="answers" aria-label="빈 쪽"></section>`;
      page+=1;
    }

    const answerCover=page;
    html+=section('answer-pages book-cover answer-cover',`<div class="cover-frame">
      ${logo()}
      <p class="cover-kicker">2026년 9월 챌린지 대비</p>
      <h1>정답과 풀이</h1>
      <div class="round-number">${volume.round}</div>
      <p class="cover-details">행동유형별 기본 · 한 단계 · REVIEW</p>
    </div>`,'data-chapter="answers"');

    chunks(actions,2).forEach(pair=>{
      html+=section('answer-pages key-page compact-key-page',`${header(volume.round,'정답과 풀이')}
        <div class="answer-groups">${pair.map(action=>`<section class="answer-group" data-answer-behavior="${action.behaviorNumber}">
          <div class="answer-title"><span>행동유형 ${pad(action.behaviorNumber)}</span><h1>${esc(action.title)}</h1></div>
          <div class="solution-list">
            ${solutionRow(action,'basic','대표유형 · 기본')}
            ${solutionRow(action,'guided','유제 · 한 단계')}
            ${solutionRow(action,'review','REVIEW')}
          </div>
        </section>`).join('')}</div>`,`data-chapter="answers" data-behavior="${pair.map(action=>action.behaviorNumber).join(',')}"`);
    });

    counts.push({
      round:volume.round,
      pages:page-1,
      answerCover,
      chapters:volume.chapters.length,
      behaviors:actions.length,
      teachingQuestions:actions.length*2,
      reviewQuestions:actions.length,
      answerPages:Math.ceil(actions.length/2)
    });
  }

  book.innerHTML=html;
  window.HFConceptBook={...plan,counts};

  const stamp=()=>{
    const name=window.HFChallengeAccess?.approvedStudentName?.()||'';
    const text=`GFIELD · LETE-ON${name?` · ${name}`:''}`;
    document.querySelectorAll('.concept-page:not(.book-blank)').forEach(page=>{
      page.querySelector('.book-watermark')?.remove();
      const watermark=document.createElement('div');
      watermark.className='book-watermark';
      watermark.setAttribute('aria-hidden','true');
      for(let index=0;index<3;index+=1){
        const line=document.createElement('span');
        line.textContent=text;
        watermark.appendChild(line);
      }
      page.appendChild(watermark);
    });
    document.querySelectorAll('.name-line span').forEach(line=>{line.textContent=name;});
  };
  stamp();
  window.addEventListener('hfchallengeaccesschange',stamp);

  const round=document.getElementById('round');
  const unit=document.getElementById('unit');
  const answerToggle=document.getElementById('answers');
  const printButton=document.getElementById('print');

  for(let number=1;number<=8;number+=1)unit.add(new Option(`${number}단원`,String(number)));
  unit.add(new Option('REVIEW','review'));

  const update=()=>{
    document.querySelectorAll('.concept-page').forEach(pageElement=>{
      pageElement.classList.toggle('hidden-round',pageElement.dataset.round!==round.value);
      const unitMismatch=unit.value!=='all'&&pageElement.dataset.chapter!==unit.value;
      pageElement.classList.toggle('hidden-unit',unitMismatch);
    });
  };

  round.value=new URLSearchParams(location.search).get('round')==='2'?'2':'1';
  round.addEventListener('change',()=>{
    unit.value='all';
    update();
  });
  unit.addEventListener('change',update);
  answerToggle.addEventListener('change',event=>{
    document.body.classList.toggle('show-answers',event.target.checked);
  });
  printButton.addEventListener('click',()=>{
    if(!window.HFChallengeAccess?.allow(`challenge-concept-${round.value}`)){
      book.replaceChildren();
      return;
    }
    window.print();
  });
  update();
})();
