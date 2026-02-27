import Link from 'next/link'

export function AppHeader() {
	return (
		<header className="flex h-14 shrink-0 items-center border-b border-border bg-background px-6">
			<Link href="/new" className="flex items-center gap-2.5">
				<div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#58a6ff]/10 text-[#58a6ff]">
					<svg
						width="14"
						height="14"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
						<path d="M14 2v4a2 2 0 0 0 2 2h4" />
						<path d="M10 12h4" />
						<path d="M10 16h4" />
					</svg>
				</div>
				<span className="text-sm font-medium tracking-tight">Doc Q&A</span>
			</Link>
		</header>
	)
}
