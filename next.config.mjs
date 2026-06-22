/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.ibb.co', // ImgBB এর ছবির ডোমেইন
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;