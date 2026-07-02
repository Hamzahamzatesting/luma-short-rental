import {
  House,
  MapPin,
  Headset,
  Sparkle,
  ShieldCheck,
  Waves,
  Wifi,
  SquareParking,
  Sunrise,
  PawPrint,
  ChefHat,
  Flame,
  Dumbbell,
  Building2,
  BellRing,
  Snowflake,
  type LucideIcon,
} from "lucide-react";

export const ICON_MAP: Record<string, LucideIcon> = {
  House,
  MapPin,
  Headset,
  Sparkle,
  ShieldCheck,
  Waves,
  Wifi,
  SquareParking,
  Sunrise,
  PawPrint,
  ChefHat,
  Flame,
  Dumbbell,
  Building2,
  BellRing,
  Snowflake,
};

export function getIcon(name: string): LucideIcon {
  return ICON_MAP[name] ?? Sparkle;
}
