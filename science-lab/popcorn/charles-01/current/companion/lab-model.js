/** Qualitative classroom model: distances are a slider, never physical units. */
export const DEFAULT_LAB_STATE = Object.freeze({
  mode: 'feeding', assemblyStage: 10, pole1: 'N', pole2: 'S',
  upperPole: 'N', lowerPole: 'N', food: 'fish', distance: 0.72,
  material: 'steel', showPoles: true, pairKind: 'bar-disc',
  magnetType: 'bar', clipPosition: 'north', hingeBlocked: false,
  labelsSwapped: false, pouchOpen: true,
});

const modes = new Set(['kit', 'clips', 'pairs', 'assembly', 'feeding']);
const pole = value => value === 'S' ? 'S' : 'N';
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export function normalizeLabState(input = {}) {
  const state = { ...DEFAULT_LAB_STATE, ...input };
  state.mode = modes.has(state.mode) ? state.mode : DEFAULT_LAB_STATE.mode;
  state.assemblyStage = clamp(Math.round(Number.isFinite(Number(state.assemblyStage)) ? Number(state.assemblyStage) : 10), 0, 10);
  state.distance = clamp(Number.isFinite(Number(state.distance)) ? Number(state.distance) : 0.72, 0, 1);
  for (const name of ['pole1', 'pole2', 'upperPole', 'lowerPole']) state[name] = pole(state[name]);
  state.food = state.food === 'carrot' ? 'carrot' : 'fish';
  state.foodPole = input.foodPole === 'N' || input.foodPole === 'S' ? input.foodPole : state.food === 'fish' ? 'S' : 'N';
  state.hingeBlocked = Boolean(state.hingeBlocked);
  state.labelsSwapped = Boolean(state.labelsSwapped);
  state.pouchOpen = Boolean(state.pouchOpen);
  state.material = ['steel', 'wood', 'plastic'].includes(state.material) ? state.material : 'steel';
  state.pairKind = state.pairKind === 'disc-disc' ? 'disc-disc' : 'bar-disc';
  state.magnetType = state.magnetType === 'disc' ? 'disc' : 'bar';
  state.clipPosition = ['north', 'middle', 'south'].includes(state.clipPosition) ? state.clipPosition : 'north';
  state.showPoles = Boolean(state.showPoles);
  return state;
}

export function deriveOutcome(input = {}) {
  const state = normalizeLabState(input);
  const stage = state.assemblyStage;
  const present = [
    ['lowerTemplate', 1, 1], ['tape', 1, 10], ['lowerJaw', 2, 10], ['teeth', 2, 10],
    ['upperBody', 3, 10], ['legs', 3, 10], ['hinge', 3, 10], ['bodyBase', 4, 10],
    ['tail', 5, 10], ['upperMagnet', 6, 10], ['lowerMagnet', 6, 10],
    ['foodBox', 7, 10], ['barMagnet', 8, 10], ['fish', 9, 10], ['carrot', 9, 10],
  ].filter(([, first, last]) => stage >= first && stage <= last).map(([name]) => name);
  const currentParts = [[], ['lowerTemplate', 'tape'], ['lowerJaw', 'teeth'],
    ['upperBody', 'legs', 'hinge'], ['bodyBase'], ['tail'], ['upperMagnet', 'lowerMagnet'],
    ['foodBox'], ['barMagnet'], ['fish', 'carrot'], ['fish', 'upperMagnet', 'lowerMagnet']][stage];
  const same = state.pole1 === state.pole2;
  const proximity = 1 - state.distance;
  // This easing shows a gradual qualitative change, not a calibrated force law.
  const influence = proximity * proximity * (3 - 2 * proximity);
  const foodPole = state.foodPole;
  const jawsSame = state.upperPole === state.lowerPole;
  const jawMagnets = stage >= 6;
  const foodReady = stage >= 9;
  const baseline = jawMagnets ? (jawsSame ? 0.56 : 0.035) : 0.32;
  const upperInteraction = state.upperPole === foodPole ? 'repel' : 'attract';
  const lowerInteraction = state.lowerPole === foodPole ? 'repel' : 'attract';
  const foodInteraction = !jawMagnets || !foodReady ? 'unavailable'
    : upperInteraction === lowerInteraction ? upperInteraction : 'mixed';
  let jawOpening = baseline;
  let retreat = 0;
  if (foodInteraction === 'attract') jawOpening = baseline * (1 - influence);
  if (foodInteraction === 'repel') { jawOpening = baseline + (0.88 - baseline) * influence; retreat = influence * 0.33; }
  if (foodInteraction === 'mixed') jawOpening = baseline + (0.20 - baseline) * influence;
  if (state.hingeBlocked) { jawOpening = baseline; retreat = 0; }
  const correctAssembly = state.upperPole === 'N' && state.lowerPole === 'N';
  let help = '';
  if (!jawMagnets) help = '아직 두 턱의 자석이 없어요. 조립 6단계에서 동전자석을 붙여요.';
  else if (!foodReady) help = '먹이 손잡이를 먼저 완성해요. 7–9단계에서 상자, 막대자석, 먹이를 붙여요.';
  else if (!jawsSame) help = '두 턱의 극이 달라 처음부터 끌어당겨요. 원본처럼 두 턱의 N극 표시를 확인해요.';
  else if (!correctAssembly) help = '두 턱이 S극이면 먹이의 반응이 바뀌어요. 원본 조립은 위턱 N극·아래턱 N극이에요.';
  if (state.hingeBlocked) help = '턱이 접히는 부분이 붙어 움직이지 않아요. 테이프가 접는 선을 막았는지 확인해요.';
  const clipAttracted = state.material === 'steel' && state.distance < 0.78;
  const clipsStrong = state.clipPosition !== 'middle';
  return {
    normalizedState: state,
    qualitative: true,
    assembly: { stage, parts: present, currentParts, ready: stage >= 9, correctPoles: correctAssembly, help },
    pairs: { interaction: same ? 'repel' : 'attract', samePoles: same,
      influence, separation: same ? 1.0 + influence * 0.75 : 1.0 - influence * 0.72,
      label: same ? '같은 극 · 밀어냄' : '다른 극 · 끌어당김' },
    clips: { attracted: clipAttracted, strengthRegion: clipsStrong ? 'pole' : 'middle',
      relativeStrength: clipsStrong ? 'stronger' : 'weaker',
      label: state.material !== 'steel' ? '이 나무·플라스틱 시료에서는 끌림을 나타내지 않아요.'
        : clipsStrong ? '극 가까이에서 클립이 더 잘 모여요.' : '가운데보다 극에서 클립이 더 잘 모여요.' },
    feeding: { foodPole, upperInteraction, lowerInteraction, foodInteraction, hingeBlocked: state.hingeBlocked,
      jawOpening, baselineOpening: baseline, retreat, help,
      jawState: jawOpening < 0.13 ? 'closed' : jawOpening > 0.67 ? 'wide-open' : 'open',
      label: foodInteraction === 'unavailable' ? '조립을 먼저 완성해요.'
        : state.hingeBlocked ? '끌거나 미는 힘이 있어도 붙은 턱은 움직이지 않아요.'
        : state.distance > 0.82 ? '먹이를 천천히 가까이 가져와요.'
        : foodInteraction === 'attract' ? '먹이 쪽과 다른 극 · 입이 다물어져요.'
        : foodInteraction === 'repel' ? '먹이 쪽과 같은 극 · 입이 벌어져요.'
        : '두 턱이 서로 다른 극이에요. 원본 조립을 확인해요.' },
  };
}
