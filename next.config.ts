// next.config.ts
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'res.cloudinary.com',      // your own uploads
      'lh3.googleusercontent.com' // ✅ Google's profile images
    ],
  },
};

export default nextConfig;
