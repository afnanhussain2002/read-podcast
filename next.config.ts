const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },
  // Add these new configurations for large file support
  api: {
    bodyParser: {
      sizeLimit: '600mb', // Set to your required size (600MB)
    },
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '600mb', // Optional: For Server Actions if you use them
    },
  },
};

export default nextConfig;