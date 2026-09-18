"use client";

import * as React from "react";

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

/**
 * True once React has taken over on the client.
 *
 * Several values in this app only exist in the browser — the resolved theme,
 * whether speech synthesis is available, the current hour. Reading them during
 * the server render would produce markup the client disagrees with.
 * `useSyncExternalStore` is the supported way to express "server says false,
 * client says true" without a setState-in-effect cascade.
 */
export function useIsClient() {
  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
