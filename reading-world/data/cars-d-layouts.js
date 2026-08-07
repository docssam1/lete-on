(function(){
  'use strict';

  // Public structural map only. Licensed passage/question wording stays in Supabase.
  // PDF pages are 3 higher than the printed page number in this scan.
  // Full-page source images supplied for every illustrated passage are the visual
  // authority for placement; OCR supplies text, never layout guesses.
  window.CARS_D_LAYOUTS = {
    version: 4,
    bookId: 'cars-level-d',
    pdfPrintedOffset: 3,
    specialQuestionTypes: ['sequence','cause-effect','branch-map'],
    lessons: {
      cd1: {
        sourceLabel: 'Pretest 1', printedPages: [4,5,6], pdfPages: [7,8,9],
        original: {
          layout: 'tale', sourceTitle: '', columns: 1,
          media: [{ type: 'folktale-scene', src: 'assets/images/cars-level-d/cd1-folktale-scene.webp?v=49', placement: 'bottom', width: 'wide', role: 'illustration' }]
        },
        questions: {}
      },
      cd2: {
        sourceLabel: 'Pretest 2', printedPages: [7,8,9], pdfPages: [10,11,12],
        original: {
          layout: 'profile', sourceTitle: 'An Author Who Makes Reading Fun', columns: 1,
          media: [{ type: 'author-portrait', src: 'assets/images/cars-level-d/cd2-author-portrait.webp?v=49', placement: 'float-right-top', width: 'portrait', role: 'illustration' }]
        },
        questions: { 3: { type: 'sequence', boxCount: 3, blankIndex: 2, showStepNumbers: false } }
      },
      cd3: {
        sourceLabel: 'Pretest 3', printedPages: [10,11,12], pdfPages: [13,14,15],
        original: {
          layout: 'story-figure', sourceTitle: '', columns: 1,
          media: [{ type: 'classroom-secret', src: 'assets/images/cars-level-d/cd3-classroom-secret.webp?v=49', placement: 'float-right-bottom', width: 'medium', role: 'illustration' }]
        },
        questions: { 4: { type: 'cause-effect', blankIndex: 1 } }
      },
      cd4: {
        sourceLabel: 'Pretest 4', printedPages: [13,14,15], pdfPages: [16,17,18],
        original: {
          layout: 'science-figure', sourceTitle: '', columns: 1,
          // Source page uses a tall black panel at the right edge. The recreated
          // image must preserve the strong black/illuminated contrast because a
          // later question asks students to compare the pictured phases.
          media: [{ type: 'moon-phases', src: 'assets/images/cars-level-d/cd4-moon-phases.webp?v=49', placement: 'float-right-top', orientation: 'vertical', width: 'phase-panel', essential: true, role: 'information-graphic' }]
        },
        questions: {}
      },
      cd5: {
        sourceLabel: 'Pretest 5', printedPages: [16,17,18], pdfPages: [19,20,21],
        original: {
          layout: 'poem', sourceTitle: '', columns: 1,
          // One transparent recreated composite can contain the four animal drawings
          // in the same relative positions while the poem remains live HTML text.
          media: [{ type: 'animal-poem', src: 'assets/images/cars-level-d/cd5-animal-poem.webp?v=49', placement: 'float-right-top', width: 'poem-art', role: 'illustration' }]
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
          media: [{ type: 'bear-scene', src: 'assets/images/cars-level-d/cd6-bear-scene.webp?v=49', placement: 'bottom', width: 'wide', role: 'illustration' }]
        },
        questions: { 3: { type: 'sequence', boxCount: 3, blankIndex: 1, showStepNumbers: false } }
      },
      cd7: {
        sourceLabel: 'Benchmark 2', printedPages: [24,25,26,27], pdfPages: [27,28,29,30],
        original: {
          layout: 'biography', sourceTitle: 'The Wizard of Menlo Park', columns: 1,
          media: [
            { type: 'edison-portrait', src: 'assets/images/cars-level-d/cd7-edison-portrait.webp?v=49', placement: 'float-left-top', width: 'portrait', role: 'illustration' },
            // Prefer live HTML timeline text from private meta; fall back to a recreated
            // image only until that metadata is present.
            { type: 'timeline', placement: 'bottom', width: 'wide', essential: true, role: 'information-graphic', render: 'html-timeline' }
          ]
        },
        questions: { 4: { type: 'cause-effect', blankIndex: 1 } }
      },
      cd8: {
        sourceLabel: 'Benchmark 3', printedPages: [28,29,30,31], pdfPages: [31,32,33,34],
        original: {
          layout: 'feature-list', sourceTitle: 'So You Want to Put on a School Play?', columns: 1,
          specialHeading: 'Things to Think About',
          media: [{ type: 'school-play', src: 'assets/images/cars-level-d/cd8-school-play.webp?v=49', placement: 'bottom', width: 'wide', role: 'illustration' }]
        },
        questions: {}
      },
      cd9: {
        sourceLabel: 'Benchmark 4', printedPages: [32,33,34,35], pdfPages: [35,36,37,38,39],
        original: {
          layout: 'two-column-article', sourceTitle: '', columns: 2,
          media: [{ type: 'viking-longship', src: 'assets/images/cars-level-d/cd9-viking-longship.webp?v=49', placement: 'after-paragraph', afterParagraph: 5, width: 'column-wide', role: 'illustration' }]
        },
        questions: {}
      },
      cd10: {
        sourceLabel: 'Benchmark 5', printedPages: [36,37,38,39], pdfPages: [40,41,42,43],
        original: {
          layout: 'journal-inset', sourceTitle: 'Two Weeks with Grandma', columns: 1,
          journalParagraphsFromEnd: 1,
          media: [{ type: 'grandma-gift', src: 'assets/images/cars-level-d/cd10-grandma-gift.webp?v=49', placement: 'journal-bottom-right', width: 'medium', role: 'embedded-illustration' }]
        },
        questions: { 3: { type: 'sequence', boxCount: 3, blankIndex: 1, showStepNumbers: true } }
      },
      cd11: {
        sourceLabel: 'Post Test 1', printedPages: [41,42,43], pdfPages: [45,46,47],
        original: {
          layout: 'two-column-article', sourceTitle: 'Whale Songs', columns: 2,
          media: [{ type: 'whale-scene', src: 'assets/images/cars-level-d/cd11-whale-scene.webp?v=49', placement: 'column-right-top', width: 'column-wide', role: 'illustration' }]
        },
        questions: {}
      },
      cd12: {
        sourceLabel: 'Post Test 2', printedPages: [44,45,46], pdfPages: [48,49,50],
        original: {
          layout: 'poster', sourceTitle: '', columns: 1,
          preserveReadableText: true,
          posterArt: 'contest-magazine',
          posterTextMode: 'live-html'
        },
        questions: {}
      },
      cd13: {
        sourceLabel: 'Post Test 3', printedPages: [47,48,49], pdfPages: [51,52,53],
        original: {
          layout: 'story-figure', sourceTitle: 'Star Party', columns: 1,
          media: [{ type: 'star-party', src: 'assets/images/cars-level-d/cd13-star-party.webp?v=49', placement: 'float-right-middle', afterParagraph: 1, width: 'medium', role: 'illustration' }]
        },
        questions: { 3: { type: 'sequence', boxCount: 3, blankIndex: 0, showStepNumbers: false } }
      },
      cd14: {
        sourceLabel: 'Post Test 4', printedPages: [50,51,52], pdfPages: [54,55,56],
        original: {
          layout: 'two-column-article', sourceTitle: 'The Pony Express', columns: 2,
          media: [{ type: 'pony-express', src: 'assets/images/cars-level-d/cd14-pony-express.webp?v=49', placement: 'column-right-top', width: 'column-wide', role: 'illustration' }]
        },
        questions: { 3: { type: 'sequence', boxCount: 3, blankIndex: 2, showStepNumbers: true } }
      },
      cd15: {
        sourceLabel: 'Post Test 5', printedPages: [53,54,55], pdfPages: [57,58,59],
        original: {
          layout: 'two-column-article', sourceTitle: 'Rainforests', columns: 2,
          media: [{ type: 'rainforest-layers', src: 'assets/images/cars-level-d/cd15-rainforest-layers.webp?v=49', placement: 'column-right-top', width: 'column-wide', essential: true, role: 'information-graphic' }]
        },
        questions: {}
      }
    }
  };
})();
