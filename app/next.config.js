/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true,

  webpack: (config) => {
    config.resolve = {
      ...config.resolve,
      fallback: {
        fs: false,
        net: false,
        tls: false,
      },
    };
    return config;
  },
};
module.exports = {
  nextConfig,
  images: {
    domains: ["gateway.lighthouse.storage"],
  },
  outDir: "./out",
};
