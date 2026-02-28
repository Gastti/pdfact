import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	devIndicators: false,
	serverExternalPackages: ['pdfjs-dist'],
	experimental: {
		optimizePackageImports: ['lucide-react'],
	},
}

export default nextConfig
