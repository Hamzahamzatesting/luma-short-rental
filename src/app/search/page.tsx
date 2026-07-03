import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { SearchResults } from "@/components/search/search-results";
import { searchListings } from "@/lib/data/listings";
import { getDestinationBySlug } from "@/lib/data/destinations";
import type { SearchFilters, SortOption } from "@/lib/data/types";

interface SearchPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const params = await searchParams;
  const destinationSlug = first(params.destination);
  const destination = destinationSlug ? await getDestinationBySlug(destinationSlug) : null;

  const title = destination
    ? `Luxury Stays in ${destination.name}, ${destination.country} | LUMA`
    : "Search Luxury Stays in Morocco | LUMA";
  const description = destination
    ? (destination.blurb ?? `Curated luxury homes in ${destination.name} — handpicked for design, privacy and effortless service.`)
    : "Browse LUMA's curated collection of luxury homes across Morocco's most exceptional destinations.";

  return {
    title,
    description,
    alternates: { canonical: destinationSlug ? `/search?destination=${destinationSlug}` : "/search" },
    openGraph: { title, description, url: destinationSlug ? `/search?destination=${destinationSlug}` : "/search" },
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;

  const filters: SearchFilters = {
    destinationSlug: first(params.destination),
    guests: first(params.guests) ? Number(first(params.guests)) : undefined,
    minPrice: first(params.minPrice) ? Number(first(params.minPrice)) : undefined,
    maxPrice: first(params.maxPrice) ? Number(first(params.maxPrice)) : undefined,
    bedrooms: first(params.bedrooms) ? Number(first(params.bedrooms)) : undefined,
    bathrooms: first(params.bathrooms) ? Number(first(params.bathrooms)) : undefined,
    amenityIds: first(params.amenities)?.split(",").filter(Boolean),
    instantBookOnly: first(params.instantBookOnly) === "true",
    petFriendly: first(params.petFriendly) === "true",
    seaView: first(params.seaView) === "true",
    sort: (first(params.sort) as SortOption) ?? "newest",
  };

  const [listings, destination] = await Promise.all([
    searchListings(filters),
    filters.destinationSlug ? getDestinationBySlug(filters.destinationSlug) : null,
  ]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-32 pb-24">
        <div className="mx-auto w-full max-w-7xl px-6 md:px-10">
          <p className="label-eyebrow mb-3">Search</p>
          <h1 className="mb-10 font-serif text-3xl text-foreground md:text-4xl">
            {destination ? `Stays in ${destination.name}` : "All Residences"}
          </h1>

          <SearchResults listings={listings} />
        </div>
      </main>
      <Footer />
    </>
  );
}
