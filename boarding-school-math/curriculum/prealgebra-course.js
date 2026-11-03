(function (root, factory) {
  const course = factory();
  if (typeof module === "object" && module.exports) module.exports = course;
  if (root) root.GFIELDMathCourse = course;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  function practice(prompt, answer, feedback) {
    return Object.freeze({ prompt: prompt, answer: answer, feedback: feedback });
  }
  function lesson(title, objective, idea, examplePrompt, exampleSolution, practiceItems) {
    return Object.freeze({
      title: title,
      objective: objective,
      idea: idea,
      example: Object.freeze({ prompt: examplePrompt, solution: exampleSolution }),
      practice: Object.freeze(practiceItems)
    });
  }
  function unit(id, title, question, goals, standards, summary, lessons) {
    return Object.freeze({
      id: id,
      title: title,
      question: question,
      goals: Object.freeze(goals),
      standards: Object.freeze(standards),
      lesson: Object.freeze(summary),
      lessons: Object.freeze(lessons)
    });
  }

  const units = Object.freeze([
    unit("expressions-and-equivalence", "식의 구조와 동치", "문장과 계산을 변수식으로 나타내고, 값은 그대로 두면서 더 알아보기 쉬운 식으로 바꿀 수 있을까요?", [
      "문자와 연산 기호를 사용해 양 사이의 관계를 식으로 나타내고, 주어진 값에서 식의 값을 구한다",
      "거듭제곱과 괄호를 포함한 수식에서 연산 순서를 적용하고 계산 근거를 설명한다",
      "교환·결합·분배 성질을 이용해 식을 전개하거나 묶어 동치인 식을 만든다",
      "동류항을 결합하고 대입으로 두 식이 같은 값을 나타내는지 확인한다"
    ], ["6.EE.A.1", "6.EE.A.2", "6.EE.A.3", "6.EE.A.4"], {
      title: "둘레 식을 두 가지로 나타내기",
      prompt: "가로가 x + 3cm, 세로가 x + 1cm인 직사각형의 둘레를 식으로 나타내고, x = 4일 때 둘레를 구하세요.",
      solution: "둘레는 2(x+3)+2(x+1)입니다. 분배하고 동류항을 결합하면 4x+8이고, x=4를 넣으면 24cm입니다. 두 식은 같은 x값에서 같은 둘레를 나타냅니다.",
      extension: "두 식에서 각 항이 직사각형의 어느 변을 나타내는지 그림에 표시해 보세요."
    }, [
      lesson("변수식으로 나타내고 식의 값 구하기", "문장의 양과 연산을 변수식으로 나타내고, 변수에 주어진 값을 대입해 식의 값을 계산한다.", "변수는 상황에 따라 달라지는 수를 나타내요. ‘한 개에 3달러인 물건 n개의 값’은 3n이고, 여기에 고정 요금 2달러가 더해지면 3n+2예요. 식은 계산 결과뿐 아니라 양 사이의 관계도 나타냅니다.", "한 장에 3달러인 입장권 n장과 2달러의 예약비를 식으로 나타내세요. n=4일 때 총액도 구하세요.", "입장권 값은 3n달러이고 예약비를 더하면 3n+2달러예요. n=4이면 3×4+2=14달러입니다.", [
        practice("한 상자에 연필이 8자루씩 들어 있습니다. 상자 b개의 연필 수를 식으로 나타내세요.", "8b", "상자마다 8자루씩 있으므로 8을 b번 더한 값은 8b입니다."),
        practice("식 5m+7에서 m=3일 때의 값을 구하고, 각 항의 뜻을 설명하세요.", "22", "m에 3을 대입하면 5×3+7=22입니다. 5m은 다섯 개씩 m묶음, 7은 더해지는 고정량입니다.")
      ]),
      lesson("거듭제곱과 연산 순서 적용하기", "정수 지수가 있는 수식에서 괄호·거듭제곱·곱셈과 나눗셈·덧셈과 뺄셈의 순서를 적용하고 각 단계를 설명한다.", "거듭제곱은 같은 수를 여러 번 곱한다는 뜻이에요. 괄호가 있으면 괄호 안을 먼저 계산하고, 거듭제곱을 계산한 뒤 곱셈·나눗셈, 덧셈·뺄셈 순서로 진행해요. 같은 순서의 연산이 이어지면 왼쪽부터 계산합니다.", "한 변의 길이가 3/2m인 정사각형의 넓이를 식으로 나타내고 계산하세요.", "정사각형의 넓이는 한 변×한 변이므로 (3/2)²m²입니다. 3/2×3/2=9/4이므로 넓이는 9/4m²입니다.", [
        practice("8−2×3²의 값을 구하고 먼저 계산하는 연산을 말하세요.", "−10", "거듭제곱을 먼저 계산해 8−2×9, 다음 곱셈을 해 8−18=−10입니다."),
        practice("(1/2+1/4)×8의 값을 구하세요.", "6", "괄호 안의 합은 3/4입니다. 따라서 3/4×8=6입니다.")
      ]),
      lesson("문장을 변수식으로 번역하기", "‘보다 크다’, ‘의 몇 배’, ‘차이’, ‘고정량과 변하는 양’ 같은 문장 관계를 변수식으로 쓰고 문장과 식을 서로 설명한다.", "문장을 식으로 옮길 때는 연산 기호부터 정하지 말고 어떤 양이 기준이고 무엇이 변하는지 확인해요. ‘y보다 5 큰 수’는 y+5지만 ‘5에서 y를 뺀 수’는 5−y예요. 같은 단어가 있어도 관계의 방향이 달라질 수 있습니다.", "어떤 수 x의 세 배보다 4 작은 수를 식으로 쓰고, x=6일 때 값을 구하세요.", "세 배는 3x이고, 그보다 4 작은 수는 3x−4입니다. x=6이면 18−4=14입니다.", [
        practice("점수 s에 보너스 12점을 더한 뒤 총점의 절반을 계산합니다. 이를 식으로 나타내세요.", "(s+12)/2", "먼저 보너스를 더하고 그 합 전체를 절반으로 나누므로 괄호가 필요합니다."),
        practice("직사각형의 가로가 w, 세로가 가로보다 3cm 짧습니다. 둘레를 식으로 나타내세요.", "2w+2(w−3) 또는 4w−6", "세로는 w−3이고, 둘레는 가로와 세로를 각각 두 번 더한 값입니다.")
      ]),
      lesson("연산 성질로 식을 바꾸고 확인하기", "덧셈·곱셈의 교환·결합 성질과 분배 성질을 식에 적용하고, 적용 전후가 동치인 이유를 설명한다.", "교환 성질은 순서를 바꿔도 값이 같음을, 결합 성질은 묶는 위치를 바꿔도 값이 같음을 나타내요. 분배 성질은 a(b+c)=ab+ac예요. 문자에 여러 값을 대입해 확인하는 것은 근거를 점검하는 방법이며, 동치의 뜻은 모든 허용되는 값에서 같다는 것입니다.", "4×(n+6)을 분배 성질로 전개하고 n=2를 대입해 두 식의 값을 비교하세요.", "4(n+6)=4n+24입니다. n=2이면 원래 식은 4×8=32, 전개식도 8+24=32이므로 값이 같습니다.", [
        practice("7a+7b를 곱의 꼴로 묶으세요.", "7(a+b)", "두 항에 공통인수 7을 찾아 괄호 밖으로 묶습니다."),
        practice("9+4x와 4x+9가 동치인 이유를 연산 성질로 설명하세요.", "덧셈의 교환 성질로 순서를 바꾸어도 합이 같기 때문입니다.", "두 식은 모든 x에서 같은 두 항을 더합니다.")
      ]),
      lesson("분배법칙으로 전개하고 묶기", "분배법칙을 사용해 괄호를 전개하거나 공통인수를 묶고, 원래 상황과 연결해 각 항의 의미를 설명한다.", "곱해진 수는 괄호 안의 모든 항에 적용해요. 반대로 여러 항에 같은 인수가 있으면 공통인수로 묶을 수 있습니다. 전개와 인수분해는 서로 되돌리는 관계예요.", "5(2x+3)을 전개하고, 전개한 식에서 공통인수를 찾아 다시 묶으세요.", "5를 각 항에 곱하면 10x+15입니다. 두 항의 공통인수 5를 묶으면 5(2x+3)으로 돌아옵니다.", [
        practice("6(y−4)를 전개하세요.", "6y−24", "6을 y와 −4에 각각 곱합니다."),
        practice("12p+18을 최대 공통인수로 묶으세요.", "6(2p+3)", "12와 18의 최대공약수 6을 공통인수로 묶습니다.")
      ]),
      lesson("동류항을 결합해 식을 정리하기", "문자와 지수 구조가 같은 항을 찾아 계수끼리 결합하고, 정리한 식의 값이 보존되는지 대입으로 확인한다.", "동류항은 같은 문자를 같은 지수로 가진 항이에요. 3x와 2x는 x가 몇 묶음인지 함께 세어 5x로 나타낼 수 있지만, x와 x²는 묶을 수 없어요. 식을 정리할 때는 항의 종류를 구분하고 계수만 계산합니다.", "3x+4+2x−1을 간단히 하고 x=2에서 원래 식과 비교하세요.", "x항끼리 3x+2x=5x, 상수항끼리 4−1=3이므로 5x+3입니다. x=2이면 원래 식은 6+4+4−1=13이고 정리한 식도 10+3=13입니다.", [
        practice("7a−3+2a+8을 간단히 하세요.", "9a+5", "a항 7a와 2a를, 상수항 −3과 8을 각각 결합합니다."),
        practice("4m+2n+3m−n을 간단히 하세요.", "7m+n", "m항끼리, n항끼리 결합합니다. 서로 다른 문자를 가진 항은 합칠 수 없습니다.")
      ])
    ])
  ]);

  return Object.freeze({
    id: "pre-algebra",
    title: "GFIELD Pre-Algebra · 식의 구조와 동치",
    shortTitle: "PRE-ALGEBRA · UNIT 1",
    scope: "지필드가 직접 작성한 Pre-Algebra 첫 단원입니다. 변수식과 값, 연산 순서, 문장 번역, 연산 성질, 분배법칙, 동류항을 6.EE 기준 개념 흐름으로 연결합니다. 이 단원은 전체 Pre-Algebra 과정이나 진단·학년 배치를 대신하지 않습니다.",
    standardsSource: "https://www.thecorestandards.org/Math/Content/6/EE/",
    sources: Object.freeze([
      "https://www.thecorestandards.org/Math/Content/6/EE/",
      "https://www.thecorestandards.org/Math/Content/7/EE/"
    ]),
    units: units
  });
});
