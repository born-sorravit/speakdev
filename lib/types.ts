/**
 * Domain model for the English-coaching app.
 *
 * These shapes mirror the database models in the product brief (§25) so the
 * mock data layer can be swapped for a real NestJS/PostgreSQL backend without
 * touching the UI.
 */

export type Locale = "en" | "th";

export type EnglishLevel = "A1" | "A2" | "B1" | "B2";

export const ENGLISH_LEVELS: EnglishLevel[] = ["A1", "A2", "B1", "B2"];

export type LessonCategory =
  | "basics"
  | "self"
  | "time"
  | "conversation"
  | "standup"
  | "bugs"
  | "meetings"
  | "technical"
  | "workplace"
  | "project"
  | "interview";

export type LessonStatus = "locked" | "available" | "in_progress" | "completed";

/** A bilingual string. Lesson content is always shown in both languages. */
export interface Bilingual {
  en: string;
  th: string;
}

export interface Phrase {
  id: string;
  en: string;
  th: string;
  /** Light pronunciation hint written for Thai speakers. */
  pronunciation?: string;
  /** Plain-Thai explanation of when to use it — never grammar jargon (§9 Stage 2). */
  usageTh: string;
}

export interface PracticePrompt {
  id: string;
  /** The question the coach asks the learner. */
  question: string;
  questionTh: string;
  /** Sentence starters offered when the learner freezes. */
  hints: string[];
  /** A model answer used by the mock evaluator as a reference. */
  sampleAnswer: string;
}

export interface Lesson {
  id: string;
  /** 1-based day in the 90-day program. */
  day: number;
  month: 1 | 2 | 3;
  week: number;
  title: Bilingual;
  description: Bilingual;
  level: EnglishLevel;
  category: LessonCategory;
  estimatedMinutes: number;
  /** The sentence patterns this lesson drills. */
  patterns: string[];
  phrases: Phrase[];
  practice: PracticePrompt[];
  vocabularyIds: string[];
}

export type VocabularyCategory =
  | "general"
  | "workplace"
  | "developer"
  | "meeting"
  | "interview"
  | "technical";

export interface VocabularyItem {
  id: string;
  word: string;
  meaning: string;
  meaningTh: string;
  example: string;
  exampleTh: string;
  category: VocabularyCategory;
  level: EnglishLevel;
}

/** Per-user spaced-repetition state for one vocabulary item (§17, §18). */
export interface UserVocabulary {
  vocabularyId: string;
  /** 0 = new, 5 = mastered. Drives the review interval. */
  mastery: number;
  reviewCount: number;
  lastReviewedAt: string | null;
  nextReviewAt: string | null;
}

export type MistakeCategory =
  | "grammar"
  | "vocabulary"
  | "naturalness"
  | "word_order"
  | "tense"
  | "article"
  | "preposition";

export interface Mistake {
  id: string;
  originalText: string;
  correctedText: string;
  category: MistakeCategory;
  /** Why it was wrong, in Thai (§10). */
  explanationTh: string;
  createdAt: string;
  /** How many times the learner has made this same mistake. */
  occurrences: number;
  resolved: boolean;
}

export type ScenarioGroup = "beginner" | "workplace" | "developer" | "interview";

export interface ConversationScenario {
  id: string;
  group: ScenarioGroup;
  title: Bilingual;
  description: Bilingual;
  level: EnglishLevel;
  /** Emoji shown on the scenario card. */
  icon: string;
  /** The coach's opening line. */
  opener: string;
  openerTh: string;
  /** Guides the mock (and later, the real) tutor's follow-up questions. */
  followUps: string[];
}

export type ChatRole = "coach" | "learner";

export interface ConversationMessage {
  id: string;
  role: ChatRole;
  content: string;
  /** Thai gloss of a coach message, revealed on demand. */
  translationTh?: string;
  correction?: AnswerEvaluation;
  createdAt: string;
}

/**
 * The structured evaluation the AI returns for a learner's sentence.
 * Field-for-field the JSON contract in the brief (§26).
 */
export interface AnswerEvaluation {
  isCorrect: boolean;
  original: string;
  corrected: string;
  explanationThai: string;
  naturalAlternative: string;
  importantMistakes: Array<{
    type: MistakeCategory;
    description: string;
    descriptionTh: string;
  }>;
  encouragement: string;
  encouragementTh: string;
  retryRequired: boolean;
  /** 0–100, used for the XP award and the skill bars. */
  score: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  nativeLanguage: string;
  englishLevel: EnglishLevel;
  occupation: string;
  dailyGoalMinutes: 10 | 20 | 30 | 45;
  preferredTopics: string[];
}

export interface DailyActivity {
  /** ISO date, YYYY-MM-DD. */
  date: string;
  speakingMinutes: number;
  conversationMinutes: number;
  lessonsCompleted: number;
  wordsReviewed: number;
  xp: number;
}

export interface SkillScores {
  speaking: number;
  listening: number;
  vocabulary: number;
  grammar: number;
  conversation: number;
  workplace: number;
}
