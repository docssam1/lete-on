export const FIELDS_GOLDEN_BELL_BOOK_ID_PATTERN = /^(?:book-[0-9]{2}|course-(?:02|03)-[ag][1-9][0-9]*)$/u;

export function isFieldsGoldenBellBookId(value) {
  return FIELDS_GOLDEN_BELL_BOOK_ID_PATTERN.test(String(value || ""));
}
