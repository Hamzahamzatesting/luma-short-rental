import { Section } from "@/components/layout/section";
import { Reveal } from "@/components/motion/reveal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { FaqItem } from "@/lib/data/types";

interface FaqProps {
  faqs: FaqItem[];
}

export function Faq({ faqs }: FaqProps) {
  return (
    <Section variant="dark" label="Good to Know" id="faq">
      <Reveal>
        <h2 className="max-w-xl font-serif text-3xl text-foreground md:text-4xl">
          Frequently Asked Questions
        </h2>
      </Reveal>

      <Reveal delay={0.1} className="mt-10 max-w-3xl">
        <Accordion>
          {faqs.map((faq) => (
            <AccordionItem key={faq.id} value={faq.id}>
              <AccordionTrigger className="font-serif text-base">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Reveal>
    </Section>
  );
}
