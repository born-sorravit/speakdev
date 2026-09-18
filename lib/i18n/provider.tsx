"use client";

import * as React from "react";

import { dictionaries, type Dictionary } from "./dictionaries";
import { useAppStore } from "@/lib/store/use-app-store";
import type { Locale } from "@/lib/types";

interface I18nValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Dictionary;
  /** Picks the right half of a bilingual content string. */
  pick: (value: { en: string; th: string }) => string;
}

const I18nContext = React.createContext<I18nValue | null>(null);

/**
 * Serves the dictionary for the current locale.
 *
 * The locale itself is owned by the persisted store, so the choice survives a
 * reload and shares the one hydration boundary with everything else.
 */
export function I18nProvider({ children }: { children: React.ReactNode }) {
  const locale = useAppStore((s) => s.locale);
  const setLocale = useAppStore((s) => s.setLocale);

  // `lang` matters for screen readers and for Thai line breaking, and it is a
  // DOM attribute rather than React state — an effect is the right tool.
  React.useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const value = React.useMemo<I18nValue>(
    () => ({
      locale,
      setLocale,
      t: dictionaries[locale],
      pick: (v) => v[locale],
    }),
    [locale, setLocale],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = React.useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside <I18nProvider>");
  return ctx;
}

/** Shorthand for the common case of only needing the dictionary. */
export function useT() {
  return useI18n().t;
}

/** Fills `{name}` placeholders in a dictionary string. */
export function format(
  template: string,
  values: Record<string, string | number>,
) {
  return template.replace(/\{(\w+)\}/g, (match, key) =>
    key in values ? String(values[key]) : match,
  );
}
