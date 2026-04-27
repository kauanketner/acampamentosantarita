import type { NextConfig } from 'next';

const config: NextConfig = {
  transpilePackages: ['@santarita/ui', '@santarita/shared'],
  images: {
    remotePatterns: [
      // TODO: adicionar domínio do R2 quando configurado
      { protocol: 'https', hostname: '**.r2.cloudflarestorage.com' },
    ],
  },
};

export default config;
