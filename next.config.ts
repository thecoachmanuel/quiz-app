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
  if (!ASSETS_URL) {
    throw new Error("ASSETS_URL is not defined");
  }
  const routes = [
    {
      source: "/storage/:path*",
      destination: `${ASSETS_URL}/storage/:path*`,
    },
    {
      source: "/assets/:path*",
      destination: `${ASSETS_URL}/assets/:path*`,
    },
  ];

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
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },

  sassOptions: {
    includePaths: [path.join(DIRNAME, "styles")],
    silenceDeprecations: ["legacy-js-api"],
  },

  rewrites: ASSETS_URL ? buildRewrites() : undefined,

  poweredByHeader: false,
  compress: true,

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "ALLOWALL", // was DENY (must allow iframe for CodeCanyon)
          },
          {
            key: "Content-Security-Policy",
            value:
              "frame-ancestors 'self' https://codecanyon.net https://*.codecanyon.net https://*.envato.com;",
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
