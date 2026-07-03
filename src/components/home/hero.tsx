"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArchwayMark } from "@/components/brand/archway-mark";
import { SearchWidget } from "./search-widget";
import { RevealGroup, revealItemVariants } from "@/components/motion/reveal";
import type { Destination } from "@/lib/data/types";

interface HeroProps {
  destinations: Destination[];
}

export function Hero({ destinations }: HeroProps) {
  return (
    <section className="relative flex min-h-[92vh] items-end overflow-hidden bg-midnight">
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1 }}
        animate={{ scale: 1.06 }}
        transition={{ duration: 22, ease: "linear" }}
      >
        <Image
          src="https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=2400&q=85"
          alt="A sun-drenched LUMA villa and pool"
          fill
          priority
          className="object-cover"
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-midnight/85 via-midnight/30 to-transparent" />
      {/* Independent top fade so the nav stays legible regardless of how bright the photo's upper edge is. */}
      <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-midnight/65 to-transparent" />

      <RevealGroup className="relative mx-auto w-full max-w-7xl px-6 pb-20 pt-40 md:px-10 md:pb-24">
        {/* The photo underneath this spot isn't reliably dark — a soft badge
            behind the mark and eyebrow keeps both legible regardless of what
            part of the image lands here, instead of relying on a shadow that
            only works against certain backgrounds. */}
        <motion.div variants={revealItemVariants} className="mb-6 flex justify-center md:justify-start">
          <div className="flex size-14 items-center justify-center rounded-full bg-midnight/45 backdrop-blur-sm">
            <ArchwayMark className="h-7 w-auto text-gold" />
          </div>
        </motion.div>

        <motion.div variants={revealItemVariants} className="mb-4 flex justify-center md:justify-start">
          <p className="inline-block rounded-full bg-midnight/45 px-4 py-1.5 text-center text-xs font-medium uppercase tracking-label text-gold backdrop-blur-sm">
            Curated Stays &middot; Extraordinary Moments
          </p>
        </motion.div>

        <motion.h1
          variants={revealItemVariants}
          className="text-center font-serif text-4xl leading-[1.1] text-ivory [text-shadow:0_2px_20px_rgba(11,15,20,0.65)] sm:text-5xl md:text-left md:text-6xl lg:text-7xl"
        >
          Extraordinary stays,
          <br />
          remarkable memories.
        </motion.h1>

        <motion.p
          variants={revealItemVariants}
          className="mx-auto mt-6 max-w-xl text-center text-base text-ivory/90 [text-shadow:0_1px_12px_rgba(11,15,20,0.7)] md:mx-0 md:text-left"
        >
          Curated luxury homes across Morocco&apos;s most exceptional destinations, each
          selected for design, privacy and effortless service.
        </motion.p>

        <motion.div variants={revealItemVariants} className="mt-10">
          <SearchWidget destinations={destinations} />
        </motion.div>
      </RevealGroup>
    </section>
  );
}
