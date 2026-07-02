import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/home/hero";
import { FeaturedProperties } from "@/components/home/featured-properties";
import { WhyChooseLuma } from "@/components/home/why-choose-luma";
import { Destinations } from "@/components/home/destinations";
import { ExperienceSection } from "@/components/home/experience-section";
import { Testimonials } from "@/components/home/testimonials";
import { Faq } from "@/components/home/faq";
import { getFeaturedListings } from "@/lib/data/listings";
import { getDestinations } from "@/lib/data/destinations";
import { getTestimonials } from "@/lib/data/testimonials";
import { getFaqs } from "@/lib/data/faqs";

export default async function HomePage() {
  const [featuredListings, destinations, testimonials, faqs] = await Promise.all([
    getFeaturedListings(6),
    getDestinations(),
    getTestimonials(),
    getFaqs(),
  ]);

  return (
    <>
      <Navbar transparentAtTop />
      <main>
        <Hero destinations={destinations} />
        <FeaturedProperties listings={featuredListings} />
        <WhyChooseLuma />
        <Destinations destinations={destinations} />
        <ExperienceSection />
        <Testimonials testimonials={testimonials} />
        <Faq faqs={faqs} />
      </main>
      <Footer />
    </>
  );
}
