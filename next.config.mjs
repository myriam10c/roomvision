/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // TODO: Remove once all type errors are resolved
    ignoreBuildErrors: true,
  },
  eslint: {
    // TODO: Remove once all lint errors are resolved
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
};

export default nextConfig;
