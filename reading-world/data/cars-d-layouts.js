(function(){
  'use strict';

  // Public structural map only. Licensed passage/question wording stays in Supabase.
  // PDF pages are 3 higher than the printed page number in this scan.
  window.CARS_D_LAYOUTS = {
    version: 2,
    bookId: 'cars-level-d',
    pdfPrintedOffset: 3,
    lessons: {
      cd1: {
        sourceLabel: 'Pretest 1', printedPages: [4,5,6], pdfPages: [7,8,9],
        original: {
          layout: 'tale', sourceTitle: '', columns: 1,
          media: [{ type: 'folktale-scene', placement: 'bottom', width: 'wide' }]
        },
        questions: {}
      },
      cd2: {
        sourceLabel: 'Pretest 2', printedPages: [7,8,9], pdfPages: [10,11,12],
        original: {
          layout: 'profile', sourceTitle: 'An Author Who Makes Reading Fun', columns: 1,
          media: [{ type: 'author-portrait', placement: 'float-right-top', width: 'portrait' }]
        },
        questions: { 3: { type: 'sequence', boxCount: 3, blankIndex: 2, showStepNumbers: false } }
      },
      cd3: {
        sourceLabel: 'Pretest 3', printedPages: [10,11,12], pdfPages: [13,14,15],
        original: {
          layout: 'story-figure', sourceTitle: '', columns: 1,
          media: [{ type: 'classroom-secret', placement: 'float-right-bottom', width: 'medium' }]
        },
        questions: { 4: { type: 'cause-effect', blankIndex: 1 } }
      },
      cd4: {
        sourceLabel: 'Pretest 4', printedPages: [13,14,15], pdfPages: [16,17,18],
        original: {
          layout: 'science-figure', sourceTitle: '', columns: 1,
          // Recreated as a horizontal black-background textbook illustration. The
          // bright/dark halves must remain visually unambiguous because a later
          // question explicitly asks students to compare the pictured phases.
          media: [{ type: 'moon-phases', placement: 'after-paragraph', afterParagraph: 1, orientation: 'horizontal', width: 'wide', essential: true }]
        },
        questions: {}
      },
      cd5: {
        sourceLabel: 'Pretest 5', printedPages: [16,17,18], pdfPages: [19,20,21],
        original: {
          layout: 'poem', sourceTitle: '', columns: 1,
          media: [{ type: 'animal-poem', placement: 'float-right', width: 'medium' }]
        },
        questions: {
          2: { type: 'branch-map', childCount: 4, blankIndex: 1 },
          3: { type: 'standard' }
        }
      },
      cd6: {
        sourceLabel: 'Benchmark 1', printedPages: [20,21,22,23], pdfPages: [23,24,25,26],
        original: {
          layout: 'two-page-story', sourceTitle: 'Two Travellers and the Bear', columns: 1,
          media: [{ type: 'bear-scene', placement: 'bottom', width: 'wide' }]
        },
        questions: { 3: { type: 'sequence', boxCount: 3, blankIndex: 1, showStepNumbers: false } }
      },
      cd7: {
        sourceLabel: 'Benchmark 2', printedPages: [24,25,26,27], pdfPages: [27,28,29,30],
        original: {
          layout: 'biography', sourceTitle: 'The Wizard of Menlo Park', columns: 1,
          media: [
            { type: 'edison-portrait', placement: 'float-left-top', width: 'portrait' },
            { type: 'timeline', placement: 'bottom', width: 'wide', essential: true }
          ]
        },
        questions: { 4: { type: 'cause-effect', blankIndex: 1 } }
      },
      cd8: {
        sourceLabel: 'Benchmark 3', printedPages: [28,29,30,31], pdfPages: [31,32,33,34],
        original: {
          layout: 'feature-list', sourceTitle: 'So You Want to Put on a School Play?', columns: 1,
          specialHeading: 'Things to Think About',
          media: [{ type: 'school-play', placement: 'bottom', width: 'wide' }]
        },
        questions: {}
      },
      cd9: {
        sourceLabel: 'Benchmark 4', printedPages: [32,33,34,35], pdfPages: [35,36,37,38,39],
        original: {
          layout: 'two-column-article', sourceTitle: '', columns: 2,
          media: [{ type: 'viking-longship', placement: 'after-paragraph', afterParagraph: 5, width: 'wide' }]
        },
        questions: {}
      },
      cd10: {
        sourceLabel: 'Benchmark 5', printedPages: [36,37,38,39], pdfPages: [40,41,42,43],
        original: {
          layout: 'journal-inset', sourceTitle: 'Two Weeks with Grandma', columns: 1,
          journalParagraphsFromEnd: 1,
          media: [{ type: 'grandma-gift', placement: 'journal-bottom-right', width: 'medium' }]
        },
        questions: { 3: { type: 'sequence', boxCount: 3, blankIndex: 1, showStepNumbers: true } }
      },
      cd11: {
        sourceLabel: 'Post Test 1', printedPages: [41,42,43], pdfPages: [45,46,47],
        original: {
          layout: 'two-column-article', sourceTitle: 'Whale Songs', columns: 2,
          media: [{ type: 'whale-scene', placement: 'float-right-top', width: 'medium' }]
        },
        questions: {}
      },
      cd12: {
        sourceLabel: 'Post Test 2', printedPages: [44,45,46], pdfPages: [48,49,50],
        original: {
          layout: 'poster', sourceTitle: '', columns: 1,
          preserveReadableText: true,
          posterArt: 'contest-magazine'
        },
        questions: {}
      },
      cd13: {
        sourceLabel: 'Post Test 3', printedPages: [47,48,49], pdfPages: [51,52,53],
        original: {
          layout: 'story-figure', sourceTitle: 'Star Party', columns: 1,
          media: [{ type: 'star-party', placement: 'float-right', width: 'medium' }]
        },
        questions: { 3: { type: 'sequence', boxCount: 3, blankIndex: 0, showStepNumbers: false } }
      },
      cd14: {
        sourceLabel: 'Post Test 4', printedPages: [50,51,52], pdfPages: [54,55,56],
        original: {
          layout: 'two-column-article', sourceTitle: 'The Pony Express', columns: 2,
          media: [{ type: 'pony-express', placement: 'float-right-top', width: 'medium' }]
        },
        questions: { 3: { type: 'sequence', boxCount: 3, blankIndex: 2, showStepNumbers: true } }
      },
      cd15: {
        sourceLabel: 'Post Test 5', printedPages: [53,54,55], pdfPages: [57,58,59],
        original: {
          layout: 'two-column-article', sourceTitle: 'Rainforests', columns: 2,
          media: [{ type: 'rainforest-layers', placement: 'float-right-top', width: 'medium', essential: true }]
        },
        questions: {}
      }
    }
  };
})();
