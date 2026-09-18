"use client";

import { ArrowRight, Info } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";

import { Brand } from "@/components/brand";
import { LanguageToggle } from "@/components/language-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useI18n } from "@/lib/i18n/provider";
import { useAppStore } from "@/lib/store/use-app-store";

/**
 * Login and register share a layout and a submit path.
 *
 * Auth is local-only for the MVP: the brief asks for the architecture to be
 * ready for email/password and Google (§24), which is why the store owns an
 * `isAuthenticated` flag and a profile rather than the form doing it inline.
 */
export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const { t } = useI18n();
  const router = useRouter();
  const signIn = useAppStore((s) => s.signIn);

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [name, setName] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  const isRegister = mode === "register";

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    signIn(email || "you@example.com", isRegister ? name : undefined);
    router.push("/dashboard");
  }

  return (
    <div className="flex min-h-dvh flex-1 flex-col">
      <header className="flex items-center justify-between px-4 py-4 sm:px-6">
        <Brand />
        <div className="flex items-center gap-1">
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="mb-7 text-center">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {isRegister ? t.auth.registerTitle : t.auth.loginTitle}
            </h1>
            <p className="text-muted-foreground text-th mt-2 text-sm">
              {isRegister ? t.auth.registerSub : t.auth.loginSub}
            </p>
          </div>

          <Card className="rounded-2xl">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {isRegister && (
                  <div className="space-y-2">
                    <Label htmlFor="name">{t.common.name}</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Nut"
                      autoComplete="name"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">{t.common.email}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">{t.common.password}</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete={
                      isRegister ? "new-password" : "current-password"
                    }
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full gap-2"
                  size="lg"
                  disabled={submitting}
                >
                  {isRegister ? t.common.createAccount : t.common.signIn}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Button>
              </form>

              <div className="my-5 flex items-center gap-3">
                <Separator className="flex-1" />
                <span className="text-muted-foreground text-xs font-medium">
                  {t.common.or}
                </span>
                <Separator className="flex-1" />
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full gap-2"
                size="lg"
                onClick={() => {
                  signIn("you@example.com");
                  router.push("/dashboard");
                }}
              >
                <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
                  <path
                    fill="#4285F4"
                    d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5a5.6 5.6 0 0 1-2.4 3.7v3h3.9c2.3-2.1 3.5-5.2 3.5-8.9Z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.9-3c-1.1.7-2.5 1.2-4 1.2-3.1 0-5.7-2.1-6.6-4.9H1.4v3.1A12 12 0 0 0 12 24Z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.4 14.4a7.2 7.2 0 0 1 0-4.6V6.7H1.4a12 12 0 0 0 0 10.8l4-3.1Z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4A12 12 0 0 0 1.4 6.7l4 3.1C6.3 6.9 8.9 4.8 12 4.8Z"
                  />
                </svg>
                {t.auth.continueGoogle}
              </Button>

              <p className="text-muted-foreground mt-6 text-center text-sm">
                {isRegister ? t.auth.hasAccount : t.auth.noAccount}{" "}
                <Link
                  href={isRegister ? "/login" : "/register"}
                  className="text-primary font-semibold hover:underline"
                >
                  {isRegister ? t.common.signIn : t.common.signUp}
                </Link>
              </p>
            </CardContent>
          </Card>

          <p className="text-muted-foreground text-th mt-5 flex items-start gap-2 text-xs">
            <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
            {t.auth.demoNote}
          </p>
        </div>
      </main>
    </div>
  );
}
