"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";

import { LanguageSegmented } from "@/components/language-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/ui-kit";
import { useI18n } from "@/lib/i18n/provider";
import { useAppStore } from "@/lib/store/use-app-store";
import { ENGLISH_LEVELS, type EnglishLevel } from "@/lib/types";
import { cn } from "@/lib/utils";

const DAILY_GOALS = [10, 20, 30, 45] as const;

const TOPICS = [
  "Backend",
  "Frontend",
  "APIs",
  "Standup",
  "Code Review",
  "Databases",
  "Deployment",
  "Interviews",
];

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-6">
      <h2 className="mb-3 text-sm font-bold tracking-wide uppercase">{title}</h2>
      <Card className="border-border/70 rounded-2xl shadow-none">
        <CardContent className="space-y-5 p-5">{children}</CardContent>
      </Card>
    </section>
  );
}

export default function ProfilePage() {
  const { t } = useI18n();
  const router = useRouter();

  const profile = useAppStore((s) => s.profile);
  const updateProfile = useAppStore((s) => s.updateProfile);
  const reset = useAppStore((s) => s.reset);

  function toggleTopic(topic: string) {
    const current = profile.preferredTopics;
    updateProfile({
      preferredTopics: current.includes(topic)
        ? current.filter((item) => item !== topic)
        : [...current, topic],
    });
  }

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title={t.profile.title} subtitle={t.profile.subtitle} />

      <Section title={t.profile.account}>
        <div className="space-y-2">
          <Label htmlFor="name">{t.common.name}</Label>
          <Input
            id="name"
            value={profile.name}
            onChange={(e) => updateProfile({ name: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">{t.common.email}</Label>
          <Input
            id="email"
            type="email"
            value={profile.email}
            onChange={(e) => updateProfile({ email: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="occupation">{t.profile.occupation}</Label>
          <Input
            id="occupation"
            value={profile.occupation}
            onChange={(e) => updateProfile({ occupation: e.target.value })}
          />
          <p className="text-muted-foreground text-th text-xs">
            {/* Developer-specific lessons are a headline feature (§20). */}
            Software Developer → Month 2 &amp; 3 unlock developer lessons.
          </p>
        </div>
      </Section>

      <Section title={t.profile.learning}>
        <div className="space-y-2">
          <Label htmlFor="level">{t.profile.englishLevel}</Label>
          <Select
            value={profile.englishLevel}
            onValueChange={(value) =>
              updateProfile({ englishLevel: value as EnglishLevel })
            }
          >
            <SelectTrigger id="level" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ENGLISH_LEVELS.map((level) => (
                <SelectItem key={level} value={level}>
                  {level} · {t.levels[level]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="native">{t.profile.nativeLanguage}</Label>
          <Input
            id="native"
            value={profile.nativeLanguage}
            onChange={(e) => updateProfile({ nativeLanguage: e.target.value })}
          />
        </div>

        <div className="space-y-2.5">
          <Label>{t.profile.dailyGoal}</Label>
          <div className="grid grid-cols-4 gap-2">
            {DAILY_GOALS.map((minutes) => (
              <button
                key={minutes}
                type="button"
                onClick={() => updateProfile({ dailyGoalMinutes: minutes })}
                aria-pressed={profile.dailyGoalMinutes === minutes}
                className={cn(
                  "focus-visible:ring-ring rounded-xl border py-3 text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:outline-none",
                  profile.dailyGoalMinutes === minutes
                    ? "border-primary bg-primary text-primary-foreground"
                    : "bg-card hover:bg-accent hover:text-accent-foreground",
                )}
              >
                {minutes}
                <span className="block text-[0.625rem] font-normal opacity-80">
                  {t.common.min}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2.5">
          <Label>{t.profile.topics}</Label>
          <div className="flex flex-wrap gap-2">
            {TOPICS.map((topic) => {
              const active = profile.preferredTopics.includes(topic);
              return (
                <button
                  key={topic}
                  type="button"
                  onClick={() => toggleTopic(topic)}
                  aria-pressed={active}
                  className={cn(
                    "focus-visible:ring-ring rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none",
                    active
                      ? "border-primary bg-primary text-primary-foreground"
                      : "bg-card hover:bg-accent hover:text-accent-foreground",
                  )}
                >
                  {topic}
                </button>
              );
            })}
          </div>
        </div>
      </Section>

      <Section title={t.profile.preferences}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Label>{t.profile.interfaceLanguage}</Label>
          <LanguageSegmented />
        </div>

        <div className="flex items-center justify-between gap-3">
          <Label>{t.profile.appearance}</Label>
          <ThemeToggle />
        </div>
      </Section>

      <section>
        <h2 className="text-destructive mb-3 text-sm font-bold tracking-wide uppercase">
          {t.profile.resetProgress}
        </h2>
        <Card className="border-destructive/30 rounded-2xl shadow-none">
          <CardContent className="flex flex-wrap items-center justify-between gap-4 p-5">
            <p className="text-muted-foreground text-th max-w-sm text-sm">
              {t.profile.resetProgressSub}
            </p>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="destructive" className="gap-2">
                  <Trash2 className="size-4" aria-hidden="true" />
                  {t.profile.reset}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t.profile.resetConfirm}</DialogTitle>
                  <DialogDescription className="text-th">
                    {t.profile.resetConfirmSub}
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">{t.common.cancel}</Button>
                  </DialogClose>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      reset();
                      toast.success(t.profile.resetProgress);
                      router.push("/dashboard");
                    }}
                  >
                    {t.profile.reset}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
