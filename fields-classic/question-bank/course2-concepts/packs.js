// 2과정 개념 꾸러미 목록 — 권마다 course2-concepts/<권>.js의 PACKS(「단원 번호/차시」 → 꾸러미 목록)
import { PACKS as G1 } from "./g1.js?v=20261121f";
export const PACK_BOOKS = Object.freeze({ "course-02-g1": G1 });
export const packsFor = (bookId, unitIndex, part) => PACK_BOOKS[bookId]?.[`${unitIndex}/${part}`] || [];
