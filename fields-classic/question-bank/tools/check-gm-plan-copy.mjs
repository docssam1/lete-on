// 관리자 화면의 GM 열기 미리보기(gm-plan.js)가 서버 규칙(supabase/functions/_shared/fields-membership.js)과 같은지 본다.
import { readFileSync } from "node:fs";
const root = new URL("../../../", import.meta.url);
const server = readFileSync(new URL("supabase/functions/_shared/fields-membership.js", root), "utf8");
const copy = readFileSync(new URL("fields-classic/question-bank/gm-plan.js", root), "utf8").split("\n").slice(2).join("\n");
if (copy !== server) { console.error("GM_PLAN_COPY_STALE — cp 로 다시 옮기세요(머리 두 줄은 남김)"); process.exit(1); }
console.log("GM_PLAN_COPY_OK");
