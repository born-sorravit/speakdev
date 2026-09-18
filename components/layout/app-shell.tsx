"use client";

import {
  ChevronsUpDown,
  Flame,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Play,
  Sparkles,
  User,
} from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import * as React from "react";

import { Brand } from "@/components/brand";
import { LanguageToggle } from "@/components/language-toggle";
import { MobileMenu } from "@/components/layout/mobile-menu";
import {
  QuickJump,
  QuickJumpIconButton,
  QuickJumpTrigger,
} from "@/components/layout/quick-jump";
import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useI18n } from "@/lib/i18n/provider";
import { transition } from "@/lib/motion";
import { NAV_GROUPS, NAV_ITEMS } from "@/lib/nav";
import { useAppStore } from "@/lib/store/use-app-store";
import { cn } from "@/lib/utils";

/** Rail and full widths, in px — Motion animates between them. */
const SIDEBAR_WIDTH = { collapsed: 72, expanded: 256 } as const;

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** Two-letter monogram for the sidebar account row. */
function initialsOf(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean).slice(0, 2);
  const mark = parts
    .map((part) => Array.from(part)[0])
    .join("")
    .toUpperCase();
  return mark || "?";
}

/** Profile + sign-out, hung off whatever account control triggers it. */
function AccountMenu({
  children,
  side,
  onSignOut,
}: {
  children: React.ReactNode;
  side: "top" | "right";
  onSignOut: () => void;
}) {
  const { t } = useI18n();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent side={side} align="start" className="w-52">
        <DropdownMenuItem asChild>
          <Link href="/profile" className="text-th">
            <User aria-hidden="true" />
            {t.nav.profile}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          className="text-th"
          onSelect={onSignOut}
        >
          <LogOut aria-hidden="true" />
          {t.common.signOut}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function Sidebar() {
  const pathname = usePathname();
  const { t } = useI18n();
  const router = useRouter();

  // The store rehydrates a beat after mount; showing the default profile and a
  // zero streak in the meantime reads as real data that then changes under the
  // learner, so the personal bits wait behind a skeleton of the same size.
  const hydrated = useAppStore((s) => s.hasHydrated);
  const collapsed = useAppStore((s) => s.sidebarCollapsed);
  const toggleSidebar = useAppStore((s) => s.toggleSidebar);
  const xp = useAppStore((s) => s.xp);
  const streak = useAppStore((s) => s.currentStreak);
  const level = useAppStore((s) => s.profile.englishLevel);
  const name = useAppStore((s) => s.profile.name);
  const email = useAppStore((s) => s.profile.email);
  const signOut = useAppStore((s) => s.signOut);

  const handleSignOut = () => {
    signOut();
    router.push("/");
  };

  const toggleLabel = collapsed ? t.sidebar.expand : t.sidebar.collapse;
  const ToggleIcon = collapsed ? PanelLeftOpen : PanelLeftClose;

  return (
    /*
      `sticky h-dvh`, not a stretched flex item. As a plain column the aside
      took the height of the whole document, so on a long page the footer —
      and the sign-out button with it — sat far below the fold. Pinning the
      aside to the viewport and letting the nav scroll inside its own region
      keeps the footer grounded on every route, whatever the page height.

      Width is animated by Motion rather than a Tailwind transition, so the
      rail and the active pill (a `layoutId` element that re-measures on the
      same render) move on one shared timing token.
    */
    <motion.aside
      initial={false}
      animate={{
        width: collapsed ? SIDEBAR_WIDTH.collapsed : SIDEBAR_WIDTH.expanded,
      }}
      transition={transition}
      className="bg-sidebar border-sidebar-border sticky top-0 hidden h-dvh shrink-0 flex-col self-start overflow-hidden border-r lg:flex"
    >
      <div
        className={cn(
          "border-sidebar-border/60 flex h-[4.25rem] shrink-0 items-center border-b",
          collapsed ? "justify-center px-2" : "gap-2 pr-3 pl-6",
        )}
      >
        {!collapsed && <Brand href="/dashboard" className="min-w-0 flex-1" />}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label={toggleLabel}
              className="text-muted-foreground hover:text-foreground shrink-0"
              onClick={toggleSidebar}
            >
              <ToggleIcon className="size-4" aria-hidden="true" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">{toggleLabel}</TooltipContent>
        </Tooltip>
      </div>

      <div
        className={cn(
          "shrink-0 pt-3",
          collapsed ? "flex justify-center px-2" : "px-3",
        )}
      >
        <QuickJumpTrigger collapsed={collapsed} />
      </div>

      {/* The action a learner takes most days, kept above the nav. */}
      <div
        className={cn(
          "shrink-0 pt-2",
          collapsed ? "flex justify-center px-2" : "px-3",
        )}
      >
        {collapsed ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/learn"
                aria-label={t.sidebar.startToday}
                className="bg-primary/15 text-primary hover:bg-primary/25 focus-visible:ring-sidebar-ring grid size-9 place-items-center rounded-full transition-colors focus-visible:ring-2 focus-visible:outline-none"
              >
                <Play className="size-4" aria-hidden="true" />
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">{t.sidebar.startToday}</TooltipContent>
          </Tooltip>
        ) : (
          <Link
            href="/learn"
            className="text-sidebar-foreground hover:bg-sidebar-accent/40 focus-visible:ring-sidebar-ring flex items-center gap-2.5 rounded-lg px-1.5 py-1.5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
          >
            <span className="bg-primary/15 text-primary grid size-7 shrink-0 place-items-center rounded-full">
              <Play className="size-3.5" aria-hidden="true" />
            </span>
            <span className="text-th truncate">{t.sidebar.startToday}</span>
          </Link>
        )}
      </div>

      <nav
        className={cn(
          "min-h-0 flex-1 overflow-y-auto py-4",
          collapsed ? "px-2" : "px-3",
        )}
        aria-label="Main"
      >
        {NAV_GROUPS.map((group, groupIndex) => {
          const items = NAV_ITEMS.filter((item) => item.group === group);
          if (items.length === 0) return null;

          return (
            <div key={group} className="mb-5 last:mb-0">
              {collapsed
                ? groupIndex > 0 && (
                    <Separator className="bg-sidebar-border/70 mx-auto mb-3 w-8" />
                  )
                : (
                    <p className="text-muted-foreground text-th mb-1 px-3 text-[0.6875rem] font-semibold tracking-widest uppercase">
                      {t.navGroups[group]}
                    </p>
                  )}

              <ul className="space-y-1">
                {items.map((item) => {
                  const active = isActive(pathname, item.href);
                  const Icon = item.icon;
                  const label = t.nav[item.key];

                  const link = (
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      aria-label={collapsed ? label : undefined}
                      className={cn(
                        "focus-visible:ring-sidebar-ring relative flex items-center rounded-lg text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none",
                        collapsed ? "justify-center py-2.5" : "gap-3 px-3 py-2",
                        active
                          ? "text-sidebar-foreground font-semibold"
                          : "text-sidebar-foreground/70 hover:bg-sidebar-accent/40 hover:text-sidebar-foreground font-medium",
                      )}
                    >
                      {/*
                        The highlight is a single shared element that slides
                        between items. Its `layoutId` must differ from the
                        bottom nav's — both navs are always mounted, only
                        hidden by CSS, so a shared id would make Motion
                        animate between them.
                      */}
                      {active && (
                        <motion.span
                          layoutId="sidebar-active"
                          transition={transition}
                          className="bg-sidebar-accent absolute inset-0 rounded-lg"
                        />
                      )}
                      <Icon
                        className="relative size-[18px] shrink-0"
                        aria-hidden="true"
                      />
                      {!collapsed && (
                        <span className="text-th relative truncate">
                          {label}
                        </span>
                      )}
                    </Link>
                  );

                  return (
                    <li key={item.href}>
                      {collapsed ? (
                        <Tooltip>
                          <TooltipTrigger asChild>{link}</TooltipTrigger>
                          <TooltipContent side="right">{label}</TooltipContent>
                        </Tooltip>
                      ) : (
                        link
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </nav>

      <div
        className={cn(
          "border-sidebar-border/60 shrink-0 border-t",
          collapsed ? "flex flex-col items-center gap-2 p-2" : "space-y-2 p-3",
        )}
      >
        {collapsed ? (
          <AccountMenu side="right" onSignOut={handleSignOut}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={name}
                  className="rounded-full"
                >
                  <Avatar>
                    <AvatarFallback className="bg-primary/15 text-primary text-xs font-bold">
                      {hydrated ? initialsOf(name) : ""}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                {name} · {t.common.level} {level}
              </TooltipContent>
            </Tooltip>
          </AccountMenu>
        ) : (
          <>
            {/* `bg-sidebar-accent` keeps the panel on the sidebar's own palette. */}
            <div className="border-sidebar-border/70 bg-sidebar-accent rounded-xl border p-3.5">
              <div className="flex items-center justify-between text-sm font-semibold">
                <span className="flex items-center gap-1.5">
                  <Flame className="text-primary size-4" aria-hidden="true" />
                  {hydrated ? (
                    streak
                  ) : (
                    <Skeleton className="bg-sidebar-accent-foreground/15 h-4 w-5" />
                  )}
                </span>
                <span className="flex items-center gap-1.5">
                  <Sparkles
                    className="text-primary size-4"
                    aria-hidden="true"
                  />
                  {hydrated ? (
                    `${xp} XP`
                  ) : (
                    <Skeleton className="bg-sidebar-accent-foreground/15 h-4 w-14" />
                  )}
                </span>
              </div>
              <Separator className="bg-sidebar-accent-foreground/15 my-2.5" />
              {hydrated ? (
                <p className="text-sidebar-accent-foreground text-th text-xs font-medium">
                  {t.common.level} {level} · {t.levels[level]}
                </p>
              ) : (
                <Skeleton className="bg-sidebar-accent-foreground/15 h-4 w-28" />
              )}
            </div>

            {/*
              Sign-out lives behind the account row rather than as a button of
              its own: it is a rare, irreversible-feeling action, and a
              full-width control sitting under the nav read like a fifth menu
              item you could hit by accident.
            */}
            <AccountMenu side="top" onSignOut={handleSignOut}>
              <button
                type="button"
                className="hover:bg-sidebar-accent/40 focus-visible:ring-sidebar-ring data-open:bg-sidebar-accent/40 flex w-full items-center gap-2.5 rounded-lg px-1.5 py-1.5 text-left transition-colors focus-visible:ring-2 focus-visible:outline-none"
              >
                <Avatar>
                  <AvatarFallback className="bg-primary/15 text-primary text-xs font-bold">
                    {hydrated ? initialsOf(name) : ""}
                  </AvatarFallback>
                </Avatar>
                {hydrated ? (
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{name}</p>
                    <p className="text-muted-foreground truncate text-xs">
                      {email}
                    </p>
                  </div>
                ) : (
                  <div className="min-w-0 flex-1 space-y-1.5">
                    <Skeleton className="h-3.5 w-20" />
                    <Skeleton className="h-3 w-28" />
                  </div>
                )}
                <ChevronsUpDown
                  className="text-muted-foreground size-4 shrink-0"
                  aria-hidden="true"
                />
              </button>
            </AccountMenu>
          </>
        )}
      </div>
    </motion.aside>
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
  const hydrated = useAppStore((s) => s.hasHydrated);
  const streak = useAppStore((s) => s.currentStreak);
  const name = useAppStore((s) => s.profile.name);

  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/80 sticky top-0 z-30 flex items-center justify-between border-b px-4 py-3 backdrop-blur lg:hidden">
      <Brand href="/dashboard" />
      {/*
        Language and theme moved into the drawer: at 390px the header cannot
        hold them next to the menu button, and the drawer is also the only way
        to reach Progress and Profile, which do not fit the five-slot tab bar.
      */}
      <div className="flex items-center gap-1">
        <span className="text-muted-foreground mr-1 flex items-center gap-1 text-sm font-semibold">
          <Flame className="size-4" aria-hidden="true" />
          {hydrated ? streak : <Skeleton className="h-4 w-4" />}
        </span>
        <QuickJumpIconButton />
        <MobileMenu initials={hydrated ? initialsOf(name) : ""} />
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
    <QuickJump>
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
    </QuickJump>
  );
}
