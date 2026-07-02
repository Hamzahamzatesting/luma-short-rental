import Image from "next/image";
import { Reveal } from "@/components/motion/reveal";

interface StorySectionProps {
  image: string;
  title: string;
  heading: string;
  quote: string;
}

export function StorySection({ image, title, heading, quote }: StorySectionProps) {
  return (
    <section className="relative flex h-[70vh] min-h-[420px] w-full items-center justify-center overflow-hidden">
      <Image
        src={image}
        alt={title}
        fill
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-midnight/70 via-midnight/50 to-midnight/80" />
      <Reveal className="relative mx-auto max-w-2xl px-6 text-center">
        <p className="label-eyebrow mb-4 text-gold">{heading}</p>
        <p className="font-serif text-2xl italic leading-relaxed text-ivory md:text-3xl">
          &ldquo;{quote}&rdquo;
        </p>
      </Reveal>
    </section>
  );
}
