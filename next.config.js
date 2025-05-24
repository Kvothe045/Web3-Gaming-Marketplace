const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
  },
  webpack: (config) => {
    // Add alias so '@' resolves to project root (same as "./")
    config.resolve.alias["@"] = path.resolve(__dirname);

    // Return the modified config
    return config;
  },
}

let userConfig
try {
  userConfig = require('./v0-user-next.config')
} catch (e) {
  // ignore error
}

if (userConfig) {
  mergeConfig(nextConfig, userConfig)
}

function mergeConfig(nextConfig, userConfig) {
  for (const key in userConfig) {
    if (
      typeof nextConfig[key] === 'object' &&
      !Array.isArray(nextConfig[key])
    ) {
      nextConfig[key] = {
        ...nextConfig[key],
        ...userConfig[key],
      }
    } else {
      nextConfig[key] = userConfig[key]
    }
  }
}

module.exports = nextConfig
