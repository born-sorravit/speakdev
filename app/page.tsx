"use client";

import {
  ArrowRight,
  Bug,
  CalendarCheck,
  Check,
  Languages,
  MessageSquareQuote,
  Mic,
  Repeat2,
  Rocket,
  Sparkles,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

import { Brand } from "@/components/brand";
import { LanguageToggle } from "@/components/language-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AnimatedNumber } from "@/components/ui-kit";
import { LESSONS } from "@/lib/data/lessons";
import { SCENARIOS } from "@/lib/data/scenarios";
import { VOCABULARY } from "@/lib/data/vocabulary";
import { useI18n } from "@/lib/i18n/provider";
import {
  fadeUp,
  staggerContainer,
  transition,
  viewportOnce,
} from "@/lib/motion";

function SiteHeader() {
  const { t } = useI18n();

  return (
    <header className="bg-background/80 sticky top-0 z-40 border-b backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
        <Brand />
        <div className="flex items-center gap-1 sm:gap-2">
          <LanguageToggle />
          <ThemeToggle />
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="hidden sm:inline-flex"
          >
            <Link href="/login">{t.common.signIn}</Link>
          </Button>
          <Button asChild size="sm" className="rounded-full px-4">
            <Link href="/register">{t.common.createAccount}</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  const { t } = useI18n();

  return (
    <section className="relative overflow-hidden">
      {/* Soft organic shapes, echoing the reference layout in the brand palette. */}
      <div
        aria-hidden="true"
        className="bg-secondary blob absolute -top-24 -right-24 size-[26rem] opacity-70 blur-[2px] dark:opacity-30"
      />
      <div
        aria-hidden="true"
        className="bg-accent blob absolute top-40 -left-32 size-72 opacity-80 dark:opacity-25"
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
        <motion.div
          variants={staggerContainer(0.08)}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={fadeUp}>
            <Badge
              variant="secondary"
              className="mb-5 gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold"
            >
              <Sparkles className="size-3.5" aria-hidden="true" />
              {t.landing.badge}
            </Badge>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="text-4xl leading-[1.12] font-extrabold tracking-tight text-balance sm:text-5xl lg:text-[3.4rem]"
          >
            {t.landing.heroTitle1}
            <br />
            <span className="text-primary">{t.landing.heroTitle2}</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="text-muted-foreground text-th mt-5 max-w-xl text-base sm:text-lg"
          >
            {t.landing.heroSub}
          </motion.p>

          <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="rounded-full px-7">
              <Link href="/register">
                {t.landing.ctaPrimary}
                <ArrowRight className="ml-1 size-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full px-7"
            >
              <Link href="#plan">{t.landing.ctaSecondary}</Link>
            </Button>
          </motion.div>

          <motion.dl
            variants={fadeUp}
            className="mt-10 grid max-w-lg grid-cols-3 gap-4"
          >
            {[
              { id: "days", count: 90, suffix: "", label: t.landing.stat1 },
              {
                id: "lessons",
                count: LESSONS.length,
                suffix: "+",
                label: t.landing.stat2Label,
              },
              {
                id: "scenarios",
                count: SCENARIOS.length,
                suffix: "",
                label: t.landing.stat3Label,
              },
            ].map((stat) => (
              <div key={stat.id}>
                <dt className="text-2xl font-bold tracking-tight">
                  <AnimatedNumber value={stat.count} />
                  {stat.suffix}
                </dt>
                <dd className="text-muted-foreground text-th mt-0.5 text-xs font-medium">
                  {stat.label}
                </dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>

        {/* A real sample of the product: one exchange with a correction. */}
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...transition, delay: 0.15 }}
          >
            <Card className="bg-card relative z-10 rounded-3xl border-2 shadow-xl">
              <CardContent className="space-y-4 p-5 sm:p-6">
                <div className="flex items-center gap-2 border-b pb-3">
                  <span className="bg-primary text-primary-foreground grid size-8 place-items-center rounded-full text-xs font-bold">
                    AI
                  </span>
                  <p className="text-sm font-semibold">English Conversation</p>
                </div>

                <div className="space-y-1">
                  <p className="text-muted-foreground text-xs font-semibold">
                    Coach
                  </p>
                  <p className="bg-muted rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm">
                    What are you working on today?
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-muted-foreground text-right text-xs font-semibold">
                    You
                  </p>
                  <p className="bg-primary text-primary-foreground ml-auto w-fit rounded-2xl rounded-tr-sm px-4 py-2.5 text-sm">
                    I working on payment API.
                  </p>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...transition, delay: 0.75 }}
                  className="border-warning/40 bg-warning/5 space-y-2.5 rounded-2xl border-2 p-4"
                >
                  <p className="text-sm font-bold">Almost! 👍</p>
                  <div className="border-success/50 bg-success/10 rounded-lg border px-3 py-2">
                    <p className="text-sm font-semibold">
                      I&apos;m working on the payment API.
                    </p>
                  </div>
                  <p className="text-muted-foreground text-th text-xs">
                    ใช้ I&apos;m เพราะประโยคนี้กำลังพูดถึงสิ่งที่ทำอยู่ตอนนี้
                  </p>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>

          <div
            aria-hidden="true"
            className="bg-primary/10 blob absolute -right-8 -bottom-8 size-56"
          />
        </div>
      </div>
    </section>
  );
}

function Features() {
  const { t } = useI18n();

  // `id`, not `title`, is the list key below: the titles are translated, so
  // keying on them remounts every card when the locale changes — see the note
  // in CLAUDE.md about `whileInView` and remounted variant children.
  const features = [
    {
      id: "bilingual",
      icon: Languages,
      title: t.landing.f1Title,
      body: t.landing.f1Body,
    },
    {
      id: "corrections",
      icon: MessageSquareQuote,
      title: t.landing.f2Title,
      body: t.landing.f2Body,
    },
    {
      id: "mistakes",
      icon: Bug,
      title: t.landing.f3Title,
      body: t.landing.f3Body,
    },
    {
      id: "repetition",
      icon: Repeat2,
      title: t.landing.f4Title,
      body: t.landing.f4Body,
    },
  ];

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="mx-auto max-w-2xl text-center"
      >
        <p className="text-primary text-sm font-bold tracking-widest uppercase">
          {t.landing.featuresKicker}
        </p>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-balance sm:text-4xl">
          {t.landing.featuresTitle}
        </h2>
        <p className="text-muted-foreground text-th mt-4">
          {t.landing.featuresSub}
        </p>
      </motion.div>

      <motion.div
        variants={staggerContainer(0.08)}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="mt-12 grid gap-5 sm:grid-cols-2"
      >
        {features.map(({ id, icon: Icon, title, body }) => (
          <motion.div key={id} variants={fadeUp}>
            <Card className="rounded-2xl border-border/70 h-full shadow-none">
              <CardContent className="p-6">
                <span className="bg-accent text-accent-foreground mb-4 grid size-11 place-items-center rounded-xl">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <h3 className="text-lg font-bold">{title}</h3>
                <p className="text-muted-foreground text-th mt-2 text-sm">
                  {body}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

function Plan() {
  const { t } = useI18n();

  const months = [
    {
      n: 1,
      icon: Mic,
      title: t.landing.m1Title,
      body: t.landing.m1Body,
      items: [
        "I am ...",
        "I work ...",
        "I'm working on ...",
        "Yesterday, I ...",
      ],
    },
    {
      n: 2,
      icon: CalendarCheck,
      title: t.landing.m2Title,
      body: t.landing.m2Body,
      items: [
        "Yesterday, I worked on ...",
        "I'm currently blocked by ...",
        "The problem happens when ...",
        "I think we should ...",
      ],
    },
    {
      n: 3,
      icon: Rocket,
      title: t.landing.m3Title,
      body: t.landing.m3Body,
      items: [
        "Could you clarify ...?",
        "The trade-off is ...",
        "I was responsible for ...",
        "The biggest challenge was ...",
      ],
    },
  ];

  return (
    <section id="plan" className="bg-muted/50 scroll-mt-16 border-y">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="text-primary text-sm font-bold tracking-widest uppercase">
            {t.landing.planKicker}
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-balance sm:text-4xl">
            {t.landing.planTitle}
          </h2>
          <p className="text-muted-foreground text-th mt-4">
            {t.landing.planSub}
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer(0.1)}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="mt-12 grid gap-5 lg:grid-cols-3"
        >
          {months.map(({ n, icon: Icon, title, body, items }) => (
            <motion.div key={n} variants={fadeUp}>
              <Card className="bg-card h-full rounded-2xl shadow-none">
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <span className="bg-primary text-primary-foreground grid size-10 place-items-center rounded-xl">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <span className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
                      {t.common.month} {n}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold">{title}</h3>
                  <p className="text-muted-foreground text-th mt-2 text-sm">
                    {body}
                  </p>
                  <ul className="mt-5 space-y-2 border-t pt-5">
                    {items.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm">
                        <Check
                          className="text-primary mt-0.5 size-4 shrink-0"
                          aria-hidden="true"
                        />
                        <code className="font-mono text-[0.8125rem]">
                          {item}
                        </code>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function CallToAction() {
  const { t } = useI18n();

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="bg-primary text-primary-foreground relative overflow-hidden rounded-3xl px-6 py-14 text-center sm:px-12"
      >
        <div
          aria-hidden="true"
          className="blob absolute -top-16 -right-10 size-64 bg-white/10"
        />
        <div
          aria-hidden="true"
          className="blob absolute -bottom-20 -left-10 size-56 bg-white/10"
        />
        <div className="relative">
          <h2 className="text-3xl font-extrabold tracking-tight text-balance sm:text-4xl">
            {t.landing.ctaTitle}
          </h2>
          <p className="text-th mx-auto mt-4 max-w-md opacity-90">
            {t.landing.ctaBody}
          </p>
          <Button
            asChild
            size="lg"
            className="text-primary mt-8 rounded-full bg-white px-8 font-semibold hover:bg-white/90"
          >
            <Link href="/register">
              {t.landing.ctaPrimary}
              <ArrowRight className="ml-1 size-4" aria-hidden="true" />
            </Link>
          </Button>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm opacity-90">
            <span className="flex items-center gap-1.5">
              <Users className="size-4" aria-hidden="true" />
              <AnimatedNumber value={VOCABULARY.length} /> {t.landing.stat4Label}
            </span>
            <span className="flex items-center gap-1.5">
              <MessageSquareQuote className="size-4" aria-hidden="true" />
              <AnimatedNumber value={SCENARIOS.length} /> {t.landing.stat3Label}
            </span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

export default function LandingPage() {
  const { t } = useI18n();

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <Features />
        <Plan />
        <CallToAction />
      </main>
      <footer className="border-t">
        <div className="text-muted-foreground mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-8 text-sm sm:px-6">
          <Brand />
          <p className="text-th">{t.landing.footer}</p>
        </div>
      </footer>
    </>
  );
}
