/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['res.cloudinary.com', 'images.unsplash.com'],
    unoptimized: true, // Use unoptimized images for local dev (no external image files yet)
  },
}

module.exports = nextConfig
