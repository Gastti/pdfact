import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Geist, Geist_Mono, Young_Serif } from 'next/font/google'
import { TopLoader } from '@/components/layout/TopLoader'
import './globals.css'

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
})

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
})

const youngSerif = Young_Serif({
	variable: '--font-display',
	subsets: ['latin'],
	weight: '400',
})

export const metadata: Metadata = {
	title: 'Doc Q&A',
	description: 'Hacé preguntas sobre tus documentos PDF usando IA.',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en" className="dark">
			<body
				className={`${geistSans.variable} ${geistMono.variable} ${youngSerif.variable} antialiased`}
			>
				<Suspense>
					<TopLoader />
				</Suspense>
				{children}
			</body>
		</html>
	)
}
