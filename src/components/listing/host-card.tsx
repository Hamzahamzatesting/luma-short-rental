import Image from "next/image";
import type { Host } from "@/lib/data/types";

interface HostCardProps {
  host: Host;
}

export function HostCard({ host }: HostCardProps) {
  return (
    <div className="flex items-start gap-4 rounded-lg border border-border bg-card p-5">
      <div className="relative size-14 shrink-0 overflow-hidden rounded-full">
        <Image src={host.avatarUrl} alt={host.name} fill className="object-cover" />
      </div>
      <div>
        <p className="font-serif text-lg text-foreground">Hosted by {host.name}</p>
        <p className="text-sm text-muted-foreground">
          {host.responseRate}% response rate &middot; responds {host.responseTime}
        </p>
        <p className="text-sm text-muted-foreground">LUMA host since {host.joinedYear}</p>
        {host.bio && <p className="mt-2 text-sm text-foreground/80">{host.bio}</p>}
      </div>
    </div>
  );
}
