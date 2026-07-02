"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import type { Listing } from "@/lib/data/types";

interface LiveMapInnerProps {
  listings: Listing[];
}

// Morocco-wide fallback view when there are no listings to fit bounds to.
const DEFAULT_CENTER: [number, number] = [31.6, -7.5];
const DEFAULT_ZOOM = 6;

const PILL_BASE =
  "inline-block whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-medium shadow-md transition-all";
const PILL_DEFAULT = "border-ivory/20 bg-midnight text-ivory";
const PILL_ACTIVE = "z-10 scale-110 border-gold bg-gold text-midnight";

function markerIcon(price: number, active: boolean) {
  return L.divIcon({
    className: "!bg-transparent !border-0",
    html: `<span style="transform:translate(-50%,-50%);position:absolute" class="${PILL_BASE} ${active ? PILL_ACTIVE : PILL_DEFAULT}">${price.toLocaleString()}</span>`,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });
}

/** Keeps the viewport fit to whatever listings are currently passed in — including after filtering or a newly published property arriving in the list. */
function FitToListings({ listings }: { listings: Listing[] }) {
  const map = useMap();

  useEffect(() => {
    if (listings.length === 0) {
      map.setView(DEFAULT_CENTER, DEFAULT_ZOOM);
      return;
    }
    const bounds = L.latLngBounds(
      listings.map((l) => [l.location.lat, l.location.lng] as [number, number])
    );
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 13 });
  }, [listings, map]);

  return null;
}

/** Leaflet doesn't know its container resized (sticky panel, bottom sheet opening, etc.) unless told. */
function InvalidateOnResize() {
  const map = useMap();

  useEffect(() => {
    const container = map.getContainer();
    const observer = new ResizeObserver(() => map.invalidateSize());
    observer.observe(container);
    return () => observer.disconnect();
  }, [map]);

  return null;
}

export function LiveMapInner({ listings }: LiveMapInnerProps) {
  const router = useRouter();
  const [activeId, setActiveId] = useState<string | null>(null);

  const icons = useMemo(
    () =>
      new Map(
        listings.map((l) => [
          l.id,
          { default: markerIcon(l.pricePerNight.amount, false), active: markerIcon(l.pricePerNight.amount, true) },
        ])
      ),
    [listings]
  );

  return (
    <MapContainer
      center={DEFAULT_CENTER}
      zoom={DEFAULT_ZOOM}
      className="size-full"
      zoomControl={true}
      scrollWheelZoom
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        subdomains="abcd"
        maxZoom={19}
      />
      <FitToListings listings={listings} />
      <InvalidateOnResize />
      {listings.map((listing) => {
        const iconSet = icons.get(listing.id);
        if (!iconSet) return null;
        return (
          <Marker
            key={listing.id}
            position={[listing.location.lat, listing.location.lng]}
            icon={activeId === listing.id ? iconSet.active : iconSet.default}
            eventHandlers={{
              mouseover: () => setActiveId(listing.id),
              mouseout: () => setActiveId(null),
              click: () => router.push(`/listing/${listing.slug}`),
            }}
          />
        );
      })}
    </MapContainer>
  );
}
