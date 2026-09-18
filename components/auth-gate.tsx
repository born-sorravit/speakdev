"use client";

import { useRouter } from "next/navigation";
import * as React from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { useAppStore } from "@/lib/store/use-app-store";

/**
 * Keeps the signed-in routes behind the login screen.
 *
 * The check waits for `hasHydrated`: `isAuthenticated` lives in localStorage,
 * so acting before rehydration would bounce a signed-in learner out on every
 * reload. Auth is local-only for now — when a real session arrives this is the
 * one place that changes.
 */
export function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const hasHydrated = useAppStore((s) => s.hasHydrated);
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);

  React.useEffect(() => {
    if (hasHydrated && !isAuthenticated) router.replace("/login");
  }, [hasHydrated, isAuthenticated, router]);

  if (!hasHydrated || !isAuthenticated) {
    // Shaped like a real page — heading, hero card, tiles — and inside the
    // shell's `<main>`, so the padding and width come from the same place the
    // content will use and nothing jumps when it arrives.
    return (
      <div className="mx-auto max-w-4xl space-y-6" aria-busy="true">
        <div className="space-y-2.5">
          <Skeleton className="h-7 w-56 max-w-full" />
          <Skeleton className="h-4 w-72 max-w-full" />
        </div>
        <Skeleton className="h-44 w-full rounded-2xl" />
        <div className="grid grid-cols-3 gap-3">
          <Skeleton className="h-28 rounded-xl" />
          <Skeleton className="h-28 rounded-xl" />
          <Skeleton className="h-28 rounded-xl" />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Skeleton className="h-24 rounded-xl" />
          <Skeleton className="h-24 rounded-xl" />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
