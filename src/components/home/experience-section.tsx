import Image from "next/image";
import { Section } from "@/components/layout/section";
import { Reveal } from "@/components/motion/reveal";
import { unsplash } from "@/lib/data/mock/images";
import { cn } from "@/lib/utils";

const BLOCKS = [
  {
    id: "luxury",
    label: "Luxury",
    title: "Beauty in restraint",
    copy: "Every home is chosen for what it says quietly — considered materials, honest craftsmanship, nothing performative.",
    image: unsplash("1571003123894-1f0594d2b5d9", 1400),
  },
  {
    id: "privacy",
    label: "Privacy",
    title: "Entirely your own",
    copy: "No shared walls, no shared schedules. Just a home, a door that locks behind you, and time that belongs to you.",
    image: unsplash("1512917774080-9991f1c4c750", 1400),
  },
  {
    id: "design",
    label: "Design",
    title: "Spaces with intention",
    copy: "From riad courtyards to coastal villas, each residence is shaped by its place, not by a template.",
    image: unsplash("1600566753086-00f18fb6b3ea", 1400),
  },
  {
    id: "comfort",
    label: "Comfort",
    title: "Effortless, start to finish",
    copy: "Concierge, housekeeping and local knowledge are always a message away — so the only decision left is how to spend the day.",
    image: unsplash("1600607687920-4e2a09cf159d", 1400),
  },
];

export function ExperienceSection() {
  return (
    <Section variant="dark" label="Beyond the Booking" id="experience" spacing="none" className="py-20 md:py-28">
      <Reveal>
        <h2 className="mb-16 max-w-xl font-serif text-3xl text-foreground md:text-4xl">
          Not just a stay. An experience.
        </h2>
      </Reveal>

      <div className="flex flex-col gap-20 md:gap-28">
        {BLOCKS.map((block, i) => {
          const reversed = i % 2 === 1;
          return (
            <div
              key={block.id}
              className={cn(
                "grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-16",
                reversed && "md:[direction:rtl]"
              )}
            >
              <Reveal className="md:[direction:ltr]">
                <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                  <Image
                    src={block.image}
                    alt={block.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
              </Reveal>
              <Reveal delay={0.1} className="md:[direction:ltr]">
                <p className="label-eyebrow mb-3">{block.label}</p>
                <h3 className="mb-4 font-serif text-2xl text-foreground md:text-3xl">
                  {block.title}
                </h3>
                <p className="max-w-md text-muted-foreground">{block.copy}</p>
              </Reveal>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
