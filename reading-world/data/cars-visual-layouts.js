(function(){
  'use strict';

  // Diagram shapes for Level B and Level C questions, kept public because a box
  // count and a gap position give nothing licensed away. The wording that fills
  // the boxes lives in Supabase (lesson_content.original_questions.meta), exactly
  // as Level D does it in cars-d-layouts.js.
  //
  // Level B and C were transcribed from the printed books rather than scanned, so
  // these shapes follow the transcription. Level D's shapes were checked against
  // the page scans; these could not be, for want of the source PDFs.
  window.CARS_VISUAL_LAYOUTS = {
    version: 1,
    lessons: {
      // "Robins lay their eggs." → [ ? ] → "Baby robins learn to fly."
      // Level B's first lesson predates window.LESSONS and is still a flat global,
      // so the title travels here for the app to match on. It is already public.
      lesson1:  { bookId: 'cars-level-b', title: 'My Backyard Zoo', questions: { 3: { type: 'sequence', boxCount: 3, blankIndex: 1, showStepNumbers: false } } },
      // [ ? ] → "The umpire barked, 'Strike one!'" → "Marvin hit the ball."
      lesson3:  { bookId: 'cars-level-b', questions: { 3: { type: 'sequence', boxCount: 3, blankIndex: 0, showStepNumbers: false } } },
      // Numbered 1-2-3: the question asks for "box 2", so the numbers must show.
      lesson5:  { bookId: 'cars-level-b', questions: { 3: { type: 'sequence', boxCount: 3, blankIndex: 1, showStepNumbers: true } } },
      // [ ? ] → "Owl asked for a long neck." → "Raweno asked Owl to be quiet."
      lesson10: { bookId: 'cars-level-b', questions: { 3: { type: 'sequence', boxCount: 3, blankIndex: 0, showStepNumbers: false } } },
      // Also asks for "box 2".
      lc3:      { bookId: 'cars-level-c', questions: { 3: { type: 'sequence', boxCount: 3, blankIndex: 1, showStepNumbers: true } } },
      lc6:      { bookId: 'cars-level-c', questions: { 3: { type: 'sequence', boxCount: 3, blankIndex: 1, showStepNumbers: false } } }
    }
  };
})();
