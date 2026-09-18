"use client";

import { MotionConfig } from "motion/react";
import { ThemeProvider } from "next-themes";
import * as React from "react";

import { StoreHydration } from "@/components/store-hydration";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { I18nProvider } from "@/lib/i18n/provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <I18nProvider>
        {/*
          `reducedMotion="user"` honours the OS setting for every Motion
          animation in the tree without any component branching on it — which
          also keeps the server and client rendering identical markup.
        */}
        <MotionConfig reducedMotion="user">
          <TooltipProvider delayDuration={200}>
            <StoreHydration />
            {children}
            <Toaster position="top-center" />
          </TooltipProvider>
        </MotionConfig>
      </I18nProvider>
    </ThemeProvider>
  );
}
