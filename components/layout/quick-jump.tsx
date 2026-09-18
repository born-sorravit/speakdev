"use client";

import { MessageCircle, Search, Wallet } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { LESSONS } from "@/lib/data/lessons";
import { SCENARIOS } from "@/lib/data/scenarios";
import { VOCABULARY } from "@/lib/data/vocabulary";
import { useI18n } from "@/lib/i18n/provider";
import { NAV_ITEMS } from "@/lib/nav";
import { useIsClient } from "@/lib/use-is-client";
import { cn } from "@/lib/utils";

/**
 * Quick-jump palette (⌘K / Ctrl-K).
 *
 * One provider owns the dialog and the key listener so the sidebar field and
 * the mobile header button open the same palette — two independent copies
 * would each answer the shortcut and stack two dialogs.
 */
const QuickJumpContext = React.createContext<(() => void) | null>(null);

export function useQuickJump() {
  const open = React.useContext(QuickJumpContext);
  if (!open) throw new Error("useQuickJump must be used inside <QuickJump>");
  return open;
}

export function QuickJump({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { t, pick } = useI18n();

  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((value) => !value);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const openPalette = React.useCallback(() => setOpen(true), []);

  const go = (href: string) => {
    setOpen(false);
    setQuery("");
    router.push(href);
  };

  // Content lists are long; they only earn their place once someone types.
  const searching = query.trim().length > 0;

  return (
    <QuickJumpContext.Provider value={openPalette}>
      {children}

      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title={t.search.open}
        description={t.search.placeholder}
      >
        <Command>
          <CommandInput
            placeholder={t.search.placeholder}
            value={query}
            onValueChange={setQuery}
          />
          <CommandList className="max-h-80">
            <CommandEmpty className="text-th">{t.search.empty}</CommandEmpty>

            <CommandGroup heading={t.search.pages}>
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <CommandItem
                    key={item.href}
                    value={`${item.href} ${t.nav[item.key]}`}
                    onSelect={() => go(item.href)}
                  >
                    <Icon className="size-4 shrink-0" aria-hidden="true" />
                    <span className="text-th">{t.nav[item.key]}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>

            {searching && (
              <>
                <CommandGroup heading={t.search.lessons}>
                  {LESSONS.map((lesson) => (
                    <CommandItem
                      key={lesson.id}
                      value={`${lesson.id} ${lesson.day} ${lesson.title.en} ${lesson.title.th}`}
                      onSelect={() => go(`/learn/${lesson.id}`)}
                    >
                      <span className="text-muted-foreground w-10 shrink-0 text-xs font-semibold tabular-nums">
                        {t.common.day} {lesson.day}
                      </span>
                      <span className="text-th truncate">
                        {pick(lesson.title)}
                      </span>
                    </CommandItem>
                  ))}
                </CommandGroup>

                <CommandGroup heading={t.search.vocabulary}>
                  {VOCABULARY.map((word) => (
                    <CommandItem
                      key={word.id}
                      value={`${word.id} ${word.word} ${word.meaning} ${word.meaningTh}`}
                      onSelect={() =>
                        go(`/vocabulary?q=${encodeURIComponent(word.word)}`)
                      }
                    >
                      <Wallet className="size-4 shrink-0" aria-hidden="true" />
                      <span className="font-medium">{word.word}</span>
                      <span className="text-muted-foreground text-th truncate text-xs">
                        {word.meaningTh}
                      </span>
                    </CommandItem>
                  ))}
                </CommandGroup>

                <CommandGroup heading={t.search.scenarios}>
                  {SCENARIOS.map((scenario) => (
                    <CommandItem
                      key={scenario.id}
                      value={`${scenario.id} ${scenario.title.en} ${scenario.title.th}`}
                      onSelect={() => go(`/conversation?scenario=${scenario.id}`)}
                    >
                      <MessageCircle
                        className="size-4 shrink-0"
                        aria-hidden="true"
                      />
                      <span className="text-th truncate">
                        {pick(scenario.title)}
                      </span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </CommandDialog>
    </QuickJumpContext.Provider>
  );
}

/** The search field at the top of the sidebar, or an icon on the rail. */
export function QuickJumpTrigger({
  collapsed = false,
  className,
}: {
  collapsed?: boolean;
  className?: string;
}) {
  const { t } = useI18n();
  const openPalette = useQuickJump();

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            aria-label={t.search.open}
            className={cn("text-muted-foreground", className)}
            onClick={openPalette}
          >
            <Search className="size-4" aria-hidden="true" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">{t.search.open}</TooltipContent>
      </Tooltip>
    );
  }

  return (
    <button
      type="button"
      onClick={openPalette}
      className={cn(
        "border-sidebar-border bg-sidebar-accent/40 text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground focus-visible:ring-sidebar-ring flex h-9 w-full items-center gap-2 rounded-lg border px-2.5 text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none",
        className,
      )}
    >
      <Search className="size-4 shrink-0" aria-hidden="true" />
      <span className="text-th flex-1 truncate text-left">{t.search.open}</span>
      <ShortcutHint />
    </button>
  );
}

/** Icon-only trigger for the mobile header. */
export function QuickJumpIconButton({ className }: { className?: string }) {
  const { t } = useI18n();
  const openPalette = useQuickJump();

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={t.search.open}
      className={className}
      onClick={openPalette}
    >
      <Search className="size-4" aria-hidden="true" />
    </Button>
  );
}

/**
 * Rendered only in the browser: the modifier key depends on the platform, and
 * `useIsClient` is how this repo reads browser-only values without a
 * server/client mismatch.
 */
function ShortcutHint() {
  const isClient = useIsClient();
  if (!isClient) return null;

  const isApple = /Mac|iPhone|iPad|iPod/.test(navigator.userAgent);
  return (
    <kbd className="bg-background/70 text-muted-foreground hidden rounded border px-1.5 py-0.5 font-mono text-[0.625rem] font-medium xl:inline-block">
      {isApple ? "⌘" : "Ctrl "}K
    </kbd>
  );
}
