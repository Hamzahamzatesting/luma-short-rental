import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Section } from "@/components/layout/section";
import { Reveal } from "@/components/motion/reveal";
import { createClient } from "@/lib/supabase/server";
import { DeleteAccountDialog } from "@/components/account/delete-account-dialog";

export const metadata: Metadata = { title: "Account | LUMA" };

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?redirect=/account");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .maybeSingle();

  return (
    <>
      <Navbar />
      <main className="pt-28">
        <Section spacing="tight">
          <p className="label-eyebrow mb-2">Your Account</p>
          <h1 className="mb-10 font-serif text-3xl text-foreground md:text-4xl">Account</h1>

          <Reveal className="mx-auto flex max-w-xl flex-col gap-8">
            <div className="rounded-lg border border-border bg-card p-6">
              <p className="mb-1 text-xs uppercase tracking-label text-muted-foreground">Name</p>
              <p className="mb-4 text-foreground">{profile?.full_name ?? "—"}</p>
              <p className="mb-1 text-xs uppercase tracking-label text-muted-foreground">Email</p>
              <p className="text-foreground">{user.email}</p>
            </div>

            <div className="rounded-lg border border-destructive/30 bg-card p-6">
              <h2 className="mb-1 font-serif text-lg text-foreground">Danger Zone</h2>
              <p className="mb-4 text-sm text-muted-foreground">
                Deleting your account removes your profile and booking history for good.
              </p>
              <DeleteAccountDialog />
            </div>
          </Reveal>
        </Section>
      </main>
      <Footer />
    </>
  );
}
