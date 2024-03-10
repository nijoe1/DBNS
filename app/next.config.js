/** @type {import('next').NextConfig} */

module.exports = {
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

  images: {
    // domains: ["gateway.lighthouse.storage"],
    unoptimized: true,
  },

  basePath: "/out",
};