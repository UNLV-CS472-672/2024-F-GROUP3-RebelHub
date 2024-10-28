
const isProd = process.env.NODE_ENV === 'production';

/** @type {import('next').NextConfig} */
const nextConfig = {
	assetPrefix: isProd ? '' : '',
	basePath: isProd ? '' : '',
	trailingSlash: true,
	output: 'export',
	images: { unoptimized: true }
};

export default nextConfig;
