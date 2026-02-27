export default function ChatLoading() {
	return (
		<div className="flex h-full flex-col">
			{/* Header skeleton */}
			<div className="flex items-center gap-3 border-b border-border px-5 py-3">
				<div className="h-7 w-7 animate-pulse rounded-md bg-secondary" />
				<div className="h-4 w-40 animate-pulse rounded-md bg-secondary" />
			</div>

			{/* Empty messages area */}
			<div className="flex flex-1 flex-col items-center justify-center">
				<div className="h-16 w-16 animate-pulse rounded-2xl bg-secondary" />
				<div className="mt-6 h-5 w-48 animate-pulse rounded-md bg-secondary" />
				<div className="mt-3 h-4 w-64 animate-pulse rounded-md bg-secondary/60" />
			</div>

			{/* Input skeleton */}
			<div className="pb-5 pt-3">
				<div className="mx-auto max-w-2xl px-5">
					<div className="h-[76px] animate-pulse rounded-2xl border border-border/40 bg-card" />
				</div>
			</div>
		</div>
	)
}
