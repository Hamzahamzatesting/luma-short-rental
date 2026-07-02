import { Check, Clock } from "lucide-react";

interface HouseRulesProps {
  rules: string[];
  checkInTime: string;
  checkOutTime: string;
}

export function HouseRules({ rules, checkInTime, checkOutTime }: HouseRulesProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-6 text-sm text-foreground">
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-gold" />
          Check-in after {checkInTime}
        </div>
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-gold" />
          Check-out before {checkOutTime}
        </div>
      </div>
      <ul className="flex flex-col gap-2">
        {rules.map((rule) => (
          <li key={rule} className="flex items-start gap-2 text-sm text-muted-foreground">
            <Check size={15} className="mt-0.5 shrink-0 text-gold" />
            {rule}
          </li>
        ))}
      </ul>
    </div>
  );
}
