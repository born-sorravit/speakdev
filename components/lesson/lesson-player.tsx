"use client";

import {
  ArrowLeft,
  ArrowRight,
  Check,
  Lightbulb,
  Mic,
  PartyPopper,
  Send,
  Sparkles,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";

import { FeedbackCard } from "@/components/feedback-card";
import { SpeakButton } from "@/components/speak-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { getAIService } from "@/lib/ai";
import { getLessonByDay } from "@/lib/data/lessons";
import { getVocabulary } from "@/lib/data/vocabulary";
import { format, useI18n } from "@/lib/i18n/provider";
import { fadeUp, panelSwap, staggerContainer, transition } from "@/lib/motion";
import { useAppStore, useWeakVocabulary, XP } from "@/lib/store/use-app-store";
import type { AnswerEvaluation, Lesson } from "@/lib/types";

/** The six stages from §9, plus a completion screen. */
const STAGES = [
  "learn",
  "understand",
  "repeat",
  "practice",
  "result",
  "done",
] as const;
type Stage = (typeof STAGES)[number];

export function LessonPlayer({ lesson }: { lesson: Lesson }) {
  const { t, pick } = useI18n();
  const router = useRouter();
  const ai = React.useMemo(() => getAIService(), []);

  const startLesson = useAppStore((s) => s.startLesson);
  const setLessonProgress = useAppStore((s) => s.setLessonProgress);
  const completeLesson = useAppStore((s) => s.completeLesson);
  const recordAnswer = useAppStore((s) => s.recordAnswer);
  const level = useAppStore((s) => s.profile.englishLevel);
  const mistakes = useAppStore((s) => s.mistakes);
  const weakVocabulary = useWeakVocabulary();

  const [stage, setStage] = React.useState<Stage>("learn");
  const [phraseIndex, setPhraseIndex] = React.useState(0);
  const [repeated, setRepeated] = React.useState<Set<string>>(new Set());
  const [promptIndex, setPromptIndex] = React.useState(0);
  const [answer, setAnswer] = React.useState("");
  const [evaluation, setEvaluation] = React.useState<AnswerEvaluation | null>(
    null,
  );
  const [checking, setChecking] = React.useState(false);
  const [scores, setScores] = React.useState<number[]>([]);
  // Retrying pre-fills the corrected sentence, so a second submission of the
  // same prompt must not pay out again.
  const [paidPrompts, setPaidPrompts] = React.useState<Set<string>>(new Set());
  const [earnedXp, setEarnedXp] = React.useState(0);

  const phrase = lesson.phrases[phraseIndex];
  const prompt = lesson.practice[promptIndex];
  const vocabulary = getVocabulary(lesson.vocabularyIds);

  React.useEffect(() => {
    startLesson(lesson.id);
  }, [lesson.id, startLesson]);

  const stageIndex = STAGES.indexOf(stage);
  const overallProgress = Math.round((stageIndex / (STAGES.length - 1)) * 100);

  React.useEffect(() => {
    if (stage !== "done") setLessonProgress(lesson.id, overallProgress);
  }, [lesson.id, overallProgress, setLessonProgress, stage]);

  async function handleCheck() {
    if (!answer.trim() || checking) return;
    setChecking(true);
    try {
      const result = await ai.evaluateAnswer({
        answer,
        question: prompt.question,
        sampleAnswer: prompt.sampleAnswer,
        targetPatterns: lesson.patterns,
        context: { level, recentMistakes: mistakes, weakVocabulary },
      });
      setEvaluation(result);
      setScores((previous) => [...previous, result.score]);
      recordAnswer(result, !paidPrompts.has(prompt.id));
      setPaidPrompts((previous) => new Set(previous).add(prompt.id));
      setStage("result");
    } finally {
      setChecking(false);
    }
  }

  function handleRetry() {
    // Pre-fill with the corrected sentence so retrying means *saying the right
    // thing*, which is the point of the retry stage (§9 Stage 6).
    setAnswer(evaluation?.corrected ?? "");
    setEvaluation(null);
    setStage("practice");
  }

  function handleAfterResult() {
    const isLastPrompt = promptIndex >= lesson.practice.length - 1;
    if (isLastPrompt) {
      finish();
    } else {
      setPromptIndex((i) => i + 1);
      setAnswer("");
      setEvaluation(null);
      setStage("practice");
    }
  }

  function finish() {
    const average =
      scores.length > 0
        ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
        : 0;
    const xp = completeLesson(lesson.id, average);
    setEarnedXp(xp);
    setStage("done");
    if (xp > 0) {
      toast.success(`+${xp} ${t.common.xp}`, {
        description: pick(lesson.title),
      });
    }
  }

  const stageLabels: Record<Stage, string> = {
    learn: t.learn.stageLearn,
    understand: t.learn.stageUnderstand,
    repeat: t.learn.stageRepeat,
    practice: t.learn.stagePractice,
    result: t.learn.stageResult,
    done: t.learn.stageDone,
  };

  return (
    <div className="mx-auto max-w-2xl">
      {/* ── Header with progress ─────────────────────────────────────── */}
      <div className="mb-6">
        <div className="mb-3 flex items-center justify-between gap-3">
          <Button asChild variant="ghost" size="sm" className="-ml-2 gap-1.5">
            <Link href="/learn">
              <ArrowLeft className="size-4" aria-hidden="true" />
              {t.common.back}
            </Link>
          </Button>
          <Button asChild variant="ghost" size="icon" className="-mr-2 size-9">
            <Link href="/dashboard" aria-label={t.common.close}>
              <X className="size-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>

        <div
          role="progressbar"
          aria-valuenow={overallProgress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={pick(lesson.title)}
          className="bg-muted h-1.5 overflow-hidden rounded-full"
        >
          <div
            className="bg-primary h-full rounded-full transition-[width] duration-500"
            style={{ width: `${overallProgress}%` }}
          />
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Badge variant="secondary">
            {t.common.day} {lesson.day}
          </Badge>
          <Badge variant="outline">{lesson.level}</Badge>
          <span className="text-muted-foreground text-xs font-semibold">
            {t.learn.stage} {stageIndex + 1}/{STAGES.length} ·{" "}
            {stageLabels[stage]}
          </span>
        </div>

        <h1 className="mt-2.5 text-xl font-bold tracking-tight sm:text-2xl">
          {pick(lesson.title)}
        </h1>
      </div>

      {/*
        One `AnimatePresence` child keyed by stage. `mode="wait"` matters for
        more than looks: with the default both panels are mounted mid-swap, so
        a fast click can land on the stage the learner just left.
      */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={stage}
          variants={panelSwap}
          initial="hidden"
          animate="show"
          exit="exit"
        >
          {stage === "learn" && (
            <div className="space-y-4">
              <p className="text-muted-foreground text-sm font-semibold">
                {format(t.learn.phraseOf, {
                  n: phraseIndex + 1,
                  total: lesson.phrases.length,
                })}
              </p>

              {/* The card swaps in place as the learner steps through phrases. */}
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={phrase.id}
                  variants={panelSwap}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                >
                  <Card className="rounded-2xl">
                    <CardContent className="p-5 sm:p-6">
                      <div className="flex items-start gap-3">
                        <p className="flex-1 text-xl leading-snug font-bold sm:text-2xl">
                          {phrase.en}
                        </p>
                        <SpeakButton text={phrase.en} />
                      </div>

                      <p className="text-muted-foreground text-th mt-3 text-base">
                        {phrase.th}
                      </p>

                      {phrase.pronunciation && (
                        <p className="text-muted-foreground text-th bg-muted mt-4 rounded-lg px-3 py-2 font-mono text-sm">
                          {phrase.pronunciation}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </AnimatePresence>

              <div className="flex gap-2">
                {phraseIndex > 0 && (
                  <Button
                    variant="outline"
                    onClick={() => setPhraseIndex((i) => i - 1)}
                  >
                    {t.common.back}
                  </Button>
                )}
                <Button
                  className="flex-1 gap-2"
                  size="lg"
                  onClick={() => {
                    if (phraseIndex < lesson.phrases.length - 1) {
                      setPhraseIndex((i) => i + 1);
                    } else {
                      setPhraseIndex(0);
                      setStage("understand");
                    }
                  }}
                >
                  {phraseIndex < lesson.phrases.length - 1
                    ? t.common.next
                    : t.common.continue}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Button>
              </div>
            </div>
          )}

          {/* ── Stage 2 — Understand ─────────────────────────────────────── */}
          {stage === "understand" && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Lightbulb className="text-primary size-5" aria-hidden="true" />
                <p className="font-semibold">{t.learn.whenToUse}</p>
              </div>

              <motion.div
                variants={staggerContainer()}
                initial="hidden"
                animate="show"
                className="space-y-4"
              >
                {lesson.phrases.map((item) => (
                  <motion.div key={item.id} variants={fadeUp}>
                    <Card className="border-border/70 rounded-2xl shadow-none">
                      <CardContent className="p-5">
                        <div className="flex items-start gap-3">
                          <p className="flex-1 font-semibold">{item.en}</p>
                          <SpeakButton text={item.en} />
                        </div>
                        <p className="text-muted-foreground text-th mt-2 text-sm">
                          {item.usageTh}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>

              {vocabulary.length > 0 && (
                <Card className="bg-accent border-0 rounded-2xl">
                  <CardContent className="p-5">
                    <p className="text-accent-foreground mb-3 text-xs font-bold tracking-wide uppercase">
                      {t.nav.vocabulary}
                    </p>
                    <ul className="space-y-2.5">
                      {vocabulary.map((word) => (
                        <li key={word.id} className="text-sm">
                          <span className="font-semibold">{word.word}</span>
                          <span className="text-th text-muted-foreground">
                            {" "}
                            — {word.meaningTh}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              <Button
                className="w-full gap-2"
                size="lg"
                onClick={() => setStage("repeat")}
              >
                {t.common.continue}
                <ArrowRight className="size-4" aria-hidden="true" />
              </Button>
            </div>
          )}

          {/* ── Stage 3 — Repeat ─────────────────────────────────────────── */}
          {stage === "repeat" && (
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2">
                  <Mic className="text-primary size-5" aria-hidden="true" />
                  <p className="font-semibold">{t.learn.repeatTitle}</p>
                </div>
                <p className="text-muted-foreground text-th mt-1.5 text-sm">
                  {t.learn.repeatBody}
                </p>
              </div>

              {lesson.phrases.map((item) => {
                const done = repeated.has(item.id);
                return (
                  <Card
                    key={item.id}
                    className="border-border/70 rounded-2xl shadow-none"
                  >
                    <CardContent className="flex items-center gap-3 p-4">
                      <SpeakButton text={item.en} />
                      <p className="flex-1 text-sm font-medium">{item.en}</p>
                      <Button
                        size="sm"
                        variant={done ? "secondary" : "outline"}
                        onClick={() =>
                          setRepeated((previous) =>
                            new Set(previous).add(item.id),
                          )
                        }
                        className="gap-1.5 shrink-0"
                      >
                        {done && (
                          <Check className="size-3.5" aria-hidden="true" />
                        )}
                        {t.learn.repeatDone}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}

              <Button
                className="w-full gap-2"
                size="lg"
                onClick={() => setStage("practice")}
              >
                {t.common.continue}
                <ArrowRight className="size-4" aria-hidden="true" />
              </Button>
            </div>
          )}

          {/* ── Stage 4 — Practice ───────────────────────────────────────── */}
          {stage === "practice" && (
            <div className="space-y-4">
              <p className="text-muted-foreground text-sm font-semibold">
                {t.learn.practiceTitle} · {promptIndex + 1}/
                {lesson.practice.length}
              </p>

              <Card className="bg-accent border-0 rounded-2xl">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <p className="text-accent-foreground flex-1 text-lg font-bold">
                      {prompt.question}
                    </p>
                    <SpeakButton text={prompt.question} />
                  </div>
                  <p className="text-accent-foreground/80 text-th mt-2 text-sm">
                    {prompt.questionTh}
                  </p>
                </CardContent>
              </Card>

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

              <Button
                className="w-full gap-2"
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

              <p className="text-muted-foreground text-th text-center text-xs">
                {t.practice.micSoon}
              </p>
            </div>
          )}

          {/* ── Stage 5 & 6 — Feedback and retry ─────────────────────────── */}
          {stage === "result" && evaluation && (
            <FeedbackCard
              evaluation={evaluation}
              onRetry={handleRetry}
              onContinue={handleAfterResult}
              continueLabel={
                promptIndex >= lesson.practice.length - 1
                  ? t.common.done
                  : t.common.next
              }
            />
          )}

          {/* ── Completion ───────────────────────────────────────────────── */}
          {stage === "done" && (
            <Card className="rounded-2xl border-2 border-primary/30">
              <CardContent className="flex flex-col items-center p-8 text-center">
                <motion.span
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ ...transition, delay: 0.05 }}
                  className="bg-primary text-primary-foreground mb-5 grid size-16 place-items-center rounded-full"
                >
                  <PartyPopper className="size-7" aria-hidden="true" />
                </motion.span>

                <h2 className="text-2xl font-bold tracking-tight">
                  {t.learn.lessonComplete}
                </h2>
                <p className="text-muted-foreground text-th mt-2">
                  {format(t.learn.lessonCompleteSub, {
                    xp: earnedXp || XP.lessonComplete,
                  })}
                </p>

                {scores.length > 0 && (
                  <div className="mt-5 flex items-center gap-1.5 text-sm font-semibold">
                    <Sparkles
                      className="text-primary size-4"
                      aria-hidden="true"
                    />
                    {t.practice.accuracy}:{" "}
                    {Math.round(
                      scores.reduce((a, b) => a + b, 0) / scores.length,
                    )}
                    %
                  </div>
                )}

                <div className="mt-7 flex w-full flex-col gap-2 sm:flex-row">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => router.push("/dashboard")}
                  >
                    {t.learn.backToDashboard}
                  </Button>
                  <NextLessonButton day={lesson.day} />
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function NextLessonButton({ day }: { day: number }) {
  const { t } = useI18n();
  const next = getLessonByDay(day + 1);

  if (!next) {
    return (
      <Button asChild className="flex-1">
        <Link href="/learn">{t.nav.learn}</Link>
      </Button>
    );
  }

  return (
    <Button asChild className="flex-1 gap-2">
      <Link href={`/learn/${next.id}`}>
        {t.learn.nextLesson}
        <ArrowRight className="size-4" aria-hidden="true" />
      </Link>
    </Button>
  );
}
