import type { Metadata } from "next";
import { Mail, Clock, Headset } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Section } from "@/components/layout/section";
import { Reveal } from "@/components/motion/reveal";
import { ContactForm } from "@/components/contact/contact-form";

export const metadata: Metadata = {
  title: "Contact | LUMA",
  description: "Get in touch with LUMA's concierge team for reservations, questions, or support.",
};

const CONTACT_POINTS = [
  { icon: Mail, label: "Email", value: "hello@luma.stays" },
  { icon: Clock, label: "Response time", value: "Within one business day" },
  { icon: Headset, label: "Concierge", value: "Available for guests during any active stay" },
];

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="pt-28">
        <Section spacing="tight">
          <p className="label-eyebrow mb-2">Get in touch</p>
          <h1 className="mb-10 font-serif text-3xl text-foreground md:text-4xl">Contact LUMA</h1>

          <Reveal className="grid grid-cols-1 gap-10 md:grid-cols-[1fr_1.3fr]">
            <div className="flex flex-col gap-6">
              <p className="text-sm text-muted-foreground">
                Questions about a stay, a property, or becoming a LUMA host — send us a note and our
                concierge team will get back to you directly.
              </p>
              <div className="flex flex-col gap-4">
                {CONTACT_POINTS.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-3">
                    <Icon size={18} className="mt-0.5 shrink-0 text-gold" strokeWidth={1.5} />
                    <div>
                      <p className="text-xs uppercase tracking-label text-muted-foreground">{label}</p>
                      <p className="text-sm text-foreground">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <ContactForm />
          </Reveal>
        </Section>
      </main>
      <Footer />
    </>
  );
}
