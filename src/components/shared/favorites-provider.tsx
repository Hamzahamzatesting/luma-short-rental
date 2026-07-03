"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { setFavorite } from "@/lib/actions/favorites";

interface FavoritesContextValue {
  favoriteIds: Set<string>;
  isAuthenticated: boolean;
  loaded: boolean;
  toggle: (listingId: string) => void;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const supabase = createClient();
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (cancelled) return;
      if (!user) {
        setLoaded(true);
        return;
      }
      setIsAuthenticated(true);
      const { data } = await supabase.from("favorites").select("listing_id").eq("user_id", user.id);
      if (cancelled) return;
      setFavoriteIds(new Set((data ?? []).map((f) => f.listing_id as string)));
      setLoaded(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  function toggle(listingId: string) {
    if (!loaded) return;
    if (!isAuthenticated) {
      router.push(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    const wasFavorited = favoriteIds.has(listingId);
    setFavoriteIds((prev) => {
      const next = new Set(prev);
      if (wasFavorited) next.delete(listingId);
      else next.add(listingId);
      return next;
    });

    setFavorite(listingId, !wasFavorited).then((result) => {
      if ("error" in result) {
        toast.error(result.error);
        setFavoriteIds((prev) => {
          const reverted = new Set(prev);
          if (wasFavorited) reverted.add(listingId);
          else reverted.delete(listingId);
          return reverted;
        });
      }
    });
  }

  return (
    <FavoritesContext.Provider value={{ favoriteIds, isAuthenticated, loaded, toggle }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used within a FavoritesProvider");
  return ctx;
}
