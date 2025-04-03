/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ["i.pinimg.com"],
    },
    experimental: {
        cache: true,
    },
};

module.exports = nextConfig;


