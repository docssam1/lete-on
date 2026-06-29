/**
 * G-FIELD 로드맵 저장 서버 (Google Apps Script) — v2 (어드민 포함)
 * ENGINE_DESIGN.md 섹션 0-B 구현체
 *
 * ⚠️ 보안: 이 파일은 공개 저장소용 안전 버전입니다.
 *    SHEET_ID·ADMIN_KEY는 실제 값을 넣지 않습니다.
 *    실제 값은 Apps Script 편집기 안에서만 직접 입력하세요(아래 설정 참고).
 *
 * [역할]
 *  학부모용:
 *   - doGet ?code=GF1234           → 그 승인번호 데이터 반환 (불러오기, 자동)
 *   - doPost {action:'save', ...}   → 진도/커스텀 저장 (있으면 갱신, 없으면 추가)
 *  어드민용 (ADMIN_KEY 검증 필요):
 *   - doPost {action:'admin_list', key}            → 전체 학생 목록
 *   - doPost {action:'admin_detail', key, code}     → 특정 학생 전체 기록(진도+커스텀)
 *   - doPost {action:'admin_toggle_custom', key, code, value}  → 커스텀권한 ON/OFF
 *   - doPost {action:'admin_reset_edits', key, code, value}    → 재작성횟수 설정
 *   - doPost {action:'admin_add', key, code, name, phone}      → 승인번호 발급(새 학생)
 *
 * [시트 구조] 시트명 "roadmap" (첫 행 헤더)
 *  A 승인번호 | B 이름 | C 연락처 | D 진도JSON | E 커스텀JSON | F 재작성횟수 | G 커스텀권한 | H 생성일 | I 수정일
 *
 * [배포]
 *  1) 이 코드 복사 → script.google.com → 새 프로젝트 → 붙여넣기
 *  2) 아래 SHEET_ID·ADMIN_KEY에 실제 값 입력 (편집기 안에서만)
 *  3) 함수 "setup" 실행(▶) → 권한 허용 → 탭·헤더 자동 생성
 *  4) 배포 > 새 배포 > 웹앱 > 실행:나 / 액세스:모든 사용자 > 배포 → URL 복사
 *  ※ 코드 수정 시 "배포 관리 > 편집(연필) > 버전:새 버전 > 배포"로 재배포(URL 유지)
 *
 * [보안]
 *  - 학부모용은 승인번호만 있으면 자기 데이터 접근 (남의 번호 모르면 못 봄)
 *  - 어드민용은 ADMIN_KEY 일치해야만 동작
 *  - 커스텀권한(G열)은 어드민 엔드포인트로만 변경
 */

// ===== 설정 (Apps Script 편집기 안에서만 실제 값 입력) =====
const SHEET_ID = 'PUT_YOUR_SHEET_ID_HERE';       // Google Sheets ID
const SHEET_NAME = 'roadmap';
const MAX_EDITS = 2;                              // 재작성 최대 횟수
const ADMIN_KEY = 'PUT_YOUR_ADMIN_KEY_HERE';     // 어드민 로그인 키

// ===== 공통 =====
function getSheet_() {
  return SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
}

function findRow_(sheet, code) {
  const last = sheet.getLastRow();
  if (last < 2) return -1;
  const codes = sheet.getRange(2, 1, last - 1, 1).getValues();
  for (let i = 0; i < codes.length; i++) {
    if (String(codes[i][0]).trim() === String(code).trim()) return i + 2;
  }
  return -1;
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function safeParse_(s) {
  if (!s) return null;
  try { return JSON.parse(s); } catch (e) { return null; }
}

function rowToObj_(v) {
  return {
    code: v[0], name: v[1], phone: v[2],
    diag: safeParse_(v[3]), custom: safeParse_(v[4]),
    edits: Number(v[5]) || 0,
    customAllowed: v[6] === true || String(v[6]).toUpperCase() === 'TRUE',
    createdAt: v[7], updatedAt: v[8]
  };
}

// ===== 불러오기 (GET) — 학부모 =====
function doGet(e) {
  try {
    const code = e && e.parameter && e.parameter.code;
    if (!code) return json_({ ok: false, error: 'no_code' });
    const sheet = getSheet_();
    const row = findRow_(sheet, code);
    if (row === -1) return json_({ ok: true, found: false });
    const v = sheet.getRange(row, 1, 1, 9).getValues()[0];
    return json_(Object.assign({ ok: true, found: true }, rowToObj_(v)));
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

// ===== POST 라우터 (학부모 save + 어드민) =====
function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    const action = body.action || 'save';

    // --- 어드민 액션은 키 검증 ---
    if (action.indexOf('admin_') === 0) {
      if (body.key !== ADMIN_KEY) return json_({ ok: false, error: 'unauthorized' });
      return handleAdmin_(action, body);
    }

    // --- 학부모 저장 ---
    if (action === 'save') return handleSave_(body);

    return json_({ ok: false, error: 'unknown_action' });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

// ===== 학부모 저장 =====
function handleSave_(body) {
  const code = body.code;
  if (!code) return json_({ ok: false, error: 'no_code' });

  const sheet = getSheet_();
  const row = findRow_(sheet, code);
  const now = new Date();

  if (row === -1) {
    sheet.appendRow([
      code, body.name || '', body.phone || '',
      body.diag ? JSON.stringify(body.diag) : '',
      body.custom ? JSON.stringify(body.custom) : '',
      1, false, now, now
    ]);
    return json_({ ok: true, mode: 'created', edits: 1 });
  }

  const cur = sheet.getRange(row, 1, 1, 9).getValues()[0];
  let edits = Number(cur[5]) || 1;

  if (body.isNewWrite) {
    if (edits >= MAX_EDITS) {
      return json_({ ok: false, error: 'edit_limit', edits: edits, max: MAX_EDITS });
    }
    edits += 1;
  }

  const newDiag   = body.diag   ? JSON.stringify(body.diag)   : cur[3];
  const newCustom = body.custom ? JSON.stringify(body.custom) : cur[4];
  const newName   = body.name   || cur[1];
  const newPhone  = body.phone  || cur[2];

  sheet.getRange(row, 1, 1, 9).setValues([[
    code, newName, newPhone, newDiag, newCustom,
    edits, cur[6], cur[7] || now, now
  ]]);
  return json_({ ok: true, mode: 'updated', edits: edits });
}

// ===== 어드민 핸들러 =====
function handleAdmin_(action, body) {
  const sheet = getSheet_();

  // 학생 목록 (JSON 데이터는 무거우니 요약만; 필요시 code로 doGet)
  if (action === 'admin_list') {
    const last = sheet.getLastRow();
    if (last < 2) return json_({ ok: true, list: [] });
    const rows = sheet.getRange(2, 1, last - 1, 9).getValues();
    const list = rows.map(function (v) {
      return {
        code: v[0], name: v[1], phone: v[2],
        hasDiag: !!v[3], hasCustom: !!v[4],
        edits: Number(v[5]) || 0,
        customAllowed: v[6] === true || String(v[6]).toUpperCase() === 'TRUE',
        updatedAt: v[8]
      };
    });
    return json_({ ok: true, list: list });
  }

  // 특정 학생 전체 기록 상세 (목록에서 클릭 시)
  if (action === 'admin_detail') {
    const row = findRow_(sheet, body.code);
    if (row === -1) return json_({ ok: false, error: 'not_found' });
    const v = sheet.getRange(row, 1, 1, 9).getValues()[0];
    return json_(Object.assign({ ok: true }, rowToObj_(v)));
  }

  // 커스텀 권한 토글
  if (action === 'admin_toggle_custom') {
    const row = findRow_(sheet, body.code);
    if (row === -1) return json_({ ok: false, error: 'not_found' });
    sheet.getRange(row, 7).setValue(body.value === true || body.value === 'true');
    return json_({ ok: true, code: body.code, customAllowed: !!body.value });
  }

  // 재작성 횟수 설정(리셋)
  if (action === 'admin_reset_edits') {
    const row = findRow_(sheet, body.code);
    if (row === -1) return json_({ ok: false, error: 'not_found' });
    const val = (body.value === undefined) ? 0 : Number(body.value);
    sheet.getRange(row, 6).setValue(val);
    return json_({ ok: true, code: body.code, edits: val });
  }

  // 승인번호 발급 (새 학생 추가)
  if (action === 'admin_add') {
    if (!body.code) return json_({ ok: false, error: 'no_code' });
    if (findRow_(sheet, body.code) !== -1) return json_({ ok: false, error: 'already_exists' });
    const now = new Date();
    sheet.appendRow([
      body.code, body.name || '', body.phone || '',
      '', '', 0, false, now, now
    ]);
    return json_({ ok: true, code: body.code, mode: 'added' });
  }

  return json_({ ok: false, error: 'unknown_admin_action' });
}

// ===== 최초 1회 실행: 탭 이름 + 헤더 자동 세팅 =====
// 배포 전, Apps Script 편집기 상단에서 함수 "setup"을 선택하고 실행(▶) 한 번.
function setup() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    // 기본 시트(시트1/Sheet1)가 있으면 이름 변경, 없으면 새로 생성
    const first = ss.getSheets()[0];
    if (first && ss.getSheetByName(SHEET_NAME) == null && ss.getSheets().length === 1) {
      first.setName(SHEET_NAME);
      sheet = first;
    } else {
      sheet = ss.insertSheet(SHEET_NAME);
    }
  }
  const headers = ['승인번호','이름','연락처','진도JSON','커스텀JSON','재작성횟수','커스텀권한','생성일','수정일'];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
  sheet.setFrozenRows(1);
  SpreadsheetApp.flush();
  return '세팅 완료: 탭 "' + SHEET_NAME + '" + 헤더 9개';
}
