// Earlier wording/material regressions exercise their original stage. The new
// writing and conservation regressions separately verify the current runtime.
import {revisedClassroom} from '../revised-lesson.js';
import {ECOLOGY_FOODWEB_VERSION} from '../ecology-foodweb-review.js';
import {ECOLOGY_CONSERVATION_VERSION} from '../ecology-conservation-review.js';
import {ECOLOGY_WRITING_VERSION} from '../ecology-writing-review.js';
import {questionAtVersion} from '../question-revision.js';
const previous=new WeakMap();
export function beforeEcologyFoodweb(q){
 if(q.contentVersion!==ECOLOGY_FOODWEB_VERSION)return q;
 if(previous.has(q))return previous.get(q);
 const snapshot=q.previousVersions.at(-1),old=questionAtVersion(q,snapshot.version);
 if(!Object.hasOwn(snapshot,'contentVersion'))delete old.contentVersion;
 previous.set(q,old);return old;
}
export function beforeEcologyConservation(q){
 q=beforeEcologyFoodweb(q);
 if(q.contentVersion!==ECOLOGY_CONSERVATION_VERSION)return q;
 if(previous.has(q))return previous.get(q);
 const snapshot=q.previousVersions.at(-1),old=questionAtVersion(q,snapshot.version);
 if(!Object.hasOwn(snapshot,'contentVersion'))delete old.contentVersion;
 previous.set(q,old);return old;
}
export function beforeEcologyWriting(q){
 q=beforeEcologyConservation(q);
 if(q.contentVersion!==ECOLOGY_WRITING_VERSION)return q;
 if(previous.has(q))return previous.get(q);
 const snapshot=q.previousVersions.at(-1),old=questionAtVersion(q,snapshot.version);
 if(!Object.hasOwn(snapshot,'contentVersion'))delete old.contentVersion;
 previous.set(q,old);return old;
}
export async function priorWritingClassroom(unit,mod){
 const current=await revisedClassroom(unit,mod);
 if(unit!=='c22-s42-u02')return current;
 return {...current,classroomItems:current.classroomItems.map(beforeEcologyWriting)};
}
