"use client";

import * as React from "react";

import { useAppStore } from "@/lib/store/use-app-store";

/**
 * Pulls persisted state in after mount.
 *
 * The store sets `skipHydration`, so the first client render matches the
 * server render exactly. This runs immediately afterwards and flips
 * `hasHydrated`, which every progress-derived view waits on.
 */
export function StoreHydration() {
  React.useEffect(() => {
    void useAppStore.persist.rehydrate();
  }, []);

  return null;
}
