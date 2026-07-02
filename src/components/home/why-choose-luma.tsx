import { Section } from "@/components/layout/section";
import { Reveal } from "@/components/motion/reveal";
import { WHY_LUMA } from "@/lib/constants";
import { getIcon } from "@/lib/icon-map";

export function WhyChooseLuma() {
  return (
    <Section variant="light" label="The LUMA Standard">
      <Reveal>
        <h2 className="max-w-xl font-serif text-3xl text-foreground md:text-4xl">
          Why Choose LUMA
        </h2>
      </Reveal>

      <div className="mt-12 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5">
        {WHY_LUMA.map((item, i) => {
          const Icon = getIcon(item.icon);
          return (
            <Reveal key={item.id} delay={Math.min(i * 0.08, 0.32)}>
              <div className="flex flex-col items-start gap-3">
                <div className="flex size-11 items-center justify-center rounded-full border border-gold/50 text-gold">
                  <Icon size={18} strokeWidth={1.5} />
                </div>
                <h3 className="font-serif text-lg text-foreground">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
