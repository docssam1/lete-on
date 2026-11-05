import {MAGNET_SKY_LANGUAGE_VERSION,magnetSkyQuestionPresentation} from '../data/book/magnet-sky-student-language.js';
export {MAGNET_SKY_LANGUAGE_VERSION};
const units=new Set(['s41-u01','c22-s42-u01']),clone=value=>JSON.parse(JSON.stringify(value));
export function magnetSkyCurrentItems(rows,unit){
 if(!units.has(unit))return rows;
 return rows.map(q=>{
  if(!q.id?.startsWith(unit+'-')||!/^[abt]\d+$/.test(q.id.slice(unit.length+1))||q.sourceRef?.type==='similar'||(q.status!=='authored'&&!q.id.startsWith(unit+'-t'))||q.contentVersion===MAGNET_SKY_LANGUAGE_VERSION)return q;
  const next=magnetSkyQuestionPresentation(q,unit);if(next===q)return q;
  return {...next,contentVersion:MAGNET_SKY_LANGUAGE_VERSION,previousVersions:[...(q.previousVersions?clone(q.previousVersions):[]),{...clone(q),version:q.contentVersion||1}]};
 });
}
