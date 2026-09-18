"use client";

import {
  ArrowRight,
  BookOpen,
  Clock,
  Flame,
  MessageCircle,
  Mic,
  Sparkles,
  Target,
  Wrench,
} from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ProgressRing, StatTile } from "@/components/ui-kit";
import { useI18n } from "@/lib/i18n/provider";
import { fadeUp, staggerContainer, transition } from "@/lib/motion";
import {
  selectLessonsCompleted,
  selectNextLesson,
  selectTodayActivity,
  useAppStore,
} from "@/lib/store/use-app-store";
import { useIsClient } from "@/lib/use-is-client";

function greetingKey(hour: number) {
  if (hour < 12) return "greetingMorning" as const;
  if (hour < 18) return "greetingAfternoon" as const;
  return "greetingEvening" as const;
}

export default function DashboardPage() {
  const { t, pick } = useI18n();

  const hydrated = useAppStore((s) => s.hasHydrated);
  const profile = useAppStore((s) => s.profile);
  const streak = useAppStore((s) => s.currentStreak);
  const longestStreak = useAppStore((s) => s.longestStreak);
  const xp = useAppStore((s) => s.xp);
  const mistakes = useAppStore((s) => s.mistakes);
  const dueVocabulary = useAppStore((s) => s.dueVocabulary);

  const nextLesson = useAppStore(selectNextLesson);
  const lessonsCompleted = useAppStore(selectLessonsCompleted);
  const today = useAppStore(selectTodayActivity);
  const lessonStatus = useAppStore((s) => s.lessons[nextLesson.id]?.status);

  // The greeting depends on the clock, which the server cannot know. Render
  // the morning wording until the client can supply the real hour.
  const isClient = useIsClient();
  const greeting = isClient
    ? greetingKey(new Date().getHours())
    : "greetingMorning";

  const due = hydrated ? dueVocabulary() : [];
  const unresolvedMistakes = mistakes.filter((m) => !m.resolved);

  const goalMinutes = profile.dailyGoalMinutes;
  const minutesToday = today.speakingMinutes + today.conversationMinutes;

  const speakingPct = Math.min(
    100,
    (today.speakingMinutes / goalMinutes) * 100,
  );
  const vocabPct = Math.min(100, (today.wordsReviewed / 5) * 100);
  const conversationPct = Math.min(
    100,
    (today.conversationMinutes / Math.max(5, goalMinutes / 2)) * 100,
  );

  const quickActions = [
    {
      href: "/practice",
      icon: Mic,
      title: t.dashboard.qaPractice,
      sub: t.dashboard.qaPracticeSub,
    },
    {
      href: "/conversation",
      icon: MessageCircle,
      title: t.dashboard.qaConversation,
      sub: t.dashboard.qaConversationSub,
    },
    {
      href: "/progress#mistakes",
      icon: Wrench,
      title: t.dashboard.qaMistakes,
      sub: t.dashboard.qaMistakesSub,
    },
    {
      href: "/vocabulary",
      icon: BookOpen,
      title: t.dashboard.qaVocabulary,
      sub: t.dashboard.qaVocabularySub,
    },
  ];

  return (
    <motion.div
      variants={staggerContainer(0.07)}
      initial="hidden"
      animate="show"
      className="mx-auto max-w-5xl"
    >
      <motion.div variants={fadeUp} className="mb-7">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {t.dashboard[greeting]}, {profile.name} 👋
        </h1>
        <p className="text-muted-foreground text-th mt-1.5">
          {t.dashboard.subtitle}
        </p>
      </motion.div>

      {/* ── Continue learning ───────────────────────────────────────── */}
      <motion.section variants={fadeUp} className="mb-8">
        <h2 className="mb-3 text-sm font-bold tracking-wide uppercase">
          {t.dashboard.continueLearning}
        </h2>
        <Card className="from-primary to-chart-2 text-primary-foreground relative overflow-hidden rounded-2xl border-0 bg-gradient-to-br">
          <div
            aria-hidden="true"
            className="blob absolute -top-12 -right-12 size-56 bg-white/10"
          />
          <CardContent className="relative p-6 sm:p-7">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-white/20 text-white hover:bg-white/25">
                {t.common.day} {nextLesson.day}
              </Badge>
              <Badge className="bg-white/20 text-white hover:bg-white/25">
                {nextLesson.level}
              </Badge>
            </div>

            <h3 className="mt-3.5 text-2xl font-bold tracking-tight sm:text-[1.75rem]">
              {pick(nextLesson.title)}
            </h3>
            <p className="text-th mt-2 max-w-lg text-sm opacity-90">
              {pick(nextLesson.description)}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-4">
              <Button
                asChild
                size="lg"
                className="text-primary rounded-full bg-white px-6 font-semibold hover:bg-white/90"
              >
                <Link href={`/learn/${nextLesson.id}`}>
                  {lessonStatus === "in_progress"
                    ? t.common.continue
                    : t.dashboard.startLesson}
                  <ArrowRight className="ml-1 size-4" aria-hidden="true" />
                </Link>
              </Button>
              <span className="flex items-center gap-1.5 text-sm font-medium opacity-90">
                <Clock className="size-4" aria-hidden="true" />
                {nextLesson.estimatedMinutes} {t.common.minutes}
              </span>
            </div>
          </CardContent>
        </Card>
      </motion.section>

      {/* ── Today's progress ────────────────────────────────────────── */}
      <motion.section variants={fadeUp} className="mb-8">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-sm font-bold tracking-wide uppercase">
            {t.dashboard.todaysProgress}
          </h2>
          <span className="text-muted-foreground text-xs font-semibold tabular-nums">
            {minutesToday}/{goalMinutes} {t.common.min}
          </span>
        </div>

        {hydrated ? (
          <>
            <div className="grid grid-cols-3 gap-3">
              <ProgressRing
                value={speakingPct}
                label={t.dashboard.speaking}
                tone="primary"
              />
              <ProgressRing
                value={vocabPct}
                label={t.dashboard.vocabulary}
                tone="chart-2"
              />
              <ProgressRing
                value={conversationPct}
                label={t.dashboard.conversation}
                tone="chart-3"
              />
            </div>

            {minutesToday >= goalMinutes && (
              <p className="text-success mt-3 text-center text-sm font-semibold">
                {t.dashboard.goalReached}
              </p>
            )}
          </>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-[8.5rem] rounded-xl" />
            ))}
          </div>
        )}
      </motion.section>

      {/* ── Streak, level, XP ───────────────────────────────────────── */}
      <motion.section
        variants={fadeUp}
        className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4"
      >
        <StatTile
          icon={<Flame className="size-5" aria-hidden="true" />}
          countTo={hydrated ? streak : 0}
          suffix=" 🔥"
          label={t.dashboard.streak}
        />
        <StatTile
          icon={<Target className="size-5" aria-hidden="true" />}
          value={profile.englishLevel}
          label={t.levels[profile.englishLevel]}
        />
        <StatTile
          icon={<Sparkles className="size-5" aria-hidden="true" />}
          countTo={hydrated ? xp : 0}
          label={t.common.xp}
        />
        <StatTile
          icon={<BookOpen className="size-5" aria-hidden="true" />}
          countTo={hydrated ? lessonsCompleted : 0}
          label={t.learn.lessonsCompleted}
        />
      </motion.section>

      {/* ── Review today ────────────────────────────────────────────── */}
      <motion.section variants={fadeUp} className="mb-8">
        <h2 className="mb-3 text-sm font-bold tracking-wide uppercase">
          {t.dashboard.reviewToday}
        </h2>
        <Card className="border-border/70 rounded-2xl shadow-none">
          <CardContent className="flex flex-wrap items-center justify-between gap-4 p-5">
            {hydrated && (due.length > 0 || unresolvedMistakes.length > 0) ? (
              <>
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                  <span className="font-semibold">
                    {due.length}{" "}
                    <span className="text-muted-foreground font-normal">
                      {t.dashboard.words}
                    </span>
                  </span>
                  <span className="font-semibold">
                    {unresolvedMistakes.length}{" "}
                    <span className="text-muted-foreground font-normal">
                      {t.dashboard.mistakes}
                    </span>
                  </span>
                </div>
                <div className="flex gap-2">
                  {due.length > 0 && (
                    <Button asChild size="sm" variant="outline">
                      <Link href="/vocabulary">{t.vocab.startReview}</Link>
                    </Button>
                  )}
                  {unresolvedMistakes.length > 0 && (
                    <Button asChild size="sm">
                      <Link href="/progress#mistakes">
                        {t.dashboard.qaMistakes}
                      </Link>
                    </Button>
                  )}
                </div>
              </>
            ) : (
              <p className="text-muted-foreground text-th text-sm">
                {t.dashboard.nothingToReview}
              </p>
            )}
          </CardContent>
        </Card>
      </motion.section>

      {/* ── Quick actions ───────────────────────────────────────────── */}
      <motion.section variants={fadeUp}>
        <h2 className="mb-3 text-sm font-bold tracking-wide uppercase">
          {t.dashboard.quickActions}
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {quickActions.map(({ href, icon: Icon, title, sub }) => (
            <motion.div
              key={href}
              whileHover={{ y: -3 }}
              transition={transition}
            >
              <Link
                href={href}
                className="focus-visible:ring-ring group rounded-2xl focus-visible:ring-2 focus-visible:outline-none"
              >
                <Card className="border-border/70 hover:border-primary/40 h-full rounded-2xl shadow-none transition-colors">
                  <CardContent className="flex items-center gap-4 p-5">
                    <span className="bg-accent text-accent-foreground grid size-11 shrink-0 place-items-center rounded-xl">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold">{title}</p>
                      <p className="text-muted-foreground text-th mt-0.5 text-xs">
                        {sub}
                      </p>
                    </div>
                    <ArrowRight
                      className="text-muted-foreground group-hover:text-primary size-4 shrink-0 transition-colors"
                      aria-hidden="true"
                    />
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {hydrated && longestStreak > streak && (
        <p className="text-muted-foreground mt-6 text-center text-xs">
          {t.dashboard.longestStreak}: {longestStreak} 🔥
        </p>
      )}
    </motion.div>
  );
}
