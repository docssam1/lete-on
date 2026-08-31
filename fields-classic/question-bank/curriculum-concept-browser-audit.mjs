import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const runtimeModules = process.env.CODEX_NODE_MODULES
  || "C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules";
const { chromium } = await import(pathToFileURL(path.join(runtimeModules, "playwright", "index.mjs")).href);
const { getDocument } = await import(pathToFileURL(path.join(runtimeModules, "pdfjs-dist", "legacy", "build", "pdf.mjs")).href);
const baseUrl = process.env.FIELDS_BASE_URL || "http://127.0.0.1:8794";
const outputDir = process.env.CONCEPT_AUDIT_OUTPUT_DIR || "";
if (outputDir) fs.mkdirSync(outputDir, { recursive: true });
const pilotExpectations = Object.freeze({
  "shape-quarter-half-turn": Object.freeze([
    "도형이 돌아가는 중심을 먼저 표시합니다.",
    "반의 반 바퀴인지 반 바퀴인지, 어느 방향으로 도는지 확인합니다.",
    "각 꼭짓점을 중심에서 같은 거리로 같은 회전량만큼 옮긴 뒤 차례로 잇습니다."
  ]),
  "fold-cut-shape-choice": Object.freeze([
    "종이가 어느 선을 따라 겹쳐졌는지 먼저 표시합니다.",
    "접힌 상태의 자른 자리를 접은 선 반대쪽 같은 거리로 옮깁니다.",
    "원래 자리와 대칭 자리를 함께 그려 전체 모양을 확인합니다."
  ]),
  "circular-magic-line-sum": Object.freeze([
    "여러 줄에 함께 들어가는 가운데 수를 표시합니다.",
    "한 줄의 합에서 가운데 수를 빼 마주 보는 두 수의 합을 찾습니다.",
    "남은 수를 같은 합이 되는 짝으로 놓고 모든 줄을 다시 더합니다."
  ]),
  "person-item-logic": Object.freeze([
    "사람은 가로, 동물이나 음식은 세로에 놓아 조건을 한눈에 볼 수 있게 합니다.",
    "맞는 관계를 표시하고 같은 행과 열의 다른 가능성을 지웁니다.",
    "마지막 후보를 정한 뒤 처음부터 모든 조건에 다시 대입합니다."
  ]),
  "shape-mirror-direction": Object.freeze([
    "도형과 거울 사이의 선을 기준으로 어느 쪽에 비치는지 먼저 확인합니다.",
    "각 꼭짓점에서 거울선에 수직으로 가서 반대편 같은 거리의 점을 표시합니다.",
    "대응하는 점을 원래 순서대로 잇고 좌우 방향이 바뀌었는지 확인합니다."
  ]),
  "fold-number-cut-sum-textbook": Object.freeze([
    "접는 선과 화살표를 차례로 보고 어느 칸이 어느 쪽으로 이동하는지 표시합니다.",
    "접힌 종이에서 자른 자리와 겹치는 원래 번호 칸을 펼치는 순서의 반대로 모두 찾습니다.",
    "표시한 번호가 빠짐없이 잘린 칸인지 다시 확인한 뒤 그 수들만 더합니다."
  ]),
  "cross-shape-magic-sum": Object.freeze([
    "가로줄과 세로줄에 모두 들어가는 가운데 칸을 먼저 표시합니다.",
    "가운데 수를 제외하고 가로 양끝과 세로 양끝의 합이 같아지도록 수 카드를 짝지어 봅니다.",
    "카드를 놓은 뒤 가로줄과 세로줄을 각각 더해 두 합이 같은지 확인합니다."
  ]),
  "two-digit-condition": Object.freeze([
    "십의 자리 조건과 일의 자리 조건, 두 숫자의 합이나 차 조건을 따로 적습니다.",
    "십의 자리가 0이 아닌 숫자쌍 가운데 먼저 만족하는 조건에 맞는 후보를 모두 적습니다.",
    "남은 후보를 다른 조건에 하나씩 대입해 모두 만족하는 두 자리 수만 남깁니다."
  ]),
  "shape-flip-composition": Object.freeze([
    "화살표와 문장을 보고 먼저 할 뒤집기나 돌리기부터 번호를 붙입니다.",
    "첫 움직임으로 옮겨진 각 칸을 표시해 중간 모양을 완성합니다.",
    "중간 모양에 다음 움직임을 적용하고 칸 수와 연결이 그대로인지 확인합니다."
  ]),
  "digital-digit-transform": Object.freeze([
    "처음 숫자를 이루는 위·아래·양옆·가운데 막대를 빠짐없이 확인합니다.",
    "각 막대를 제자리 모양 그대로 주어진 방향으로 뒤집거나 돌립니다.",
    "움직인 뒤 켜진 막대의 위치를 보고 완성된 한 자리 숫자를 찾습니다."
  ]),
  "digital-two-digit-transform": Object.freeze([
    "십의 자리와 일의 자리 숫자를 이루는 막대를 각각 같은 움직임으로 옮깁니다.",
    "좌우 뒤집기나 반 바퀴 돌리기라면 왼쪽과 오른쪽 자리의 순서도 바뀌는지 확인합니다.",
    "움직인 숫자판을 바로 세워 왼쪽을 십의 자리, 오른쪽을 일의 자리로 읽습니다."
  ]),
  "t-shape-magic-sum": Object.freeze([
    "가로줄과 세로줄에 모두 들어가는 T자의 꺾이는 칸을 표시합니다.",
    "공통 칸을 제외한 가로 두 칸과 세로 두 칸의 합이 같도록 수 카드를 두 쌍으로 나눕니다.",
    "카드를 놓은 뒤 가로 세 수와 세로 세 수를 각각 더해 두 합이 같은지 확인합니다."
  ]),
  "gakuro-card-rectangle-placement": Object.freeze([
    "주어진 수 카드를 한 번씩만 쓰도록 사용 전 목록을 적고 놓은 카드는 지웁니다.",
    "빈칸이 적거나 가능한 두 수가 바로 정해지는 가로줄부터 합에 맞게 채웁니다.",
    "놓은 수가 세로 합에도 맞는지 확인하고 남은 카드를 다음 칸에 넣습니다."
  ]),
  "gakuro-grid-sum": Object.freeze([
    "주어진 범위의 서로 다른 여섯 수를 적어 각 수를 한 번씩 쓸 준비를 합니다.",
    "한 칸에 들어갈 수를 그 칸의 가로 합과 세로 합을 모두 만족하는 후보로 좁힙니다.",
    "모든 줄의 합과 여섯 수의 중복 여부를 처음부터 다시 확인합니다."
  ]),
  "gakuro-grid-nine-sum": Object.freeze([
    "주어진 서로 다른 아홉 수를 적고 격자에 놓을 때마다 사용 표시를 합니다.",
    "이미 수가 많이 보이는 가로줄이나 세로줄에서 목표 합에 부족한 수를 먼저 찾습니다.",
    "아홉 칸을 채운 뒤 각 수를 한 번씩 썼는지와 모든 줄의 합을 차례로 검산합니다."
  ]),
  "three-digit-step-sequence": Object.freeze([
    "연달아 보이는 두 수에서 뒤 수와 앞 수의 차를 계산합니다.",
    "다른 이웃한 수도 같은 만큼 커지거나 작아지는지 확인해 규칙을 정합니다.",
    "앞뒤에서 같은 수만큼 더하거나 빼 빈칸의 수를 채우고 다시 차를 확인합니다."
  ]),
  "two-digit-even-ones-greater-gap": Object.freeze([
    "두 자리 짝수의 일의 자리에는 0, 2, 4, 6, 8만 올 수 있음을 먼저 사용합니다.",
    "일의 자리에서 십의 자리를 뺀 값이 주어진 차와 같은 숫자쌍을 찾습니다.",
    "만든 두 자리 수가 주어진 범위와 나머지 조건을 모두 만족하는지 확인합니다."
  ]),
  "equal-partition-two": Object.freeze([
    "맨 위의 전체 수와 아래로 갈라지는 두 빈칸을 확인합니다.",
    "두 빈칸에 같은 수를 넣어 더했을 때 전체가 되는 수를 찾습니다.",
    "찾은 수를 두 번 더해 처음 전체 수가 되는지 확인합니다."
  ]),
  "equal-partition-four": Object.freeze([
    "전체 수를 같은 두 수로 나누어 가운데 두 칸을 채웁니다.",
    "가운데의 한 수를 다시 반으로 나누어 맨 아래 네 칸을 같은 수로 채웁니다.",
    "맨 아래 같은 네 수를 모두 더해 처음 전체와 같은지 확인합니다."
  ]),
  "equal-partition-three": Object.freeze([
    "전체 수에서 같은 크기의 세 갈래로 나뉘는 모양을 확인합니다.",
    "같은 수를 세 번 더했을 때 전체가 되는 수를 찾습니다.",
    "세 빈칸의 수가 모두 같고 합이 처음 전체인지 확인합니다."
  ]),
  "shape-sum-table": Object.freeze([
    "한 종류의 도형이 반복되어 값이 바로 정해지는 가로줄이나 세로줄부터 찾습니다.",
    "알아낸 도형값을 다른 줄의 같은 도형 자리에 바꾸어 넣어 다음 도형값을 구합니다.",
    "구한 도형값으로 모든 가로 합과 세로 합이 표시된 수와 맞는지 확인합니다."
  ]),
  "equalize-transfer": Object.freeze([
    "많이 가진 수에서 적게 가진 수를 빼 처음 차이를 구합니다.",
    "한 개를 옮길 때 차이가 두 개 줄어드므로 처음 차이를 같은 두 수로 가릅니다.",
    "큰 수에서는 옮긴 수를 빼고 작은 수에는 더해 두 결과가 같은지 확인합니다."
  ]),
  "total-difference": Object.freeze([
    "전체 수에서 큰 수가 더 가진 차이만큼을 먼저 빼냅니다.",
    "차이를 뺀 나머지는 두 수의 같은 부분이므로 똑같이 둘로 가릅니다.",
    "작은 수에 차이를 더해 큰 수를 만들고 합과 차를 모두 다시 확인합니다."
  ]),
  "balance-order-chain": Object.freeze([
    "각 저울에서 더 아래로 내려간 접시의 물건을 더 무겁다고 기록합니다.",
    "서로 다른 저울에 함께 나온 물건을 기준으로 무겁고 가벼운 관계를 연결합니다.",
    "만든 순서를 각 저울에 다시 대입해 어느 관계도 거꾸로 되지 않는지 확인합니다."
  ]),
  "distinct-shape-value-equation": Object.freeze([
    "한 도형이 여러 번 더해진 식에서 그 도형 하나의 값을 먼저 구합니다.",
    "이미 구한 도형을 수로 바꾸어 쓰고 새 도형의 값을 차례로 찾습니다.",
    "모든 식이 맞는지와 서로 다른 도형의 값이 겹치지 않는지 함께 확인합니다."
  ]),
  "repeating-number-sequence": Object.freeze([
    "수열의 처음 수가 같은 순서로 다시 나타나는 위치를 표시합니다.",
    "되풀이되는 수들을 필요 이상 길지 않은 가장 짧은 묶음으로 정합니다.",
    "반복마디를 처음부터 차례로 이어 빈칸 위치의 수를 찾습니다."
  ]),
  "repeating-symbol-sequence": Object.freeze([
    "그림마다 모양, 색, 개수가 어떤 순서로 변하는지 각각 한 줄로 적습니다.",
    "각 반복마디가 처음 상태로 함께 돌아오는 위치를 찾아 하나의 큰 마디로 묶습니다.",
    "다음 위치의 모양과 색 또는 개수를 각각 찾은 뒤 한 그림으로 합칩니다."
  ]),
  "matchstick-shared-polygon-growth": Object.freeze([
    "다각형 하나를 만드는 데 필요한 성냥개비 수를 빠짐없이 셉니다.",
    "맞닿아 함께 쓰는 변을 제외하고 새 다각형에서 추가되는 변만 셉니다.",
    "첫 모양에서 시작해 추가되는 수를 필요한 횟수만큼 더하고 작은 단계로 검산합니다."
  ]),
  "triangular-stone-growth": Object.freeze([
    "해당 단계에서 위부터 각 줄에 놓인 바둑돌 수를 차례로 적습니다.",
    "줄마다 검은 돌과 흰 돌을 구분해 각각의 개수를 모두 더합니다.",
    "더 많은 색의 수에서 적은 색의 수를 빼고 두 색의 합이 전체와 같은지도 확인합니다."
  ]),
  "square-border-stone-growth": Object.freeze([
    "단계가 커질 때 한 변에 놓이는 바둑돌 수가 어떻게 늘어나는지 확인합니다.",
    "모서리를 한 번씩만 세어 테두리 돌 수를 구하고 안쪽 정사각형의 돌을 따로 셉니다.",
    "테두리와 안쪽의 색별 개수를 비교하고 둘을 더해 전체 칸 수와 같은지 확인합니다."
  ]),
  "four-number-center-rule": Object.freeze([
    "앞의 그림마다 바깥 네 수와 가운데 수가 어떻게 연결되는지 계산을 여러 가지로 시도합니다.",
    "한 그림에만 맞는 계산은 지우고 모든 완성 그림에 같은 순서로 맞는 계산을 남깁니다.",
    "정한 계산 순서에 마지막 바깥 네 수를 넣어 가운데 수를 구하고 보기에도 다시 적용합니다."
  ]),
  "number-grid-row-rule": Object.freeze([
    "답이 보이는 줄에서 앞의 수들을 더하거나 빼 마지막 수가 되는 계산을 찾아봅니다.",
    "둘 이상의 줄에 같은 계산 순서를 적용해 우연히 맞는 다른 규칙을 지웁니다.",
    "남은 한 계산 순서를 마지막 줄에 적용해 빈칸의 수를 구하고 전체 줄을 검산합니다."
  ]),
  "two-digit-compose-rule": Object.freeze([
    "그림의 순서를 읽어 앞 숫자는 십의 자리, 뒤 숫자는 일의 자리에 놓습니다.",
    "완성된 보기에서 두 자리 수끼리 더하는지 빼는지와 계산 순서를 확인합니다.",
    "마지막 그림의 두 자리 수를 정확히 적고 같은 계산을 한 뒤 자리별로 검산합니다."
  ]),
  "sudoku-three-row-column": Object.freeze([
    "빈칸마다 들어갈 수 있는 1, 2, 3을 준비하고 같은 줄에 이미 있는 수를 지웁니다.",
    "가로줄에서 남은 후보와 세로줄에서 남은 후보가 같은 한 수인 칸부터 채웁니다.",
    "표를 채운 뒤 각 가로줄과 세로줄에 1, 2, 3이 한 번씩 있는지 확인합니다."
  ]),
  "sudoku-four-square-region": Object.freeze([
    "빈칸마다 1, 2, 3, 4 가운데 가로줄과 세로줄에 없는 수를 남깁니다.",
    "가로·세로 후보 가운데 같은 굵은 영역에 이미 있는 수를 지워 한 칸의 수를 정합니다.",
    "각 가로줄, 세로줄, 2×2 굵은 영역에 1부터 4까지 한 번씩 있는지 확인합니다."
  ]),
  "tangram-shape-composition": Object.freeze([
    "각 조각의 변과 꼭짓점을 보고 어느 조각이 빈 모양의 어느 부분에 맞을지 확인합니다.",
    "조각의 크기는 바꾸지 않고 돌리거나 뒤집어 바깥선과 맞닿는 변을 맞춥니다.",
    "모든 조각을 사용했는지, 서로 겹치지 않는지, 바깥선 안에 빈틈없이 들어갔는지 검산합니다."
  ]),
  "unit-grid-area": Object.freeze([
    "격자에서 같은 크기의 정사각형 한 칸이 무엇인지 확인하고 도형 안에 들어간 칸을 표시합니다.",
    "온전히 들어간 칸을 먼저 세고 잘린 부분은 서로 합쳐 한 칸이 되는지 살펴봅니다.",
    "센 칸의 넓이를 모두 더해 도형의 넓이를 구하고 다른 도형도 같은 단위로 비교합니다."
  ]),
  "equal-part-shaded-fraction": Object.freeze([
    "도형 전체가 몇 개의 같은 크기 부분으로 나뉘었는지 먼저 셉니다.",
    "전체와 같은 단위로 색칠된 부분의 수를 세어 분자에 해당하는 수를 정합니다.",
    "전체 부분 수를 아래에, 색칠한 부분 수를 위에 써서 분수로 나타내고 그림과 다시 대조합니다."
  ]),
  "equal-partition-drawing": Object.freeze([
    "경계선 안의 전체 도형과 몇 부분으로 나누어야 하는지 확인합니다.",
    "도형 안에서 각 부분이 같은 넓이가 되도록 경계선을 긋고 한 부분의 크기를 비교합니다.",
    "선을 따라 나뉜 부분이 서로 겹치지 않고 전체를 덮으며 모든 부분의 넓이가 같은지 확인합니다."
  ]),
  "folded-strip-length": Object.freeze([
    "모눈 위에서 띠의 방향이 바뀌는 점을 찾아 가로 구간과 세로 구간으로 나눕니다.",
    "구간마다 지나간 모눈 칸 수를 세고, 같은 자리를 다시 지나더라도 띠의 서로 다른 구간이면 각각 기록합니다.",
    "처음부터 끝까지 기록한 구간 길이를 모두 더하고 꺾인 구간을 빠뜨리지 않았는지 다시 따라갑니다."
  ]),
  "midpoint-number-line": Object.freeze([
    "두 점의 수를 확인하고 양 끝 사이가 몇 칸인지 셉니다.",
    "큰 수와 작은 수의 차이를 구한 뒤 그 차이를 반으로 나누어 가운데까지의 거리를 찾습니다.",
    "작은 끝 수에 가운데까지의 거리를 더하고 큰 끝 수에서 같은 거리를 빼 두 계산이 같은지 확인합니다."
  ]),
  "equal-interval-length": Object.freeze([
    "양 끝 점이 아니라 그 사이에 있는 같은 간격의 개수를 정확히 셉니다.",
    "두 점의 전체 길이를 같은 간격 수로 나누어 한 간격의 길이를 구합니다.",
    "한 간격의 길이를 필요한 횟수만큼 더해 처음의 끝점과 다른 끝점이 맞는지 검산합니다."
  ]),
  "walking-step-ratio": Object.freeze([
    "한 아이의 한 걸음 동안 다른 대상이 몇 걸음을 걷는지 배수 관계를 그림이나 식으로 나타냅니다.",
    "짧은 걸음 묶음을 아이의 걸음 수만큼 반복해 전체 걸음 수를 구합니다.",
    "긴 걸음 수와 배수를 곱한 값이 짧은 걸음 수인지 확인하고 두 쪽의 이동 거리가 같은지 검산합니다."
  ]),
  "route-distance-multiple": Object.freeze([
    "집과 중간 장소와 도착 장소가 한 길 위에서 어떤 순서인지 표시합니다.",
    "집에서 도착 장소까지의 전체 거리에서 집에서 중간 장소까지의 거리를 빼 나머지 구간을 구합니다.",
    "나머지 구간을 첫 구간의 같은 단위 묶음으로 나누고 더해서 전체 거리로 돌아오는지 검산합니다."
  ]),
  "rod-ratio-total-book3": Object.freeze([
    "㉠과 ㉡을 이루는 같은 길이 칸의 수를 각각 세고 두 칸 수를 더합니다.",
    "두 막대의 전체 길이를 모든 칸 수로 똑같이 나누어 한 칸의 길이를 구합니다.",
    "한 칸 길이에 각 막대의 칸 수를 곱하고 두 길이의 합이 주어진 전체 길이인지 확인합니다."
  ]),
  "cryptarithm-repeated-number-double": Object.freeze([
    "각 기호가 십의 자리인지 일의 자리인지 확인하고 수를 세로로 맞춥니다.",
    "여러 자리에 반복된 기호를 하나의 같은 숫자로 두고 식을 자리별로 살펴봅니다.",
    "일의 자리부터 계산해 결과의 각 자리와 맞는지, 필요한 받아올림이 있는지 확인합니다."
  ]),
  "cryptarithm-fixed-digit-addition": Object.freeze([
    "문제에서 이미 알려 준 숫자를 해당 자리에 적고 같은 기호가 반복되는 위치를 표시합니다.",
    "일의 자리 합을 계산하고 결과의 일의 자리와 받아올림을 확인합니다.",
    "십의 자리와 그다음 자리에서 받아올림을 더해 결과와 일치하는지 끝까지 검산합니다."
  ]),
  "cryptarithm-multi-symbol-carry": Object.freeze([
    "기호마다 가능한 숫자를 적고 같은 기호의 반복, 서로 다른 기호의 중복 금지 조건을 표시합니다.",
    "일의 자리부터 각 열의 합을 계산하고 결과 숫자와 다음 열로 넘어가는 받아올림을 함께 기록합니다.",
    "정한 숫자를 전체 세로식에 넣어 각 열의 합과 마지막 받아올림이 모두 맞는지 확인합니다."
  ]),
  "binary-weight-selection": Object.freeze([
    "카드가 어떤 값에서 시작해 다음 카드마다 어떻게 커지는지 순서대로 확인합니다.",
    "목표 수에서 큰 카드부터 빼 보며 남은 수가 다음 카드값으로 만들 수 있는지 확인합니다.",
    "선택한 카드만 한 번씩 더해 목표 수가 되는지, 선택하지 않은 카드가 섞이지 않았는지 검산합니다."
  ]),
  "colored-cell-number-code": Object.freeze([
    "한 칸씩 색칠된 보기와 두 칸이 색칠된 보기를 비교해 오른쪽부터 각 열의 값이 어떻게 커지는지 찾습니다.",
    "색칠된 칸마다 그 열의 값을 적고 같은 열에 여러 칸이 있으면 각각 한 번씩 더합니다.",
    "구한 합으로 색칠 그림의 수를 읽고, 목표 수가 주어지면 필요한 열의 값을 골라 같은 규칙으로 색칠합니다."
  ]),
  "magic-square-three-target": Object.freeze([
    "3×3 표에서 세 칸씩 이어지는 가로줄, 세로줄, 대각선을 빠짐없이 표시합니다.",
    "수가 모두 보이는 줄을 더해 공통 목표 합을 정하고 다른 줄에도 같은 값이 적용되는지 확인합니다.",
    "빈칸에 들어갈 수를 줄의 목표 합으로 좁힌 뒤 세 방향의 모든 줄이 같은 합인지 확인합니다."
  ])
});
const book2PilotIds = new Set([
  "equal-partition-two", "equal-partition-four", "equal-partition-three", "shape-sum-table",
  "equalize-transfer", "total-difference", "balance-order-chain", "distinct-shape-value-equation",
  "repeating-number-sequence", "repeating-symbol-sequence", "matchstick-shared-polygon-growth",
  "triangular-stone-growth", "square-border-stone-growth", "four-number-center-rule",
  "number-grid-row-rule", "two-digit-compose-rule", "sudoku-three-row-column", "sudoku-four-square-region"
]);
const book3PilotIds = new Set([
  "tangram-shape-composition", "unit-grid-area", "equal-part-shaded-fraction", "equal-partition-drawing",
  "folded-strip-length", "midpoint-number-line", "equal-interval-length", "walking-step-ratio",
  "route-distance-multiple", "rod-ratio-total-book3", "cryptarithm-repeated-number-double",
  "cryptarithm-fixed-digit-addition", "cryptarithm-multi-symbol-carry", "binary-weight-selection",
  "colored-cell-number-code", "magic-square-three-target"
]);
const lockedBook3TypeIds = new Set(["magic-square-three-complete"]);
for (const typeId of lockedBook3TypeIds) {
  assert.equal(Object.prototype.hasOwnProperty.call(pilotExpectations, typeId), false,
    `locked Book 3 type must not be included: ${typeId}`);
}
for (const typeId of book3PilotIds) {
  assert.equal(lockedBook3TypeIds.has(typeId), false, `locked Book 3 type mapped as pilot: ${typeId}`);
}
const expectedOfflineError = (message) => message.includes("ERR_NETWORK_ACCESS_DENIED");

async function openPilot(page, typeId, label) {
  const errors = [];
  page.on("console", (message) => {
    if (message.type() === "error" && !expectedOfflineError(message.text())) errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(`${baseUrl}/fields-classic/question-bank/?student=CONCEPT-AUDIT&mode=curriculum`, { waitUntil: "networkidle" });
  const bookId = book3PilotIds.has(typeId) ? "book-03"
    : book2PilotIds.has(typeId) ? "book-02" : "book-01";
  await page.locator(`#curriculumTree button[data-curriculum-book="${bookId}"]`).click();
  await page.locator('#curriculumStageChoices button[data-stage="concept"]').click();
  const pilot = page.locator(
    `#curriculumTree label[data-preview-type="${typeId}"]:has(input[data-curriculum-key^="${bookId}:"])`
  );
  assert.equal(await pilot.count(), 1, `${label}: ${typeId} pilot type missing`);
  if (!(await pilot.isVisible())) {
    await pilot.evaluate((element) => {
      for (let ancestor = element.parentElement; ancestor; ancestor = ancestor.parentElement) {
        if (ancestor instanceof HTMLDetailsElement) ancestor.open = true;
      }
    });
    await page.waitForTimeout(50);
  }
  await pilot.scrollIntoViewIfNeeded();
  return { errors, pilot };
}

async function assertPreview(page, pilot, expectedBeats, trigger, label) {
  if (trigger === "hover") await pilot.hover();
  else {
    const targetInput = pilot.locator("input");
    const tabInputs = page.locator('#curriculumTree input[data-curriculum-key]:not([disabled])');
    const targetIndex = await targetInput.evaluate((target) => [...document.querySelectorAll('#curriculumTree input[data-curriculum-key]:not([disabled])')].indexOf(target));
    assert.ok(targetIndex > 0, `${label}: target has no previous keyboard stop`);
    await tabInputs.nth(targetIndex - 1).focus();
    await page.keyboard.press("Tab");
    assert.equal(await targetInput.evaluate((target) => document.activeElement === target), true, `${label}: Tab did not reach the target input`);
  }
  const preview = page.locator("#typePreview:not([hidden])");
  await preview.waitFor();
  assert.equal(await preview.locator(".textbook-concept-tutorial.source-backed").count(), 1, `${label}: source-backed preview class missing`);
  assert.equal(await preview.locator(".textbook-concept-tutorial header span").innerText(), "개념 익히기", `${label}: source-backed heading changed`);
  assert.deepEqual(await preview.locator(".textbook-concept-tutorial li p").allInnerTexts(), expectedBeats, `${label}: preview beat text changed`);
  assert.equal(await preview.locator("text=개념 찾기").count(), 0, `${label}: generic filler returned`);
  assert.equal(await preview.locator("text=답 확인").count(), 0, `${label}: answer filler returned`);
}

async function buildPilotWorksheet(page, pilot, expectedBeats, label, count = 1) {
  await pilot.locator("input").check();
  await page.locator("#questionCount").fill(String(count));
  await page.locator("#questionCount").dispatchEvent("input");
  await page.locator("#buildButton").click();
  assert.equal(await page.locator(".question-card").count(), count, `${label}: pilot question count mismatch`);
  assert.equal(await page.locator("#typePreview[hidden]").count(), 1, `${label}: preview remained over worksheet`);
  const tutorial = page.locator("#questionGrid .textbook-concept-tutorial.source-backed");
  assert.equal(await tutorial.count(), count, `${label}: worksheet source-backed tutorial count mismatch`);
  assert.equal(await tutorial.first().locator("header span").innerText(), "개념 익히기", `${label}: worksheet heading changed`);
  assert.deepEqual(await tutorial.first().locator("li p").allInnerTexts(), expectedBeats, `${label}: worksheet beat text changed`);
  assert.equal(await page.locator(".concept-worked-solution").count(), count, `${label}: configured worked solution disclosure count mismatch`);
  assert.equal(await page.locator(".concept-worked-solution[open]").count(), 0, `${label}: worked solution must remain collapsed`);
  assert.equal(await page.locator(".answer-text").count(), 0, `${label}: answer text exposed`);
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1), false, `${label}: horizontal overflow`);
}

async function assertPrintableCards(page, typeId) {
  const scrollY = await page.evaluate(() => window.scrollY);
  assert.equal(scrollY, 0, `${typeId} print: worksheet did not return to the page top`);
  const worksheetHead = await page.locator(".worksheet-head").boundingBox();
  assert.ok(worksheetHead && worksheetHead.y >= -1, `${typeId} print: worksheet heading is clipped above the page`);
  const worksheetBox = await page.locator("#worksheetSection").boundingBox();
  assert.ok(worksheetBox && worksheetBox.width >= 793 && worksheetBox.width <= 795,
    `${typeId} print: worksheet width ${worksheetBox?.width || 0}px is not A4 width`);
  assert.ok(worksheetBox && worksheetBox.y + worksheetBox.height <= 1124,
    `${typeId} print: worksheet height ${worksheetBox?.height || 0}px exceeds one A4 page`);
  const cards = page.locator("#questionGrid .question-card");
  const boxes = await cards.evaluateAll((elements) => elements.map((element) => {
    const rect = element.getBoundingClientRect();
    const visibleChildren = [...element.children].filter((child) => {
      const childRect = child.getBoundingClientRect();
      return getComputedStyle(child).display !== "none" && childRect.height > 0;
    });
    return {
      top: rect.top,
      bottom: rect.bottom,
      clientHeight: element.clientHeight,
      scrollHeight: element.scrollHeight,
      clientWidth: element.clientWidth,
      scrollWidth: element.scrollWidth,
      lastVisibleBottom: Math.max(...visibleChildren.map((child) => child.getBoundingClientRect().bottom))
    };
  }));
  assert.equal(boxes.length, 2, `${typeId} print: expected two card boxes`);
  assert.ok(boxes[0].top >= worksheetHead.y + worksheetHead.height - 1, `${typeId} print: first card overlaps or precedes the worksheet heading`);
  for (const [index, box] of boxes.entries()) {
    assert.ok(box.scrollHeight <= box.clientHeight + 1, `${typeId} print: card ${index + 1} content is vertically clipped`);
    assert.ok(box.scrollWidth <= box.clientWidth + 1, `${typeId} print: card ${index + 1} content is horizontally clipped`);
    assert.ok(box.lastVisibleBottom <= box.bottom + 1, `${typeId} print: card ${index + 1} last visible block crosses its border`);
  }
  assert.ok(boxes[0].bottom <= boxes[1].top + 1, `${typeId} print: question cards overlap`);
  for (const card of await cards.all()) {
    const requiredBlocks = card.locator(".textbook-concept-tutorial,.question-prompt,.visual,.answer-line,.drawing-answer-note");
    assert.equal(await requiredBlocks.count(), 4, `${typeId} print: required instructional or response block missing`);
    const cardBox = await card.boundingBox();
    for (const block of await requiredBlocks.all()) {
      assert.equal(await block.isVisible(), true, `${typeId} print: required block is hidden`);
      const blockBox = await block.boundingBox();
      assert.ok(blockBox.x >= cardBox.x - 1 && blockBox.y >= cardBox.y - 1
        && blockBox.x + blockBox.width <= cardBox.x + cardBox.width + 1
        && blockBox.y + blockBox.height <= cardBox.y + cardBox.height + 1, `${typeId} print: required block crosses its card`);
    }
  }
}

async function inspectPrintedPdf(pdf, typeId) {
  const document = await getDocument({ data: new Uint8Array(pdf) }).promise;
  try {
    assert.equal(document.numPages, 1, `${typeId} print: two concept questions should fit on one A4 page, got ${document.numPages}`);
    const page = await document.getPage(1);
    const viewport = page.getViewport({ scale: 1 });
    const content = await page.getTextContent();
    const normalizedText = content.items.map((item) => item.str).join("").replace(/\s+/g, "");
    assert.ok(normalizedText.includes("필즈더클래식단원학습지"), `${typeId} print: worksheet title is missing from the rendered PDF`);
    const title = content.items.find((item) => item.str.includes("필즈"));
    const firstNumber = content.items.find((item) => item.str === "01");
    const secondNumber = content.items.find((item) => item.str === "02");
    for (const [label, item] of [["worksheet title", title], ["question 01", firstNumber], ["question 02", secondNumber]]) {
      assert.ok(item, `${typeId} print: ${label} is missing from the rendered PDF`);
      const y = item.transform[5];
      assert.ok(y >= 0 && y <= viewport.height, `${typeId} print: ${label} is outside the A4 page`);
    }
    return document.numPages;
  } finally {
    await document.destroy();
  }
}

const browser = await chromium.launch({ headless: true });
try {
  const printPageCounts = [];
  for (const [typeId, expectedBeats] of Object.entries(pilotExpectations)) {
    console.log(`CURRICULUM_CONCEPT_BROWSER_CHECK ${typeId}`);
    const desktop = await browser.newPage({ viewport: { width: 1440, height: 1050 } });
    const desktopContext = await openPilot(desktop, typeId, `desktop ${typeId}`);
    if (typeId === "shape-quarter-half-turn") {
      await assertPreview(desktop, desktopContext.pilot, expectedBeats, "hover", "desktop hover");
      await desktop.keyboard.press("Escape");
      const principleOnly = desktop.locator('#curriculumTree [data-preview-type="rotational-partition-two"]');
      assert.equal(await principleOnly.count(), 1, "desktop: principle-only comparison type missing");
      await principleOnly.hover();
      const principlePreview = desktop.locator("#typePreview:not([hidden])");
      await principlePreview.waitFor();
      assert.equal(await principlePreview.locator(".textbook-concept-tutorial.principle-only").count(), 1, "desktop: principle-only preview class missing");
      assert.equal(await principlePreview.locator(".textbook-concept-tutorial header span").innerText(), "풀이 원리", "desktop: principle-only heading changed");
      assert.equal(await principlePreview.locator(".textbook-concept-tutorial li").count(), 1, "desktop: principle-only preview should have one row");
      assert.equal(await principlePreview.locator(".textbook-concept-tutorial li strong").innerText(), "핵심 방법", "desktop: principle-only label changed");
    }
    const previewTrigger = typeId === "shape-quarter-half-turn" ? "focus" : "hover";
    await assertPreview(desktop, desktopContext.pilot, expectedBeats, previewTrigger, `desktop ${previewTrigger} ${typeId}`);
    await buildPilotWorksheet(desktop, desktopContext.pilot, expectedBeats, `desktop ${typeId}`, 2);
    await desktop.emulateMedia({ media: "print" });
    await desktop.evaluate(() => window.scrollTo(0, 0));
    const printedTutorial = desktop.locator("#questionGrid .textbook-concept-tutorial.source-backed");
    assert.equal(await printedTutorial.locator("li").count(), 6, `${typeId} print: all beats must remain in the DOM`);
    for (const line of await printedTutorial.locator("li").all()) {
      assert.equal(await line.isVisible(), true, `${typeId} print: a source-backed beat is hidden`);
    }
    for (const solution of await desktop.locator(".concept-worked-solution").all()) {
      assert.equal(await solution.isVisible(), false, `${typeId} print: worked solution disclosure must stay off the worksheet`);
    }
    await assertPrintableCards(desktop, typeId);
    const pdf = await desktop.pdf({ format: "A4", printBackground: true });
    if (outputDir) fs.writeFileSync(path.join(outputDir, `${typeId}.pdf`), pdf);
    const printPages = await inspectPrintedPdf(pdf, typeId);
    printPageCounts.push(printPages);
    assert.deepEqual(desktopContext.errors, [], `${typeId} desktop: browser errors ${desktopContext.errors.join(" | ")}`);
    await desktop.close();

    const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
    const mobileContext = await openPilot(mobile, typeId, `mobile ${typeId}`);
    await buildPilotWorksheet(mobile, mobileContext.pilot, expectedBeats, `mobile ${typeId}`);
    assert.deepEqual(mobileContext.errors, [], `${typeId} mobile: browser errors ${mobileContext.errors.join(" | ")}`);
    await mobile.close();
  }
  console.log(`CURRICULUM_CONCEPT_BROWSER_OK pilots=${Object.keys(pilotExpectations).length} beats=3 printPages=${printPageCounts.join(",")} desktop-focus desktop-hover mobile`);
} finally {
  await browser.close();
}
