import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Section } from "@/components/layout/section";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { PropertyCard } from "@/components/shared/property-card";
import { createClient } from "@/lib/supabase/server";
import { getFavoriteListings } from "@/lib/data/favorites";

export const metadata: Metadata = { title: "Saved Stays | LUMA" };
export const dynamic = "force-dynamic";

export default async function FavoritesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?redirect=/favorites");

  const listings = await getFavoriteListings();

  return (
    <>
      <Navbar />
      <main className="pt-28">
        <Section spacing="tight">
          <p className="label-eyebrow mb-2">Your Account</p>
          <h1 className="mb-10 font-serif text-3xl text-foreground md:text-4xl">Saved Stays</h1>

          {listings.length === 0 ? (
            <Reveal className="rounded-lg border border-border bg-card p-10 text-center">
              <p className="mb-4 text-muted-foreground">You haven&apos;t saved any stays yet.</p>
              <Button render={<Link href="/search">Explore Stays</Link>} nativeButton={false} />
            </Reveal>
          ) : (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {listings.map((listing, i) => (
                <Reveal key={listing.id} delay={Math.min(i * 0.06, 0.3)}>
                  <PropertyCard listing={listing} />
                </Reveal>
              ))}
            </div>
          )}
        </Section>
      </main>
      <Footer />
    </>
  );
}
