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
    return (
      <div className="mx-auto max-w-5xl space-y-4 p-4" aria-busy="true">
        <Skeleton className="h-9 w-56" />
        <Skeleton className="h-40 w-full rounded-2xl" />
        <div className="grid grid-cols-3 gap-3">
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
