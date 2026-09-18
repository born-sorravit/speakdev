import { AuthGate } from "@/components/auth-gate";
import { AppShell } from "@/components/layout/app-shell";

/**
 * Shell for every signed-in route. The route group keeps the URLs flat
 * (`/dashboard`, not `/app/dashboard`) while sharing one chrome, and
 * `AuthGate` makes the login step real rather than decorative.
 */
export default function AppLayout({ children }: LayoutProps<"/">) {
  return (
    <AuthGate>
      <AppShell>{children}</AppShell>
    </AuthGate>
  );
}
