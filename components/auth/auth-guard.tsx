"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { clearSession, getSession, hasSessionExpiredMessage, markSessionExpired } from "@/lib/auth";
import { navigateToAppRoute } from "@/lib/static-navigation";

interface AuthGuardProps {
  children: ReactNode;
}

const AUTH_CHECK_FALLBACK_MS = 1500;

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    let active = true;
    let fallbackTimeoutId: number | undefined;
    let expiryTimeoutId: number | undefined;

    function clearFallbackTimeout() {
      if (fallbackTimeoutId) {
        window.clearTimeout(fallbackTimeoutId);
        fallbackTimeoutId = undefined;
      }
    }

    function redirectToLogin(expired = false) {
      clearFallbackTimeout();

      if (expired) {
        markSessionExpired();
        clearSession({ preserveExpiredMessage: true });
        navigateToAppRoute(router, "/login?session=expired", "replace");
        return;
      }

      clearSession();
      navigateToAppRoute(router, "/login", "replace");
    }

    function resolveAuthCheck() {
      try {
        const session = getSession();

        if (session?.authenticated && !session.expired) {
          if (!active) return;

          setAuthorized(true);
          setChecking(false);
          clearFallbackTimeout();

          if (!session.rememberMe && session.expiresAt) {
            const remainingTime = session.expiresAt - Date.now();

            if (remainingTime <= 0) {
              setAuthorized(false);
              redirectToLogin(true);
              return;
            }

            expiryTimeoutId = window.setTimeout(() => {
              if (!active) return;
              setAuthorized(false);
              redirectToLogin(true);
            }, remainingTime);
          }

          return;
        }

        if (!active) return;

        setAuthorized(false);
        setChecking(false);
        clearFallbackTimeout();
        redirectToLogin(Boolean(session?.expired) || hasSessionExpiredMessage());
      } catch {
        if (!active) return;

        setAuthorized(false);
        setChecking(false);
        clearFallbackTimeout();
        redirectToLogin(false);
      }
    }

    fallbackTimeoutId = window.setTimeout(() => {
      if (!active) return;

      const session = getSession();
      if (session?.authenticated && !session.expired) {
        setAuthorized(true);
        setChecking(false);
        return;
      }

      setAuthorized(false);
      setChecking(false);
      redirectToLogin(Boolean(session?.expired) || hasSessionExpiredMessage());
    }, AUTH_CHECK_FALLBACK_MS);

    resolveAuthCheck();

    return () => {
      active = false;
      clearFallbackTimeout();
      if (expiryTimeoutId) {
        window.clearTimeout(expiryTimeoutId);
      }
    };
  }, [pathname, router]);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">
        <div className="rounded-lg border border-slate-200 bg-white px-5 py-4 text-sm font-medium text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300" role="status">
          Checking secure access...
        </div>
      </div>
    );
  }

  if (!authorized) return null;

  return <>{children}</>;
}
