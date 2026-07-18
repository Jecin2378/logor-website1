import type { NextConfig } from "next";

/**
 * Logor Website - Next.js Configuration
 *
 * Validates critical environment variables at build time.
 */
function validateBuildEnv() {
  const required = [
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  ];
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.error(
      "\n❌ Build Error: Missing required environment variables:\n" +
        missing.map((key) => `   - ${key}`).join("\n") +
        "\n\nPlease create a .env.local file with these variables.\n" +
        "See .env.example for reference.\n"
    );
    // Don't throw during build — let Next.js handle it gracefully
  }
}

validateBuildEnv();

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  // Enable strict mode for better development experience
  reactStrictMode: true,
};

export default nextConfig;