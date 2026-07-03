import type { CancellationPolicy } from "@/lib/data/types";

export interface CancellationTerms {
  refundPercent: number;
  daysUntilCheckIn: number;
  summary: string;
}

/**
 * A listing's cancellationPolicy field previously did nothing — every
 * booking could be cancelled for a full (nominal) refund up until
 * check-in, regardless of what policy was configured. This is what
 * actually differentiates the three tiers, in refund percentage terms.
 * No real payment exists yet, so this is what an admin would honor when
 * issuing a manual refund, not an automatic charge reversal.
 */
export function getCancellationTerms(
  policy: CancellationPolicy | undefined,
  checkIn: string,
  now: Date = new Date()
): CancellationTerms {
  const checkInDate = new Date(`${checkIn}T00:00:00`);
  const daysUntilCheckIn = Math.floor((checkInDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  let refundPercent: number;
  switch (policy ?? "moderate") {
    case "flexible":
      refundPercent = daysUntilCheckIn >= 1 ? 100 : 0;
      break;
    case "strict":
      refundPercent = daysUntilCheckIn >= 7 ? 50 : 0;
      break;
    case "moderate":
    default:
      refundPercent = daysUntilCheckIn >= 5 ? 100 : daysUntilCheckIn >= 1 ? 50 : 0;
      break;
  }

  const summary =
    refundPercent === 100
      ? "Full refund"
      : refundPercent === 0
        ? "No refund"
        : `${refundPercent}% refund`;

  return { refundPercent, daysUntilCheckIn, summary };
}
