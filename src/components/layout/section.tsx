import { cn } from "@/lib/utils";

export type SectionVariant = "dark" | "light" | "navy";

interface SectionProps extends React.ComponentProps<"section"> {
  variant?: SectionVariant;
  label?: string;
  spacing?: "default" | "tight" | "none";
  containerClassName?: string;
}

const VARIANT_CLASS: Record<SectionVariant, string> = {
  dark: "",
  light: "theme-light",
  navy: "theme-navy",
};

const SPACING_CLASS: Record<NonNullable<SectionProps["spacing"]>, string> = {
  default: "py-20 md:py-32",
  tight: "py-12 md:py-20",
  none: "",
};

/**
 * Backbone layout primitive: every marketing section composes this so spacing
 * and dark/light theme-scoping stay consistent across the site.
 */
export function Section({
  variant = "dark",
  label,
  spacing = "default",
  className,
  containerClassName,
  children,
  ...props
}: SectionProps) {
  return (
    <section
      className={cn(
        "relative bg-background text-foreground",
        VARIANT_CLASS[variant],
        SPACING_CLASS[spacing],
        className
      )}
      {...props}
    >
      <div className={cn("relative mx-auto w-full max-w-7xl px-6 md:px-10", containerClassName)}>
        {label && <p className="label-eyebrow mb-4">{label}</p>}
        {children}
      </div>
    </section>
  );
}
