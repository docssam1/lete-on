export const STUDENT_REMEDIATION_VERSION='20261115-student-remediation';
// Clarify current guidance without altering diagnosis codes, terms or question history.
const patches={
  "c22-s62-u03": {
    "M14": {
      "previous": {
        "label": "효율적 이용과 실천 점검",
        "terms": [
          "효율적 이용과 실천 점검"
        ],
        "fix": "효율적 이용과 실천 점검",
        "element": "E8"
      },
      "label": "전기를 효율적이고 안전하게 사용해요",
      "fix": "읽기에 필요한 밝기, 환기, 식품 보관 기능은 유지하며 전기 낭비를 줄여요. 조명은 같은 밝기와 사용 시간에서 전기 사용량을 비교해요. 기구는 설명서의 안전 안내에 맞게 사용해요."
    }
  },
  "c22-s52-u02": {
    "M07": {
      "previous": {
        "label": "단열과 보온/보냉를 확인해요",
        "terms": [
          "단열과 보온/보냉"
        ],
        "fix": "열 이동 방향·단열 구조·조건과 실제 변화",
        "element": "E7"
      },
      "label": "단열과 온도 변화를 함께 살펴봐요",
      "fix": "단열은 열의 이동을 줄이는 것이에요. 열은 온도가 높은 쪽에서 낮은 쪽으로 이동해요. 단열의 효과는 물의 양과 처음 온도, 재는 시각을 같게 하여 비교해요."
    }
  },
  "c22-s61-u01": {
    "M09": {
      "previous": {
        "label": "산성화와 환경 피해 자료의 조건을 확인해요",
        "terms": [
          "산성화와 환경 피해 자료"
        ],
        "fix": "산성비·해양/토양 산성화의 원인·현황·조건 있는 전망·대책을 출처와 구별한다.",
        "element": "E6"
      },
      "label": "산성화의 원인과 피해를 자료로 설명해요",
      "fix": "산성화가 일어나는 원인과 그로 인한 피해를 자료에서 찾아요. 이미 조사해 알게 된 사실과 앞으로의 예상을 구별해요. 조사한 곳과 때, 피해를 줄일 방법도 확인해요."
    }
  },
  "c22-s61-u02": {
    "M09": {
      "previous": {
        "label": "교통안전 행동의 근거를 확인해요",
        "terms": [
          "교통안전 행동"
        ],
        "fix": "신호·주변 확인·차량 정지 등 상황에 맞는 안전 행동을 선택하고 일상에서 실천한다.",
        "element": "E4"
      },
      "label": "상황에 맞는 교통안전 행동을 찾아요",
      "fix": "길을 건너기 전에는 멈추어 신호와 주변을 살피고, 차가 멈췄는지 확인해요. 도로 주변에서는 공놀이를 하지 않고 바퀴 달린 신발도 타지 않아요. 차에서는 안전띠를 바르게 매요."
    }
  },
  "c22-s61-u03": {
    "M05": {
      "previous": {
        "label": "줄기 생김새와 기능의 근거를 확인해요",
        "terms": [
          "줄기 생김새와 기능"
        ],
        "fix": "특징·지지/저장 기능 구별",
        "element": "E2"
      },
      "label": "줄기의 생김새와 기능을 살펴봐요",
      "fix": "줄기는 잎과 꽃 등을 받쳐 주고 물과 양분이 이동하는 통로가 돼요. 감자처럼 양분을 저장하는 줄기도 있어요. 땅속에서 자란다는 것만으로 뿌리라고 정하지 않아요."
    },
    "M13": {
      "previous": {
        "label": "기관 연결과 생활 적용의 근거를 확인해요",
        "terms": [
          "기관 연결과 생활 적용"
        ],
        "fix": "기관의 역할·조건·주장 범위",
        "element": "E5"
      },
      "label": "식물 기관의 구조와 기능을 연결해요",
      "fix": "뿌리·줄기·잎 같은 식물 기관은 물과 양분을 주고받으며 함께 일해요. 한 기관이 여러 일을 할 수도 있어요. 생김새와 실험 결과를 근거로 각 기관의 기능을 설명해요."
    }
  }
};
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
export function withReadableRemediation(unit,misc){
 const selected=patches[unit];if(!selected||!misc?.misconceptions)return misc;
 let changed=false;const misconceptions={...misc.misconceptions};
 for(const[id,p]of Object.entries(selected))if(same(misconceptions[id],p.previous)){
  misconceptions[id]={...misconceptions[id],label:p.label,fix:p.fix};changed=true;
 }
 return changed?{...misc,misconceptions}:misc;
}
