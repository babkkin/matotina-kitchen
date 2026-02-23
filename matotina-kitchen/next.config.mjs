/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "higqawwccgewrusrhlmo.supabase.co",
      },
    ],
  },
};

export default nextConfig;