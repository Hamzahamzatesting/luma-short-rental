"use client";

import { motion, type Variants } from "framer-motion";

interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  y?: number;
}

const EASE = [0.22, 1, 0.36, 1] as const;

/** Subtle, consistent scroll-triggered fade-up used across the site. */
export function Reveal({ children, delay = 0, className, y = 14 }: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

interface RevealGroupProps {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
}

const groupVariants: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12 },
  },
};

export const revealItemVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

/** Wrap a list of children to stagger their entrance (e.g. hero headline stack). */
export function RevealGroup({ children, className }: RevealGroupProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      variants={groupVariants}
    >
      {children}
    </motion.div>
  );
}
