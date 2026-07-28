import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    // cacheComponents: true, flag changed to this in newer versions
    dynamicIO: true,
  },
};

export default nextConfig;
