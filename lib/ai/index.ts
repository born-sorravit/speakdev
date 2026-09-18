import { MockAIProvider } from "./mock-provider";
import type { AIService } from "./types";

/**
 * Single place the app resolves its tutor from.
 *
 * Today it returns the local rule engine. When the NestJS backend is ready,
 * add an `HttpAIProvider implements AIService` and switch on an env flag here;
 * no component imports a provider directly, so nothing else has to change.
 */
let instance: AIService | null = null;

export function getAIService(): AIService {
  if (!instance) instance = new MockAIProvider();
  return instance;
}

/** Test/Storybook seam for injecting a stub provider. */
export function setAIService(service: AIService) {
  instance = service;
}

export type * from "./types";
