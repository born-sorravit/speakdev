"use client";

import {
  ArrowRight,
  Check,
  Lightbulb,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { motion } from "motion/react";

import { SpeakButton } from "@/components/speak-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n/provider";
import { fadeUp, feedbackIn, staggerContainer } from "@/lib/motion";
import type { AnswerEvaluation } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * Renders the AI's structured evaluation (§26).
 *
 * The tone rules from §28 are enforced here, not left to the copy: the
 * heading is "Almost!" or "That works!", never "Wrong". The learner's own
 * sentence is shown neutrally rather than struck through, and the corrected
 * version is framed as "try this" instead of "the right answer".
 */
export function FeedbackCard({
  evaluation,
  onRetry,
  onContinue,
  continueLabel,
}: {
  evaluation: AnswerEvaluation;
  onRetry?: () => void;
  onContinue?: () => void;
  continueLabel?: string;
}) {
  const { t, locale } = useI18n();
  const good = evaluation.isCorrect;

  return (
    <motion.div variants={feedbackIn} initial="hidden" animate="show">
      <Card
        className={cn(
          "overflow-hidden border-2",
          good
            ? "border-success/40 bg-success/5"
            : "border-warning/40 bg-warning/5",
        )}
      >
        {/*
          The heading lands first, then the sentences, then the reason — so
          the learner reads "Almost! 👍" before they see what was wrong. The
          order is the reassurance (§28), not just decoration.
        */}
        <motion.div
          variants={staggerContainer(0.07, 0.08)}
          initial="hidden"
          animate="show"
        >
          <CardContent className="space-y-5 p-5 sm:p-6">
            <motion.div variants={fadeUp} className="flex items-start gap-3">
              <span
                className={cn(
                  "grid size-9 shrink-0 place-items-center rounded-full",
                  good
                    ? "bg-success text-success-foreground"
                    : "bg-warning text-warning-foreground",
                )}
              >
                {good ? (
                  <Check className="size-5" aria-hidden="true" />
                ) : (
                  <Sparkles className="size-[18px]" aria-hidden="true" />
                )}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-lg font-bold">
                  {good ? t.feedback.great : t.feedback.almost}
                </p>
                <p className="text-muted-foreground text-th mt-0.5 text-sm">
                  {locale === "th"
                    ? evaluation.encouragementTh
                    : evaluation.encouragement}
                </p>
              </div>
            </motion.div>

            {/* The learner's sentence, shown plainly — no red, no strikethrough. */}
            <motion.div variants={fadeUp} className="space-y-3">
              <div>
                <p className="text-muted-foreground mb-1 text-xs font-semibold tracking-wide uppercase">
                  {t.feedback.yourSentence}
                </p>
                <p className="bg-card rounded-xl border px-3.5 py-2.5 text-[0.9375rem]">
                  {evaluation.original}
                </p>
              </div>

              {!good && (
                <div>
                  <p className="text-muted-foreground mb-1 text-xs font-semibold tracking-wide uppercase">
                    {t.feedback.tryThis}
                  </p>
                  <div className="border-success/50 bg-success/10 flex items-center gap-2 rounded-xl border px-3.5 py-2.5">
                    <p className="flex-1 text-[0.9375rem] font-semibold">
                      {evaluation.corrected}
                    </p>
                    <SpeakButton text={evaluation.corrected} />
                  </div>
                </div>
              )}

              {evaluation.naturalAlternative && (
                <div>
                  <p className="text-muted-foreground mb-1 text-xs font-semibold tracking-wide uppercase">
                    {t.feedback.evenMoreNatural}
                  </p>
                  <div className="bg-accent text-accent-foreground flex items-center gap-2 rounded-xl px-3.5 py-2.5">
                    <p className="flex-1 text-[0.9375rem]">
                      {evaluation.naturalAlternative}
                    </p>
                    <SpeakButton text={evaluation.naturalAlternative} />
                  </div>
                </div>
              )}
            </motion.div>

            {/* Always Thai — the brief is explicit that reasons land in Thai (§10). */}
            <motion.div
              variants={fadeUp}
              className="bg-card/70 flex gap-3 rounded-xl border p-3.5"
            >
              <Lightbulb
                className="text-primary mt-0.5 size-[18px] shrink-0"
                aria-hidden="true"
              />
              <div className="min-w-0">
                <p className="text-xs font-semibold tracking-wide uppercase">
                  {t.feedback.why}
                </p>
                <p className="text-th mt-1 text-sm">
                  {evaluation.explanationThai}
                </p>
              </div>
            </motion.div>

            {evaluation.importantMistakes.length > 0 && (
              <motion.div variants={fadeUp}>
                <p className="text-muted-foreground mb-2 text-xs font-semibold tracking-wide uppercase">
                  {t.feedback.whatToFix}
                </p>
                <ul className="space-y-1.5">
                  {evaluation.importantMistakes.map((mistake, index) => (
                    <li
                      key={`${mistake.type}-${index}`}
                      className="text-th flex items-start gap-2 text-sm"
                    >
                      <span className="bg-primary mt-[0.5rem] size-1.5 shrink-0 rounded-full" />
                      <span>
                        {locale === "th"
                          ? mistake.descriptionTh
                          : mistake.description}
                      </span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            <motion.div variants={fadeUp} className="flex flex-wrap gap-2 pt-1">
              {onRetry && (
                <Button variant="outline" onClick={onRetry} className="gap-2">
                  <RotateCcw className="size-4" aria-hidden="true" />
                  {t.common.tryAgain}
                </Button>
              )}
              {onContinue && (
                <Button onClick={onContinue} className="gap-2">
                  {continueLabel ??
                    (evaluation.retryRequired
                      ? t.feedback.continueAnyway
                      : t.common.continue)}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Button>
              )}
            </motion.div>

            {evaluation.retryRequired && onRetry && (
              <p className="text-muted-foreground text-th text-xs">
                {t.feedback.sayItAgain}
              </p>
            )}
          </CardContent>
        </motion.div>
      </Card>
    </motion.div>
  );
}
