import {
  BookOpen,
  LayoutDashboard,
  MessageCircle,
  Mic,
  TrendingUp,
  User,
  Wallet,
} from "lucide-react";

import type { Dictionary } from "@/lib/i18n/dictionaries";

/** Section a nav item belongs to in the desktop sidebar. */
export type NavGroup = keyof Dictionary["navGroups"];

/** Render order of the sidebar sections. */
export const NAV_GROUPS: NavGroup[] = ["overview", "learning", "account"];

export interface NavItem {
  href: string;
  key: keyof Dictionary["nav"];
  icon: typeof LayoutDashboard;
  /** Shown in the mobile bottom bar (§4 — five slots is the comfortable max). */
  primary: boolean;
  group: NavGroup;
}

export const NAV_ITEMS: NavItem[] = [
  {
    href: "/dashboard",
    key: "dashboard",
    icon: LayoutDashboard,
    primary: true,
    group: "overview",
  },
  {
    href: "/progress",
    key: "progress",
    icon: TrendingUp,
    primary: false,
    group: "overview",
  },
  {
    href: "/learn",
    key: "learn",
    icon: BookOpen,
    primary: true,
    group: "learning",
  },
  {
    href: "/practice",
    key: "practice",
    icon: Mic,
    primary: true,
    group: "learning",
  },
  {
    href: "/conversation",
    key: "conversation",
    icon: MessageCircle,
    primary: true,
    group: "learning",
  },
  {
    href: "/vocabulary",
    key: "vocabulary",
    icon: Wallet,
    primary: true,
    group: "learning",
  },
  {
    href: "/profile",
    key: "profile",
    icon: User,
    primary: false,
    group: "account",
  },
];
