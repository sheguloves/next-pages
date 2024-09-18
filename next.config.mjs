/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
};

if (process.env.GITHUB_BASE_PATH) {
  nextConfig.basePath = process.env.GITHUB_BASE_PATH;
}

export default nextConfig;
