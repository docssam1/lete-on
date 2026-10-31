(function(g){
 'use strict';
 const VERSION='roadmap-2026-10-30-v1';
 const privacy=`<h2>개인정보 수집·이용 안내</h2><p>시행일 2026년 10월 30일 · 운영: GFIELD</p>
 <dl><dt>이용 목적</dt><dd>이메일 인증과 로그인, 학생별 학습 로드맵 구성, 회원 정보 관리, 문의 응대와 서비스 보안</dd>
 <dt>필수 항목</dt><dd>보호자 이메일·휴대폰 번호, 학생 이름·학년 또는 유치 나이, 이메일 인증 상태, 로그인 번호의 암호화된 검증값, 동의 내용·버전·일시, 로그인 세션과 보안 처리 기록</dd>
 <dt>보유 기간</dt><dd>로드맵 회원 탈퇴 또는 필수 동의 철회 시까지입니다. 탈퇴하면 로드맵 회원 정보와 동의 기록, 로그인 세션을 삭제합니다. 로그인 시도 제한을 위한 보안 기록은 24시간 이내의 정보만 사용합니다. 다른 GFIELD 서비스에 가입한 공통 이메일 계정은 해당 서비스에서 별도로 관리합니다.</dd>
 <dt>이메일 인증 단계</dt><dd>인증을 요청하면 보호자 이메일을 공통 인증 시스템에 등록합니다. 회원 등록을 마치지 않은 이메일 계정의 삭제도 아래 연락처로 요청하실 수 있습니다. 이메일 인증은 이메일 사용 권한을 확인하는 절차입니다.</dd>
 <dt>학생 정보와 보호자 동의</dt><dd>보호자가 가입하는 서비스입니다. 만 14세 미만 학생은 법정대리인이 학생 정보 수집·이용 내용을 확인하고 직접 동의해야 합니다. 학생의 주민등록번호나 생년월일은 수집하지 않습니다.</dd>
 <dt>처리 위탁</dt><dd>계정 인증과 회원 정보 저장에는 Supabase를 이용합니다. 학습 설계 선택은 로그인한 계정별로 이 기기에 저장됩니다. 관리자에게는 회원 정보와 인증·동의 내역이 제공되며, 로그인 번호 원문은 제공되지 않습니다.</dd>
 <dt>거부할 권리</dt><dd>필수 정보 수집·이용 동의를 거부할 수 있습니다. 거부하면 이메일 인증과 로드맵 회원 이용이 어렵습니다. 광고 수신은 선택이며, 동의하지 않아도 같은 기능을 무료로 이용할 수 있습니다.</dd>
 <dt>열람·정정·삭제·철회</dt><dd>내 계정에서 학생 정보와 연락처를 수정하고 광고 수신을 해제할 수 있습니다. 필수 동의 철회는 회원 탈퇴로 처리합니다. 문의: <a href="mailto:docssam1@gmail.com">docssam1@gmail.com</a>. 공통 이메일 계정 삭제나 이 기기에 남은 자료 정리도 요청하실 수 있습니다.</dd></dl>`;
 const marketing=`<h2>선택 · 광고성 정보 수신 및 개인정보 이용</h2><p>GFIELD의 교육 프로그램·상담·설명회·서비스 소식과 행사 안내를 받는 선택 사항입니다.</p><dl><dt>이용 항목과 채널</dt><dd>이메일 수신에 동의하면 보호자 이메일을, 문자 수신에 동의하면 보호자 휴대폰 번호를 사용합니다. 채널별로 따로 선택할 수 있습니다.</dd><dt>이용 기간</dt><dd>해당 채널의 수신 동의 철회 또는 로드맵 회원 탈퇴 시까지입니다.</dd><dt>수신 중단</dt><dd>내 계정에서 언제든 해제하거나 수신한 안내의 수신 거부 방법으로 중단할 수 있습니다. 수신 동의를 하지 않아도 무료 이용에 영향이 없습니다. 계정 인증 등 필수 안내 메일은 광고 수신 여부와 별개입니다.</dd></dl>`;
 const checks=()=>`<div class="member-consents"><details><summary>개인정보 수집·이용 내용 보기</summary>${privacy}</details><label class="check"><input type="checkbox" name="privacy" required><span><b>[필수]</b> 개인정보 수집·이용에 동의합니다.</span></label><label class="check"><input type="checkbox" name="guardian" required><span><b>[필수]</b> 학생의 법정대리인으로서 학생 정보 처리에 동의합니다.</span></label><details><summary>광고성 정보 수신·이용 내용 보기</summary>${marketing}</details><label class="check"><input type="checkbox" name="marketing_email"><span>[선택] 이메일로 교육·행사 안내를 받겠습니다.</span></label><label class="check"><input type="checkbox" name="marketing_sms"><span>[선택] 문자로 교육·행사 안내를 받겠습니다.</span></label><p class="member-note">선택 동의를 하지 않아도 무료로 이용할 수 있습니다.</p></div>`;
 g.RoadmapPolicy={VERSION,privacy,marketing,checks};
})(window);
