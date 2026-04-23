/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow yahoo-finance2 to run in API routes
  serverExternalPackages: ['yahoo-finance2'],
}

module.exports = nextConfig
