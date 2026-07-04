import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;

if (process.env.VERCEL !== "1") {
  import('@opennextjs/cloudflare').then(m => m.initOpenNextCloudflareForDev());
}
