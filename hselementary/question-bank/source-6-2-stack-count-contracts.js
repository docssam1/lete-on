(function (root, factory) {
  "use strict";
  if (typeof module === "object" && module.exports) module.exports = factory(require("./source-6-2-stack-count-models.js"));
  else root.HSE_SOURCE_GRADE6_STACK_COUNT_CONTRACTS = factory(root.HSE_SOURCE_GRADE6_STACK_COUNT_MODELS);
})(typeof window !== "undefined" ? window : globalThis, function (models) {
  "use strict";
  if (!models?.solve || !models.enumerate) throw new Error("Stack count models must be loaded first");
  const copy = value => JSON.parse(JSON.stringify(value));
  function freeze(value) {
    if (value && typeof value === "object" && !Object.isFrozen(value)) { Object.values(value).forEach(freeze); Object.freeze(value); }
    return value;
  }
  const sum = matrix => matrix.flat().reduce((a,b)=>a+b,0);
  function choiceExpression(n,k) {
    if(k===0) return "1";
    const factors=Array.from({length:k},(_,i)=>n-i).join("×");
    const divisors=Array.from({length:Math.max(0,k-1)},(_,i)=>k-i).join("÷");
    return factors+(divisors ? `÷${divisors}` : "");
  }
  function generate(sourceItemId, variant, level) {
    if (!Number.isSafeInteger(level) || level<0 || level>2) throw new RangeError("Invalid stack count difficulty");
    const source=models.solve(sourceItemId,variant),condition=copy(source.condition);
    let clue=null;
    if(level===0) {
      if(condition.front) {
        for(let z=0;z<condition.top.length && !clue;z++) for(let x=0;x<condition.top[0].length && !clue;x++) {
          const choices=new Set(source.arrangements.map(h=>h[z][x]));
          if(choices.size>1) clue={x,z,height:source.minimumWitness[z][x]};
        }
      } else {
        const z=condition.top.findIndex(row=>row.some(Boolean)),x=condition.top[z].findIndex(Boolean);
        clue={x,z,height:condition.highest};
      }
      if(!clue) throw new Error("An easier count needs a meaningful additional given height");
      condition.fixedHeights=condition.top.map(row=>row.map(n=>n ? null : 0));
      condition.fixedHeights[clue.z][clue.x]=clue.height;
    }
    const result=level===0 ? models.enumerate(condition) : source;
    const projection=!!condition.front,minMax=source.mode === "min-max-sum";
    const givenViews=projection ? {top:condition.top,front:condition.front,right:condition.right} : {top:condition.top};
    const promptText=projection ?
      `쌓기나무로 만든 입체도형을 위, 앞, 오른쪽에서 본 모양입니다. ${minMax ? "이 모양이 되도록 쌓는 데 필요한 쌓기나무의 최소 개수와 최대 개수의 합을 구하시오." : "이 모양이 되도록 쌓기나무를 쌓는 방법은 모두 몇 가지인지 구하시오."}` :
      `쌓기나무 ${condition.total}개를 쌓아서 가장 높은 층이 ${condition.highest}층인 모양을 만들려고 합니다. 위에서 본 모양이 그림과 같도록 쌓는 방법은 모두 몇 가지인지 구하시오.`;
    const groups=minMax ? [
      {label:"최소",total:result.minimum,count:result.totalHistogram[result.minimum],heights:result.minimumWitness},
      {label:"최대",total:result.maximum,count:result.totalHistogram[result.maximum],heights:result.maximumWitness}
    ] : projection ? Object.entries(result.totalHistogram).map(([n,count])=>({label:`${n}개`,total:Number(n),count,
      heights:result.arrangements.find(h=>sum(h)===Number(n))})) : Object.entries(result.highestCountHistogram).map(([n,count])=>({
        label:`${condition.highest}층 기둥 ${n}개`,highestCount:Number(n),count,
        heights:result.arrangements.find(h=>h.flat().filter(v=>v===condition.highest).length===Number(n))}));
    let secondary=null;
    if(level===2) {
      if(minMax) {
        const accepted=result.arrangements.filter(h=>sum(h)===result.minimum);
        secondary={question:"또, 쌓기나무를 최소 개수로 쌓는 방법은 몇 가지인지 구하시오.",answer:accepted.length,kind:"minimum-arrangements",
          witnesses:accepted.map((heights,i)=>({label:`${i+1}번째 배치`,heights})),
          explanation:"높이가 2층까지 가능한 두 칸에 1층과 2층을 서로 바꾸어 쌓는 두 경우가 있습니다. 나머지 칸은 최소 모양대로 정해집니다.",
          countExpression:`${accepted.length}`};
      }
      else if(projection) {
        const max=Math.max(...condition.front,...condition.right),accepted=result.arrangements.filter(h=>h.flat().filter(n=>n===max).length===2);
        const exploration=sourceItemId.includes("exploration");
        secondary={question:`또, 가장 높은 ${max}층 기둥이 2개인 방법은 몇 가지인지 구하시오.`,answer:accepted.length,kind:"exactly-two-highest-columns",
          witnesses:[{label:"추가 조건의 배치 예",heights:accepted[0]}],
          explanation:exploration ?
            `가장 높은 기둥 두 곳은 정해져 있습니다. 앞줄 왼쪽 둘째 칸에는 1층부터 ${max-1}층까지 쌓을 수 있습니다. 높이가 2층까지 가능한 두 칸은 각각 1층과 2층, 2층과 1층, 2층과 2층의 세 경우입니다.` :
            `높이가 ${max}층인 두 기둥은 대각선의 두 경우로 놓습니다. 나머지 두 기둥은 각각 1층부터 ${max-1}층까지 쌓을 수 있습니다.`,
          countExpression:exploration ? `${max-1}×3` : `2×${max-1}×${max-1}`};
      } else {
        const z=condition.top.findIndex(row=>row.some(Boolean)),x=condition.top[z].findIndex(Boolean);
        const accepted=result.arrangements.filter(h=>h[z][x]===condition.highest),positions=condition.top.flat().filter(Boolean).length-1;
        const highCounts=[...new Set(accepted.map(h=>h.flat().filter(n=>n===condition.highest).length))].sort((a,b)=>a-b);
        const parts=highCounts.map(highCount=>{
          const tall=highCount-1,middle=condition.total-(positions+1)-2*highCount;
          const count=accepted.filter(h=>h.flat().filter(n=>n===condition.highest).length===highCount).length;
          return {tall,middle,count,expression:`${choiceExpression(positions,tall)}×${choiceExpression(positions-tall,middle)}`,
            heights:accepted.find(h=>h.flat().filter(n=>n===condition.highest).length===highCount)};
        });
        secondary={question:`또, 맨 뒤 줄의 왼쪽 첫 번째 칸이 ${condition.highest}층인 방법은 몇 가지인지 구하시오.`,
          answer:accepted.length,kind:"back-left-highest",x,z,
          witnesses:parts.map(part=>({label:`추가 3층 기둥 ${part.tall}개인 배치 예`,heights:part.heights})),
          explanation:`뒤쪽 왼쪽 칸에 ${condition.highest}개를 쌓고 나면, 남은 ${positions}칸에 ${condition.total-condition.highest}개를 쌓아야 합니다. `+
            parts.map(part=>`그 칸들을 3층 ${part.tall}개, 2층 ${part.middle}개, 1층 ${positions-part.tall-part.middle}개로 나누는 방법은 ${part.expression}=${part.count}가지입니다.`).join(" "),
          countExpression:parts.map(part=>part.count).join("+")};
      }
    }
    const answer=minMax ? result.minMaxSum : result.arrangementCount;
    let primaryExplanation;
    if(minMax && sourceItemId==="6-2-u3-e2-mission-2") {
      const peak=condition.front[0],rowTotals=result.maximumWitness.map(row=>row.reduce((a,b)=>a+b,0));
      const fixedHeightReason=clue ? ` 높이가 주어진 뒤에서 ${clue.z+1}번째 줄, 왼쪽에서 ${clue.x+1}번째 칸은 ${clue.height}층으로 그대로 둡니다.` : "";
      primaryExplanation=`위에서 본 아홉 칸에 한 개씩 쌓습니다. 맨 뒤 칸은 3층, 맨 앞 왼쪽 칸은 ${peak}층, 뒤에서 셋째 줄의 오른쪽 칸은 3층이어야 합니다. 앞에서 본 가운데 기둥을 2층으로 만드는 데 한 개가 더 필요하므로 최소는 9+2+${peak-1}+2+1=${result.minimum}개입니다.${fixedHeightReason} 각 칸을 앞과 오른쪽 그림의 높이보다 높게 쌓을 수 없으므로 답 그림의 최대 배치에서 ${rowTotals.join("+")}=${result.maximum}개입니다. 두 개수의 합은 ${result.minimum}+${result.maximum}=${answer}개입니다.`;
      if(secondary) {
        secondary.explanation="뒤에서 셋째 줄의 가운데 칸과 맨 앞줄의 가운데 칸 중 한 곳을 2층, 다른 곳을 1층으로 쌓는 두 경우입니다. 다른 칸의 높이는 최소 배치대로 정해집니다.";
        secondary.countExpression="1+1";
      }
    }
    else if(minMax) primaryExplanation=`최소 ${result.minimum}개, 최대 ${result.maximum}개이므로 합은 ${answer}개입니다.`;
    else if(projection && sourceItemId.includes("exploration")) {
      const peak=condition.front[0];
      primaryExplanation=level===0 ?
        `높이가 2층까지 가능한 두 칸의 높이는 1층과 2층으로 정해집니다. 앞줄 왼쪽 둘째 칸에는 1층부터 ${peak}층까지 쌓을 수 있으므로 ${peak}가지입니다.` :
        `앞줄 왼쪽 둘째 칸에는 1층부터 ${peak}층까지 쌓을 수 있습니다. 높이가 2층까지 가능한 두 칸은 1층과 2층, 2층과 1층, 2층과 2층의 세 경우이므로 ${peak}×3=${answer}가지입니다.`;
    } else if(projection) {
      const peak=condition.front[1],low=peak-1;
      primaryExplanation=level===0 ? `주어진 1층 칸 때문에 두 기둥의 높이는 ${peak}층으로 정해집니다. 남은 기둥에는 1층부터 ${peak}층까지 쌓을 수 있으므로 ${peak}가지입니다.` :
        `높이가 ${peak}층인 기둥을 2개, 3개, 4개 놓는 경우로 나눕니다. 2개는 대각선 두 경우이고 나머지 칸마다 ${low}가지입니다. 3개는 낮은 칸을 고르는 네 경우이고 그 칸의 높이는 ${low}가지입니다. 4개는 한 경우이므로 2×${low}×${low}+4×${low}+1=${answer}가지입니다.`;
    } else {
      const positions=condition.top.flat().filter(Boolean).length;
      primaryExplanation=groups.map(group=>{
        const fixedTall=level===0 ? 1 : 0,tall=group.highestCount-fixedTall,middle=condition.total-positions-2*group.highestCount;
        const remaining=positions-fixedTall,expression=`${choiceExpression(remaining,tall)}×${choiceExpression(remaining-tall,middle)}`;
        return `${level===0 ? "높이가 주어진 칸을 제외한 나머지 칸에서 " : ""}3층 ${tall}개, 2층 ${middle}개, 1층 ${remaining-tall-middle}개가 되는 칸을 고르는 방법은 ${expression}=${group.count}가지입니다.`;
      }).join(" ")+` 따라서 ${groups.length>1 ? groups.map(group=>group.count).join("+")+"=" : ""}${answer}가지입니다.`;
    }
    return freeze({sourceItemId,variant,level,condition,sourceRef:source.sourceRef,viewConvention:models.viewConvention,
      givenViews,clue,groups,answer,answerUnit:minMax ? "개" : "가지",secondary,
      promptText:promptText+(clue ? ` 뒤에서 ${clue.z+1}번째 줄, 왼쪽에서 ${clue.x+1}번째 칸은 ${clue.height}층입니다.` : "")+(secondary ? ` ${secondary.question}` : ""),
      solutionText:primaryExplanation+(secondary ? ` ${secondary.explanation} 따라서 ${secondary.countExpression}=${secondary.answer}가지입니다.` : ""),
      arrangements:result.arrangements,minimum:result.minimum,maximum:result.maximum,
      difficultyDesign:{mode:["easy","source","hard"][level],structuralChange:["한 칸의 높이를 추가로 주어 정해야 할 높이를 줄입니다.",
        "원본의 바닥과 높이 또는 세 방향 조건으로 전체 경우를 셉니다.","원본 질문에 답한 뒤 별도 추가 조건을 만족하는 경우도 셉니다."][level],empiricallyCalibrated:false},
      registrationOnly:true,learnerReleaseVerified:false,officialAnswerVerified:false});
  }
  return freeze({generate,definitions:models.definitions,registrationOnly:true,learnerReleaseVerified:false,officialAnswerVerified:false});
});
