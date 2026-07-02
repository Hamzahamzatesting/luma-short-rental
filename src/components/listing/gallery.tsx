"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Expand } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface GalleryProps {
  images: string[];
  title: string;
}

export function Gallery({ images, title }: GalleryProps) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  function show(i: number) {
    setIndex(i);
    setOpen(true);
  }

  function next() {
    setIndex((i) => (i + 1) % images.length);
  }
  function prev() {
    setIndex((i) => (i - 1 + images.length) % images.length);
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-2 overflow-hidden rounded-lg sm:grid-cols-4 sm:grid-rows-2">
        <button
          type="button"
          onClick={() => show(0)}
          className="group/img relative col-span-2 row-span-2 aspect-[4/3] overflow-hidden sm:aspect-auto"
        >
          <Image
            src={images[0]}
            alt={title}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover/img:scale-105"
          />
        </button>
        {images.slice(1, 5).map((img, i) => (
          <button
            key={img}
            type="button"
            onClick={() => show(i + 1)}
            className="group/img relative hidden aspect-square overflow-hidden sm:block"
          >
            <Image
              src={img}
              alt={`${title} ${i + 2}`}
              fill
              sizes="25vw"
              className="object-cover transition-transform duration-500 group-hover/img:scale-105"
            />
            {i === 3 && images.length > 5 && (
              <div className="absolute inset-0 flex items-center justify-center bg-midnight/50 text-sm font-medium text-ivory">
                +{images.length - 5} more
              </div>
            )}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={() => show(0)}
        className="mt-3 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-label text-muted-foreground hover:text-foreground"
      >
        <Expand size={13} />
        View all photos
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="max-w-5xl border-none bg-midnight p-0 text-ivory sm:max-w-2xl lg:max-w-5xl"
          showCloseButton
        >
          <DialogTitle className="sr-only">{title} photos</DialogTitle>
          <div className="relative flex aspect-[16/10] items-center justify-center overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="absolute inset-0"
              >
                <Image src={images[index]} alt={`${title} ${index + 1}`} fill className="object-contain" />
              </motion.div>
            </AnimatePresence>

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={prev}
                  aria-label="Previous photo"
                  className="absolute left-3 flex size-9 items-center justify-center rounded-full bg-midnight/70 text-ivory hover:bg-midnight"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  type="button"
                  onClick={next}
                  aria-label="Next photo"
                  className="absolute right-3 flex size-9 items-center justify-center rounded-full bg-midnight/70 text-ivory hover:bg-midnight"
                >
                  <ChevronRight size={18} />
                </button>
              </>
            )}

            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
              {images.map((img, i) => (
                <span
                  key={img}
                  className={cn(
                    "h-1.5 w-1.5 rounded-full transition-colors",
                    i === index ? "bg-gold" : "bg-ivory/30"
                  )}
                />
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
