import type { Money } from "@/lib/data/types";
import { cn } from "@/lib/utils";

const CURRENCY_SYMBOL: Record<Money["currency"], string> = {
  MAD: "MAD",
  EUR: "€",
  USD: "$",
};

interface PriceTagProps {
  price: Money;
  suffix?: string;
  className?: string;
}

export function PriceTag({ price, suffix = "/ night", className }: PriceTagProps) {
  const symbol = CURRENCY_SYMBOL[price.currency];
  const isPrefix = symbol !== "MAD";
  return (
    <span className={cn("font-medium", className)}>
      {isPrefix ? symbol : ""}
      {price.amount.toLocaleString("en-US")}
      {!isPrefix ? ` ${symbol}` : ""}
      {suffix && <span className="text-muted-foreground font-normal"> {suffix}</span>}
    </span>
  );
}
