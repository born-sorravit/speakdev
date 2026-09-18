import type {
  AnswerEvaluation,
  ConversationMessage,
  ConversationScenario,
  EnglishLevel,
  Lesson,
  Mistake,
  VocabularyItem,
} from "@/lib/types";

/** Everything the tutor knows about the learner when it makes a decision. */
export interface LearnerContext {
  level: EnglishLevel;
  /** Mistakes the learner keeps making, so the tutor can watch for them (§10). */
  recentMistakes: Mistake[];
  /** Words the learner is still shaky on, for reuse in prompts (§10). */
  weakVocabulary: string[];
}

export interface EvaluateAnswerInput {
  /** What the learner wrote or said. */
  answer: string;
  /** The question they were answering. */
  question: string;
  /** A model answer, when the lesson provides one. */
  sampleAnswer?: string;
  /** Patterns the current lesson is drilling, e.g. `I'm working on ...`. */
  targetPatterns?: string[];
  context: LearnerContext;
}

export interface GenerateConversationInput {
  scenario: ConversationScenario;
  history: ConversationMessage[];
  context: LearnerContext;
}

export interface ConversationTurn {
  /** The coach's reply. */
  content: string;
  translationTh: string;
  /** Correction for the learner's last message, when one is warranted. */
  correction?: AnswerEvaluation;
}

export interface ConversationReport {
  turns: number;
  strengths: string[];
  strengthsTh: string[];
  focusNext: string[];
  focusNextTh: string[];
  xpEarned: number;
}

export interface ReviewExercise {
  id: string;
  /** The learner fixes this sentence. */
  prompt: string;
  promptTh: string;
  brokenSentence: string;
  expected: string;
  sourceMistakeId?: string;
}

/**
 * The single seam between the UI and whichever model is behind it (§24).
 *
 * Every method is async and returns plain data, so a provider can be a local
 * rule engine, an HTTP call to the NestJS backend, or a direct model call —
 * the components never know which.
 */
export interface AIService {
  generateLesson(day: number, context: LearnerContext): Promise<Lesson | null>;
  evaluateAnswer(input: EvaluateAnswerInput): Promise<AnswerEvaluation>;
  correctSentence(
    sentence: string,
    context: LearnerContext,
  ): Promise<AnswerEvaluation>;
  generateConversation(
    input: GenerateConversationInput,
  ): Promise<ConversationTurn>;
  evaluateConversation(
    messages: ConversationMessage[],
    context: LearnerContext,
  ): Promise<ConversationReport>;
  generateReview(
    context: LearnerContext,
  ): Promise<{ exercises: ReviewExercise[]; words: VocabularyItem[] }>;
}
