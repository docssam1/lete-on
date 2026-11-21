// 2과정 개념 꾸러미 목록 — 권마다 course2-concepts/<권>.js의 PACKS(「단원 번호/차시」 → 꾸러미 목록)
import { PACKS as G1 } from "./g1.js?v=20261121g";
import { PACKS as G2 } from "./g2.js?v=20261121h";
import { PACKS as G3 } from "./g3.js?v=20261121i";
export const PACK_BOOKS = Object.freeze({ "course-02-g1": G1, "course-02-g2": G2, "course-02-g3": G3 });
export const packsFor = (bookId, unitIndex, part) => PACK_BOOKS[bookId]?.[`${unitIndex}/${part}`] || [];
