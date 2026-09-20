import {
  AGE_STAGES,
  DOMAINS,
  ACADEMY_STYLES,
  TYPES,
  EXAMS,
  PRACTICE_EXAM_TYPES,
  DIAGNOSTIC_EXAM_TYPES,
  FINAL_EXAM_TYPES,
  CURRICULUM,
  SOURCE_QUESTION_INDEX,
  TEXTBOOK_STAGES,
  questionClassificationForType,
  representativeConceptForType,
  textbookGuideForType
} from "./source-data.js?v=20260920a";
import { defineQuestionBankAdapter } from "./question-bank-adapter.js?v=20260918a";

export const FIELDS_QUESTION_BANK_ADAPTER = defineQuestionBankAdapter({
  id: "fields-classic",
  label: "필즈 더 클래식",
  types: TYPES,
  sourceItems: SOURCE_QUESTION_INDEX,
  catalog: {
    ageStages: AGE_STAGES,
    domains: DOMAINS,
    academyStyles: ACADEMY_STYLES,
    exams: EXAMS,
    practiceExamTypes: PRACTICE_EXAM_TYPES,
    diagnosticExamTypes: DIAGNOSTIC_EXAM_TYPES,
    finalExamTypes: FINAL_EXAM_TYPES,
    curriculum: CURRICULUM,
    textbookStages: TEXTBOOK_STAGES
  },
  services: {
    questionClassificationForType,
    representativeConceptForType,
    textbookGuideForType
  },
  capabilities: {
    sourceDataImplementation: "fields-source-index",
    productRendererRouter: true
  }
});
