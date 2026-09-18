"use client";

import { Flame, LogOut, Sparkles } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import * as React from "react";

import { LanguageSegmented } from "@/components/language-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useI18n } from "@/lib/i18n/provider";
import { NAV_GROUPS, NAV_ITEMS } from "@/lib/nav";
import { useAppStore } from "@/lib/store/use-app-store";
import { cn } from "@/lib/utils";

/**
 * Everything the desktop sidebar holds, reachable from the mobile header.
 *
 * The bottom bar only has room for the five primary routes (§4), which left
 * Progress and Profile with no way in on a phone. This drawer carries the full
 * grouped nav, the account, and the language/theme controls that used to sit
 * in the header — the header is too narrow at 390px to hold them as well.
 */
export function MobileMenu({ initials }: { initials: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useI18n();

  const [open, setOpen] = React.useState(false);

  const xp = useAppStore((s) => s.xp);
  const streak = useAppStore((s) => s.currentStreak);
  const level = useAppStore((s) => s.profile.englishLevel);
  const name = useAppStore((s) => s.profile.name);
  const email = useAppStore((s) => s.profile.email);
  const signOut = useAppStore((s) => s.signOut);

  const close = () => setOpen(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={t.nav.profile}
          className="rounded-full"
        >
          <Avatar size="sm">
            <AvatarFallback className="bg-primary/15 text-primary text-[0.625rem] font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-[19rem] gap-0 overflow-y-auto">
        <SheetTitle className="sr-only">{t.brand}</SheetTitle>
        <SheetDescription className="sr-only">{t.tagline}</SheetDescription>

        <Link
          href="/profile"
          onClick={close}
          className="hover:bg-muted flex items-center gap-3 px-4 pt-4 pr-12 pb-3 transition-colors"
        >
          <Avatar>
            <AvatarFallback className="bg-primary/15 text-primary text-xs font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{name}</p>
            <p className="text-muted-foreground truncate text-xs">{email}</p>
          </div>
        </Link>

        <div className="px-4">
          <div className="border-border/70 bg-accent text-accent-foreground rounded-xl border p-3.5">
            <div className="flex items-center justify-between text-sm font-semibold">
              <span className="flex items-center gap-1.5">
                <Flame className="size-4" aria-hidden="true" />
                {streak}
              </span>
              <span className="flex items-center gap-1.5">
                <Sparkles className="size-4" aria-hidden="true" />
                {xp} XP
              </span>
            </div>
            <Separator className="bg-accent-foreground/15 my-2.5" />
            <p className="text-th text-xs font-medium">
              {t.common.level} {level} · {t.levels[level]}
            </p>
          </div>
        </div>

        <nav className="px-2 py-3" aria-label={t.brand}>
          {NAV_GROUPS.map((group) => {
            const items = NAV_ITEMS.filter((item) => item.group === group);
            if (items.length === 0) return null;

            return (
              <div key={group} className="mb-3 last:mb-0">
                <p className="text-muted-foreground text-th mb-1 px-3 text-[0.6875rem] font-semibold tracking-widest uppercase">
                  {t.navGroups[group]}
                </p>
                <ul className="space-y-0.5">
                  {items.map((item) => {
                    const active =
                      pathname === item.href ||
                      pathname.startsWith(`${item.href}/`);
                    const Icon = item.icon;
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={close}
                          aria-current={active ? "page" : undefined}
                          className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                            active
                              ? "bg-accent text-accent-foreground font-semibold"
                              : "text-foreground/80 hover:bg-muted font-medium",
                          )}
                        >
                          <Icon
                            className="size-[18px] shrink-0"
                            aria-hidden="true"
                          />
                          <span className="text-th">{t.nav[item.key]}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>

                {/*
                  Sign-out closes the account group instead of sitting alone at
                  the bottom of the sheet: it belongs with Profile, and a
                  full-width button under everything read like another tab.
                */}
                {group === "account" && (
                  <button
                    type="button"
                    onClick={() => {
                      close();
                      signOut();
                      router.push("/");
                    }}
                    className="text-destructive hover:bg-destructive/10 mt-0.5 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors"
                  >
                    <LogOut className="size-[18px] shrink-0" aria-hidden="true" />
                    <span className="text-th">{t.common.signOut}</span>
                  </button>
                )}
              </div>
            );
          })}
        </nav>

        <Separator />

        <div className="space-y-3 px-4 py-4">
          <div className="flex items-center justify-between gap-3">
            <span className="text-muted-foreground text-th text-xs font-semibold tracking-widest uppercase">
              {t.common.language}
            </span>
            <LanguageSegmented />
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-muted-foreground text-th text-xs font-semibold tracking-widest uppercase">
              {t.common.theme}
            </span>
            <ThemeToggle />
          </div>
        </div>

      </SheetContent>
    </Sheet>
  );
}
