// 전체 단원을 직접 검토하는 도구의 동기 API. 앱은 해당 단원 모듈만 읽는다.
import {reviewedSourceDiagnostics as r0} from './source-diagnostics/c22-s51-u01.js?v=20261116-source-diagnostics-per-unit';
import {reviewedSourceDiagnostics as r1} from './source-diagnostics/c22-s52-u01.js?v=20261116-source-diagnostics-per-unit';
import {reviewedSourceDiagnostics as r2} from './source-diagnostics/c22-s61-u04.js?v=20261116-source-diagnostics-per-unit';
import {reviewedSourceDiagnostics as r3} from './source-diagnostics/c22-s62-u01.js?v=20261116-source-diagnostics-per-unit';
import {reviewedSourceDiagnostics as r4} from './source-diagnostics/c22-s62-u02.js?v=20261116-source-diagnostics-per-unit';
import {reviewedSourceDiagnostics as r5} from './source-diagnostics/c22-s62-u03.js?v=20261116-source-diagnostics-per-unit';
const revisers={'c22-s51-u01':r0,'c22-s52-u01':r1,'c22-s61-u04':r2,'c22-s62-u01':r3,'c22-s62-u02':r4,'c22-s62-u03':r5};
export function reviewedSourceDiagnostics(unit,rows){return Object.hasOwn(revisers,unit)?revisers[unit](unit,rows):rows;}
