import Link from "next/link";
import { Globe, Send, Mail } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { NewsletterForm } from "./newsletter-form";
import { FOOTER_LINKS, SITE_NAME, TAGLINE } from "@/lib/constants";

const LINK_COLUMNS: { title: string; links: readonly { label: string; href: string }[] }[] = [
  { title: "Explore", links: FOOTER_LINKS.explore },
  { title: "Company", links: FOOTER_LINKS.company },
  { title: "Support", links: FOOTER_LINKS.support },
];

export function Footer() {
  return (
    <footer className="border-t border-ivory/10 bg-midnight text-ivory">
      <div className="mx-auto w-full max-w-7xl px-6 py-16 md:px-10 md:py-20">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr_1.2fr]">
          <div className="flex flex-col gap-4">
            <Logo variant="primary" height={30} className="!p-0" />
            <p className="max-w-xs text-sm text-ivory/60">{TAGLINE}</p>
            <div className="mt-2 flex items-center gap-3">
              <Link href="#" aria-label="Instagram" className="text-ivory/60 hover:text-gold">
                <Globe size={18} />
              </Link>
              <Link href="#" aria-label="Facebook" className="text-ivory/60 hover:text-gold">
                <Send size={18} />
              </Link>
              <Link href="mailto:hello@luma.stays" aria-label="Email" className="text-ivory/60 hover:text-gold">
                <Mail size={18} />
              </Link>
            </div>
          </div>

          {LINK_COLUMNS.map((col) => (
            <div key={col.title} className="flex flex-col gap-3">
              <p className="text-xs font-medium uppercase tracking-label text-gold">{col.title}</p>
              {col.links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-ivory/70 transition-colors hover:text-ivory"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          ))}

          <div className="flex flex-col gap-3">
            <p className="text-xs font-medium uppercase tracking-label text-gold">Stay in touch</p>
            <p className="text-sm text-ivory/60">
              Occasional notes on new residences and destinations.
            </p>
            <NewsletterForm />
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-ivory/10 pt-8 text-xs text-ivory/50 md:flex-row md:items-center">
          <p>
            © {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-ivory/80">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-ivory/80">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
