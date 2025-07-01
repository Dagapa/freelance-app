import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    // Suprimir warnings de Supabase Realtime
    config.ignoreWarnings = [
      {
        module: /@supabase\/realtime-js/,
      },
    ];

    // Optimizar el bundle
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }

    return config;
  },
  // Optimizaciones adicionales
  experimental: {
    optimizePackageImports: ['@supabase/supabase-js'],
  },
};

export default nextConfig;
