"use client";

import { Languages } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useI18n } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils";

/**
 * EN ⇄ TH switch for the interface.
 *
 * Lesson content stays bilingual regardless — this only changes the chrome.
 */
export function LanguageToggle({ className }: { className?: string }) {
  const { locale, setLocale, t } = useI18n();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setLocale(locale === "en" ? "th" : "en")}
          className={cn("gap-1.5 font-semibold", className)}
          aria-label={t.common.language}
        >
          <Languages className="size-4" aria-hidden="true" />
          <span className="text-xs tracking-wide uppercase">{locale}</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        {locale === "en" ? "เปลี่ยนเป็นภาษาไทย" : "Switch to English"}
      </TooltipContent>
    </Tooltip>
  );
}

/** Segmented EN | TH control for the profile page. */
export function LanguageSegmented() {
  const { locale, setLocale } = useI18n();

  return (
    <div className="bg-muted inline-flex rounded-lg p-1">
      {(["en", "th"] as const).map((value) => (
        <button
          key={value}
          type="button"
          onClick={() => setLocale(value)}
          aria-pressed={locale === value}
          className={cn(
            "focus-visible:ring-ring rounded-md px-4 py-1.5 text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:outline-none",
            locale === value
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {value === "en" ? "English" : "ไทย"}
        </button>
      ))}
    </div>
  );
}
