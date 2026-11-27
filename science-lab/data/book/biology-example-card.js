export const BIOLOGY_EXAMPLE_VERSION='20261115-biology-example-card';
const prior={
  "id": "s41-u04-b55",
  "status": "authored",
  "sourceRef": {
    "type": "authored-supplement",
    "edition": "2022 개정 범위 보충",
    "note": "원문 짝이 없는 독립 창작 문항"
  },
  "taxonomy": {
    "curriculum": "2022 개정",
    "grade": 4,
    "semester": 1,
    "unit": "u04",
    "area": "생명",
    "element": "E8",
    "type": "T19",
    "format": "단답형",
    "level": "기본",
    "track": "교과",
    "topic": "소개 자료 만들기와 발표",
    "concept": "소개 자료 만들기와 발표",
    "inquirySkill": "소개 자료 만들기와 발표",
    "standard": "4과12-03"
  },
  "prompt": "소개 자료를 듣거나 읽을 사람을 ‘전달 [ ]’이라고 해요. 빈칸에 알맞은 말을 쓰세요.",
  "givens": null,
  "choices": null,
  "visualModel": null,
  "variantRules": null,
  "responseContract": "short-text",
  "answerContract": {
    "type": "short-text",
    "answer": "대상",
    "accepted": [
      "대상"
    ]
  },
  "explanation": "전달 대상에 맞게 표현·설명 순서·그림을 고릅니다. 사실과 출처를 생략해도 된다는 뜻은 아닙니다.",
  "evidence": {
    "checkedBy": "독립 창작·과학 내용 검토",
    "date": "2026-10-18",
    "gates": [
      "science",
      "answer"
    ]
  },
  "contentVersion": "20261105-biology-question-language",
  "previousVersions": [
    {
      "id": "s41-u04-b55",
      "status": "authored",
      "sourceRef": {
        "type": "authored-supplement",
        "edition": "2022 개정 범위 보충",
        "note": "원문 짝이 없는 독립 창작 문항"
      },
      "taxonomy": {
        "curriculum": "2022 개정",
        "grade": 4,
        "semester": 1,
        "unit": "u04",
        "area": "생명",
        "element": "E8",
        "type": "T19",
        "format": "단답형",
        "level": "기본",
        "track": "교과",
        "topic": "소개 자료 만들기와 발표",
        "concept": "소개 자료 만들기와 발표",
        "inquirySkill": "소개 자료 만들기와 발표",
        "standard": "4과12-03"
      },
      "prompt": "내용을 듣거나 읽을 사람을 자료의 전달 무엇이라고 하나요?",
      "givens": null,
      "choices": null,
      "visualModel": null,
      "variantRules": null,
      "responseContract": "short-text",
      "answerContract": {
        "type": "short-text",
        "answer": "대상",
        "accepted": [
          "대상"
        ]
      },
      "explanation": "전달 대상에 맞게 표현·설명 순서·그림을 고릅니다. 사실과 출처를 생략해도 된다는 뜻은 아닙니다.",
      "evidence": {
        "checkedBy": "독립 창작·과학 내용 검토",
        "date": "2026-10-18",
        "gates": [
          "science",
          "answer"
        ]
      },
      "version": 1
    }
  ]
},workbookPrior={
  "id": "s41-u04-w067",
  "no": 67,
  "form": "short",
  "topic": "생명과학 이용 사례 소개하기",
  "prompt": "소개 자료를 듣거나 읽을 사람을 ‘전달 [ ]’이라고 해요. 빈칸에 알맞은 말을 쓰세요.",
  "answer": "대상",
  "explanation": "전달 대상에 맞게 표현·설명 순서·그림을 고릅니다. 사실과 출처를 생략해도 된다는 뜻은 아닙니다.",
  "misconception": "생김새·사는 곳·작용의 근거를 연결하고 한 사례를 모든 생물로 넓히지 않아요.",
  "criteria": "소개 자료를 듣거나 읽을 사람을 가리키도록 전달 뒤의 빈칸에 대상을 썼는지 확인해요.",
  "sourceId": "s41-u04-b55",
  "sourcePool": "items",
  "sourceRef": {
    "type": "authored-supplement",
    "edition": "2022 개정 범위 보충",
    "note": "원문 짝이 없는 독립 창작 문항"
  },
  "sourceGivens": null,
  "sourceContract": {
    "type": "short-text",
    "answer": "대상",
    "accepted": [
      "대상"
    ]
  },
  "sourceExplanation": "전달 대상에 맞게 표현·설명 순서·그림을 고릅니다. 사실과 출처를 생략해도 된다는 뜻은 아닙니다.",
  "standard": "4과12-03",
  "accepted": [
    "대상"
  ]
};
const fields={
  "prompt": "요구르트를 소개하는 카드예요. 빈칸에 알맞은 생물 이름을 쓰세요. “우유를 발효해 요구르트를 만들 때 [ ]을 이용해요.”",
  "explanation": "유산균의 작용으로 우유가 발효되어 요구르트가 돼요. 소개 카드에는 이용하는 생물과 그 생물이 하는 일을 함께 설명해요.",
  "answerContract": {
    "type": "short-text",
    "answer": "유산균",
    "accepted": [
      "유산균"
    ],
    "vocabulary": [
      "대상"
    ]
  },
  "taxonomy": {
    "curriculum": "2022 개정",
    "grade": 4,
    "semester": 1,
    "unit": "u04",
    "area": "생명",
    "element": "E8",
    "type": "T19",
    "format": "단답형",
    "level": "기본",
    "track": "교과",
    "topic": "요구르트 이용 사례 소개",
    "concept": "유산균의 작용과 요구르트",
    "inquirySkill": "생물의 특징과 이용 사례 연결",
    "standard": "4과12-03"
  },
  "evidence": {
    "checkedBy": "독립 창작·과학 내용 검토",
    "date": "2026-11-15",
    "gates": [
      "science",
      "answer"
    ],
    "contentNote": "발표 용어 암기 대신 유산균의 요구르트 이용 사례를 묻는다."
  }
},workbookFields={
  "prompt": "요구르트를 소개하는 카드예요. 빈칸에 알맞은 생물 이름을 쓰세요. “우유를 발효해 요구르트를 만들 때 [ ]을 이용해요.”",
  "answer": "유산균",
  "accepted": [
    "유산균"
  ],
  "explanation": "유산균의 작용으로 우유가 발효되어 요구르트가 돼요. 소개 카드에는 이용하는 생물과 그 생물이 하는 일을 함께 설명해요.",
  "sourceExplanation": "유산균의 작용으로 우유가 발효되어 요구르트가 돼요. 소개 카드에는 이용하는 생물과 그 생물이 하는 일을 함께 설명해요.",
  "sourceContract": {
    "type": "short-text",
    "answer": "유산균",
    "accepted": [
      "유산균"
    ],
    "vocabulary": [
      "대상"
    ]
  },
  "misconception": "요구르트에 이용하는 생물과 그 작용을 연결해요.",
  "criteria": "요구르트에 이용하는 세균의 이름으로 유산균을 썼는지 확인해요."
},quickPrior="<div class=\"mt-quick-grid\"><table class=\"ed-table\"><thead><tr><th scope=\"col\">번호</th><th scope=\"col\">형식</th><th scope=\"col\">정답</th></tr></thead><tbody><tr><th scope=\"row\">55</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">56</th><td>객관식</td><td>③</td></tr><tr><th scope=\"row\">57</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">58</th><td>객관식</td><td>②</td></tr><tr><th scope=\"row\">59</th><td>객관식</td><td>⑤</td></tr><tr><th scope=\"row\">60</th><td>객관식</td><td>④</td></tr><tr><th scope=\"row\">61</th><td>객관식</td><td>③</td></tr><tr><th scope=\"row\">62</th><td>객관식</td><td>①</td></tr><tr><th scope=\"row\">63</th><td>단답</td><td>생물 농약</td></tr><tr><th scope=\"row\">64</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">65</th><td>객관식</td><td>⑤</td></tr><tr><th scope=\"row\">66</th><td>객관식</td><td>②</td></tr><tr><th scope=\"row\">67</th><td>단답</td><td>대상</td></tr></tbody></table><table class=\"ed-table\"><thead><tr><th scope=\"col\">번호</th><th scope=\"col\">형식</th><th scope=\"col\">정답</th></tr></thead><tbody><tr><th scope=\"row\">68</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">69</th><td>단답</td><td>피드백</td></tr><tr><th scope=\"row\">70</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">71</th><td>객관식</td><td>④</td></tr><tr><th scope=\"row\">72</th><td>모두 고르기</td><td>①, ③</td></tr><tr><th scope=\"row\">73</th><td>모두 고르기</td><td>②, ④</td></tr><tr><th scope=\"row\">74</th><td>빈칸</td><td>㉠ 이산화 탄소 · ㉡ 부풀기/반죽의 부풀기</td></tr><tr><th scope=\"row\">75</th><td>빈칸</td><td>㉠ 억제 · ㉡ 항생제</td></tr><tr><th scope=\"row\">76</th><td>연결</td><td>㉠–② · ㉡–③ · ㉢–①</td></tr><tr><th scope=\"row\">77</th><td>연결</td><td>㉠–③ · ㉡–① · ㉢–②</td></tr><tr><th scope=\"row\">78</th><td>순서</td><td>㉡→㉣→㉢→㉠</td></tr><tr><th scope=\"row\">79</th><td>그림</td><td>교사 확인</td></tr><tr><th scope=\"row\">80</th><td>그림</td><td>교사 확인</td></tr></tbody></table></div>",quickWorkbookPrior="<div class=\"mt-quick-grid\"><table class=\"ed-table\"><thead><tr><th scope=\"col\">번호</th><th scope=\"col\">형식</th><th scope=\"col\">정답</th></tr></thead><tbody><tr><th scope=\"row\">55</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">56</th><td>객관식</td><td>③</td></tr><tr><th scope=\"row\">57</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">58</th><td>객관식</td><td>②</td></tr><tr><th scope=\"row\">59</th><td>객관식</td><td>⑤</td></tr><tr><th scope=\"row\">60</th><td>객관식</td><td>④</td></tr><tr><th scope=\"row\">61</th><td>객관식</td><td>③</td></tr><tr><th scope=\"row\">62</th><td>객관식</td><td>①</td></tr><tr><th scope=\"row\">63</th><td>단답</td><td>생물 농약</td></tr><tr><th scope=\"row\">64</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">65</th><td>객관식</td><td>⑤</td></tr><tr><th scope=\"row\">66</th><td>객관식</td><td>②</td></tr><tr><th scope=\"row\">67</th><td>단답</td><td>대상</td></tr></tbody></table><table class=\"ed-table\"><thead><tr><th scope=\"col\">번호</th><th scope=\"col\">형식</th><th scope=\"col\">정답</th></tr></thead><tbody><tr><th scope=\"row\">68</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">69</th><td>단답</td><td>의견</td></tr><tr><th scope=\"row\">70</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">71</th><td>객관식</td><td>④</td></tr><tr><th scope=\"row\">72</th><td>모두 고르기</td><td>①, ③</td></tr><tr><th scope=\"row\">73</th><td>모두 고르기</td><td>②, ④</td></tr><tr><th scope=\"row\">74</th><td>빈칸</td><td>㉠ 이산화 탄소 · ㉡ 부풀기/반죽의 부풀기</td></tr><tr><th scope=\"row\">75</th><td>빈칸</td><td>㉠ 억제 · ㉡ 항생제</td></tr><tr><th scope=\"row\">76</th><td>연결</td><td>㉠–② · ㉡–③ · ㉢–①</td></tr><tr><th scope=\"row\">77</th><td>연결</td><td>㉠–③ · ㉡–① · ㉢–②</td></tr><tr><th scope=\"row\">78</th><td>순서</td><td>㉡→㉣→㉢→㉠</td></tr><tr><th scope=\"row\">79</th><td>그림</td><td>교사 확인</td></tr><tr><th scope=\"row\">80</th><td>그림</td><td>교사 확인</td></tr></tbody></table></div>";
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b),clone=x=>JSON.parse(JSON.stringify(x)),cache=new WeakMap();
export function biologyExampleItems(rows,unit){
 if(unit!=='s41-u04'||!Array.isArray(rows))return rows;
 let changed=false;const next=rows.map(q=>{
  if(!same(q,prior))return q;changed=true;if(cache.has(q))return cache.get(q);
  // Keep the shared wrong-word vocabulary stable for every other short answer.
  const current={...q,...clone(fields),contentVersion:BIOLOGY_EXAMPLE_VERSION,diagnosticOverride:{version:BIOLOGY_EXAMPLE_VERSION,distractors:null,typed:{any:'M18'},cloze:null,cells:null},previousVersions:[...clone(q.previousVersions||[]),{...clone(q),version:q.contentVersion||1,snapshotKind:'full-question'}]};cache.set(q,current);return current;
 });return changed?next:rows;
}
export function withBiologyExampleWorkbook(workbook){
 if(workbook?.unit!=='s41-u04'||!Array.isArray(workbook.questions))return workbook;
 let changed=false;const questions=workbook.questions.map(q=>{if(!same(q,workbookPrior))return q;changed=true;return{...q,...clone(workbookFields)};});
 return changed?{...workbook,questions,figures:withBiologyExampleArt(workbook.figures)}:workbook;
}
export function withBiologyExampleArt(art){
 if(![quickPrior,quickWorkbookPrior].includes(art?.['quick-55']))return art;
 const oldRow='<tr><th scope="row">67</th><td>단답</td><td>대상</td></tr>',newRow='<tr><th scope="row">67</th><td>단답</td><td>유산균</td></tr>';
 return{...art,'quick-55':art['quick-55'].replace(oldRow,newRow)};
}
