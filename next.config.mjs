/** @type {import('next').Config} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.ibb.co', // 💡 ImgBB এর ডোমেইন প্যাটার্ন
      },
    ],
  },
};

export default nextConfig;