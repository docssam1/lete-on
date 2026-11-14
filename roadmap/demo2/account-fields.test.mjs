import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {readFileSync} from 'node:fs';
const read=n=>readFileSync(new URL(n,import.meta.url),'utf8');
const M=createRequire(import.meta.url)('./account-fields.js');
const field=(validity,more={})=>({validity:{valid:false,...validity},type:'text',tagName:'INPUT',getAttribute:n=>more[n]??null,validationMessage:more.validationMessage||'',...more});

test('a new login number is rated by how guessable it is, never by colour alone',()=>{
 assert.deepEqual(M.pinStrength(''),{level:0,text:''});
 assert.equal(M.pinStrength('1234').level,1);assert.match(M.pinStrength('1234').text,/8자리 이상.*4자리/);
 assert.equal(M.pinStrength('12ab5678').level,1);assert.equal(M.pinStrength('1234567890123').level,1);
 for(const easy of ['11111111','12345678','87654321','90123456','12121212','12341234','20150304','19991231','01012345678','11112222'])assert.equal(M.pinStrength(easy).level,2,easy);
 for(const fine of ['48203917','7305182946','20151340','83920471'])assert.deepEqual(M.pinStrength(fine),{level:3,text:'쓰기 좋은 번호예요.'},fine);
 for(const v of ['1','11111111','48203917'])assert.ok(M.pinStrength(v).text.length>5);
});
test('each mistake is named for its own field in plain words',()=>{
 assert.equal(M.messageFor({validity:{valid:true}},'보호자 이메일'),'');
 assert.equal(M.messageFor(field({valueMissing:true}),'보호자 이메일'),'보호자 이메일을 입력해 주세요.');
 assert.equal(M.messageFor(field({valueMissing:true}),'아이디'),'아이디를 입력해 주세요.');
 assert.equal(M.messageFor(field({valueMissing:true},{tagName:'SELECT'}),'현재 학년'),'현재 학년을 선택해 주세요.');
 assert.equal(M.messageFor(field({valueMissing:true},{type:'checkbox'}),''),'동의해야 진행할 수 있습니다.');
 assert.match(M.messageFor(field({typeMismatch:true},{type:'email'}),'보호자 이메일'),/^이메일 형식을 확인해 주세요/);
 assert.equal(M.messageFor(field({patternMismatch:true},{pattern:'[0-9]{8,12}'}),'로그인 번호'),'숫자 8~12자리로 입력해 주세요.');
 assert.equal(M.messageFor(field({tooShort:true},{pattern:'[0-9]{4,12}'}),'승인번호'),'숫자 4~12자리로 입력해 주세요.');
 assert.equal(M.messageFor(field({customError:true},{validationMessage:'로그인 번호가 서로 다릅니다.'}),'로그인 번호 확인'),'로그인 번호가 서로 다릅니다.');
});
test('the particle follows the last sound of the label',()=>{
 assert.equal(M.object('이메일'),'을');assert.equal(M.object('아이디'),'를');assert.equal(M.object('승인번호'),'를');assert.equal(M.object('학생 이름'),'을');
});
test('the helper changes no request and keeps no value',()=>{
 const js=read('account-fields.js');
 assert.doesNotMatch(js,/fetch\(|XMLHttpRequest|localStorage|sessionStorage|RoadmapMembership|console\./);
 assert.doesNotMatch(js,/alert\(|confirm\(|prompt\(/);
 assert.equal(M.mount(null),null);assert.equal(M.mount({document:{getElementById:()=>null}}),null);
 assert.match(read('account.html'),/<script src="account-fields\.js\?v=[^"]+"><\/script>/);
 const css=read('account-landing.css');assert.match(css,/\.member-field-error\{/);assert.match(css,/\.member-strength\[data-level="3"\]/);
});
