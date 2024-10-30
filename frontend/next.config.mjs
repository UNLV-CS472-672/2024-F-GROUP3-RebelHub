
const isProd = process.env.NODE_ENV === 'production';

/** @type {import('next').NextConfig} */
const nextConfig = {
	assetPrefix: isProd ? '' : '',
	basePath: isProd ? '' : '',
	trailingSlash: true,
	output: 'export',
};

export default nextConfig;
