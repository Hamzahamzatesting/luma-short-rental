import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = { title: "Sign In | LUMA" };

export default function LoginPage() {
  return (
    <AuthShell title="Welcome back" subtitle="Sign in to manage your stays.">
      <Suspense>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}
