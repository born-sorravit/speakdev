"use client";

import * as React from "react";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import { LESSONS } from "@/lib/data/lessons";
import { VOCABULARY } from "@/lib/data/vocabulary";
import type {
  AnswerEvaluation,
  DailyActivity,
  EnglishLevel,
  LessonStatus,
  Locale,
  Mistake,
  MistakeCategory,
  SkillScores,
  UserProfile,
  UserVocabulary,
} from "@/lib/types";

/** XP awards (§14) — deliberately simple. */
export const XP = {
  lessonComplete: 20,
  speakingPractice: 10,
  conversation: 30,
  vocabularyReview: 5,
  mistakeFixed: 15,
} as const;

/** Days until the next review, indexed by mastery 0–5 (§18). */
const REVIEW_INTERVALS_DAYS = [0, 1, 2, 4, 8, 16];

export function todayISO(date = new Date()): string {
  // Local date, not UTC — a learner practising at 1am should still get "today".
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 10);
}

function daysBetween(a: string, b: string): number {
  return Math.round(
    (new Date(b).getTime() - new Date(a).getTime()) / 86_400_000,
  );
}

function emptyActivity(date: string): DailyActivity {
  return {
    date,
    speakingMinutes: 0,
    conversationMinutes: 0,
    lessonsCompleted: 0,
    wordsReviewed: 0,
    xp: 0,
  };
}

export interface LessonProgress {
  status: LessonStatus;
  /** 0–100. */
  progress: number;
  completedAt: string | null;
  /** Average evaluation score across this lesson's practice answers. */
  bestScore: number;
}

interface AppState {
  /** False until `persist` has read localStorage; guards SSR/client mismatch. */
  hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;
  isAuthenticated: boolean;
  /**
   * UI language. It lives here rather than in its own context so the app has
   * exactly one persistence mechanism and one hydration boundary.
   */
  locale: Locale;
  setLocale: (locale: Locale) => void;
  profile: UserProfile;

  lessons: Record<string, LessonProgress>;
  vocabulary: Record<string, UserVocabulary>;
  mistakes: Mistake[];
  activity: DailyActivity[];

  xp: number;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string | null;
  skills: SkillScores;

  // ─── auth ───
  signIn: (email: string, name?: string) => void;
  signOut: () => void;

  // ─── profile ───
  updateProfile: (patch: Partial<UserProfile>) => void;

  // ─── lessons ───
  startLesson: (lessonId: string) => void;
  setLessonProgress: (lessonId: string, progress: number) => void;
  completeLesson: (lessonId: string, score: number) => number;

  // ─── practice ───
  /**
   * Folds an evaluation into the mistake log and skills.
   * `awardXp` is false when the learner is re-submitting a sentence the coach
   * just handed them, so retrying cannot farm XP.
   */
  recordAnswer: (evaluation: AnswerEvaluation, awardXp?: boolean) => void;
  addSpeakingMinutes: (minutes: number) => void;
  addConversationMinutes: (minutes: number) => void;
  completeConversation: (xpEarned: number) => void;

  // ─── mistakes ───
  resolveMistake: (id: string) => void;

  // ─── vocabulary ───
  reviewWord: (vocabularyId: string, grade: "again" | "good" | "easy") => void;
  dueVocabulary: () => string[];

  // ─── misc ───
  reset: () => void;
}

const DEFAULT_PROFILE: UserProfile = {
  id: "local-user",
  name: "Nut",
  email: "you@example.com",
  nativeLanguage: "Thai",
  englishLevel: "A1",
  occupation: "Software Developer",
  dailyGoalMinutes: 20,
  preferredTopics: ["Backend", "APIs", "Standup"],
};

const DEFAULT_SKILLS: SkillScores = {
  speaking: 10,
  listening: 15,
  vocabulary: 12,
  grammar: 10,
  conversation: 8,
  workplace: 5,
};

/** Level thresholds by lessons completed — dynamic difficulty (§13). */
function levelFor(lessonsCompleted: number): EnglishLevel {
  if (lessonsCompleted >= 56) return "B2";
  if (lessonsCompleted >= 35) return "B1";
  if (lessonsCompleted >= 14) return "A2";
  return "A1";
}

function nudge(current: number, delta: number): number {
  return Math.max(0, Math.min(100, Math.round(current + delta)));
}

const initialState = {
  hasHydrated: false,
  isAuthenticated: false,
  locale: "th" as Locale,
  profile: DEFAULT_PROFILE,
  lessons: {} as Record<string, LessonProgress>,
  vocabulary: {} as Record<string, UserVocabulary>,
  mistakes: [] as Mistake[],
  activity: [] as DailyActivity[],
  xp: 0,
  currentStreak: 0,
  longestStreak: 0,
  lastActiveDate: null as string | null,
  skills: DEFAULT_SKILLS,
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => {
      /**
       * Marks today as active and rolls the streak.
       *
       * Called by every activity that counts as practice, so the streak is a
       * consequence of doing work rather than a separate thing to maintain.
       */
      function touchToday(patch: Partial<DailyActivity> = {}) {
        const today = todayISO();
        const state = get();

        const activity = [...state.activity];
        const index = activity.findIndex((a) => a.date === today);
        const entry = index >= 0 ? { ...activity[index] } : emptyActivity(today);

        entry.speakingMinutes += patch.speakingMinutes ?? 0;
        entry.conversationMinutes += patch.conversationMinutes ?? 0;
        entry.lessonsCompleted += patch.lessonsCompleted ?? 0;
        entry.wordsReviewed += patch.wordsReviewed ?? 0;
        entry.xp += patch.xp ?? 0;

        if (index >= 0) activity[index] = entry;
        else activity.push(entry);

        // Keep a rolling window; the progress chart shows 14 days.
        activity.sort((a, b) => a.date.localeCompare(b.date));
        const trimmed = activity.slice(-60);

        let { currentStreak, longestStreak } = state;
        if (state.lastActiveDate !== today) {
          const gap = state.lastActiveDate
            ? daysBetween(state.lastActiveDate, today)
            : Infinity;
          currentStreak = gap === 1 ? currentStreak + 1 : 1;
          longestStreak = Math.max(longestStreak, currentStreak);
        }

        set({
          activity: trimmed,
          currentStreak,
          longestStreak,
          lastActiveDate: today,
          xp: state.xp + (patch.xp ?? 0),
        });
      }

      return {
        ...initialState,

        setHasHydrated: (value) => set({ hasHydrated: value }),

        setLocale: (locale) => set({ locale }),

        signIn: (email, name) =>
          set((state) => ({
            isAuthenticated: true,
            profile: {
              ...state.profile,
              email,
              name: name?.trim() || state.profile.name,
            },
          })),

        signOut: () => set({ isAuthenticated: false }),

        updateProfile: (patch) =>
          set((state) => ({ profile: { ...state.profile, ...patch } })),

        startLesson: (lessonId) =>
          set((state) => {
            const existing = state.lessons[lessonId];
            if (existing?.status === "completed") return state;
            return {
              lessons: {
                ...state.lessons,
                [lessonId]: {
                  status: "in_progress",
                  progress: existing?.progress ?? 0,
                  completedAt: null,
                  bestScore: existing?.bestScore ?? 0,
                },
              },
            };
          }),

        setLessonProgress: (lessonId, progress) =>
          set((state) => {
            const existing = state.lessons[lessonId];
            if (existing?.status === "completed") return state;
            return {
              lessons: {
                ...state.lessons,
                [lessonId]: {
                  status: "in_progress",
                  progress: Math.max(existing?.progress ?? 0, progress),
                  completedAt: null,
                  bestScore: existing?.bestScore ?? 0,
                },
              },
            };
          }),

        completeLesson: (lessonId, score) => {
          const state = get();
          const already = state.lessons[lessonId]?.status === "completed";
          const earned = already ? 0 : XP.lessonComplete;

          const lesson = LESSONS.find((l) => l.id === lessonId);

          // Seed the lesson's vocabulary into the review queue on completion.
          const vocabulary = { ...state.vocabulary };
          for (const id of lesson?.vocabularyIds ?? []) {
            if (!vocabulary[id]) {
              vocabulary[id] = {
                vocabularyId: id,
                mastery: 0,
                reviewCount: 0,
                lastReviewedAt: null,
                nextReviewAt: todayISO(),
              };
            }
          }

          const lessonsCompleted =
            Object.values(state.lessons).filter((l) => l.status === "completed")
              .length + (already ? 0 : 1);

          set({
            vocabulary,
            lessons: {
              ...state.lessons,
              [lessonId]: {
                status: "completed",
                progress: 100,
                completedAt: new Date().toISOString(),
                bestScore: Math.max(state.lessons[lessonId]?.bestScore ?? 0, score),
              },
            },
            skills: {
              ...state.skills,
              speaking: nudge(state.skills.speaking, 2),
              grammar: nudge(state.skills.grammar, 1.5),
              vocabulary: nudge(state.skills.vocabulary, 1.5),
              workplace: nudge(
                state.skills.workplace,
                lesson && lesson.month >= 2 ? 3 : 0.5,
              ),
            },
            profile: {
              ...state.profile,
              englishLevel: levelFor(lessonsCompleted),
            },
          });

          touchToday({
            lessonsCompleted: already ? 0 : 1,
            speakingMinutes: lesson?.estimatedMinutes ?? 15,
            xp: earned,
          });

          return earned;
        },

        recordAnswer: (evaluation, awardXp = true) => {
          const state = get();

          // Fold each important mistake into the running list, bumping the
          // counter when the learner repeats one (§16).
          const mistakes = [...state.mistakes];
          for (const item of evaluation.importantMistakes) {
            const existing = mistakes.find(
              (m) =>
                m.category === item.type &&
                m.correctedText === evaluation.corrected,
            );
            if (existing) {
              existing.occurrences += 1;
              existing.resolved = false;
            } else {
              mistakes.unshift({
                id: `m-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
                originalText: evaluation.original,
                correctedText: evaluation.corrected,
                category: item.type as MistakeCategory,
                explanationTh: item.descriptionTh,
                createdAt: new Date().toISOString(),
                occurrences: 1,
                resolved: false,
              });
            }
          }

          set({
            mistakes: mistakes.slice(0, 50),
            skills: {
              ...state.skills,
              speaking: nudge(state.skills.speaking, evaluation.isCorrect ? 1.5 : 0.5),
              grammar: nudge(state.skills.grammar, evaluation.isCorrect ? 1.5 : -0.5),
            },
          });

          touchToday({ xp: awardXp ? XP.speakingPractice : 0 });
        },

        addSpeakingMinutes: (minutes) => touchToday({ speakingMinutes: minutes }),

        addConversationMinutes: (minutes) =>
          touchToday({ conversationMinutes: minutes }),

        completeConversation: (xpEarned) => {
          const state = get();
          set({
            skills: {
              ...state.skills,
              conversation: nudge(state.skills.conversation, 4),
              listening: nudge(state.skills.listening, 2),
            },
          });
          touchToday({ xp: xpEarned || XP.conversation });
        },

        resolveMistake: (id) => {
          set((state) => ({
            mistakes: state.mistakes.map((m) =>
              m.id === id ? { ...m, resolved: true } : m,
            ),
            skills: { ...state.skills, grammar: nudge(state.skills.grammar, 2) },
          }));
          touchToday({ xp: XP.mistakeFixed });
        },

        reviewWord: (vocabularyId, grade) => {
          const state = get();
          const existing = state.vocabulary[vocabularyId];
          const previousMastery = existing?.mastery ?? 0;

          const mastery =
            grade === "again"
              ? Math.max(0, previousMastery - 1)
              : Math.min(5, previousMastery + (grade === "easy" ? 2 : 1));

          const next = new Date();
          next.setDate(next.getDate() + REVIEW_INTERVALS_DAYS[mastery]);

          set({
            vocabulary: {
              ...state.vocabulary,
              [vocabularyId]: {
                vocabularyId,
                mastery,
                reviewCount: (existing?.reviewCount ?? 0) + 1,
                lastReviewedAt: todayISO(),
                nextReviewAt: todayISO(next),
              },
            },
            skills: {
              ...state.skills,
              vocabulary: nudge(state.skills.vocabulary, grade === "again" ? 0.5 : 1.5),
            },
          });

          touchToday({ wordsReviewed: 1, xp: XP.vocabularyReview });
        },

        dueVocabulary: () => {
          const today = todayISO();
          const { vocabulary } = get();
          return Object.values(vocabulary)
            .filter(
              (entry) =>
                entry.mastery < 5 &&
                (!entry.nextReviewAt || entry.nextReviewAt <= today),
            )
            .map((entry) => entry.vocabularyId);
        },

        reset: () =>
          set((state) => ({
            ...initialState,
            // Resetting progress should not also throw away the person's
            // language choice or sign them out.
            locale: state.locale,
            isAuthenticated: state.isAuthenticated,
            hasHydrated: true,
          })),
      };
    },
    {
      name: "speakdev.progress",
      storage: createJSONStorage(() => localStorage),
      version: 1,
      /*
       * Without this, `persist` reads localStorage while the module is being
       * imported — before React's first client render. A learner who had
       * chosen English would then get Thai server HTML against English client
       * HTML and a hydration mismatch across the page. Deferring means the
       * first client render always equals the server render, and `<StoreHydration>`
       * pulls the saved state in immediately after mount.
       */
      skipHydration: true,
          // Only data is persisted; actions and the hydration flag are not.
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        locale: state.locale,
        profile: state.profile,
        lessons: state.lessons,
        vocabulary: state.vocabulary,
        mistakes: state.mistakes,
        activity: state.activity,
        xp: state.xp,
        currentStreak: state.currentStreak,
        longestStreak: state.longestStreak,
        lastActiveDate: state.lastActiveDate,
        skills: state.skills,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);

/** Derived: the next lesson the learner should open (§5 "Today's Lesson"). */
export function selectNextLesson(state: AppState) {
  const firstUnfinished = LESSONS.find(
    (lesson) => state.lessons[lesson.id]?.status !== "completed",
  );
  return firstUnfinished ?? LESSONS[LESSONS.length - 1];
}

export function selectLessonsCompleted(state: AppState) {
  return Object.values(state.lessons).filter((l) => l.status === "completed")
    .length;
}

/**
 * Shared zero-value for a day with no activity yet.
 *
 * It must be one frozen instance: a zustand selector is re-run on every store
 * read, and returning a fresh object each time makes React's
 * `useSyncExternalStore` see an endless stream of "new" snapshots and loop.
 */
const NO_ACTIVITY: DailyActivity = Object.freeze({
  date: "",
  speakingMinutes: 0,
  conversationMinutes: 0,
  lessonsCompleted: 0,
  wordsReviewed: 0,
  xp: 0,
});

export function selectTodayActivity(state: AppState): DailyActivity {
  const today = todayISO();
  return state.activity.find((a) => a.date === today) ?? NO_ACTIVITY;
}

export function selectMasteredCount(state: AppState) {
  return Object.values(state.vocabulary).filter((v) => v.mastery >= 5).length;
}

/**
 * Words the learner has seen but not mastered — fed back into practice (§10).
 *
 * Takes the vocabulary map rather than the whole state, and is *not* a
 * zustand selector: it builds a new array, so callers must wrap it in
 * `useMemo` keyed on the map. `useWeakVocabulary` below does exactly that.
 */
export function weakVocabularyFrom(
  vocabulary: Record<string, UserVocabulary>,
): string[] {
  return Object.values(vocabulary)
    .filter((v) => v.mastery < 3)
    .map((v) => v.vocabularyId);
}

export function useWeakVocabulary(): string[] {
  const vocabulary = useAppStore((s) => s.vocabulary);
  return React.useMemo(() => weakVocabularyFrom(vocabulary), [vocabulary]);
}

export const TOTAL_VOCABULARY = VOCABULARY.length;
