import type { NextConfig } from "next";
import { createMDX } from 'fumadocs-mdx/next';
import path from "path";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  turbopack: {
    root: path.join(__dirname, "."),
  },
  devIndicators: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
    ],
  },
  async rewrites() {
    return [
            {
        source: "/blog/:slug.mdx",
        destination: "/blog.mdx/:slug",
      },
      {
        source: "/components/:slug.mdx",
        destination: "/blog.mdx/:slug",
      },
      {
        source: "/rss",
        destination: "/blog/rss",
      },
    ]}
};

const withMDX = createMDX();

export default withMDX(nextConfig);
