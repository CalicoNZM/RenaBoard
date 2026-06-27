import type { NextConfig } from "next";

/**
 * Next.js configuration for RenaBoard.
 *
 * - Enables Server Actions (experimental) which we use for creating accounts and saving board state.
 * - Enables strict mode for better diagnostics.
 * - Sets the output to "standalone" so Vercel can bundle the app without requiring a separate node_modules.
 */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "standalone",
};

export default nextConfig;
