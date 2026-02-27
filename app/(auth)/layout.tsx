import Link from 'next/link'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="grid min-h-screen lg:grid-cols-2">
			{/* Left panel — decorative */}
			<div className="relative hidden overflow-hidden border-r border-border bg-card lg:flex lg:flex-col lg:justify-between">
				{/* Background gradient */}
				<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(88,166,255,0.08)_0%,_transparent_60%)]" />
				<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(188,140,255,0.06)_0%,_transparent_60%)]" />

				{/* Floating document shapes */}
				<div className="absolute inset-0" aria-hidden="true">
					{/* Document 1 — large, back */}
					<div
						className="animate-float-slower absolute left-[15%] top-[20%] h-48 w-36 rounded-lg border border-border/40 bg-secondary/30 shadow-2xl backdrop-blur-sm"
						style={
							{
								'--float-rotate': '-3deg',
								animationDelay: '0s',
							} as React.CSSProperties
						}
					>
						<div className="p-4 pt-5">
							<div className="mb-3 h-2 w-3/4 rounded-full bg-muted-foreground/15" />
							<div className="mb-2 h-1.5 w-full rounded-full bg-muted-foreground/10" />
							<div className="mb-2 h-1.5 w-5/6 rounded-full bg-muted-foreground/10" />
							<div className="mb-2 h-1.5 w-full rounded-full bg-muted-foreground/10" />
							<div className="mb-4 h-1.5 w-2/3 rounded-full bg-muted-foreground/10" />
							<div className="mb-2 h-1.5 w-full rounded-full bg-muted-foreground/10" />
							<div className="mb-2 h-1.5 w-4/5 rounded-full bg-muted-foreground/10" />
							<div className="h-1.5 w-full rounded-full bg-muted-foreground/10" />
						</div>
					</div>

					{/* Document 2 — medium, front */}
					<div
						className="animate-float-slow absolute left-[30%] top-[35%] h-52 w-40 rounded-lg border border-border/50 bg-card shadow-2xl"
						style={
							{
								'--float-rotate': '2deg',
								animationDelay: '-2s',
							} as React.CSSProperties
						}
					>
						<div className="p-4 pt-5">
							<div className="mb-3 h-2.5 w-2/3 rounded-full bg-[#58a6ff]/20" />
							<div className="mb-2 h-1.5 w-full rounded-full bg-muted-foreground/12" />
							<div className="mb-2 h-1.5 w-full rounded-full bg-muted-foreground/12" />
							<div className="mb-2 h-1.5 w-3/4 rounded-full bg-muted-foreground/12" />
							<div className="mb-4 h-1.5 w-full rounded-full bg-muted-foreground/12" />
							<div className="mb-2 h-1.5 w-5/6 rounded-full bg-muted-foreground/12" />
							<div className="mb-2 h-1.5 w-full rounded-full bg-muted-foreground/12" />
							<div className="mb-2 h-1.5 w-2/3 rounded-full bg-muted-foreground/12" />
							<div className="mb-2 h-1.5 w-full rounded-full bg-muted-foreground/12" />
							<div className="h-1.5 w-4/5 rounded-full bg-muted-foreground/12" />
						</div>
					</div>

					{/* Document 3 — small, accent */}
					<div
						className="animate-float-slow absolute right-[18%] top-[28%] h-32 w-24 rounded-md border border-[#58a6ff]/20 bg-[#58a6ff]/5 shadow-xl"
						style={
							{
								'--float-rotate': '5deg',
								animationDelay: '-4s',
							} as React.CSSProperties
						}
					>
						<div className="p-3 pt-4">
							<div className="mb-2 h-1.5 w-full rounded-full bg-[#58a6ff]/15" />
							<div className="mb-2 h-1.5 w-3/4 rounded-full bg-[#58a6ff]/10" />
							<div className="mb-2 h-1.5 w-full rounded-full bg-[#58a6ff]/10" />
							<div className="h-1.5 w-1/2 rounded-full bg-[#58a6ff]/10" />
						</div>
					</div>

					{/* Cursor / highlight element */}
					<div
						className="animate-float-slower absolute left-[45%] top-[55%] flex items-center gap-2 rounded-full border border-border/60 bg-card/80 px-4 py-2 shadow-lg backdrop-blur-sm"
						style={
							{
								'--float-rotate': '0deg',
								animationDelay: '-1s',
							} as React.CSSProperties
						}
					>
						<div className="h-2 w-2 rounded-full bg-[#58a6ff]" />
						<div className="h-1.5 w-20 rounded-full bg-muted-foreground/20" />
					</div>
				</div>

				{/* Content */}
				<div className="relative z-10 p-10 pt-12">
					<Link href="/" className="flex items-center gap-2.5">
						<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#58a6ff]/10 text-[#58a6ff]">
							<svg
								width="16"
								height="16"
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
						<span className="text-sm font-medium tracking-tight text-foreground">
							Doc Q&A
						</span>
					</Link>
				</div>

				<div className="relative z-10 p-10 pb-12">
					<blockquote className="space-y-4">
						<p className="font-display text-[2rem] leading-[1.15] text-foreground/90">
							Preguntale a tus documentos.
						</p>
						<p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
							Subí un PDF y empezá a hacerle preguntas. La IA analiza el contenido y te
							responde al instante.
						</p>
					</blockquote>
				</div>
			</div>

			{/* Right panel — form */}
			<div className="flex flex-col">
				{/* Mobile header */}
				<div className="flex items-center gap-2.5 p-6 lg:hidden">
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
						</svg>
					</div>
					<span className="text-sm font-medium tracking-tight">Doc Q&A</span>
				</div>

				<div className="flex flex-1 items-center justify-center px-6 py-10 lg:px-10">
					<div className="w-full max-w-[380px]">{children}</div>
				</div>
			</div>
		</div>
	)
}
