import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "randomuser.me" },
      // Add "<project-ref>.supabase.co" here once listing photography
      // moves into Supabase Storage — not needed while seed data uses Unsplash URLs.
    ],
  },
};

export default nextConfig;
