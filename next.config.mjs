/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export", // ✅ this replaces `next export`
  images: {
    unoptimized: true, // ✅ required for static builds
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
