import { AuthGate } from "@/components/auth-gate";
import { AppShell } from "@/components/layout/app-shell";

/**
 * Shell for every signed-in route. The route group keeps the URLs flat
 * (`/dashboard`, not `/app/dashboard`) while sharing one chrome, and
 * `AuthGate` makes the login step real rather than decorative.
 *
 * The gate sits *inside* the shell: the store rehydrates a beat after mount,
 * and gating the whole shell meant a phone showed bare skeleton blocks on an
 * empty background — no header, no tab bar — and then the entire app appeared
 * at once. Now the chrome paints immediately and only the page body waits.
 */
export default function AppLayout({ children }: LayoutProps<"/">) {
  return (
    <AppShell>
      <AuthGate>{children}</AuthGate>
    </AppShell>
  );
}
