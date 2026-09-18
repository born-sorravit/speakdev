"use client";

import {
  ArrowLeft,
  Languages,
  Lightbulb,
  Mic,
  Send,
  Sparkles,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useSearchParams } from "next/navigation";
import * as React from "react";

import { SpeakButton } from "@/components/speak-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/ui-kit";
import type { ConversationReport } from "@/lib/ai";
import { getAIService } from "@/lib/ai";
import { SCENARIOS } from "@/lib/data/scenarios";
import { useI18n } from "@/lib/i18n/provider";
import { fadeUp, messageIn, staggerContainer, transition } from "@/lib/motion";
import { useAppStore, useWeakVocabulary } from "@/lib/store/use-app-store";
import type {
  ConversationMessage,
  ConversationScenario,
  ScenarioGroup,
} from "@/lib/types";
import { cn } from "@/lib/utils";

function makeId() {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export default function ConversationPage() {
  // `useSearchParams` needs a Suspense boundary above it on a prerendered
  // route, so the page body lives in its own component.
  return (
    <React.Suspense fallback={null}>
      <ConversationView />
    </React.Suspense>
  );
}

function ConversationView() {
  const requested = useSearchParams().get("scenario");

  // Seeded from the URL (the quick-jump palette links straight to a scenario)
  // and owned by this component from then on.
  const [scenario, setScenario] = React.useState<ConversationScenario | null>(
    () => SCENARIOS.find((item) => item.id === requested) ?? null,
  );

  if (!scenario) {
    return <ScenarioPicker onPick={setScenario} />;
  }

  return (
    <ChatView
      key={scenario.id}
      scenario={scenario}
      onBack={() => setScenario(null)}
    />
  );
}

function ScenarioPicker({
  onPick,
}: {
  onPick: (scenario: ConversationScenario) => void;
}) {
  const { t, pick } = useI18n();
  const [group, setGroup] = React.useState<ScenarioGroup>("beginner");

  const groups: Array<{ id: ScenarioGroup; label: string }> = [
    { id: "beginner", label: t.conversation.beginner },
    { id: "workplace", label: t.conversation.workplace },
    { id: "developer", label: t.conversation.developer },
    { id: "interview", label: t.conversation.interview },
  ];

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title={t.conversation.title}
        subtitle={t.conversation.subtitle}
      />

      <Tabs
        value={group}
        onValueChange={(value) => setGroup(value as ScenarioGroup)}
      >
        <TabsList className="no-scrollbar mb-5 flex w-full justify-start overflow-x-auto">
          {groups.map((item) => (
            <TabsTrigger key={item.id} value={item.id} className="shrink-0 sm:flex-1">
              {item.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Re-keyed on `group` so switching tabs replays the arrival. */}
      <motion.div
        key={group}
        variants={staggerContainer(0.05)}
        initial="hidden"
        animate="show"
        className="grid gap-3 sm:grid-cols-2"
      >
        {SCENARIOS.filter((s) => s.group === group).map((s) => (
          <motion.button
            key={s.id}
            type="button"
            variants={fadeUp}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.99 }}
            transition={transition}
            onClick={() => onPick(s)}
            className="focus-visible:ring-ring rounded-2xl text-left focus-visible:ring-2 focus-visible:outline-none"
          >
            <Card className="border-border/70 hover:border-primary/40 h-full rounded-2xl shadow-none transition-colors">
              <CardContent className="p-5">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <span className="text-2xl" aria-hidden="true">
                    {s.icon}
                  </span>
                  <Badge variant="outline">{s.level}</Badge>
                </div>
                <p className="font-semibold">{pick(s.title)}</p>
                <p className="text-muted-foreground text-th mt-1.5 text-sm">
                  {pick(s.description)}
                </p>
              </CardContent>
            </Card>
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
}

function ChatView({
  scenario,
  onBack,
}: {
  scenario: ConversationScenario;
  onBack: () => void;
}) {
  const { t, pick, locale } = useI18n();
  const ai = React.useMemo(() => getAIService(), []);

  const level = useAppStore((s) => s.profile.englishLevel);
  const mistakes = useAppStore((s) => s.mistakes);
  const recordAnswer = useAppStore((s) => s.recordAnswer);
  const completeConversation = useAppStore((s) => s.completeConversation);
  const addConversationMinutes = useAppStore((s) => s.addConversationMinutes);
  const weakVocabulary = useWeakVocabulary();

  // The opener is fixed content, so it needs no generated id or timestamp —
  // keeping the initializer pure also keeps it safe to re-run.
  const [messages, setMessages] = React.useState<ConversationMessage[]>([
    {
      id: "opener",
      role: "coach",
      content: scenario.opener,
      translationTh: scenario.openerTh,
      createdAt: "",
    },
  ]);
  const [draft, setDraft] = React.useState("");
  const [thinking, setThinking] = React.useState(false);
  const [showTranslations, setShowTranslations] = React.useState(false);
  const [report, setReport] = React.useState<ConversationReport | null>(null);
  const startedAt = React.useRef<number | null>(null);

  React.useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  const endRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, thinking]);

  async function send() {
    const text = draft.trim();
    if (!text || thinking) return;

    const learnerMessage: ConversationMessage = {
      id: makeId(),
      role: "learner",
      content: text,
      createdAt: new Date().toISOString(),
    };

    const history = [...messages, learnerMessage];
    setMessages(history);
    setDraft("");
    setThinking(true);

    try {
      const turn = await ai.generateConversation({
        scenario,
        history,
        context: { level, recentMistakes: mistakes, weakVocabulary },
      });

      if (turn.correction) recordAnswer(turn.correction);

      setMessages((previous) => [
        // Attach the correction to the learner's own message, so the fix sits
        // next to what they wrote rather than interrupting the coach's reply.
        ...previous.map((m) =>
          m.id === learnerMessage.id
            ? { ...m, correction: turn.correction }
            : m,
        ),
        {
          id: makeId(),
          role: "coach" as const,
          content: turn.content,
          translationTh: turn.translationTh,
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setThinking(false);
    }
  }

  async function finish() {
    const minutes = Math.max(
      1,
      Math.round((Date.now() - (startedAt.current ?? Date.now())) / 60_000),
    );
    addConversationMinutes(minutes);

    const result = await ai.evaluateConversation(messages, {
      level,
      recentMistakes: mistakes,
      weakVocabulary,
    });
    completeConversation(result.xpEarned);
    setReport(result);
  }

  const learnerTurns = messages.filter((m) => m.role === "learner").length;

  if (report) {
    return (
      <div className="mx-auto max-w-2xl">
        <Card className="border-primary/30 rounded-2xl border-2">
          <CardContent className="p-6 sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <span className="bg-primary text-primary-foreground grid size-12 place-items-center rounded-full">
                <Sparkles className="size-6" aria-hidden="true" />
              </span>
              <div>
                <h2 className="text-xl font-bold">
                  {t.conversation.summaryTitle}
                </h2>
                <p className="text-muted-foreground text-sm">
                  {report.turns} {t.conversation.turns} · +{report.xpEarned}{" "}
                  {t.common.xp}
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <p className="text-success mb-2 text-xs font-bold tracking-wide uppercase">
                  {t.progress.skills}
                </p>
                <ul className="space-y-1.5">
                  {(locale === "th" ? report.strengthsTh : report.strengths).map(
                    (item, i) => (
                      <li key={i} className="text-th flex items-start gap-2 text-sm">
                        <span className="bg-success mt-[0.5rem] size-1.5 shrink-0 rounded-full" />
                        {item}
                      </li>
                    ),
                  )}
                </ul>
              </div>

              <div>
                <p className="text-primary mb-2 text-xs font-bold tracking-wide uppercase">
                  {t.progress.practiceThis}
                </p>
                <ul className="space-y-1.5">
                  {(locale === "th" ? report.focusNextTh : report.focusNext).map(
                    (item, i) => (
                      <li key={i} className="text-th flex items-start gap-2 text-sm">
                        <span className="bg-primary mt-[0.5rem] size-1.5 shrink-0 rounded-full" />
                        {item}
                      </li>
                    ),
                  )}
                </ul>
              </div>
            </div>

            <Button className="mt-7 w-full" size="lg" onClick={onBack}>
              {t.conversation.newConversation}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto flex h-[calc(100dvh-11rem)] max-w-2xl flex-col lg:h-[calc(100dvh-9rem)]">
      {/* ── Chat header ─────────────────────────────────────────────── */}
      <div className="mb-3 flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="-ml-2 size-9 shrink-0"
          aria-label={t.common.back}
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
        </Button>

        <span className="text-xl" aria-hidden="true">
          {scenario.icon}
        </span>

        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold">{pick(scenario.title)}</p>
          <p className="text-muted-foreground text-xs">{scenario.level}</p>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="size-9 shrink-0"
          onClick={() => setShowTranslations((v) => !v)}
          aria-pressed={showTranslations}
          aria-label={
            showTranslations
              ? t.common.hideTranslation
              : t.common.showTranslation
          }
        >
          <Languages
            className={cn("size-4", showTranslations && "text-primary")}
            aria-hidden="true"
          />
        </Button>
      </div>

      {/* ── Messages ────────────────────────────────────────────────── */}
      <div className="bg-card flex-1 overflow-y-auto rounded-2xl border p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              variants={messageIn}
              initial="hidden"
              animate="show"
            >
              {message.role === "coach" ? (
                <div className="flex gap-2.5">
                  <span className="bg-primary text-primary-foreground grid size-8 shrink-0 place-items-center rounded-full text-[0.625rem] font-bold">
                    AI
                  </span>
                  <div className="min-w-0 max-w-[85%]">
                    <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-2.5">
                      <p className="text-sm">{message.content}</p>
                    </div>
                    <div className="mt-1 flex items-center gap-1">
                      <SpeakButton text={message.content} />
                      {showTranslations && message.translationTh && (
                        <p className="text-muted-foreground text-th text-xs">
                          {message.translationTh}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-end gap-1.5">
                  <div className="bg-primary text-primary-foreground max-w-[85%] rounded-2xl rounded-tr-sm px-4 py-2.5">
                    <p className="text-sm">{message.content}</p>
                  </div>

                  {/* Inline correction, in the gentle §28 framing. */}
                  {message.correction && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ ...transition, delay: 0.12 }}
                      className="border-warning/40 bg-warning/5 w-full max-w-[92%] space-y-2 rounded-xl border p-3"
                    >
                      <p className="text-xs font-bold">{t.feedback.almost}</p>
                      <div className="border-success/40 bg-success/10 flex items-center gap-2 rounded-lg border px-2.5 py-1.5">
                        <p className="flex-1 text-sm font-semibold">
                          {message.correction.corrected}
                        </p>
                        <SpeakButton text={message.correction.corrected} />
                      </div>
                      <p className="text-muted-foreground text-th flex gap-1.5 text-xs">
                        <Lightbulb
                          className="text-primary mt-0.5 size-3 shrink-0"
                          aria-hidden="true"
                        />
                        {message.correction.explanationThai}
                      </p>
                    </motion.div>
                  )}
                </div>
              )}
            </motion.div>
          ))}

          <AnimatePresence>
            {thinking && (
              <motion.div
                variants={messageIn}
                initial="hidden"
                animate="show"
                exit={{ opacity: 0 }}
                className="flex gap-2.5"
              >
                <span className="bg-primary text-primary-foreground grid size-8 shrink-0 place-items-center rounded-full text-[0.625rem] font-bold">
                  AI
                </span>
                <div className="bg-muted flex items-center gap-1 rounded-2xl rounded-tl-sm px-4 py-3">
                  {[0, 0.15, 0.3].map((delay) => (
                    <motion.span
                      key={delay}
                      className="bg-muted-foreground/60 size-1.5 rounded-full"
                      animate={{ y: [0, -4, 0] }}
                      transition={{
                        duration: 0.9,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay,
                      }}
                    />
                  ))}
                  <span className="sr-only">{t.conversation.coachTyping}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={endRef} />
        </div>
      </div>

      {/* ── Composer ────────────────────────────────────────────────── */}
      <div className="mt-3 space-y-2">
        <div className="flex gap-2">
          <Input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            placeholder={t.conversation.placeholder}
            className="h-11 text-base"
            aria-label={t.conversation.placeholder}
          />
          <Button
            size="lg"
            className="size-11 shrink-0 p-0"
            onClick={send}
            disabled={!draft.trim() || thinking}
            aria-label={t.conversation.send}
          >
            <Send className="size-4" aria-hidden="true" />
          </Button>
        </div>

        <div className="flex items-center justify-between gap-3">
          <span className="text-muted-foreground text-th flex items-center gap-1.5 text-xs">
            <Mic className="size-3.5" aria-hidden="true" />
            {t.conversation.holdToSpeak} · {t.practice.micSoon}
          </span>
          {learnerTurns > 0 && (
            <Button variant="ghost" size="sm" onClick={finish}>
              {t.conversation.endConversation}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
