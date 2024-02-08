const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer({
  reactStrictMode: true,
  images: {
    domains: ['s3-us-west-1.amazonaws.com', 'cdn.shopify.com', 'ksr-ugc.imgix.net', 'boardgamesupply.com.au', 'cf.geekdo-images.com', 'lh3.googleusercontent.com'],
  },
  swcMinify: true,
});
