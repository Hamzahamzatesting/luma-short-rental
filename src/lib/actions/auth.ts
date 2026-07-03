"use server";

import { z } from "zod";
import type { AuthError } from "@supabase/supabase-js";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { checkRateLimit, rateLimitMessage } from "@/lib/rate-limit";

export type FormState = { error?: string; message?: string } | undefined;

// supabase-js stringifies the raw Response for 5xx/network errors, yielding "{}" as error.message — fall back to a friendly message instead.
function authErrorMessage(error: AuthError): string {
  if (!error.status || error.status >= 500) {
    return "Something went wrong on our end. Please try again in a moment.";
  }
  return error.message;
}

const emailSchema = z.email("Please enter a valid email.");
const passwordSchema = z.string().min(8, "Password must be at least 8 characters.");

const signUpSchema = z.object({
  fullName: z.string().trim().min(2, "Please enter your full name."),
  email: emailSchema,
  password: passwordSchema,
});

const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Please enter your password."),
});

async function siteOrigin() {
  const h = await headers();
  return h.get("origin") ?? process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

export async function signUpWithPassword(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const parsed = signUpSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check your details." };
  }

  const limit = await checkRateLimit(parsed.data.email, "signup", { max: 5, windowMinutes: 60 });
  if (!limit.allowed) return { error: rateLimitMessage("sign-up", limit) };

  const supabase = await createClient();
  const origin = await siteOrigin();
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { full_name: parsed.data.fullName },
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) return { error: authErrorMessage(error) };
  return { message: "Check your email to confirm your account before signing in." };
}

export async function signInWithPassword(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const parsed = signInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check your details." };
  }

  const limit = await checkRateLimit(parsed.data.email, "login", { max: 5, windowMinutes: 15 });
  if (!limit.allowed) return { error: rateLimitMessage("login", limit) };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) return { error: authErrorMessage(error) };

  const redirectTo = formData.get("redirect");
  redirect(typeof redirectTo === "string" && redirectTo ? redirectTo : "/");
}

export async function requestPasswordReset(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const parsed = emailSchema.safeParse(formData.get("email"));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please enter a valid email." };
  }

  const limit = await checkRateLimit(parsed.data, "password-reset", { max: 3, windowMinutes: 60 });
  if (!limit.allowed) return { error: rateLimitMessage("password-reset", limit) };

  const supabase = await createClient();
  const origin = await siteOrigin();
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data, {
    redirectTo: `${origin}/auth/callback?next=/reset-password`,
  });
  if (error) return { error: authErrorMessage(error) };
  return { message: "Check your email for a password reset link." };
}

export async function updatePassword(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const parsed = passwordSchema.safeParse(formData.get("password"));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please choose a stronger password." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password: parsed.data });
  if (error) return { error: authErrorMessage(error) };
  redirect("/login");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
