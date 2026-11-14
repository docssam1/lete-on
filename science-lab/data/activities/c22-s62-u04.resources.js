import{careerSourceNotes}from'../book/c22-s62-u04.editorial.js?v=20261104-career-book';
export const careerSources=careerSourceNotes.map(r=>({...r,scope:r.caption,summary:r.caption}));
