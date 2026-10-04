/**
 * @format
 * @type {import('next').NextConfig}
 */

import { ASSETS_URL } from "@/configs";
import { parseServerUrl } from "@/utils/helper";
import { NextConfig } from "next";
import { RemotePattern } from "next/dist/shared/lib/image-config";
import path from "path";
import { fileURLToPath } from "url";

// Constants
const DIRNAME: string = path.dirname(fileURLToPath(import.meta.url));

// Trusted image domains configuration
const TRUSTED_IMAGE_DOMAINS: string[] = [
  ASSETS_URL,
  "https://eu.ui-avatars.com/",
  "https://ui-avatars.com/",
  "https://images.unsplash.com/",
  "https://via.placeholder.com/",
];

// Configuration builders
const buildRemotePatterns = (urls: string[]): RemotePattern[] => {
  try {
    return urls.map((url) => {
      const { protocol, hostname, port, prefix } = parseServerUrl(url);

      // Ensure valid protocol
      if (protocol !== "http" && protocol !== "https") {
        throw new Error(`Invalid protocol '${protocol}' in URL: ${url}`);
      }

      return {
        protocol, // must be "http" or "https"
        hostname,
        port: port || undefined,
        pathname: prefix || "/**", // optional, default fallback pattern
      };
    });
  } catch (error: any) {
    console.error("Error building remote patterns:", error);
    throw new Error(`Failed to build remote patterns: ${error.message}`);
  }
};

const buildRewrites = () => {
  // Only rewrite /storage if an external storage URL is configured and different from local app
  const routes = [];
  if (process.env.NEXT_PUBLIC_STORAGE_URL) {
    routes.push({
      source: "/storage/:path*",
      destination: `${process.env.NEXT_PUBLIC_STORAGE_URL}/storage/:path*`,
    });
  }
  return async () => routes;
};

// Main configuration
const nextConfig: NextConfig = {
  reactStrictMode: true,

  turbopack: {
    resolveExtensions: [".mdx", ".tsx", ".ts", ".jsx", ".js", ".mjs", ".json"],
  },

  images: {
    unoptimized: true,
    dangerouslyAllowSVG: true,
    remotePatterns: buildRemotePatterns(TRUSTED_IMAGE_DOMAINS),
    minimumCacheTTL: 86400,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },

  sassOptions: {
    includePaths: [path.join(DIRNAME, "styles")],
    silenceDeprecations: ["legacy-js-api"],
  },

  rewrites: process.env.NEXT_PUBLIC_STORAGE_URL ? buildRewrites() : undefined,

  poweredByHeader: false,
  compress: true,

  async headers() {
    return [
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/assets/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
      {
        source: "/fonts/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors 'self';",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
        ],
      },
    ];
  },

  ...(process.env.NODE_ENV === "production" && {
    productionBrowserSourceMaps: false,
  }),
};

// Final validation
const validateConfig = (config: NextConfig) => {
  if (!config?.images?.remotePatterns?.length) {
    throw new Error("Remote patterns configuration is required");
  }
  return config;
};

export default validateConfig(nextConfig);
