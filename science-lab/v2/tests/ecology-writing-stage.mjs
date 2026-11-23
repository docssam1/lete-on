// Earlier wording/material regressions exercise their original stage. The new
// writing regression separately verifies the current bank, classroom and paper.
import {revisedClassroom} from '../revised-lesson.js';
import {ECOLOGY_WRITING_VERSION} from '../ecology-writing-review.js';
import {questionAtVersion} from '../question-revision.js';
const previous=new WeakMap();
export function beforeEcologyWriting(q){
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
