/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env: {
    alchemyAPI: 'hW0hZsf-0MZNu7VtmJ33sMXAhD8Wo3NB',
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'w3s.link',
        port: '',
        pathname: '/ipfs/**',
      },
    ],
  },
}

module.exports = nextConfig
