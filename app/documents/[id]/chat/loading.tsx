export default function ChatLoading() {
	return (
		<div className="flex h-full flex-col">
			{/* Header skeleton */}
			<div className="flex items-center gap-3 border-b border-border py-3 pl-14 pr-5 md:px-5">
				<div className="h-7 w-7 animate-pulse rounded-md bg-muted" />
				<div className="h-4 w-40 animate-pulse rounded-md bg-muted" />
			</div>

			{/* Messages area */}
			<div className="flex-1 overflow-y-auto py-6">
				<div className="mx-auto flex max-w-2xl flex-col gap-1 px-5">
					{/* Assistant bubble 1 */}
					<div className="py-3">
						<div className="border-l-2 border-[#58a6ff]/25 pl-4">
							<div className="flex flex-col gap-2">
								<div className="h-4 w-3/4 animate-pulse rounded-md bg-muted" />
								<div className="h-4 w-full animate-pulse rounded-md bg-muted" />
								<div className="h-4 w-1/2 animate-pulse rounded-md bg-muted" />
							</div>
						</div>
					</div>

					{/* User bubble 1 */}
					<div className="flex justify-end py-3">
						<div className="h-10 w-48 animate-pulse rounded-2xl rounded-br-md bg-[#58a6ff]/10" />
					</div>

					{/* Assistant bubble 2 */}
					<div className="py-3">
						<div className="border-l-2 border-[#58a6ff]/25 pl-4">
							<div className="flex flex-col gap-2">
								<div className="h-4 w-full animate-pulse rounded-md bg-muted" />
								<div className="h-4 w-2/3 animate-pulse rounded-md bg-muted" />
							</div>
						</div>
					</div>

					{/* User bubble 2 */}
					<div className="flex justify-end py-3">
						<div className="h-10 w-32 animate-pulse rounded-2xl rounded-br-md bg-[#58a6ff]/10" />
					</div>
				</div>
			</div>

			{/* Input skeleton */}
			<div className="bg-background pb-5 pt-3">
				<div className="mx-auto max-w-2xl px-4">
					<div className="flex items-end gap-2 rounded-2xl border border-border/60 bg-card py-2.5 pl-4 pr-2.5">
						<div className="h-[26px] flex-1 animate-pulse rounded-md bg-muted/40" />
						<div className="mb-0.5 h-10 w-10 animate-pulse rounded-xl bg-secondary" />
					</div>
				</div>
			</div>
		</div>
	)
}
