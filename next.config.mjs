/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Prevent fabric and canvas from being included in the server bundle
      config.externals.push({
        fabric: "commonjs fabric",
        canvas: "commonjs canvas",
      });
    }
    return config;
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "liveblocks.io",
        port: "",
      },
    ],
  },

  typescript: {
    ignoreBuildErrors: true, // Temporarily ignore build errors until resolved
  },
};

export default nextConfig;
