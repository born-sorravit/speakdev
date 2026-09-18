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

export interface NavItem {
  href: string;
  key: keyof Dictionary["nav"];
  icon: typeof LayoutDashboard;
  /** Shown in the mobile bottom bar (§4 — five slots is the comfortable max). */
  primary: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", key: "dashboard", icon: LayoutDashboard, primary: true },
  { href: "/learn", key: "learn", icon: BookOpen, primary: true },
  { href: "/practice", key: "practice", icon: Mic, primary: true },
  { href: "/conversation", key: "conversation", icon: MessageCircle, primary: true },
  { href: "/progress", key: "progress", icon: TrendingUp, primary: false },
  { href: "/vocabulary", key: "vocabulary", icon: Wallet, primary: true },
  { href: "/profile", key: "profile", icon: User, primary: false },
];
