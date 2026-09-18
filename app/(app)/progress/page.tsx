"use client";

import {
  Check,
  Clock,
  MessageCircle,
  Mic,
  Sparkles,
  Wrench,
} from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import * as React from "react";

import { SpeakButton } from "@/components/speak-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  EmptyState,
  MeterRow,
  PageHeader,
  StatTile,
} from "@/components/ui-kit";
import { TOTAL_DAYS } from "@/lib/data/curriculum";
import { VOCABULARY } from "@/lib/data/vocabulary";
import { format, useI18n } from "@/lib/i18n/provider";
import {
  DURATION,
  EASE,
  fadeUp,
  staggerContainer,
  viewportOnce,
} from "@/lib/motion";
import {
  selectLessonsCompleted,
  selectMasteredCount,
  todayISO,
  useAppStore,
} from "@/lib/store/use-app-store";
import { cn } from "@/lib/utils";

/** Last 14 days of activity as a simple bar strip (§19: charts sparingly). */
function ActivityStrip() {
  const { t } = useI18n();
  const activity = useAppStore((s) => s.activity);
  const goal = useAppStore((s) => s.profile.dailyGoalMinutes);

  const days = React.useMemo(() => {
    const out: Array<{ date: string; minutes: number }> = [];
    for (let i = 13; i >= 0; i -= 1) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const iso = todayISO(date);
      const entry = activity.find((a) => a.date === iso);
      out.push({
        date: iso,
        minutes:
          (entry?.speakingMinutes ?? 0) + (entry?.conversationMinutes ?? 0),
      });
    }
    return out;
  }, [activity]);

  const max = Math.max(goal, ...days.map((d) => d.minutes));

  return (
    <Card className="border-border/70 rounded-2xl shadow-none">
      <CardContent className="p-5">
        <p className="mb-4 text-sm font-semibold">{t.progress.activity}</p>
        <div className="flex h-24 items-end gap-1.5">
          {days.map((day, index) => {
            const height = max > 0 ? (day.minutes / max) * 100 : 0;
            const met = day.minutes >= goal;
            return (
              <div
                key={day.date}
                className="group relative flex flex-1 flex-col items-center gap-1"
              >
                <div className="flex h-20 w-full items-end">
                  <motion.div
                    className={cn(
                      "w-full rounded-t-md",
                      day.minutes === 0
                        ? "bg-muted"
                        : met
                          ? "bg-primary"
                          : "bg-primary/45",
                    )}
                    initial={{ height: 0 }}
                    whileInView={{
                      height:
                        day.minutes > 0 ? `${Math.max(8, height)}%` : "4px",
                    }}
                    viewport={viewportOnce}
                    transition={{
                      duration: DURATION.slow,
                      ease: EASE,
                      // Left-to-right sweep across the fortnight.
                      delay: index * 0.025,
                    }}
                  />
                </div>
                <span className="text-muted-foreground text-[0.5625rem] tabular-nums">
                  {day.date.slice(-2)}
                </span>
                <span className="sr-only">
                  {day.date}: {day.minutes} {t.common.min}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

export default function ProgressPage() {
  const { t } = useI18n();

  const hydrated = useAppStore((s) => s.hasHydrated);
  const profile = useAppStore((s) => s.profile);
  const skills = useAppStore((s) => s.skills);
  const xp = useAppStore((s) => s.xp);
  const activity = useAppStore((s) => s.activity);
  const mistakes = useAppStore((s) => s.mistakes);
  const resolveMistake = useAppStore((s) => s.resolveMistake);
  const vocabulary = useAppStore((s) => s.vocabulary);

  const lessonsCompleted = useAppStore(selectLessonsCompleted);
  const mastered = useAppStore(selectMasteredCount);

  const totals = activity.reduce(
    (acc, day) => ({
      speaking: acc.speaking + day.speakingMinutes,
      conversation: acc.conversation + day.conversationMinutes,
    }),
    { speaking: 0, conversation: 0 },
  );

  const unresolved = mistakes.filter((m) => !m.resolved);
  const resolved = mistakes.filter((m) => m.resolved);

  // Keyed on `id` below, never on `label`: labels are translated, so a locale
  // change would remount every MeterRow and drop its bar back to zero.
  const skillRows = [
    {
      id: "speaking",
      label: t.dashboard.speaking,
      value: skills.speaking,
      tone: "primary" as const,
    },
    {
      id: "listening",
      label: t.progress.listening,
      value: skills.listening,
      tone: "chart-2" as const,
    },
    {
      id: "vocabulary",
      label: t.nav.vocabulary,
      value: skills.vocabulary,
      tone: "chart-3" as const,
    },
    {
      id: "grammar",
      label: t.progress.grammar,
      value: skills.grammar,
      tone: "chart-4" as const,
    },
    {
      id: "conversation",
      label: t.nav.conversation,
      value: skills.conversation,
      tone: "primary" as const,
    },
    {
      id: "workplace",
      label: t.progress.workplace,
      value: skills.workplace,
      tone: "chart-2" as const,
    },
  ];

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title={t.progress.title}
        subtitle={t.progress.subtitle}
        action={
          <Badge
            variant="secondary"
            className="px-3 py-1.5 text-sm font-semibold"
          >
            {profile.englishLevel} · {t.levels[profile.englishLevel]}
          </Badge>
        }
      />

      {/* ── Overall ─────────────────────────────────────────────────── */}
      <Card className="border-border/70 mb-6 rounded-2xl shadow-none">
        <CardContent className="space-y-4 p-5">
          <p className="text-sm font-bold tracking-wide uppercase">
            {t.progress.overall}
          </p>
          <MeterRow
            label={t.progress.lessons}
            value={(lessonsCompleted / TOTAL_DAYS) * 100}
            hint={`${hydrated ? lessonsCompleted : 0} / ${TOTAL_DAYS}`}
          />
          <MeterRow
            label={t.nav.vocabulary}
            value={(mastered / VOCABULARY.length) * 100}
            hint={`${hydrated ? mastered : 0} / ${VOCABULARY.length}`}
            tone="chart-2"
          />
          <MeterRow
            label={t.dashboard.speaking}
            value={skills.speaking}
            tone="chart-3"
          />
          <MeterRow
            label={t.nav.conversation}
            value={skills.conversation}
            tone="chart-4"
          />
        </CardContent>
      </Card>

      {/* ── Stats ───────────────────────────────────────────────────── */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile
          icon={<Sparkles className="size-5" aria-hidden="true" />}
          countTo={hydrated ? xp : 0}
          label={t.progress.totalXp}
        />
        <StatTile
          icon={<Mic className="size-5" aria-hidden="true" />}
          countTo={hydrated ? totals.speaking : 0}
          label={t.progress.speakingMinutes}
        />
        <StatTile
          icon={<MessageCircle className="size-5" aria-hidden="true" />}
          countTo={hydrated ? totals.conversation : 0}
          label={t.progress.conversationMinutes}
        />
        <StatTile
          icon={<Clock className="size-5" aria-hidden="true" />}
          countTo={hydrated ? Object.keys(vocabulary).length : 0}
          label={t.vocab.learning}
        />
      </div>

      <div className="mb-6">
        <ActivityStrip />
      </div>

      {/* ── Skills ──────────────────────────────────────────────────── */}
      <Card className="border-border/70 mb-6 rounded-2xl shadow-none">
        <CardContent className="space-y-4 p-5">
          <p className="text-sm font-bold tracking-wide uppercase">
            {t.progress.skills}
          </p>
          {skillRows.map((row) => (
            <MeterRow
              key={row.id}
              label={row.label}
              value={row.value}
              tone={row.tone}
            />
          ))}
        </CardContent>
      </Card>

      {/* ── Common mistakes ─────────────────────────────────────────── */}
      <section id="mistakes" className="scroll-mt-20">
        <div className="mb-3">
          <h2 className="text-sm font-bold tracking-wide uppercase">
            {t.progress.commonMistakes}
          </h2>
          <p className="text-muted-foreground text-th mt-1 text-sm">
            {t.progress.commonMistakesSub}
          </p>
        </div>

        {hydrated && unresolved.length === 0 && resolved.length === 0 ? (
          <EmptyState
            icon={<Wrench className="size-7" aria-hidden="true" />}
            title={t.progress.noMistakes}
            action={
              <Button asChild>
                <Link href="/practice">{t.dashboard.qaPractice}</Link>
              </Button>
            }
          />
        ) : (
          <motion.ul
            variants={staggerContainer(0.05)}
            initial="hidden"
            animate="show"
            className="space-y-3"
          >
            {[...unresolved, ...resolved].map((mistake) => (
              <motion.li key={mistake.id} variants={fadeUp}>
                <Card
                  className={cn(
                    "border-border/70 rounded-2xl shadow-none",
                    mistake.resolved && "opacity-60",
                  )}
                >
                  <CardContent className="p-4">
                    <div className="mb-3 flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {mistake.category}
                      </Badge>
                      {mistake.occurrences > 1 && (
                        <Badge variant="secondary" className="text-xs">
                          {format(t.progress.times, { n: mistake.occurrences })}
                        </Badge>
                      )}
                      {mistake.resolved && (
                        <Check
                          className="text-success ml-auto size-4"
                          aria-hidden="true"
                        />
                      )}
                    </div>

                    <p className="text-muted-foreground flex items-start gap-2 text-sm">
                      <span aria-label="incorrect">❌</span>
                      <span className="line-through decoration-1">
                        {mistake.originalText}
                      </span>
                    </p>
                    <div className="mt-1.5 flex items-start gap-2 text-sm font-semibold">
                      <span aria-label="correct">✅</span>
                      <span className="flex-1">{mistake.correctedText}</span>
                      <SpeakButton text={mistake.correctedText} />
                    </div>

                    <p className="text-muted-foreground text-th mt-3 text-xs">
                      {mistake.explanationTh}
                    </p>

                    {!mistake.resolved && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => resolveMistake(mistake.id)}
                          className="gap-1.5"
                        >
                          <Check className="size-3.5" aria-hidden="true" />
                          {t.progress.markResolved}
                        </Button>
                        <Button asChild size="sm" variant="ghost">
                          <Link href="/practice">
                            {t.progress.practiceThis}
                          </Link>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </section>
    </div>
  );
}
