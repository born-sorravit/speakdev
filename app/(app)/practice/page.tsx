"use client";

import { Mic, RefreshCw, Send, Wrench } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import * as React from "react";

import { FeedbackCard } from "@/components/feedback-card";
import { SpeakButton } from "@/components/speak-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader, StatTile } from "@/components/ui-kit";
import { getAIService } from "@/lib/ai";
import { LESSONS } from "@/lib/data/lessons";
import { useI18n } from "@/lib/i18n/provider";
import { fadeUp, panelSwap } from "@/lib/motion";
import { useAppStore, useWeakVocabulary } from "@/lib/store/use-app-store";
import type {
  AnswerEvaluation,
  LessonCategory,
  PracticePrompt,
} from "@/lib/types";
import { cn } from "@/lib/utils";

interface Topic {
  id: LessonCategory | "all" | "mistakes";
  label: string;
}

/** Every practice prompt in the curriculum, tagged with its lesson category. */
const ALL_PROMPTS: Array<
  PracticePrompt & { category: LessonCategory; patterns: string[] }
> = LESSONS.flatMap((lesson) =>
  lesson.practice.map((prompt) => ({
    ...prompt,
    category: lesson.category,
    patterns: lesson.patterns,
  })),
);

export default function PracticePage() {
  const { t } = useI18n();
  const ai = React.useMemo(() => getAIService(), []);

  const level = useAppStore((s) => s.profile.englishLevel);
  const mistakes = useAppStore((s) => s.mistakes);
  const recordAnswer = useAppStore((s) => s.recordAnswer);
  const addSpeakingMinutes = useAppStore((s) => s.addSpeakingMinutes);
  const weakVocabulary = useWeakVocabulary();

  const [topic, setTopic] = React.useState<Topic["id"]>("all");
  const [index, setIndex] = React.useState(0);
  const [answer, setAnswer] = React.useState("");
  const [evaluation, setEvaluation] = React.useState<AnswerEvaluation | null>(
    null,
  );
  const [checking, setChecking] = React.useState(false);
  const [session, setSession] = React.useState<number[]>([]);
  // See the lesson player: a retry re-submits the coach's own sentence, which
  // would otherwise be free XP.
  const [paidPrompts, setPaidPrompts] = React.useState<Set<string>>(new Set());

  const topics: Topic[] = [
    { id: "all", label: t.common.all },
    { id: "basics", label: t.nav.learn },
    { id: "standup", label: "Standup" },
    { id: "conversation", label: t.nav.conversation },
    { id: "self", label: t.nav.profile },
  ];

  const pool = React.useMemo(() => {
    if (topic === "all") return ALL_PROMPTS;
    const filtered = ALL_PROMPTS.filter((p) => p.category === topic);
    return filtered.length > 0 ? filtered : ALL_PROMPTS;
  }, [topic]);

  const prompt = pool[index % pool.length];

  function nextQuestion() {
    setIndex((i) => i + 1);
    setAnswer("");
    setEvaluation(null);
  }

  async function handleCheck() {
    if (!answer.trim() || checking) return;
    setChecking(true);
    try {
      const result = await ai.evaluateAnswer({
        answer,
        question: prompt.question,
        sampleAnswer: prompt.sampleAnswer,
        targetPatterns: prompt.patterns,
        context: { level, recentMistakes: mistakes, weakVocabulary },
      });
      const firstAttempt = !paidPrompts.has(prompt.id);
      setEvaluation(result);
      setSession((previous) => [...previous, result.score]);
      recordAnswer(result, firstAttempt);
      setPaidPrompts((previous) => new Set(previous).add(prompt.id));
      // One answered prompt is roughly a minute of speaking practice.
      if (firstAttempt) addSpeakingMinutes(1);
    } finally {
      setChecking(false);
    }
  }

  const accuracy =
    session.length > 0
      ? Math.round(session.reduce((a, b) => a + b, 0) / session.length)
      : 0;

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title={t.practice.title} subtitle={t.practice.subtitle} />

      {/* ── Topic picker ────────────────────────────────────────────── */}
      <div className="mb-6">
        <p className="text-muted-foreground mb-2.5 text-xs font-bold tracking-wide uppercase">
          {t.practice.pickTopic}
        </p>
        <div className="flex flex-wrap gap-2">
          {topics.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setTopic(item.id);
                setIndex(0);
                setAnswer("");
                setEvaluation(null);
              }}
              aria-pressed={topic === item.id}
              className={cn(
                "focus-visible:ring-ring rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none",
                topic === item.id
                  ? "border-primary bg-primary text-primary-foreground"
                  : "bg-card hover:bg-accent hover:text-accent-foreground",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Question ────────────────────────────────────────────────── */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={prompt.id}
          variants={panelSwap}
          initial="hidden"
          animate="show"
          exit="exit"
        >
          <Card className="bg-accent mb-4 rounded-2xl border-0">
            <CardContent className="p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <p className="text-accent-foreground flex-1 text-lg font-bold sm:text-xl">
                  {prompt.question}
                </p>
                <SpeakButton text={prompt.question} />
              </div>
              <p className="text-accent-foreground/80 text-th mt-2 text-sm">
                {prompt.questionTh}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      {evaluation ? (
        <FeedbackCard
          evaluation={evaluation}
          onRetry={() => {
            setAnswer(evaluation.corrected);
            setEvaluation(null);
          }}
          onContinue={nextQuestion}
          continueLabel={t.practice.randomQuestion}
        />
      ) : (
        <div className="space-y-4">
          <div>
            <label
              htmlFor="answer"
              className="mb-2 block text-sm font-semibold"
            >
              {t.learn.yourAnswer}
            </label>
            <Textarea
              id="answer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder={t.learn.placeholder}
              rows={3}
              className="resize-none text-base"
              onKeyDown={(e) => {
                if ((e.metaKey || e.ctrlKey) && e.key === "Enter")
                  handleCheck();
              }}
            />
          </div>

          {prompt.hints.length > 0 && (
            <div>
              <p className="text-muted-foreground text-th mb-2 text-xs font-semibold">
                {t.learn.practiceHint}
              </p>
              <div className="flex flex-wrap gap-2">
                {prompt.hints.map((hint) => (
                  <button
                    key={hint}
                    type="button"
                    onClick={() =>
                      setAnswer((current) =>
                        current ? `${current} ${hint}` : hint,
                      )
                    }
                    className="bg-muted hover:bg-accent hover:text-accent-foreground rounded-full px-3 py-1.5 font-mono text-xs transition-colors"
                  >
                    {hint}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <Button
              className="flex-1 gap-2"
              size="lg"
              onClick={handleCheck}
              disabled={!answer.trim() || checking}
            >
              {checking ? (
                t.common.checking
              ) : (
                <>
                  {t.common.check}
                  <Send className="size-4" aria-hidden="true" />
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={nextQuestion}
              aria-label={t.practice.randomQuestion}
            >
              <RefreshCw className="size-4" aria-hidden="true" />
            </Button>
          </div>

          <div className="text-muted-foreground flex items-center justify-center gap-2 text-xs">
            <Mic className="size-3.5" aria-hidden="true" />
            <span className="text-th">{t.practice.micSoon}</span>
          </div>
        </div>
      )}

      {/* ── Session stats ───────────────────────────────────────────── */}
      {session.length > 0 && (
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="mt-8"
        >
          <p className="text-muted-foreground mb-2.5 text-xs font-bold tracking-wide uppercase">
            {t.practice.sessionStats}
          </p>
          <div className="grid grid-cols-2 gap-3">
            <StatTile countTo={session.length} label={t.practice.answered} />
            <StatTile
              countTo={accuracy}
              suffix="%"
              label={t.practice.accuracy}
            />
          </div>
        </motion.div>
      )}

      {mistakes.filter((m) => !m.resolved).length > 0 && (
        <Card className="border-border/70 mt-6 rounded-2xl shadow-none">
          <CardContent className="flex items-center gap-3 p-4">
            <Wrench
              className="text-muted-foreground size-4 shrink-0"
              aria-hidden="true"
            />
            <p className="text-muted-foreground text-th flex-1 text-sm">
              {t.progress.commonMistakesSub}
            </p>
            <Badge variant="secondary">
              {mistakes.filter((m) => !m.resolved).length}
            </Badge>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
