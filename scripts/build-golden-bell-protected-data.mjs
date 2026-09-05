import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const [sourceArg, publicArg, privateArg] = process.argv.slice(2);
if (!sourceArg || !publicArg || !privateArg) {
  throw new Error("Usage: node build-golden-bell-protected-data.mjs <source-module> <public-module> <private-json>");
}

const sourcePath = resolve(sourceArg);
const publicPath = resolve(publicArg);
const privatePath = resolve(privateArg);
const { GOLDEN_BELL_BOOKS } = await import(`${pathToFileURL(sourcePath).href}?build=${Date.now()}`);

const privateBooks = {};

function sanitize(value, path, records) {
  if (Array.isArray(value)) return value.map((item, index) => sanitize(item, `${path}/${index}`, records));
  if (!value || typeof value !== "object") return value;

  const hasAnswer = Object.hasOwn(value, "answer");
  const hasSolution = Object.hasOwn(value, "solution");
  const hasAnswerExplanation = hasAnswer && Object.hasOwn(value, "explanation");
  const answerRef = hasAnswer || hasSolution ? path : null;
  if (answerRef) {
    records[answerRef] = {
      ...(hasAnswer ? { answer: value.answer } : {}),
      ...(hasSolution ? { solution: value.solution } : {}),
      ...(hasAnswerExplanation ? { explanation: value.explanation } : {})
    };
  }

  const output = {};
  for (const [key, child] of Object.entries(value)) {
    if (key === "answer" || key === "solution" || (key === "explanation" && hasAnswer)) continue;
    output[key] = sanitize(child, `${path}/${key}`, records);
  }
  if (answerRef) output.answerRef = answerRef;
  return output;
}

const publicBooks = GOLDEN_BELL_BOOKS.map((book) => {
  const records = {};
  const publicBook = sanitize(book, `/books/${book.id}`, records);
  privateBooks[book.id] = records;
  return publicBook;
});

const publicModule = `/* Generated public Golden Bell data. Answers and worked solutions are intentionally excluded. */\nexport const GOLDEN_BELL_BOOKS = Object.freeze(${JSON.stringify(publicBooks)});\n\nexport const goldenBellBookById = (id) => GOLDEN_BELL_BOOKS.find((book) => book.id === id) || GOLDEN_BELL_BOOKS[0];\n`;
const privatePayload = {
  schemaVersion: 1,
  generatedAt: new Date().toISOString(),
  source: "fields-classic-course1-golden-bell",
  books: privateBooks
};

await mkdir(dirname(publicPath), { recursive: true });
await mkdir(dirname(privatePath), { recursive: true });
await writeFile(publicPath, publicModule, "utf8");
await writeFile(privatePath, `${JSON.stringify(privatePayload, null, 2)}\n`, "utf8");

const answerRecordCount = Object.values(privateBooks).reduce((sum, records) => sum + Object.keys(records).length, 0);
const lessonCount = publicBooks.reduce((sum, book) => sum + book.lessons.length, 0);
console.log(JSON.stringify({ books: publicBooks.length, lessons: lessonCount, answerRecordCount, publicPath, privatePath }));
