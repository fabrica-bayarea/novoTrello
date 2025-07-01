import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  poweredByHeader: false,
  async headers() {
    const cspHeader = `
      default-src 'self';
      script-src 'self';
      style-src 'self' https://fonts.googleapis.com;
      img-src 'self' data:;
      font-src 'self' https://fonts.gstatic.com https://fonts.googleapis.com;
      connect-src 'self';
      frame-ancestors 'self';
      upgrade-insecure-requests;
      form-action 'self';
      base-uri 'self';
      object-src 'none';
    `.replace(/\s{2,}/g, ' ').trim();

    return [
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: cspHeader,
          },
        ],
      },
    ];
  },
};

export default nextConfig;