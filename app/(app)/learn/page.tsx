"use client";

import { Check, Clock, Lock, Play } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MeterRow, PageHeader } from "@/components/ui-kit";
import { CURRICULUM, TOTAL_DAYS } from "@/lib/data/curriculum";
import { AUTHORED_THROUGH_DAY, getLessonByDay } from "@/lib/data/lessons";
import { format, useI18n } from "@/lib/i18n/provider";
import { fadeUp, staggerContainer, transition } from "@/lib/motion";
import { selectLessonsCompleted, useAppStore } from "@/lib/store/use-app-store";
import { cn } from "@/lib/utils";

export default function LearnPage() {
  const { t, pick } = useI18n();

  const hydrated = useAppStore((s) => s.hasHydrated);
  const lessons = useAppStore((s) => s.lessons);
  const completed = useAppStore(selectLessonsCompleted);

  const monthTitles = [t.learn.month1, t.learn.month2, t.learn.month3];

  // Open the month the learner is currently in.
  const defaultMonth = React.useMemo(() => {
    const nextDay = Math.min(completed + 1, TOTAL_DAYS);
    if (nextDay > 56) return "month-3";
    if (nextDay > 28) return "month-2";
    return "month-1";
  }, [completed]);

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader title={t.learn.title} subtitle={t.learn.subtitle} />

      <Card className="border-border/70 mb-7 rounded-2xl shadow-none">
        <CardContent className="p-5">
          <MeterRow
            label={t.progress.lessons}
            value={(completed / TOTAL_DAYS) * 100}
            hint={`${hydrated ? completed : 0} / ${TOTAL_DAYS}`}
          />
        </CardContent>
      </Card>

      <Accordion
        type="single"
        collapsible
        defaultValue={defaultMonth}
        className="space-y-4"
      >
        {CURRICULUM.map((month) => (
          <AccordionItem
            key={month.month}
            value={`month-${month.month}`}
            className="bg-card overflow-hidden rounded-2xl border px-0"
          >
            <AccordionTrigger className="px-5 py-4 hover:no-underline">
              <div className="flex-1 pr-3 text-left">
                <p className="font-bold">{monthTitles[month.month - 1]}</p>
                <p className="text-muted-foreground text-th mt-1 text-xs font-normal">
                  {pick(month.goal)}
                </p>
              </div>
            </AccordionTrigger>

            <AccordionContent className="px-5 pb-5">
              <div className="space-y-5">
                {month.weeks.map((week) => (
                  <div key={week.week}>
                    <p className="text-muted-foreground mb-2.5 text-xs font-bold tracking-wide uppercase">
                      {t.common.week} {week.week} · {pick(week.title)}
                    </p>

                    <motion.ul
                      variants={staggerContainer(0.03)}
                      initial="hidden"
                      animate="show"
                      className="space-y-1.5"
                    >
                      {week.days.map((entry) => {
                        const lesson = getLessonByDay(entry.day);
                        const locked =
                          !lesson || entry.day > AUTHORED_THROUGH_DAY;
                        const status = lesson
                          ? lessons[lesson.id]?.status
                          : undefined;
                        const isCompleted = status === "completed";
                        const inProgress = status === "in_progress";

                        const row = (
                          <div
                            className={cn(
                              "flex items-center gap-3 rounded-xl border px-3.5 py-3 transition-colors",
                              locked
                                ? "border-transparent opacity-55"
                                : "hover:border-primary/40 hover:bg-accent/40",
                              isCompleted && "border-success/30 bg-success/5",
                            )}
                          >
                            <span
                              className={cn(
                                "grid size-8 shrink-0 place-items-center rounded-lg text-xs font-bold",
                                isCompleted
                                  ? "bg-success text-success-foreground"
                                  : locked
                                    ? "bg-muted text-muted-foreground"
                                    : "bg-accent text-accent-foreground",
                              )}
                            >
                              {isCompleted ? (
                                <Check className="size-4" aria-hidden="true" />
                              ) : locked ? (
                                <Lock className="size-3.5" aria-hidden="true" />
                              ) : (
                                entry.day
                              )}
                            </span>

                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-medium">
                                {pick(entry.title)}
                              </p>
                              <p className="text-muted-foreground mt-0.5 flex items-center gap-1 text-xs">
                                <Clock className="size-3" aria-hidden="true" />
                                {entry.estimatedMinutes} {t.common.min}
                              </p>
                            </div>

                            {inProgress && (
                              <Badge variant="secondary" className="shrink-0">
                                {t.learn.inProgress}
                              </Badge>
                            )}
                            {!locked && !isCompleted && !inProgress && (
                              <Play
                                className="text-muted-foreground size-4 shrink-0"
                                aria-hidden="true"
                              />
                            )}
                          </div>
                        );

                        return (
                          <motion.li key={entry.day} variants={fadeUp}>
                            {locked || !lesson ? (
                              <div aria-disabled="true" title={t.learn.locked}>
                                {row}
                              </div>
                            ) : (
                              <motion.div
                                whileHover={{ x: 3 }}
                                transition={transition}
                              >
                                <Link
                                  href={`/learn/${lesson.id}`}
                                  className="focus-visible:ring-ring block rounded-xl focus-visible:ring-2 focus-visible:outline-none"
                                >
                                  {row}
                                </Link>
                              </motion.div>
                            )}
                          </motion.li>
                        );
                      })}
                    </motion.ul>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <p className="text-muted-foreground text-th mt-6 text-center text-xs">
        {format(t.learn.availableNote, {
          n: AUTHORED_THROUGH_DAY,
          total: TOTAL_DAYS,
        })}
      </p>
    </div>
  );
}
