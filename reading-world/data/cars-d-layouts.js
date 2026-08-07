(function(){
  'use strict';
  window.CARS_D_LAYOUTS = {
    version: 1,
    bookId: 'cars-level-d',
    lessons: {
      cd2: {
        printedPages: [7,8,9],
        original: { layout: 'standard', mediaPosition: 'right' },
        questions: { 3: { type: 'sequence', boxCount: 3, blankIndex: 2, showStepNumbers: false } }
      },
      cd3: {
        printedPages: [10,11,12],
        original: { layout: 'standard' },
        questions: { 4: { type: 'cause-effect', blankIndex: 1 } }
      },
      cd4: {
        printedPages: [13,14,15],
        original: { layout: 'standard', media: [{ type: 'moon-phases', placement: 'after-passage', orientation: 'horizontal' }] }
      },
      cd5: {
        printedPages: [16,17,18],
        original: { layout: 'poem' },
        questions: {
          2: { type: 'branch-map', childCount: 4, blankIndex: 1 },
          3: { type: 'standard' }
        }
      },
      cd6: {
        printedPages: [20,21,22,23],
        original: { layout: 'standard' },
        questions: { 3: { type: 'sequence', boxCount: 3, blankIndex: 1, showStepNumbers: false } }
      },
      cd7: {
        printedPages: [24,25,26,27],
        original: { layout: 'standard', media: [{ type: 'timeline', placement: 'after-passage' }] },
        questions: { 4: { type: 'cause-effect', blankIndex: 1 } }
      },
      cd10: {
        printedPages: [36,37,38,39],
        original: { layout: 'inset-bottom' },
        questions: { 3: { type: 'sequence', boxCount: 3, blankIndex: 1, showStepNumbers: true } }
      },
      cd12: {
        printedPages: [44,45,46],
        original: { layout: 'poster', preserveReadableText: true }
      },
      cd13: {
        printedPages: [47,48,49],
        original: { layout: 'standard' },
        questions: { 3: { type: 'sequence', boxCount: 3, blankIndex: 0, showStepNumbers: false } }
      },
      cd14: {
        printedPages: [50,51,52],
        original: { layout: 'standard' },
        questions: { 3: { type: 'sequence', boxCount: 3, blankIndex: 2, showStepNumbers: true } }
      },
      cd15: {
        printedPages: [53,54,55],
        original: { layout: 'standard', media: [{ type: 'rainforest-layers', placement: 'in-passage' }] }
      }
    }
  };
})();
