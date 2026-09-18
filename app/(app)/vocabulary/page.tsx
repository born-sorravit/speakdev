"use client";

import { BookOpen, Check, Eye, RotateCcw, Search } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import * as React from "react";

import { SpeakButton } from "@/components/speak-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnimatedNumber, EmptyState, PageHeader } from "@/components/ui-kit";
import { VOCABULARY, VOCABULARY_BY_ID } from "@/lib/data/vocabulary";
import { format, useI18n } from "@/lib/i18n/provider";
import { fadeUp, panelSwap, staggerContainer, transition } from "@/lib/motion";
import { useAppStore } from "@/lib/store/use-app-store";
import type { VocabularyCategory, VocabularyItem } from "@/lib/types";
import { cn } from "@/lib/utils";

const CATEGORIES: Array<VocabularyCategory | "all"> = [
  "all",
  "general",
  "workplace",
  "developer",
  "technical",
  "meeting",
  "interview",
];

export default function VocabularyPage() {
  const [reviewing, setReviewing] = React.useState(false);

  if (reviewing) {
    return <ReviewSession onExit={() => setReviewing(false)} />;
  }

  return <VocabularyList onStartReview={() => setReviewing(true)} />;
}

function MasteryDots({ mastery }: { mastery: number }) {
  return (
    <span className="flex gap-0.5" aria-label={`Mastery ${mastery}/5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          className={cn(
            "size-1.5 rounded-full",
            n <= mastery ? "bg-primary" : "bg-muted",
          )}
        />
      ))}
    </span>
  );
}

function VocabularyList({ onStartReview }: { onStartReview: () => void }) {
  const { t } = useI18n();

  const hydrated = useAppStore((s) => s.hasHydrated);
  const userVocabulary = useAppStore((s) => s.vocabulary);
  const dueVocabulary = useAppStore((s) => s.dueVocabulary);

  const [category, setCategory] = React.useState<VocabularyCategory | "all">(
    "all",
  );
  const [query, setQuery] = React.useState("");

  const due = hydrated ? dueVocabulary() : [];

  const filtered = VOCABULARY.filter((word) => {
    const matchesCategory = category === "all" || word.category === category;
    const q = query.trim().toLowerCase();
    const matchesQuery =
      !q ||
      word.word.toLowerCase().includes(q) ||
      word.meaning.toLowerCase().includes(q) ||
      word.meaningTh.includes(query.trim());
    return matchesCategory && matchesQuery;
  });

  const categoryLabels: Record<VocabularyCategory | "all", string> = {
    all: t.common.all,
    general: "General",
    workplace: t.conversation.workplace,
    developer: t.conversation.developer,
    technical: "Technical",
    meeting: "Meeting",
    interview: t.conversation.interview,
  };

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title={t.vocab.title} subtitle={t.vocab.subtitle} />

      {/* ── Due today ───────────────────────────────────────────────── */}
      <Card className="bg-accent mb-6 rounded-2xl border-0">
        <CardContent className="flex flex-wrap items-center justify-between gap-4 p-5">
          <div>
            <p className="text-accent-foreground text-sm font-bold tracking-wide uppercase">
              {t.vocab.dueToday}
            </p>
            <p className="text-accent-foreground mt-1 text-2xl font-bold">
              <AnimatedNumber value={due.length} />{" "}
              <span className="text-base font-medium">{t.dashboard.words}</span>
            </p>
          </div>
          <Button
            size="lg"
            onClick={onStartReview}
            disabled={due.length === 0}
            className="rounded-full px-6"
          >
            {t.vocab.startReview}
          </Button>
        </CardContent>
      </Card>

      {due.length === 0 && hydrated && (
        <p className="text-muted-foreground text-th mb-6 text-center text-sm">
          {t.vocab.noneDue}
        </p>
      )}

      {/* ── Filters ─────────────────────────────────────────────────── */}
      <div className="mb-5 space-y-3">
        <div className="relative">
          <Search
            className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2"
            aria-hidden="true"
          />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.common.search}
            className="pl-9"
            aria-label={t.common.search}
          />
        </div>

        <Tabs
          value={category}
          onValueChange={(v) => setCategory(v as VocabularyCategory | "all")}
        >
          <TabsList className="flex w-full flex-wrap">
            {CATEGORIES.map((c) => (
              <TabsTrigger key={c} value={c} className="flex-1 text-xs">
                {categoryLabels[c]}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* ── Word list ───────────────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<BookOpen className="size-7" aria-hidden="true" />}
          title={t.vocab.noMatches}
          body={t.vocab.noMatchesBody}
        />
      ) : (
        <motion.ul
          variants={staggerContainer(0.04)}
          initial="hidden"
          animate="show"
          className="space-y-3"
        >
          {filtered.map((word) => {
            const state = userVocabulary[word.id];
            const mastered = (state?.mastery ?? 0) >= 5;

            return (
              <motion.li key={word.id} variants={fadeUp}>
                <Card className="border-border/70 rounded-2xl shadow-none">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-lg font-bold">{word.word}</p>
                          <Badge variant="outline" className="text-xs">
                            {word.level}
                          </Badge>
                          {mastered && (
                            <Badge className="bg-success text-success-foreground text-xs">
                              {t.vocab.mastered}
                            </Badge>
                          )}
                        </div>
                        <p className="text-muted-foreground text-th mt-1 text-sm">
                          {word.meaningTh}
                        </p>
                      </div>
                      <SpeakButton text={word.word} />
                    </div>

                    <div className="bg-muted mt-3.5 rounded-lg px-3.5 py-2.5">
                      <p className="text-muted-foreground mb-1 text-[0.625rem] font-bold tracking-wide uppercase">
                        {t.vocab.example}
                      </p>
                      <p className="text-sm">{word.example}</p>
                      <p className="text-muted-foreground text-th mt-1 text-xs">
                        {word.exampleTh}
                      </p>
                    </div>

                    {state && (
                      <div className="mt-3 flex items-center gap-2">
                        <MasteryDots mastery={state.mastery} />
                        <span className="text-muted-foreground text-xs">
                          {state.reviewCount}×
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.li>
            );
          })}
        </motion.ul>
      )}
    </div>
  );
}

function ReviewSession({ onExit }: { onExit: () => void }) {
  const { t } = useI18n();

  const dueVocabulary = useAppStore((s) => s.dueVocabulary);
  const reviewWord = useAppStore((s) => s.reviewWord);

  // Freeze the queue at mount; grading changes `nextReviewAt` and would
  // otherwise shrink the list under the learner mid-session.
  const [queue] = React.useState<VocabularyItem[]>(() =>
    dueVocabulary()
      .map((id) => VOCABULARY_BY_ID.get(id))
      .filter((w): w is VocabularyItem => Boolean(w)),
  );

  const [index, setIndex] = React.useState(0);
  const [revealed, setRevealed] = React.useState(false);

  const word = queue[index];
  const done = index >= queue.length;

  function grade(value: "again" | "good" | "easy") {
    if (!word) return;
    reviewWord(word.id, value);
    setRevealed(false);
    setIndex((i) => i + 1);
  }

  if (done || !word) {
    return (
      <div className="mx-auto max-w-md">
        <Card className="border-primary/30 rounded-2xl border-2">
          <CardContent className="flex flex-col items-center p-8 text-center">
            <span className="bg-success text-success-foreground mb-5 grid size-14 place-items-center rounded-full">
              <Check className="size-7" aria-hidden="true" />
            </span>
            <h2 className="text-xl font-bold">{t.vocab.reviewDone}</h2>
            <p className="text-muted-foreground text-th mt-2 text-sm">
              {format(t.vocab.reviewDoneSub, { n: queue.length })}
            </p>
            <Button className="mt-6 w-full" onClick={onExit}>
              {t.common.done}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md">
      <div className="mb-5">
        <div
          role="progressbar"
          aria-valuenow={index}
          aria-valuemin={0}
          aria-valuemax={queue.length}
          className="bg-muted h-1.5 overflow-hidden rounded-full"
        >
          <div
            className="bg-primary h-full rounded-full transition-[width]"
            style={{ width: `${(index / queue.length) * 100}%` }}
          />
        </div>
        <p className="text-muted-foreground mt-2 text-xs font-semibold tabular-nums">
          {index + 1} / {queue.length}
        </p>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={word.id}
          variants={panelSwap}
          initial="hidden"
          animate="show"
          exit="exit"
        >
          <Card className="rounded-2xl">
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground text-th mb-5 text-xs font-semibold">
                {t.vocab.reviewTitle}
              </p>

              <div className="flex items-center justify-center gap-2">
                <p className="text-3xl font-bold">{word.word}</p>
                <SpeakButton text={word.word} />
              </div>

              {revealed ? (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={transition}
                  className="mt-6 space-y-4 text-left"
                >
                  <div>
                    <p className="text-th text-base font-semibold">
                      {word.meaningTh}
                    </p>
                    <p className="text-muted-foreground mt-1 text-sm">
                      {word.meaning}
                    </p>
                  </div>

                  <div className="bg-muted rounded-lg px-3.5 py-2.5">
                    <p className="text-muted-foreground mb-1 text-[0.625rem] font-bold tracking-wide uppercase">
                      {t.vocab.example}
                    </p>
                    <div className="flex items-start gap-2">
                      <p className="flex-1 text-sm">{word.example}</p>
                      <SpeakButton text={word.example} />
                    </div>
                    <p className="text-muted-foreground text-th mt-1 text-xs">
                      {word.exampleTh}
                    </p>
                  </div>
                </motion.div>
              ) : (
                <Button
                  variant="outline"
                  className="mt-6 w-full gap-2"
                  size="lg"
                  onClick={() => setRevealed(true)}
                >
                  <Eye className="size-4" aria-hidden="true" />
                  {t.vocab.showAnswer}
                </Button>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      {revealed && (
        <div className="mt-4 grid grid-cols-3 gap-2">
          <Button
            variant="outline"
            onClick={() => grade("again")}
            className="gap-1.5"
          >
            <RotateCcw className="size-3.5" aria-hidden="true" />
            {t.vocab.again}
          </Button>
          <Button variant="secondary" onClick={() => grade("good")}>
            {t.vocab.good}
          </Button>
          <Button onClick={() => grade("easy")}>{t.vocab.easy}</Button>
        </div>
      )}

      <Button variant="ghost" className="mt-4 w-full" onClick={onExit}>
        {t.common.close}
      </Button>
    </div>
  );
}
