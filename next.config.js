/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['yahoo-finance2'],
  async rewrites() {
    return [
      {
        source: '/',
        destination: '/stratum.html',
      },
    ]
  },
}

module.exports = nextConfig
