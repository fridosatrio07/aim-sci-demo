import { LoginFooter } from "@/components/auth/login-footer";
import { LoginForm } from "@/components/auth/login-form";
import { LoginHero } from "@/components/auth/login-hero";

export function LoginPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-slate-100">
      <div className="grid min-h-[calc(100vh-72px)] grid-cols-1 lg:grid-cols-[1.04fr_0.96fr]">
        <LoginHero />
        <section className="flex min-w-0 items-center justify-center bg-gradient-to-br from-white via-slate-50 to-blue-50/50 px-4 py-6 sm:px-6 lg:px-8 lg:py-5 xl:py-8 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
          <LoginForm />
        </section>
      </div>
      <LoginFooter />
    </main>
  );
}
