'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

export function TopLoader() {
	const pathname = usePathname()
	const searchParams = useSearchParams()
	const [state, setState] = useState<'idle' | 'loading' | 'completing'>('idle')
	const prevUrl = useRef(pathname + searchParams.toString())

	const complete = useCallback(() => {
		setState('completing')
		const timer = setTimeout(() => setState('idle'), 300)
		return () => clearTimeout(timer)
	}, [])

	useEffect(() => {
		const currentUrl = pathname + searchParams.toString()
		if (prevUrl.current !== currentUrl) {
			prevUrl.current = currentUrl
			setState('loading')
			const cleanup = complete()
			return cleanup
		}
	}, [pathname, searchParams, complete])

	if (state === 'idle') return null

	return (
		<div className="fixed inset-x-0 top-0 z-[9999] h-[2px]">
			<div
				className={
					state === 'loading'
						? 'h-full bg-[#58a6ff] shadow-[0_0_8px_rgba(88,166,255,0.4)] animate-toploader-progress'
						: 'h-full bg-[#58a6ff] shadow-[0_0_8px_rgba(88,166,255,0.4)] animate-toploader-complete'
				}
			/>
		</div>
	)
}
