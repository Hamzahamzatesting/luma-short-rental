"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { NAV_LINKS } from "@/lib/constants";
import { useScrollPosition } from "@/hooks/use-scroll-position";
import { cn } from "@/lib/utils";

interface NavbarProps {
  /** Transparent-over-hero on Home; solid everywhere else. */
  transparentAtTop?: boolean;
}

export function Navbar({ transparentAtTop = false }: NavbarProps) {
  const scrolled = useScrollPosition(40);
  const [open, setOpen] = useState(false);
  const isTransparent = transparentAtTop && !scrolled;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        isTransparent ? "bg-transparent" : "bg-midnight/90 backdrop-blur-md border-b border-ivory/10"
      )}
    >
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-6 md:px-10">
        <Link href="/" aria-label="LUMA home">
          <Logo variant="primary" height={30} />
        </Link>

        <nav className="hidden items-center gap-10 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs font-medium uppercase tracking-label text-ivory/85 transition-colors hover:text-gold"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <Button
            render={<Link href="/search">Explore Stays</Link>}
            nativeButton={false}
            variant="default"
            size="lg"
          />
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            aria-label="Open menu"
            className="flex size-10 items-center justify-center text-ivory md:hidden"
          >
            <Menu size={22} />
          </SheetTrigger>
          <SheetContent side="right" className="bg-midnight text-ivory border-ivory/10">
            <SheetHeader>
              <SheetTitle className="text-ivory">
                <Logo variant="primary" height={26} />
              </SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-6 px-6 py-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="text-sm font-medium uppercase tracking-label text-ivory/85 hover:text-gold"
                >
                  {link.label}
                </Link>
              ))}
              <Button
                render={
                  <Link href="/search" onClick={() => setOpen(false)}>
                    Explore Stays
                  </Link>
                }
                nativeButton={false}
                size="lg"
                className="mt-2"
              />
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
