export const ECOLOGY_MATERIAL_VERSION='20261115-ecology-food-web-material';
// Supply the actual food relations requested by this authored question.
const prior={
  "id": "c22-s42-u02-b35",
  "status": "authored",
  "sourceRef": {
    "type": "authored-supplement",
    "edition": "2022 개정 현행 범위 보충",
    "note": "원문 짝이 없는 독립 창작. 연습 자료는 실제 학생·현장 관측값이 아니다."
  },
  "taxonomy": {
    "curriculum": "2022 개정",
    "grade": 4,
    "semester": 2,
    "unit": "u02",
    "area": "생명",
    "element": "E4",
    "type": "T07",
    "format": "서술형",
    "level": "기본",
    "track": "교과",
    "topic": "여러 먹이 경로와 영향",
    "concept": "여러 먹이 경로와 영향",
    "inquirySkill": "여러 먹이 경로와 영향",
    "standard": "4과14-02"
  },
  "prompt": "친구는 “먹이가 하나 줄어도 먹이그물의 모든 생물이 반드시 살아남는다”고 말했어요. 이 말을 어떻게 고치면 좋을까요? 자료의 먹이 관계를 보고 까닭과 함께 설명해 보세요.",
  "givens": {
    "친구의 주장": "먹이그물에는 다른 길이 있으니 한 먹이가 줄어도 모든 생물이 반드시 살아남아."
  },
  "choices": null,
  "visualModel": null,
  "variantRules": null,
  "responseContract": "written-explanation",
  "answerContract": {
    "type": "written-explanation",
    "sample": "다른 먹이가 있으면 도움이 될 수 있지만, 그 먹이의 양이나 다른 환경도 확인해야 합니다. 그물만 보고 모두 반드시 살아남는다고 말할 수는 없습니다.",
    "rubric": {
      "required": [
        "대체 먹이의 도움 인정",
        "양 또는 환경 등 추가 조건 제시",
        "생존을 무조건 보장하지 않음"
      ],
      "pass": "타당한 근거·대안은 교사 확인"
    }
  },
  "explanation": "여러 먹이 관계가 연결되어 있으면 다른 먹이를 먹을 수 있어 도움이 돼요. 하지만 남은 먹이가 충분한지, 주변 환경은 어떤지도 살펴야 해요. 다른 먹이가 있다는 이유만으로 모든 생물이 반드시 살아남는다고 말할 수는 없어요.",
  "evidence": {
    "checkedBy": "독립 창작·자료/조건/응답 계약 검토",
    "date": "2026-10-18",
    "gates": [
      "science",
      "answer"
    ],
    "productGate": true,
    "renderGate": true
  },
  "contentVersion": "20261106-ecology-readable-workbook",
  "previousVersions": [
    {
      "id": "c22-s42-u02-b35",
      "status": "authored",
      "sourceRef": {
        "type": "authored-supplement",
        "edition": "2022 개정 현행 범위 보충",
        "note": "원문 짝이 없는 독립 창작. 연습 자료는 실제 학생·현장 관측값이 아니다."
      },
      "taxonomy": {
        "curriculum": "2022 개정",
        "grade": 4,
        "semester": 2,
        "unit": "u02",
        "area": "생명",
        "element": "E4",
        "type": "T07",
        "format": "서술형",
        "level": "기본",
        "track": "교과",
        "topic": "여러 먹이 경로와 영향",
        "concept": "여러 먹이 경로와 영향",
        "inquirySkill": "여러 먹이 경로와 영향",
        "standard": "4과14-02"
      },
      "prompt": "한 먹이가 줄어도 모두 안전하다고 한 친구의 주장을 자료를 이용해 보완하세요.",
      "givens": {
        "친구의 주장": "먹이그물에는 다른 길이 있으니 한 먹이가 줄어도 모든 생물이 반드시 살아남아."
      },
      "choices": null,
      "visualModel": null,
      "variantRules": null,
      "responseContract": "written-explanation",
      "answerContract": {
        "type": "written-explanation",
        "sample": "다른 먹이가 있으면 도움이 될 수 있지만, 그 먹이의 양이나 다른 환경도 확인해야 합니다. 그물만 보고 모두 반드시 살아남는다고 말할 수는 없습니다.",
        "rubric": {
          "required": [
            "대체 먹이의 도움 인정",
            "양 또는 환경 등 추가 조건 제시",
            "생존을 무조건 보장하지 않음"
          ],
          "pass": "타당한 근거·대안은 교사 확인"
        }
      },
      "explanation": "복잡한 그물이 유리한 까닭과 관찰의 한계를 함께 설명합니다.",
      "evidence": {
        "checkedBy": "독립 창작·자료/조건/응답 계약 검토",
        "date": "2026-10-18",
        "gates": [
          "science",
          "answer"
        ],
        "productGate": true,
        "renderGate": true
      },
      "version": 1
    }
  ]
};
const workbookPrior={
  "id": "c22-s42-u02-w039",
  "no": 39,
  "form": "written",
  "topic": "먹이 관계·먹이그물 모형",
  "prompt": "친구는 “먹이가 하나 줄어도 먹이그물의 모든 생물이 반드시 살아남는다”고 말했어요. 이 말을 어떻게 고치면 좋을까요? 자료의 먹이 관계를 보고 까닭과 함께 설명해 보세요.",
  "answer": "다른 먹이가 있으면 도움이 될 수 있지만, 그 먹이의 양이나 다른 환경도 확인해야 합니다. 그물만 보고 모두 반드시 살아남는다고 말할 수는 없습니다.",
  "explanation": "여러 먹이 관계가 연결되어 있으면 다른 먹이를 먹을 수 있어 도움이 돼요. 하지만 남은 먹이가 충분한지, 주변 환경은 어떤지도 살펴야 해요. 다른 먹이가 있다는 이유만으로 모든 생물이 반드시 살아남는다고 말할 수는 없어요.",
  "misconception": "생물의 역할·먹이 관계와 자료의 범위를 근거로 설명해요. 모형·계획을 실제 조사나 실천 결과로 바꾸지 않아요.",
  "criteria": "대체 먹이의 도움 인정 / 양 또는 환경 등 추가 조건 제시 / 생존을 무조건 보장하지 않음",
  "lines": 8,
  "sourceId": "c22-s42-u02-b35",
  "sourcePool": "items",
  "sourceRef": {
    "type": "authored-supplement",
    "edition": "2022 개정 현행 범위 보충",
    "note": "원문 짝이 없는 독립 창작. 연습 자료는 실제 학생·현장 관측값이 아니다."
  },
  "sourceGivens": {
    "친구의 주장": "먹이그물에는 다른 길이 있으니 한 먹이가 줄어도 모든 생물이 반드시 살아남아."
  },
  "sourceContract": {
    "type": "written-explanation",
    "sample": "다른 먹이가 있으면 도움이 될 수 있지만, 그 먹이의 양이나 다른 환경도 확인해야 합니다. 그물만 보고 모두 반드시 살아남는다고 말할 수는 없습니다.",
    "rubric": {
      "required": [
        "대체 먹이의 도움 인정",
        "양 또는 환경 등 추가 조건 제시",
        "생존을 무조건 보장하지 않음"
      ],
      "pass": "타당한 근거·대안은 교사 확인"
    }
  },
  "sourceExplanation": "복잡한 그물이 유리한 까닭과 관찰의 한계를 함께 설명합니다.",
  "standard": "4과14-02",
  "figure": "given-c22-s42-u02-b35"
};
const pagePrior={
  "section": "연습 39",
  "title": "먹이 관계·먹이그물 모형",
  "blocks": [
    {
      "type": "questions",
      "ids": [
        "c22-s42-u02-w039"
      ]
    }
  ],
  "rail": [
    {
      "title": "핵심 정리",
      "text": "여러 먹이 사슬의 같은 생물을 연결점으로 이으면 먹이그물이 돼요. 다른 경로가 남아도 먹이의 양과 환경을 함께 살펴야 해요."
    },
    {
      "title": "더 알아보기",
      "text": "중학교에서는 생물다양성 보전을 배워요. 한 생물을 지키려면 그 생물뿐 아니라 먹이와 서식지 등 다른 생물·환경과의 관계도 함께 살펴야 해요."
    },
    {
      "title": "내가 정리할 것",
      "text": "친구의 말에서 ‘반드시’라고 할 수 없는 까닭을 써요. 먹이 관계 외에 더 알아볼 조건도 적어요.",
      "write": 5
    }
  ],
  "lead": "",
  "kind": "practice"
};
const figurePrior="<svg xmlns=\"http://www.w3.org/2000/svg\" class=\"ecology-food-desktop\" viewBox=\"0 0 780 280\" role=\"img\" aria-label=\"연습 먹이그물. 풀에서 메뚜기와 애벌레로, 메뚜기에서 개구리로, 애벌레에서 작은 새로, 개구리와 작은 새에서 뱀으로 화살표가 이어집니다.\"><defs><marker id=\"ecology-food-arrow-h\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"6\" markerHeight=\"6\" orient=\"auto\"><path d=\"M0 0 10 5 0 10Z\" fill=\"#2456c4\"/></marker></defs><path data-food-edge=\"풀→메뚜기\" d=\"M138 140 L221 65\" fill=\"none\" stroke=\"#2456c4\" stroke-width=\"3\" marker-end=\"url(#ecology-food-arrow-h)\"/><path data-food-edge=\"풀→애벌레\" d=\"M138 140 L221 215\" fill=\"none\" stroke=\"#2456c4\" stroke-width=\"3\" marker-end=\"url(#ecology-food-arrow-h)\"/><path data-food-edge=\"메뚜기→개구리\" d=\"M343 65 L426 65\" fill=\"none\" stroke=\"#2456c4\" stroke-width=\"3\" marker-end=\"url(#ecology-food-arrow-h)\"/><path data-food-edge=\"애벌레→작은 새\" d=\"M343 215 L426 215\" fill=\"none\" stroke=\"#2456c4\" stroke-width=\"3\" marker-end=\"url(#ecology-food-arrow-h)\"/><path data-food-edge=\"개구리→뱀\" d=\"M548 65 L636 140\" fill=\"none\" stroke=\"#2456c4\" stroke-width=\"3\" marker-end=\"url(#ecology-food-arrow-h)\"/><path data-food-edge=\"작은 새→뱀\" d=\"M548 215 L636 140\" fill=\"none\" stroke=\"#2456c4\" stroke-width=\"3\" marker-end=\"url(#ecology-food-arrow-h)\"/><g data-food-node=\"풀\"><rect x=\"23\" y=\"113\" width=\"114\" height=\"54\" rx=\"8\" fill=\"#edf6ef\" stroke=\"#566274\" stroke-width=\"2\"/><text x=\"80\" y=\"148\" text-anchor=\"middle\" font-family=\"Pretendard,sans-serif\" font-size=\"23\" font-weight=\"700\" fill=\"#182230\">풀</text></g><g data-food-node=\"메뚜기\"><rect x=\"228\" y=\"38\" width=\"114\" height=\"54\" rx=\"8\" fill=\"#fff\" stroke=\"#566274\" stroke-width=\"2\"/><text x=\"285\" y=\"73\" text-anchor=\"middle\" font-family=\"Pretendard,sans-serif\" font-size=\"23\" font-weight=\"700\" fill=\"#182230\">메뚜기</text></g><g data-food-node=\"애벌레\"><rect x=\"228\" y=\"188\" width=\"114\" height=\"54\" rx=\"8\" fill=\"#fff\" stroke=\"#566274\" stroke-width=\"2\"/><text x=\"285\" y=\"223\" text-anchor=\"middle\" font-family=\"Pretendard,sans-serif\" font-size=\"23\" font-weight=\"700\" fill=\"#182230\">애벌레</text></g><g data-food-node=\"개구리\"><rect x=\"433\" y=\"38\" width=\"114\" height=\"54\" rx=\"8\" fill=\"#fff\" stroke=\"#566274\" stroke-width=\"2\"/><text x=\"490\" y=\"73\" text-anchor=\"middle\" font-family=\"Pretendard,sans-serif\" font-size=\"23\" font-weight=\"700\" fill=\"#182230\">개구리</text></g><g data-food-node=\"작은 새\"><rect x=\"433\" y=\"188\" width=\"114\" height=\"54\" rx=\"8\" fill=\"#fff\" stroke=\"#566274\" stroke-width=\"2\"/><text x=\"490\" y=\"223\" text-anchor=\"middle\" font-family=\"Pretendard,sans-serif\" font-size=\"23\" font-weight=\"700\" fill=\"#182230\">작은 새</text></g><g data-food-node=\"뱀\"><rect x=\"643\" y=\"113\" width=\"114\" height=\"54\" rx=\"8\" fill=\"#fff\" stroke=\"#566274\" stroke-width=\"2\"/><text x=\"700\" y=\"148\" text-anchor=\"middle\" font-family=\"Pretendard,sans-serif\" font-size=\"23\" font-weight=\"700\" fill=\"#182230\">뱀</text></g></svg><p class=\"ed-given\">제공한 여섯 생물의 연습 관계예요. 화살표는 먹히는 쪽 → 먹는 쪽이에요. 이름표는 생물의 이름을 나타내며, 실제 생물의 수는 알려 주지 않아요.</p>";
const givens={
  "친구의 주장": "먹이그물에는 다른 길이 있으니 한 먹이가 줄어도 모든 생물이 반드시 살아남아.",
  "먹이그물": "풀 → 메뚜기 → 개구리 → 뱀 / 풀 → 애벌레 → 작은 새 → 뱀"
};
const diagram={
  "type": "diagram",
  "key": "ecoWeb",
  "caption": "39번 먹이 관계 자료"
};
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b),clone=x=>JSON.parse(JSON.stringify(x)),cache=new WeakMap();
export function ecologyMaterialItems(rows,unit){
 if(unit!=='c22-s42-u02'||!Array.isArray(rows))return rows;
 let changed=false;const next=rows.map(q=>{
  if(!same(q,prior))return q;changed=true;if(cache.has(q))return cache.get(q);
  const current={...q,givens:clone(givens),contentVersion:ECOLOGY_MATERIAL_VERSION,previousVersions:[...clone(q.previousVersions||[]),{...clone(q),version:q.contentVersion||1,snapshotKind:'full-question'}]};
  cache.set(q,current);return current;
 });return changed?next:rows;
}
export function withEcologyMaterialWorkbook(workbook){
 if(workbook?.unit!=='c22-s42-u02'||!Array.isArray(workbook.pages)||!same(workbook.figures?.ecoWeb,figurePrior)||!same(workbook.questions?.find(q=>q.id===workbookPrior.id),workbookPrior)||!same(workbook.pages[35],pagePrior)||!workbook.teacherStudentPages?.some(p=>same(p,pagePrior)))return workbook;
 const replace=p=>same(p,pagePrior)?{...p,blocks:[clone(diagram),...p.blocks]}:p;
 return{...workbook,questions:workbook.questions.map(q=>q.id===workbookPrior.id?{...q,sourceGivens:clone(givens)}:q),pages:workbook.pages.map(replace),teacherStudentPages:workbook.teacherStudentPages.map(replace)};
}
