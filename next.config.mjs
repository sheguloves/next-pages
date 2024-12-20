/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, options) => {
    config.module.rules.push({
      test: /\.pem/,
      use: 'raw-loader',
    });

    return config
  },
  output: 'export',
  images: {
    unoptimized: true
  }
};

if (process.env.GITHUB_PAGE_BASE_PATH) {
  nextConfig.basePath = process.env.GITHUB_PAGE_BASE_PATH;
}

export default nextConfig;
