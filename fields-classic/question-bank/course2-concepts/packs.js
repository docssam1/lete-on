// 2과정 개념 꾸러미 목록 — 권마다 course2-concepts/<권>.js의 PACKS(「단원 번호/차시」 → 꾸러미 목록)
import { PACKS as G1 } from "./g1.js?v=20261123c";
import { PACKS as G2 } from "./g2.js?v=20261123c";
import { PACKS as G3 } from "./g3.js?v=20261123c";
import { PACKS as G4 } from "./g4.js?v=20261123c";
import { PACKS as G5 } from "./g5.js?v=20261123c";
import { PACKS as A1 } from "./a1.js?v=20261123c";
import { PACKS as A2 } from "./a2.js?v=20261123c";
import { PACKS as A3 } from "./a3.js?v=20261123c";
import { PACKS as A4 } from "./a4.js?v=20261123c";
import { PACKS as A5 } from "./a5.js?v=20261123c";
export const PACK_BOOKS = Object.freeze({ "course-02-g1": G1, "course-02-g2": G2, "course-02-g3": G3, "course-02-g4": G4, "course-02-g5": G5, "course-02-a1": A1, "course-02-a2": A2, "course-02-a3": A3, "course-02-a4": A4, "course-02-a5": A5 });
export const packsFor = (bookId, unitIndex, part) => PACK_BOOKS[bookId]?.[`${unitIndex}/${part}`] || [];
