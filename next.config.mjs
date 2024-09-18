/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true
  }
};

if (process.env.GITHUB_PAGE_BASE_PATH) {
  nextConfig.basePath = process.env.GITHUB_PAGE_BASE_PATH;
}

console.log(nextConfig);

export default nextConfig;
