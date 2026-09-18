import { applyRules, tidyPunctuation } from "./correction-rules";
import type {
  AIService,
  ConversationReport,
  ConversationTurn,
  EvaluateAnswerInput,
  GenerateConversationInput,
  LearnerContext,
  ReviewExercise,
} from "./types";
import { LESSONS } from "@/lib/data/lessons";
import { VOCABULARY } from "@/lib/data/vocabulary";
import type {
  AnswerEvaluation,
  ConversationMessage,
  Lesson,
  VocabularyItem,
} from "@/lib/types";

/** Stand-in for network latency, so loading states are exercised in dev. */
function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function wordCount(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

const ENCOURAGEMENT_GOOD = [
  {
    en: "That's a clear, natural sentence. Nice.",
    th: "ประโยคชัดเจนและเป็นธรรมชาติมาก เยี่ยมเลย",
  },
  {
    en: "Well said — a native speaker would say it just like that.",
    th: "พูดได้ดีมาก เจ้าของภาษาก็พูดแบบนี้เลย",
  },
  {
    en: "Good one. Your meaning came through straight away.",
    th: "ดีมาก สิ่งที่คุณจะสื่อเข้าใจได้ทันที",
  },
];

const ENCOURAGEMENT_ALMOST = [
  {
    en: "Good try! Your meaning was clear.",
    th: "พยายามได้ดี! สิ่งที่คุณจะสื่อเข้าใจได้นะ",
  },
  {
    en: "Nearly there — one small fix and it's perfect.",
    th: "เกือบแล้ว แก้นิดเดียวก็สมบูรณ์",
  },
  {
    en: "I understood you. Let's tighten it up a little.",
    th: "โค้ชเข้าใจที่คุณพูดนะ มาปรับให้เป๊ะขึ้นอีกนิด",
  },
];

/** Deterministic pick, so the same answer always gets the same wording. */
function pickBy<T>(items: T[], seed: string): T {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return items[hash % items.length];
}

/**
 * Suggests a more idiomatic phrasing once the sentence is already correct.
 * Keyed to the patterns the curriculum drills, so the advice stays on-topic.
 */
function naturalAlternativeFor(sentence: string): string {
  const s = sentence.toLowerCase();

  if (/\bi'?m working on\b/.test(s)) {
    return sentence.replace(
      /\bI'm working on\b/i,
      "I'm currently working on",
    );
  }
  if (/\bi am\b/.test(s) && !/\bi'm\b/.test(s)) {
    return sentence.replace(/\bI am\b/g, "I'm");
  }
  if (/^i think\b/i.test(sentence)) {
    return sentence.replace(/^I think\b/i, "I'd say");
  }
  if (/\bi don't know\b/i.test(s)) {
    return sentence.replace(/\bI don't know\b/i, "I'm not sure");
  }
  if (/\bi can't\b/i.test(s)) {
    return sentence.replace(/\bI can't\b/i, "I'm not able to");
  }
  if (/\bi have a problem\b/i.test(s)) {
    return sentence.replace(/\bI have a problem\b/i, "I've run into an issue");
  }
  return sentence;
}

function buildEvaluation(
  original: string,
  opts: { question?: string; targetPatterns?: string[] } = {},
): AnswerEvaluation {
  const trimmed = original.trim();

  if (!trimmed) {
    return {
      isCorrect: false,
      original,
      corrected: "",
      explanationThai: "ยังไม่ได้พิมพ์คำตอบเลย ลองตอบสั้น ๆ ก่อนก็ได้",
      naturalAlternative: "",
      importantMistakes: [],
      encouragement: "Write anything you can — even three words is a start.",
      encouragementTh: "เขียนเท่าที่นึกออกก่อนได้เลย แค่สามคำก็เริ่มได้แล้ว",
      retryRequired: true,
      score: 0,
    };
  }

  const { corrected: ruleCorrected, hits } = applyRules(trimmed);
  const { text: corrected } = tidyPunctuation(ruleCorrected);
  const { text: normalisedOriginal } = tidyPunctuation(trimmed);

  const importantMistakes = hits.map(({ rule }) => ({
    type: rule.category,
    description: rule.description,
    descriptionTh: rule.descriptionTh,
  }));

  // Score starts full and is docked per rule; very short answers lose a little
  // too, because a three-word reply does not yet show you can hold a turn.
  const penalty = hits.reduce((sum, { rule }) => sum + rule.weight, 0);
  const words = wordCount(trimmed);
  const brevityPenalty = words < 4 ? 12 : 0;
  const score = Math.max(15, Math.min(100, 100 - penalty - brevityPenalty));

  const isCorrect = hits.length === 0;
  const alternative = naturalAlternativeFor(corrected);

  // Only ask for a retry when something that affects meaning was wrong —
  // the brief is explicit about not correcting every tiny slip (§10).
  const retryRequired = hits.some(({ rule }) => rule.weight >= 15);

  let explanationThai: string;
  if (hits.length > 0) {
    explanationThai = hits.map(({ rule }) => rule.descriptionTh).join(" · ");
  } else if (brevityPenalty > 0) {
    explanationThai =
      "ประโยคถูกต้องแล้ว ลองขยายอีกนิดให้ยาวขึ้น จะฟังดูเป็นธรรมชาติกว่า เช่น เติมว่าทำอะไร ที่ไหน หรือเมื่อไหร่";
  } else if (alternative !== corrected) {
    explanationThai =
      "ประโยคนี้ถูกต้องแล้ว ลองดูอีกแบบด้านล่าง จะฟังดูเป็นธรรมชาติขึ้นอีกนิด";
  } else {
    explanationThai = "ประโยคนี้ถูกต้องและเป็นธรรมชาติดีแล้ว";
  }

  // Nudge toward the lesson's target pattern when the learner sidestepped it.
  const usedPattern = opts.targetPatterns?.some((pattern) => {
    const stem = pattern.replace(/\s*\.\.\.\s*$/, "").toLowerCase();
    return stem.length > 3 && corrected.toLowerCase().includes(stem);
  });
  if (opts.targetPatterns?.length && !usedPattern && isCorrect) {
    explanationThai += ` ลองใช้รูปประโยคของบทนี้ดูด้วย: "${opts.targetPatterns[0]}"`;
  }

  const encouragement = isCorrect
    ? pickBy(ENCOURAGEMENT_GOOD, trimmed)
    : pickBy(ENCOURAGEMENT_ALMOST, trimmed);

  return {
    isCorrect,
    original: normalisedOriginal,
    corrected,
    explanationThai,
    naturalAlternative: alternative === corrected ? "" : alternative,
    importantMistakes,
    encouragement: encouragement.en,
    encouragementTh: encouragement.th,
    retryRequired,
    score,
  };
}

/**
 * Chooses the coach's next line.
 *
 * Real providers will generate this; here it walks the scenario's follow-up
 * list and reacts to what the learner actually mentioned, which is enough to
 * feel responsive without pretending to be a model.
 */
function nextCoachLine(input: GenerateConversationInput): {
  content: string;
  translationTh: string;
} {
  const { scenario, history } = input;
  const learnerTurns = history.filter((m) => m.role === "learner");
  const last = learnerTurns.at(-1)?.content.toLowerCase() ?? "";

  // React to a few common openings so the reply does not feel canned.
  if (/\b(i don'?t know|not sure|hard to say)\b/.test(last)) {
    return {
      content:
        "That's completely fine. Take your time — try answering in one short sentence.",
      translationTh:
        "ไม่เป็นไรเลย ค่อย ๆ คิดได้ ลองตอบเป็นประโยคสั้น ๆ ประโยคเดียวก่อนก็ได้",
    };
  }
  if (/\b(repeat|say again|slowly|didn'?t understand|pardon)\b/.test(last)) {
    return {
      content: "Of course. Let me say it again, more slowly this time.",
      translationTh: "ได้เลย เดี๋ยวโค้ชพูดใหม่ช้า ๆ อีกครั้งนะ",
    };
  }

  const index = Math.max(0, learnerTurns.length - 1);
  if (index < scenario.followUps.length) {
    return {
      content: scenario.followUps[index],
      translationTh: "",
    };
  }

  return {
    content:
      "That's a good place to stop. You held the whole conversation in English — well done.",
    translationTh:
      "จบตรงนี้กำลังดีเลย คุณคุยเป็นภาษาอังกฤษได้ตลอดทั้งบทสนทนา เก่งมาก",
  };
}

/**
 * Local rule-driven provider used for the whole UI build (§33: "use mock data
 * initially, do not require a real AI API"). Swap this for an HTTP provider
 * and nothing in the components changes.
 */
export class MockAIProvider implements AIService {
  async generateLesson(day: number): Promise<Lesson | null> {
    await delay(120);
    return LESSONS.find((lesson) => lesson.day === day) ?? null;
  }

  async evaluateAnswer(input: EvaluateAnswerInput): Promise<AnswerEvaluation> {
    await delay(650);
    return buildEvaluation(input.answer, {
      question: input.question,
      targetPatterns: input.targetPatterns,
    });
  }

  async correctSentence(sentence: string): Promise<AnswerEvaluation> {
    await delay(500);
    return buildEvaluation(sentence);
  }

  async generateConversation(
    input: GenerateConversationInput,
  ): Promise<ConversationTurn> {
    await delay(800);

    const lastLearner = input.history.filter((m) => m.role === "learner").at(-1);
    const line = nextCoachLine(input);

    let correction: AnswerEvaluation | undefined;
    if (lastLearner) {
      const evaluation = buildEvaluation(lastLearner.content);
      // In conversation the coach stays quiet unless the mistake matters —
      // interrupting every turn is what makes learners freeze (§10).
      if (!evaluation.isCorrect && evaluation.retryRequired) {
        correction = evaluation;
      }
    }

    return { ...line, correction };
  }

  async evaluateConversation(
    messages: ConversationMessage[],
  ): Promise<ConversationReport> {
    await delay(700);

    const learnerTurns = messages.filter((m) => m.role === "learner");
    const evaluations = learnerTurns.map((m) => buildEvaluation(m.content));
    const clean = evaluations.filter((e) => e.isCorrect).length;
    const averageWords =
      learnerTurns.reduce((sum, m) => sum + wordCount(m.content), 0) /
      Math.max(1, learnerTurns.length);

    const strengths: string[] = [];
    const strengthsTh: string[] = [];
    if (clean > 0) {
      strengths.push(`${clean} of your ${learnerTurns.length} replies were spot on.`);
      strengthsTh.push(`คุณตอบถูกต้อง ${clean} จาก ${learnerTurns.length} ครั้ง`);
    }
    if (averageWords >= 8) {
      strengths.push("You gave full answers instead of one-word replies.");
      strengthsTh.push("คุณตอบเป็นประโยคเต็ม ไม่ได้ตอบสั้น ๆ คำเดียว");
    }
    if (strengths.length === 0) {
      strengths.push("You kept the conversation going in English the whole way.");
      strengthsTh.push("คุณคุยเป็นภาษาอังกฤษได้ตลอดทั้งบทสนทนา");
    }

    const mistakeTypes = new Map<string, string>();
    for (const evaluation of evaluations) {
      for (const mistake of evaluation.importantMistakes) {
        mistakeTypes.set(mistake.description, mistake.descriptionTh);
      }
    }

    const focusNext = [...mistakeTypes.keys()].slice(0, 3);
    const focusNextTh = [...mistakeTypes.values()].slice(0, 3);
    if (focusNext.length === 0) {
      focusNext.push("Try a harder scenario next time.");
      focusNextTh.push("ครั้งหน้าลองสถานการณ์ที่ยากขึ้นได้เลย");
    }

    return {
      turns: learnerTurns.length,
      strengths,
      strengthsTh,
      focusNext,
      focusNextTh,
      xpEarned: 30 + learnerTurns.length * 2,
    };
  }

  async generateReview(
    context: LearnerContext,
  ): Promise<{ exercises: ReviewExercise[]; words: VocabularyItem[] }> {
    await delay(400);

    // Turn the learner's own recorded mistakes back into exercises (§16).
    const exercises: ReviewExercise[] = context.recentMistakes
      .filter((mistake) => !mistake.resolved)
      .slice(0, 5)
      .map((mistake) => ({
        id: `ex-${mistake.id}`,
        prompt: "Fix this sentence",
        promptTh: "แก้ประโยคนี้ให้ถูกต้อง",
        brokenSentence: mistake.originalText,
        expected: mistake.correctedText,
        sourceMistakeId: mistake.id,
      }));

    const words = VOCABULARY.filter((word) =>
      context.weakVocabulary.includes(word.id),
    ).slice(0, 5);

    return { exercises, words };
  }
}
