import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/dhkxu4caj/image/upload/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/dvh0sa9jp/image/upload/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**", // allows any image path from Unsplash
      },
    ],
  },
};

export default nextConfig;
