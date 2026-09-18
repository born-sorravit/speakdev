"use client";

import * as React from "react";

import { useIsClient } from "@/lib/use-is-client";

/**
 * Text-to-speech through the browser's built-in engine.
 *
 * Deliberately separate from the AI provider (§27): swapping the tutor model
 * must not touch audio, and swapping to a cloud TTS voice later means
 * replacing this hook alone.
 */
export function useSpeech() {
  const [speaking, setSpeaking] = React.useState(false);
  const isClient = useIsClient();
  const supported = isClient && "speechSynthesis" in window;

  // Stop any in-flight utterance when the component using this unmounts.
  React.useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speak = React.useCallback(
    (text: string, { rate = 0.85 }: { rate?: number } = {}) => {
      if (!("speechSynthesis" in window)) return;

      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      // The brief asks the coach to speak slowly (§10); 0.85 is clear without
      // sounding robotic.
      utterance.rate = rate;

      const voice = window.speechSynthesis
        .getVoices()
        .find((v) => v.lang.startsWith("en-"));
      if (voice) utterance.voice = voice;

      utterance.onend = () => setSpeaking(false);
      utterance.onerror = () => setSpeaking(false);

      setSpeaking(true);
      window.speechSynthesis.speak(utterance);
    },
    [],
  );

  const stop = React.useCallback(() => {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    setSpeaking(false);
  }, []);

  return { speak, stop, speaking, supported };
}
