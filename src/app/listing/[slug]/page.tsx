import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Gallery } from "@/components/listing/gallery";
import { BookingCard } from "@/components/listing/booking-card";
import { AmenitiesList } from "@/components/listing/amenities-list";
import { HouseRules } from "@/components/listing/house-rules";
import { HostCard } from "@/components/listing/host-card";
import { ReviewsSection } from "@/components/listing/reviews-section";
import { NearbyAttractions } from "@/components/listing/nearby-attractions";
import { LuxuryCalendar } from "@/components/listing/luxury-calendar";
import { SimilarProperties } from "@/components/listing/similar-properties";
import { SectionDivider } from "@/components/listing/section-divider";
import { PropertyHighlights } from "@/components/listing/property-highlights";
import { WhyGuestsLove } from "@/components/listing/why-guests-love";
import { StorySection } from "@/components/listing/story-section";
import { Reveal } from "@/components/motion/reveal";
import { Separator } from "@/components/ui/separator";
import { Users, BedDouble, Bath, Ruler } from "lucide-react";
import {
  getAllListingSlugs,
  getBookedDateRangesForListing,
  getListingBySlug,
  getSimilarListings,
} from "@/lib/data/listings";
import { getHostById } from "@/lib/data/hosts";
import { getReviewsForListing } from "@/lib/data/reviews";
import { getPropertyHighlights, getWhyGuestsLoveThis, getStoryContent } from "@/lib/listing-editorial";

interface ListingPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllListingSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ListingPageProps): Promise<Metadata> {
  const { slug } = await params;
  const listing = await getListingBySlug(slug);
  if (!listing) return {};
  return {
    title: `${listing.title} — ${listing.city} | LUMA`,
    description: listing.shortDescription,
  };
}

export default async function ListingPage({ params }: ListingPageProps) {
  const { slug } = await params;
  const listing = await getListingBySlug(slug);
  if (!listing) notFound();

  const [host, reviews, similarListings, bookedRanges] = await Promise.all([
    getHostById(listing.hostId),
    getReviewsForListing(listing.id),
    getSimilarListings(listing.id),
    getBookedDateRangesForListing(listing.id),
  ]);

  const highlights = getPropertyHighlights(listing);
  const whyGuestsLove = getWhyGuestsLoveThis(listing, host);
  const story = getStoryContent(listing);
  const storyImage = listing.images[1] ?? listing.images[0];

  return (
    <>
      <Navbar />
      <main className="pb-24 pt-28">
        <div className="mx-auto w-full max-w-7xl px-6 md:px-10">
          <Reveal>
            <p className="label-eyebrow mb-2">{listing.city}, {listing.country}</p>
            <h1 className="mb-6 font-serif text-3xl text-foreground md:text-4xl">
              {listing.title}
            </h1>
          </Reveal>

          <Reveal delay={0.05}>
            <Gallery images={listing.images} title={listing.title} />
          </Reveal>

          <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-[1fr_380px]">
            <div className="flex flex-col gap-12">
              <Reveal>
                <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-2">
                    <Users size={16} className="text-gold" /> {listing.maxGuests} guests
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <BedDouble size={16} className="text-gold" /> {listing.bedrooms} bedrooms
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <Bath size={16} className="text-gold" /> {listing.bathrooms} bathrooms
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <Ruler size={16} className="text-gold" /> {listing.squareMeters} m²
                  </span>
                </div>
                <Separator className="mt-6" />
              </Reveal>

              <div className="flex flex-col gap-8">
                <Reveal>
                  <p className="font-serif text-xl leading-relaxed text-foreground/90 first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:text-6xl first-letter:leading-[0.8] first-letter:text-gold md:text-[1.35rem]">
                    {listing.description}
                  </p>
                </Reveal>

                <Reveal delay={0.05}>
                  <PropertyHighlights highlights={highlights} />
                </Reveal>
              </div>

              <SectionDivider />

              <Reveal>
                <p className="label-eyebrow mb-5">The Details</p>
                <h2 className="mb-6 font-serif text-2xl text-foreground">Amenities</h2>
                <AmenitiesList amenityIds={listing.amenityIds} />
              </Reveal>

              <WhyGuestsLove title={listing.title} bullets={whyGuestsLove} />

              <SectionDivider />

              <Reveal>
                <h2 className="mb-6 font-serif text-2xl text-foreground">Availability</h2>
                <LuxuryCalendar bookedRanges={bookedRanges} />
              </Reveal>

              <SectionDivider />

              <Reveal>
                <h2 className="mb-6 font-serif text-2xl text-foreground">House Rules</h2>
                <HouseRules
                  rules={listing.houseRules}
                  checkInTime={listing.checkInTime}
                  checkOutTime={listing.checkOutTime}
                />
              </Reveal>

              {host && (
                <Reveal>
                  <HostCard host={host} />
                </Reveal>
              )}

              <SectionDivider />

              <Reveal>
                <h2 className="mb-6 font-serif text-2xl text-foreground">Reviews</h2>
                <ReviewsSection
                  reviews={reviews}
                  rating={listing.rating}
                  reviewCount={listing.reviewCount}
                />
              </Reveal>

              <SectionDivider />

              <Reveal>
                <h2 className="mb-6 font-serif text-2xl text-foreground">Nearby</h2>
                <NearbyAttractions attractions={listing.nearbyAttractions} />
              </Reveal>
            </div>

            <div className="lg:sticky lg:top-28 lg:h-fit">
              <BookingCard listing={listing} />
            </div>
          </div>
        </div>

        <div className="mt-24">
          <StorySection
            image={storyImage}
            title={listing.title}
            heading={story.heading}
            quote={story.quote}
          />
        </div>

        <div className="mt-4">
          <SimilarProperties listings={similarListings} />
        </div>
      </main>
      <Footer />
    </>
  );
}
