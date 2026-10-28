// 1권 권별 테스트 원문(다시 짠 것) — 문항·그림은 book01-unit-test-generators.js 의 book01UnitTestOriginal, 그림은 book01Markup
import { book01UnitTestOriginal, BOOK01_UNIT_TEST_ORIGINAL_NUMBERS } from "../book01-unit-test-generators.js?v=20261028zb";
import { book01Markup } from "../book01-renderers.js?v=20261028za";
export const numbers = BOOK01_UNIT_TEST_ORIGINAL_NUMBERS;
export const get = book01UnitTestOriginal;
export const figure = book01Markup;
