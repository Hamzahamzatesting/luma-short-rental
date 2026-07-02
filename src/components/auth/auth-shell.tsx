import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { Section } from "@/components/layout/section";
import { Reveal } from "@/components/motion/reveal";

interface AuthShellProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export function AuthShell({ title, subtitle, children }: AuthShellProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-midnight px-6 py-16">
      <Section spacing="none" className="w-full max-w-md" containerClassName="px-0">
        <Reveal>
          <div className="mb-8 flex flex-col items-center gap-4 text-center">
            <Link href="/">
              <Logo variant="primary" height={32} />
            </Link>
            <div>
              <h1 className="font-serif text-2xl text-foreground">{title}</h1>
              {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
            </div>
          </div>
          <div className="rounded-lg border border-border bg-card p-8">{children}</div>
        </Reveal>
      </Section>
    </main>
  );
}
