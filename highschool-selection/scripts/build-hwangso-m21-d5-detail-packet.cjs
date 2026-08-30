"use strict";

const fs = require("node:fs");
const path = require("node:path");

const SOURCE_MEMORY_ID = "hwangso-middle-51fbf835e246";
const SOURCE_TITLE = "황소수학 중2-1";
const PAGE_START = 123;
const PAGE_END = 143;

const T = Object.freeze({
  exponentLawCheck: ["지수법칙이 맞게 적용된 식 찾기", "각 보기의 곱셈·나눗셈·거듭제곱 지수법칙을 적용해 양변을 비교한다"],
  numericLiteralExponent: ["수와 문자가 섞인 지수법칙 결과 판별", "계수와 문자의 지수를 따로 계산한 뒤 각 보기를 검증한다"],
  primeFactorExponent: ["소인수분해한 거듭제곱의 지수 비교", "밑을 소인수의 거듭제곱으로 바꾸고 양변의 지수를 비교한다"],
  reciprocalPower: ["역수로 주어진 거듭제곱 조건 활용", "주어진 값을 같은 밑의 거듭제곱으로 바꾸고 역수와 거듭제곱을 계산한다"],
  replaceKnownPower: ["같은 밑으로 바꾸어 문자로 나타내기", "모든 수를 같은 밑으로 바꾸고 주어진 거듭제곱을 한 묶음으로 대입한다"],
  factorPower: ["거듭제곱식에서 공통인수 묶기", "가장 작은 지수의 거듭제곱을 공통인수로 묶은 뒤 주어진 값을 대입한다"],
  quotientExponentEquation: ["같은 밑의 나눗셈으로 지수방정식 풀기", "분자와 분모를 같은 밑으로 정리하고 양변의 지수를 비교한다"],
  factoredExponentEquation: ["같은 거듭제곱을 묶어 지수방정식 풀기", "같은 거듭제곱을 공통인수로 묶어 그 값을 구한다"],
  groupedExponentBlock: ["지수식의 밑을 통일하고 공통인수로 묶는 계산 묶음", "소문항마다 밑을 통일하고 공통 거듭제곱을 묶어 계산한다"],
  naturalExponentCondition: ["자연수 조건이 있는 지수식의 미지수 찾기", "상수의 소인수에서 한 미지수를 정하고 남은 지수 관계로 다른 미지수를 구한다"],
  blankExponentCoefficient: ["지수식을 묶어 빠진 계수 구하기", "공통 거듭제곱을 묶고 남는 수를 계산해 빈칸의 계수를 정한다"],
  negativeOneParity: ["홀짝 조건으로 음수의 거듭제곱 계산하기", "지수가 홀수인지 짝수인지 판정해 각 항의 부호를 정한다"],
  signAndLikeTerms: ["지수의 홀짝에 따라 부호를 정해 동류항 계산하기", "경우를 나누어 음수 거듭제곱의 부호를 정하고 동류항을 모은다"],
  signedExponentQuotient: ["음수의 거듭제곱과 같은 밑 나눗셈", "부호와 문자의 지수 부분을 나누어 계산한다"],
  decimalDigitCount: ["2와 5의 거듭제곱으로 자연수 자릿수 구하기", "2와 5를 짝지어 10의 거듭제곱을 만들고 자릿수를 판단한다"],
  fractionDigitCount: ["소인수분해로 거듭제곱 분수의 자릿수 구하기", "분자와 분모를 소인수분해해 약분한 뒤 10의 거듭제곱 꼴로 바꾼다"],
  sameExponentRatio: ["같은 지수의 두 거듭제곱 크기 비교", "두 수의 몫을 같은 지수로 묶어 몇 배인지 계산한다"],
  linearExponentRelation: ["지수의 일차 관계를 이용해 문자로 나타내기", "목표 지수를 주어진 지수의 배수와 나머지로 나누어 알려진 값을 대입한다"],
  reciprocalBaseEquation: ["역수의 거듭제곱을 같은 밑으로 바꾼 지수방정식", "역수를 포함한 모든 수를 같은 밑으로 바꾸고 지수를 비교한다"],
  powerApproximation: ["알려진 거듭제곱의 근삿값으로 큰 수 추정하기", "목표식을 알려진 거듭제곱과 10의 거듭제곱의 곱이나 몫으로 바꾼다"],
  baseUnifyEquation: ["서로 다른 밑을 통일해 지수방정식 풀기", "각 밑을 하나의 소수 밑으로 바꾸고 양변의 지수를 비교한다"],
  powerConditionFraction: ["거듭제곱 조건으로 복잡한 분수값 계산하기", "분자와 분모에 알맞은 거듭제곱을 곱해 주어진 조건을 쓸 수 있게 바꾼다"],
  cyclicExponentProduct: ["순환하는 지수의 합이 0이 되는 곱", "각 인수의 지수를 모두 더해 순환항이 소거되는지 확인한다"],
  monomialMixedBlock: ["단항식의 곱셈·나눗셈 혼합 계산 묶음", "소문항별로 계수는 곱하고 나누며 같은 문자의 지수는 더하고 뺀다"],
  monomialIdentityCompare: ["단항식 등식의 계수와 지수 비교", "한쪽 단항식을 정리한 뒤 계수와 각 문자의 지수를 비교한다"],
  missingMonomialBlock: ["등식을 만족시키는 빠진 단항식 계산 묶음", "빈칸을 한쪽에 남기고 곱셈과 나눗셈의 역연산으로 단항식을 구한다"],
  polynomialDivideBlock: ["다항식을 단항식으로 나눈 식의 덧셈·뺄셈 묶음", "나눗셈을 각 항에 분배해 약분한 뒤 동류항을 정리한다"],
  monomialParameterCompare: ["단항식 혼합 계산 결과의 계수와 지수 비교", "왼쪽을 차례로 간단히 한 뒤 우변의 계수와 문자 지수를 비교한다"],
  prismVolumeHeight: ["삼각기둥의 부피식에서 높이 구하기", "삼각형의 넓이와 기둥 높이로 부피식을 세워 단항식 나눗셈을 한다"],
  shadedRectangleArea: ["문자 길이가 있는 직사각형의 색칠한 넓이", "전체 넓이에서 색칠하지 않은 부분의 넓이를 빼고 식을 정리한다"],
  crossRoadArea: ["폭이 같은 십자 모양 길의 넓이", "가로 띠와 세로 띠의 넓이를 더하고 겹친 정사각형 넓이를 한 번 뺀다"],
  cornerTriangleArea: ["직사각형에서 네 모서리 삼각형을 뺀 넓이", "전체 직사각형 넓이에서 네 직각삼각형의 넓이 합을 뺀다"],
  isolateVariableBlock: ["등식을 변형해 목표 문자를 나타내는 계산 묶음", "분모를 없애고 목표 문자가 든 항을 한쪽에 모아 공통인수로 묶은 뒤 나눈다"],
  isolateLinearExpression: ["분수계수 등식에서 지정한 일차식 나타내기", "공통분모를 곱한 뒤 지정된 일차식을 한 덩어리로 만들어 목표 문자만 남긴다"],
  boxVolumeLength: ["모서리를 잘라 만든 상자의 부피식에서 길이 나타내기", "잘라낸 길이를 반영해 밑면과 높이의 부피식을 세우고 목표 길이에 대해 푼다"],
  coneSlantHeight: ["원뿔의 옆넓이 공식에서 모선 길이 나타내기", "원뿔의 옆넓이 관계식을 세우고 모선 길이를 한쪽에 남긴다"],
  substituteMonomial: ["단항식의 곱셈·나눗셈을 정리한 뒤 값 대입하기", "지수법칙으로 식을 간단히 한 뒤 주어진 음수를 포함한 값을 대입한다"],
  substituteFraction: ["세 변수 분수식에 분수 값 대입하기", "분자와 분모를 따로 계산하고 부호와 약분을 확인한다"],
  ratioHomogeneous: ["두 변수의 비로 같은 차수의 분수식 값 구하기", "두 변수를 같은 매개변수의 배수로 놓고 공통인 차수를 약분한다"],
  ratioLinearToFraction: ["두 일차식의 비로 변수의 비와 분수식 값 구하기", "두 일차식을 같은 매개변수로 놓아 변수의 비를 구하고 목표식에 대입한다"],
  crossMultiplyRatio: ["두 일차식의 비로 두 변수의 비 구하기", "비례식을 교차곱해 각 문자 항을 모은 뒤 두 변수의 비를 만든다"],
  threeVariableRatio: ["세 변수의 비로 같은 차수의 분수식 값 구하기", "세 변수를 하나의 매개변수의 배수로 놓고 공통인 차수를 약분한다"],
  linkedRatios: ["이어진 두 비를 세 변수의 비로 맞춰 식의 값 구하기", "공통 변수의 값을 맞춰 세 변수의 비를 만든 뒤 목표식에 대입한다"],
  ratioPolynomial: ["두 변수의 비를 이용해 다항식을 한 문자로 나타내기", "한 변수를 다른 변수의 배수로 바꾸고 전개와 약분을 한다"],
  reciprocalPairBlock: ["두 역수의 합 조건으로 분수식 계산하는 묶음", "역수의 합을 두 수의 합과 곱의 관계로 바꾸어 각 소문항을 계산한다"],
  sumZeroCyclic: ["세 수의 합이 0일 때 순환 분수식의 값", "한 수를 나머지 두 수의 합으로 바꾸고 세제곱 합 항등식을 이용한다"],
  reciprocalSumZero: ["세 역수의 합이 0일 때 순환비의 합", "조건을 두 수 곱의 합이 0인 식으로 바꾸고 전체를 세 수의 곱으로 통분한다"],
  chainedFractions: ["이어진 분수 관계에서 순환식의 값 구하기", "각 관계에서 두 변수를 하나의 변수로 나타낸 뒤 목표 순환식에 대입한다"],
  coefficientInProduct: ["두 일차식의 곱에서 특정 문자의 계수 구하기", "전체를 전개하되 목표 문자가 정해진 차수로 들어간 항만 모은다"],
  coefficientInCube: ["완전제곱식과 일차식의 곱에서 특정 항의 계수", "식을 한 이항식의 세제곱으로 보고 세제곱 공식을 적용한다"],
  expansionFormulaBlock: ["곱셈공식과 세제곱 합·차 공식으로 전개하는 묶음", "식의 구조에 맞는 제곱·세제곱 또는 세제곱 합·차 공식을 골라 전개한다"],
  symmetricCubeBlock: ["세제곱 합 공식으로 전개하는 두 식 묶음", "각 식을 세 항의 합과 대칭 이차식의 곱으로 보고 세제곱 합 항등식을 적용한다"],
  squaredDifferenceIdentity: ["세 수의 대칭식을 차의 제곱 합으로 나타내기", "차의 제곱 세 개를 전개해 같은 항을 모아 주어진 대칭식과 같음을 보인다"],
  squaredDifferenceValue: ["세 변수 대칭식을 차의 제곱 합으로 바꾸어 값 구하기", "식을 세 차의 제곱 합으로 바꾸고 주어진 차의 값을 대입한다"],
  cubeSumSymmetricData: ["합과 곱의 대칭 조건으로 세제곱 합 구하기", "세 수의 합·두 수 곱의 합·세 수의 곱을 세제곱 합 공식에 대입한다"],
  groupedExpansionBlock: ["반복되는 식을 한 덩어리로 묶어 전개하는 묶음", "반복되는 부분을 하나의 문자로 놓고 합과 차의 곱 또는 두 일차식의 곱을 적용한다"],
  quadraticProduct: ["이차방정식의 값을 이용해 네 일차식의 곱 계산하기", "네 인수를 두 쌍으로 묶어 주어진 이차식과 같은 부분을 만든다"],
  poweredDifference: ["차의 제곱 조건으로 거듭제곱 두 식의 차 계산하기", "큰 제곱의 차를 합과 차의 곱으로 바꾸어 주어진 차의 제곱을 반복 사용한다"],
  substituteThenExpand: ["두 식을 대입한 뒤 곱셈공식으로 정리하기", "필요한 합·차·곱을 먼저 구하고 제곱의 차 공식을 적용한다"],
  deviationSquares: ["평균에서 떨어진 거리의 제곱 합 간단히 하기", "평균을 한 문자로 놓고 세 제곱을 전개해 교차항을 없앤다"],
  remainderSquareDifference: ["두 수의 나머지로 제곱의 차의 나머지 구하기", "두 수를 같은 수의 배수와 나머지로 놓고 제곱해 차를 구한다"],
  nearbyProducts: ["가까운 수의 곱을 제곱의 차로 바꾸어 계산하기", "가운데 수를 기준으로 앞뒤 수의 곱을 제곱의 차로 바꿔 비교한다"],
  largeNearbyFraction: ["큰 수의 제곱과 가까운 두 수의 곱 계산하기", "한 수를 기준으로 분모를 제곱과 가까운 두 수의 곱의 차로 정리한다"],
  telescopingSquares: ["지수가 두 배씩 커지는 곱을 거듭제곱의 차로 합치기", "합과 차의 곱을 반복 적용해 전체 곱을 하나의 거듭제곱의 차로 만든다"],
  missingTelescoping: ["연속된 제곱 지수의 곱에서 빈칸 구하기", "빠진 첫 인수를 보충해 합과 차의 곱을 반복 적용하고 마지막 상수를 비교한다"],
  factorGivenQuadratic: ["주어진 이차식을 공통인수로 만들어 고차식 계산하기", "고차식에서 공통 거듭제곱을 묶어 주어진 이차식을 인수로 만든다"],
  reducePolynomial: ["이차 관계로 사차식을 일차식까지 낮추기", "주어진 이차 관계를 반복 대입해 높은 차수를 차례로 낮춘다"],
  consecutiveCubes: ["연속하는 세 수와 제곱합으로 세제곱 차 구하기", "세 수를 하나의 문자로 나타내어 조건으로 값을 구하고 세제곱의 차를 계산한다"],
  sumProductDifferenceSquare: ["두 수의 합과 곱으로 차의 제곱 구하기", "두 수의 차의 제곱을 합의 제곱에서 곱의 네 배를 뺀 식으로 바꾼다"],
  reciprocalSquareSum: ["수와 역수의 합으로 제곱합 구하기", "주어진 합을 제곱해 생기는 상수항을 이항한다"],
  scaledReciprocalSquare: ["계수가 다른 역수와의 합으로 제곱합 구하기", "주어진 식을 제곱해 목표 제곱합과 상수항으로 나눈다"],
  reciprocalCubeDifference: ["수와 역수의 차로 세제곱의 차 구하기", "세제곱의 차 공식을 주어진 일차식과 연결한다"],
  reciprocalTwoPartBlock: ["수와 역수의 차로 제곱합과 합의 제곱 구하는 묶음", "차를 제곱해 제곱합을 구하고 다시 상수를 더해 합의 제곱을 구한다"],
  reciprocalCubeSum: ["수와 역수의 합으로 세제곱 합 구하기", "세제곱 합을 일차합의 세제곱에서 일차합의 세 배를 뺀 식으로 계산한다"],
  reciprocalFourthSum: ["수와 역수의 차로 네제곱 합 구하기", "차의 제곱으로 제곱합을 구한 뒤 그 값을 다시 제곱하고 상수를 뺀다"],
  reciprocalFifthSum: ["수와 역수의 합으로 다섯제곱 합 구하기", "앞의 두 거듭제곱 합으로 다음 항을 만드는 관계를 다섯째 항까지 적용한다"],
  quadraticToScaledReciprocal: ["이차방정식을 계수 있는 역수의 합으로 바꾸어 계산하기", "이차방정식을 문자항으로 나누어 수와 계수 있는 역수의 합을 만든 뒤 제곱한다"],
  quadraticToReciprocal: ["이차방정식에서 수와 역수의 합을 얻어 식 계산하기", "이차방정식을 문자로 나누어 일차합을 구하고 목표식을 제곱합과 일차합으로 묶는다"],
  reciprocalEvenExpression: ["수와 역수의 합으로 여러 짝수 거듭제곱식 나타내기", "제곱합과 네제곱합을 차례로 만들어 목표 세 묶음을 같은 문자식으로 합친다"],
  cubicCycle: ["삼차 주기로 높은 거듭제곱과 역수 계산하기", "주어진 이차식에서 세제곱 주기를 얻고 지수를 주기의 나머지로 줄인다"],
  symmetricFraction: ["두 수의 합과 곱으로 분수식 값 구하기", "통분한 분자와 분모를 두 수의 합·곱·제곱합으로 바꾼다"],
  cubeFourthBlock: ["두 수의 합과 제곱합으로 세제곱 합과 네제곱 합 구하는 묶음", "두 수의 곱을 먼저 구한 뒤 세제곱 합 공식과 제곱합의 제곱을 각각 적용한다"],
  fifthPowerFromCube: ["두 수의 합과 세제곱 합으로 오제곱 합 구하기", "두 수의 곱을 구하고 앞의 두 거듭제곱 합으로 다음 합을 만드는 관계를 반복한다"],
  mixedSixth: ["두 수의 합과 세제곱 합으로 섞인 육차식 구하기", "목표식을 두 수의 곱과 네제곱 합의 곱으로 묶어 각각을 구한다"],
  shiftedProductCube: ["곱과 이동한 두 수의 곱으로 세제곱식 값 구하기", "이동한 두 수의 곱을 전개해 합을 구하고 목표식을 합과 제곱합의 곱으로 묶는다"],
  ratioFromCubeSum: ["합과 세제곱 합으로 두 비의 합 구하기", "세제곱 합에서 두 수의 곱을 구하고 비의 합을 제곱합 나누기 곱으로 바꾼다"],
  mixedLinearProducts: ["두 쌍의 합과 곱으로 섞인 두 일차식의 곱 구하기", "전개 후 각 쌍의 합·곱으로 계산할 수 있는 두 묶음으로 정리한다"],
  threeDifferenceSquares: ["세 수의 합과 두 수 곱의 합으로 차의 제곱합 구하기", "세 차의 제곱을 전개해 제곱합과 두 수 곱의 합으로 바꾼다"],
  reciprocalSquaresThree: ["세 수의 대칭 조건으로 역수 제곱의 합 구하기", "통분한 분자를 두 수 곱의 합의 제곱과 세 수의 합·곱으로 나타낸다"],
  shiftedTripleProduct: ["세 수를 각각 같은 수만큼 뺀 곱 계산하기", "세 일차식의 곱을 전개해 기본 대칭합에 주어진 값을 대입한다"],
  pairSumProduct: ["세 쌍의 합을 곱한 값 구하기", "세 쌍의 합의 곱을 세 수의 합과 두 수 곱의 합의 곱에서 세 수의 곱을 뺀 식으로 바꾼다"],
  reciprocalSumThree: ["세 수의 합과 제곱합으로 역수의 합 구하기", "두 수 곱의 합을 구한 뒤 세 수의 곱으로 나눈다"],
  symmetricFourPartBlock: ["세 수의 기본 대칭 조건으로 네 식의 값 구하는 묶음", "세 기본 대칭합으로 제곱합·세제곱합·두 수 곱의 제곱합·세 이차식의 곱을 차례로 나타낸다"],
  productAndReciprocalSquares: ["합·제곱합·역수합으로 세 수의 곱과 역수 제곱합 구하는 묶음", "두 수 곱의 합을 구해 세 수의 곱을 정하고 역수합의 제곱에서 교차항을 뺀다"]
});

const from = key => ({ detailType: T[key][0], solutionArchetype: T[key][1] });

const PAGE_RULES = {
  123: { 9: from("exponentLawCheck"), 10: from("numericLiteralExponent"), 11: from("primeFactorExponent"), 12: from("reciprocalPower"), 13: from("replaceKnownPower"), 14: from("factorPower"), 15: from("replaceKnownPower"), 16: from("quotientExponentEquation"), 17: from("factoredExponentEquation") },
  124: { 6: from("groupedExponentBlock"), 7: from("naturalExponentCondition"), 8: from("blankExponentCoefficient"), 9: from("negativeOneParity"), 10: from("signAndLikeTerms"), 11: from("signedExponentQuotient"), 12: from("decimalDigitCount"), 13: from("fractionDigitCount") },
  125: { 6: from("sameExponentRatio"), 7: from("linearExponentRelation"), 8: from("reciprocalBaseEquation"), 9: from("powerApproximation"), 10: from("powerApproximation"), 11: from("baseUnifyEquation"), 12: from("powerConditionFraction"), 13: from("cyclicExponentProduct") },
  126: { 1: from("monomialMixedBlock") },
  127: { 3: from("monomialIdentityCompare"), 4: from("monomialIdentityCompare"), 5: from("monomialIdentityCompare"), 6: from("missingMonomialBlock") },
  128: { 1: from("polynomialDivideBlock") },
  129: { 4: from("monomialParameterCompare"), 5: from("prismVolumeHeight"), 6: from("shadedRectangleArea"), 7: from("crossRoadArea"), 8: from("cornerTriangleArea") },
  130: { 3: from("isolateVariableBlock") },
  131: { 3: from("isolateLinearExpression"), 4: from("boxVolumeLength"), 5: from("coneSlantHeight"), 6: from("substituteMonomial"), 7: from("substituteFraction"), 8: from("ratioHomogeneous"), 9: from("ratioLinearToFraction") },
  132: { 3: from("crossMultiplyRatio"), 4: from("threeVariableRatio"), 5: from("linkedRatios"), 6: from("ratioPolynomial"), 7: from("reciprocalPairBlock"), 8: from("sumZeroCyclic"), 9: from("reciprocalSumZero"), 10: from("chainedFractions") },
  133: { 1: from("coefficientInProduct"), 2: from("coefficientInCube") },
  136: { 1: from("expansionFormulaBlock") },
  137: { 4: from("symmetricCubeBlock"), 5: from("squaredDifferenceIdentity"), 6: from("squaredDifferenceValue"), 7: from("cubeSumSymmetricData"), 8: from("groupedExpansionBlock") },
  138: { 4: from("quadraticProduct"), 5: from("poweredDifference"), 6: from("substituteThenExpand"), 7: from("deviationSquares") },
  139: { 7: from("remainderSquareDifference"), 8: from("nearbyProducts"), 9: from("largeNearbyFraction"), 10: from("telescopingSquares"), 11: from("missingTelescoping"), 12: from("factorGivenQuadratic"), 13: from("reducePolynomial"), 14: from("consecutiveCubes") },
  140: { 5: from("sumProductDifferenceSquare"), 6: from("reciprocalSquareSum"), 7: from("scaledReciprocalSquare"), 8: from("reciprocalCubeDifference"), 9: from("reciprocalTwoPartBlock"), 10: from("reciprocalCubeSum"), 11: from("reciprocalFourthSum"), 12: from("reciprocalFifthSum") },
  141: { 8: from("quadraticToScaledReciprocal"), 9: from("quadraticToReciprocal"), 10: from("reciprocalEvenExpression"), 11: from("cubicCycle"), 12: from("symmetricFraction"), 13: from("cubeFourthBlock"), 14: from("fifthPowerFromCube"), 15: from("mixedSixth") },
  142: { 6: from("shiftedProductCube"), 7: from("ratioFromCubeSum"), 8: from("mixedLinearProducts"), 9: from("threeDifferenceSquares"), 10: from("reciprocalSquaresThree"), 11: from("shiftedTripleProduct"), 12: from("pairSumProduct"), 13: from("reciprocalSumThree") },
  143: { 1: from("symmetricFourPartBlock"), 2: from("productAndReciprocalSquares") }
};

const DEFERRED = new Map([
  ["134:1", "57~60번의 여러 문제와 잘린 60번 영역이 한 후보에 섞여 있어 문제별 영역을 다시 만든 뒤 검수해야 함."],
  ["135:1", "60번의 뒤쪽 소문항만 포함하고 시작 경계가 잘려 있어 문제별 영역을 다시 만든 뒤 검수해야 함."]
]);

const SPLIT_RECOMMENDED = new Set([
  "124:6", "124:8", "126:1", "127:6", "128:1", "130:3", "132:7", "136:1",
  "137:4", "137:8", "140:9", "141:13", "143:1", "143:2"
]);

const CONTINUATION_GAPS = new Map([
  ["127:6", "128쪽의 30번 (5)~(8)이 별도 문항 영역 없이 이어짐."],
  ["128:1", "129쪽의 31번 (6)~(9)가 별도 문항 영역 없이 이어짐."],
  ["137:8", "138쪽의 66번 (6)~(8)이 별도 문항 영역 없이 이어짐."]
]);

function readJson(filePath) { return JSON.parse(fs.readFileSync(path.resolve(filePath), "utf8")); }

function jobsFromInput(input) {
  const source = Array.isArray(input.sources) && input.sources.find(entry => entry.sourceMemoryId === SOURCE_MEMORY_ID);
  if (source && Array.isArray(source.jobs)) return source.jobs;
  if (!Array.isArray(input.reviews)) throw new Error("황소수학 중2-1 작업 대기열 또는 통합 검수표를 찾지 못했습니다.");
  return input.reviews.filter(review => review.sourceMemoryId === SOURCE_MEMORY_ID).flatMap(review => {
    const locator = (review.evidence || []).map(value => String(value).match(/:PDF p\.(\d+), slot (\d+)$/)).find(Boolean);
    return locator ? [{ sourceItemId: review.sourceItemId, locator: { page: Number(locator[1]), slot: Number(locator[2]) } }] : [];
  });
}

function buildPacket(input) {
  const selected = jobsFromInput(input)
    .filter(job => Number(job.locator && job.locator.page) >= PAGE_START && Number(job.locator && job.locator.page) <= PAGE_END)
    .sort((left, right) => Number(left.locator.page) - Number(right.locator.page) || Number(left.locator.slot) - Number(right.locator.slot));
  const deferred = [];
  const itemReviews = [];

  selected.forEach(job => {
    const page = Number(job.locator.page);
    const slot = Number(job.locator.slot);
    const locatorKey = `${page}:${slot}`;
    if (DEFERRED.has(locatorKey)) {
      deferred.push({ sourceItemId: job.sourceItemId, evidenceLocator: `PDF p.${page}, slot ${slot}`, reason: DEFERRED.get(locatorKey) });
      return;
    }
    const matched = PAGE_RULES[page] && PAGE_RULES[page][slot];
    if (!matched) throw new Error(`시각 검수 규칙이 없는 문항입니다: PDF p.${page}, slot ${slot}, ${job.sourceItemId}`);
    const noteParts = ["원본 PDF의 해당 문항 영역을 직접 보고 문제 조건과 요구값을 확인함."];
    if (SPLIT_RECOMMENDED.has(locatorKey)) noteParts.push("한 영역에 답이 따로인 여러 소문항이 함께 있어 문항별 분할을 권장함.");
    if (CONTINUATION_GAPS.has(locatorKey)) noteParts.push(CONTINUATION_GAPS.get(locatorKey));
    itemReviews.push({
      sourceItemId: job.sourceItemId,
      detailType: matched.detailType,
      solutionArchetype: matched.solutionArchetype,
      classificationStatus: "reviewed_detail",
      detailPrecision: "verified",
      evidenceLocator: `PDF p.${page}, slot ${slot}`,
      note: noteParts.join(" ")
    });
  });

  return { schemaVersion: 1, sources: [{ sourceMemoryId: SOURCE_MEMORY_ID, title: SOURCE_TITLE, itemReviews }], deferred };
}

function main(args) {
  if (args.length !== 2) throw new Error("사용법: node build-hwangso-m21-d5-detail-packet.cjs <작업대기열.json> <출력.json>");
  const packet = buildPacket(readJson(args[0]));
  fs.mkdirSync(path.dirname(path.resolve(args[1])), { recursive: true });
  fs.writeFileSync(path.resolve(args[1]), `${JSON.stringify(packet, null, 2)}\n`, "utf8");
  process.stdout.write(`${JSON.stringify({ sourceMemoryId: SOURCE_MEMORY_ID, reviewedItemCount: packet.sources[0].itemReviews.length, deferredItemCount: packet.deferred.length, pageStart: PAGE_START, pageEnd: PAGE_END })}\n`);
}

if (require.main === module) main(process.argv.slice(2));
module.exports = Object.freeze({ SOURCE_MEMORY_ID, SOURCE_TITLE, PAGE_START, PAGE_END, PAGE_RULES, DEFERRED, SPLIT_RECOMMENDED, CONTINUATION_GAPS, jobsFromInput, buildPacket });
