import type { MistakeCategory } from "@/lib/types";

/**
 * Rule-based stand-in for the model's grammar pass.
 *
 * The rules are deliberately narrow: they target the mistakes Thai speakers
 * actually make in English, starting with the three pairs named in the brief
 * (§16) — `I working`, `Yesterday I work`, `3 years experience` — and widening
 * to the interference patterns that come from Thai having no articles, no verb
 * inflection and no tense marking on the verb itself.
 *
 * Each rule explains itself in Thai, because that is what the learner reads.
 */
export interface CorrectionRule {
  id: string;
  category: MistakeCategory;
  /** Must carry the `g` flag; `apply` relies on replace-all. */
  pattern: RegExp;
  replace: (...args: string[]) => string;
  description: string;
  descriptionTh: string;
  /** How much this costs the score. Meaning-breaking rules cost more (§10). */
  weight: number;
}

const IRREGULAR_PAST: Record<string, string> = {
  go: "went",
  do: "did",
  have: "had",
  make: "made",
  write: "wrote",
  read: "read",
  find: "found",
  build: "built",
  run: "ran",
  send: "sent",
  get: "got",
  take: "took",
  meet: "met",
  see: "saw",
  begin: "began",
  spend: "spent",
  think: "thought",
  break: "broke",
  come: "came",
  leave: "left",
  teach: "taught",
  catch: "caught",
  bring: "brought",
  understand: "understood",
};

function toPast(verb: string): string {
  const lower = verb.toLowerCase();
  if (IRREGULAR_PAST[lower]) return IRREGULAR_PAST[lower];
  if (lower.endsWith("e")) return `${lower}d`;
  if (/[^aeiou]y$/.test(lower)) return `${lower.slice(0, -1)}ied`;
  // Single-syllable CVC doubles the final consonant: plan → planned.
  if (/^[^aeiou]*[aeiou][^aeiouwxy]$/.test(lower)) {
    return `${lower}${lower.slice(-1)}ed`;
  }
  return `${lower}ed`;
}

export const CORRECTION_RULES: CorrectionRule[] = [
  {
    id: "missing-be-progressive",
    category: "grammar",
    // "I working on ..." — Thai has no auxiliary verb, so `am` goes missing.
    pattern: /\b(I)\s+(working|doing|making|writing|fixing|testing|building|reading|trying|waiting|looking|learning|studying|coding|debugging|deploying|reviewing)\b/g,
    replace: (_m, subject: string, verb: string) => `${subject}'m ${verb}`,
    description: "Missing 'am' before the -ing verb",
    descriptionTh:
      "ขาด am — ภาษาอังกฤษต้องมี verb to be คู่กับกริยา -ing เสมอ พูดว่า I'm working ไม่ใช่ I working",
    weight: 22,
  },
  {
    id: "missing-be-progressive-other",
    category: "grammar",
    pattern: /\b(he|she|it)\s+(working|doing|making|writing|fixing|testing|building|trying|waiting|looking|learning|coding|debugging|deploying)\b/gi,
    replace: (_m, subject: string, verb: string) =>
      `${subject} is ${verb}`,
    description: "Missing 'is' before the -ing verb",
    descriptionTh: "ขาด is — he/she/it ต้องใช้ is คู่กับกริยา -ing",
    weight: 20,
  },
  {
    id: "missing-be-plural",
    category: "grammar",
    pattern: /\b(we|they|you)\s+(working|doing|making|writing|fixing|testing|building|trying|waiting|looking|learning|coding|debugging|deploying)\b/gi,
    replace: (_m, subject: string, verb: string) => `${subject} are ${verb}`,
    description: "Missing 'are' before the -ing verb",
    descriptionTh: "ขาด are — we/they/you ต้องใช้ are คู่กับกริยา -ing",
    weight: 20,
  },
  {
    id: "past-time-marker",
    category: "tense",
    // "Yesterday I work on ..." — Thai marks past with a time word, not the verb.
    pattern: /\b(yesterday|last night|last week|last month|last year|two days ago|a week ago)\s*,?\s+(I|we|he|she|they|you)\s+(work|go|do|finish|fix|start|build|write|deploy|test|review|try|talk|meet|call|send|read|make|have|spend|find|check|update|discuss)\b/gi,
    replace: (_m, when: string, subject: string, verb: string) =>
      `${when}, ${subject} ${toPast(verb)}`,
    description: "Past time word needs the past form of the verb",
    descriptionTh:
      "เมื่อมีคำบอกเวลาอดีต เช่น yesterday ต้องเปลี่ยนกริยาเป็นช่องที่ 2 ด้วย ภาษาไทยไม่ต้องผันกริยา แต่ภาษาอังกฤษต้องผัน",
    weight: 20,
  },
  {
    id: "years-of-experience",
    category: "grammar",
    pattern: /\b(\d+|one|two|three|four|five|six|seven|eight|nine|ten)\s+years?\s+experience\b/gi,
    replace: (_m, n: string) => `${n} years of experience`,
    description: "Missing 'of' in 'years of experience'",
    descriptionTh:
      "ต้องมี of เสมอ — พูดว่า 3 years of experience ไม่ใช่ 3 years experience",
    weight: 10,
  },
  {
    id: "article-before-known-noun",
    category: "article",
    // Thai has no articles, so `the` disappears in front of specific things.
    pattern: /\b(on|in|to|for|with|from|about)\s+(payment|login|search|booking|admin|user|auth|checkout|notification|report|dashboard|profile)\s+(api|page|service|module|screen|feature|endpoint|flow|form|system)\b/gi,
    replace: (_m, prep: string, noun: string, head: string) =>
      `${prep} the ${noun} ${head}`,
    description: "Missing 'the' before a specific thing",
    descriptionTh:
      "เมื่อพูดถึงสิ่งที่ทั้งสองฝ่ายรู้ว่าหมายถึงอันไหน ต้องใส่ the ข้างหน้า ภาษาไทยไม่มี the จึงมักลืมกัน",
    weight: 12,
  },
  {
    id: "am-agree",
    category: "grammar",
    pattern: /\b(I\s*(?:'m|\s+am)|we\s+are|they\s+are)\s+agree\b/gi,
    replace: (_m, subject: string) => {
      const head = subject.trim().split(/[\s']/)[0];
      return `${head} agree`;
    },
    description: "'Agree' is a verb — it does not take 'am/are'",
    descriptionTh:
      "agree เป็นกริยาอยู่แล้ว ไม่ต้องมี am/are นำหน้า พูดว่า I agree ไม่ใช่ I am agree",
    weight: 15,
  },
  {
    id: "interested-in",
    category: "vocabulary",
    pattern: /\b(I|we|they)\s*('m|\s+am|\s+are)\s+interesting\s+in\b/gi,
    replace: (_m, subject: string, be: string) =>
      `${subject}${be.startsWith("'") ? be : ` ${be.trim()}`} interested in`,
    description: "'Interested' describes you; 'interesting' describes the thing",
    descriptionTh:
      "ถ้าเราเป็นคนรู้สึกสนใจ ใช้ interested — ส่วน interesting ใช้กับสิ่งที่น่าสนใจ",
    weight: 12,
  },
  {
    id: "discuss-about",
    category: "preposition",
    pattern: /\bdiscuss(ed|ing)?\s+about\b/gi,
    replace: (_m, suffix: string | undefined) => `discuss${suffix ?? ""}`,
    description: "'Discuss' does not take 'about'",
    descriptionTh:
      "discuss ตามด้วยสิ่งที่คุยได้เลย ไม่ต้องมี about — พูดว่า discuss the design",
    weight: 10,
  },
  {
    id: "explain-me",
    category: "preposition",
    pattern: /\bexplain\s+(me|us|him|her|them)\b/gi,
    replace: (_m, who: string) => `explain to ${who}`,
    description: "'Explain' needs 'to' before the person",
    descriptionTh:
      "explain ต้องมี to ก่อนคน — พูดว่า explain to me ไม่ใช่ explain me",
    weight: 10,
  },
  {
    id: "can-to",
    category: "grammar",
    pattern: /\b(can|could|should|must|will|would|might)\s+to\s+([a-z]+)\b/gi,
    replace: (_m, modal: string, verb: string) => `${modal} ${verb}`,
    description: "No 'to' after a modal verb",
    descriptionTh:
      "หลัง can/should/will ใช้กริยารูปปกติได้เลย ไม่ต้องมี to",
    weight: 12,
  },
  {
    id: "didnt-past",
    category: "tense",
    pattern: /\b(didn't|did not)\s+(went|had|made|wrote|found|built|ran|sent|got|took|saw|came|left|worked|finished|fixed|started)\b/gi,
    replace: (_m, neg: string, verb: string) => {
      const base =
        Object.entries(IRREGULAR_PAST).find(
          ([, past]) => past === verb.toLowerCase(),
        )?.[0] ?? verb.toLowerCase().replace(/ed$/, "");
      return `${neg} ${base}`;
    },
    description: "After 'didn't', use the base form of the verb",
    descriptionTh:
      "มี didn't อยู่แล้ว แปลว่าเป็นอดีตแน่นอน กริยาหลังจึงกลับไปเป็นรูปปกติ เช่น didn't go ไม่ใช่ didn't went",
    weight: 15,
  },
  {
    id: "have-years-old",
    category: "grammar",
    pattern: /\bI\s+have\s+(\d+)\s+years?\s+old\b/gi,
    replace: (_m, n: string) => `I am ${n} years old`,
    description: "Age uses 'am', not 'have'",
    descriptionTh: "บอกอายุใช้ I am ... years old ไม่ใช่ I have",
    weight: 15,
  },
  {
    id: "informations",
    category: "grammar",
    pattern: /\b(informations|softwares|equipments|advices|feedbacks|researches)\b/gi,
    replace: (_m, word: string) => word.slice(0, -1),
    description: "This noun has no plural form",
    descriptionTh:
      "คำนี้เป็นคำนามนับไม่ได้ จึงไม่เติม s — ใช้ information, software, feedback",
    weight: 8,
  },
  {
    id: "very-like",
    category: "naturalness",
    pattern: /\b(I|we|they)\s+very\s+(like|want|need)\b/gi,
    replace: (_m, subject: string, verb: string) =>
      `${subject} really ${verb}`,
    description: "'Very' does not modify a verb — use 'really'",
    descriptionTh:
      "very ใช้ขยายคำคุณศัพท์ ไม่ใช้ขยายกริยา ถ้าจะบอกว่ามาก ๆ กับกริยาให้ใช้ really",
    weight: 10,
  },
  {
    id: "third-person-s",
    category: "grammar",
    pattern: /\b(he|she|it)\s+(work|need|want|make|take|know|think|look|seem|come|go|have|do|use|run|call|fix|build|return|depend)\b(?!\w)/gi,
    replace: (_m, subject: string, verb: string) => {
      const lower = verb.toLowerCase();
      if (lower === "have") return `${subject} has`;
      if (lower === "do") return `${subject} does`;
      if (lower === "go") return `${subject} goes`;
      return `${subject} ${lower}s`;
    },
    description: "he/she/it takes an -s on the verb",
    descriptionTh:
      "ประธานเอกพจน์ he/she/it ต้องเติม s ที่กริยา เช่น he works ภาษาไทยไม่ผันกริยาจึงลืมง่าย",
    weight: 12,
  },
  {
    id: "will-going",
    category: "tense",
    pattern: /\b(I|we|they|he|she|you)\s+will\s+going\s+to\b/gi,
    replace: (_m, subject: string) => `${subject} am going to`,
    description: "Use either 'will' or 'going to', not both",
    descriptionTh:
      "will กับ going to ใช้บอกอนาคตเหมือนกัน เลือกใช้อย่างใดอย่างหนึ่ง",
    weight: 12,
  },
  {
    id: "blocked-by",
    category: "preposition",
    pattern: /\bblocked\s+(?:from|with|of)\b/gi,
    replace: () => "blocked by",
    description: "'Blocked by' is the standup phrase",
    descriptionTh:
      "ใน standup ใช้ blocked by เสมอ เช่น I'm blocked by the API team",
    weight: 8,
  },
  {
    id: "depend-on",
    category: "preposition",
    pattern: /\bdepends?\s+(?:of|to)\b/gi,
    replace: (m: string) => `${m.trim().split(/\s+/)[0]} on`,
    description: "'Depend' takes 'on'",
    descriptionTh: "depend คู่กับ on เสมอ — It depends on the data",
    weight: 8,
  },
];

/** Result of running the rule set over one sentence. */
export interface RuleHit {
  rule: CorrectionRule;
}

export function applyRules(input: string): {
  corrected: string;
  hits: RuleHit[];
} {
  let corrected = input;
  const hits: RuleHit[] = [];

  for (const rule of CORRECTION_RULES) {
    // `lastIndex` persists on a /g regex between calls; reset before each use.
    rule.pattern.lastIndex = 0;
    if (!rule.pattern.test(corrected)) continue;

    rule.pattern.lastIndex = 0;
    const next = corrected.replace(
      rule.pattern,
      (...args: unknown[]) =>
        rule.replace(...(args.slice(0, -2) as string[])),
    );

    if (next !== corrected) {
      corrected = next;
      hits.push({ rule });
    }
  }

  return { corrected, hits };
}

/** Sentence-level tidy-up: capital letter at the start, punctuation at the end. */
export function tidyPunctuation(input: string): {
  text: string;
  changed: boolean;
} {
  const trimmed = input.trim().replace(/\s+/g, " ");
  if (!trimmed) return { text: trimmed, changed: false };

  let text = trimmed[0].toUpperCase() + trimmed.slice(1);
  if (!/[.!?]$/.test(text)) text += ".";
  // Standalone "i" is always capitalised in English.
  text = text.replace(/\bi\b/g, "I");

  return { text, changed: text !== trimmed };
}
