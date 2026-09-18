"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useT } from "@/lib/i18n/provider";
import { useIsClient } from "@/lib/use-is-client";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const t = useT();

  // The resolved theme is unknown on the server, so show the light icon until
  // the client can tell us, rather than guessing and flipping after paint.
  const mounted = useIsClient();
  const isDark = resolvedTheme === "dark";

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn("size-9", className)}
          onClick={() => setTheme(isDark ? "light" : "dark")}
          aria-label={t.common.theme}
        >
          {mounted && isDark ? (
            <Moon className="size-4" aria-hidden="true" />
          ) : (
            <Sun className="size-4" aria-hidden="true" />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        {mounted && isDark ? t.common.light : t.common.dark}
      </TooltipContent>
    </Tooltip>
  );
}
