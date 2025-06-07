/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    PORT: process.env.PORT,
  },
  webpack(config) {
    console.log(`[Next.js] Running on PORT: ${process.env.PORT}`);
    return config;
  },
};

export default nextConfig;
