// Publisher identity, school curriculum and parent-reported learning are separate.
export function bookFamily(name){
 const n=String(name||'').normalize('NFKC').replace(/\s+/g,'').replace(/^신사고/,'');
 if(/^(?:디딤돌)?(?:초등수학)?기본\+?응용(?:[1-6]-[12])?(?:\(.*\))?$/.test(n))return 'didimdol_application';
 if(/^(?:디딤돌)?(?:초등수학)?최상위[Ss](?:수학|초등수학)?(?:[1-6]-[12])?(?:\(.*\))?$/.test(n))return 'didimdol_s';
 if(/^(?:디딤돌)?(?:최상위(?:초등수학|수학)?|초등수학최상위)(?:[1-6]-[12])?(?:\(.*\))?$/.test(n))return 'didimdol_top';
 if(/^(?:쎈수학초등|쎈수학|쎈초등수학|쎈)(?:[1-6]-[12])?(?:\(.*\))?$/.test(n))return 'ssen';
 return null;
}
export function elementaryVolume(value){const m=/^([1-6])\s*[-－]\s*([12])$/.exec(String(value||'').trim());return m?`${m[1]}-${m[2]}`:null;}
export function resolveBook(c,data){
 const isbn=String(c.isbn||'').replace(/-/g,'');
 let book=isbn?data.books.find(b=>b.isbn.replace(/-/g,'')===isbn):null;
 const family=bookFamily(c.course),volume=elementaryVolume(c.volume);
 if(isbn&&!book)return {status:'isbn_not_found',book:null,family,volume};
 if(!book&&(!family||!volume))return {status:'not_identified',book:null,actualCompletion:c.completion};
 if(!book&&c.sourceCurriculum!=='2022')return {status:c.sourceCurriculum==='2015'?'old_edition':'edition_unknown',book:null,family,volume};
 if(!book){
  const candidates=data.books.filter(b=>b.family===family&&b.volume===volume&&b.sourceCurriculum==='2022');
  if(candidates.length>1)return {status:'edition_choice',book:null,candidates,family,volume};
  book=candidates[0];
 }
 if(!book)return {status:'publisher_pending',book:null,family,volume};
 if(c.level&& !['unknown','elementary'].includes(c.level))return {status:'identity_conflict',book:null,sourceBookId:book.id};
 if(isbn&&((family&&family!==book.family)||(volume&&volume!==book.volume)||(c.sourceCurriculum&&c.sourceCurriculum!=='2022')))return {status:'identity_conflict',book:null,sourceBookId:book.id};
 if(!['publisher_toc','retailer_toc'].includes(book.verification))return {status:'source_issue',book,selectableUnits:[]};
 return {status:book.verification,book,selectableUnits:book.units.filter(u=>!u.issues?.length),actualIdentity:'parent_report',actualCompletion:c.completion};
}
export function mappingSnapshot(c,data){
 const r=resolveBook(c,data);
 const unit=['publisher_toc','retailer_toc'].includes(r.status)?r.selectableUnits.find(u=>u.title===c.unit):null;
 return {status:r.status,bookId:r.book?.id||null,sourceRole:r.book?.sourceRole||(r.book?'publisher_metadata':null),sourceUrl:r.book?.sourceUrl||null,checkedOn:r.book?.checkedOn||null,unitOrder:unit?.order??null,unitMatched:!!unit,actualMastery:'not_assessed',achievementMapping:'not_verified',input:{course:c.course,volume:c.volume,unit:c.unit,isbn:c.isbn||'',sourceCurriculum:c.sourceCurriculum||'',curriculumTarget:c.curriculumTarget||''}};
}
