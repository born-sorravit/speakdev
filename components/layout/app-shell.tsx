"use client";

import { Flame, LogOut, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import * as React from "react";

import { Brand } from "@/components/brand";
import { LanguageToggle } from "@/components/language-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useI18n } from "@/lib/i18n/provider";
import { transition } from "@/lib/motion";
import { NAV_ITEMS } from "@/lib/nav";
import { useAppStore } from "@/lib/store/use-app-store";
import { cn } from "@/lib/utils";

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function Sidebar() {
  const pathname = usePathname();
  const { t } = useI18n();
  const router = useRouter();

  const xp = useAppStore((s) => s.xp);
  const streak = useAppStore((s) => s.currentStreak);
  const level = useAppStore((s) => s.profile.englishLevel);
  const signOut = useAppStore((s) => s.signOut);

  return (
    <aside className="bg-sidebar border-sidebar-border hidden w-64 shrink-0 flex-col border-r lg:flex">
      <div className="px-6 py-6">
        <Brand href="/dashboard" />
      </div>

      <nav className="flex-1 px-3" aria-label="Main">
        <ul className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const active = isActive(pathname, item.href);
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "focus-visible:ring-ring relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none",
                    active
                      ? "text-sidebar-accent-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  {/*
                    The highlight is a single shared element that slides
                    between items. Its `layoutId` must differ from the bottom
                    nav's — both navs are always mounted, only hidden by CSS,
                    so a shared id would make Motion animate between them.
                  */}
                  {active && (
                    <motion.span
                      layoutId="sidebar-active"
                      transition={transition}
                      className="bg-sidebar-accent absolute inset-0 rounded-xl"
                    />
                  )}
                  <Icon
                    className="relative size-[18px] shrink-0"
                    aria-hidden="true"
                  />
                  <span className="relative">{t.nav[item.key]}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="space-y-3 p-4">
        <div className="bg-accent text-accent-foreground rounded-xl p-3.5">
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
          <p className="text-xs font-medium">
            {t.common.level} {level} · {t.levels[level]}
          </p>
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground w-full justify-start gap-2"
          onClick={() => {
            signOut();
            router.push("/");
          }}
        >
          <LogOut className="size-4" aria-hidden="true" />
          {t.common.signOut}
        </Button>
      </div>
    </aside>
  );
}

function BottomNav() {
  const pathname = usePathname();
  const { t } = useI18n();
  const items = NAV_ITEMS.filter((item) => item.primary);

  return (
    <nav
      aria-label="Main"
      className="bg-card/95 supports-[backdrop-filter]:bg-card/80 fixed inset-x-0 bottom-0 z-40 border-t pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
    >
      <ul className="grid grid-cols-5">
        {items.map((item) => {
          const active = isActive(pathname, item.href);
          const Icon = item.icon;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative flex flex-col items-center gap-1 px-1 py-2.5 text-[0.625rem] font-medium transition-colors",
                  active ? "text-primary" : "text-muted-foreground",
                )}
              >
                {active && (
                  <motion.span
                    layoutId="bottomnav-active"
                    transition={transition}
                    className="bg-primary absolute inset-x-4 top-0 h-0.5 rounded-full"
                  />
                )}
                <motion.span
                  animate={{ scale: active ? 1.08 : 1 }}
                  transition={transition}
                >
                  <Icon className="size-[19px]" aria-hidden="true" />
                </motion.span>
                <span className="max-w-full truncate">{t.nav[item.key]}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function MobileHeader() {
  const streak = useAppStore((s) => s.currentStreak);

  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/80 sticky top-0 z-30 flex items-center justify-between border-b px-4 py-3 backdrop-blur lg:hidden">
      <Brand href="/dashboard" />
      <div className="flex items-center gap-1">
        <span className="text-muted-foreground mr-1 flex items-center gap-1 text-sm font-semibold">
          <Flame className="size-4" aria-hidden="true" />
          {streak}
        </span>
        <LanguageToggle />
        <ThemeToggle />
      </div>
    </header>
  );
}

/** Desktop-only top bar; mobile gets `MobileHeader` instead. */
function DesktopHeader() {
  return (
    <header className="hidden items-center justify-end gap-1 px-8 pt-6 lg:flex">
      <LanguageToggle />
      <ThemeToggle />
    </header>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-1">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <MobileHeader />
        <DesktopHeader />
        {/* Bottom padding clears the mobile tab bar. */}
        <main className="flex-1 px-4 pt-5 pb-24 sm:px-6 lg:px-8 lg:pt-4 lg:pb-10">
          {children}
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
