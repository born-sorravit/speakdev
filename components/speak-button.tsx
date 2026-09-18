"use client";

import { Volume2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useT } from "@/lib/i18n/provider";
import { useSpeech } from "@/lib/speech";
import { cn } from "@/lib/utils";

export function SpeakButton({
  text,
  className,
  size = "icon",
}: {
  text: string;
  className?: string;
  size?: "icon" | "sm";
}) {
  const { speak, speaking, supported } = useSpeech();
  const t = useT();

  if (!supported) return null;

  return (
    <Button
      type="button"
      variant="ghost"
      size={size}
      onClick={() => speak(text)}
      aria-label={`${t.common.listen}: ${text}`}
      className={cn(
        "text-muted-foreground hover:text-primary shrink-0",
        size === "icon" && "size-9",
        speaking && "text-primary",
        className,
      )}
    >
      <Volume2
        className={cn("size-4", speaking && "animate-pulse")}
        aria-hidden="true"
      />
      {size === "sm" && <span className="ml-1.5">{t.common.listen}</span>}
    </Button>
  );
}
