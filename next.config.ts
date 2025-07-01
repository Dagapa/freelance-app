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
        punycode: false,
      };
    }

    return config;
  },
  // Optimizaciones adicionales
  experimental: {
    optimizePackageImports: ['@supabase/supabase-js'],
  },
  // Suprimir warnings de Node.js
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  // Configuración para suprimir warnings de punycode
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
};

export default nextConfig;
