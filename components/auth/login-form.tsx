"use client";

import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { Eye, EyeOff, Lock, Mail, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { clearSession, consumeSessionExpiredMessage, getSession, login } from "@/lib/auth";
import { navigateToAppRoute } from "@/lib/static-navigation";

export function LoginForm() {
  const router = useRouter();
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [infoMessage, setInfoMessage] = useState("");

  useEffect(() => {
    const session = getSession();

    if (session?.authenticated && !session.expired) {
      navigateToAppRoute(router, "/dashboard", "replace");
      return;
    }

    const hasExpiredMessage = consumeSessionExpiredMessage();

    if (
      session?.expired ||
      new URLSearchParams(window.location.search).get("session") === "expired" ||
      hasExpiredMessage
    ) {
      clearSession();
      setInfoMessage("Your session has expired. Please sign in again.");
    }
  }, [router]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setInfoMessage("");

    const result = login({ username: emailOrUsername, password, rememberMe });

    if (!result.success) {
      setError(result.error ?? "Invalid email/username or password.");
      return;
    }

    navigateToAppRoute(router, "/dashboard", "replace");
  }

  function handleSsoClick() {
    setError("");
    setInfoMessage("SSO is not available in this prototype.");
  }

  return (
    <div className="w-full max-w-[440px] rounded-lg border border-slate-200 bg-white p-5 shadow-[0_22px_60px_rgba(15,23,42,0.12)] sm:p-6 xl:max-w-[460px] xl:p-7 dark:border-slate-800 dark:bg-slate-900 dark:shadow-[0_22px_60px_rgba(0,0,0,0.28)]">
      <div>
        <p className="text-xs font-semibold uppercase text-blue-700 dark:text-blue-300">Secure Login</p>
        <h2 className="mt-2 text-2xl font-bold tracking-normal text-slate-950 sm:text-3xl dark:text-slate-100">Welcome Back</h2>
        <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">Sign in to access your asset integrity dashboard</p>
      </div>

      <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300" htmlFor="emailOrUsername">
            Email / Username
          </label>
          <div className="relative mt-2">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" aria-hidden="true" />
            <Input
              id="emailOrUsername"
              autoComplete="username"
              className="h-11 pl-10"
              placeholder="Enter your email or username"
              value={emailOrUsername}
              onChange={(event) => {
                setEmailOrUsername(event.target.value);
                setError("");
              }}
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300" htmlFor="password">
            Password
          </label>
          <div className="relative mt-2">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" aria-hidden="true" />
            <Input
              id="password"
              autoComplete="current-password"
              className="h-11 pl-10 pr-11"
              placeholder="Enter your password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setError("");
              }}
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
              onClick={() => setShowPassword((current) => !current)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3">
          <label className="flex min-w-0 items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(event) => setRememberMe(event.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-blue-700 focus:ring-blue-600"
            />
            <span>Remember me</span>
          </label>
          <button type="button" className="shrink-0 text-sm font-semibold text-blue-700 hover:underline dark:text-blue-300">
            Forgot password?
          </button>
        </div>

        {error ? (
          <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-200" role="alert">
            {error}
          </div>
        ) : null}

        {infoMessage ? (
          <div className="rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-200" role="status">
            {infoMessage}
          </div>
        ) : null}

        <Button type="submit" className="h-11 w-full bg-blue-700 text-sm font-semibold hover:bg-blue-800">
          Sign In
        </Button>

        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
          <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">OR</span>
          <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
        </div>

        <Button type="button" variant="outline" className="h-11 w-full text-sm font-semibold" onClick={handleSsoClick}>
          Sign in with Single Sign-On (SSO)
        </Button>
      </form>

      <div className="mt-5 rounded-lg border border-blue-100 bg-blue-50 p-4 dark:border-blue-900/50 dark:bg-blue-950/30">
        <div className="flex gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-blue-700 text-white">
            <ShieldCheck className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-bold text-blue-950 dark:text-blue-100">Secure Access</p>
            <p className="mt-1 text-xs leading-5 text-blue-800 dark:text-blue-200">
              Secure access for authorized asset owner and SUCOFINDO personnel only.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
