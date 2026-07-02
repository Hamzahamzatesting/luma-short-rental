// Placeholder photography sourced from Unsplash's CDN for local development only.
// Phase 2 replaces these with real listing photography served from Supabase Storage.

// Every ID below was downloaded and visually reviewed to confirm it reads as
// villa/interior/pool/architecture photography — no product shots, portraits,
// or unrelated travel imagery mixed in.
export const IMAGE_POOL = [
  "1600585154340-be6161a56a0c",
  "1613977257363-707ba9348227",
  "1600607687939-ce8a6c25118c",
  "1571003123894-1f0594d2b5d9",
  "1502672260266-1c1ef2d93688",
  "1512917774080-9991f1c4c750",
  "1615874959474-d609969a20ed",
  "1615529182904-14819c35db37",
  "1499793983690-e29da59ef1c2",
  "1600566753086-00f18fb6b3ea",
  "1600566752355-35792bedcfea",
  "1600607687920-4e2a09cf159d",
  "1618221195710-dd6b41faaea6",
  "1544984243-ec57ea16fe25",
  "1539020140153-e479b8c22e70",
  "1600210492486-724fe5c67fb0",
  "1583608205776-bfd35f0d9f83",
  "1512918728675-ed5a9ecdebfd",
  "1505843513577-22bb7d21e455",
  "1571508601891-ca5e7a713859",
  "1576013551627-0cc20b96c2a7",
  "1584622650111-993a426fbf0a",
  "1618219908412-a29a1bb7b86e",
  "1520250497591-112f2f40a3f4",
  "1494203484021-3c454daf695d",
  "1554995207-c18c203602cb",
  "1582719478250-c89cae4dc85b",
  "1522798514-97ceb8c4f1c8",
  "1570214476695-19bd467e6f7a",
] as const;

export function unsplash(id: string, width = 1600, quality = 80) {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&q=${quality}`;
}

/** Deterministic gallery picker so each listing gets a varied, stable set of images. */
export function galleryFor(seed: number, count = 5, width = 1600) {
  const pool = IMAGE_POOL;
  const images: string[] = [];
  for (let i = 0; i < count; i++) {
    const index = (seed * 3 + i) % pool.length;
    images.push(unsplash(pool[index], width));
  }
  return images;
}

export function avatarFor(gender: "men" | "women", seed: number) {
  return `https://randomuser.me/api/portraits/${gender}/${seed % 100}.jpg`;
}
