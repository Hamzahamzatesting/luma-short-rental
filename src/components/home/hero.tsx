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
    <section className="relative overflow-hidden bg-midnight">
      <div className="grid lg:min-h-[92vh] lg:grid-cols-2">
        {/* Photos */}
        <div className="relative order-1 lg:order-2 lg:grid lg:grid-rows-[1.4fr_1fr] lg:gap-px lg:bg-midnight">
          <div className="relative h-[46vh] overflow-hidden lg:h-auto">
            <motion.div
              className="absolute inset-0"
              initial={{ scale: 1 }}
              animate={{ scale: 1.06 }}
              transition={{ duration: 24, ease: "linear" }}
            >
              <Image
                src="https://images.unsplash.com/photo-1544984243-ec57ea16fe25?auto=format&fit=crop&w=1600&q=85"
                alt="A LUMA villa pool at desert sunset"
                fill
                priority
                className="object-cover"
              />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-midnight/40 via-transparent to-transparent lg:hidden" />
          </div>
          <div className="relative hidden overflow-hidden lg:block">
            <Image
              src="https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=1200&q=80"
              alt="A warm, arch-framed LUMA interior"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Content */}
        <div className="relative order-2 flex flex-col justify-center px-6 py-14 sm:px-10 lg:order-1 lg:px-16 lg:py-24 xl:px-20">
          <RevealGroup>
            <motion.div variants={revealItemVariants} className="mb-6">
              <ArchwayMark className="h-10 w-auto text-gold" />
            </motion.div>

            <motion.p
              variants={revealItemVariants}
              className="mb-4 text-xs font-medium uppercase tracking-label text-gold"
            >
              Curated Stays &middot; Extraordinary Moments
            </motion.p>

            <motion.h1
              variants={revealItemVariants}
              className="font-serif text-4xl leading-[1.1] text-ivory sm:text-5xl lg:text-6xl xl:text-7xl"
            >
              Extraordinary stays,
              <br />
              remarkable memories.
            </motion.h1>

            <motion.p variants={revealItemVariants} className="mt-6 max-w-xl text-base text-ivory/75">
              Curated luxury homes across Morocco&apos;s most exceptional destinations, each
              selected for design, privacy and effortless service.
            </motion.p>

            <motion.div variants={revealItemVariants} className="mt-10">
              <SearchWidget destinations={destinations} />
            </motion.div>
          </RevealGroup>
        </div>
      </div>
    </section>
  );
}
