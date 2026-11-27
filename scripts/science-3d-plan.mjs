// 브라우저·서버·학생 저장을 열지 않고 검사할 실제 수업 경로를 만든다.
import fs from 'node:fs';
import { revisedTextbookUnits } from '../science-lab/v2/revised-textbook.js';
import { revisedClassroom, classroomQuestions } from '../science-lab/v2/revised-lesson.js';
import { buildSlides } from '../science-lab/v2/deck.js';
import { withThink } from '../science-lab/v2/think-merge.js';

export const RETAINED_3D_UNITS = Object.freeze(['c22-s42-u04', 'c22-s42-u01', 'c22-s42-u02', 'c22-s32-u04', 'c22-s32-u01', 'c22-s32-u02', 'c22-s32-u03', 's41-u04', 's31-u01', 's41-u01', 's41-u02', 's41-u03', 's41-u03b', 's42-u01', 's42-u02', 's42-u03', 's42-u04', 's42-u05', 's51-u01', 's51-u02', 's51-u03', 's51-u04', 's51-u05', 's52-u01']);
export const SCIENCE_CHECK_UNITS = Object.freeze([...new Set([...RETAINED_3D_UNITS, ...revisedTextbookUnits])]);

export function classifyClassroomSlide(slide, chapter, comparisonKind) {
  if (slide.mount === 'scene') return { type: 'scene3d', widget: null, battle: false };
  if (slide.mount !== 'lab') return null;
  const type = slide.modelLab || (chapter.forceThinking && !comparisonKind) ? 'lab3d' : 'comparison2d';
  if (type === 'comparison2d' && !comparisonKind) throw Error('비교 화면의 연결 종류가 없습니다: ' + slide.id);
  const battle = chapter.classroomBattle !== false && (!chapter.fieldwork || !!slide.modelLab) && !chapter.forcework;
  return { type, widget: type === 'comparison2d' ? '.' + comparisonKind : null, battle };
}

export function science3DCases(target, labNumber = 0) {
  const u = target.unit;
  return [
    ...(!target.current ? [['덱 실험 슬라이드', { width: 1440, height: 900 }, labNumber ? `#/${u}/lab-class/teach/${labNumber}` : null]] : []),
    ...(target.retainedLegacy3D ? [
      ['5단계 실험(PC)', { width: 1280, height: 860 }, `#/${u}/2/lab`],
      ['5단계 실험(폰)', { width: 390, height: 844 }, `#/${u}/2/lab`, true],
      ['장면(PC)', { width: 1280, height: 860 }, `#/${u}/2/scene`],
      ['장면(폰)', { width: 390, height: 844 }, `#/${u}/2/scene`, true],
    ] : []),
    ...target.classroomCases.flatMap(c => [
      [`현행 ${c.mode} ${c.id}(PC)`, { width: 1440, height: 900 }, c.hash, false, c],
      [`현행 ${c.mode} ${c.id}(폰)`, { width: 390, height: 844 }, c.hash, true, c],
    ]),
  ];
}

export function science3DFullscreenCases(target, labNumber = 0) {
  return [
    ...(target.retainedLegacy3D ? [['전체 화면(PC)', { width: 1280, height: 760 }], ['전체 화면(폰 가로)', { width: 844, height: 390 }, true]] : []),
    ...(!target.current || labNumber ? [['전체 화면(덱)', { width: 1440, height: 900 }, false, labNumber ? `#/${target.unit}/lab-class/teach/${labNumber}` : null]] : []),
  ];
}

export async function science3DPlan(selected = SCIENCE_CHECK_UNITS) {
  if (!Array.isArray(selected) || !selected.length) throw Error('검사할 단원을 골라 주세요.');
  for (const unit of selected) if (!SCIENCE_CHECK_UNITS.includes(unit)) throw Error('등록되지 않은 검사 단원: ' + unit);
  const production = fs.readFileSync(new URL('../science-lab/v2/v2.js', import.meta.url), 'utf8'), targets = [];
  for (const unit of [...new Set(selected)]) {
    const current = revisedTextbookUnits.has(unit);
    const retainedLegacy3D = RETAINED_3D_UNITS.includes(unit);
    const target = { unit, current, retainedLegacy3D, retainedPaths: retainedLegacy3D ? { lab: `#/${unit}/2/lab`, scene: `#/${unit}/2/scene`, deckNeedsBrowserLookup: !current } : null, classroomCases: [] };
    if (current) {
      const mod = await revisedClassroom(unit, await import(`../science-lab/data/book/${unit}.book.js`));
      const raw = await import(`../science-lab/data/units/${unit}.js`), paired = await import(`../science-lab/data/units/${unit}.similar.js`);
      const data = production.includes(`withThink('${unit}'`) ? await withThink(unit, { ...raw, ...paired }) : { ...raw, ...paired };
      const pool = classroomQuestions(mod, [...(data.similar || []), ...(data.items || [])]);
      const ix = await import(`../science-lab/data/book/${unit}.interact.js`).then(m => m.interact).catch(() => null);
      for (const mode of ['self', 'teach']) {
        const slides = buildSlides(mod.chapter, mod.art, mod.plan, pool, mode, ix);
        for (const slide of slides) {
          const classification = classifyClassroomSlide(slide, mod.chapter, mod.classroomLab?.kind);
          if (classification) target.classroomCases.push({ ...classification, mode, id: slide.id, n: slide.n, title: slide.title, hash: `#/${unit}/lab-class/${mode}/${slide.n}` });
        }
      }
      if (!target.classroomCases.length) throw Error('현재 수업의 검사 화면이 없습니다: ' + unit);
    }
    targets.push(target);
  }
  const surfaces = { ordinary: 0, fullscreen: 0, legacyDecksNeedBrowserLookup: targets.filter(t => !t.current).length };
  for (const target of targets) {
    const n = target.classroomCases.find(c => c.mode === 'teach' && c.type === 'lab3d')?.n || 0;
    surfaces.ordinary += science3DCases(target, n).length;
    surfaces.fullscreen += science3DFullscreenCases(target, n).length;
  }
  return { mode: 'plan-only', browserStarted: false, serverStarted: false, runtimeChecks: 0, runtimeVerified: false, units: targets.length, surfaces, targets };
}
